/* ELZA Asistent: moduly Prompty, Postupy, Foto příkazy, Brand, Pravidla AI. Data se čtou ze SharePointu, aplikace nic neukládá (kromě potvrzení pravidel do seznamu PotvrzeniAI). */
(function(){
var SEL="Title,ElzaId,Kind,Skupina,Model,Stav,Data";
async function rows(L){return (await list(L,SEL)).map(function(r){var d={};try{d=JSON.parse(r.Data||"{}")}catch(e){}r.d=d;return r})}
function cp(t){try{navigator.clipboard.writeText(t)}catch(e){}}
function mdl(m){return {L:"lehký",S:"střední",T:"těžký"}[m]||m||""}
function kv(o){return Object.keys(o||{}).map(function(k){var v=o[k];return "<p><b>"+esc(k)+":</b> "+esc(typeof v=="object"?JSON.stringify(v):v)+"</p>"}).join("")}
function sel(id,all,vals,cur){return "<select id="+id+"><option value=\"\">"+all+"</option>"+vals.map(function(x){return "<option"+(x==cur?" selected":"")+">"+esc(x)+"</option>"}).join("")+"</select>"}
function uniq(a){return Array.from(new Set(a.filter(Boolean)))}
var D=[],CL=[],F1="",F2="";
/* PROMPTY */
async function prompty(){D=await rows("Prompty");var ks=uniq(D.filter(function(x){return x.Kind=="prompt"}).map(function(x){return x.Skupina}));F1="";
var z=D.filter(function(x){return x.Kind=="zasada"}).map(function(x){return "<p><b>"+esc(x.d[0])+":</b> "+esc(x.d[1])+"</p>"}).join("");
return "<h1>Prompty</h1><details class=card><summary>Zásady levného a přesného promptu</summary>"+z+"</details><div class=bar><input id=q placeholder=\"Hledat prompt\" value=\""+esc(Q)+"\">"+sel("o","Všechny kategorie",ks,"")+"</div><div id=tb></div>"}
function promptyT(){var q=Q.toLowerCase();var r=D.filter(function(x){return x.Kind=="prompt"&&(!F1||x.Skupina==F1)&&(!q||[x.Title,x.d.text,x.d.vysledek].join(" ").toLowerCase().indexOf(q)>=0)});CL=r.map(function(x){return x.d.text});
$("#tb").innerHTML="<p class=note>"+r.length+" promptů</p><div class=grid>"+r.map(function(x,i){return "<div class=card><h3>"+esc(x.Title)+"</h3>"+tags([x.Skupina,mdl(x.Model),x.d.overeno?"ověřeno "+x.d.overeno:""])+"<p>"+esc(x.d.text)+"</p><p class=note>Výsledek: "+esc(x.d.vysledek)+"</p><button class=b data-c="+i+">Kopírovat</button></div>"}).join("")+"</div>"}
function promptyM(){$("#q").oninput=function(e){Q=e.target.value;promptyT()};$("#o").onchange=function(e){F1=e.target.value;promptyT()};$("#tb").onclick=cpClick;promptyT()}
function cpClick(e){var i=e.target.dataset&&e.target.dataset.c;if(i!=null){cp(CL[i]);e.target.textContent="Zkopírováno"}}
/* POSTUPY */
async function postupy(){D=await rows("Postupy");var g=uniq(D.filter(function(x){return x.Kind=="postup"}).map(function(x){return x.Skupina}));F1="";
var t=D.filter(function(x){return x.Kind=="trideni"}).map(function(x){return "<tr><td>"+esc(x.d.n)+"<td>"+esc(x.d.t)+"<td>"+esc(x.d.p)+"</tr>"}).join("");
return "<h1>Postupy</h1><details class=card><summary>Jak se úkol třídí</summary><table><tr><th>Krok<th>Pravidlo<th>Další</tr>"+t+"</table></details><div class=bar><input id=q placeholder=\"Hledat postup\" value=\""+esc(Q)+"\">"+sel("o","Všechny skupiny",g,"")+"</div><div id=tb></div>"}
function postupyT(){var q=Q.toLowerCase();var r=D.filter(function(x){return x.Kind=="postup"&&(!F1||x.Skupina==F1)&&(!q||JSON.stringify(x.d).toLowerCase().indexOf(q)>=0)});
$("#tb").innerHTML="<p class=note>"+r.length+" postupů</p>"+r.map(function(x){var d=x.d;return "<details class=card><summary><b>"+esc(x.Title)+"</b> "+tags([x.Skupina,d.oblast,d.stav])+"</summary><p>"+esc(d.cil)+"</p><table><tr><th>Fáze<th>Skill<th>Čte<th>Dělá<th>Předává<th>Kdo<th>Model<th>Stav</tr>"+(d.kroky||[]).map(function(k){return "<tr><td>"+esc(k.f)+"<td>"+esc(k.skill)+"<td>"+esc(k.cte)+"<td>"+esc(k.dela)+"<td>"+esc(k.predava)+"<td>"+esc(k.kdo)+"<td>"+esc(mdl(k.model))+"<td>"+esc(k.stav)+"</tr>"}).join("")+"</table><p class=note>Výsledek: "+esc(d.vysledek)+"</p></details>"}).join("")}
function postupyM(){$("#q").oninput=function(e){Q=e.target.value;postupyT()};$("#o").onchange=function(e){F1=e.target.value;postupyT()};postupyT()}
/* FOTO */
async function foto(){D=await rows("Foto příkazy");var m=D.filter(function(x){return x.Kind=="meta"})[0];var u=m?m.d.urovne:{};F1="";F2="";
return "<h1>Foto příkazy</h1><div class=bar><input id=q placeholder=\"Hledat příkaz\" value=\""+esc(Q)+"\">"+sel("o","Všechny skupiny",uniq(D.filter(function(x){return x.Kind=="prikaz"}).map(function(x){return x.Skupina})),"")+"<select id=u><option value=\"\">Všechny úrovně</option>"+Object.keys(u).map(function(k){return "<option value="+k+">"+k+" "+esc(u[k])+"</option>"}).join("")+"</select></div><div id=tb></div><h2>Ovladače</h2>"+D.filter(function(x){return x.Kind=="ovladac"}).map(function(x){return "<details class=card><summary>"+esc(x.Title)+"</summary>"+kv(x.d)+"</details>"}).join("")+"<h2>Postupy</h2>"+D.filter(function(x){return x.Kind=="postup"}).map(function(x){return "<details class=card><summary>"+esc(x.Title)+"</summary>"+kv(x.d)+"</details>"}).join("")}
function fotoT(){var q=Q.toLowerCase();var r=D.filter(function(x){return x.Kind=="prikaz"&&(!F1||x.Skupina==F1)&&(!F2||String(x.d.uroven)==F2)&&(!q||[x.Title,x.d.postup].join(" ").toLowerCase().indexOf(q)>=0)});CL=r.map(function(x){return x.d.alias});
$("#tb").innerHTML="<p class=note>"+r.length+" příkazů</p><table><tr><th>Příkaz<th>Název<th>Úroveň<th>Co dělá<th></tr>"+r.map(function(x,i){return "<tr><td>"+esc(x.d.alias)+"<td>"+esc(x.d.nazev)+"<td>"+esc(x.d.uroven)+"<td>"+esc(x.d.postup)+"<td><button class=b data-c="+i+">Kopírovat</button></tr>"}).join("")+"</table>"}
function fotoM(){$("#q").oninput=function(e){Q=e.target.value;fotoT()};$("#o").onchange=function(e){F1=e.target.value;fotoT()};$("#u").onchange=function(e){F2=e.target.value;fotoT()};$("#tb").onclick=cpClick;fotoT()}
/* BRAND (úpravy jsou jen návrh v tomto okně, export pro AI) */
var BR=[];
async function brand(){BR=(await rows("Brand")).map(function(x){return x.d});return "<h1>Brand</h1><p class=note>Úpravy barev jsou jen návrh v tomto okně. Tlačítkem je zkopírujete a zapíše je AI nebo správce do zdroje.</p><div id=tb></div>"}
function brandT(){$("#tb").innerHTML=BR.map(function(b,bi){return "<div class=card><h3>"+esc(b.nazev)+" "+tags([b.asistent,b.stav,b.rezim])+"</h3><p><b>Slogan:</b> "+esc(b.slogan)+"</p><p><b>Sdělení:</b> "+esc(b.sdeleni)+"</p><p><b>Hlas:</b> "+esc(b.hlas)+"</p><p><b>Písmo:</b> "+esc(b.pismoNadpis)+" / "+esc(b.pismoText)+"</p><p class=note>"+esc(b.logoPoznamka)+"</p><div class=grid>"+(b.barvy||[]).map(function(c,ci){return "<div class=card><input type=color value=\""+esc(c.hex)+"\" data-b="+bi+" data-k="+ci+"><br><b>"+esc(c.n)+"</b> "+esc(c.hex)+"<br>"+tags([c.role])+"<br><span class=note>"+esc(c.pouziti)+"</span></div>"}).join("")+"</div><button class=b data-x="+bi+">Zkopírovat změny pro AI</button></div>"}).join("");
$("#tb").oninput=function(e){var t=e.target;if(t.dataset&&t.dataset.b!=null){BR[t.dataset.b].barvy[t.dataset.k].hex=t.value}};
$("#tb").onclick=function(e){var i=e.target.dataset&&e.target.dataset.x;if(i!=null){var b=BR[i];cp("Brand "+b.nazev+" (id "+b.id+"): nové barvy "+JSON.stringify(b.barvy.map(function(c){return {n:c.n,hex:c.hex,role:c.role}})));e.target.textContent="Zkopírováno"}}}
/* PRAVIDLA AI a potvrzení */
window.aiOk=function(){return !!window._aiOk};
async function hash(t){var b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,"0")}).join("")}
var PR=null;
async function pravidla(){var r=await list("PravidlaAI","Title,Verze,Stav,Text,Poznamka");PR=r[r.length-1];if(!PR)return "<h1>Pravidla AI</h1><p class=note>Pravidla zatím nejsou vložena.</p>";
var me=(acc.username||"").toLowerCase();var c=await list("PotvrzeniAI","Title,Verze,Hash,Cas");var mine=c.filter(function(x){return (x.Title||"").toLowerCase()==me&&x.Verze==PR.Verze});var ap=PR.Stav=="schváleno";window._aiOk=ap&&mine.length>0;
var st=!ap?"<p class=a>Pravidla jsou ve stavu <b>"+esc(PR.Stav)+"</b>. Potvrzení se otevře po schválení vlastníkem a jednatelem. Do té doby se AI nespouští.</p>":mine.length?"<p>Pravidla verze "+esc(PR.Verze)+" jste potvrdil(a) "+esc(mine[0].Cas)+". AI je pro vás povolena.</p>":"<p class=a>Bez potvrzení se AI nespouští.</p><button class=b id=pot>Potvrzuji, že jsem pravidla přečetl(a) a budu je dodržovat</button><p id=ps class=note></p>";
return "<h1>Pravidla používání AI</h1><p>Verze "+esc(PR.Verze)+" "+tags([PR.Stav])+"</p>"+st+"<div class=card><pre style=\"white-space:pre-wrap;font:inherit\">"+esc(PR.Text)+"</pre></div><p class=note>"+esc(PR.Poznamka)+"</p>"}
function pravidlaM(){var b=$("#pot");if(!b)return;b.onclick=async function(){b.disabled=true;var ps=$("#ps");try{var W=[SP+"/AllSites.Write"];var t;try{t=(await m.acquireTokenSilent({scopes:W,account:acc})).accessToken}catch(e){t=(await m.acquireTokenPopup({scopes:W,account:acc})).accessToken}
var h=await hash(PR.Text);var body={Title:acc.username,Verze:PR.Verze,Hash:h,Cas:new Date().toLocaleString("cs-CZ")};
var r=await fetch(SP+SITE+"/_api/web/lists/getbytitle('PotvrzeniAI')/items",{method:"POST",headers:{Authorization:"Bearer "+t,Accept:"application/json;odata=nometadata","Content-Type":"application/json;odata=nometadata"},body:JSON.stringify(body)});
if(!r.ok)throw new Error("HTTP "+r.status);for(var k in cache)delete cache[k];go("pravidla")}catch(e){b.disabled=false;ps.textContent="Potvrzení se nezapsalo: "+e.message}}}
window.MODS={prompty:[prompty,promptyM],postupy:[postupy,postupyM],foto:[foto,fotoM],brand:[brand,brandT],pravidla:[pravidla,pravidlaM]};
})();
