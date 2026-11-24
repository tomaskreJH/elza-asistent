/* ELZA Asistent: Proces nabídky a připojení objektu (0.71.0). Procesní model, ze kterého ELZA a Elzáčci přebírají část práce obchodu:
   kroky mají vstupy, výstup, odpovědnou stranu a závislosti. Čekání na jeden krok nezastaví kroky, které na něm nezávisejí.
   Co Elzáček zvládne (koncept nabídky, dotazy, odpověď, přidělení technika), připraví sám; když nemá vstup (cenu, rozhodnutí), úkol padne obchodu.
   Cenu a obchodní podmínky určuje vždy obchod, ELZA je jen připraví k doplnění. Nic se neodešle bez výslovného souhlasu.
   Čistá logika: test/proces.test.js. Stav kroků se ukládá do seznamu ProcesStav (Správa → Seznamy). */
(function(){var W=typeof window!="undefined"?window:globalThis;
/* fakta o případu = klíče, které se odškrtávají; krok je hotový, když platí jeho fakt (f) */
var FAKTA=[["poptavka","Poptávka přijata a případ založen"],["nabidka1","První nabídka odeslána"],["vyber","Zákazník nás vybral"],["hovor","Upřesňující hovor proběhl"],["obhlidkaPlan","Termín obhlídky potvrzen"],["obhlidka","Obhlídka provedena"],
 ["dokumZd","Dokumentace zdolávání požáru k dispozici"],["pbr","PBŘ k dispozici"],["urad","Žádost o schválení a stanovisko odeslána"],["dzp","Operativní karta (DZP) schválena HZS"],["ktpo","KTPO a OPPO k dispozici"],["ustredna","Typ ústředny zjištěn"],["prenos","Dvě přenosové cesty zajištěny"],["kontakty","Kontakty a odpovědné osoby zákazníka"],["nabSchv","Nabídka schválena zákazníkem"],["real","Montáž a zprovoznění provedeny"],["pco","Objekt připojen na PCO HZS"]];
/* kdo: obchod | technik | zakaznik | ozo | projektant | elza (Elzáček připraví sám, člověk jen schválí)
   z: závislosti (fakta, která musí platit dřív); n: co ELZY může nabídnout, když krok zdržuje; pot: co Elzáček potřebuje od člověka (když to chybí, padne to obchodu) */
var KROKY=[
 {id:"nab1",t:"První nabídka (stručná, přehledná, odkaz na další kolo)",kdo:"elza",f:"nabidka1",z:["poptavka"],pot:["cena"],ob:"nabidka"},
 {id:"hovor",t:"Upřesnění po výběru zákazníkem (hovor, dotazy k instalaci)",kdo:"technik",f:"hovor",z:["vyber"]},
 {id:"term",t:"Termín obhlídky: kalendář, technik, potvrzení zákazníkem",kdo:"elza",f:"obhlidkaPlan",z:["vyber"],pot:[]},
 {id:"obh",t:"Obhlídka na místě",kdo:"technik",f:"obhlidka",z:["obhlidkaPlan"]},
 {id:"dokumZd",t:"Dokumentace zdolávání požáru",kdo:"zakaznik",f:"dokumZd",z:[],n:"Zpracujeme my: dokumentaci zpracuje náš OZO PO."},
 {id:"pbr",t:"Požárně bezpečnostní řešení (PBŘ)",kdo:"zakaznik",f:"pbr",z:[],n:"Zajistíme my: projektant ELZY zpracuje PBŘ i v průběhu, i když na začátku nebylo požadováno."},
 {id:"ktpo",t:"KTPO a OPPO",kdo:"zakaznik",f:"ktpo",z:[],n:"Zajistíme my: kontrolu a podklady zpracuje náš OZO PO."},
 {id:"ustr",t:"Typ ústředny EPS a servisní podpora",kdo:"technik",f:"ustredna",z:["obhlidka"]},
 {id:"prenos",t:"Dvě přenosové cesty (internet, záloha LTE/GPRS)",kdo:"technik",f:"prenos",z:["obhlidka"]},
 {id:"kont",t:"Kontakty a odpovědné osoby zákazníka",kdo:"zakaznik",f:"kontakty",z:[]},
 {id:"urad",t:"Žádost o schválení a stanovisko pro úřad a HZS",kdo:"projektant",f:"urad",z:["pbr"],n:"Zpracujeme a odešleme za zákazníka."},
 {id:"dzp",t:"Schválení operativní karty (DZP) HZS",kdo:"ozo",f:"dzp",z:["dokumZd","urad"],n:"Zákazník má vlastní OZO PO; pokud to zdržuje, zpracujeme DZP my (zaměstnanec s OZO PO)."},
 {id:"nabf",t:"Konečná nabídka a schválení zákazníkem",kdo:"obchod",f:"nabSchv",z:["obhlidka"],ob:"nabidka"},
 {id:"real",t:"Montáž a zprovoznění",kdo:"technik",f:"real",z:["nabSchv","obhlidka"]},
 {id:"pco",t:"Připojení objektu na PCO HZS",kdo:"technik",f:"pco",z:["dzp","real","prenos"]}];
var KDO={elza:"ELZA (Elzáček připraví, člověk schválí)",obchod:"obchod",technik:"technik",zakaznik:"zákazník",ozo:"OZO PO",projektant:"projektant"};
function jmFakt(k){var r=FAKTA.filter(function(x){return x[0]==k})[0];return r?r[1]:k}
function krokPodleFaktu(k){return KROKY.filter(function(x){return x.f==k})[0]}
/* stav každého kroku: hotovo | ted (lze dělat hned) | ceka (čeká na jiný krok; nic jiného nezastavuje) */
function stav(fakta){fakta=fakta||{};return KROKY.map(function(k){if(fakta[k.f])return{k:k,s:"hotovo",ceka:[]};var c=(k.z||[]).filter(function(z){return !fakta[z]});return{k:k,s:c.length?"ceka":"ted",ceka:c.map(jmFakt)}})}
/* přehled: co lze dělat hned (rozdělené na práci pro ELZU a pro lidi), na co se čeká a co můžeme zákazníkovi nabídnout */
function dalsi(fakta){var st=stav(fakta),ted=st.filter(function(x){return x.s=="ted"}),ceka=st.filter(function(x){return x.s=="ceka"});
 return{ted:ted,elza:ted.filter(function(x){return x.k.kdo=="elza"}),lide:ted.filter(function(x){return x.k.kdo!="elza"}),ceka:ceka,hotovo:st.filter(function(x){return x.s=="hotovo"}).length,celkem:st.length,
  nabidnout:st.filter(function(x){return x.s!="hotovo"&&x.k.n&&x.k.kdo!="obchod"}).map(function(x){return{krok:x.k.t,text:x.k.n,zdrzuje:st.filter(function(y){return y.s!="hotovo"&&(y.k.z||[]).indexOf(x.k.f)>=0}).map(function(y){return y.k.t})}})}}
/* kdo přebírá práci: Elzáček připraví, co jde; chybějící vstup (cena, rozhodnutí) padá obchodu. Vrací {elza:[...], obchod:[...]} */
function rozdel(krok,ctx){ctx=ctx||{};var chybi=(krok.pot||[]).filter(function(p){return !ctx[p]});return{krok:krok.id,elzaPripravi:true,obchod:chybi.length?chybi:[],eskaluj:chybi.length>0}}
function eskalace(krok,duvod,ctx){ctx=ctx||{};return{Title:"Obchod: "+krok.t+(ctx.zakaznik?" ("+ctx.zakaznik+")":""),KodZakazky:ctx.zak||"",Resitel:ctx.obchod||"",Poznamka:"ELZA to nezvládne sama: "+(duvod||"chybí vstup od obchodu")+". Připravený podklad je v případu."}}
/* První nabídka: krátká, přehledná, s odkazem na další kolo; cenu doplní obchod (nikdy ji ELZA nevymýšlí).
   Druhá část je strojově čitelná pro AI zákazníka, který nabídky porovnává: co je proces, co ještě bude potřeba zařídit, kdo to zajistí a co nabízíme. */
function nabidkaKoncept(ctx,fakta){ctx=ctx||{};var d=dalsi(fakta||{poptavka:1}),zbyva=d.ceka.concat(d.ted).filter(function(x){return x.k.kdo!="obchod"&&x.k.id!="nab1"});
 var cena=ctx.cena?ctx.cena:"[cenu doplní obchod]",ods=ctx.odkaz||"[odkaz na další kolo jednání doplní obchod]";
 var pot=zbyva.filter(function(x){return x.k.kdo=="zakaznik"||x.k.n}).map(function(x){return x.k});
 var t="Dobrý den,\n\nděkujeme za poptávku"+(ctx.zakaznik?" ("+ctx.zakaznik+")":"")+". Navrhujeme připojení objektu na PCO HZS "+(ctx.kraj||"JHC")+" přes internet se zálohou LTE/GPRS.\n\nCena: "+cena+"\n\nCo bude potřeba dál (stručně):\n"+(pot.length?pot.slice(0,5).map(function(k){return "- "+k.t}).join("\n"):"- upřesníme po krátkém hovoru")+"\n\nPostup je proces o několika krocích, ne jednorázová dodávka. Podrobné podmínky a další kolo jednání: "+ods+"\n\nS pozdravem\n"+(ctx.podpis||"")+"\nELZY, spol. s r.o.";
 var m="--- STROJOVĚ ČITELNÉ (pro porovnání nabídek) ---\nnabidka: připojení objektu EPS na PCO HZS\nproces: vícekrokový, kroky nejsou součástí paušálu, pokud není uvedeno jinak\n"+KROKY.filter(function(k){return k.id!="nab1"&&k.id!="nabf"}).map(function(k){return "krok: "+k.t+"; zajistí: "+KDO[k.kdo]+(k.z&&k.z.length?"; závisí na: "+k.z.map(jmFakt).join(", "):"")+(k.n?"; ELZY nabízí: "+k.n:"")}).join("\n")+"\nnavazujici_kolo: "+ods;
 return{predmet:"Nabídka připojení na PCO HZS"+(ctx.zakaznik?" – "+ctx.zakaznik:""),telo:t,strojove:m,obchodDoplni:[ctx.cena?"":"cena",ctx.odkaz?"":"odkaz na další kolo"].filter(Boolean)}}
/* kalendář: překryv intervalů (ISO řetězce), volný technik, posun termínu */
function t(x){return typeof x=="number"?x:new Date(x).getTime()}
function koliduje(slot,obs){return (obs||[]).some(function(o){return t(o.od)<t(slot.do)&&t(slot.od)<t(o.do)})}
function min(obs,den){var s=0;(obs||[]).forEach(function(o){if(String(o.od).slice(0,10)==den)s+=(t(o.do)-t(o.od))/6e4});return s}
/* rozhodnutí při plánování obhlídky: ponechat výchozího technika, vzít jiného (podle skupiny a vytížení), nebo posunout */
function navrhTechnika(slot,vychozi,ostatni,potrebnaSkupina){var sk=potrebnaSkupina||"EPS",den=String(slot.od).slice(0,10);
 if(vychozi&&!koliduje(slot,vychozi.obsazen))return{rozhodnuti:"ponechat",technik:vychozi.jmeno,email:vychozi.email||"",duvod:"Výchozí technik je v termínu volný.",alternativy:[]};
 var vol=(ostatni||[]).filter(function(o){return (o.skupiny||[]).indexOf(sk)>=0&&!koliduje(slot,o.obsazen)}).sort(function(a,b){return min(a.obsazen,den)-min(b.obsazen,den)});
 if(vol.length)return{rozhodnuti:"jiny",technik:vol[0].jmeno,email:vol[0].email||"",duvod:(vychozi?vychozi.jmeno+" je v termínu obsazen; ":"")+vol[0].jmeno+" ze skupiny "+sk+" je volný"+(vol.length>1?" (další volní: "+vol.slice(1).map(function(x){return x.jmeno}).join(", ")+")":"")+". Vlastní akci není nutné posouvat.",alternativy:[]};
 var alt=[];for(var i=1;i<=7&&alt.length<3;i++){var d=new Date(t(slot.od)+i*864e5);if(d.getDay()==0||d.getDay()==6)continue;var s2={od:d.getTime(),do:d.getTime()+(t(slot.do)-t(slot.od))},k=[vychozi].concat(ostatni||[]).filter(function(o){return o&&(o===vychozi||(o.skupiny||[]).indexOf(sk)>=0)&&!koliduje(s2,o.obsazen)})[0];if(k)alt.push({od:new Date(s2.od).toISOString(),technik:k.jmeno})}
 return{rozhodnuti:"posunout",technik:"",duvod:"V termínu není volný technik skupiny "+sk+". Navrhněte zákazníkovi jiný termín.",alternativy:alt}}
/* koncept odpovědi podle toho, od koho zpráva přišla (role z vlakno.js) */
function konceptOdpovedi(role,ctx){ctx=ctx||{};var r=String(role||""),podpis="\n\nTomáš",d=dalsi(ctx.fakta||{}),co=d.lide.slice(0,3).map(function(x){return "- "+x.k.t+" ("+KDO[x.k.kdo]+")"}).join("\n");
 if(/zákazník|externí/.test(r))return"Dobrý den,\n\nděkujeme za zprávu. "+(ctx.odpoved||"[odpověď doplní řešitel]")+"\n\nDalší krok: "+(d.lide[0]?d.lide[0].k.t:"upřesníme")+"."+"\n\nS pozdravem\nELZY, spol. s r.o.";
 if(/ředitel/.test(r))return"Dobrý den,\n\nstav: "+d.hotovo+" z "+d.celkem+" kroků hotovo. Teď běží:\n"+(co||"- nic nečeká na člověka")+"\nPotřebuji od vás: "+(ctx.potrebuji||"nic, jen informace")+"."+podpis;
 if(/obchod/.test(r))return"Ahoj,\n\nprosím o: "+(ctx.zadani||"[zadání: co, do kdy]")+".\nPodklady jsou v případu"+(ctx.zak?" "+ctx.zak:"")+". Cenu a podmínky určuješ ty.\nTermín: "+(ctx.do||"[doplnit]")+"."+podpis;
 return"Ahoj,\n\n"+(ctx.odpoved||"[odpověď doplní řešitel]")+podpis}
/* zápis telefonátu do časové osy případu a podklad pro obchod */
function hovorZaznam(o){o=o||{};return{typ:"Hovor",popis:"Hovor s "+(o.kdo||"zákazníkem")+": "+(o.vysledek||"")+(o.obchodPosle?" | obchod má poslat: "+o.obchodPosle:""),min:+o.min||0,fakta:{hovor:true}}}
W.PROCES={FAKTA:FAKTA,KROKY:KROKY,KDO:KDO,stav:stav,dalsi:dalsi,rozdel:rozdel,eskalace:eskalace,nabidkaKoncept:nabidkaKoncept,navrhTechnika:navrhTechnika,konceptOdpovedi:konceptOdpovedi,hovorZaznam:hovorZaznam,koliduje:koliduje,krokPodleFaktu:krokPodleFaktu};
if(typeof module!="undefined")module.exports=W.PROCES;
if(typeof window=="undefined"||!window.document)return;
function es(s){return typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var L="ProcesStav",ST={zak:"",fakta:{},id:0,msg:"",out:"",pri:[],kdo:""},EL=null;
function demo(){return !window.SDL||SDL.demo()}
if(window.SDL&&window.SEZ&&SEZ.S&&SEZ.S[L])SDL.def(L,SEZ.S[L],"ELZA asistent: Proces nabídky, stav kroků");
async function nacti(){ST.fakta={};ST.id=0;if(!ST.zak||demo())return;try{var r=await SDL.read(L,"WorkId eq '"+String(ST.zak).replace(/'/g,"''")+"'");if(r&&r.length){var x=r[r.length-1];ST.id=x.Id;ST.fakta=JSON.parse(x.Fakta||"{}")}}catch(e){ST.msg="Stav kroků nejde načíst: "+e.message}}
async function uloz(){if(!ST.zak||demo())return;try{var b={Title:"Proces | "+ST.zak,WorkId:ST.zak,Fakta:JSON.stringify(ST.fakta),Stav:"aktivni"};await SDL.write(L,ST.id,b);if(!ST.id)await nacti()}catch(e){ST.msg="Stav se neuložil: "+e.message+" (seznam ProcesStav se zakládá ve Správa → Seznamy)"}}
function ctx(){var c=ST.pri.filter(function(x){return x.id==ST.zak})[0]||{};return{zak:ST.zak,zakaznik:c.nazev||"",podpis:String((window.acc&&acc.name)||"").split(" ")[0],fakta:ST.fakta,cena:(document.getElementById("pc")||{}).value||"",odkaz:(document.getElementById("po")||{}).value||""}}
function draw(){if(!EL)return;var d=dalsi(ST.fakta),h='<h1>Proces nabídky a připojení</h1><p class=note>Každý případ jde svým postupem. Odškrtejte, co už platí; ELZA ukáže, co lze dělat hned, na co se čeká (a že to nic jiného nezastaví) a co můžete zákazníkovi nabídnout. Co zvládne připravit Elzáček, připraví; co nezvládne (cena, rozhodnutí), předá obchodu. Nic se neodešle bez vašeho souhlasu.</p>';
 h+='<div class=card><label>Případ<select id=pz><option value="">(vybrat)</option>'+ST.pri.map(function(c){return '<option value="'+es(c.id)+'"'+(c.id==ST.zak?' selected':'')+'>'+es(c.id+' '+(c.nazev||''))+'</option>'}).join('')+'</select></label></div>';
 h+='<div class=card><h3>Fakta o případu ('+d.hotovo+' z '+d.celkem+' kroků hotovo)</h3>'+FAKTA.map(function(f){return '<label style="display:block"><input type=checkbox data-f="'+f[0]+'"'+(ST.fakta[f[0]]?' checked':'')+'> '+es(f[1])+'</label>'}).join('')+'</div>';
 h+='<div class=card><h3>Můžete dělat hned</h3>'+(d.ted.length?'<ul>'+d.ted.map(function(x){return '<li><b>'+es(x.k.t)+'</b> – '+es(KDO[x.k.kdo])+'</li>'}).join('')+'</ul>':'<p class=note>Nic nečeká na vás, vše běží nebo čeká na jiné.</p>')+'</div>';
 h+='<div class=card><h3>Čeká se (ostatní kroky tím nejsou zastaveny)</h3>'+(d.ceka.length?'<ul>'+d.ceka.map(function(x){return '<li>'+es(x.k.t)+' – čeká na: '+es(x.ceka.join(', '))+'</li>'}).join('')+'</ul>':'<p class=note>Nic.</p>')+'</div>';
 if(d.nabidnout.length)h+='<div class=card><h3>Co můžeme zákazníkovi nabídnout</h3><ul>'+d.nabidnout.map(function(n){return '<li><b>'+es(n.krok)+'</b>: '+es(n.text)+(n.zdrzuje.length?' <small>Zdržuje: '+es(n.zdrzuje.join('; '))+'</small>':'')+'</li>'}).join('')+'</ul></div>';
 h+='<div class=card><h3>Práce za obchod</h3><label>Cena (doplní obchod)<input id=pc></label><label>Odkaz na další kolo<input id=po></label><p><button class=b id=pn>Koncept první nabídky</button> <button class=b id=pe>Předat obchodu</button></p><h4>Hovor</h4><label>S kým a výsledek<input id=ph></label><label>Co má obchod poslat<input id=pp></label><p><button class=b id=pa>Zapsat hovor</button></p><h4>Termín obhlídky</h4><label>Začátek<input id=pt type=datetime-local></label><label>Technici (jméno;e-mail;skupina, jeden na řádek)<textarea id=pl rows=3></textarea></label><p><button class=b id=pk>Navrhnout technika</button></p></div>';
 h+='<div class=card id=pout>'+(ST.msg?'<p class=note>'+es(ST.msg)+'</p>':'')+ST.out+'</div>';EL.innerHTML=h;
 EL.querySelector("#pz").onchange=async function(){ST.zak=this.value;ST.out="";await nacti();draw()};
 EL.querySelectorAll("[data-f]").forEach(function(c){c.onchange=async function(){ST.fakta[c.dataset.f]=c.checked;await uloz();draw()}});
 var ps=function(id){return (EL.querySelector(id)||{}).value||""};
 EL.querySelector("#pn").onclick=function(){var n=nabidkaKoncept(ctx(),ST.fakta);ST.out='<h4>'+es(n.predmet)+'</h4><textarea rows=14 style="width:100%">'+es(n.telo+"\n\n"+n.strojove)+'</textarea>'+(n.obchodDoplni.length?'<p class=note>Chybí od obchodu: '+es(n.obchodDoplni.join(', '))+'. Použijte Předat obchodu.</p>':'');ST.msg="";draw()};
 EL.querySelector("#pe").onclick=async function(){var k=KROKY[0],c=ctx(),r=rozdel(k,{cena:c.cena});try{if(demo())throw new Error("V ukázkovém režimu se úkol nezapisuje.");var e=eskalace(k,r.obchod.length?"chybí: "+r.obchod.join(", "):"ke schválení",c),i=new Date().toISOString().slice(0,10);await SDL.write("Ukol",0,{Title:e.Title,KodZakazky:e.KodZakazky,Resitel:e.Resitel,Od:i,Do:i,Hotovo:0,Poznamka:e.Poznamka});ST.msg="Úkol pro obchod založen."}catch(x){ST.msg="Chyba: "+x.message}draw()};
 EL.querySelector("#pa").onclick=async function(){var z=hovorZaznam({vysledek:ps("#ph"),obchodPosle:ps("#pp")});try{if(!ST.zak)throw new Error("Vyberte případ.");if(!window.pripadyAkt||demo())throw new Error("V ukázkovém režimu se hovor nezapisuje.");await pripadyAkt(ST.zak,z.typ,0,z.popis,"Proces");ST.fakta.hovor=true;await uloz();ST.msg="Hovor zapsán do časové osy případu."}catch(x){ST.msg="Chyba: "+x.message}draw()};
 EL.querySelector("#pk").onclick=function(){var v=ps("#pt");if(!v){ST.msg="Zadejte začátek obhlídky.";return draw()}var od=new Date(v).getTime(),sl={od:od,do:od+36e5},os=ps("#pl").split(/\n/).map(function(r){var a=r.split(";");return a[0].trim()?{jmeno:a[0].trim(),email:(a[1]||"").trim(),skupiny:[(a[2]||"EPS").trim()],obsazen:[]}:null}).filter(Boolean);
  if(!os.length){ST.msg="Zadejte aspoň jednoho technika.";return draw()}
  nactiObsazeni(os,sl).then(function(inf){var n=navrhTechnika(sl,os[0],os.slice(1),os[0].skupiny[0]);ST.out='<p><b>'+es({ponechat:"Ponechat technika",jiny:"Vzít jiného technika",posunout:"Posunout termín"}[n.rozhodnuti])+'</b>'+(n.technik?': '+es(n.technik):'')+'</p><p>'+es(n.duvod)+'</p>'+(n.alternativy.length?'<ul>'+n.alternativy.map(function(a){return '<li>'+es(new Date(a.od).toLocaleString("cs-CZ"))+' – '+es(a.technik)+'</li>'}).join('')+'</ul>':'')+'<p class=note>'+es(inf)+' Do kalendáře se zapíše až po potvrzení termínu zákazníkem a vašem souhlasu.</p>';ST.msg="";draw()})};}
/* obsazenost z kalendářů přes Graph getSchedule; bez práva ke sdíleným kalendářům zůstane prázdná (technik se bere jako volný) */
async function nactiObsazeni(os,sl){if(demo()||!window.m||!window.acc)return"Ukázkový režim: kalendáře se nečtou, všichni se berou jako volní.";var ad=os.filter(function(o){return o.email}).map(function(o){return o.email});if(!ad.length)return"Bez e-mailů techniků se kalendáře nečtou, všichni se berou jako volní.";
 try{var t=(await m.acquireTokenSilent({scopes:["Calendars.Read.Shared"],account:acc})).accessToken,r=await fetch("https://graph.microsoft.com/v1.0/me/calendar/getSchedule",{method:"POST",headers:{Authorization:"Bearer "+t,"Content-Type":"application/json",Prefer:'outlook.timezone="UTC"'},body:JSON.stringify({schedules:ad,startTime:{dateTime:new Date(sl.od-864e5*0).toISOString().slice(0,10)+"T00:00:00",timeZone:"UTC"},endTime:{dateTime:new Date(sl.od+864e5).toISOString().slice(0,10)+"T23:59:00",timeZone:"UTC"},availabilityViewInterval:30})});if(!r.ok)return"Kalendáře kolegů nejde přečíst (HTTP "+r.status+"), všichni se berou jako volní; vyžaduje právo ke sdíleným kalendářům.";
  (await r.json()).value.forEach(function(s){var o=os.filter(function(x){return x.email.toLowerCase()==String(s.scheduleId).toLowerCase()})[0];if(o)o.obsazen=(s.scheduleItems||[]).filter(function(i){return i.status!="free"}).map(function(i){return{od:i.start.dateTime+"Z",do:i.end.dateTime+"Z"}})});return"Kalendáře načteny."}catch(e){return"Kalendáře nejdou načíst ("+e.message+"), všichni se berou jako volní."}}
function html(){return '<div id=prx></div>'}
function mt(){EL=document.getElementById("prx");draw();if(window.pripadySeznam)pripadySeznam().then(function(x){ST.pri=x;draw()}).catch(function(){})}
window.MODS=window.MODS||{};window.MODS.proces=[html,mt];
})();
