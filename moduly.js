/* ELZA Asistent: moduly Prompty, Postupy, Foto příkazy, Brand, Pravidla AI. Data se čtou ze SharePointu, aplikace nic neukládá (kromě potvrzení a schvalování pravidel AI v seznamech PotvrzeniAI a PravidlaAI). */
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
/* PRAVIDLA AI: verze, schvalování (vlastník, potom jednatel), úprava a potvrzení každým uživatelem.
   Stavy: návrh (0) > schváleno vlastníkem (1, AI už běží, čeká na jednatele) > schváleno jednatelem (2).
   Schválení vlastníkem se eviduje v seznamu PotvrzeniAI (Verze "x.y|vlastnik", Hash textu); jednatel nastaví Stav "schváleno".
   Změna textu po schválení zneplatní schválení i všechna potvrzení (hlídá Hash). Nová verze = nové potvrzení všemi. */
window.aiOk=function(){return !!window._aiOk};
async function hash(t){var b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,"0")}).join("")}
var ALL=[],LOG=[],ACT=null,PEND=null,MINE=false;
function rola(){return window.PRO&&window.PRO.role||""}
function jeVlastnik(){return rola()=="vlastnik"}
function jeJednatel(){return rola()=="jednatel"}
function nextVer(v){var a=String(v||"1.0").split(".");var n=parseInt(a[a.length-1],10);if(isNaN(n))return String(v)+".1";a[a.length-1]=n+1;return a.join(".")}
function lvlTxt(v){return v.lvl==2?"schváleno vlastníkem i jednatelem":v.lvl==1?"schváleno vlastníkem":"návrh"}
function nowTxt(){return new Date().toLocaleString("cs-CZ")}
function clr(){for(var k in cache)delete cache[k]}
async function wtok(){var W=[SP+"/AllSites.Write"];try{return (await m.acquireTokenSilent({scopes:W,account:acc})).accessToken}catch(e){return (await m.acquireTokenPopup({scopes:W,account:acc})).accessToken}}
async function spw(lst,id,body){var t=await wtok(),h={Authorization:"Bearer "+t,Accept:"application/json;odata=nometadata","Content-Type":"application/json;odata=nometadata"};if(id){h["X-HTTP-Method"]="MERGE";h["If-Match"]="*"}
var r=await fetch(SP+SITE+"/_api/web/lists/getbytitle('"+lst+"')/items"+(id?"("+id+")":""),{method:"POST",headers:h,body:JSON.stringify(body)});if(!r.ok)throw new Error(lst+": HTTP "+r.status);clr()}
function logRow(ver,h){return spw("PotvrzeniAI",0,{Title:acc.username,Verze:ver,Hash:h,Cas:nowTxt()})}
async function stav(){
  ALL=(await list("PravidlaAI","Id,Title,Verze,Stav,Text,Poznamka")).slice().sort(function(a,b){return a.Id-b.Id});
  LOG=await list("PotvrzeniAI","Title,Verze,Hash,Cas");
  var me=(acc.username||"").toLowerCase();
  for(var i=0;i<ALL.length;i++){var v=ALL[i];v.h=await hash(v.Text||"");v.ow=LOG.filter(function(x){return x.Verze==v.Verze+"|vlastnik"&&x.Hash==v.h})[0]||null;v.jed=v.Stav=="schváleno";v.lvl=v.jed?2:v.ow?1:0}
  ACT=null;ALL.forEach(function(v){if(v.lvl>=1)ACT=v});
  var last=ALL[ALL.length-1]||null;PEND=last&&last!==ACT&&(!ACT||last.Id>ACT.Id)?last:null;
  MINE=!!ACT&&LOG.some(function(x){return (x.Title||"").toLowerCase()==me&&x.Verze==ACT.Verze&&x.Hash==ACT.h});
  window._aiOk=!!ACT&&MINE;
}
async function potvrdit(){await logRow(ACT.Verze,ACT.h);window._aiOk=true;MINE=true;clr()}
window.aiRefresh=async function(){if(window._aiOk||!acc||tok=="demo")return;try{await stav()}catch(e){}};
window.aiCheck=async function(){
  if(!acc||!tok||tok=="demo")return;try{await stav()}catch(e){return}
  if(!ACT||MINE||window._aiPop==ACT.Verze+ACT.h)return;window._aiPop=ACT.Verze+ACT.h;
  var d=GR.modal('<h2>Nová pravidla AI k potvrzení</h2><p>Verze <b>'+esc(ACT.Verze)+'</b> ('+esc(lvlTxt(ACT))+'). Dokud je nepotvrdíte, AI se u vás nespouští.</p><div class=card style="max-height:45vh;overflow:auto"><pre style="white-space:pre-wrap;font:inherit">'+esc(ACT.Text)+'</pre></div><p class=note id=pp></p><div class=gm-r><button class=b id=pok>Přečetl(a) jsem a budu je dodržovat</button><button class=g id=px>Později (AI zůstane vypnutá)</button></div>',true);
  d.querySelector("#px").onclick=GR.closeModal;
  d.querySelector("#pok").onclick=async function(){var b=this;b.disabled=true;try{await potvrdit();GR.closeModal();if(window.cur=="pravidla"||cur=="pravidla")go("pravidla")}catch(e){b.disabled=false;d.querySelector("#pp").textContent="Potvrzení se nezapsalo: "+e.message}}
};
async function pravidla(){
  await stav();if(window.profilInit){try{await window.profilInit()}catch(e){}}
  if(!ALL.length)return "<h1>Pravidla AI</h1><p class=note>Pravidla zatím nejsou vložena.</p>"+(jeVlastnik()?"<button class=b data-pa=edit>Vytvořit první verzi</button>":"");
  var h="<h1>Pravidla používání AI</h1>",V=ACT||ALL[ALL.length-1];
  if(!ACT)h+="<p class=a>Zatím není žádná schválená verze. AI se nespouští.</p>";
  else{h+="<p>Platná verze <b>"+esc(ACT.Verze)+"</b> "+tags([lvlTxt(ACT)])+"</p>";
    if(ACT.lvl==1)h+="<p class=note>Schválil vlastník"+(ACT.ow?" ("+esc(ACT.ow.Title)+", "+esc(ACT.ow.Cas)+")":"")+". Pravidla platí; schválení jednatelem se zatím nevyžaduje.</p>";
    h+=MINE?"<p>Máte potvrzeno. AI je pro vás povolena.</p>":"<p class=a>Bez vašeho potvrzení se AI nespouští.</p><button class=b data-pa=pot>Potvrzuji, že jsem pravidla přečetl(a) a budu je dodržovat</button>";
    if(ACT.lvl==1&&jeJednatel())h+=" <button class=b data-pa=jed>Schvaluji jako jednatel</button>";
    h+="<p id=ps class=note></p><div class=card><pre style=\"white-space:pre-wrap;font:inherit\">"+esc(ACT.Text)+"</pre></div><p class=note>"+esc(ACT.Poznamka)+"</p>"}
  if(PEND){h+="<h2>Připravená nová verze "+esc(PEND.Verze)+" "+tags(["návrh"])+"</h2><p class=note>Neplatí, dokud ji nepotvrdí vlastník. Po schválení se všem uživatelům zobrazí okno s potvrzením.</p><div class=card><pre style=\"white-space:pre-wrap;font:inherit\">"+esc(PEND.Text)+"</pre></div>";
    if(jeVlastnik())h+="<button class=b data-pa=ow>Schvaluji jako vlastník</button> <button class=g data-pa=edit>Upravit návrh</button>";else h+="<p class=note>Schvaluje vlastník.</p>"}
  else if(jeVlastnik())h+="<p><button class=g data-pa=edit>Nová verze / úprava pravidel</button></p>";
  h+="<h2>Historie verzí</h2><table><tr><th>Verze<th>Stav<th>Schválení vlastníkem<th>Potvrdilo uživatelů</tr>"+ALL.slice().reverse().map(function(v){return "<tr><td>"+esc(v.Verze)+"<td>"+esc(lvlTxt(v))+"<td>"+(v.ow?esc(v.ow.Title+", "+v.ow.Cas):"")+"<td>"+LOG.filter(function(x){return x.Verze==v.Verze&&x.Hash==v.h}).length+"</tr>"}).join("")+"</table>";
  return h}
function editor(){
  var base=PEND||ACT||ALL[ALL.length-1]||{Verze:"0.0",Text:"",Poznamka:""},nv=PEND?PEND.Verze:nextVer(base.Verze);
  var d=GR.modal('<h2>'+(PEND?'Úprava návrhu':'Nová verze pravidel')+'</h2><div class=row><label>Verze <input id=ev value="'+esc(nv)+'" style="min-width:80px;width:90px"></label></div><textarea id=et style="min-height:45vh;width:100%">'+esc(base.Text||"")+'</textarea><input id=en placeholder="Poznámka (co se změnilo)" style="width:100%" value="'+esc(PEND?PEND.Poznamka||"":"")+'"><p class=note id=em>Uloží se jako návrh. Platná verze se nemění, dokud návrh neschválíte.</p><div class=gm-r><button class=b id=eok>Uložit návrh</button><button class=g id=ex>Zavřít</button></div>',true);
  d.querySelector("#ex").onclick=GR.closeModal;
  d.querySelector("#eok").onclick=async function(){var b=this,em=d.querySelector("#em"),ver=d.querySelector("#ev").value.trim(),tx=d.querySelector("#et").value,pn=d.querySelector("#en").value;
    if(!ver||!tx.trim()){em.textContent="Vyplňte verzi i text.";return}
    if(ALL.some(function(v){return v.Verze==ver&&v!==PEND})){em.textContent="Verze "+ver+" už existuje, zvolte jinou.";return}
    b.disabled=true;try{if(PEND)await spw("PravidlaAI",PEND.Id,{Verze:ver,Text:tx,Poznamka:pn});else await spw("PravidlaAI",0,{Title:"Pravidla AI",Verze:ver,Stav:"návrh",Text:tx,Poznamka:pn});GR.closeModal();go("pravidla")}catch(e){b.disabled=false;em.textContent="Nezapsalo se: "+e.message}}}
function pravidlaM(){var ps=function(t){var e=$("#ps");if(e)e.textContent=t};
  document.querySelectorAll("[data-pa]").forEach(function(b){b.onclick=async function(){var a=b.dataset.pa;if(a=="edit")return editor();b.disabled=true;
    try{if(a=="pot")await potvrdit();else if(a=="ow"){if(!jeVlastnik())throw new Error("Schvaluje jen vlastník.");await logRow(PEND.Verze+"|vlastnik",PEND.h)}
      else if(a=="jed"){if(!jeJednatel())throw new Error("Schvaluje jen jednatel.");await spw("PravidlaAI",ACT.Id,{Stav:"schváleno"});await logRow(ACT.Verze+"|jednatel",ACT.h)}
      go("pravidla")}catch(e){b.disabled=false;ps("Nezapsalo se: "+e.message)}}})}
window.MODS={prompty:[prompty,promptyM],postupy:[postupy,postupyM],foto:[foto,fotoM],brand:[brand,brandT],pravidla:[pravidla,pravidlaM]};
})();
