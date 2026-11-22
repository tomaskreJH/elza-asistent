# Test portálu v ukázkovém režimu: moduly Dokumenty a Postupy. Spuštění: python3 test/portal-demo.py
import http.server,threading,functools,os
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Q,directory=ROOT));threading.Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None);pg=b.new_page();err=[]
    pg.on("pageerror",lambda e:err.append(str(e)));pg.on("console",lambda m:m.type=="error" and err.append(m.text))
    pg.goto(f"http://127.0.0.1:{srv.server_port}/portal.html?demo=1");pg.wait_for_timeout(800)
    for v,txt in [("dokumenty","Předávací balíček"),("kontroly","Hromosvod"),("pomoc","Připravit e-mail"),("prehled","nevyhovující výsledek"),("kontroly","Požádat o nabídku"),("postupy","Jak probíhá zakázka"),("prehled","Aktivní zakázky")]:
        pg.click(f"nav [data-v={v}]");pg.wait_for_timeout(200);assert txt in pg.inner_text("#main"),v
    b.close()
print(err);assert not err;print("portal OK")
