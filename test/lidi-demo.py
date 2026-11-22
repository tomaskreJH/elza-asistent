# Test modulu Lidé a školení v ukázkovém režimu: záložky, matice, hlídač, kandidáti. Spuštění: python3 test/lidi-demo.py
import http.server, threading, functools, os
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Q,directory=ROOT));threading.Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None);pg=b.new_page();err=[]
    pg.on("pageerror",lambda e:err.append(str(e)));pg.on("console",lambda m:m.type=="error" and err.append(m.text))
    pg.goto(f"http://127.0.0.1:{srv.server_port}/index.html?demo=1");pg.wait_for_timeout(1200)
    pg.evaluate("go('lidi')");pg.wait_for_timeout(600);t=pg.inner_text("#main");print(t[:300]);assert "EPS" in t and "Jan Novák" in t
    pg.click("[data-w=skol]");pg.wait_for_timeout(500);t=pg.inner_text("#main");print(t[:200],err);assert "Hlídač platnosti" in t and "prošlé" in t
    pg.click("[data-w=obs]");pg.wait_for_timeout(500);pg.select_option("#ot","EPS");pg.wait_for_timeout(400)
    pg.fill("#ok","Z-2026-001");pg.check("[data-r=EPS-ESSER]");pg.click("[data-a=kand]");pg.wait_for_timeout(500)
    t=pg.inner_text("#main");assert "Kandidáti pro Z-2026-001" in t and "Jan Novák" in t
    pg.click("[data-a=prid]");pg.wait_for_timeout(300);assert "vedoucího akce" in pg.inner_text("#ldm")
    b.close()
print("chyby:",err);assert not err;print("lidi OK")
