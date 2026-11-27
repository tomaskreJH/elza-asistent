# Test skici budovy 0.86.0: v prohlížeči vznikne z fotky PNG kresba (bílý papír, tmavý obrys), modul se načte přes boot.js bez chyb.
import http.server, threading, functools, os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
B = f"http://127.0.0.1:{srv.server_port}/index.html?demo=1"
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(B); pg.wait_for_timeout(2500)
    r = pg.evaluate("""async()=>{if(!window.SKICA)return{err:'SKICA chybí'};
      const c=document.createElement('canvas');c.width=1600;c.height=1000;const x=c.getContext('2d');x.fillStyle='#ddd';x.fillRect(0,0,1600,1000);x.fillStyle='#222';x.fillRect(500,300,600,450);
      const bl=await new Promise(r=>c.toBlob(r,'image/png'));const u=await SKICA.vykresli(bl);
      const im=new Image();im.src=u;await im.decode();const k=document.createElement('canvas');k.width=im.width;k.height=im.height;const y=k.getContext('2d');y.drawImage(im,0,0);
      const d=y.getImageData(0,0,im.width,im.height).data;let tm=0,bi=0;for(let i=0;i<d.length;i+=4){if(d[i]<150)tm++;else if(d[i]>240)bi++}
      return{w:im.width,h:im.height,tm,bi,png:u.startsWith('data:image/png')}}""")
    b.close()
assert not r.get("err"), r
assert r["png"] and r["w"] == 900 and r["h"] == 563, r
assert r["tm"] > 200 and r["bi"] > (r["w"] * r["h"]) * 0.8, r
assert not errs, errs
print("skica.py OK", r)
