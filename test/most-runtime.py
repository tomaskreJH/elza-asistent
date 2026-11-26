"""Izolovaná zkouška ELZA mostu 3 ve Windows PowerShellu bez předplatného a firemních dat."""
import concurrent.futures
import json
import os
from pathlib import Path
import secrets
import socket
import subprocess
import sys
import tempfile
import time
from urllib.error import HTTPError
from urllib.request import ProxyHandler, Request, build_opener


def free_port():
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def until(get, accept, timeout=10):
    deadline = time.monotonic() + timeout
    last = None
    while time.monotonic() < deadline:
        try:
            value = get()
            last = value
            if accept(value):
                return value
        except OSError as error:
            last = str(error)
        time.sleep(0.08)
    raise AssertionError(f"Most nevrátil očekávaný stav včas: {last!r}")


def run():
    root = Path(__file__).resolve().parents[1]
    origin = "https://tomaskrejh.github.io"
    token = secrets.token_urlsafe(32)
    port = free_port()
    with tempfile.TemporaryDirectory(prefix="elza-most-test-") as directory:
        home = Path(directory)
        state = home / "ElzaMost"
        state.mkdir()
        (state / "token").write_text(token, encoding="ascii")
        (state / "fronta.json").write_text(
            json.dumps([{"id": "prerusena", "stav": "bezi", "konec": "", "chyba": ""}]),
            encoding="utf-8",
        )
        bridge = home / "most.ps1"
        source = (root / "tools/elza-most.ps1").read_text(encoding="utf-8-sig")
        source = source.replace("$Port = 47321", f"$Port = {port}")
        source = source.replace(r"Local\ElzaMost", rf"Local\ElzaMostTest{port}")
        # Nahrazuje pouze poskytovatele a jejich objevení. HTTP a fronta běží beze změny.
        for first, last, replacement in (
            ("$Cl = ", "$Cx = NajdiCodex", "$Cl = $null; $Cx = $null"),
            ("function Diagnostika(){", "# V obou runspacech", "function Diagnostika(){ @{ollama=@(); limity=@{ok=$false}} }"),
        ):
            start = source.index(first)
            end = source.index(last, start) + (len(last) if last.startswith("$Cx") else 0)
            source = source[:start] + replacement + "\n" + source[end:]
        source = source.replace("function ZavolejClaude(", "function ZavolejClaudeOstry(", 1)
        mock = r'''
function ZavolejClaude($model, $system, $prompt){
  $pr = Join-Path $env:LOCALAPPDATA 'ElzaMost'
  $py = $env:ELZA_TEST_PYTHON
  $pomalu = 'import sys,time; time.sleep(6); sys.stdout.write(sys.stdin.buffer.read().decode("utf-8"))'
  $rychle = 'import json,sys; print(json.dumps([sys.argv[1],sys.stdin.buffer.read().decode("utf-8")]))'
  $kod = if ($model -eq 'timeout') { $pomalu } else { $rychle }
  $limit = if ($model -eq 'timeout') { 2 } else { 10 }
  $x = SpustModel $py @('-X','utf8','-c',$kod,$system) $prompt $pr $limit
  if ($x.timeout) { return @{ok=$false; http=504; chyba='test limit'} }
  if ($x.kod -ne 0) { throw ('test proces: ' + $x.chyby) }
  return @{ok=$true; text=($x.vystup.Trim())}
}
'''
        source = source.replace("function Diagnostika(){", mock + "\nfunction Diagnostika(){", 1)
        bridge.write_text(source, encoding="utf-8-sig")
        env = dict(os.environ, LOCALAPPDATA=directory, ELZA_TEST_PYTHON=sys.executable)

        http = build_opener(ProxyHandler({}))

        def request(path, body=None, supplied_token=token, supplied_origin=origin):
            headers = {"Origin": supplied_origin}
            if supplied_token:
                headers["x-elza-kod"] = supplied_token
            data = None
            if body is not None:
                headers["Content-Type"] = "application/json"
                data = json.dumps(body).encode("utf-8")
            req = Request(f"http://127.0.0.1:{port}{path}", data=data, headers=headers)
            try:
                with http.open(req, timeout=5) as result:
                    return result.status, json.load(result)
            except HTTPError as error:
                return error.code, json.load(error)

        with (home / "process.txt").open("w+", encoding="utf-8") as logfile:
            process = subprocess.Popen(
                ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "RemoteSigned", "-File", str(bridge)],
                env=env, stdout=logfile, stderr=subprocess.STDOUT, creationflags=subprocess.CREATE_NO_WINDOW,
            )
            try:
                until(lambda: request("/stav"), lambda reply: reply[0] == 200)
                assert request("/stav", supplied_token=None)[0] == 401
                assert request("/stav", supplied_origin="https://example.com")[0] == 403
                assert request("/stav", supplied_token="neplatny")[0] == 401
                assert request("/limity")[1]["ok"] is False
                assert request("/fronta/vysledky")[1]["vysledky"][0]["stav"] == "chyba"
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    delayed = pool.submit(request, "/claude", {"model": "timeout", "prompt": "test"})
                    start = time.monotonic()
                    status, response = until(lambda: request("/stav"), lambda reply: reply[1]["pracuje"])
                    assert status == 200 and response["most"] == 3
                    assert time.monotonic() - start < 1.5
                    assert request("/claude", {"prompt": "test"})[0] == 409
                    assert delayed.result()[0] == 504
                assert request("/stav")[1]["pracuje"] is False
                text = 'Příliš žluťoučký kůň. "uvozovky" a mezera \\'
                job = {"model": "test", "system": text, "prompt": text}
                status, response = request("/claude", job)
                assert status == 200, response
                assert json.loads(response["text"]) == [text, text]
                assert request("/fronta", {"ted": True, "ulohy": [dict(job, id="noc")]})[1]["pridano"] == 1
                status, response = until(
                    lambda: request("/fronta/vysledky"),
                    lambda reply: any(row["id"] == "noc" for row in reply[1]["vysledky"]),
                )
                assert status == 200
                result = next(row for row in response["vysledky"] if row["id"] == "noc")
                assert result["stav"] == "hotovo", result
                assert json.loads(result["text"]) == [text, text]
                assert request("/fronta/potvrdit", {"ids": ["noc"]})[0] == 200
            except Exception:
                logfile.seek(0)
                print(logfile.read(), file=sys.stderr)
                log = state / "elza-most.log"
                if log.exists():
                    print(log.read_text(encoding="utf-8-sig", errors="replace"), file=sys.stderr)
                raise
            finally:
                process.terminate()
                process.wait(timeout=5)
    print("OK: stav při čekání, 401/403/409/504, UTF-8, fronta a obnova po restartu.")


if __name__ == "__main__":
    run()
