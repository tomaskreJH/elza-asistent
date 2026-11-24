/* ELZA Asistent: Chat s agentem. Rozhovor přes window.AI.ask (nástroj podle AI nastavení). Historie jen v této relaci prohlížeče, nic se neukládá ani neodesílá.
   0.61.0: volba „Recepce vybere“ (výběr Elzáčka bez AI, 0 tokenů), pravý panel „Co agent ví“ a převzetí zadání z Můj den. */
(function(){
var H=[],CUR='auto',LAST='';
function ags(){var L=(window.AI&&AI.agents||[]).filter(function(a){return ['AG-VYVOJ','AG-VIDEO','AG-SOCIAL'].indexOf(a.id)<0});return [['auto','Recepce vybere (bez AI)']].concat(L.map(function(a){return [a.id,a.n]}))}
function pane(){var id=CUR=='auto'?(LAST||'AG-ELZA'):CUR;return window.KTX?KTX.coVi(id):''}
async function view(){try{if(window.AI)await AI.nacti();if(window.KTX)await KTX.nacti()}catch(e){}var pq='';try{pq=sessionStorage.getItem('elzaChatQ')||'';var pa=sessionStorage.getItem('elzaChatA');if(pa)CUR=pa;sessionStorage.removeItem('elzaChatQ');sessionStorage.removeItem('elzaChatA')}catch(e){}
 return '<h1>Chat s agentem</h1><p class=note>Rozhovor s Elzáčkem přes nástroj z menu AI nastavení. Recepce vybere Elzáčka podle zadání přímo v aplikaci (nic nestojí). Agenti Vývoj, Video a Příspěvky pracují přes Úlohy pro agenty. Historie zůstává jen v tomto okně. <span id=cs></span></p>'
 +'<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start"><div style="flex:3 1 420px;min-width:0"><div class=bar><select id=ca>'+ags().map(function(a){return '<option value="'+esc(a[0])+'"'+(a[0]==CUR?' selected':'')+'>'+esc(a[1])+'</option>'}).join('')+'</select><button class=g data-cc=1>Nový rozhovor</button></div><div id=cl>'+H.map(function(h){return '<div class=aiw style="'+(h.r=='u'?'margin-left:40px':'')+'"><b>'+(h.r=='u'?'Vy':esc(h.n||'Elza'))+'</b>\n'+esc(h.t)+'</div>'}).join('')+'</div><div class=bar><textarea id=cq rows=3 placeholder="Napište dotaz (Ctrl+Enter odešle)" style="width:100%;min-width:0;background:var(--p);color:var(--f);border:1px solid var(--l);border-radius:9px;padding:8px;font:inherit">'+esc(pq)+'</textarea><button class=b data-cs=1>Odeslat</button></div></div>'
 +'<div id=cvi style="flex:1 1 220px;min-width:0">'+pane()+'</div></div>'}
function viewM(){var mn=document.getElementById('main');function msg(t){var s=document.getElementById('cs');if(s)s.textContent=t}
 async function send(){var q=document.getElementById('cq'),t=q.value.trim();if(!t)return;CUR=document.getElementById('ca').value;var id=CUR,pozn='';
  if(CUR=='auto'){var r=window.AI&&AI.recepce(t),has=r&&AI.agents.some(function(a){return a.id==r.id});id=has?r.id:'AG-ELZA';pozn=r?(has?'Recepce předala: '+r.n:'Recepce doporučuje '+r.n+' (přidejte ho v AI nastavení → Galerie); zatím odpoví ELZA.'):'Recepce: obecný dotaz, odpoví ELZA.'}
  LAST=id;var nm=(AI.agents.filter(function(a){return a.id==id})[0]||{}).n||'Elza';H.push({r:'u',t:t});var hist=H.slice(0,-1).slice(-10).map(function(h){return (h.r=='u'?'Uživatel: ':'Elza: ')+h.t}).join('\n');msg((pozn?pozn+' · ':'')+'AI pracuje…');
  try{var o=await AI.ask(id,{task:t,data:hist||undefined,max:1200});H.push({r:'a',n:nm,t:(pozn?'('+pozn+')\n':'')+o})}catch(e){H.push({r:'a',n:nm,t:'Chyba: '+e.message})}go('chat')}
 mn.onclick=function(e){var el=e.target.closest('[data-cc],[data-cs]');if(!el)return;if(el.dataset.cc){H=[];return go('chat')}send()};
 mn.onchange=function(e){if(e.target.id=='ca'){CUR=e.target.value;var p=document.getElementById('cvi');if(p)p.innerHTML=pane()}};
 mn.onkeydown=function(e){if(e.target.id=='cq'&&e.key=='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();send()}}}
window.MODS=window.MODS||{};window.MODS.chat=[view,viewM];
})();
