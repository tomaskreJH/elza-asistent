/* Strážce (0.44.0): kontrola integrity kódu, společná (sdílená) ochrana přes SharePoint, učící se knihovna vzorů.
   Sdílená data jsou v SharePointu (soukromě), ne v kódu na veřejném GitHubu: útočník, který čte kód, nezná naučené vzory ani schválené otisky.
   Řádek 'sdileno:straz' v seznamu NastaveniAplikace: {blok:[],vzory:[],appr:{ver,f:{soubor:otisk}},inc:[]}. */
(function(){
var T='sdileno:straz',S={blok:[],vzory:[],appr:null,inc:[],id:0,stav:'nenačteno',integ:null,lock:false,compiled:[]},tmr=0,NOPE=false;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ur(p){return SP+SITE+'/_api/web/'+p}
async function rt(){await token(false);return tok}
async function wt(){var W=[SP+'/AllSites.Write'];try{return(await m.acquireTokenSilent({scopes:W,account:acc})).accessToken}catch(e){return(await m.acquireTokenPopup({scopes:W,account:acc})).accessToken}}
function ready(){try{return typeof tok!='undefined'&&tok&&tok!='demo'&&typeof acc!='undefined'&&acc}catch(e){return false}}
function comp(){S.compiled=[];S.vzory.forEach(function(v){try{S.compiled.push([new RegExp(v.s,'i'),+v.w||3,'naučený vzor: '+(v.p||'')])}catch(e){}})}
async function load(){try{if(!ready()){S.stav='jen v tomto zařízení (ukázkový režim nebo nepřihlášeno)';return}
 var r=await fetch(ur("lists/getbytitle('NastaveniAplikace')/items?$filter=Title eq '"+T+"'&$select=Id,Hodnota"),{headers:{Authorization:'Bearer '+await rt(),Accept:'application/json;odata=nometadata'}});
 if(r.status==404){S.stav='jen v tomto zařízení (seznam NastaveniAplikace neexistuje)';return}if(!r.ok)throw new Error('HTTP '+r.status);
 var row=(await r.json()).value[0];if(row){S.id=row.Id;var d={};try{d=JSON.parse(row.Hodnota||'{}')}catch(e){}var FP=/meta\s+http-equiv/i,n0=(d.blok||[]).length+(d.inc||[]).length;S.blok=(d.blok||[]).filter(function(b){return !FP.test(b.w||'')});S.vzory=d.vzory||[];S.appr=d.appr||null;S.inc=(d.inc||[]).filter(function(x){return !FP.test((x.h||[]).join(' '))});if(S.blok.length+S.inc.length!=n0)dirty()}
 S.stav='sdíleno přes SharePoint';comp()}catch(e){S.stav='sdílení selhalo: '+e.message}}
function dirty(){clearTimeout(tmr);tmr=setTimeout(save,1500)}
async function save(){if(!ready()){return}try{var h={Authorization:'Bearer '+await wt(),Accept:'application/json;odata=nometadata','Content-Type':'application/json;odata=nometadata'},b=JSON.stringify({Title:T,Hodnota:JSON.stringify({blok:S.blok,vzory:S.vzory,appr:S.appr,inc:S.inc.slice(0,100)})});
 if(S.id){h['IF-MATCH']='*';h['X-HTTP-Method']='MERGE'}var r=await fetch(ur("lists/getbytitle('NastaveniAplikace')/items"+(S.id?'('+S.id+')':'')),{method:'POST',headers:h,body:b});
 if(!r.ok)throw new Error('HTTP '+r.status);if(!S.id){await load()}S.stav='sdíleno přes SharePoint'}catch(e){S.stav='uložení do SharePointu selhalo: '+e.message}}
/* integrita kódu */
function base(){return location.pathname.replace(/[^\/]*$/,'')}
function files(){var a=['index.html','portal.html','portal.js'],b=base();document.querySelectorAll('script[src]').forEach(function(s){try{var u=new URL(s.src,location.href);if(u.origin==location.origin&&u.pathname.indexOf(b)==0)a.push(u.pathname.slice(b.length))}catch(e){}});return a.filter(function(x,i){return a.indexOf(x)==i})}
async function sha(buf){var h=await crypto.subtle.digest('SHA-256',buf);return Array.from(new Uint8Array(h)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
async function hashAll(){var F=files(),o={};await Promise.all(F.map(async function(f){try{var r=await fetch(f,{cache:'no-store'});if(r.ok)o[f]=await sha(await r.arrayBuffer())}catch(e){}}));return o}
async function manifest(){try{var r=await fetch('integrity.json',{cache:'no-store'});return r.ok?await r.json():null}catch(e){return null}}
function diff(a,b){var d=[];Object.keys(a).forEach(function(k){if(!b||b[k]!==a[k])d.push(k)});return d}
async function check(again){var cur=await hashAll(),mf=await manifest(),res={t:Date.now(),ver:window.VER||'',cur:cur,state:'ok',d:[],note:''};
 var ver=(typeof VER!='undefined')?VER:'';res.ver=ver;
 if(mf&&mf.ver==ver){var dm=diff(cur,mf.f).filter(function(k){return mf.f[k]!==undefined||true});if(dm.length){if(!again){await new Promise(function(r){setTimeout(r,20000)});return check(true)}res.state='alarm';res.d=dm;res.note='Soubory se liší od vydaného manifestu (zásah do kódu nebo do hostingu).'}}
 if(res.state=='ok'){if(!S.appr){res.state='zaklad';res.note='Zatím není schválen žádný základ otisků.'}else{var da=diff(cur,S.appr.f);if(da.length){res.d=da;if(S.appr.ver==ver){res.state='alarm';res.note='Kód se změnil bez změny verze.'}else{res.state='nova';res.note='Nová verze '+ver+' čeká na vaše schválení (schvalte jen pokud jste ji právě nasazovali).'}}}}
 S.integ=res;S.lock=res.state=='alarm';
 if(res.state=='alarm'&&!check.rep){check.rep=1;var hits=[res.note].concat(res.d.slice(0,5));if(window.OCHRANA)OCHRANA.alertMe('KÓD APLIKACE SE ZMĚNIL. AI a odesílání jsou zablokované do ověření.',hits,'',1)}
 top();return res}
function top(){var el=document.getElementById('straz-t'),st=S.integ&&S.integ.state;if(!S.lock&&st!='nova'&&st!='zaklad'){if(el)el.remove();return}if(!el){el=document.createElement('div');el.id='straz-t';el.setAttribute('role','alert');el.style.cssText='flex:0 0 100%;order:-2;color:#fff;padding:6px 12px;font:13px Segoe UI,Arial,sans-serif;text-align:center';el.onclick=function(e){if(e.target.tagName=='BUTTON'&&window.OCHRANA)OCHRANA.panel()};document.body.insertBefore(el,document.body.firstChild)}
 var wb=document.querySelector('.wait');if(!S.lock&&wb&&!document.getElementById('wz-straz')){var hh=wb.querySelector('h3'),it=document.createElement('div');it.className='it';it.id='wz-straz';it.innerHTML='<span><b>🛡 Nová verze aplikace: schválit otisky</b> <span class=note>Strážce kódu</span></span><span><button class=b data-vz=straz>Otevřít schválení</button></span>';if(hh)hh.after(it);var nn=wb.querySelector('p.note');if(nn&&/Nic nečeká/.test(nn.textContent))nn.remove()}
 el.style.background=S.lock?'#c0392b':'#b9770e';el.innerHTML=S.lock?'⚠ Kód aplikace se změnil bez schválení. AI je zablokovaná, nic neodesílejte, kontaktujte vlastníka. <button style="margin-left:8px;padding:2px 10px;cursor:pointer">Podrobnosti</button>':'🛡 Nová verze '+esc((S.integ&&S.integ.ver)||'')+' čeká na schválení otisků. <button style="margin-left:8px;padding:2px 10px;cursor:pointer">Schválit nahoře v 🛡</button>'}
/* veřejné API pro ochrana.js */
function vzory(){return S.compiled}
function blok(){return S.blok}
function pushBlock(a,w){if(S.blok.some(function(b){return b.a==a}))return;S.blok.push({a:a,d:new Date().toISOString(),w:String(w||'').slice(0,200)});dirty()}
function dropBlock(a){S.blok=S.blok.filter(function(b){return b.a!=a});dirty()}
function pushInc(o){S.inc.unshift(o);S.inc=S.inc.slice(0,100);dirty()}
function learn(sample,popis,w){sample=String(sample||'').trim();if(sample.length<6)throw new Error('Ukázka je příliš krátká.');var s=sample.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+');new RegExp(s,'i');S.vzory.push({s:s,w:w||3,p:popis||sample.slice(0,60),d:new Date().toISOString().slice(0,10)});comp();dirty()}
function schval(){var I=S.integ,c={ok:'#1e8449',nova:'#b9770e',zaklad:'#b9770e',alarm:'#c0392b'}[I&&I.state]||'#777',h='<h4>Strážce kódu</h4><p style="font-size:12px;color:#555">Sdílení: '+esc(S.stav)+'</p>';
 h+='<div style="border-left:4px solid '+c+';padding:4px 8px">Integrita kódu: <b>'+esc(I?({ok:'v pořádku',nova:'nová verze čeká na schválení',zaklad:'bez schváleného základu',alarm:'ALARM'}[I.state]):'zatím neověřeno')+'</b>'+(I&&I.note?'<br><small>'+esc(I.note)+'</small>':'')+(I&&I.d.length?'<br><small>Soubory: '+esc(I.d.slice(0,8).join(', '))+'</small>':'')+'</div>';
 h+='<p><button data-s=chk>Zkontrolovat teď</button> '+(I&&(I.state=='nova'||I.state=='zaklad')?'<button data-s=appr>Schválit aktuální verzi</button>':'')+'</p>';
 return h}
function html(){var h='<h4>Sdílená ochrana</h4><p style="font-size:12px;color:#555">Sdílení: '+esc(S.stav)+'</p>';
 h+='<h4>Naučené vzory škodlivých textů a kódů ('+S.vzory.length+')</h4>'+(S.vzory.length?S.vzory.slice(-12).map(function(v,i){return '<div><small>'+esc(v.d||'')+'</small> '+esc(v.p||'')+' <button data-s=delv data-i="'+esc(v.s)+'">Smazat</button></div>'}).join(''):'<i>zatím žádné</i>')+'<div style="margin-top:6px"><textarea id=sv rows=2 style="width:98%" placeholder="Vložte ukázku škodlivého textu nebo kódu (jen jako text, nic se nespustí)"></textarea><br><input id=sp placeholder="popis" style="width:60%"> <button data-s=add>Naučit</button></div>';return h}
async function click(t){var s=t.getAttribute&&t.getAttribute('data-s');if(!s)return false;
 try{if(s=='chk'){await check()}if(s=='appr'){if(window.__strazBusy)return true;window.__strazBusy=1;try{var cur=S.integ.cur;S.appr={ver:(typeof VER!='undefined')?VER:'',f:cur,d:new Date().toISOString().slice(0,10)};await save();await check();var w=document.getElementById('wz-straz');if(w)w.remove();var nw=document.querySelector('.wait');if(nw&&!nw.querySelector('.it')&&!nw.querySelector('p.note')){var pn=document.createElement('p');pn.className='note';pn.textContent='Nic nečeká na schválení.';nw.appendChild(pn)}if(window.AI&&AI.limity)AI.limity(true).then(function(){if(window.limFill)window.limFill()}).catch(function(){})}finally{window.__strazBusy=0}}
  if(s=='add'){var v=document.getElementById('sv').value,p=document.getElementById('sp').value;learn(v,p)}
  if(s=='delv'){var k=t.getAttribute('data-i');S.vzory=S.vzory.filter(function(x){return x.s!=k});comp();dirty()}}catch(e){alert(e.message)}return true}
window.STRAZ={S:S,load:load,check:check,vzory:vzory,blok:blok,pushBlock:pushBlock,dropBlock:dropBlock,pushInc:pushInc,learn:learn,html:html,schval:schval,ceka:function(){var t=S.integ&&S.integ.state;return t=='nova'||t=='zaklad'||t=='alarm'},click:click,locked:function(){return S.lock},dirty:dirty};
var n=0;(function boot(){if(ready()||++n>40){if(ready()){load().then(function(){return check()}).then(function(){if(window.OCHRANA)OCHRANA.refresh&&OCHRANA.refresh()}).catch(function(){});setInterval(function(){check().catch(function(){})},30*60*1000)}else{check().catch(function(){})}return}setTimeout(boot,3000)})()
})();
