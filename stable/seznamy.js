/* ELZA Asistent: jeden zdroj pravdy pro seznamy SharePointu, které aplikace sama zakládá (0.53.0).
   Moduly berou popis sloupců odsud (SEZ.S), Správa → Seznamy zakládá vše chybějící jedním tlačítkem.
   Pole: [název, druh (2 text, 3 víc řádků, 4 datum, 8 ano/ne, 9 číslo), indexovat]. Nic se nemaže, existující sloupce se nechají být.
   Když aplikace nemá právo AllSites.Manage, SEZ.skript() dá kód pro založení v přihlášeném SharePointu (cookie, bez aplikace). */
(function(){var W=window,Z="/sites/ZakazkyELZA",P="/sites/PortalELZA2";
var D=[
 [Z,"PostupVerze","verze postupů",[["Postup",2,1],["Verze",9],["Data",3],["Stav",2],["Schvalil",2]]],
 [Z,"PostupRetez","postupy: řetězy agentů se schválením",[["Vlastnik",2,1],["Data",3],["Stav",2]]],
 [Z,"NocniFronta","noční fronta běhů přes ElzaMost",[["Vlastnik",2,1],["Stanice",2,1],["Stav",2,1],["Data",3],["Vysledek",3],["Kdy",2]]],
 [Z,"ElzacekDef","Elzáčci: vlastní agenti a balíčky rolí",[["Vlastnik",2,1],["Data",3],["Stav",2]]],
 [Z,"ZnalostElza","Znalosti a profil firmy pro Elzáčky",[["Druh",2,1],["Agenti",2],["Klic",2],["Text",3],["Stav",2],["Kdo",2],["Kdy",2]]],
 [Z,"PostupZaznam","zpětná vazba k postupům",[["Postup",2,1],["Verze",9],["Krok",2],["Akce",2],["Text",3],["Kdo",2],["Kdy",2],["Stav",2]]],
 [Z,"ZakaznikInfo","interní informace o zákazníkovi (slevy, dohody, historie, poznámky)",[["Zakaznik",2,1],["Typ",2,1],["Text",3],["Zdroj",2],["Kdo",2],["Kdy",2],["Stav",2],["Zakazka",2]]],
 [Z,"NabidkaEvid","evidence odeslaných nabídek",[["Zakazka",2,1],["Zakaznik",2],["Odeslano",2],["Odpoved",2],["Stav",2,1],["Odpovedny",2,1],["Pripomenuto",9],["Poznamka",3]]],
 [Z,"ProcesStav","Proces nabídky, stav kroků případu",[["WorkId",2,1],["Fakta",3],["Stav",2]]],
 [Z,"Zaznam","záznamy činností u objektů (fotky, podklady, čas, příležitosti)",[["WorkId",2,1],["Obj",2,1],["Pr",2],["Druh",2,1],["Zdroj",2],["Kdo",2],["Kdy",2],["Technologie",2],["Popis",3],["Fotek",9],["Cesta",2],["Prilezitosti",3],["Minuty",9],["Stav",2]]],
 [Z,"Ukol","úkoly",[["KodZakazky",2],["Resitel",2],["Od",4],["Do",4],["Hotovo",9],["ZavisiNa",2],["Milnik",2],["Poznamka",3]]],
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
var S={},WEB={};D.forEach(function(x){WEB[x[1]]=x[0];S[x[1]]=x[3]});
function demo(){return /[?&]demo=1/.test(location.search)}
function lb(l){return SP+WEB[l]+"/_api/web/lists/getbytitle('"+l+"')"}
function jh(t){return{Authorization:"Bearer "+t,Accept:"application/json;odata=nometadata","Content-Type":"application/json;odata=nometadata"}}
async function tkn(sc){var X=[SP+"/"+sc];try{return(await m.acquireTokenSilent({scopes:X,account:acc})).accessToken}catch(e){return(await m.acquireTokenPopup({scopes:X,account:acc})).accessToken}}
// Stejný postup se používá v aplikaci i ve skriptu spuštěném na SharePointu.
async function schema(def, origin, headers, repair) {
 const [web, name, description, columns] = def;
 const lists = origin + web + "/_api/web/lists";
 const list = lists + "/getbytitle('" + name + "')";
 const expected = [["Title", 2, 1], ...columns];
 const filter = expected.map(([key]) => "InternalName eq '" + key + "'").join(" or ");
 const url = list + "/fields?$select=InternalName,FieldTypeKind,Indexed&$filter=" + encodeURIComponent(filter) + "&$top=" + expected.length;
 function httpError(label, response) {
  const hint = [401, 403].includes(response.status) ? " Ověřte oprávnění k seznamu." : "";
  return new Error(name + " / " + label + ": HTTP " + response.status + "." + hint);
 }
 async function read() {
  const response = await fetch(url, {headers});
  if (response.status === 404) return null;
  if (!response.ok) throw httpError("čtení sloupců", response);
  const data = await response.json();
  return new Map(data.value.map(field => [field.InternalName, field]));
 }
 function missing(fields) {
  const tasks = [];
  for (const [key, type, index] of expected) {
   const field = fields.get(key);
   if (field && field.FieldTypeKind !== type) throw new Error(name + "." + key + " má jiný typ. Zkontrolujte sloupec ve SharePointu.");
   if (!field || (index && !field.Indexed)) tasks.push({key, type, index, exists: !!field});
  }
  return tasks;
 }
 async function post(path, body, merge) {
  const requestHeaders = merge ? {...headers, "IF-MATCH": "*", "X-HTTP-Method": "MERGE"} : headers;
  return fetch(path, {method: "POST", headers: requestHeaders, body: JSON.stringify(body)});
 }
 let fields = await read();
 if (!repair) {
  if (!fields) return {ok:false, detail:"chybí seznam"};
  const tasks = missing(fields);
  return {ok:tasks.length === 0, detail:tasks.map(t => t.exists ? "index " + t.key : t.key).join(", ")};
 }
 if (!fields) {
  const response = await post(lists, {Title:name, BaseTemplate:100, Description:"ELZA asistent: " + description});
  if (!response.ok && ![400,409,500].includes(response.status)) throw httpError("založení seznamu", response);
  fields = await read();
  if (!fields) {
   if (!response.ok) throw httpError("založení seznamu", response);
   throw new Error(name + ": po založení nelze načíst sloupce.");
  }
 }
 for (const {key, type, index, exists} of missing(fields)) {
  if (!exists) {
   const response = await post(list + "/fields", {Title:key, FieldTypeKind:type});
   if (!response.ok) {
    if (![400,409,500].includes(response.status)) throw httpError(key, response);
    const current = (await read())?.get(key);
    if (current?.FieldTypeKind !== type) throw httpError(key, response);
   }
  }
  if (index) {
   const response = await post(list + "/fields/getbyinternalnameortitle('" + key + "')", {Indexed:true}, true);
   if (!response.ok) throw httpError("index " + key, response);
  }
 }
 const verified = await read();
 if (!verified || missing(verified).length) throw new Error(name + ": schéma po zápisu není úplné. Zkontrolujte znovu seznam.");
}

async function stav() {
 if (demo()) return D.map(x => ({l:x[1], w:x[0], ok:null, e:"ukázkový režim"}));
 const headers = jh(await tkn("AllSites.Read"));
 return Promise.all(D.map(async def => {
  const row = {l:def[1], w:def[0]};
  try {
   const status = await schema(def, SP, headers, false);
   if (!status.ok) return {...row, ...status};
   const response = await fetch(lb(row.l) + "?$select=ItemCount", {headers});
   if (!response.ok) throw new Error("HTTP " + response.status);
   return {...row, ...status, n:(await response.json()).ItemCount};
  } catch (error) { return {...row, ok:null, e:error.message}; }
 }));
}
async function create(names) {
 if (demo()) throw new Error("V ukázkovém režimu se nic nezakládá.");
 const headers = jh(await tkn("AllSites.Manage"));
 const selected = D.filter(def => names.includes(def[1]));
 for (const def of selected) await schema(def, SP, headers, true);
 return selected.length;
}
async function runScript(defs, reconcile) {
 const headers = {Accept:"application/json;odata=nometadata", "Content-Type":"application/json;odata=nometadata"};
 const results = [];
 for (const def of defs) {
  const response = await fetch(location.origin + def[0] + "/_api/contextinfo", {method:"POST", headers});
  if (!response.ok) throw new Error(def[1] + ": ověření přihlášení, HTTP " + response.status);
  const digest = (await response.json()).FormDigestValue;
  if (!digest) throw new Error(def[1] + ": chybí ověření požadavku SharePointu.");
  await reconcile(def, location.origin, {...headers, "X-RequestDigest":digest}, true);
  results.push(def[1] + ": schéma ověřeno");
 }
 return results.join("\n");
}
function skript(names) {
 const selected = D.filter(def => !names || names.includes(def[1]));
 return "(" + runScript.toString() + ")(" + JSON.stringify(selected) + "," + schema.toString() + ")";
}
function pick(a){var o={};a.forEach(function(l){o[l]=S[l]});return o}
W.SEZ={D:D,S:S,WEB:WEB,stav:stav,create:create,skript:skript,pick:pick};
/* Správa → Seznamy (jen vlastník) */
var ST=null,MSG="";
async function seznamy(){if(!W.PRO||W.PRO.role!="vlastnik")return"<h1>Seznamy</h1><p class=note>Seznamy zakládá jen vlastník.</p>";ST=await stav();var chy=ST.filter(function(x){return x.ok===false});
 return"<h1>Seznamy aplikace</h1><p class=note>Jeden přehled všech seznamů, které moduly potřebují. U existujících seznamů se kontrolují také sloupce a indexy. Zápis položek v existujícím seznamu a správa schématu mají oddělená oprávnění. Chybějící seznam zakládá správce SharePointu.</p>"
 +"<table><tr><th>Seznam<th>Web<th>Stav</tr>"+ST.map(function(x){return"<tr><td>"+esc(x.l)+"<td>"+esc(x.w.replace("/sites/",""))+"<td>"+(x.ok?"✅ "+(x.n||0)+" položek":x.ok===false?"<b class=r>"+esc(x.detail)+"</b>":"? "+esc(x.e||""))+"</tr>"}).join("")+"</table>"
 +(chy.length?"<div class=bar><button class=b data-z=1>Doplnit schéma s oprávněním ke správě ("+chy.length+")</button> <button class=g data-k=1>Skript pro založení ve SharePointu</button></div>":ST.some(x=>x.ok===null)?"<p>Některé seznamy nebylo možné ověřit.</p>":"<p>Schéma všech seznamů je úplné.</p>")+"<p id=szm class=note>"+esc(MSG)+"</p>"}
function seznamyM(){var mn=$("#main");mn.onclick=async function(e){var d=e.target.dataset||{},o=$("#szm");
 if(d.z){e.target.disabled=true;o.textContent="Doplňuji a ověřuji schéma…";try{var n=await create(ST.filter(function(x){return x.ok===false}).map(function(x){return x.l}));MSG="Počet ověřených schémat: "+n+".";go("seznamy")}catch(er){o.textContent=er.message;e.target.disabled=false}}
 else if(d.k){var s=skript(ST.filter(function(x){return x.ok===false}).map(function(x){return x.l}));try{await navigator.clipboard.writeText(s);o.textContent="Skript je ve schránce. Otevřete web SharePointu, F12 → Konzole, vložit, Enter."}catch(er){o.textContent="Schránka nedostupná."}}}}
W.MODS=W.MODS||{};W.MODS.seznamy=[seznamy,seznamyM];
})();
