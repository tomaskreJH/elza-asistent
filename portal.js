/* Portál zákazníka ELZY: čte jen zveřejněná data z webu PortalELZA2 podle práv přihlášeného zákazníka. Nic nezapisuje. */
(function(){
var CID="7822640e-2537-46eb-8db1-830d38fff665",TEN="35c5f53c-ce94-445a-b877-54965e3be6d3",HOME="https://tomaskrejh.github.io/elza-asistent/",SP="https://elzycz.sharepoint.com",PS="/sites/PortalELZA2";
var $=function(s){return document.querySelector(s)};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function dt(d){return d?new Date(d).toLocaleDateString("cs-CZ"):""}
var DEMO=/[?&]demo=1/.test(location.search),m,acc,tok,P={},D={zak:[],mil:[],cek:[]},view="prehled";
var DEF={nazev:"",barva:"#d9261c",logo:"",uvitani:"Dobrý den, {jmeno}. Tady vidíte, jak postupují vaše zakázky a na co čekáme.",moduly:"prehled,zakazky,cekani,terminy,kontakt",kontaktJmeno:"Tomáš Krejčí",kontaktEmail:"",kontaktTelefon:""};
var MODS={prehled:"Přehled",zakazky:"Zakázky",cekani:"Čekání",terminy:"Termíny",kontakt:"Váš kontakt"};
function demoData(){var t=Date.now(),d=function(n){return new Date(t+n*864e5).toISOString()};
P={nazev:"Ukázková firma s.r.o.",barva:"#1b6ec2",uvitani:DEF.uvitani,moduly:DEF.moduly,kontaktJmeno:"Tomáš Krejčí",kontaktEmail:"tomas.krejci@elzy.cz",kontaktTelefon:"+420 000 000 000"};
D.zak=[{Title:"Z-2026-001",Nazev:"Rekonstrukce EPS, hlavní budova",Faze:"Realizace",Misto:"Jindřichův Hradec",CoTed:"Probíhá montáž kabeláže",CoDal:"Zkušební provoz"},{Title:"Z-2026-002",Nazev:"Rozšíření kamerového systému",Faze:"Projekt",Misto:"Třeboň",CoTed:"Zpracováváme projektovou dokumentaci",CoDal:"Schválení projektu zákazníkem"}];
D.mil=[{z:"Z-2026-001",Title:"Technická dokumentace",TerminPlan:d(-12),Stav:"hotovo"},{z:"Z-2026-001",Title:"Montáž kabeláže",TerminPlan:d(9),Stav:"probíhá"},{z:"Z-2026-001",Title:"Zkušební provoz",TerminPlan:d(34),Stav:"plán"},{z:"Z-2026-002",Title:"Projekt",TerminPlan:d(-2),Stav:"probíhá"},{z:"Z-2026-002",Title:"Schválení",TerminPlan:d(20),Stav:"plán"}];
D.cek=[{z:"Z-2026-002",NaKoho:"zákazník",Blokuje:"Schválení projektu nelze zahájit bez vašeho vyjádření.",TerminOdpovedi:d(5),Stav:"čeká"}]}
async function token(){try{tok=(await m.acquireTokenSilent({scopes:[SP+"/AllSites.Read"],account:acc})).accessToken}catch(e){await m.acquireTokenRedirect({scopes:[SP+"/AllSites.Read"],account:acc})}}
async function get(l,q,opt){await token();var r=await fetch(SP+PS+"/_api/web/lists/getbytitle('"+l+"')/items?$top=500&"+q,{headers:{Authorization:"Bearer "+tok,Accept:"application/json;odata=nometadata"}});if(!r.ok){if(opt)return[];throw new Error(l+": HTTP "+r.status)}return(await r.json()).value}
var pub=function(x){return x.Publikace=="publikovano"};
async function live(){var a=await Promise.all([get("Prehled","$select=Title,Nazev,Faze,Misto,CoTed,CoDal,Publikace"),get("Milniky","$select=Title,TerminPlan,TerminOdhad,Stav,Publikace,KodZakazky/Title&$expand=KodZakazky"),get("Cekani","$select=NaKoho,Blokuje,TerminOdpovedi,Stav,Publikace,KodZakazky/Title&$expand=KodZakazky"),get("ProfilZakaznika","$select=Title",true)]);
D.zak=a[0].filter(pub);D.mil=a[1].filter(pub).map(function(x){x.z=x.KodZakazky&&x.KodZakazky.Title;return x});D.cek=a[2].filter(pub).map(function(x){x.z=x.KodZakazky&&x.KodZakazky.Title;return x});
var mail=(acc.username||"").toLowerCase(),pr=a[3].filter(function(x){return String(x.Email||x.Title||"").toLowerCase().split(/[;, ]+/).indexOf(mail)>=0})[0];P=Object.assign({},pr||{})}
function cfg(k){return P[k]||DEF[k]}
function theme(){var c=cfg("barva");if(/^#[0-9a-f]{6}$/i.test(c))document.documentElement.style.setProperty("--a",c);var lg=cfg("logo");if(/^https:\/\//.test(lg))$("#logo").innerHTML='<img alt="" src="'+esc(lg)+'">';$("#cn").textContent=cfg("nazev");document.title=(cfg("nazev")?cfg("nazev")+" · ":"")+"Portál zákazníka ELZY"}
function mods(){return cfg("moduly").split(",").map(function(s){return s.trim()}).filter(function(s){return MODS[s]})}
function nav(){$("#nav").innerHTML=mods().map(function(k){return'<button class="'+(k==view?"on":"")+'" data-v='+k+'>'+MODS[k]+"</button>"}).join("")}
var done=function(s){return /hotov|splnen|dokonc|done/i.test(s||"")},late=function(x){return !done(x.Stav)&&x.TerminPlan&&new Date(x.TerminPlan)<new Date()};
function sem(x){return done(x.Stav)?'<span class=ok>hotovo</span>':late(x)?'<span class=r>po termínu</span>':'<span class=w>'+esc(x.Stav||"plán")+'</span>'}
function tline(ms){ms=ms.filter(function(x){return x.TerminPlan}).sort(function(a,b){return new Date(a.TerminPlan)-new Date(b.TerminPlan)});if(!ms.length)return"";
var t0=new Date(ms[0].TerminPlan).getTime(),t1=new Date(ms[ms.length-1].TerminPlan).getTime(),n=Date.now();t0=Math.min(t0,n);t1=Math.max(t1,n);var sp=(t1-t0)||1,px=function(t){return 3+94*(t-t0)/sp};
return'<div class=tl><div class=today style="left:'+px(n)+'%"></div>'+ms.map(function(x,i){var l=px(new Date(x.TerminPlan).getTime());return'<div class="d '+(done(x.Stav)?"ok":late(x)?"late":"")+'" style="left:'+l+'%" title="'+esc(x.Title+" "+dt(x.TerminPlan))+'"></div><div class=t style="left:'+l+'%;'+(i%2?"top:26px":"")+'">'+esc(x.Title)+" "+dt(x.TerminPlan)+"</div>"}).join("")+"</div>"}
function V(){var h="";
if(view=="prehled"){var wc=D.cek.filter(function(x){return !/zavren|vyresen|hotov/i.test(x.Stav||"")}),nx=D.mil.filter(function(x){return !done(x.Stav)&&x.TerminPlan&&new Date(x.TerminPlan)>=new Date(new Date().toDateString())}).sort(function(a,b){return new Date(a.TerminPlan)-new Date(b.TerminPlan)})[0];
h='<div class=hero><h1>'+esc(cfg("nazev")||"Vaše zakázky")+'</h1><p class=note style="margin:6px 0 0">'+esc(cfg("uvitani").replace("{jmeno}",(acc&&acc.name||"").split(" ")[0]||"vítejte"))+'</p></div><div class=grid><div class=card><span class=note>Aktivní zakázky</span><b class=n>'+D.zak.length+'</b></div><div class=card><span class=note>Čekáme na vás</span><b class="n '+(wc.length?"w":"")+'">'+wc.filter(function(x){return /z[aá]k/i.test(x.NaKoho||"")}).length+'</b></div><div class=card><span class=note>Nejbližší termín</span><b class=n style="font-size:20px">'+(nx?esc(nx.Title)+"<br>"+dt(nx.TerminPlan):"žádný")+'</b></div></div><h2>Vaše zakázky</h2>'+D.zak.map(zk).join("")}
else if(view=="zakazky")h='<h1>Zakázky</h1>'+(D.zak.map(zk).join("")||'<p class=note>Zatím tu nic není.</p>');
else if(view=="cekani")h='<h1>Na co se čeká</h1>'+(D.cek.length?'<table><tr><th>Zakázka<th>Kdo<th>Co blokuje<th>Termín</tr>'+D.cek.map(function(x){return"<tr><td>"+esc(x.z)+"<td>"+esc(x.NaKoho)+"<td>"+esc(x.Blokuje)+"<td>"+dt(x.TerminOdpovedi)+"</tr>"}).join("")+"</table>":'<p class=note>Nic nečeká, vše běží.</p>');
else if(view=="terminy")h='<h1>Termíny</h1><table><tr><th>Termín<th>Zakázka<th>Milník<th>Stav</tr>'+D.mil.slice().sort(function(a,b){return new Date(a.TerminPlan)-new Date(b.TerminPlan)}).map(function(x){return"<tr><td>"+dt(x.TerminPlan)+"<td>"+esc(x.z)+"<td>"+esc(x.Title)+"<td>"+sem(x)+"</tr>"}).join("")+"</table>";
else h='<h1>Váš kontakt v ELZY</h1><div class=card><b>'+esc(cfg("kontaktJmeno"))+'</b><br>'+(cfg("kontaktEmail")?'<a href="mailto:'+esc(cfg("kontaktEmail"))+'">'+esc(cfg("kontaktEmail"))+"</a><br>":"")+(cfg("kontaktTelefon")?'<a href="tel:'+esc(String(cfg("kontaktTelefon")).replace(/[^+\d]/g,""))+'">'+esc(cfg("kontaktTelefon"))+"</a>":"")+'</div>';
$("#main").innerHTML=h}
function zk(z){var ms=D.mil.filter(function(x){return x.z==z.Title});return'<div class=zk><h3>'+esc(z.Nazev||z.Title)+'</h3><span class=tag>'+esc(z.Title)+'</span> <span class=tag>'+esc(z.Faze||"")+'</span> <span class=note>'+esc(z.Misto||"")+"</span>"+(z.CoTed?"<p><b>Teď:</b> "+esc(z.CoTed)+(z.CoDal?"<br><b>Dál:</b> "+esc(z.CoDal):"")+"</p>":"")+tline(ms)+"</div>"}
function go(v){view=v;nav();V()}
async function start(){if(DEMO){$("#demo").hidden=false;demoData();theme();go("prehled");return}
m=new msal.PublicClientApplication({auth:{clientId:CID,authority:"https://login.microsoftonline.com/"+TEN,redirectUri:HOME},cache:{cacheLocation:"sessionStorage"}});
try{await m.handleRedirectPromise()}catch(e){}
acc=m.getAllAccounts()[0];if(!acc){$("#main").innerHTML='<div class=hero><h1>Portál zákazníka ELZY</h1><p class=note>Přihlaste se účtem, který vám ELZY zřídila.</p><button class=b id=in>Přihlásit se</button></div>';$("#in").onclick=function(){localStorage.setItem("elzaPortal","1");m.loginRedirect({scopes:["User.Read"],extraScopesToConsent:[SP+"/AllSites.Read"]})};return}
localStorage.removeItem("elzaPortal");m.setActiveAccount(acc);try{await live()}catch(e){$("#main").innerHTML='<p class=r>'+esc(e.message)+'</p><p class=note>Pokud se zpráva opakuje, napište nám a přístup zkontrolujeme.</p>';return}theme();go("prehled")}
document.addEventListener("click",function(e){var b=e.target.closest("[data-v]");if(b)go(b.dataset.v)});
start()})();
