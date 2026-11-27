/* ELZA Asistent: společný základ pro Microsoft Graph (pošta, kalendář). Delegovaně, každý vidí jen svou poštu a svůj kalendář. Nic se neukládá mimo M365. Ukázkový režim: přidat ?demo=1 (a ?ro=1 pro simulaci bez práv zápisu). */
(function(){
var G="https://graph.microsoft.com/v1.0",DEMO=/[?&]demo=1/.test(location.search),RO=/[?&]ro=1/.test(location.search);
var perm={};
var R={demo:DEMO,ro:RO};
R.tok=async function(sc,popup){
  if(DEMO)return "demo";
  try{return (await m.acquireTokenSilent({scopes:sc,account:acc})).accessToken}
  catch(e){if(!popup)throw e;return (await m.acquireTokenPopup({scopes:sc,account:acc})).accessToken}
};
R.has=async function(sc){
  var k=sc.join(" ");
  if(DEMO){return RO?/^(Mail\.Read|Calendars\.Read)$/.test(k):true}
  if(k in perm)return perm[k];
  try{await R.tok(sc,false);perm[k]=true}catch(e){perm[k]=false}
  return perm[k];
};
R.forget=function(){perm={}};
/* 0.88.7: Graph omezuje počet souběžných požadavků (HTTP 429 „Too Many Requests“). Kalendář načítal všechny sdílené
   kalendáře najednou a u většiny dostal 429, takže události kolegů chyběly. Proto: nejvýš 4 požadavky současně
   a opakování při 429 (vždy, Graph požadavek nezpracoval) a při 503/504 (jen čtení) podle Retry-After, nejvýš 4 pokusy. */
var BEZI=0,FRONTA=[],MAXSOUB=4;
function slot(){return new Promise(function(ok){if(BEZI<MAXSOUB){BEZI++;ok()}else FRONTA.push(ok)})}
function uvolni(){var n=FRONTA.shift();if(n)n();else BEZI--}
function cekej(ms){return new Promise(function(ok){setTimeout(ok,ms)})}
async function gfetch(url,init,method){
  for(var pokus=0;;pokus++){
    await slot();var r;
    try{r=await fetch(url,init)}finally{uvolni()}
    var znovu=r.status==429||((r.status==503||r.status==504)&&method=="GET");
    if(!znovu||pokus>=3)return r;
    var ra=+r.headers.get("Retry-After");
    await cekej(Math.min(20000,ra>0?ra*1000:1000*Math.pow(2,pokus))+Math.random()*300);
  }
}
R.gfetch=gfetch;
R.req=async function(method,path,o){
  o=o||{};
  if(DEMO)return window.GDEMO(method,path,o.body);
  var t=await R.tok(o.sc||["Mail.Read"],false);
  var h={Authorization:"Bearer "+t};
  if(o.body)h["Content-Type"]="application/json";
  for(var k in (o.h||{}))h[k]=o.h[k];
  var r=await gfetch(path.indexOf("http")==0?path:G+path,{method:method,headers:h,body:o.body?JSON.stringify(o.body):undefined},method);
  if(r.status==204)return null;
  if(!r.ok){var e=new Error("Graph HTTP "+r.status);e.status=r.status;try{e.detail=(await r.json()).error.message}catch(x){}throw e}
  if(o.blob)return r.blob();
  var ct=r.headers.get("content-type")||"";
  return ct.indexOf("json")>=0?r.json():null;
};
R.all=async function(path,o,max){
  var out=[],p=path,n=0;
  while(p&&n<(max||5)){var r=await R.req("GET",p,o);out=out.concat(r.value||[]);p=r["@odata.nextLink"];n++}
  return out;
};
R.css=function(id,txt){if(document.getElementById(id))return;var s=document.createElement("style");s.id=id;s.textContent=txt;document.head.appendChild(s)};
R.ls=function(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
/* čas z Graphu (Europe/Prague bez zóny) na místní Date */
R.pd=function(s){var x=/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/.exec(s||"");return x?new Date(+x[1],x[2]-1,+x[3],+x[4],+x[5]):new Date(s)};
R.iso=function(d){function p(n){return (n<10?"0":"")+n}return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())};
R.hm=function(d){return d.toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})};
R.me=function(){return ((typeof acc!="undefined"&&acc&&acc.username)||"").toLowerCase()};
R.name=function(){return (typeof acc!="undefined"&&acc&&(acc.name||acc.username))||""};
R.modal=function(html,wide){
  R.closeModal();
  var d=document.createElement("div");d.id="gmodal";d.className="gm";
  d.innerHTML='<div class="gm-b'+(wide?' wide':'')+'">'+html+'</div>';
  document.body.appendChild(d);return d;
};
R.closeModal=function(){var d=document.getElementById("gmodal");if(d)d.remove()};
R.css("gcss",".gm{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:50;display:flex;align-items:center;justify-content:center;padding:16px}.gm-b{background:var(--bg);color:var(--f);border:1px solid var(--l);border-radius:12px;padding:18px;width:min(520px,100%);max-height:92vh;overflow:auto}.gm-b.wide{width:min(760px,100%)}.gm-b h2{margin:0 0 10px;font-size:18px}.gm-b label{display:block;font-size:12px;color:var(--m);margin:8px 0 2px}.gm-b input,.gm-b textarea,.gm-b select{width:100%;min-width:0}.gm-b textarea{background:var(--p);color:var(--f);border:1px solid var(--l);border-radius:9px;padding:8px 10px;font:inherit;min-height:200px;resize:vertical}.gm-r{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:center}.gm-r .sp{flex:1}button.g{cursor:pointer;background:var(--p);color:var(--f);border:1px solid var(--l);border-radius:9px;padding:6px 10px;font:inherit}button.g:hover{border-color:var(--a)}button.g.on{background:var(--b);color:#fff;border-color:var(--b)}button.g:disabled{opacity:.5;cursor:default}.gbanner{background:var(--p);border:1px solid var(--l);border-left:4px solid var(--w);border-radius:9px;padding:8px 12px;margin-bottom:10px;color:var(--m);font-size:13px}");
window.GR=R;
})();
