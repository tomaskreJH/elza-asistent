/* ELZA Asistent: jeden zdroj pravdy pro seznamy SharePointu, které aplikace sama zakládá (0.53.0).
   Moduly berou popis sloupců odsud (SEZ.S), Správa → Seznamy zakládá vše chybějící jedním tlačítkem.
   Pole: [název, druh (2 text, 3 víc řádků, 4 datum, 8 ano/ne, 9 číslo), indexovat]. Nic se nemaže, existující sloupce se nechají být.
   Když aplikace nemá právo AllSites.Manage, SEZ.skript() dá kód pro založení v přihlášeném SharePointu (cookie, bez aplikace). */
(function(){var W=window,Z="/sites/ZakazkyELZA",P="/sites/PortalELZA2";
var D=[
 [Z,"PostupVerze","verze postupů",[["Postup",2,1],["Verze",9],["Data",3],["Stav",2],["Schvalil",2]]],
 [Z,"PostupRetez","postupy: řetězy agentů se schválením",[["Vlastnik",2,1],["Data",3],["Stav",2]]],
 [Z,"ElzacekDef","Elzáčci: vlastní agenti a balíčky rolí",[["Vlastnik",2,1],["Data",3],["Stav",2]]],
 [Z,"ZnalostElza","Znalosti a profil firmy pro Elzáčky",[["Druh",2,1],["Agenti",2],["Klic",2],["Text",3],["Stav",2],["Kdo",2],["Kdy",2]]],
 [Z,"PostupZaznam","zpětná vazba k postupům",[["Postup",2,1],["Verze",9],["Krok",2],["Akce",2],["Text",3],["Kdo",2],["Kdy",2],["Stav",2]]],
 [Z,"NabidkaEvid","evidence odeslaných nabídek",[["Zakazka",2,1],["Zakaznik",2],["Odeslano",2],["Odpoved",2],["Stav",2,1],["Odpovedny",2,1],["Pripomenuto",9],["Poznamka",3]]],
 [Z,"Ukol","úkoly",[["KodZakazky",2],["Resitel",2],["Od",4],["Do",4],["Hotovo",9],["Poznamka",3]]],
 [Z,"Osoba","Plán fází, osoby",[["Jmeno",2],["Email",2,1],["Stav",2]]],
 [Z,"Kvalifikace","Plán fází, kvalifikace",[["Email",2,1],["Typ",2,1],["Platnost",4],["Stav",2]]],
 [Z,"PlanFaze","Plán fází, plány",[["Typ",2],["Param",3],["Obsazeni",3],["Start",3],["Stav",2]]],
 [Z,"ZaznamFaze","Plán fází, skutečnost",[["Plan",2,1],["Faze",2],["Osoba",2],["Hodiny",9],["Jednotek",9],["Den",9],["Duvod",2],["PlanH",9],["Stav",2]]],
 [Z,"Norma","Plán fází, normy",[["Typ",2,1],["Faze",2],["Fix",9],["Per",9],["Zdroj",2],["VzorkuN",9],["Stav",2]]],
 [Z,"Tym","Lidé a školení, týmy",[["Nazev",2],["Vedouci",2],["Stav",2]]],
 [Z,"Clen","Lidé a školení, členové",[["Email",2,1],["Tym",2,1],["Role",2],["Stav",2]]],
 [Z,"SkoleniTyp","Lidé a školení, druhy školení",[["Nazev",2],["Oblast",2],["Tym",2,1],["PlatnostMesice",9],["Stav",2]]],
 [Z,"Skoleni","Lidé a školení, absolvovaná školení",[["Typ",2,1],["Absolvovano",4],["PlatnostDo",4,1],["Stav",2]]],
 [Z,"Obsazeni","Lidé a školení, obsazení zakázek",[["Tym",2,1],["Email",2,1],["Jmeno",2],["VedouciAkce",8],["Od",4],["Do",4],["Stav",2]]],
 [P,"Kontroly","portál, kontroly a revize",[["Technologie",2],["Druh",2],["PosledniKontrola",4],["PristiTermin",4],["Publikace",2],["Vysledek",2],["Zavady",3],["Doporuceni",3],["NabidkaStav",2]]],
 [P,"ProfilZakaznika","portál, osobní nastavení zákazníka",[["Zakaznik",2,1],["Osloveni",2],["Kontakty",3],["Moduly",3],["Poznamka",3],["Stav",2]]]
];
var S={},WEB={},DS={};D.forEach(function(x){WEB[x[1]]=x[0];S[x[1]]=x[3];DS[x[1]]="ELZA asistent: "+x[2]});
function demo(){return /[?&]demo=1/.test(location.search)}
function lb(l){return SP+WEB[l]+"/_api/web/lists/getbytitle('"+l+"')"}
function jh(t){return{Authorization:"Bearer "+t,Accept:"application/json;odata=nometadata","Content-Type":"application/json;odata=nometadata"}}
async function tkn(sc){var X=[SP+"/"+sc];try{return(await m.acquireTokenSilent({scopes:X,account:acc})).accessToken}catch(e){return(await m.acquireTokenPopup({scopes:X,account:acc})).accessToken}}
/* které seznamy chybí (404); jiná chyba = neznámo */
async function stav(){if(demo())return D.map(function(x){return{l:x[1],w:x[0],ok:null}});var H=jh(await tkn("AllSites.Read"));
 return Promise.all(D.map(async function(x){try{var r=await fetch(lb(x[1])+"?$select=Title,ItemCount",{headers:H});if(r.status==404)return{l:x[1],w:x[0],ok:false};if(!r.ok)return{l:x[1],w:x[0],ok:null,e:"HTTP "+r.status};var j=await r.json();return{l:x[1],w:x[0],ok:true,n:j.ItemCount}}catch(e){return{l:x[1],w:x[0],ok:null,e:e.message}}}))}
/* založí uvedené seznamy (jen ty z popisu); vrací počet */
async function create(names){if(demo())throw new Error("V ukázkovém režimu se nic nezakládá.");var H=jh(await tkn("AllSites.Manage")),M=Object.assign({"IF-MATCH":"*","X-HTTP-Method":"MERGE"},H),n=0;
 for(var i=0;i<names.length;i++){var l=names[i],fl=S[l];if(!fl)continue;var r=await fetch(SP+WEB[l]+"/_api/web/lists",{method:"POST",headers:H,body:JSON.stringify({Title:l,BaseTemplate:100,Description:DS[l]})});
  if(r.status==401||r.status==403)throw new Error("Aplikace nemá právo zakládat seznamy (AllSites.Manage). Použijte Skript pro založení ve SharePointu.");
  if(!r.ok&&r.status!=409&&r.status!=500)throw new Error("Seznam "+l+": HTTP "+r.status);
  for(var k=0;k<fl.length;k++){var f=fl[k];await fetch(lb(l)+"/fields",{method:"POST",headers:H,body:JSON.stringify({Title:f[0],FieldTypeKind:f[1]})});if(f[2])await fetch(lb(l)+"/fields/getbytitle('"+f[0]+"')",{method:"POST",headers:M,body:JSON.stringify({Indexed:true})})}
  await fetch(lb(l)+"/fields/getbytitle('Title')",{method:"POST",headers:M,body:JSON.stringify({Indexed:true})});n++}return n}
/* skript pro konzoli prohlížeče na stránce SharePointu (přihlášení cookie, request digest); zakládá jen chybějící */
function skript(names){var sel=D.filter(function(x){return !names||names.indexOf(x[1])>=0});
 return "(async()=>{const D="+JSON.stringify(sel)+",O=location.origin,J={Accept:'application/json;odata=nometadata','Content-Type':'application/json;odata=nometadata'},out=[];"
 +"const dg=async w=>(await (await fetch(O+w+'/_api/contextinfo',{method:'POST',headers:J})).json()).FormDigestValue;"
 +"for(const [w,l,d,f] of D){const H=Object.assign({'X-RequestDigest':await dg(w)},J),M=Object.assign({'IF-MATCH':'*','X-HTTP-Method':'MERGE'},H),b=O+w+\"/_api/web/lists/getbytitle('\"+l+\"')\";"
 +"if((await fetch(b,{headers:J})).ok){out.push(l+': existuje');continue}"
 +"const r=await fetch(O+w+'/_api/web/lists',{method:'POST',headers:H,body:JSON.stringify({Title:l,BaseTemplate:100,Description:'ELZA asistent: '+d})});if(!r.ok){out.push(l+': CHYBA '+r.status);continue}"
 +"for(const [n,t,i] of f){await fetch(b+'/fields',{method:'POST',headers:H,body:JSON.stringify({Title:n,FieldTypeKind:t})});if(i)await fetch(b+\"/fields/getbytitle('\"+n+\"')\",{method:'POST',headers:M,body:JSON.stringify({Indexed:true})})}"
 +"await fetch(b+\"/fields/getbytitle('Title')\",{method:'POST',headers:M,body:JSON.stringify({Indexed:true})});out.push(l+': založen')}return out.join('\\n')})()"}
function pick(a){var o={};a.forEach(function(l){o[l]=S[l]});return o}
W.SEZ={D:D,S:S,WEB:WEB,stav:stav,create:create,skript:skript,pick:pick};
/* Správa → Seznamy (jen vlastník) */
var ST=null,MSG="";
async function seznamy(){if(!W.PRO||W.PRO.role!="vlastnik")return"<h1>Seznamy</h1><p class=note>Seznamy zakládá jen vlastník.</p>";ST=await stav();var chy=ST.filter(function(x){return x.ok===false});
 return"<h1>Seznamy aplikace</h1><p class=note>Jeden přehled všech seznamů, které moduly potřebují. Založení je jednorázové, prázdné, nic se nemaže.</p>"
 +"<table><tr><th>Seznam<th>Web<th>Stav</tr>"+ST.map(function(x){return"<tr><td>"+esc(x.l)+"<td>"+esc(x.w.replace("/sites/",""))+"<td>"+(x.ok?"✅ "+(x.n||0)+" položek":x.ok===false?"<b class=r>chybí</b>":"? "+esc(x.e||""))+"</tr>"}).join("")+"</table>"
 +(chy.length?"<div class=bar><button class=b data-z=1>Založit vše chybějící ("+chy.length+")</button> <button class=g data-k=1>Skript pro založení ve SharePointu</button></div>":"<p>Všechny seznamy existují.</p>")+"<p id=szm class=note>"+esc(MSG)+"</p>"}
function seznamyM(){var mn=$("#main");mn.onclick=async function(e){var d=e.target.dataset||{},o=$("#szm");
 if(d.z){e.target.disabled=true;o.textContent="Zakládám…";try{var n=await create(ST.filter(function(x){return x.ok===false}).map(function(x){return x.l}));MSG="Založeno seznamů: "+n+".";go("seznamy")}catch(er){o.textContent=er.message;e.target.disabled=false}}
 else if(d.k){var s=skript(ST.filter(function(x){return x.ok===false}).map(function(x){return x.l}));try{await navigator.clipboard.writeText(s);o.textContent="Skript je ve schránce. Otevřete web SharePointu, F12 → Konzole, vložit, Enter."}catch(er){o.textContent="Schránka nedostupná."}}}}
W.MODS=W.MODS||{};W.MODS.seznamy=[seznamy,seznamyM];
})();
