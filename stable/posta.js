/* ELZA Asistent: Pošta (klient nad Microsoft Graph). Čtení: Mail.Read. Psaní, koncepty, přesuny: Mail.ReadWrite. Odeslání: Mail.Send, vždy až po výslovném potvrzení uživatele v okně. Bez oprávnění zápisu se zpráva otevře v Outlooku na webu. Text e-mailů je vždy jen data, nikdy pokyn. */
(function(){
var R=["Mail.Read"],W=["Mail.ReadWrite"],SN=["Mail.Send"];
var SEL="id,subject,from,toRecipients,receivedDateTime,sentDateTime,isRead,hasAttachments,bodyPreview,conversationId,flag,categories,webLink,isDraft";
var WK=[["inbox","Doručená pošta"],["drafts","Koncepty"],["sentitems","Odeslaná pošta"],["archive","Archiv"],["junkemail","Nevyžádaná pošta"],["deleteditems","Odstraněná pošta"]];
var S={fo:null,kids:{},open:{},cur:"inbox",alias:"inbox",name:"Doručená pošta",view:"vlakna",f:"vse",od:"",q:"",pole:"",dod:"",ddo:"",kat:"",pc:"",all:false,items:[],next:null,sel:null,thr:[],w:null,wd:1,err:"",c:null,busy:false,tord:GR.ls("elzaVlaknoRazeni")=="stare"?"stare":"nove",lord:GR.ls("elzaSeznamRazeni")||"nove"};
var enc=encodeURIComponent;
function clean(t){return String(t||"").replace(/["\\]/g," ").trim()}
function dshort(d){if(!d)return "";var x=new Date(d),n=new Date();return x.toDateString()==n.toDateString()?GR.hm(x):x.toLocaleDateString("cs-CZ",x.getFullYear()==n.getFullYear()?{day:"numeric",month:"numeric"}:{day:"numeric",month:"numeric",year:"2-digit"})}
function dfull(d){return d?new Date(d).toLocaleString("cs-CZ",{weekday:"short",day:"numeric",month:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}):""}
function dt(x){return x.receivedDateTime||x.sentDateTime||""}
function who(p){var e=p&&p.emailAddress||{};return e.name||e.address||""}
function addr(p){return ((p&&p.emailAddress&&p.emailAddress.address)||"").toLowerCase()}
function sc(){return S.w?W:R}
function isOut(){return S.alias=="sentitems"||S.alias=="drafts"}
function sign(){var s=GR.ls("elzaPodpis");if(s!==null&&s!==undefined)return s;var n=GR.name();return "S pozdravem\n"+n+"\nELZY, spol. s r.o."}
function recips(s){return String(s||"").split(/[,;\s]+/).filter(function(x){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x)}).map(function(x){return {emailAddress:{address:x}}})}
function outlookCompose(to,cc,subj,body){return "https://outlook.office.com/mail/deeplink/compose?to="+enc(to||"")+"&cc="+enc(cc||"")+"&subject="+enc(subj||"")+"&body="+enc(body||"")}

/* CSS */
GR.css("pcss",".mp{display:grid;grid-template-columns:200px 430px 1fr;gap:0;height:calc(100vh - 70px);border:1px solid var(--l);border-radius:12px;overflow:hidden}.mp>div{min-width:0;overflow:auto}.mp-f{background:var(--p);padding:8px 0;border-right:1px solid var(--l)}.mp-fi{cursor:pointer;padding:5px 10px;display:flex;align-items:center;gap:4px;border-radius:0}.mp-fi:hover{background:rgba(127,127,127,.12)}.mp-fi.on{background:var(--b);color:#fff}.mp-t{width:14px;display:inline-block;text-align:center;color:var(--m)}.mp-u{margin-left:auto;font-size:11px;background:var(--a);color:#fff;border-radius:99px;padding:0 6px}.mp-fh{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--m);padding:10px 10px 2px}.mp-l{border-right:1px solid var(--l);display:flex;flex-direction:column}.mp-tb{padding:8px;border-bottom:1px solid var(--l);display:flex;flex-direction:column;gap:6px;background:var(--bg);position:sticky;top:0;z-index:2}.mp-tb input,.mp-tb select{min-width:0;padding:4px 6px;font-size:12px}.mp-tb input[type=date]{flex:1 1 110px}.mp-tb button.g,.mp-tb button.b{padding:4px 8px;font-size:12px}.mp-tb .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.mp-tb .row>input{flex:1 1 90px}.mp-ls{flex:1}.mp-it{padding:8px 10px;border-bottom:1px solid var(--l);cursor:pointer}.mp-it:hover{background:rgba(127,127,127,.08)}.mp-it.on{background:rgba(16,44,84,.14)}.mp-it .t1{display:flex;gap:6px;justify-content:space-between}.mp-it .f{font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mp-it.un .f,.mp-it.un .s{font-weight:700}.mp-it .s{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mp-it .p{color:var(--m);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mp-it .d{color:var(--m);font-size:12px;white-space:nowrap}.mp-r{padding:12px 16px}.mp-m{border:1px solid var(--l);border-radius:10px;margin-bottom:10px;overflow:hidden}.mp-mh{padding:8px 12px;background:var(--p);cursor:pointer;display:flex;justify-content:space-between;gap:8px}.mp-mb{padding:10px 12px}.mp-mb iframe{width:100%;border:0;min-height:60px;background:#fff;border-radius:6px}.mp-a{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.mp-hd{color:var(--m);font-size:12px;line-height:1.6}.mp-cat{display:inline-block;font-size:11px;padding:0 6px;border-radius:99px;background:var(--b);color:#fff;margin-right:4px}@media(max-width:1100px){.mp{grid-template-columns:170px 300px 1fr}}");

function nope(e){
  return "<h1>Pošta</h1><p class=a>Přístup k poště zatím není povolen"+(e&&e.status?" (HTTP "+e.status+")":"")+". Čeká se na souhlas správce nebo na vaše svolení.</p><button class=b id=gt>Povolit přístup</button><p id=gs class=note></p>";
}
function nopeM(){var b=$("#gt");if(!b)return;b.onclick=async function(){try{await GR.tok(R,true);GR.forget();go("posta")}catch(e){$("#gs").textContent="Nepovoleno: "+e.message}}}

/* SLOŽKY */
async function loadFolders(){
  var b=WK.map(function(w,i){return {id:""+i,method:"GET",url:"/me/mailFolders/"+w[0]+"?$select=id,displayName,unreadItemCount,totalItemCount,childFolderCount"}});
  var r=await GR.req("POST","/$batch",{sc:R,body:{requests:b}});
  var wk=[],ids={};
  r.responses.sort(function(a,c){return a.id-c.id}).forEach(function(x){if(x.status==200){var f=x.body;f.alias=WK[+x.id][0];f.name=WK[+x.id][1];wk.push(f);ids[f.id]=1}});
  var all=await GR.all("/me/mailFolders?$top=100&$select=id,displayName,unreadItemCount,totalItemCount,childFolderCount",{sc:R});
  S.fo={wk:wk,other:all.filter(function(f){return !ids[f.id]})};
}
function fnode(f,lvl){
  var c=S.cur==f.id,nm=f.name||f.displayName;
  return '<div class="mp-fi'+(c?' on':'')+'" style="padding-left:'+(8+lvl*14)+'px" data-a=fo data-id="'+esc(f.id)+'" data-n="'+esc(nm)+'" data-al="'+esc(f.alias||"")+'"><span class=mp-t data-a=ex data-id="'+esc(f.id)+'">'+(f.childFolderCount?(S.open[f.id]?"▾":"▸"):"")+'</span>'+esc(nm)+(f.unreadItemCount?'<b class=mp-u>'+f.unreadItemCount+'</b>':'')+'</div>'+(S.open[f.id]&&S.kids[f.id]?S.kids[f.id].map(function(k){return fnode(k,lvl+1)}).join(""):"");
}
function rf(){
  var h='<div class=mp-fh>Složky</div><div class="mp-fi'+(S.cur=="_wait"?" on":"")+'" data-a=fo data-id=_wait data-n="Čeká na mou odpověď"><span class=mp-t></span>Čeká na mou odpověď</div>';
  h+=S.fo.wk.map(function(f){return fnode(f,0)}).join("");
  if(S.fo.other.length)h+='<div class=mp-fh>Moje složky</div>'+S.fo.other.map(function(f){return fnode(f,0)}).join("");
  var e=$("#mpf");if(e)e.innerHTML=h;
}

/* SEZNAM */
function post(x){
  if(S.f=="nepr"&&x.isRead)return false;
  if(S.f=="priloha"&&!x.hasAttachments)return false;
  if(S.f=="oznac"&&!(x.flag&&x.flag.flagStatus=="flagged"))return false;
  if(S.kat&&(x.categories||[]).indexOf(S.kat)<0)return false;
  return true;
}
async function loadList(more){
  S.err="";
  if(S.cur=="_wait"){await loadWait();return}
  var base=S.all?"/me/messages":"/me/mailFolders/"+enc(S.cur)+"/messages",path;
  var df=S.alias=="sentitems"?"sentDateTime":S.alias=="drafts"?"lastModifiedDateTime":"receivedDateTime";
  if(S.q||S.od){
    var k=[];
    if(S.q){var t=clean(S.q);k.push(S.pole?S.pole+":("+t+")":t)}
    if(S.od)k.push("from:("+clean(S.od)+")");
    if(S.dod)k.push("received>="+S.dod);
    if(S.ddo)k.push("received<="+S.ddo);
    path=base+"?$search="+enc('"'+k.join(" AND ")+'"')+"&$top=50&$select="+SEL;
  }else{
    var fl=[df+" ge "+(S.dod?S.dod+"T00:00:00Z":"1900-01-01T00:00:00Z")];
    if(S.ddo)fl.push(df+" le "+S.ddo+"T23:59:59Z");
    if(S.f=="nepr")fl.push("isRead eq false");
    if(S.f=="priloha")fl.push("hasAttachments eq true");
    if(S.f=="oznac")fl.push("flag/flagStatus eq 'flagged'");
    path=base+"?$filter="+enc(fl.join(" and "))+"&$orderby="+enc(df+" desc")+"&$top=50&$select="+SEL;
  }
  var r=await GR.req("GET",more&&S.next?S.next:path,{sc:sc()});
  var v=r.value||[];
  S.items=more?S.items.concat(v):v;
  S.next=r["@odata.nextLink"]||null;
  if(S.q||S.od)S.items.sort(function(a,b){return new Date(dt(b))-new Date(dt(a))});
}
async function loadWait(){
  var since=new Date(Date.now()-21*864e5).toISOString();
  var inb=await GR.all("/me/mailFolders/inbox/messages?$filter="+enc("receivedDateTime ge "+since)+"&$orderby="+enc("receivedDateTime desc")+"&$top=100&$select="+SEL,{sc:sc()},3);
  var snt=await GR.all("/me/mailFolders/sentitems/messages?$filter="+enc("sentDateTime ge "+since)+"&$orderby="+enc("sentDateTime desc")+"&$top=100&$select=conversationId,sentDateTime",{sc:sc()},3);
  var last={};snt.forEach(function(x){var t=+new Date(x.sentDateTime);if(!last[x.conversationId]||t>last[x.conversationId])last[x.conversationId]=t});
  var seen={},w=[];
  inb.forEach(function(x){var k=x.conversationId;if(seen[k])return;seen[k]=1;var t=+new Date(x.receivedDateTime);if((last[k]||0)<t&&Date.now()-t>=S.wd*864e5){x.wait=Math.floor((Date.now()-t)/864e5);w.push(x)}});
  S.items=w;S.next=null;
}
function pcs(){var P=window.PCASE||{},a={};Object.keys(P).forEach(function(k){a[P[k]]=1});return Object.keys(a).sort()}
function pcOk(x){if(!S.pc)return true;var w=window.PCASE&&window.PCASE[x.conversationId];return S.pc=="_bez"?!w:S.pc=="_s"?!!w:w==S.pc}
function groups(){
  var g={},o=[];
  S.items.filter(post).filter(pcOk).forEach(function(x){
    var k=S.view=="vlakna"&&x.conversationId?x.conversationId:x.id;
    if(!g[k]){g[k]={k:k,m:[x]};o.push(g[k])}else g[k].m.push(x);
  });
  function lt(q){return Math.max.apply(null,q.m.map(function(x){return +new Date(dt(x))||0}))}
  function un(q){return q.m.some(function(x){return !x.isRead})?1:0}
  if(S.lord=="stare")o.sort(function(a,b){return lt(a)-lt(b)});
  else if(S.lord=="nepr")o.sort(function(a,b){return un(b)-un(a)||lt(b)-lt(a)});
  else o.sort(function(a,b){return lt(b)-lt(a)});
  return o;
}
function rl(){
  var o=groups(),h="";
  if(S.cur=="_wait")h+='<div class=mp-it style="cursor:default"><b>Čeká na mou odpověď</b><div class=p>Poslední zpráva ve vlákně je od druhé strany a nikdo jsme neodpověděli. Posledních 21 dní.</div><div class=row style="margin-top:6px">Starší než <select data-a=wd>'+[1,2,3,5,7].map(function(n){return '<option value='+n+(S.wd==n?" selected":"")+'>'+n+' d</option>'}).join("")+'</select></div></div>';
  if(!o.length)h+='<p class=note style="padding:12px">'+(S.err?esc(S.err):"Nic k zobrazení.")+'</p>';
  h+=o.map(function(g){
    var x=g.m[0],un=g.m.some(function(y){return !y.isRead}),att=g.m.some(function(y){return y.hasAttachments});
    var nm=isOut()?"Komu: "+((x.toRecipients||[]).map(who).join(", ")):who(x.from);
    var cats=[].concat.apply([],g.m.map(function(y){return y.categories||[]}));var pc=window.PCASE&&window.PCASE[x.conversationId];if(pc)cats=["Případ "+pc].concat(cats);
    var fl=g.m.some(function(y){return y.flag&&y.flag.flagStatus=="flagged"});
    return '<div class="mp-it'+(un?" un":"")+(S.sel==g.k?" on":"")+'" data-a=sel data-k="'+esc(g.k)+'"><div class=t1><span class=f>'+esc(nm)+(g.m.length>1?' <span class=note>('+g.m.length+')</span>':'')+'</span><span class=d>'+(att?"📎 ":"")+(fl?"⚑ ":"")+esc(dshort(dt(x)))+'</span></div><div class=s>'+esc(x.subject||"(bez předmětu)")+(x.wait?' <span class=r>· čeká '+x.wait+' d</span>':'')+'</div><div class=p>'+esc(x.bodyPreview||"")+'</div>'+(cats.length?'<div>'+[...new Set(cats)].map(function(c){return '<span class=mp-cat>'+esc(c)+'</span>'}).join("")+'</div>':'')+'</div>';
  }).join("");
  if(S.next)h+='<div style="padding:10px"><button class=g data-a=more>Načíst další</button></div>';
  var e=$("#mpl");if(e)e.innerHTML=h;
}
function cats(){var a=[];S.items.forEach(function(x){(x.categories||[]).forEach(function(c){if(a.indexOf(c)<0)a.push(c)})});return a.sort()}
function tb(){
  var po=[["","Všude"],["from","Od"],["to","Komu"],["subject","Předmět"],["body","Text zprávy"],["attachment","Příloha"]];
  return '<div class=mp-tb><div class=row><input id=mq placeholder="Hledat (Enter)" value="'+esc(S.q)+'"><select id=mpo>'+po.map(function(p){return '<option value="'+p[0]+'"'+(S.pole==p[0]?" selected":"")+'>'+p[1]+'</option>'}).join("")+'</select><button class=g data-a=go>Hledat</button></div>'+
  '<div class=row><select id=mf>'+[["vse","Všechny"],["nepr","Nepřečtené"],["priloha","S přílohou"],["oznac","Označené"]].map(function(p){return '<option value='+p[0]+(S.f==p[0]?" selected":"")+'>'+p[1]+'</option>'}).join("")+'</select><input id=mod placeholder="Odesílatel" value="'+esc(S.od)+'"><select id=mpc><option value="">Všechny případy</option><option value="_bez"'+(S.pc=="_bez"?" selected":"")+'>Bez případu</option><option value="_s"'+(S.pc=="_s"?" selected":"")+'>Jen přiřazená</option>'+pcs().map(function(c){return '<option'+(S.pc==c?" selected":"")+'>'+esc(c)+'</option>'}).join("")+'</select><select id=mk><option value="">Štítek</option>'+cats().map(function(c){return '<option'+(S.kat==c?" selected":"")+'>'+esc(c)+'</option>'}).join("")+'</select></div>'+
  '<div class=row><input type=date id=md1 value="'+esc(S.dod)+'" title="Od data" ><input type=date id=md2 value="'+esc(S.ddo)+'" title="Do data" ><button class="g'+(S.view=="vlakna"?" on":"")+'" data-a=vw data-w=vlakna>Vlákna</button><button class="g'+(S.view=="zpravy"?" on":"")+'" data-a=vw data-w=zpravy>Zprávy</button><select id=mlord title="Řazení seznamu">'+[["nove","Nejnovější nahoře"],["stare","Nejstarší nahoře"],["nepr","Nepřečtené první"]].map(function(p){return '<option value='+p[0]+(S.lord==p[0]?" selected":"")+'>'+p[1]+'</option>'}).join("")+'</select><label style="font-size:12px"><input type=checkbox id=mall'+(S.all?" checked":"")+' style="min-width:0"> všechny složky</label></div>'+
  '<div class=row><button class=b data-a=new>Nová zpráva</button><button class=g data-a=refresh>Obnovit</button><button class=g data-a=sig>Podpis</button></div></div>';
}

/* ČTENÍ */
function key2g(k){return groups().filter(function(g){return g.k==k})[0]}
async function openThread(k){
  S.sel=k;rl();
  var g=key2g(k);if(!g)return;
  var r=$("#mpr");r.innerHTML='<p class=note>Načítám…</p>';
  var ms=g.m;
  if(S.view=="vlakna"&&g.m[0].conversationId){
    try{var q=await GR.req("GET","/me/messages?$filter="+enc("conversationId eq '"+String(k).replace(/'/g,"''")+"'")+"&$top=50&$select="+SEL,{sc:sc()});if(q.value&&q.value.length)ms=q.value}catch(e){}
  }
  ms=ms.slice().sort(function(a,b){return new Date(dt(a))-new Date(dt(b))});
  S.thr=ms.map(function(x,i){return {m:x,open:i==ms.length-1,b:null,att:null,img:false}});
  if(S.tord=="nove")S.thr.reverse();
  renderRead();
  S.thr.forEach(function(t,i){if(t.open)loadBody(i)});
}
function renderRead(){
  var r=$("#mpr");if(!r)return;
  if(!S.thr.length){r.innerHTML='<p class=note>Vyberte zprávu.</p>';return}
  r.innerHTML='<h2 style="margin:0 0 10px">'+esc(S.thr[0].m.subject||"(bez předmětu)")+'</h2>'+(window.PCASE&&window.PCASE[S.thr[0].m.conversationId]?'<p><span class=mp-cat>Případ '+esc(window.PCASE[S.thr[0].m.conversationId])+'</span> <span class=note>pošta probíhala nad tímto případem</span></p>':'')+'<div class=mp-a><button class=g data-a=aiv>AI analýza vlákna</button><button class=g data-a=tord title="Změnit řazení zpráv ve vlákně">Řazení: '+(S.tord=="nove"?"nejnovější nahoře":"nejstarší nahoře")+' ⇅</button></div><div id=mpai class=note></div>'+S.thr.map(function(t,i){return '<div class=mp-m id=mm'+i+'>'+blk(t,i)+'</div>'}).join("");
  S.thr.forEach(function(t,i){frame(i)});
}
function blk(t,i){
  var x=t.m,f=x.from&&x.from.emailAddress||{};
  var h='<div class=mp-mh data-a=tg data-i='+i+'><b>'+esc(f.name||f.address||"")+'</b><span class=note>'+esc(dfull(dt(x)))+(x.hasAttachments?" 📎":"")+'</span></div>';
  if(!t.open)return h+'<div class=mp-mb><span class=note>'+esc(x.bodyPreview||"")+'</span></div>';
  h+='<div class=mp-mb>';
  if(t.b){
    h+='<div class=mp-hd>Od: '+esc(f.name||"")+' &lt;'+esc(f.address||"")+'&gt;<br>Komu: '+esc((t.b.toRecipients||[]).map(who).join(", "))+(t.b.ccRecipients&&t.b.ccRecipients.length?'<br>Kopie: '+esc(t.b.ccRecipients.map(who).join(", ")):"")+'</div>';
    h+='<div class=mp-a><button class=g data-a=rp data-i='+i+'>Odpovědět</button><button class=g data-a=ra data-i='+i+'>Odpovědět všem</button><button class=g data-a=fw data-i='+i+'>Přeposlat</button>';
    if(x.webLink)h+='<a class=g style="text-decoration:none;color:inherit" target=_blank rel=noopener href="'+esc(x.webLink)+'"><button class=g>Otevřít v Outlooku</button></a>';
    if(S.w)h+='<button class=g data-a=un data-i='+i+'>'+(x.isRead?"Označit nepřečtené":"Označit přečtené")+'</button><button class=g data-a=fl data-i='+i+'>'+(x.flag&&x.flag.flagStatus=="flagged"?"Zrušit příznak":"Označit příznakem")+'</button><button class=g data-a=ar data-i='+i+'>Archivovat</button><button class=g data-a=mv data-i='+i+'>Přesunout…</button><button class=g data-a=dl data-i='+i+'>Smazat</button><button class=g data-a=ct data-i='+i+'>Štítky…</button>';
    h+='</div>';
    if((x.categories||[]).length)h+='<div>'+x.categories.map(function(c){return '<span class=mp-cat>'+esc(c)+'</span>'}).join("")+'</div>';
    if(t.hasImg&&!t.img)h+='<div class=gbanner>Vzdálené obrázky jsou z bezpečnostních důvodů blokované. <button class=g data-a=img data-i='+i+'>Načíst obrázky</button></div>';
    h+='<iframe id=fr'+i+' sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox" title="Text zprávy"></iframe>';
    if(t.attErr)h+='<p class=note>Přílohy se nepodařilo načíst: '+esc(t.attErr)+'</p>';if(t.att&&t.att.length){h+='<div class=mp-a>'+t.att.filter(function(a){return !a.isInline||!t.cidDone[a.id]}).map(function(a){return '<button class=g data-a=at data-i='+i+' data-id="'+esc(a.id)+'">📎 '+esc(a.name)+' ('+Math.max(1,Math.round((a.size||0)/1024))+' kB)</button>'}).join("")+'</div>'}
  }else h+='<p class=note>Načítám…</p>';
  return h+'</div>';
}
function frame(i){
  var t=S.thr[i];if(!t||!t.open||!t.b)return;
  var fr=document.getElementById("fr"+i);if(!fr)return;
  var csp="default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:"+(t.img?" https: http:":"");
  var html='<!doctype html><meta charset=utf-8><meta http-equiv="Content-Security-Policy" content="'+csp+'"><base target=_blank><style>body{font:14px/1.5 Segoe UI,Arial,sans-serif;color:#222;margin:6px;word-wrap:break-word}img{max-width:100%;height:auto}pre{white-space:pre-wrap}blockquote{margin:0 0 0 8px;padding-left:8px;border-left:3px solid #ccc;color:#555}</style>'+t.html;
  fr.onload=function(){try{fr.style.height=(fr.contentDocument.documentElement.scrollHeight+10)+"px"}catch(e){}};
  fr.srcdoc=html;
}
async function loadBody(i){
  var t=S.thr[i];if(!t||t.b)return;
  var el=document.getElementById("mm"+i);
  try{
    var b=await GR.req("GET","/me/messages/"+enc(t.m.id)+"?$select=body,toRecipients,ccRecipients,from,replyTo",{sc:sc(),h:{Prefer:'outlook.body-content-type="html"'}});
    var html=b.body&&b.body.content||"";
    if(b.body&&b.body.contentType=="text")html="<pre>"+esc(html)+"</pre>";
    t.b=b;t.att=[];t.cidDone={};
    if(t.m.hasAttachments){try{t.att=(await GR.req("GET","/me/messages/"+enc(t.m.id)+"/attachments?$select=id,name,contentType,size,isInline,contentId",{sc:sc()})).value||[]}catch(e){try{t.att=(await GR.req("GET","/me/messages/"+enc(t.m.id)+"/attachments?$select=id,name,contentType,size,isInline",{sc:sc()})).value||[]}catch(e2){t.attErr=e2.message}}}
    var inl=t.att.filter(function(a){return a.isInline&&a.contentId&&(a.size||0)<1500000});
    for(var n=0;n<inl.length;n++){
      var a=inl[n];
      if(html.indexOf("cid:"+a.contentId)<0)continue;
      try{var d=await GR.req("GET","/me/messages/"+enc(t.m.id)+"/attachments/"+enc(a.id)+"?$select=contentBytes,contentType",{sc:sc()});
        html=html.split("cid:"+a.contentId).join("data:"+(d.contentType||a.contentType)+";base64,"+d.contentBytes);t.cidDone[a.id]=1}catch(e){}
    }
    t.hasImg=/<img[^>]+src=["']?https?:/i.test(html);
    t.html=html;
    if(S.w&&!t.m.isRead&&S.alias!="drafts"){try{await GR.req("PATCH","/me/messages/"+enc(t.m.id),{sc:W,body:{isRead:true}});t.m.isRead=true;var it=S.items.filter(function(x){return x.id==t.m.id})[0];if(it)it.isRead=true;rl()}catch(e){}}
  }catch(e){t.b={};t.html="<p>Zprávu se nepodařilo načíst ("+esc(e.message)+").</p>";t.att=[];t.cidDone={}}
  if(el){el.innerHTML=blk(t,i);frame(i)}
}
async function download(i,id){
  var t=S.thr[i];
  try{var bl=await GR.req("GET","/me/messages/"+enc(t.m.id)+"/attachments/"+enc(id)+"/$value",{sc:sc(),blob:true});
    var a=t.att.filter(function(x){return x.id==id})[0];var u=URL.createObjectURL(bl);var l=document.createElement("a");l.href=u;l.download=a?a.name:"priloha";document.body.appendChild(l);l.click();l.remove();setTimeout(function(){URL.revokeObjectURL(u)},3000)}
  catch(e){alert("Přílohu se nepodařilo stáhnout: "+e.message)}
}

/* AKCE NAD ZPRÁVOU (jen s Mail.ReadWrite) */
async function mut(i,fn){
  var t=S.thr[i];
  try{await fn(t);renderRead();S.thr.forEach(function(x,j){if(x.open&&!x.b)loadBody(j)});rl()}catch(e){alert("Akce se nezdařila: "+(e.detail||e.message))}
}
async function moveTo(i,dest){
  var t=S.thr[i];
  await GR.req("POST","/me/messages/"+enc(t.m.id)+"/move",{sc:W,body:{destinationId:dest}});
  S.items=S.items.filter(function(x){return x.id!=t.m.id});S.thr.splice(i,1);S.sel=S.thr.length?S.sel:null;
}
function foldersFlat(){var a=S.fo.wk.map(function(f){return [f.id,f.name]});S.fo.other.forEach(function(f){a.push([f.id,f.displayName])});Object.keys(S.kids).forEach(function(k){S.kids[k].forEach(function(f){a.push([f.id,f.displayName])})});return a}
function pick(title,opts,cb){
  var d=GR.modal('<h2>'+esc(title)+'</h2><select id=pk size=8 style="width:100%">'+opts.map(function(o){return '<option value="'+esc(o[0])+'">'+esc(o[1])+'</option>'}).join("")+'</select><div class=gm-r><button class=b id=pkok>OK</button><button class=g id=pkx>Zpět</button></div>');
  d.querySelector("#pkx").onclick=GR.closeModal;
  d.querySelector("#pkok").onclick=function(){var v=d.querySelector("#pk").value;if(v){GR.closeModal();cb(v)}};
}
function catPick(i){
  var t=S.thr[i],cur=t.m.categories||[],all=cats().concat(cur).filter(function(c,j,a){return a.indexOf(c)==j});
  var d=GR.modal('<h2>Štítky</h2>'+all.map(function(c){return '<label style="color:var(--f)"><input type=checkbox style="width:auto" value="'+esc(c)+'"'+(cur.indexOf(c)>=0?" checked":"")+'> '+esc(c)+'</label>'}).join("")+'<label>Nový štítek</label><input id=nc><div class=gm-r><button class=b id=ok>Uložit</button><button class=g id=x>Zpět</button></div>');
  d.querySelector("#x").onclick=GR.closeModal;
  d.querySelector("#ok").onclick=function(){
    var v=[].slice.call(d.querySelectorAll("input[type=checkbox]:checked")).map(function(x){return x.value});var n=d.querySelector("#nc").value.trim();if(n)v.push(n);
    GR.closeModal();mut(i,async function(t){await GR.req("PATCH","/me/messages/"+enc(t.m.id),{sc:W,body:{categories:v}});t.m.categories=v;var it=S.items.filter(function(x){return x.id==t.m.id})[0];if(it)it.categories=v});
  };
}

/* PSANÍ */
function startCompose(mode,i){
  var src=i!=null?S.thr[i].m:null,b=i!=null?S.thr[i].b||{}:{};
  var c={mode:mode,src:src,draft:null,quoted:"",up:{},to:"",cc:"",subj:"",text:"\n\n"+sign()};
  if(src){
    var me=GR.me(),subj=src.subject||"";
    if(mode=="fwd"){c.subj=/^(fw|fwd):/i.test(subj)?subj:"Fwd: "+subj}
    else{
      c.subj=/^(re|odp):/i.test(subj)?subj:"Re: "+subj;
      var rt=(b.replyTo&&b.replyTo.length?b.replyTo:[src.from]);
      c.to=rt.map(addr).filter(Boolean).join(", ");
      if(mode=="all"){
        var o=[].concat(b.toRecipients||[],b.ccRecipients||[]).map(addr).filter(function(a){return a&&a!=me&&c.to.indexOf(a)<0});
        c.cc=o.join(", ");
      }
    }
  }
  S.c=c;composeForm();
}
function composeForm(){
  var c=S.c;
  var d=GR.modal('<h2>'+({new:"Nová zpráva",reply:"Odpověď",all:"Odpověď všem",fwd:"Přeposlání"})[c.mode]+'</h2>'+
   (S.w?'':'<div class=gbanner>Ukládání konceptů a odesílání z aplikace čeká na souhlas správce. Zprávu otevřu předvyplněnou v Outlooku na webu a odeslání potvrdíte tam.</div>')+
   '<label>Komu</label><input id=cto value="'+esc(c.to)+'"><label>Kopie</label><input id=ccc value="'+esc(c.cc)+'"><label>Předmět</label><input id=csu value="'+esc(c.subj)+'"><label>Text</label><textarea id=ctx>'+esc(c.text)+'</textarea>'+
   (c.mode!="new"&&S.w?'<p class=note>Citovaná původní zpráva se připojí automaticky.</p>':'')+
   (S.w?'<label>Přílohy (do 3 MB každá)</label><input type=file id=cfi multiple>'+((c.files||[]).length?'<p class=note>Už přiloženo: '+esc(c.files.map(function(x){return x.name}).join(", "))+'</p>':''):'')+
   '<p id=cst class=note></p><div class=gm-r><button class=g id=cout>Otevřít v Outlooku</button>'+(S.w?'<button class=g id=csv>Uložit koncept</button><button class=b id=csn>Odeslat…</button>':'')+'<span class=sp></span><button class=g id=cx>Zavřít</button></div>',true);
  d.querySelector("#cx").onclick=GR.closeModal;
  d.querySelector("#cout").onclick=function(){grab();var f=S.c;window.open(outlookCompose(f.to,f.cc,f.subj,f.text),"_blank","noopener")};
  if(S.w){d.querySelector("#csv").onclick=function(){saveDraft(true)};d.querySelector("#csn").onclick=confirmSend}
}
function rd(){return {to:$("#cto").value,cc:$("#ccc").value,subj:$("#csu").value,text:$("#ctx").value}}
function st(t){var e=$("#cst");if(e)e.textContent=t}
function grab(){
  var c=S.c;if(!$("#cto"))return;
  var f=rd();c.to=f.to;c.cc=f.cc;c.subj=f.subj;c.text=f.text;
  var fi=$("#cfi");c.files=c.files||[];
  if(fi&&fi.files)for(var n=0;n<fi.files.length;n++){var x=fi.files[n];if(!c.files.some(function(y){return y.name==x.name&&y.size==x.size}))c.files.push(x)}
}
async function saveDraft(show){
  grab();
  var c=S.c;
  try{
    st("Ukládám…");
    var html="<div>"+c.text.split("\n").map(esc).join("<br>")+"</div>";
    if(!c.draft){
      if(c.mode=="new"||!c.src){c.draft=await GR.req("POST","/me/messages",{sc:W,body:{subject:c.subj,body:{contentType:"HTML",content:html},toRecipients:recips(c.to),ccRecipients:recips(c.cc)}});c.quoted=""}
      else{var ep={reply:"createReply",all:"createReplyAll",fwd:"createForward"}[c.mode];c.draft=await GR.req("POST","/me/messages/"+enc(c.src.id)+"/"+ep,{sc:W,body:{}});c.quoted=c.draft.body&&c.draft.body.content||""}
    }
    await GR.req("PATCH","/me/messages/"+enc(c.draft.id),{sc:W,body:{subject:c.subj,toRecipients:recips(c.to),ccRecipients:recips(c.cc),body:{contentType:"HTML",content:html+(c.quoted?"<hr>"+c.quoted:"")}}});
    for(var n=0;n<(c.files||[]).length;n++){var fl=c.files[n];if(c.up[fl.name+fl.size])continue;
      if(fl.size>3*1024*1024){st("Příloha "+fl.name+" je větší než 3 MB, přiložte ji v Outlooku.");continue}
      var b64=await new Promise(function(ok,ko){var r=new FileReader();r.onload=function(){ok(String(r.result).split(",")[1])};r.onerror=ko;r.readAsDataURL(fl)});
      await GR.req("POST","/me/messages/"+enc(c.draft.id)+"/attachments",{sc:W,body:{"@odata.type":"#microsoft.graph.fileAttachment",name:fl.name,contentBytes:b64}});c.up[fl.name+fl.size]=1}
    st(show?"Koncept uložen ve složce Koncepty.":"");
    return true;
  }catch(e){st("Uložení se nezdařilo: "+(e.detail||e.message));return false}
}
async function confirmSend(){
  grab();var c=S.c;
  if(!recips(c.to).length){st("Vyplňte alespoň jednoho příjemce (platný e-mail).");return}
  if(!(await GR.has(SN))){st("Odesílání z aplikace zatím není povoleno (chybí Mail.Send). Uložte koncept a odešlete ho v Outlooku.");return}
  var n=(c.files||[]).length;
  var d=GR.modal('<h2>Opravdu odeslat?</h2><p>Komu: <b>'+esc(c.to)+'</b>'+(c.cc?'<br>Kopie: <b>'+esc(c.cc)+'</b>':'')+'<br>Předmět: <b>'+esc(c.subj||"(bez předmětu)")+'</b>'+(n?'<br>Příloh: '+n:'')+'</p><p class=note>Zpráva odejde okamžitě a nejde vzít zpět.</p><div class=gm-r><button class=b id=yes>Ano, odeslat</button><button class=g id=no>Zpět k úpravě</button></div>');
  d.querySelector("#no").onclick=composeForm;
  d.querySelector("#yes").onclick=async function(){
    d.querySelector("#yes").disabled=true;
    var ok=await saveDraft(false);
    if(!ok){composeForm();return}
    try{await GR.req("POST","/me/messages/"+enc(S.c.draft.id)+"/send",{sc:SN});GR.closeModal();S.c=null;alert("Zpráva byla odeslána.");reloadList()}
    catch(e){composeForm();st("Odeslání se nezdařilo: "+(e.detail||e.message)+". Koncept je uložený.")}
  };
}

/* OVLÁDÁNÍ */
async function reloadList(more){
  var l=$("#mpl");if(l&&!more)l.innerHTML='<p class=note style="padding:12px">Načítám…</p>';
  try{await loadList(more)}catch(e){S.items=[];S.err="Chyba: "+(e.detail||e.message)}
  rl();
}
function readTb(){
  S.q=$("#mq").value;S.pole=$("#mpo").value;S.f=$("#mf").value;S.od=$("#mod").value;S.kat=$("#mk").value;S.pc=$("#mpc")?$("#mpc").value:"";S.dod=$("#md1").value;S.ddo=$("#md2").value;S.all=$("#mall").checked;
}
async function toggleFolder(id){
  S.open[id]=!S.open[id];
  if(S.open[id]&&!S.kids[id]){try{S.kids[id]=await GR.all("/me/mailFolders/"+enc(id)+"/childFolders?$top=100&$select=id,displayName,unreadItemCount,totalItemCount,childFolderCount",{sc:R})}catch(e){S.kids[id]=[]}}
  rf();
}
async function onClick(e){
  var el=e.target.closest("[data-a]");if(!el)return;
  var a=el.dataset.a,i=el.dataset.i!=null?+el.dataset.i:null;
  if(a=="ex"){e.stopPropagation();return toggleFolder(el.dataset.id)}
  if(a=="fo"){S.cur=el.dataset.id;S.name=el.dataset.n;S.alias=el.dataset.al||"";S.sel=null;S.thr=[];renderRead();rf();return reloadList()}
  if(a=="sel")return openThread(el.dataset.k);
  if(a=="more")return reloadList(true);
  if(a=="go"){readTb();return reloadList()}
  if(a=="refresh"){readTb();try{await loadFolders();rf()}catch(x){}return reloadList()}
  if(a=="vw"){S.view=el.dataset.w;document.querySelectorAll("[data-a=vw]").forEach(function(b){b.classList.toggle("on",b.dataset.w==S.view)});return rl()}
  if(a=="tord"){S.tord=S.tord=="nove"?"stare":"nove";GR.ls("elzaVlaknoRazeni",S.tord);S.thr.reverse();return renderRead()}
  if(a=="new")return startCompose("new");
  if(a=="sig"){var d=GR.modal('<h2>Podpis</h2><textarea id=sg style="min-height:120px">'+esc(sign())+'</textarea><p class=note>Podpis se vkládá do nových zpráv a odpovědí. Uložen jen v tomto prohlížeči.</p><div class=gm-r><button class=b id=ok>Uložit</button><button class=g id=x>Zavřít</button></div>');d.querySelector("#x").onclick=GR.closeModal;d.querySelector("#ok").onclick=function(){GR.ls("elzaPodpis",d.querySelector("#sg").value);GR.closeModal()};return}
  if(a=="tg"){var t=S.thr[i];t.open=!t.open;var m=document.getElementById("mm"+i);m.innerHTML=blk(t,i);frame(i);if(t.open&&!t.b)loadBody(i);return}
  if(a=="img"){S.thr[i].img=true;document.getElementById("mm"+i).innerHTML=blk(S.thr[i],i);frame(i);return}
  if(a=="aiv"){var bx=document.getElementById("mpai");if(!window.AI){bx.textContent="AI modul není načten.";return}bx.textContent="AI pracuje…";
    try{var parts=(S.tord=="nove"?S.thr.slice().reverse():S.thr).slice(-8).map(function(t){var f=t.m.from&&t.m.from.emailAddress||{},h=t.b&&t.b.body&&t.b.body.content||"";if(t.b&&t.b.body&&t.b.body.contentType=="html"){var d=document.createElement("div");d.innerHTML=h.replace(/<(style|script)[\s\S]*?<\/\1>/gi,"");h=d.textContent||""}h=(h||t.m.bodyPreview||"").replace(/\s+/g," ").trim().slice(0,2500);return "Od: "+(f.name||f.address||"")+" ("+dfull(dt(t.m))+")\n"+h}).join("\n---\n");
      var rr=await AI.ask("AG-POSTA",{task:"Shrň toto e-mailové vlákno ve 3 větách, napiš kdo čeká na čí odpověď a navrhni jeden konkrétní další krok. Nic neodesílej, jen navrhni.",data:"Předmět: "+(S.thr[0].m.subject||"")+"\n"+parts,max:700});
      bx.style.whiteSpace="pre-wrap";bx.textContent=rr+"\n(Návrh AI, zkontrolujte. Nic se neodeslalo.)"}catch(er){bx.textContent="AI: "+er.message}return}
  if(a=="at")return download(i,el.dataset.id);
  if(a=="rp")return startCompose("reply",i);
  if(a=="ra")return startCompose("all",i);
  if(a=="fw")return startCompose("fwd",i);
  if(a=="un")return mut(i,async function(t){var v=!t.m.isRead;await GR.req("PATCH","/me/messages/"+enc(t.m.id),{sc:W,body:{isRead:v}});t.m.isRead=v;var it=S.items.filter(function(x){return x.id==t.m.id})[0];if(it)it.isRead=v});
  if(a=="fl")return mut(i,async function(t){var on=t.m.flag&&t.m.flag.flagStatus=="flagged",fl={flagStatus:on?"notFlagged":"flagged"};await GR.req("PATCH","/me/messages/"+enc(t.m.id),{sc:W,body:{flag:fl}});t.m.flag=fl;var it=S.items.filter(function(x){return x.id==t.m.id})[0];if(it)it.flag=fl});
  if(a=="ar")return mut(i,function(){return moveTo(i,"archive")});
  if(a=="dl"){if(confirm("Přesunout zprávu do Odstraněné pošty?"))mut(i,function(){return moveTo(i,"deleteditems")});return}
  if(a=="mv")return pick("Přesunout do složky",foldersFlat(),function(v){mut(i,function(){return moveTo(i,v)})});
  if(a=="ct")return catPick(i);
}
function onChange(e){
  var el=e.target;
  if(el.dataset&&el.dataset.a=="wd"){S.wd=+el.value;return reloadList()}
  if(el.id=="mlord"){S.lord=el.value;GR.ls("elzaSeznamRazeni",S.lord);return rl()}
  if(el.id=="mf"||el.id=="mk"||el.id=="mpc"||el.id=="mall"||el.id=="md1"||el.id=="md2"||el.id=="mpo"){readTb();if(el.id=="mf"||el.id=="mk"||el.id=="mpc")return rl();return reloadList()}
}
function onKey(e){if(e.key=="Enter"&&(e.target.id=="mq"||e.target.id=="mod")){readTb();reloadList()}}

async function mail(){
  S.w=await GR.has(W);S.c=null;
  try{if(!S.fo)await loadFolders();await loadList()}catch(e){if(e.status==401||e.status==403||!e.status)return nope(e);S.items=[];S.err="Chyba: "+(e.detail||e.message)}
  return (S.w?"":'<div class=gbanner>Čtení pošty je zapnuté. Psaní konceptů, přesuny a odesílání v aplikaci čekají na souhlas správce (Mail.ReadWrite, Mail.Send). Do té doby se zpráva otevře předvyplněná v Outlooku na webu.</div>')+'<div class=mp id=mp><div class=mp-f id=mpf></div><div class=mp-l>'+tb()+'<div class=mp-ls id=mpl></div></div><div class=mp-r id=mpr><p class=note>Vyberte zprávu.</p></div></div>';
}
function mailM(){
  var b=$("#gt");if(b)return nopeM();
  var mp=$("#mp");if(!mp)return;
  rf();rl();
  mp.addEventListener("click",onClick);mp.addEventListener("change",onChange);mp.addEventListener("keydown",onKey);
  S.thr=[];S.sel=null;
}
window.MODS=window.MODS||{};window.MODS.posta=[mail,mailM];
})();
