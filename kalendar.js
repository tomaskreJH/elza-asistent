/* ELZA Asistent: Kalendář (Microsoft Graph). Čtení: Calendars.Read (sdílené kalendáře: Calendars.Read.Shared, pokud je povoleno). Zápis: Calendars.ReadWrite. Pozvánky a odpovědi na pozvánky jsou zprávy, proto se vždy potvrzují v okně. Bez oprávnění zápisu se událost otevře v Outlooku na webu. */
(function(){
var CR=["Calendars.Read"],CW=["Calendars.ReadWrite"];
var PAL=["#0f6cbd","#c239b3","#038387","#ca5010","#6b8e23","#8764b8","#c50f1f","#4f6bed","#986f0b","#498205"];
var SEL="id,subject,start,end,isAllDay,location,organizer,attendees,showAs,isCancelled,onlineMeeting,bodyPreview,webLink,type,categories,responseStatus,isOrganizer";
var H=44,enc=encodeURIComponent;
var K={view:GR.ls("elzaKalPohled")||"tyden",d:new Date(),cals:null,sel:null,list:[],err:{},w:null,busy:false};
K.d.setHours(0,0,0,0);
var DOW=["po","út","st","čt","pá","so","ne"];
function sod(d){var x=new Date(d);x.setHours(0,0,0,0);return x}
function add(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}
function mon(d){var x=sod(d),w=(x.getDay()+6)%7;return add(x,-w)}
function same(a,b){return a.toDateString()==b.toDateString()}
function dlong(d){return d.toLocaleDateString("cs-CZ",{weekday:"long",day:"numeric",month:"long"})}
function cname(id){var c=K.cals.filter(function(x){return x.id==id})[0];return c?c.name:""}
function accountKey(name){return name+":"+encodeURIComponent(GR.demo?"demo":GR.me())}
function groupConfig(){
 try{var saved=JSON.parse(GR.ls(accountKey("elzaKalSkupiny"))||"{}");return saved&&typeof saved==="object"&&!Array.isArray(saved)?saved:{}}
 catch(e){return {}}
}
function groupName(c){return Object.hasOwn(K.groups,c.id)?String(K.groups[c.id]).trim():""}
function ccol(id){var c=K.cals.filter(function(x){return x.id==id})[0];return c?c.col:"#888"}

GR.css("kcss",".kt{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}.kt h2{margin:0 8px;font-size:18px;min-width:210px}.kw{display:grid;grid-template-columns:210px 1fr;gap:12px}.ks{border:1px solid var(--l);border-radius:12px;padding:10px;background:var(--p);align-self:start}.ks h4{margin:8px 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--m)}.ks label{display:flex;gap:6px;align-items:center;padding:2px 0;cursor:pointer}.ks input{min-width:0;width:auto}.ks i{width:10px;height:10px;border-radius:3px;display:inline-block;flex:none}.kg{border:1px solid var(--l);border-radius:12px;overflow:hidden;background:var(--bg)}.kgh,.kga{display:grid;border-bottom:1px solid var(--l)}.kgh>div{padding:6px;text-align:center;font-weight:600;border-left:1px solid var(--l)}.kgh>div.t{color:var(--a)}.kga>div{border-left:1px solid var(--l);padding:2px;min-height:24px}.kgb{overflow:auto;max-height:calc(100vh - 290px)}.kgbody{display:grid;position:relative}.kgu{position:relative}.kgu span{position:absolute;right:6px;font-size:11px;color:var(--m);transform:translateY(-7px)}.kgc{position:relative;border-left:1px solid var(--l);background-image:linear-gradient(var(--l) 1px,transparent 1px);background-size:100% "+H+"px}.kgc.t{background-color:rgba(217,38,28,.04)}.ke{position:absolute;border-radius:6px;padding:2px 5px;font-size:12px;color:#fff;overflow:hidden;cursor:pointer;border:1px solid rgba(255,255,255,.5);line-height:1.25}.ke.tn{opacity:.75;background-image:repeating-linear-gradient(45deg,transparent 0 6px,rgba(255,255,255,.25) 6px 12px)}.ke.cx{text-decoration:line-through;opacity:.6}.kch{display:block;border-radius:5px;padding:1px 5px;font-size:12px;color:#fff;cursor:pointer;margin:1px 0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.know{position:absolute;left:0;right:0;height:2px;background:var(--a);z-index:1;pointer-events:none}.km{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}.km>div{min-height:104px;border-left:1px solid var(--l);border-top:1px solid var(--l);padding:3px;overflow:hidden}.km>div.o{background:rgba(127,127,127,.07)}.km .n{font-size:12px;color:var(--m);cursor:pointer}.km .n.t{color:#fff;background:var(--a);border-radius:99px;padding:0 6px}.kl h3{margin:14px 0 4px;font-size:14px}.kl .r1{display:flex;gap:10px;padding:5px 8px;border-bottom:1px solid var(--l);cursor:pointer}.kl .r1:hover{background:rgba(127,127,127,.08)}.kl .r1 .tm{width:110px;flex:none;color:var(--m)}.kw>*{min-width:0}@media(max-width:900px){.kw{grid-template-columns:minmax(0,1fr)}}");

function nope(e){return "<h1>Kalendář</h1><p class=a>Přístup ke kalendáři zatím není povolen"+(e&&e.status?" (HTTP "+e.status+")":"")+". Čeká se na souhlas správce nebo na vaše svolení.</p><button class=b id=gt>Povolit přístup</button><p id=gs class=note></p>"}
function nopeM(){var b=$("#gt");if(!b)return;b.onclick=async function(){try{await GR.tok(CR,true);GR.forget();go("kalendar")}catch(e){$("#gs").textContent="Nepovoleno: "+e.message}}}

async function loadCals(){
  var r=await GR.all("/me/calendars?$top=50&$select=id,name,hexColor,color,canEdit,isDefaultCalendar,owner",{sc:CR});
  var me=GR.me();
  K.cals=r.map(function(c,i){var o=(c.owner&&c.owner.address||"").toLowerCase();return {id:c.id,name:c.name,col:/^#[0-9a-f]{6}$/i.test(c.hexColor||"")?c.hexColor:PAL[i%PAL.length],edit:!!c.canEdit,def:!!c.isDefaultCalendar,shared:!!o&&o!=me,owner:c.owner&&c.owner.name||""}});
  var sv=null;try{sv=JSON.parse(GR.ls(accountKey("elzaKalVyber"))||"null")}catch(e){}
  if(!sv){
    try{
      var previous=JSON.parse(GR.ls("elzaKalVyber")||"null");
      if(previous&&K.cals.some(function(c){return Object.hasOwn(previous,c.id)}))sv=previous;
    }catch(e){}
  }
  K.groups=groupConfig();K.sel=Object.create(null);K.cals.forEach(function(c){K.sel[c.id]=sv?!!sv[c.id]:(c.def||!c.shared)});
  if(!sv&&!K.cals.some(function(c){return K.sel[c.id]}))K.cals.forEach(function(c){K.sel[c.id]=true});
}
function range(){
  var d=K.d;
  if(K.view=="den")return [sod(d),add(sod(d),1)];
  if(K.view=="tyden"){var m=mon(d);return [m,add(m,7)]}
  if(K.view=="mesic"){var f=new Date(d.getFullYear(),d.getMonth(),1),m2=mon(f);return [m2,add(m2,42)]}
  return [sod(d),add(sod(d),30)];
}
function label(){
  var d=K.d;
  if(K.view=="den")return dlong(d)+" "+d.getFullYear();
  if(K.view=="tyden"){var m=mon(d),e=add(m,6);return m.toLocaleDateString("cs-CZ",{day:"numeric",month:"numeric"})+" – "+e.toLocaleDateString("cs-CZ",{day:"numeric",month:"numeric",year:"numeric"})}
  if(K.view=="mesic")return d.toLocaleDateString("cs-CZ",{month:"long",year:"numeric"});
  var e2=add(d,29);return d.toLocaleDateString("cs-CZ",{day:"numeric",month:"numeric"})+" – "+e2.toLocaleDateString("cs-CZ",{day:"numeric",month:"numeric",year:"numeric"});
}
async function loadEvents(){
  var request={},rg=range(),out=[],errors={};K.eventRequest=request;
  var ids=K.cals.filter(function(c){return K.sel[c.id]});
  await Promise.all(ids.map(async function(c){
    try{
      var p="/me/calendars/"+enc(c.id)+"/calendarView?startDateTime="+enc(rg[0].toISOString())+"&endDateTime="+enc(rg[1].toISOString())+"&$top=100&$orderby="+enc("start/dateTime")+"&$select="+SEL;
      var v=await GR.all(p,{sc:CR,h:{Prefer:'outlook.timezone="Europe/Prague"'}},5);
      v.forEach(function(x){x.cal=c.id;x.s=GR.pd(x.start.dateTime);x.e=GR.pd(x.end.dateTime);out.push(x)});
    }catch(e){errors[c.id]=e.status||"chyba"}
  }));
  if(K.eventRequest!==request)return false;
  out.sort(function(a,b){return a.s-b.s||a.e-b.e});
  K.list=out;K.err=errors;return true;
}

/* ROZLOŽENÍ PŘEKRYVAJÍCÍCH SE UDÁLOSTÍ */
function layout(evs){
  var o=evs.slice().sort(function(a,b){return a.s0-b.s0||b.e0-a.e0}),cl=[],cur=[],end=0;
  o.forEach(function(x){if(cur.length&&x.s0>=end){cl.push(cur);cur=[];end=0}cur.push(x);end=Math.max(end,x.e0)});
  if(cur.length)cl.push(cur);
  cl.forEach(function(c){var cols=[];c.forEach(function(x){var k=0;while(cols[k]&&cols[k]>x.s0)k++;cols[k]=x.e0;x.col=k});c.forEach(function(x){x.cols=cols.length})});
  return o;
}
function dayEvents(day){
  var a=+day,b=+add(day,1);
  return K.list.filter(function(x){return x.s<b&&x.e>a&&!(x.isAllDay&&+x.e<=a)});
}
function pill(x,base){
  var tn=x.showAs=="tentative"||(x.responseStatus&&x.responseStatus.response=="tentativelyAccepted");
  return 'class="'+base+(tn?" tn":"")+(x.isCancelled?" cx":"")+'" data-a=ev data-i='+K.list.indexOf(x);
}
function grid(days){
  var n=days.length,now=new Date(),cols="44px repeat("+n+",minmax(0,1fr))";
  var h='<div class=kg><div class=kgh style="grid-template-columns:'+cols+'"><div style="border:0"></div>'+days.map(function(d,i){return '<div class="'+(same(d,now)?"t":"")+'" data-a=day data-d="'+GR.iso(d)+'" style="cursor:pointer">'+DOW[(d.getDay()+6)%7]+' '+d.getDate()+'.'+(d.getMonth()+1)+'.</div>'}).join("")+'</div>';
  h+='<div class=kga style="grid-template-columns:'+cols+'"><div style="font-size:11px;color:var(--m);border:0">celý den</div>'+days.map(function(d){
    return '<div>'+dayEvents(d).filter(function(x){return x.isAllDay||(x.e-x.s)>=864e5}).map(function(x){return '<span '+pill(x,"kch")+' style="background:'+ccol(x.cal)+'" title="'+esc(x.subject)+'">'+esc(x.subject)+'</span>'}).join("")+'</div>'}).join("")+'</div>';
  h+='<div class=kgb id=kgb><div class=kgbody style="grid-template-columns:'+cols+';height:'+(24*H)+'px"><div class=kgu>'+Array.from({length:24},function(_,i){return i?'<span style="top:'+(i*H)+'px">'+i+':00</span>':''}).join("")+'</div>';
  days.forEach(function(d){
    var s0=+d,evs=dayEvents(d).filter(function(x){return !(x.isAllDay||(x.e-x.s)>=864e5)}).map(function(x){x.s0=Math.max(x.s,d)-s0;x.e0=Math.min(x.e,add(d,1))-s0;x.s0/=6e4;x.e0/=6e4;return x});
    var L=layout(evs);
    h+='<div class="kgc'+(same(d,now)?" t":"")+'" data-a=slot data-d="'+GR.iso(d)+'">'+L.map(function(x){
      var top=x.s0/60*H,hh=Math.max(18,(x.e0-x.s0)/60*H-2),w=100/x.cols;
      return '<div '+pill(x,"ke")+' style="background:'+ccol(x.cal)+';top:'+top+'px;height:'+hh+'px;left:calc('+(x.col*w)+'% + 1px);width:calc('+w+'% - 3px)" title="'+esc(x.subject)+'"><b>'+GR.hm(x.s)+'</b> '+esc(x.subject)+(x.location&&x.location.displayName?'<br>'+esc(x.location.displayName):'')+'</div>'}).join("")+(same(d,now)?'<div class=know style="top:'+((now-d)/6e4/60*H)+'px"></div>':'')+'</div>';
  });
  return h+'</div></div></div>';
}
function month(){
  var rg=range(),now=new Date(),h='<div class=kg><div class=kgh style="grid-template-columns:repeat(7,minmax(0,1fr))">'+DOW.map(function(x){return '<div>'+x+'</div>'}).join("")+'</div><div class=km>';
  for(var i=0;i<42;i++){
    var d=add(rg[0],i),ev=dayEvents(d);
    h+='<div class="'+(d.getMonth()!=K.d.getMonth()?"o":"")+'"><span class="n'+(same(d,now)?" t":"")+'" data-a=day data-d="'+GR.iso(d)+'">'+d.getDate()+'.'+(d.getDate()==1?(d.getMonth()+1)+".":"")+'</span>'+ev.slice(0,3).map(function(x){return '<span '+pill(x,"kch")+' style="background:'+ccol(x.cal)+'" title="'+esc(x.subject)+'">'+(x.isAllDay?"":GR.hm(x.s)+" ")+esc(x.subject)+'</span>'}).join("")+(ev.length>3?'<span class=note style="font-size:11px;cursor:pointer" data-a=day data-d="'+GR.iso(d)+'">+ '+(ev.length-3)+' dalších</span>':'')+'</div>';
  }
  return h+'</div></div>';
}
function listv(){
  var rg=range(),h='<div class=kl>',any=false;
  for(var i=0;i<30;i++){
    var d=add(rg[0],i),ev=dayEvents(d);if(!ev.length)continue;any=true;
    h+='<h3>'+esc(dlong(d))+'</h3>'+ev.map(function(x){return '<div class=r1 data-a=ev data-i='+K.list.indexOf(x)+'><span class=tm>'+(x.isAllDay?"celý den":GR.hm(x.s)+" – "+GR.hm(x.e))+'</span><i style="width:10px;height:10px;border-radius:3px;background:'+ccol(x.cal)+';margin-top:6px;flex:none"></i><span style="flex:1"><b>'+esc(x.subject)+'</b>'+(x.location&&x.location.displayName?' <span class=note>· '+esc(x.location.displayName)+'</span>':'')+'<br><span class=note>'+esc(cname(x.cal))+'</span></span></div>'}).join("");
  }
  return h+(any?'':'<p class=note>V tomto období nic není.</p>')+'</div>';
}
function side(){
  var mine=K.cals.filter(function(c){return !c.shared}),sh=K.cals.filter(function(c){return c.shared});
  function row(c){return '<label><input type=checkbox data-c="'+esc(c.id)+'"'+(K.sel[c.id]?" checked":"")+'><i style="background:'+c.col+'"></i><span>'+esc(c.name)+(c.owner&&c.shared?' <span class=note>('+esc(c.owner)+')</span>':'')+(K.err[c.id]?' <span class=r title="Kalendář se nepodařilo načíst">⚠ '+esc(K.err[c.id])+'</span>':'')+'</span></label>'}
  var groups=new Map();
  sh.forEach(function(c){var name=groupName(c);if(!groups.has(name))groups.set(name,[]);groups.get(name).push(c)});
  var shared=Array.from(groups).sort(function(a,b){return a[0].localeCompare(b[0],"cs")}).map(function(group){
   var name=group[0],members=group[1],all=members.every(function(c){return K.sel[c.id]});
   return '<section class=k-team><div class=k-team-title><b>'+esc(name||"Nezařazené")+'</b>'+
    '<button class=g data-a=group data-name="'+esc(name)+'" aria-label="'+esc((all?"Skrýt: ":"Zobrazit: ")+(name||"Nezařazené"))+'">'+(all?"Skrýt vše":"Zobrazit vše")+'</button></div>'+members.map(row).join("")+'</section>';
  }).join("");
  var organize=sh.length?'<details class=k-organize'+(K.organize?" open":"")+'><summary>Upravit skupiny</summary><p class=note>Stejný název spojí kalendáře do jedné skupiny. Skupiny jsou uložené v tomto prohlížeči.</p>'+
   sh.map(function(c){return '<label>'+esc(c.owner?c.name+" · "+c.owner:c.name)+'<input data-cgroup="'+esc(c.id)+'" maxlength=48 placeholder="Např. Servis" value="'+esc(groupName(c))+'"></label>'}).join("")+
   '<button class=g data-a=savegroups>Uložit skupiny</button><span id=k-group-status class=note role=status></span></details>':"";
  return '<h4>Moje kalendáře</h4>'+mine.map(row).join("")+'<h4>Sdílené se mnou</h4>'+
   (shared||'<p class=note>Žádný sdílený kalendář nebyl nalezen.</p>')+organize+
   '<p style="margin:8px 0 0"><button class=g data-a=all>Zobrazit všechny</button> <button class=g data-a=none>Skrýt všechny</button></p>';
}
function body(){return K.view=="den"?grid([K.d]):K.view=="tyden"?grid([0,1,2,3,4,5,6].map(function(i){return add(mon(K.d),i)})):K.view=="mesic"?month():listv()}
function paint(){
  var e=$("#kb");if(e)e.innerHTML=body();
  var s=$("#ksd");if(s)s.innerHTML=side();
  var l=$("#klb");if(l)l.textContent=label();
  document.querySelectorAll("[data-a=vw]").forEach(function(b){b.classList.toggle("on",b.dataset.w==K.view)});
  var g=$("#kgb");if(g)g.scrollTop=K.scroll!=null?K.scroll:7*H-4;
}
async function refresh(){
  var e=$("#kb");if(e&&!e.dataset.keep)e.style.opacity=.5;
  if(!await loadEvents()||!e||!e.isConnected)return;
  e.style.opacity=1;paint();
}

/* DETAIL, ZÁPIS */
function deeplink(f){
  return "https://outlook.office.com/calendar/0/deeplink/compose?subject="+enc(f.subj||"")+"&body="+enc(f.note||"")+"&location="+enc(f.loc||"")+"&startdt="+enc(f.s)+"&enddt="+enc(f.e)+"&allday="+(f.ad?"true":"false")+"&to="+enc(f.att||"");
}
function detail(i){
  var x=K.list[i],c=K.cals.filter(function(y){return y.id==x.cal})[0]||{};
  var when=x.isAllDay?dlong(x.s)+" (celý den)":dlong(x.s)+", "+GR.hm(x.s)+" – "+(same(x.s,x.e)?GR.hm(x.e):dlong(x.e)+" "+GR.hm(x.e));
  var att=(x.attendees||[]).map(function(a){var r=a.status&&a.status.response||"";var t={accepted:"✓",declined:"✗",tentativelyAccepted:"?",none:"",notResponded:""}[r]||"";return esc((a.emailAddress.name||a.emailAddress.address))+(t?' <span class=note>'+t+'</span>':'')}).join(", ");
  var d=GR.modal('<h2>'+esc(x.subject||"(bez názvu)")+(x.isCancelled?' <span class=r>(zrušeno)</span>':'')+'</h2><p style="margin:0 0 6px"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:'+(c.col||"#888")+'"></i> '+esc(c.name||"")+'</p><p style="margin:0 0 6px"><b>'+esc(when)+'</b></p>'+
    (x.location&&x.location.displayName?'<p style="margin:0 0 6px">Místo: '+esc(x.location.displayName)+'</p>':'')+
    (x.organizer&&x.organizer.emailAddress?'<p style="margin:0 0 6px">Organizátor: '+esc(x.organizer.emailAddress.name||x.organizer.emailAddress.address)+'</p>':'')+
    (att?'<p style="margin:0 0 6px">Účastníci: '+att+'</p>':'')+
    (x.onlineMeeting&&x.onlineMeeting.joinUrl&&/^https:/.test(x.onlineMeeting.joinUrl)?'<p style="margin:0 0 6px"><a target=_blank rel=noopener href="'+esc(window.surl?surl(x.onlineMeeting.joinUrl):x.onlineMeeting.joinUrl)+'">Připojit se k online schůzce</a></p>':'')+
    (x.bodyPreview?'<p class=note style="white-space:pre-wrap">'+esc(x.bodyPreview)+'</p>':'')+
    '<div class=gm-r>'+(x.webLink?'<a target=_blank rel=noopener href="'+esc(x.webLink)+'"><button class=g>Otevřít v Outlooku</button></a>':'')+
    (K.w&&c.edit?'<button class=g id=ed>Upravit</button><button class=g id=del>Smazat</button>':'')+
    (K.w&&(x.attendees||[]).length&&!x.isOrganizer?'<button class=g id=acc>Přijmout</button><button class=g id=ten>Nezávazně</button><button class=g id=dec>Odmítnout</button>':'')+
    '<span class=sp></span><button class=g id=x>Zavřít</button></div>',true);
  d.querySelector("#x").onclick=GR.closeModal;
  var ed=d.querySelector("#ed");if(ed)ed.onclick=function(){form(x)};
  var del=d.querySelector("#del");if(del)del.onclick=function(){if(!confirm("Smazat událost „"+x.subject+"“?"+((x.attendees||[]).length?" Účastníkům může odejít zrušení.":"")))return;GR.req("DELETE","/me/calendars/"+enc(x.cal)+"/events/"+enc(x.id),{sc:CW}).then(function(){GR.closeModal();refresh()}).catch(function(e){alert("Smazání se nezdařilo: "+(e.detail||e.message))})};
  [["acc","accept","Přijmout"],["ten","tentativelyAccept","Nezávazně přijmout"],["dec","decline","Odmítnout"]].forEach(function(r){
    var b=d.querySelector("#"+r[0]);if(!b)return;
    b.onclick=function(){if(!confirm(r[2]+" pozvánku? Organizátorovi odejde odpověď."))return;GR.req("POST","/me/calendars/"+enc(x.cal)+"/events/"+enc(x.id)+"/"+r[1],{sc:CW,body:{sendResponse:true}}).then(function(){GR.closeModal();refresh()}).catch(function(e){alert("Odpověď se nezdařila: "+(e.detail||e.message))})};
  });
}
function form(x,pre){
  var ed=x&&x.id,s=x?x.s:(pre&&pre.s)||new Date(K.d.getFullYear(),K.d.getMonth(),K.d.getDate(),9,0),e=x?x.e:(pre&&pre.e)||new Date(+s+36e5);
  if(x&&x.isAllDay)e=add(e,-1);
  var wr=K.cals.filter(function(c){return c.edit});
  var cal=x?x.cal:(wr.filter(function(c){return c.def})[0]||wr[0]||{}).id;
  function tm(d){return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)}
  var d=GR.modal('<h2>'+(ed?"Upravit událost":"Nová událost")+'</h2>'+(K.w?'':'<div class=gbanner>Ukládání událostí z aplikace čeká na souhlas správce. Událost otevřu předvyplněnou v Outlooku na webu.</div>')+
    '<label>Název</label><input id=fs value="'+esc(x?x.subject:"")+'"><label>Kalendář</label><select id=fc>'+(wr.length?wr:K.cals).map(function(c){return '<option value="'+esc(c.id)+'"'+(c.id==cal?" selected":"")+'>'+esc(c.name)+'</option>'}).join("")+'</select>'+
    '<div style="display:flex;gap:8px;align-items:end"><div style="flex:1"><label>Od</label><input type=date id=fd1 value="'+GR.iso(s)+'"></div><div style="width:110px"><label>&nbsp;</label><input type=time id=ft1 value="'+tm(s)+'"></div><div style="flex:1"><label>Do</label><input type=date id=fd2 value="'+GR.iso(e)+'"></div><div style="width:110px"><label>&nbsp;</label><input type=time id=ft2 value="'+tm(e)+'"></div></div>'+
    '<label style="color:var(--f)"><input type=checkbox id=fad style="width:auto"'+(x&&x.isAllDay?" checked":"")+'> Celý den</label><label>Místo</label><input id=fl value="'+esc(x&&x.location?x.location.displayName:"")+'"><label>Účastníci (e-maily oddělené čárkou; účastníkům odejde pozvánka)</label><input id=fa value="'+esc(x?(x.attendees||[]).map(function(a){return a.emailAddress.address}).join(", "):"")+'"><label>Popis</label><textarea id=fn style="min-height:80px"></textarea>'+
    '<p id=fst class=note></p><div class=gm-r><button class=g id=fo>Otevřít v Outlooku</button>'+(K.w?'<button class=b id=fv>Uložit</button>':'')+'<span class=sp></span><button class=g id=fx>Zavřít</button></div>',true);
  function rd(){
    var ad=d.querySelector("#fad").checked,d1=d.querySelector("#fd1").value,d2=d.querySelector("#fd2").value,t1=d.querySelector("#ft1").value||"00:00",t2=d.querySelector("#ft2").value||"00:00";
    var s2=ad?d1+"T00:00:00":d1+"T"+t1+":00",e2=ad?GR.iso(add(new Date(d2+"T00:00:00"),1))+"T00:00:00":d2+"T"+t2+":00";
    return {subj:d.querySelector("#fs").value,cal:d.querySelector("#fc").value,s:s2,e:e2,ad:ad,loc:d.querySelector("#fl").value,att:d.querySelector("#fa").value.split(/[,;\s]+/).filter(function(a){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a)}).join(","),note:d.querySelector("#fn").value};
  }
  d.querySelector("#fx").onclick=GR.closeModal;
  d.querySelector("#fo").onclick=function(){window.open(deeplink(rd()),"_blank","noopener")};
  var sv=d.querySelector("#fv");
  if(sv)sv.onclick=async function(){
    var f=rd();if(!f.subj){d.querySelector("#fst").textContent="Doplňte název.";return}
    if(new Date(f.e)<=new Date(f.s)){d.querySelector("#fst").textContent="Konec musí být po začátku.";return}
    if(f.att&&!confirm("Účastníkům ("+f.att+") odejde pozvánka. Pokračovat?"))return;
    var b={subject:f.subj,isAllDay:f.ad,start:{dateTime:f.s,timeZone:"Europe/Prague"},end:{dateTime:f.e,timeZone:"Europe/Prague"},location:{displayName:f.loc}};
    if(f.note)b.body={contentType:"text",content:f.note};
    if(f.att)b.attendees=f.att.split(",").map(function(a){return {emailAddress:{address:a},type:"required"}});
    try{
      d.querySelector("#fst").textContent="Ukládám…";
      if(ed)await GR.req("PATCH","/me/calendars/"+enc(x.cal)+"/events/"+enc(x.id),{sc:CW,body:b});
      else await GR.req("POST","/me/calendars/"+enc(f.cal)+"/events",{sc:CW,body:b});
      GR.closeModal();refresh();
    }catch(er){d.querySelector("#fst").textContent="Uložení se nezdařilo: "+(er.detail||er.message)}
  };
}

/* OVLÁDÁNÍ */
function onClick(e){
  var el=e.target.closest("[data-a]");if(!el)return;
  var a=el.dataset.a;
  if(a=="vw"){K.view=el.dataset.w;GR.ls("elzaKalPohled",K.view);K.scroll=null;return refresh()}
  if(a=="today"){K.d=sod(new Date());return refresh()}
  if(a=="prev"||a=="next"){var n=a=="next"?1:-1;if(K.view=="den")K.d=add(K.d,n);else if(K.view=="tyden")K.d=add(K.d,7*n);else if(K.view=="mesic")K.d=new Date(K.d.getFullYear(),K.d.getMonth()+n,1);else K.d=add(K.d,30*n);return refresh()}
  if(a=="day"){e.stopPropagation();K.d=new Date(el.dataset.d+"T00:00:00");K.view="den";return refresh()}
  if(a=="ev"){e.stopPropagation();return detail(+el.dataset.i)}
  if(a=="slot"){
    var r=el.getBoundingClientRect(),y=e.clientY-r.top,hr=Math.floor(y/H),mn=(y/H-hr)<.5?0:30,d=new Date(el.dataset.d+"T00:00:00");d.setHours(hr,mn,0,0);
    return form(null,{s:d,e:new Date(+d+36e5)});
  }
  if(a=="new"){var d2=new Date(K.d);d2.setHours(9,0,0,0);return form(null,{s:d2,e:new Date(+d2+36e5)})}
  if(a=="savegroups"){
    var config=Object.create(null);
    document.querySelectorAll("#ksd [data-cgroup]").forEach(function(input){
      if(input.value.trim())config[input.dataset.cgroup]=input.value.trim();
    });
    K.groups=config;K.organize=true;GR.ls(accountKey("elzaKalSkupiny"),JSON.stringify(config));paint();
    $("#k-group-status").textContent="Skupiny uloženy.";return;
  }
  if(a=="group"){
    var members=K.cals.filter(function(c){return c.shared&&groupName(c)===el.dataset.name});
    var show=!members.every(function(c){return K.sel[c.id]});
    members.forEach(function(c){K.sel[c.id]=show});
    GR.ls(accountKey("elzaKalVyber"),JSON.stringify(K.sel));return refresh();
  }
  if(a=="all"||a=="none"){K.cals.forEach(function(c){K.sel[c.id]=a=="all"});GR.ls(accountKey("elzaKalVyber"),JSON.stringify(K.sel));return refresh()}
}
function onChange(e){
  var t=e.target;
  if(t.dataset&&t.dataset.c){K.sel[t.dataset.c]=t.checked;GR.ls(accountKey("elzaKalVyber"),JSON.stringify(K.sel));return refresh()}
  if(t.id=="kjmp"&&t.value){K.d=new Date(t.value+"T00:00:00");return refresh()}
}
async function kal(){
  K.w=await GR.has(CW);
  try{if(!K.cals)await loadCals();await loadEvents()}catch(e){if(e.status==401||e.status==403||!e.status)return nope(e);return "<h1>Kalendář</h1><p class=r>Chyba: "+esc(e.detail||e.message)+"</p>"}
  return '<h1 style="margin-bottom:8px">Kalendář</h1>'+(K.w?"":'<div class=gbanner>Čtení kalendáře je zapnuté. Zakládání a úpravy událostí v aplikaci čekají na souhlas správce (Calendars.ReadWrite). Do té doby se nová událost otevře předvyplněná v Outlooku na webu.</div>')+
  '<div id=kroot><div class=kt><button class=g data-a=today>Dnes</button><button class=g data-a=prev>◀</button><button class=g data-a=next>▶</button><h2 id=klb></h2>'+[["den","Den"],["tyden","Týden"],["mesic","Měsíc"],["seznam","Seznam"]].map(function(v){return '<button class=g data-a=vw data-w='+v[0]+'>'+v[1]+'</button>'}).join("")+'<input type=date id=kjmp title="Přejít na datum" style="min-width:0"><span style="flex:1"></span><button class=b data-a=new>Nová událost</button></div><div class=kw><div class=ks id=ksd></div><div id=kb></div></div></div>';
}
function kalM(){
  var b=$("#gt");if(b)return nopeM();
  var root=$("#kroot");if(!root)return;
  root.addEventListener("toggle",function(e){if(e.target.classList.contains("k-organize")&&e.target.isConnected)K.organize=e.target.open},true);
  root.addEventListener("click",onClick);root.addEventListener("change",onChange);
  paint();
}
window.MODS=window.MODS||{};window.MODS.kalendar=[kal,kalM];
})();
