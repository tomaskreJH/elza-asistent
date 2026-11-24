/* ELZA Asistent: osobní nastavení se synchronizuje přes SharePoint (seznam NastaveniAplikace, řádek user:<e-mail>), takže platí na všech zařízeních
   (PC, tablet, Android, iPhone). Prohlížeč drží jen rychlou kopii. Zařízení-specifické věci (kanál beta/stabilní, API klíče) se NESYNCHRONIZUJÍ. */
(function(){
var KEYS=['elzaTema','elzaMenu','elzaMenuOff','elzaKalPohled','elzaKalVyber','elzaPodpis','elzaVlaknoRazeni','elzaSeznamRazeni','elzaLimitUSD','elzaPin','elzaPrvniHotovo','elzaNastRezim'],TSK='elzaSyncTs';
var st=Storage.prototype,gi=st.getItem,si=st.setItem,ri=st.removeItem,N={stav:'čeká na přihlášení',poslední:0,jeSync:false};window.NAST=N;
function ts(){try{return JSON.parse(gi.call(localStorage,TSK)||'{}')}catch(e){return{}}}
function setTs(o){try{si.call(localStorage,TSK,JSON.stringify(o))}catch(e){}}
function mark(k){var t=ts();t[k]=Date.now();setTs(t);dirty()}
st.setItem=function(k,v){si.call(this,k,v);if(this===localStorage&&KEYS.indexOf(k)>=0&&!N._ap)mark(k)};
st.removeItem=function(k){ri.call(this,k);if(this===localStorage&&KEYS.indexOf(k)>=0&&!N._ap)mark(k)};
var timer=0,ID=0,LISTOK=null;
function who(){try{return 'user:'+String(acc.username||'').toLowerCase()}catch(e){return ''}}
function dirty(){clearTimeout(timer);timer=setTimeout(save,1500)}
async function rtok(){await token(false);return tok}
async function wtok(){var W=[SP+'/AllSites.Write'];try{return (await m.acquireTokenSilent({scopes:W,account:acc})).accessToken}catch(e){return (await m.acquireTokenPopup({scopes:W,account:acc})).accessToken}}
function url(p){return SP+SITE+'/_api/web/'+p}
async function load(force){var u=who();if(!u)return;if(!force&&Date.now()-N.poslední<3e4)return;N.poslední=Date.now();
 try{var t=await rtok();var r=await fetch(url("lists/getbytitle('NastaveniAplikace')/items?$top=500&$select=Id,Title,Hodnota"),{headers:{Authorization:'Bearer '+t,Accept:'application/json;odata=nometadata'}});
  if(r.status==404){LISTOK=false;N.stav='jen v tomto zařízení (seznam NastaveniAplikace zatím neexistuje, založí se při první změně vlastníkem)';return}
  if(!r.ok)throw new Error('HTTP '+r.status);LISTOK=true;var row=(await r.json()).value.filter(function(x){return x.Title==u})[0];
  if(row){ID=row.Id;var d={};try{d=JSON.parse(row.Hodnota||'{}')}catch(e){}apply(d)}
  N.jeSync=true;N.stav='synchronizováno se SharePointem';
  if(!row&&Object.keys(ts()).length)dirty()}catch(e){N.stav='synchronizace selhala: '+e.message}}
function apply(d){var v=d.v||{},t=d.t||{},lt=ts(),ch=[];N._ap=true;try{KEYS.forEach(function(k){if(!(k in t))return;if((lt[k]||0)>=t[k])return;if(v[k]===null||v[k]===undefined)ri.call(localStorage,k);else si.call(localStorage,v[k]===undefined?'':localStorage,k,v[k]);lt[k]=t[k];ch.push(k)})}finally{N._ap=false}
 if(!ch.length)return;setTs(lt);
 try{if(ch.indexOf('elzaTema')>=0)document.body.classList.toggle('dark',gi.call(localStorage,'elzaTema')=='d');if(ch.indexOf('elzaMenu')>=0){OPEN=JSON.parse(gi.call(localStorage,'elzaMenu')||'{}')}nav();if(typeof cur!='undefined'&&(cur=='menu'||cur=='kalendar'||cur=='posta')&&ch.some(function(k){return k!='elzaTema'&&k!='elzaMenu'&&k!='elzaMenuOff'}))go(cur);else if(cur=='menu')go(cur)}catch(e){}}
async function ensure(){if(LISTOK)return;var t=await wtok(),h={Authorization:'Bearer '+t,Accept:'application/json;odata=nometadata','Content-Type':'application/json;odata=nometadata'};
 var r=await fetch(url("lists/getbytitle('NastaveniAplikace')?$select=Id"),{headers:h});if(r.ok){LISTOK=true;return}
 if(!(window.PRO&&window.PRO.role=='vlastnik'))throw new Error('seznam založí vlastník');
 var a=await fetch(url('lists'),{method:'POST',headers:h,body:JSON.stringify({Title:'NastaveniAplikace',BaseTemplate:100,Description:'Sdílená nastavení aplikace ELZA asistent (menu, osobní nastavení uživatelů).'})});if(!a.ok)throw new Error(a.status==403?'seznam NastaveniAplikace musí jednou založit správce webu (aplikace ho zakládat nesmí); do té doby se nastavení drží jen v tomto zařízení':'HTTP '+a.status);
 var f=await fetch(url("lists/getbytitle('NastaveniAplikace')/fields"),{method:'POST',headers:h,body:JSON.stringify({Title:'Hodnota',FieldTypeKind:3})});if(!f.ok&&f.status!=409)throw new Error('HTTP '+f.status);LISTOK=true}
async function save(){var u=who();if(!u)return;try{await ensure();var t=await wtok(),lt=ts(),v={},tt={};KEYS.forEach(function(k){if(k in lt){v[k]=gi.call(localStorage,k);tt[k]=lt[k]}});
  var h={Authorization:'Bearer '+t,Accept:'application/json;odata=nometadata','Content-Type':'application/json;odata=nometadata'};
  if(ID){var cur0=await fetch(url("lists/getbytitle('NastaveniAplikace')/items("+ID+")?$select=Hodnota"),{headers:h});if(cur0.ok){try{var o=JSON.parse((await cur0.json()).Hodnota||'{}');Object.keys(o.t||{}).forEach(function(k){if((o.t[k]||0)>(tt[k]||0)){tt[k]=o.t[k];v[k]=o.v[k]}})}catch(e){}}}
  var body=JSON.stringify({Title:u,Hodnota:JSON.stringify({v:v,t:tt})});
  if(ID){var g=Object.assign({'X-HTTP-Method':'MERGE','IF-MATCH':'*'},h);var r=await fetch(url("lists/getbytitle('NastaveniAplikace')/items("+ID+")"),{method:'POST',headers:g,body:body});if(!r.ok)throw new Error('HTTP '+r.status)}
  else{var r2=await fetch(url("lists/getbytitle('NastaveniAplikace')/items"),{method:'POST',headers:h,body:body});if(!r2.ok)throw new Error('HTTP '+r2.status);ID=(await r2.json()).Id}
  N.jeSync=true;N.stav='synchronizováno se SharePointem'}catch(e){N.stav='uložení do SharePointu selhalo: '+e.message}}
N.load=load;N.save=save;
/* po přihlášení načíst, při návratu na kartu/aplikaci obnovit (jiné zařízení mohlo změnit) */
var iv=setInterval(function(){try{if(typeof tok!='undefined'&&tok&&typeof acc!='undefined'&&acc){clearInterval(iv);load(true)}}catch(e){}},800);
document.addEventListener('visibilitychange',function(){if(document.visibilityState=='visible')try{if(tok&&acc)load(false)}catch(e){}});
window.addEventListener('online',function(){try{if(tok&&acc)load(true)}catch(e){}});
})();
