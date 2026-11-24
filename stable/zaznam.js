/* ELZA Asistent: Záznam činnosti (0.72.0). Zásada Tomáše (2026-11-24): data a fotky nevznikají jen na obhlídkách, ale při jakékoli činnosti pro zákazníka
   (obhlídka, montáž, servis, kontrola, revize, školení, hovor, fotka nebo dotaz od zákazníka). Každý krok se dokumentuje a ukládá k objektu a technologii,
   protože data se hodí za pět let při servisu, kontrolách a revizích i pro analýzu efektivity a hledání příležitostí (nové služby, např. kamery nebo BOZP).
   Čistá logika bez přístupu k datům: test/zaznam.test.js. Zápis dělá teren.js (složka zakázky + seznam Zaznam). Příležitosti jsou jen NÁVRH, rozhoduje člověk. */
(function(){var W=typeof window!="undefined"?window:globalThis;
var STR=W.STRUKTURA||(typeof require!="undefined"?require("./struktura.js"):null);
var DRUH={obhlidka:"Obhlídka",montaz:"Montáž a zprovoznění",servis:"Servis a porucha",kontrola:"Kontrola nebo zkouška",revize:"Revize",skoleni:"Školení a proškolení",hovor:"Hovor nebo schůzka",zakaznik:"Fotka nebo dotaz od zákazníka",jina:"Jiná činnost"};
var ZDROJ={technik:"Pořídil technik",zakaznik:"Poslal zákazník",email:"Z e-mailu",system:"Systém"};
var OBCHOD_VEDOUCI="Radim";
function nrm(s){return String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}
/* typ složky: fotka od zákazníka zvlášť, obhlídka zůstává ve staré složce pracovních dokumentů (zpětná shoda), ostatní do trvalých podkladů objektu */
function typFoto(druh,zdroj){return zdroj=="zakaznik"||druh=="zakaznik"?"foto_zakaznik":druh=="obhlidka"?"foto_obhlidka":"foto_cinnost"}
function novy(o){o=o||{};return{zak:o.zak||"",zakaznik:o.zakaznik||"",obj:o.obj||"",pr:o.pr||"",druh:DRUH[o.druh]?o.druh:"obhlidka",zdroj:ZDROJ[o.zdroj]?o.zdroj:"technik",kdo:o.kdo||"",kdy:o.kdy||new Date().toISOString(),tech:o.tech||[],popis:o.popis||"",min:+o.min||0,fotek:+o.fotek||0,ulozeno:+o.ulozeno||0,cesta:o.cesta||""}}
/* plán uložení fotek: složka a název podle struktury.js; číslování navazuje na už uložené (nepřepisuje) */
function fotoPlan(z,files,datum){if(!STR)throw new Error("Chybí struktura.js");var d=datum||new Date().toISOString().slice(0,10),typ=typFoto(z.druh,z.zdroj),out=[];
 (files||[]).forEach(function(f,i){var nm=String(f.name||""),m=/\.([A-Za-z0-9]{2,5})$/.exec(nm),e=m?m[1].toLowerCase():"jpg";if(e=="jpeg")e="jpg";
  var o={obj:String(z.obj||"").toUpperCase(),pr:String(z.pr||"").toUpperCase(),typ:typ,popis:(typ=="foto_obhlidka"?"foto":z.druh)+"-"+("0"+((+z.ulozeno||0)+i+1)).slice(-2),pripona:e,datum:d};
  out.push({rel:STR.slozka(o),name:STR.nazev(o),orig:nm})});return out}
/* návrh příležitostí z textu činnosti (pravidlově, bez AI); každá má komu a proč, nic se nenabízí zákazníkovi bez člověka */
var PRAV=[
 ["Kamerové systémy (CCTV)",/kamer|cctv|monitorov|sledovan|zaznam obrazu/,"obchod","Zákazník řeší dohled nebo záznam obrazu."],
 ["Kontrola vstupu a zabezpečení (PZTS, EZS)",/pzts|ezs|alarm|zabezpecovac|kontrola pristup|turniket|cipov|vstupni karta/,"obchod","Zmínka o zabezpečení nebo vstupech."],
 ["BOZP (výhled služby)",/bozp|bezpecnost prace|pracovn[ií] uraz|hodnoceni rizik|prohlidk\w* pracovist|ochranne pomucky|zebrik|lesen|skoleni zamestnanc/,"obchod + OZO BOZP","Zmínka o BOZP; službu zatím nenabízíme, sbíráme poptávku a podklady."],
 ["Požární ochrana: PBŘ, dokumentace, OZO PO",/pbr|pozarne bezpecnostni|dokumentace po|kniha po|hasic\w* (je )?prosl|unikov|pozarni rad|pozarni poplach/,"obchod + OZO PO","Chybí nebo je zastaralá dokumentace požární ochrany."],
 ["Modernizace nebo servis EPS",/stara ustredn|starsi ustredn|zastaral|vyrazen|nefunk|porucha|zavad|opakovan\w* poplach|falesn\w* poplach|nahradn\w* dil/,"obchod + technik","Stav techniky napovídá modernizaci nebo servisní smlouvě."],
 ["Revize elektro a rozvaděče",/revize|rozvadec|el\.? instalac|hromosvod|jistic|proudovy chranic/,"obchod + revizní technik","Zmínka o elektroinstalaci nebo revizi."],
 ["Připojení na PCO HZS",/pco|dppc|hzs|prenos na hasic|pripojeni na hasic/,"obchod","Zmínka o přenosu na hasiče."]];
function prilezitosti(text){var t=nrm(text),out=[];PRAV.forEach(function(r){var m=r[1].exec(t);if(m)out.push({typ:r[0],komu:r[2],proc:r[3],zachyceno:m[0]})});return out}
/* úkol pro obchod z příležitosti: řeší obchodní oddělení, vedoucí je Radim; nikdy ne Tomáš */
function ulohaPrilezitost(p,z){var i=new Date().toISOString().slice(0,10);return{Title:("Příležitost: "+p.typ+(z.zakaznik?" ("+z.zakaznik+")":"")).slice(0,250),KodZakazky:z.zak||"",Resitel:"",Od:i,Do:i,Hotovo:0,
 Poznamka:"Návrh od ELZY, rozhoduje obchod (vedoucí "+OBCHOD_VEDOUCI+"). "+p.proc+" Zachyceno: „"+p.zachyceno+"“ při činnosti: "+(DRUH[z.druh]||z.druh)+(z.obj?", objekt "+z.obj:"")+". Podklady jsou v záznamu a ve složce objektu."}}
/* strojově čitelný záznam činnosti (ukládá se vedle fotek jako zaznam_*.json, aby šel číst i za pět let bez aplikace) */
function manifest(z,fotky){return{schema:"elza-zaznam-1",zak:z.zak,zakaznik:z.zakaznik,obj:z.obj,pr:z.pr,druh:z.druh,druhNazev:DRUH[z.druh],zdroj:z.zdroj,kdo:z.kdo,kdy:z.kdy,technologie:z.tech,popis:z.popis,minuty:z.min,fotky:fotky||[],prilezitosti:prilezitosti(z.popis+" "+(z.tech||[]).join(" "))}}
function manifestSoubor(z,datum){var O=String(z.obj||"").toUpperCase(),P=String(z.pr||"").toUpperCase();return{rel:STR.slozka({obj:O,pr:P,typ:"zaznam"}),name:STR.nazev({obj:O,pr:P,typ:"zaznam",popis:z.druh,pripona:"json",datum:datum||String(z.kdy).slice(0,10)})}}
/* řádek do seznamu Zaznam (sloupce podle seznamy.js) */
function radek(z,cesta,pril){return{Title:(DRUH[z.druh]||z.druh)+" | "+(z.zak||z.obj),WorkId:z.zak,Obj:z.obj,Pr:z.pr,Druh:z.druh,Zdroj:z.zdroj,Kdo:z.kdo,Kdy:z.kdy,Technologie:(z.tech||[]).join(", "),Popis:z.popis,Fotek:z.ulozeno||z.fotek||0,Cesta:cesta||"",Prilezitosti:JSON.stringify(pril||prilezitosti(z.popis)),Minuty:z.min,Stav:"zaznam"}}
/* přehled pro analýzu efektivity: kolik činností, fotek a času podle druhu a technologie, odkud data jsou, kolik příležitostí vzniklo */
function analyza(rows){var a={celkem:0,fotek:0,minut:0,druh:{},tech:{},zdroj:{},prilezitosti:{},bezFotek:0};(rows||[]).forEach(function(r){a.celkem++;var f=+r.Fotek||0,mi=+r.Minuty||0;a.fotek+=f;a.minut+=mi;if(!f)a.bezFotek++;
 var d=a.druh[r.Druh]=a.druh[r.Druh]||{n:0,min:0,fotek:0};d.n++;d.min+=mi;d.fotek+=f;
 String(r.Technologie||"").split(/[,;]/).map(function(x){return x.trim()}).filter(Boolean).forEach(function(t){a.tech[t]=(a.tech[t]||0)+1});
 a.zdroj[r.Zdroj||"?"]=(a.zdroj[r.Zdroj||"?"]||0)+1;
 try{JSON.parse(r.Prilezitosti||"[]").forEach(function(p){a.prilezitosti[p.typ]=(a.prilezitosti[p.typ]||0)+1})}catch(e){}});
 Object.keys(a.druh).forEach(function(k){a.druh[k].prumMin=a.druh[k].n?Math.round(a.druh[k].min/a.druh[k].n):0});return a}
W.ZAZNAM={DRUH:DRUH,ZDROJ:ZDROJ,OBCHOD_VEDOUCI:OBCHOD_VEDOUCI,novy:novy,typFoto:typFoto,fotoPlan:fotoPlan,prilezitosti:prilezitosti,ulohaPrilezitost:ulohaPrilezitost,manifest:manifest,manifestSoubor:manifestSoubor,radek:radek,analyza:analyza};
if(typeof module!="undefined")module.exports=W.ZAZNAM;
})();
