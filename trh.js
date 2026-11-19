/* ELZA Asistent: Trh a konkurence (průzkumy, termíny revizí) a AI směrování (přehled tras a profilů). Jen čtení ze SharePointu. */
(function(){
var WANT=["Nové obchodní příležitosti","Technické novinky v oboru","Změny legislativy a norem"];
async function trh(){var r=await list("Pruzkumy","Title,Oblast,Datum,Frekvence,DalsiRevize,Soubor,Stav,Shrnuti");var g={};r.forEach(function(x){(g[x.Oblast||"Ostatní"]=g[x.Oblast||"Ostatní"]||[]).push(x)});
var h="<h1>Trh a konkurence</h1><p class=note>Průzkumy a přehledy pro vedení. Dokumenty jsou uložené v knihovně firmy, tady je přehled, termíny další revize a odkaz.</p>";
h+=Object.keys(g).map(function(k){return "<h2>"+esc(k)+"</h2><div class=grid>"+g[k].map(function(x){var ok=/^https:/.test(x.Soubor||"");return "<div class=card><h3>"+esc(x.Title)+"</h3>"+tags([x.Stav,"od "+x.Datum])+"<p>"+esc(x.Shrnuti)+"</p><p class=note>Revize: "+esc(x.Frekvence)+"</p><p>Další revize: "+dt(x.DalsiRevize,30)+"</p>"+(ok?"<a target=_blank rel=noopener href=\""+esc(x.Soubor)+"\">Otevřít dokument</a>":"")+"</div>"}).join("")+"</div>"}).join("");
h+="<h2>Dosud bez průzkumu</h2><p class=note>Oblasti, které vedení chce sledovat a pro které zatím není zpracovaný průzkum:</p><p>"+tags(WANT)+"</p>";
return h}
async function aism(){var r=await list("AISmerovani","Title,Typ,Rezim,Model,TridaDat,Limit,Stav,Poznamka");
return "<h1>AI směrování</h1><p class=note>Která úloha smí jít kterou trasou. Výchozí je trasa bez nové platby; API jen po schválení. Stav návrh znamená, že čeká na rozhodnutí vlastníka.</p><table><tr><th>Profil<th>Trasa<th>Model<th>Třída dat<th>Limit<th>Stav<th>Poznámka</tr>"+r.map(function(x){return "<tr><td>"+esc(x.Title)+"<td>"+esc(x.Rezim)+"<td>"+esc(x.Model)+"<td>"+esc(x.TridaDat)+"<td>"+esc(x.Limit)+"<td>"+esc(x.Stav)+"<td>"+esc(x.Poznamka)+"</tr>"}).join("")+"</table>"}
window.MODS=window.MODS||{};window.MODS.trh=[trh];window.MODS.aismer=[aism];
})();
