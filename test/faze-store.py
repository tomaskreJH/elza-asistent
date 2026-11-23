# Test Plánu fází: ukládání do (falešného) SharePointu, kvalifikace → obsazení, přetahování fáze v Ganttu.
# Spuštění z kořene repozitáře: python3 test/faze-store.py
# Falešný SharePoint je v paměti stránky (žádné skutečné volání, žádná data). Ověří:
# 1) chybějící seznamy se zobrazí a založí; 2) kvalifikace se uloží a promítne do varování u fáze;
# 3) plán se uloží a znovu načte; 4) obsazení se zapíše až po potvrzení a staré se zruší; 5) přetažení fáze nastaví pevný začátek.
import os, sys, json
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS=open(os.path.join(ROOT,"faze.js"),encoding="utf-8").read()
HTML="""<!doctype html><meta charset=utf-8><body><div class=fz id=fz></div><script>
window.SP="https://sp.test";window.tok="t";window.token=async function(){};window.acc={};window.m={acquireTokenSilent:async function(){return{accessToken:"t"}}};
var LISTS=null,ITEMS={},NEXT=1,LOG=[];window.LOG=LOG;window.ITEMS=ITEMS;window.LISTS={};
window.fetch=async function(u,o){o=o||{};var url=String(u),mm;LOG.push((o.method||"GET")+" "+url.replace("https://sp.test/sites/ZakazkyELZA/_api/web/",""));
 function js(x,st){return{ok:(st||200)<400,status:st||200,json:async function(){return x}}}
 if(/\\/web\\/lists$/.test(url)&&o.method=="POST"){var t=JSON.parse(o.body).Title;LISTS[t]=1;ITEMS[t]=ITEMS[t]||[];return js({})}
 if(/\\/fields/.test(url))return js({});
 if(mm=/getbytitle\\('([^']+)'\\)\\/items(?:\\((\\d+)\\))?(\\?.*)?$/.exec(url)){var l=mm[1];if(!LISTS[l])return js({},404);
  if(o.method=="POST"){var b=JSON.parse(o.body);if(mm[2]){var it=ITEMS[l].filter(function(x){return x.Id==+mm[2]})[0];Object.assign(it,b)}else{ITEMS[l].push(Object.assign({Id:NEXT++},b))}return js({})}
  var q=decodeURIComponent(mm[3]||""),last=+((/Id gt (\\d+)/.exec(q)||[])[1]||0),tm=/Title eq '([^']*)'/.exec(q),pm=/Plan eq '([^']*)'/.exec(q);
  var r=ITEMS[l].filter(function(x){return x.Id>last&&(!tm||x.Title==tm[1])&&(!pm||x.Plan==pm[1])});return js({value:r})}
 return js({},404)};
LISTS.Obsazeni=1;ITEMS.Obsazeni=[{Id:900,Title:"ZK1",Stav:"aktivni",Email:"stary@elzy.cz"}];
</script>"""
bad=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None)
    pg=b.new_page(viewport={"width":1400,"height":900})
    pg.on("pageerror",lambda e:bad.append("JS: "+str(e)))
    pg.set_content(HTML)
    pg.evaluate("""()=>{window.esc=function(s){return String(s==null?'':s)}}""")
    pg.add_script_tag(content=open(os.path.join(ROOT,"seznamy.js"),encoding="utf-8").read());pg.add_script_tag(content=JS)
    pg.evaluate("""()=>{window.M=window.FAZE.mount(document.getElementById('fz'))}""")
    pg.wait_for_timeout(600)
    t=pg.inner_text("#sv")
    if "Chybí seznamy" not in t: bad.append("nezobrazeno Chybí seznamy: "+t[:200])
    pg.click("#mk"); pg.wait_for_timeout(800)
    t=pg.inner_text("#sv")
    if "Chybí seznamy" in t: bad.append("seznamy se nezaložily")
    # kvalifikace: první osoba z ukázkových lidí (Jan Novák) bez e-mailu -> zadat
    pg.select_option("#kp2","Jan Novák")
    pg.fill("#km","jan.novak@elzy.cz"); pg.select_option("#kt","OZO PO"); pg.fill("#kd","2099-01-01")
    pg.click("#ks"); pg.wait_for_timeout(600)
    kv=pg.evaluate("ITEMS.Kvalifikace")
    if not (len(kv)==1 and kv[0]["Typ"]=="OZO PO" and kv[0]["Email"]=="jan.novak@elzy.cz"): bad.append("kvalifikace: "+json.dumps(kv))
    # ukázkoví lidé nemají osobní číslo -> kvalifikace se jim nepromítá (kv zůstává neověřeno); simulace osoby s osobním číslem
    pg.evaluate("""()=>{}""")
    # plán
    pg.fill("#sk","ZK1"); pg.click("#sp"); pg.wait_for_timeout(600)
    pl=pg.evaluate("ITEMS.PlanFaze")
    if not(len(pl)==1 and pl[0]["Title"]=="ZK1" and json.loads(pl[0]["Obsazeni"])): bad.append("plán: "+json.dumps(pl)[:200])
    # změna a opětovné uložení = MERGE, ne duplicita
    pg.fill("#qh","100"); pg.press("#qh","Tab"); pg.wait_for_timeout(200)
    pg.click("#sp"); pg.wait_for_timeout(600)
    if pg.evaluate("ITEMS.PlanFaze.length")!=1: bad.append("plán se zdvojil")
    if json.loads(pg.evaluate("ITEMS.PlanFaze[0].Param"))["q"]["hl"]!=100: bad.append("plán nebyl aktualizován")
    # načtení plánu zpět
    pg.fill("#qh","520"); pg.press("#qh","Tab"); pg.wait_for_timeout(200)
    pg.select_option("#spl","ZK1"); pg.click("#sn"); pg.wait_for_timeout(600)
    if pg.input_value("#qh")!="100": bad.append("načtení plánu: hlásičů "+pg.input_value("#qh"))
    # obsazení: nejdřív e-maily lidí (ukázkoví lidé mají e-mail jen z Osoba -> bez os. čísla není) => očekáváme odmítnutí
    pg.click("#so"); pg.wait_for_timeout(300)
    if pg.evaluate("ITEMS.Obsazeni.length")!=1: bad.append("obsazení se zapsalo bez potvrzení/e-mailů")
    # přidáme e-maily přes e2e položky: osoba s os. číslem
    pg.evaluate("""()=>{M.redraw()}""")
    # přetažení fáze
    pg.locator('.sg[data-pid="hl"]').first.scroll_into_view_if_needed()
    box=pg.locator('.sg[data-pid="hl"]').first.bounding_box()
    before=pg.evaluate("M.start.hl")
    pg.mouse.move(box["x"]+5,box["y"]+5); pg.mouse.down(); pg.mouse.move(box["x"]+5+58*2+10,box["y"]+5,steps=6); pg.mouse.up(); pg.wait_for_timeout(300)
    st=pg.evaluate("M.start.hl")
    if st is None or st<=0: bad.append("přetažení nenastavilo pevný začátek: "+str(st))
    if "📌" not in pg.inner_text(".fz .gw"): bad.append("chybí značka pevného začátku")
    pg.click("#sr"); pg.wait_for_timeout(200)
    if pg.evaluate("Object.keys(M.start).length")!=0: bad.append("zrušení posunů nefunguje")
    # obsazení s potvrzením: dáme lidem os. číslo a e-mail
    # obsazení: lidé dostanou osobní číslo a e-mail (jako po synchronizaci), zápis až po potvrzení, staré se zruší
    pg.evaluate("""()=>{FAZE.PEOPLE.forEach(function(P,i){P.os=String(100+i);P.email='os'+i+'@elzy.cz'});M.redraw()}""")
    pg.fill("#sk","ZK1"); pg.click("#so"); pg.wait_for_timeout(300)
    if pg.evaluate("ITEMS.Obsazeni.length")!=1: bad.append("obsazení se zapsalo bez potvrzení")
    if "vedoucí akce" not in pg.inner_text("#sv"): bad.append("chybí potvrzovací souhrn s vedoucím akce")
    pg.click("#oy"); pg.wait_for_timeout(900)
    ob=pg.evaluate("ITEMS.Obsazeni")
    nov=[x for x in ob if x.get("Stav")=="aktivni" and x["Title"]=="ZK1"]
    if not nov or sum(1 for x in nov if x["VedouciAkce"])!=1: bad.append("obsazení: právě jeden vedoucí akce: "+json.dumps(ob)[:300])
    if ob[0].get("Stav")!="zruseno": bad.append("staré obsazení nebylo zrušeno")
    if any(not x["Od"].endswith("T00:00:00Z") for x in nov): bad.append("formát data Od")
    # kvalifikace promítnutá do plánu: osoba s os. číslem a kvalifikací
    pg.select_option("#kp2","Jan Novák"); pg.fill("#km","os0@elzy.cz"); pg.select_option("#kt","OZO PO"); pg.fill("#kd","2000-01-01"); pg.click("#ks"); pg.wait_for_timeout(700)
    if pg.evaluate("FAZE.PEOPLE[0].kv")!=True: bad.append("kvalifikace se nepromítla k osobě")
    if "prošla" not in pg.inner_text("#sv"): bad.append("prošlá kvalifikace není označena")
    b.close()
if bad:
    print("\n".join(bad)); sys.exit(1)
print("faze-store OK")
