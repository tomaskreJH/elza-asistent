/* ELZA Asistent: nová souborová struktura dokumentace (0.49.0). Nic se nekopíruje ze starého uspořádání; pravidla jsou čistá logika bez přístupu k datům (test: test/struktura.test.js).
   Složky a soubory zůstávají obyčejné (jde je otevřít v jakémkoli programu). Dokument má roli: vstup (od zákazníka a úřadů), pracovní (tvoříme pro sebe), výstup (pro provedení, skutečné provedení, provozní, kontrolní, předání).
   Trvalé dokumenty objektu (provozní, kontrolní) leží u objektu, protože přežijí zakázku; ostatní leží u zakázky. */
(function(){var W=typeof window!="undefined"?window:globalThis;
var ROLE={vstup:"1 Vstup",pracovni:"2 Pracovní",provedeni:"3a Pro provedení",skutecne:"3b Skutečné provedení",provozni:"Provoz",kontrolni:"Kontroly",predani:"3e Předání"};
var TYP={zadani:["vstup","Zadání"],plan:["vstup","Plány od zadavatele"],pbr:["vstup","PBŘ od zadavatele"],stav:["vstup","Současný stav"],stanovisko:["vstup","Stanovisko úřadu nebo HZS"],
 foto_obhlidka:["pracovni","Fotodokumentace z obhlídky"],zapis_obhlidka:["pracovni","Zápis z obhlídky"],vykaz:["pracovni","Výkaz výměr"],nabidka:["pracovni","Nabídka"],harmonogram:["pracovni","Harmonogram"],bozp:["pracovni","BOZP"],
 realizacni:["provedeni","Realizační dokumentace"],tz:["provedeni","Technická zpráva"],vykres:["provedeni","Výkresy"],
 vykres_sk:["skutecne","Výkresy skutečného provedení"],vykres_zm:["skutecne","Změnové výkresy"],foto_real:["skutecne","Fotodokumentace z realizace"],tz_sk:["skutecne","Technická zpráva skutečného provedení"],
 navod:["provozni","Návod k obsluze"],kniha:["provozni","Provozní kniha"],proskoleni:["provozni","Protokol o proškolení"],
 revize:["kontrolni","Revizní zpráva"],protokol:["kontrolni","Protokol o kontrole nebo zkoušce"],profylaxe:["kontrolni","Protokol profylaxe"],
 predavaci:["predani","Předávací protokol"],hzs:["predani","Zápis nebo stanovisko HZS"],certifikat:["predani","Certifikáty a prohlášení"]};
var TRVALE={provozni:1,kontrolni:1};
function slug(s){return String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)}
function ok(k,re,n){if(!re.test(String(k||"")))throw new Error("Neplatný "+n+": "+k)}
/* složka: trvalé role u objektu, ostatní u zakázky */
function slozka(o){ok(o.obj,/^OBJ\d{5}$/,"kód objektu");var t=TYP[o.typ];if(!t)throw new Error("Neznámý typ dokumentu: "+o.typ);var r=t[0];
 if(TRVALE[r])return o.obj+"/"+ROLE[r]+"/"+slug(t[1]);ok(o.pr,/^PR\d{6}$/,"číslo zakázky");return o.obj+"/"+o.pr+"/"+ROLE[r]+"/"+slug(t[1])}
/* název: OBJ_PR_typ_popis_vN_RRRR-MM-DD.přípona (bez diakritiky a mezer) */
function nazev(o){var v=o.verze||1,d=o.datum||new Date().toISOString().slice(0,10),e=String(o.pripona||"").replace(/^\./,"").toLowerCase();ok(d,/^\d{4}-\d{2}-\d{2}$/,"datum");if(!e)throw new Error("Chybí přípona");
 var t=TYP[o.typ];if(!t)throw new Error("Neznámý typ dokumentu: "+o.typ);return [o.obj,TRVALE[t[0]]?"":o.pr,o.typ,slug(o.popis||t[1]),"v"+v,d].filter(Boolean).join("_")+"."+e}
function cesta(o){return slozka(o)+"/"+nazev(o)}
function parse(n){var m=/^(OBJ\d{5})_(?:(PR\d{6})_)?(.+)_v(\d+)_(\d{4}-\d{2}-\d{2})\.([a-z0-9]+)$/.exec(String(n));if(!m)return null;var rest=m[3],keys=Object.keys(TYP).sort(function(x,y){return y.length-x.length}),typ="",popis=rest;
 for(var i=0;i<keys.length;i++){if(rest==keys[i]||rest.indexOf(keys[i]+"_")==0){typ=keys[i];popis=rest.slice(typ.length+1);break}}
 return {obj:m[1],pr:m[2]||"",typ:typ,popis:popis,verze:+m[4],datum:m[5],pripona:m[6],znamy:!!typ}}
/* návrh typu ze starého názvu souboru nebo složky (jen návrh, potvrzuje člověk) */
var HINT=[[/^tz|_tz|technick.*zprav/,"tz"],[/pbr|pozarn/,"pbr"],[/revizn/,"revize"],[/protokol.*(seznam|pracovist)/,"bozp"],[/bozp/,"bozp"],[/predavac|predani/,"predavaci"],[/hzs/,"hzs"],[/nabidk/,"nabidka"],[/vykaz|vymer/,"vykaz"],[/harmonogram/,"harmonogram"],[/zmen.*vykres/,"vykres_zm"],[/skutec.*vykres|vykres.*skutec/,"vykres_sk"],[/vykres/,"vykres"],[/fotodok.*obhl|obhl.*foto/,"foto_obhlidka"],[/foto.*real|real.*foto/,"foto_real"],[/navod|obsluh/,"navod"],[/profylax/,"profylaxe"],[/plan/,"plan"],[/zadani/,"zadani"],[/kontrol|zkousk/,"protokol"]];
function navrhTypu(n){var s=String(n||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();for(var i=0;i<HINT.length;i++)if(HINT[i][0].test(s))return HINT[i][1];return ""}
/* co musí existovat při předání zakázky (podle druhu); požadované role si upraví odborně vedoucí v postupu */
var POVINNE={realizace:["zadani","bozp","vykres_sk","tz_sk","foto_real","navod","predavaci"],kontrola:["protokol"],revize:["revize"],servis:["protokol"],projekt:["zadani","tz","vykres"],nabidka:["zadani","nabidka"]};
function chybi(druh,mam){var p=POVINNE[druh]||[],m={};(mam||[]).forEach(function(x){m[x]=1});return p.filter(function(x){return !m[x]})}
/* složky, které vzniknou při založení zakázky: role zakázky, typy povinné pro druh a trvalé složky objektu (Provoz, Kontroly); jen cesty, nic se nezapisuje */
function plan(o){ok(o.obj,/^OBJ\d{5}$/,"kód objektu");ok(o.pr,/^PR\d{6}$/,"číslo zakázky");var m={};
 ["vstup","pracovni","provedeni","skutecne","predani"].forEach(function(r){m[o.obj+"/"+o.pr+"/"+ROLE[r]]=1});m[o.obj+"/"+ROLE.provozni]=1;m[o.obj+"/"+ROLE.kontrolni]=1;
 (POVINNE[o.druh]||[]).forEach(function(t){m[slozka({obj:o.obj,pr:o.pr,typ:t})]=1});return Object.keys(m).sort()}
W.STRUKTURA={plan:plan,ROLE:ROLE,TYP:TYP,POVINNE:POVINNE,slug:slug,slozka:slozka,nazev:nazev,cesta:cesta,parse:parse,navrhTypu:navrhTypu,chybi:chybi};
if(typeof module!="undefined")module.exports=W.STRUKTURA;
})();
