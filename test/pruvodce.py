# Test Průvodce (pruvodce.html): všechny slidy se zobrazí bez chyby JS a bez porušení CSP, simulace dat doběhne a AI nic nezapíše, plán fází na dotek se přepočítává.
# Spuštění z kořene repozitáře: python3 test/pruvodce.py
import http.server, threading, functools, os, sys
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Q,directory=ROOT))
threading.Thread(target=srv.serve_forever,daemon=True).start()
URL=f"http://127.0.0.1:{srv.server_port}/pruvodce.html"
bad=[]
with sync_playwright() as p:
    for w,h in((1280,800),(390,800)):
        b=p.chromium.launch(executable_path="/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None)
        pg=b.new_page(viewport={"width":w,"height":h})
        pg.on("pageerror",lambda e:bad.append("JS: "+str(e)))
        pg.on("console",lambda m:m.type=="error" and bad.append("console: "+m.text))
        pg.goto(URL);pg.wait_for_timeout(500)
        n=pg.evaluate("document.querySelectorAll('.sl').length")
        if n!=14: bad.append(f"slidů {n}, čekáno 14")
        for k in range(n):
            pg.evaluate(f"go({k})");pg.wait_for_timeout(300)
            if not pg.evaluate("document.querySelector('.sl.on')"): bad.append(f"slide {k} se nezobrazil")
            if k==7:
                for _ in range(16): pg.click("#sst");pg.wait_for_timeout(60)
                steps=pg.evaluate("document.querySelectorAll('#slog .st').length")
                if steps!=16: bad.append(f"simulace {steps} kroků, čekáno 16")
                pg.wait_for_timeout(1800)
                if "AI sama: 0" not in pg.inner_text("#ssum").replace("\n"," ") and "sama: 0" not in pg.inner_text("#ssum"): bad.append("souhrn simulace neukazuje 0 zápisů AI")
                if w>800: pg.screenshot(path="/tmp/pv-sim.png")
            if k==11:
                pg.fill("#rh","900");pg.dispatch_event("#rh","input");a=pg.inner_text("#kh")
                pg.fill("#rh","100");pg.dispatch_event("#rh","input");c=pg.inner_text("#kh")
                if a==c: bad.append("plán fází se nepřepočítal")
                pg.check("#cq");pg.dispatch_event("#cq","change")
                if not pg.inner_text("#wn"): bad.append("chybí varování při volnu")
                if w>800: pg.screenshot(path="/tmp/pv-plan.png")
        b.close()
print("\n".join(bad) if bad else "pruvodce OK")
sys.exit(1 if bad else 0)
