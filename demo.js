/* ELZA Asistent: ukázkový režim (?demo=1). Vymyšlená data bez připojení k Microsoftu; slouží k prohlédnutí vzhledu a k testům. Nikdy se nepoužívá pro skutečná data. */
(function(){
function p(n){return (n<10?"0":"")+n}
function lt(d){return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+"T"+p(d.getHours())+":"+p(d.getMinutes())+":00.0000000"}
function ago(h){return new Date(Date.now()-h*36e5).toISOString()}
function ad(n,e){return {emailAddress:{name:n,address:e}}}
var ME=ad("Tomáš Krejčí","tkrejci@elzy.cz");
var IMG="data:image/svg+xml;base64,"+btoa('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" fill="#102c54"/><text x="10" y="26" fill="#fff" font-size="16" font-family="Arial">ELZY</text></svg>');
var M=[
 {id:"m1",c:"c1",f:"inbox",h:3,from:ad("Jana Nováková","jana.novakova@skolka-ratiborice.cz"),subj:"Poptávka PD – rekonstrukce EPS a SLP",un:true,att:true,body:"<p>Dobrý den,</p><p>posíláme podklady k rekonstrukci školky a prosíme o nabídku na projekt EPS a SLP. Termín potřebujeme do konce ledna.</p><p>Děkuji, Jana Nováková</p>",cat:["Poptávky"]},
 {id:"m2",c:"c2",f:"inbox",h:26,from:ad("Petr Svoboda","petr.svoboda@strojirny-jh.cz"),subj:"Revize hromosvodu – termín",un:true,att:false,body:"<p>Dobrý den, kdy u nás můžete provést revizi hromosvodu? Potřebujeme to před kontrolou pojišťovny.</p><p>Svoboda</p>",flag:true},
 {id:"m3a",c:"c3",f:"inbox",h:50,from:ad("Marie Dvořáková","m.dvorakova@obec-jh.cz"),subj:"RE: Protokol o kontrole PBZ",un:false,att:true,body:"<p>Protokol posíláme v příloze, prosíme o kontrolu.</p>"},
 {id:"m3b",c:"c3",f:"sentitems",h:70,from:ME,to:[ad("Marie Dvořáková","m.dvorakova@obec-jh.cz")],subj:"Protokol o kontrole PBZ",un:false,att:false,body:"<p>Dobrý den, v příloze protokol o kontrole PBZ. S pozdravem Tomáš Krejčí</p>"},
 {id:"m4",c:"c4",f:"inbox",h:5,from:ad("Newsletter Elektro","info@elektro-novinky.cz"),subj:"Novinky v normách ČSN EN 62305",un:true,att:false,html:true,body:'<div style="background:#eee;padding:10px"><img src="https://example.invalid/banner.png" alt="banner"><p>Nové znění normy od ledna.</p><p><img src="cid:logo1"> Redakce</p></div>',inline:true},
 {id:"m5",c:"c5",f:"inbox",h:120,from:ad("Honza Procházka","j.prochazka@elzy.cz"),subj:"Servis PCO – Jindřichův Hradec",un:false,att:false,body:"<p>Zítra jedu na servis PCO, vezmu záložní modul GPRS.</p>",cat:["Interní"]},
 {id:"m6",c:"c6",f:"inbox",h:200,from:ad("Lucie Horáková","lucie@stavby-horak.cz"),subj:"Dotaz k ceně EPS pro halu",un:false,att:true,body:"<p>Dobrý den, dotaz na rozsah EPS pro halu 2000 m2. Nabídka?</p>"},
 {id:"m7",c:"c7",f:"inbox",h:300,from:ad("Správce sítě","it@elzy.cz"),subj:"Plánovaná odstávka serveru",un:false,att:false,body:"<p>V sobotu od 22:00 proběhne odstávka.</p>"},
 {id:"m8",c:"c8",f:"drafts",h:2,from:ME,to:[ad("Petr Svoboda","petr.svoboda@strojirny-jh.cz")],subj:"Termín revize hromosvodu",un:false,att:false,body:"<p>Dobrý den, navrhuji čtvrtek.</p>",draft:true},
 {id:"m9",c:"c9",f:"archive",h:900,from:ad("Eva Malá","eva.mala@ucetni.cz"),subj:"Faktura 2026-0418",un:false,att:true,body:"<p>Faktura v příloze.</p>"}
];
var FOLD=[["inbox","Doručená pošta",1],["drafts","Koncepty",0],["sentitems","Odeslaná pošta",0],["archive","Archiv",0],["junkemail","Nevyžádaná pošta",0],["deleteditems","Odstraněná pošta",0]];
function strip(h){return String(h).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}
function fo(id){var f=FOLD.filter(function(x){return "F-"+x[0]==id||x[0]==id})[0];return f?f[0]:null}
function msg(x){
  return {id:x.id,subject:x.subj,from:x.from||ME,toRecipients:x.to||[ME],receivedDateTime:ago(x.h),sentDateTime:ago(x.h),isRead:!x.un,hasAttachments:!!x.att||!!x.inline,bodyPreview:strip(x.body).slice(0,120),conversationId:x.c,flag:{flagStatus:x.flag?"flagged":"notFlagged"},categories:x.cat||[],webLink:"https://outlook.office.com/mail/",isDraft:!!x.draft,lastModifiedDateTime:ago(x.h)};
}
function inFolder(x,f){return !f||f=="all"||x.f==f}
function mails(path){
  var m=/\/me\/mailFolders\/([^/]+)\/messages/.exec(path),f=m?decodeURIComponent(m[1]):"all";f=fo(f)||f;
  var q=decodeURIComponent((/\?(.*)$/.exec(path)||[])[1]||"");
  var par={};q.split("&").forEach(function(s){var i=s.indexOf("=");if(i>0)par[s.slice(0,i)]=s.slice(i+1)});
  var list=M.filter(function(x){return inFolder(x,f)});
  var fl=par.$filter||"";
  var cm=/conversationId eq '([^']+)'/.exec(fl);if(cm)list=M.filter(function(x){return x.c==cm[1]});
  if(/isRead eq false/.test(fl))list=list.filter(function(x){return x.un});
  if(/hasAttachments eq true/.test(fl))list=list.filter(function(x){return x.att||x.inline});
  if(/flagged/.test(fl))list=list.filter(function(x){return x.flag});
  var dm=/ge (\d{4}-\d\d-\d\d)T/.exec(fl);if(dm&&dm[1]>"1901")list=list.filter(function(x){return ago(x.h)>=dm[1]});
  if(par.$search){
    var s=par.$search.replace(/^"|"$/g,"");
    s.split(" AND ").forEach(function(t){
      var mm=/^(from|to|subject|body|attachment):\((.*)\)$/.exec(t),k=mm?mm[1]:"",v=(mm?mm[2]:t).toLowerCase();
      if(/^received/.test(t))return;
      list=list.filter(function(x){var h={from:(x.from||ME).emailAddress.name+" "+(x.from||ME).emailAddress.address,to:"",subject:x.subj,body:strip(x.body),attachment:x.att?"priloha.pdf":""}[k];if(k=="")h=[x.subj,strip(x.body),(x.from||ME).emailAddress.name].join(" ");return String(h).toLowerCase().indexOf(v)>=0});
    });
  }
  return {value:list.map(msg)};
}
var CALS=[{id:"k1",name:"Kalendář",hexColor:"#0f6cbd",canEdit:true,isDefaultCalendar:true,owner:ME.emailAddress},{id:"k2",name:"Tým techniků",hexColor:"#038387",canEdit:false,owner:{name:"Honza Procházka",address:"j.prochazka@elzy.cz"}},{id:"k3",name:"Zasedačka",hexColor:"#ca5010",canEdit:true,owner:{name:"Recepce",address:"recepce@elzy.cz"}},{id:"k4",name:"Státní svátky",hexColor:"",canEdit:false,owner:ME.emailAddress}];
var EV=[];
function mk(cal,subj,day,h1,m1,h2,m2,o){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+day);var s=new Date(d),e=new Date(d);s.setHours(h1,m1);e.setHours(h2,m2);o=o||{};
  return Object.assign({id:"e"+EV.length,cal:cal,subject:subj,start:{dateTime:lt(s)},end:{dateTime:lt(e)},isAllDay:false,location:{displayName:o.loc||""},organizer:{emailAddress:ad(o.org||"Tomáš Krejčí","x@elzy.cz")},attendees:o.att||[],showAs:o.show||"busy",isCancelled:!!o.cx,bodyPreview:o.note||"",webLink:"https://outlook.office.com/calendar/",isOrganizer:o.isOrg!==false,responseStatus:{response:o.resp||"organizer"}},o.extra||{})}
(function(){
  var d=new Date();d.setHours(0,0,0,0);var w=(d.getDay()+6)%7;
  for(var wk=-1;wk<=3;wk++){var b=wk*7-w;
    EV.push(mk("k2","Porada techniků",b,8,0,9,0,{loc:"Zasedačka",org:"Honza Procházka",isOrg:false,att:[{emailAddress:ad("Tomáš Krejčí","tkrejci@elzy.cz"),status:{response:"none"}}],resp:"notResponded"}));
    EV.push(mk("k1","Revize EPS – Školka",b+1,9,0,12,30,{loc:"Ratibořské Hory",note:"Kontrola čidel a ústředny."}));
    EV.push(mk("k1","Telefonát s dodavatelem",b+1,10,0,10,30,{}));
    EV.push(mk("k3","Školení OZO PO",b+2,13,0,16,0,{loc:"Zasedačka",show:"tentative"}));
    EV.push(mk("k2","Servis PCO – JH",b+3,7,30,11,0,{loc:"Jindřichův Hradec",org:"Honza Procházka",isOrg:false}));
    EV.push(mk("k1","Projektová porada",b+3,14,0,15,0,{loc:"Teams",att:[{emailAddress:ad("Jana Nováková","jana@x.cz"),status:{response:"accepted"}},{emailAddress:ad("Petr Svoboda","petr@x.cz"),status:{response:"tentativelyAccepted"}}],extra:{onlineMeeting:{joinUrl:"https://teams.microsoft.com/l/meetup-join/demo"}}}));
    EV.push(mk("k1","Zrušená schůzka",b+4,9,0,10,0,{cx:true}));
  }
  var a=mk("k4","Státní svátek (ukázka)",5,0,0,0,0);a.isAllDay=true;var e2=new Date();e2.setHours(0,0,0,0);e2.setDate(e2.getDate()+6);a.end={dateTime:lt(e2)};EV.push(a);
  var b2=mk("k2","Dovolená Honza",8,0,0,0,0);b2.isAllDay=true;var e3=new Date();e3.setHours(0,0,0,0);e3.setDate(e3.getDate()+11);b2.end={dateTime:lt(e3)};EV.push(b2);
  EV.push(mk("k1","Překryv A",2,9,0,11,0,{}));EV.push(mk("k3","Překryv B",2,10,0,12,0,{}));
})();
window.GDEMO=async function(method,path,body){
  await new Promise(function(r){setTimeout(r,60)});
  var u=path.replace(/^https:\/\/graph\.microsoft\.com\/v1\.0/,"");
  if(method=="POST"&&u=="/$batch"){return {responses:body.requests.map(function(r){var a=/mailFolders\/([^?]+)/.exec(r.url)[1],f=FOLD.filter(function(x){return x[0]==a})[0];return {id:r.id,status:f?200:404,body:f?{id:"F-"+f[0],displayName:f[1],unreadItemCount:M.filter(function(x){return x.f==f[0]&&x.un}).length,totalItemCount:M.filter(function(x){return x.f==f[0]}).length,childFolderCount:f[2]}:{}}})}}
  if(/^\/me\/mailFolders\?/.test(u)){return {value:FOLD.map(function(f){return {id:"F-"+f[0],displayName:f[1],unreadItemCount:0,totalItemCount:0,childFolderCount:f[2]}}).concat([{id:"F-proj",displayName:"Projekty",unreadItemCount:0,totalItemCount:3,childFolderCount:1}])}}
  var cf=/^\/me\/mailFolders\/([^/]+)\/childFolders/.exec(u);if(cf)return {value:[{id:"F-sub-"+cf[1],displayName:cf[1]=="F-proj"?"Školka Ratibořské Hory":"Zakázky",unreadItemCount:0,totalItemCount:2,childFolderCount:0}]};
  if(/\/messages\?/.test(u)&&method=="GET")return mails(u);
  var mid=/^\/me\/messages\/([^/?]+)(\/[a-z]+)?/.exec(u);
  if(mid&&method=="GET"&&!mid[2]){var x=M.filter(function(y){return y.id==mid[1]})[0];if(!x)return {};var r=msg(x);r.body={contentType:"html",content:x.body};r.replyTo=[];r.ccRecipients=[];return r}
  if(mid&&mid[2]=="/attachments"&&method=="GET"){var x2=M.filter(function(y){return y.id==mid[1]})[0];var at=[];if(x2.att)at.push({id:"a1",name:"podklady.pdf",contentType:"application/pdf",size:182000,isInline:false});if(x2.inline)at.push({id:"a2",name:"logo.svg",contentType:"image/svg+xml",size:900,isInline:true,contentId:"logo1"});return {value:at}}
  var ai=/^\/me\/messages\/[^/]+\/attachments\/([^/?]+)(\/\$value)?/.exec(u);if(ai&&method=="GET"){if(ai[2])return new Blob(["Ukázková příloha"],{type:"text/plain"});return {contentBytes:IMG.split(",")[1],contentType:"image/svg+xml"}}
  if(method=="PATCH"||method=="DELETE")return {};
  if(method=="POST"&&/\/move$/.test(u))return {};
  if(method=="POST"&&/\/(createReply|createReplyAll|createForward)$/.test(u))return {id:"draft1",body:{contentType:"html",content:"<blockquote>Původní zpráva (ukázka)</blockquote>"}};
  if(method=="POST"&&u=="/me/messages")return {id:"draft1",body:{content:""}};
  if(method=="POST"&&/\/send$/.test(u))return null;
  if(method=="POST"&&/\/attachments$/.test(u))return {id:"na1"};
  if(/^\/me\/calendars\?/.test(u))return {value:CALS};
  var cv=/^\/me\/calendars\/([^/]+)\/calendarView\?(.*)$/.exec(u);
  if(cv){var id=decodeURIComponent(cv[1]);var q=cv[2],s=new Date(decodeURIComponent(/startDateTime=([^&]+)/.exec(q)[1])),e=new Date(decodeURIComponent(/endDateTime=([^&]+)/.exec(q)[1]));
    return {value:EV.filter(function(x){if(x.cal!=id)return false;var a=new Date(x.start.dateTime.slice(0,19)),b=new Date(x.end.dateTime.slice(0,19));return a<e&&b>s}).map(function(x){return JSON.parse(JSON.stringify(x))})}}
  if(/\/events/.test(u))return {id:"enew"};
  return {value:[]};
};
})();
