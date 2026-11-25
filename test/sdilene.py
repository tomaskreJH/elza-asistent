# Test sdíleného ukládání (0.50.0): postupy a zpětná vazba (A), zakládání složek (B), hlídání nabídek (D) proti falešnému SharePointu v paměti stránky.
# Spuštění z kořene repozitáře: python3 test/sdilene.py
import os, json
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd=lambda n:open(os.path.join(ROOT,n),encoding="utf-8").read()
HTML="""<!doctype html><meta charset=utf-8><body><div id=main></div><script>
window.SP="https://sp.test";window.tok="t";window.token=async function(){};window.acc={name:"Tester",username:"t@elzy.cz"};window.m={acquireTokenSilent:async function(){return{accessToken:"t"}}};
window.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var ITEMS={Ukol:[]},LISTS={Ukol:1},NEXT=1,FOLD=[],LOG=[];window.ITEMS=ITEMS;window.FOLD=FOLD;window.LISTS=LISTS;
window.fetch=async function(u,o){o=o||{};var url=String(u);LOG.push((o.method||"GET")+" "+url);function js(x,st){return{ok:(st||200)<400,status:st||200,json:async function(){return x}}}
 if(/\\/web\\/folders$/.test(url)&&o.method=="POST"){FOLD.push(JSON.parse(o.body).ServerRelativeUrl);return js({})}
 if(/\\/web\\/lists$/.test(url)&&o.method=="POST"){var t=JSON.parse(o.body).Title;LISTS[t]=1;ITEMS[t]=ITEMS[t]||[];return js({})}
 var fieldResponse=mockFields(url,o,LISTS);if(fieldResponse)return fieldResponse;
 var mm=/getbytitle\\('([^']+)'\\)\\/items(?:\\((\\d+)\\))?(\\?.*)?$/.exec(url);
 if(mm){var l=mm[1];if(!LISTS[l])return js({},404);
  if(o.method=="POST"){var b=JSON.parse(o.body);if(mm[2]){Object.assign(ITEMS[l].filter(function(x){return x.Id==+mm[2]})[0],b)}else{ITEMS[l].push(Object.assign({Id:NEXT++},b))}return js({})}
  var q=decodeURIComponent(mm[3]||""),last=+((/Id gt (\\d+)/.exec(q)||[])[1]||0),tm=/Title eq '([^']*)'/.exec(q),pm=/Postup eq '([^']*)'/.exec(q);
  return js({value:ITEMS[l].filter(function(x){return x.Id>last&&(!tm||x.Title==tm[1])&&(!pm||x.Postup==pm[1])})})}
 return js({},404)};
</script>"""
HTML=HTML.replace("<script>", "<script>"+open(os.path.join(ROOT,"test","fixtures","sharepoint-fields.js"),encoding="utf-8").read()+"\nconst mockFields=schemaFixture();\n")
bad=[]
def chk(c,msg):
    if not c: bad.append(msg)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None)
    pg=b.new_page(viewport={"width":1400,"height":900})
    pg.on("pageerror",lambda e:bad.append("JS: "+str(e)))
    pg.route("https://elza.test/**",lambda r:r.fulfill(body=HTML,content_type="text/html"))
    pg.goto("https://elza.test/")
    for n in ["seznamy.js","sdilene.js","struktura.js","analyza.js","slozky.js","nabidky.js"]:
        pg.add_script_tag(content=rd(n))
    def mount(mod):
        pg.evaluate("(m)=>{const v=window.MODS[m];document.getElementById('main').innerHTML=v[0]();v[1]()}",mod)
        pg.wait_for_timeout(500)
    # --- A: analýza, chybějící seznamy -> založit -> zpětná vazba -> sdílení
    mount("analyza")
    chk("ještě nejsou založeny" in pg.inner_text("#anu"),"A: nezobrazeno chybí seznamy")
    pg.click("#anmk"); pg.wait_for_timeout(700)
    chk("ukládají pro celý tým" in pg.inner_text("#anu"),"A: sdílení se nezapnulo po založení: "+pg.inner_text("#anu")[:200])
    pg.fill("#ant","Pravidelná kontrola EPS Esser v objektu OBJ02664 zakázka PR001399"); pg.click("#ana"); pg.wait_for_timeout(300)
    chk("Založit složky zakázky" in pg.inner_text("#anr"),"A: chybí tlačítko složek")
    for i in range(3):
        pg.select_option('select[data-k="3"]',"upraveno"); pg.fill('input[data-t="3"]',"Nový text kroku")
        pg.click("#ang"); pg.wait_for_timeout(300)
    z=pg.evaluate("ITEMS.PostupZaznam.length"); chk(z==15,f"A: sdílených záznamů {z}, čekáno 15 (5 kroků × 3 uložení)")
    chk("Schválit jako novou verzi" in pg.inner_text("#anu"),"A: nenabídl se návrh nové verze")
    pg.click("[data-s='0']"); pg.wait_for_timeout(500)
    v=pg.evaluate("ITEMS.PostupVerze.map(x=>x.Title)"); chk("kontrola@v2" in v,f"A: verze nesdílena {v}")
    st=pg.evaluate("ITEMS.PostupZaznam.map(x=>x.Stav)"); chk(st.count("zpracovano")==3,f"A: zpracované záznamy kroku nejsou označeny {st}")
    # druhé zařízení: místní úložiště smazat, sdílené se musí načíst
    pg.evaluate("localStorage.clear()"); mount("analyza")
    pg.fill("#ant","Kontrola EPS OBJ02664 PR001399"); pg.click("#ana"); pg.wait_for_timeout(300)
    chk("verze 2" in pg.inner_text("#anr"),"A: druhé zařízení nevidí verzi 2")
    # schválení výchozího postupu a zdroj
    pg.fill("#ant","Nová instalace PZTS OBJ02664 PR001399"); pg.click("#ana"); pg.wait_for_timeout(300)
    pg.fill('input[data-zi="p1"]',"vyhláška č. 23/2008 Sb."); pg.click('[data-zd="p1"]'); pg.wait_for_timeout(500)
    chk(any(x=="realizace@v2" for x in pg.evaluate("ITEMS.PostupVerze.map(x=>x.Title)")),"A: zdroj nevytvořil verzi 2")
    # --- B: složky
    pg.evaluate("window.SLOZ_PRE={obj:'OBJ02664',pr:'PR001399',druh:'kontrola'}"); mount("slozky")
    chk("složek" in pg.inner_text("#slr"),"B: plán složek nezobrazen")
    pg.click("#slz"); pg.wait_for_timeout(800)
    f=pg.evaluate("FOLD"); chk(any(x.endswith("OBJ02664/PR001399/1 Vstup") for x in f),f"B: chybí složka Vstup {f[:5]}")
    chk(all(x.startswith("/sites/ZakazkyELZA/Shared Documents/Zakazky") for x in f),"B: složka mimo cílovou knihovnu")
    pg.fill("#slo","../x"); pg.dispatch_event("#slo","input"); chk(pg.query_selector("#slz") is None,"B: neplatný kód prošel")
    # --- D: nabídky
    mount("nabidky")
    chk("Založit seznam" in pg.inner_text("#nbx"),"D: chybí založení seznamu")
    pg.click("#nbmk"); pg.wait_for_timeout(600)
    pg.fill("#nbt","NAB-1"); pg.fill("#nbz","Z-2026-014"); pg.fill("#nbk","Zákazník"); pg.fill("#nbd","2020-01-01"); pg.click("#nbs"); pg.wait_for_timeout(700)
    chk("Čeká na rozhodnutí (1)" in pg.inner_text("#nbx"),"D: nabídka není ve frontě: "+pg.inner_text("#nbx")[:300])
    chk("navrhuji uzavřít" in pg.inner_text("#nbx"),"D: chybí návrh uzavření po 30 dnech")
    pg.click("[data-a=pr]"); pg.wait_for_timeout(700)
    chk(pg.evaluate("ITEMS.Ukol.length")==1,"D: úkol nevznikl")
    chk(pg.evaluate("ITEMS.NabidkaEvid[0].Pripomenuto")==30,"D: připomenutí nezaznamenáno")
    chk("Čeká na rozhodnutí (0)" in pg.inner_text("#nbx"),"D: nabídka zůstala ve frontě")
    b.close()
print("\n".join(bad) if bad else "sdilene OK"); raise SystemExit(1 if bad else 0)
