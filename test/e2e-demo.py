# Kompletní průchod aplikací v ukázkovém režimu (bez přihlášení, vymyšlená data).
# Spuštění z kořene repozitáře: python3 test/e2e-demo.py
# Ověří: každá položka menu se otevře bez chyby JS a bez porušení CSP, na PC i na mobilu (390 px),
# stable i beta kanál, a že se nic nepokouší odeslat poštu.
import http.server, threading, functools, sys, os, re, json
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
H = functools.partial(Q, directory=ROOT)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H)
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f"http://127.0.0.1:{srv.server_port}/index.html?demo=1"
bad = []

def run(p, w, h, kanal):
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None)
    pg = b.new_page(viewport={"width": w, "height": h})
    errs = []
    pg.on("pageerror", lambda e: errs.append("JS: " + str(e)))
    pg.on("console", lambda m: m.type == "error" and errs.append("console: " + m.text))
    def req(r):
        if "/send" in r.url or "sendMail" in r.url: errs.append("ODESLÁNÍ: " + r.url)
    pg.on("request", req)
    pg.add_init_script(f"try{{localStorage.setItem('elzaKanal','{kanal}')}}catch(e){{}}")
    pg.goto(URL); pg.wait_for_timeout(1500)
    ids = pg.evaluate("""()=>{var o=[];(typeof MENU!='undefined'?MENU:[]).forEach(g=>g[1].forEach(i=>{if(i[0][0]!='-')o.push(i[0])}));return o}""")
    if not ids:
        ids = pg.evaluate("()=>[...new Set([...document.querySelectorAll('[data-v]')].map(e=>e.dataset.v).filter(v=>v[0]!='_'))]")
    for i in ids:
        n0 = len(errs)
        pg.evaluate(f"()=>window.go?go({json.dumps(i)}):0")
        pg.wait_for_timeout(350)
        txt = pg.inner_text("#main")[:200]
        if re.search(r"Chyba:|is not defined|undefined is not", txt): errs.append(f"{i}: {txt[:120]}")
        if w < 500:
            ov = pg.evaluate("()=>document.documentElement.scrollWidth-window.innerWidth")
            if ov > 8: errs.append(f"{i}: přetéká o {ov} px na šířce {w}")
        for e in errs[n0:]: bad.append(f"[{kanal} {w}px] {i}: {e}")
    print(f"{kanal} {w}px: {len(ids)} položek menu, chyb {len([e for e in bad if e.startswith('['+kanal+' '+str(w))])}")
    b.close()

with sync_playwright() as p:
    for k in ("stable", "beta"):
        run(p, 1400, 900, k)
        run(p, 390, 844, k)
srv.shutdown()
if bad:
    print("\n".join(bad[:60])); sys.exit(1)
print("e2e demo OK")
