/* ELZA Asistent: Správa uživatelů, rolí a modulů (jen vlastník). Zapisuje do seznamů Uživatelé a RoleAplikace. Skrytí modulů je pohodlí, skutečná ochrana dat jsou oprávnění SharePointu. */
(function(){
var US=[],RL=[],TAB="u";
function csv(s){return String(s||"").split(",").map(function(x){return x.trim()}).filter(Boolean)}
function modAll(){var a=[];MENU.forEach(function(g){g[1].forEach(function(i){if(i[0][0]!=="-"&&["prehled","pruvodce","pravidla","ainast","ulohy","sprava"].indexOf(i[0])<0)a.push(i[0])})});return a}
async function wt(){var W=[SP+"/AllSites.Write"];try{return (await m.acquireTokenSilent({scopes:W,account:acc})).accessToken}catch(e){return (await m.acquireTokenPopup({scopes:W,account:acc})).accessToken}}
async function put(lst,id,body){var t=await wt(),h={Authorization:"Bearer "+t,Accept:"application/json;odata=nometadata","Content-Type":"application/json;odata=nometadata"};if(id){h["X-HTTP-Method"]="MERGE";h["If-Match"]="*"}
var r=await fetch(SP+SITE+"/_api/web/lists/getbytitle('"+encodeURIComponent(lst)+"')/items"+(id?"("+id+")":""),{method:"POST",headers:h,body:JSON.stringify(body)});if(!r.ok)throw new Error(lst+": HTTP "+r.status);for(var k in cache)delete cache[k]}
async function sprava(){
  if(!window.PRO||window.PRO.role!="vlastnik")return "<h1>Uživatelé a moduly</h1><p class=note>Správu nastavuje jen vlastník.</p>";
  US=await list("Uživatelé","Id,Title,Upn,Role,Modules,Beta,Agenti,Status,Active,Note");RL=await list("RoleAplikace","Id,Title,Nazev,Moduly,Zakazano,Popis");
  return "<h1>Uživatelé a moduly</h1><div class=bar><button class='nav"+(TAB=="u"?" on":"")+"' style=width:auto data-s=u>Uživatelé</button><button class='nav"+(TAB=="r"?" on":"")+"' style=width:auto data-s=r>Role</button></div><div id=tb></div><p class=note>Změny se ukládají do SharePointu a projeví se po dalším načtení aplikace uživatelem. Prázdné moduly u uživatele = všechny, které role povoluje.</p>"}
function tab(){var h;
 if(TAB=="u")h="<table><tr><th>Uživatel<th>Role<th>Moduly<th>Stav<th></tr>"+US.map(function(u){return "<tr><td>"+esc(u.Title)+"<br><span class=note>"+esc(u.Upn)+"</span><td>"+esc(u.Role||"nepotvrzena")+(u.Note?"<br><span class=note>"+esc(u.Note)+"</span>":"")+"<td>"+esc(u.Modules||"dle role")+"<td>"+esc(u.Active===false?"Neaktivní":u.Status||"")+"<td><button class=b data-u="+u.Id+">Upravit</button></tr>"}).join("")+"</table><p><button class=b data-u=0>Přidat uživatele</button></p>";
 else h="<table><tr><th>Role<th>Název<th>Moduly<th>Zakázané skupiny<th></tr>"+RL.map(function(r){return "<tr><td>"+esc(r.Title)+"<td>"+esc(r.Nazev)+"<td>"+esc(r.Moduly)+"<td>"+esc(r.Zakazano)+"<td><button class=b data-r="+r.Id+">Upravit</button></tr>"}).join("")+"</table><p><button class=b data-r=0>Přidat roli</button></p>";
 $("#tb").innerHTML=h}
function chk(all,cur,a){return all.map(function(id){return "<label style='display:inline-block;margin:0 12px 4px 0'><input type=checkbox data-m="+id+(cur.indexOf(id)>=0?" checked":"")+"> "+esc(LBL[id]||id)+"</label>"}).join("")}
function picked(d){return Array.from(d.querySelectorAll("[data-m]")).filter(function(x){return x.checked}).map(function(x){return x.dataset.m})}
function ed(kind,id){var isU=kind=="u",o=(isU?US:RL).filter(function(x){return x.Id==id})[0]||{},mods=csv(isU?o.Modules:o.Moduly),all=modAll(),star=!isU&&o.Moduly=="*";
 var f=isU?"<label>Jméno <input id=a1 value=\""+esc(o.Title||"")+"\"></label> <label>Přihlašovací e-mail <input id=a2 type=email value=\""+esc(o.Upn||"")+"\"></label><label>Role <select id=a3><option value=\"\">Vyberte roli</option>"+RL.map(function(r){return "<option value=\""+esc(r.Title)+"\""+(r.Title==o.Role?" selected":"")+">"+esc(r.Nazev)+"</option>"}).join("")+"</select></label> <label><input type=checkbox id=a4"+(o.Beta=="ano"?" checked":"")+"> beta verze</label> <label><input type=checkbox id=active"+(o.Active!==false?" checked":"")+"> Aktivní účet</label>"
 :"<label>Kód role <input id=a1 value=\""+esc(o.Title||"")+"\""+(o.Id?" disabled":"")+"></label> <label>Název <input id=a2 value=\""+esc(o.Nazev||"")+"\"></label><label><input type=checkbox id=a5"+(star?" checked":"")+"> všechny moduly</label>";
 var d=GR.modal("<h2>"+(isU?"Uživatel":"Role")+"</h2><div class=row>"+f+"</div><p><b>Moduly</b> <span class=note>(vždy dostupné: přehled, průvodce, pravidla AI, AI nastavení, úlohy)</span></p>"+chk(all,star?all:mods)+"<p class=note id=em></p><div class=gm-r><button class=b id=ok>Uložit</button><button class=g id=x>Zavřít</button></div>",true);
 d.querySelector("#x").onclick=GR.closeModal;
 d.querySelector("#ok").onclick=async function(){var b=this,em=d.querySelector("#em"),v=function(i){var e=d.querySelector(i);return e?e.value.trim():""},ms=picked(d).join(",");b.disabled=true;
  try{if(isU){var email=v("#a2").toLowerCase(),role=v("#a3"),active=d.querySelector("#active").checked;
   if(!email||!d.querySelector("#a2").checkValidity())throw new Error("Doplňte platný přihlašovací e-mail.");
   if(US.some(function(u){return u.Id!==o.Id&&String(u.Upn||"").trim().toLowerCase()===email}))throw new Error("Účet už je evidovaný.");
   if(!RL.some(function(r){return r.Title===role}))throw new Error("Vyberte roli.");
   var signed=String(acc.username||"").toLowerCase();
   if(String(o.Upn||"").trim().toLowerCase()===signed&&(email!==signed||role!=="vlastnik"||!active))throw new Error("Aktuální účet vlastníka musí zůstat aktivní.");
   var body={Title:v("#a1")||v("#a2"),Upn:email,Role:role,Beta:d.querySelector("#a4").checked?"ano":"ne",Modules:ms,Active:active};body.Status=active?"AKTIVNI":"NEAKTIVNI";if(o.Note&&/Navrhovan/.test(o.Note))body.Note="Role potvrzena vlastníkem.";await put("Uživatelé",o.Id||0,body)}
  else{if(!v("#a1"))throw new Error("Doplňte kód role.");var star2=d.querySelector("#a5").checked;var body2={Moduly:star2?"*":ms,Nazev:v("#a2")||v("#a1")};if(!o.Id)body2.Title=v("#a1");await put("RoleAplikace",o.Id||0,body2)}
  GR.closeModal();window._prDone=false;go("sprava")}catch(e){b.disabled=false;em.textContent="Nezapsalo se: "+e.message}}}
function spravaM(){if(!$("#tb"))return;tab();var mn=$("#main");mn.onclick=function(e){var t=e.target,ds=t.dataset||{};if(ds.s){TAB=ds.s;mn.querySelectorAll("[data-s]").forEach(function(x){x.classList.toggle("on",x.dataset.s==TAB)});tab()}else if(ds.u!=null)ed("u",ds.u);else if(ds.r!=null)ed("r",ds.r)}}
window.MODS=window.MODS||{};window.MODS.sprava=[sprava,spravaM];
})();
