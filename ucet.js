/* ELZA Asistent: účet, role, průvodce a přepínač kanálu (stabilní/beta). Čte role a přístup ze SharePointu; zapisuje jen osobní nastavení přihlášeného uživatele do seznamu Uživatelé. Skrytí v aplikaci je pohodlí; skutečná ochrana dat jsou oprávnění na SharePointu. */
(function(){
var SU="Id,Title,Upn,Role,Modules,Beta,Agenti,Kanal,PruvodceHotov,Note,Status,Active";
var ALW=["dnes","prehled","pruvodce","pravidla","ainast","ulohy","navod","automatika","menu","nast"];
var ROLES=[],PRIST={},ME=null,JT="";
window.PRO=null;
var profileRun=null,profileAccount="";
var BASIC=["dnes","pruvodce","navod","nast"];
var WORK={
 technik:[["teren","Zapsat práci na místě"],["kalendar","Zkontrolovat termíny"],["zakazky","Otevřít zakázku"],["kontroly","Přejít na kontroly"]],
 obchod:[["posta","Vyřídit poptávky"],["proces","Připravit nabídku"],["pripady","Pokračovat v případu"],["kalendar","Naplánovat schůzku"]],
 projektant:[["zakazky","Otevřít projekt"],["faze","Zkontrolovat fáze"],["slozky","Otevřít dokumentaci zakázky"],["pripady","Pokračovat v případu"]],
 ozo:[["kontroly","Zkontrolovat termíny kontrol"],["teren","Zapsat kontrolu na místě"],["pripady","Otevřít případ"],["kalendar","Naplánovat kontrolu"]],
 vedouci:[["gantt","Zkontrolovat termíny zakázek"],["lidi","Otevřít přehled týmu"],["pripady","Zkontrolovat případy"],["kalendar","Otevřít kalendář"]],
 ostatni:[["posta","Vyřídit poštu"],["pripady","Pokračovat v případu"],["zakazky","Otevřít zakázku"],["teren","Zapsat práci na místě"]]
};
window.pracovniPlocha=function(){
 var p=window.PRO,role=p&&p.role;
 if(["vlastnik","jednatel","reditel"].includes(role))role="vedouci";
 var links=Object.hasOwn(WORK,role)?WORK[role]:WORK.ostatni;
 return {role:p&&p.potvrzenaRole?p.nazev:"",links:links.filter(function(item){
  return !window.hide(item[0])&&!(window.menuOff&&window.menuOff(item[0]));
 })};
};
function csv(s){return String(s||"").split(",").map(function(x){return x.trim()}).filter(Boolean)}
function guess(jt){var t=String(jt||"").toLowerCase();var m=[["ředitel","reditel"],["jednatel","jednatel"],["obchod","obchod"],["marketing","marketing"],["projekt","projektant"],["technik|montér|servis","technik"],["ozo|bozp|požár|revize","ozo"],["vedouc|manažer","vedouci"],["vývoj|programát","vyvojar"]];for(var i=0;i<m.length;i++){if(new RegExp(m[i][0]).test(t))return m[i][1]}return "ostatni"}
async function gme(){try{var t=(await m.acquireTokenSilent({scopes:["User.Read"],account:acc})).accessToken;var r=await fetch("https://graph.microsoft.com/v1.0/me?$select=jobTitle",{headers:{Authorization:"Bearer "+t}});return r.ok?((await r.json()).jobTitle||""):""}catch(e){return ""}}
async function nactiProfil(up){
 var data=await Promise.all([
  list("RoleAplikace","Title,Nazev,Moduly,Zakazano,Popis"),
  list("Pristup","Title,Citlivost"),
  list("Uživatelé",SU)
 ]);
 if(profileAccount!==up)return;
 ROLES=data[0];PRIST=Object.create(null);
 data[1].forEach(function(x){PRIST[x.Title]=x.Citlivost||""});
 var users=data[2].filter(function(x){return (x.Upn||"").trim().toLowerCase()===up});
 if(users.length>1)throw new Error("Účet má více profilů.");
 ME=users[0]||null;
 if(ME&&ME.Active===false){window.PRO={stav:"neaktivni"};window._prDone=true;return}
 var rid=(ME&&ME.Role)||"ostatni",matches=ROLES.filter(function(r){return r.Title===rid});
 if(matches.length!==1)throw new Error("Roli nelze ověřit.");
 var role=matches[0];
 var allowed=role.Moduly==="*"?null:csv(role.Moduly);
 var chosen=ME&&ME.Modules?csv(ME.Modules):null;
 var mods=chosen&&allowed?chosen.filter(function(id){return allowed.includes(id)}):chosen||allowed;
 window.PRO={role:rid,nazev:role.Nazev,allowed:allowed,mods:mods,zak:csv(role.Zakazano),
  agenti:ME&&ME.Agenti?csv(ME.Agenti):null,beta:(ME&&ME.Beta==="ano")||rid==="vlastnik"||rid==="vyvojar",
  hotovo:!!(ME&&ME.PruvodceHotov==="ano"),potvrzenaRole:!!(ME&&ME.Role)};
 window._first=!window.PRO.hotovo;
 window._prDone=true;
}
window.profilInit=async function(){
 if(!acc||tok==="demo")return;
 var up=String(acc.username||"").trim().toLowerCase();
 if(profileAccount!==up){
  profileAccount=up;profileRun=null;window.PRO=null;ME=null;
  window._prDone=false;window._first=false;window._W=null;
 }
 if(window._prDone)return;
 if(!profileRun){
  profileRun=nactiProfil(up).catch(function(){
   if(profileAccount===up){window.PRO={stav:"nedostupny"};window._first=false}
  }).finally(function(){if(profileAccount===up)profileRun=null});
 }
 return profileRun;
};
/* 0.65.0: moduly Znalostí převzaté z konzole AI_TOM (skilly, prompty, foto, brand, mapa) vidí jen vlastník a vývojář; jiné roli je zapne jen výslovný výčet v RoleAplikace.Moduly (ne „*“). */
var ZDEV=["skilly","prompty","foto","brand","mapa"];window.ZDEV=ZDEV;
window.hide=function(id){var p=window.PRO;if(tok&&tok!=="demo"){
 if(p&&p.stav==="neaktivni")return id!=="dnes"&&id!=="navod";
 if(!p||p.stav)return !BASIC.includes(id);
}if(id=="sprava")return !(p&&p.role=="vlastnik");if(p&&p.role=="vlastnik")return false;if(p&&ZDEV.indexOf(id)>=0&&p.role!="vyvojar")return !(p.allowed&&p.allowed.indexOf(id)>=0);if(!p||!p.mods)return false;if(ALW.indexOf(id)>=0)return false;return p.mods.indexOf(id)<0};
window.skillOk=function(x){var p=window.PRO;if(!p||p.stav)return tok==="demo";var t=PRIST[x.Title];return !t||p.zak.indexOf(t)<0};
window.agentOk=function(x){var p=window.PRO;return tok==="demo"||!!(p&&!p.stav&&(!p.agenti||p.agenti.includes(x.Title)))};
window.kanalBtn=function(){if(window.KANAL=="beta"||(window.PRO&&window.PRO.beta))return "<br><button class=nav data-v=_kanal>Přepnout na "+(window.KANAL=="beta"?"stabilní":"beta")+" verzi</button>";return ""};
window.prepniKanal=function(){var k=window.KANAL=="beta"?"stable":"beta";try{localStorage.setItem("elzaKanal",k)}catch(e){}location.href=location.pathname+"?kanal="+k};
/* PRŮVODCE */
async function wtok(){var W=[SP+"/AllSites.Write"];try{return (await m.acquireTokenSilent({scopes:W,account:acc})).accessToken}catch(e){return (await m.acquireTokenPopup({scopes:W,account:acc})).accessToken}}
async function ulozit(W){var t=await wtok();var h={Authorization:"Bearer "+t,Accept:"application/json;odata=nometadata","Content-Type":"application/json;odata=nometadata"};
var base=SP+SITE+"/_api/web/lists/getbytitle('"+encodeURIComponent("Uživatelé")+"')/items";
var b={Modules:W.mods.join(","),Agenti:W.ag?W.ag.join(","):"",PruvodceHotov:"ano",Kanal:window.KANAL||"stable"};if(!(ME&&ME.Role)){b.Note="Navrhovaná role: "+W.role+". Potvrdí vlastník."}
var r;if(ME){h["X-HTTP-Method"]="MERGE";h["IF-MATCH"]="*";r=await fetch(base+"("+ME.Id+")",{method:"POST",headers:h,body:JSON.stringify(b)})}else{b.Title=acc.name||acc.username;b.Upn=acc.username;b.Status="NAVRH";b.Active=true;r=await fetch(base,{method:"POST",headers:h,body:JSON.stringify(b)})}
if(!r.ok)throw new Error("HTTP "+r.status);for(var k in cache)delete cache[k];window._prDone=false;window._W=null;await window.profilInit()}
function modList(){var a=[];MENU.forEach(function(g){g[1].forEach(function(i){if(i[0][0]!=="-"&&ALW.indexOf(i[0])<0&&i[0]!=="sprava")a.push(i[0])})});return a}
async function pruvodce(){await window.profilInit();var p=window.PRO;if(tok!=="demo"&&(!p||p.stav))return "<h1>Úvodní nastavení</h1><p>Pracovní profil se nepodařilo ověřit.</p><button class=b data-v=pruvodce>Zkusit znovu</button>";if(!window._W){JT=await gme();window._W={s:0,role:"",mods:p&&p.mods?p.mods.slice():null,ag:p&&p.agenti?p.agenti.slice():null}}return "<h1>Průvodce a nastavení</h1><div id=wz></div>"}
var STEPS=["Vítejte","Pravidla AI","Vaše role","Moduly","Agenti a skilly","Pošta a kalendář","Dokončení"];
async function wz(){var W=window._W,p=window.PRO,h="<p class=note>Krok "+(W.s+1)+" z "+STEPS.length+": "+STEPS[W.s]+"</p>";
if(W.s==0){h+="<p>Průvodce vám nastaví, co v aplikaci uvidíte, aby tam bylo jen to, co používáte. Kdykoli ho můžete spustit znovu v nabídce Průvodce a nastavení.</p><p class=note>Verze "+esc(VER)+(window.KANAL=="beta"?" (beta)":" (stabilní)")+"</p>"+(p?"":"<p class=a>Role a přístup zatím nejsou ve firmě nastaveny, platí jen základ.</p>")}
else if(W.s==1){h+="<p>Než použijete jakoukoli AI, musíte potvrdit firemní pravidla používání AI. Bez potvrzení se AI nespouští.</p><button class=b data-v=pravidla>Otevřít pravidla AI</button><p class=note>Po potvrzení se sem vraťte přes Průvodce a nastavení.</p>"}
else if(W.s==2){if(p&&p.potvrzenaRole){h+="<p>Vaše role: <b>"+esc(p.nazev)+"</b>. Přidělil ji vlastník. Změnu požádejte u vedoucího.</p>"}else{var sg=W.role||guess(JT);W.role=sg;h+="<p>Vyberte svou pozici. Roli potvrdí vlastník; do té doby platí nejužší práva.</p><select id=rl>"+ROLES.filter(function(r){return r.Title!="vlastnik"}).map(function(r){return "<option value="+esc(r.Title)+(r.Title==sg?" selected":"")+">"+esc(r.Nazev)+"</option>"}).join("")+"</select><p class=note>"+esc((ROLES.filter(function(r){return r.Title==sg})[0]||{}).Popis||"")+"</p>"+(JT?"<p class=note>Ve firemním adresáři máte pozici: "+esc(JT)+"</p>":"")}}
else if(W.s==3){var al=p&&p.allowed?p.allowed:modList();var cur=W.mods||al;W.mods=cur.filter(function(x){return al.indexOf(x)>=0});h+="<p>Zapněte moduly, které budete používat.</p>"+al.map(function(id){return "<p><label><input type=checkbox data-m="+id+(W.mods.indexOf(id)>=0?" checked":"")+"> "+esc(LBL[id]||id)+"</label></p>"}).join("")}
else if(W.s==4){var ag=[],sk=[];try{ag=await list("Agenti","Title,Role");sk=await list("Skilly","Title")}catch(e){}ag=ag.filter(function(x){return window.agentOk(x)});if(!W.ag)W.ag=ag.map(function(x){return x.Title});var ok=sk.filter(function(x){return !window.skillOk||window.skillOk(x)}).length;h+="<p>Elzáčci (agenti), které chcete mít zapnuté:</p>"+ag.map(function(x){return "<p><label><input type=checkbox data-g=\""+esc(x.Title)+"\""+(W.ag.indexOf(x.Title)>=0?" checked":"")+"> "+esc(x.Title)+"</label> <span class=note>"+esc(x.Role)+"</span></p>"}).join("")+"<p class=note>Skilly dostupné pro vaši roli: "+ok+" z "+sk.length+". Zbylé jsou skryté, protože patří jiným rolím (např. ceny, smlouvy, marketing, vývoj).</p>"}
else if(W.s==5){h+="<p>V tomto kroku povolíte čtení vlastní pošty a kalendáře. Souhlas můžete dát hned, nebo později při prvním otevření.</p><button class=b data-a=cm>Povolit poštu</button> <button class=b data-a=cc>Povolit kalendář</button><p id=ws class=note></p>"}
else{h+="<p>Souhrn: role <b>"+esc(p&&p.potvrzenaRole?p.nazev:(ROLES.filter(function(r){return r.Title==W.role})[0]||{}).Nazev||"")+"</b>, moduly: "+esc((W.mods||[]).map(function(x){return LBL[x]||x}).join(", "))+"</p><button class=b data-a=sv>Uložit nastavení</button><p id=ws class=note></p>"}
h+="<p style=margin-top:16px>"+(W.s>0?"<button class=nav style=width:auto;display:inline-block data-a=bk>Zpět</button> ":"")+(W.s<STEPS.length-1?"<button class=b data-a=nx>Další</button>":"")+"</p>";
$("#wz").innerHTML=h;
var sel=$("#rl");if(sel)sel.onchange=function(e){W.role=e.target.value;wz()}}
async function pruvodceM(){if(!$("#wz"))return;await wz();$("#wz").onclick=async function(e){var W=window._W,t=e.target,a=t.dataset&&t.dataset.a;
if(t.dataset&&t.dataset.m){var i=W.mods.indexOf(t.dataset.m);if(t.checked&&i<0)W.mods.push(t.dataset.m);if(!t.checked&&i>=0)W.mods.splice(i,1);return}
if(t.dataset&&t.dataset.g){var j=W.ag.indexOf(t.dataset.g);if(t.checked&&j<0)W.ag.push(t.dataset.g);if(!t.checked&&j>=0)W.ag.splice(j,1);return}
if(a=="nx"){W.s++;wz()}else if(a=="bk"){W.s--;wz()}
else if(a=="cm"||a=="cc"){var sc=a=="cm"?["Mail.Read"]:["Calendars.Read"];try{await m.acquireTokenPopup({scopes:sc,account:acc});$("#ws").textContent="Povoleno."}catch(x){$("#ws").textContent="Nepovoleno: "+x.message}}
else if(a=="sv"){try{$("#ws").textContent="Ukládám…";await ulozit(W);$("#ws").textContent="Uloženo.";nav();go("dnes")}catch(x){$("#ws").textContent="Uložení se nezdařilo: "+x.message}}}}
window.MODS=window.MODS||{};window.MODS.pruvodce=[pruvodce,pruvodceM];
})();
