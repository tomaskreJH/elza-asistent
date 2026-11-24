# Test vzhledu 0.64.0: přihlašovací dlaždice před přihlášením, Nastavení jako dlaždice, menu bez duplicit,
# panel Co agent ví u Úloh, žádná plovoucí okna a lišty. Spuštění z kořene repozitáře: python3 test/vzhled.py
import http.server, threading, functools, os
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
B = f"http://127.0.0.1:{srv.server_port}/index.html"
bad = []
def chk(c, m):
    if not c: bad.append(m)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None)
    for kanal in ("stable", "beta"):
        pg = b.new_page(viewport={"width": 1280, "height": 800})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.add_init_script(f"try{{localStorage.setItem('elzaKanal','{kanal}')}}catch(e){{}}")
        # 1 před přihlášením: jen přihlašovací dlaždice, menu bez položek
        pg.goto(B); pg.wait_for_timeout(2500)
        chk(pg.query_selector(".lg") is not None, f"{kanal}: chybí přihlašovací dlaždice")
        chk(pg.query_selector("aside .pins") is None, f"{kanal}: před přihlášením je vidět menu")
        # 2 ukázkový režim: Nastavení jako dlaždice
        pg.goto(B + "?demo=1&v=nast"); pg.wait_for_timeout(1800)
        n1 = len(pg.query_selector_all(".nt button"))
        chk(n1 >= 6, f"{kanal}: Nastavení má jen {n1} dlaždic")
        pg.click("[data-vz=nrez][data-id=p]"); pg.wait_for_timeout(600)
        n2 = len(pg.query_selector_all(".nt button"))
        chk(n2 > n1, f"{kanal}: Pokročilý režim nepřidal dlaždice ({n1} -> {n2})")
        # 3 menu bez duplicit: připnuté položky nejsou ve skupinách znovu
        dup = pg.evaluate("()=>[...document.querySelectorAll('aside .pins .nav')].map(e=>e.dataset.v).filter(v=>document.querySelector('aside .grp [data-v=\"'+v+'\"]'))")
        chk(not dup, f"{kanal}: položky jsou v menu dvakrát: {dup}")
        # 4 žádné plovoucí prvky
        fx = pg.evaluate("()=>[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position=='fixed'&&getComputedStyle(e).display!='none'&&e.offsetWidth>0).map(e=>e.id||e.className).filter(x=>x)")
        chk(not [x for x in fx if x in ('tabs', 'qt', 'cx-q')], f"{kanal}: plovoucí prvky {fx}")
        chk(pg.query_selector(".cx-q") is None and pg.query_selector("#qt") is None, f"{kanal}: zbytky ? a rychlých nástrojů")
        # 5 dole v menu je vždy vidět Návod
        vis = pg.evaluate("()=>{var e=document.querySelector('aside .me');if(!e)return false;var r=e.getBoundingClientRect();return r.bottom<=innerHeight+1}")
        chk(vis, f"{kanal}: dolní část menu (Návod, Odhlásit) není vidět")
        # 6 Úlohy: panel Co agent ví vedle zadání a změna podle agenta
        pg.goto(B + "?demo=1&v=dnes"); pg.wait_for_timeout(1500)
        pg.evaluate("()=>{window.list=async()=>[];go('ulohy')}"); pg.wait_for_timeout(2000)
        el = pg.query_selector("#kxco")
        chk(el is not None and "Co agent ví" in (el.inner_text() if el else ""), f"{kanal}: u Úloh chybí panel Co agent ví")
        if el:
            pg.select_option("#ua", index=1); pg.wait_for_timeout(300)
            t2 = pg.inner_text("#kxco")
            chk("Smí:" in t2, f"{kanal}: panel neukazuje Smí")
        chk(not errs, f"{kanal}: chyby JS {errs}")
        pg.close()
    b.close()
if bad:
    print("\n".join(bad)); raise SystemExit(1)
print("vzhled OK")
