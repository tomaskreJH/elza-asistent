/* ELZA Asistent: Noční běhy (0.69.0). Fronta dlouhých a levných úloh pro Elzáčky, které poběží přes ElzaMost (Claude CLI na předplatné nebo Ollama)
   na PC a na odložené stanici, když je tam spuštěný most. Fronta je seznam NocniFronta (SharePoint, web Zakázky ELZA); aplikace úlohu předá mostu na dané stanici
   (pumpa při otevření aplikace a každých 10 min), most ji po setmění sám spustí a výsledek uloží. Výsledek je jen text, vždy ho schvaluje člověk (Čeká na vás nahoře). */
(function(){
var L='NocniFronta',EL=null,PUMPA=0,ST=null;
function E(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function me(){return String((typeof acc!="undefined"&&acc)&&acc.username||'').toLowerCase()}
function LS(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
function ok(){return !!(window.SDL&&!SDL.demo()&&window.SEZ&&SEZ.S&&SEZ.S[L])}
async function most(c,b){var f=await fetch('http://127.0.0.1:47321'+c,{method:b?'POST':'GET',headers:{'x-elza-kod':LS('elzaMostKod')||'','content-type':'application/json'},body:b?JSON.stringify(b):undefined,signal:AbortSignal.timeout(10000)});var j=await f.json();if(!f.ok)throw new Error(j.chyba||('HTTP '+f.status));return j}
async function rady(){if(!ok())return[];SDL.def(L,SEZ.S[L],'ELZA asistent: noční fronta běhů');var r=await SDL.read(L);return (r||[]).filter(function(x){return String(x.Vlastnik||'').toLowerCase()==me()})}
/* Čistá logika (test/nocni.test.js) */
function patri(r,pc){return r.Stav=='ceka'&&(r.Stanice==pc||r.Stanice=='*')}
function ulohaZ(r){var d={};try{d=JSON.parse(r.Data)}catch(e){return null}if(!d.prompt||!['claude','codex','ollama'].includes(d.tool))return null;return {id:'nf'+r.Id,tool:d.tool,model:d.model||'',system:d.system||'',prompt:d.prompt}}
function idZ(id){var m=/^nf(\d+)$/.exec(String(id));return m?+m[1]:0}
/* Předání mostu na této stanici a sběr výsledků */
async function pumpa(){if(!ok()||!LS('elzaMostKod'))return null;var s;try{s=await most('/stav')}catch(e){ST=null;return null}ST=s;var R=await rady(),mine=R.filter(function(r){return patri(r,s.pc)}),u=mine.map(ulohaZ).filter(Boolean);
 if(u.length){await most('/fronta',{ulohy:u});for(var i=0;i<u.length;i++)await SDL.write(L,idZ(u[i].id),{Title:u[i].id,Stav:'predano',Stanice:s.pc})}
 var v=(await most('/fronta/vysledky')).vysledky||[],ids=[];for(var k=0;k<v.length;k++){var x=v[k],id=idZ(x.id);if(!id)continue;var u2=x.usage?(' · '+x.usage.vstup+'/'+x.usage.vystup+' tok'):'';await SDL.write(L,id,{Title:x.id,Stav:x.stav=='hotovo'?'hotovo':'chyba',Vysledek:String(x.stav=='hotovo'?x.text:x.chyba||'chyba').slice(0,60000),Kdy:(x.konec||'')+u2});ids.push(x.id)}
 if(ids.length){if(window.AI)AI.obnovLimity();await most('/fronta/potvrdit',{ids:ids})}return s}
function plan(){if(PUMPA)return;PUMPA=setInterval(function(){pumpa().catch(function(){})},600000)}
function stanice(){var a=[];try{a=JSON.parse(LS('elzaStanice')||'[]')}catch(e){}if(ST&&ST.pc&&a.indexOf(ST.pc)<0){a.push(ST.pc);LS('elzaStanice',JSON.stringify(a))}return a}
var ST_T={ceka:'čeká na stanici',predano:'předáno mostu',hotovo:'hotovo, čeká na schválení',chyba:'chyba',prijato:'přijato',zahozeno:'zahozeno'};
async function draw(msg){if(!EL)return;var R=[],err='';try{R=await rady()}catch(e){err=e.message}var o='<h1>Noční běhy</h1><p class=note>Úlohy, které poběží v noci přes ElzaMost (Claude, Codex nebo Ollama) na vybrané stanici. Spotřeba předplatného se tím rozloží do doby, kdy ho nepotřebujete. Výsledek je vždy jen text ke schválení, nic se neodesílá.</p>';
 if(msg)o+='<p class=note id=nmsg>'+E(msg)+'</p>';if(err)o+='<p class=r>'+E(err)+'</p>';
 if(!ok())o+='<p class=note>Seznam NocniFronta ještě není založený (Správa → Seznamy → Založit chybějící) nebo je zapnutý ukázkový režim.</p>';
 var hot=R.filter(function(r){return r.Stav=='hotovo'||r.Stav=='chyba'});
 if(hot.length)o+='<div class=wait><b>Čeká na vás ('+hot.length+')</b>'+hot.map(function(r){var d={};try{d=JSON.parse(r.Data)}catch(e){}return '<div class=gc style="width:auto;margin:6px 0"><b>'+E(d.agentN||d.agent||'')+'</b> · '+E(r.Stanice)+' · '+E(r.Kdy||'')+'<br><span class=note>'+E(d.zadani||'')+'</span><pre style="white-space:pre-wrap;max-height:260px;overflow:auto">'+E(r.Vysledek)+'</pre><button class=b data-nf=prijmout data-id='+r.Id+'>Přijmout</button> <button class=g data-nf=zahodit data-id='+r.Id+'>Zahodit</button></div>'}).join('')+'</div>';
 var s=ST,ag=(window.AI&&AI.agents||[]);
 o+='<h3>Stanice</h3>'+(s?'<p>Tento počítač: <b>'+E(s.pc)+'</b> · Claude CLI '+E(s.claude||'není')+' · Ollama: '+E((s.ollama||[]).join(', ')||'neběží')+' · noční okno '+E(s.noc&&s.noc.od)+':00 až '+E(s.noc&&s.noc.do)+':00 '+(s.noc&&s.noc.zapnuto?'':'(vypnuto)')+'</p>'+(s.nocChyba?'<p class=r>Chyba mostu při běhu fronty: '+E(s.nocChyba)+'</p>':''):'<p class=note>Most na tomto počítači neběží nebo není spárovaný (AI nastavení → Lokální most). Úlohy pro tuto stanici se předají, až most poběží a aplikace bude otevřená.</p>')
 +'<div class=bar><label>Noční okno od <input id=nod type=number min=0 max=23 value="'+E(s&&s.noc?s.noc.od:22)+'" style="width:60px"> do <input id=ndo type=number min=0 max=23 value="'+E(s&&s.noc?s.noc.do:6)+'" style="width:60px"></label> <button class=g data-nf=okno>Uložit okno</button> <button class=g data-nf=ted>Pustit frontu hned</button> <button class=g data-nf=sync>Předat a sebrat výsledky</button></div>';
 var st=stanice();o+='<h3>Nová úloha</h3><div class=bar><select id=nag>'+ag.map(function(a){return '<option value="'+E(a.id)+'">'+E(a.n)+'</option>'}).join('')+'</select> <select id=nst><option value="*">první dostupná stanice</option>'+st.map(function(x){return '<option>'+E(x)+'</option>'}).join('')+'</select> <select id=nto><option value="">podle nastavení Elzáčka</option><option value=ollama>Ollama (zdarma, lokální)</option></select> <input id=nmo placeholder="model (volitelně)" style="width:140px"></div><textarea id=nza rows=4 style="width:100%;max-width:640px" placeholder="Zadání úlohy"></textarea><br><textarea id=nda rows=4 style="width:100%;max-width:640px" placeholder="Vložená data (volitelně, berou se jen jako data)"></textarea><div class=bar><button class=b data-nf=pridat>Zařadit do noční fronty</button></div>';
 o+='<h3>Fronta</h3>'+(R.length?'<table><tr><th>Stav<th>Stanice<th>Elzáček<th>Zadání</tr>'+R.slice().reverse().slice(0,40).map(function(r){var d={};try{d=JSON.parse(r.Data)}catch(e){}return '<tr><td>'+E(ST_T[r.Stav]||r.Stav)+'<td>'+E(r.Stanice)+'<td>'+E(d.agentN||d.agent||'')+'<td>'+E(String(d.zadani||'').slice(0,100))+'</tr>'}).join('')+'</table>':'<p class=note>Fronta je prázdná.</p>');
 EL.innerHTML=o}
async function klik(e){var b=e.target.closest('[data-nf]');if(!b)return;var a=b.dataset.nf,V=function(i){var x=document.getElementById(i);return x?x.value:''};try{
 if(a=='pridat'){var za=V('nza').trim();if(za.length<5)return draw('Napište zadání úlohy.');if(!ok())return draw('Seznam NocniFronta není založený.');var q=await AI.priprav(V('nag'),{task:za,data:V('nda')||undefined,max:4000,nocniOllama:V('nto')=='ollama'});var t=q.tool,md=V('nmo').trim()||q.model;var ag=AI.agents.filter(function(x){return x.id==V('nag')})[0];await SDL.write(L,0,{Title:'nf',Vlastnik:me(),Stanice:V('nst'),Stav:'ceka',Data:JSON.stringify({agent:q.agent,agentN:ag&&ag.n,tool:t,model:md,system:q.system,prompt:q.prompt,zadani:za.slice(0,300)}),Kdy:new Date().toISOString()});await pumpa().catch(function(){});return draw('Úloha zařazena.')}
 if(a=='prijmout'||a=='zahodit'){var R=await rady(),r=R.filter(function(x){return x.Id==b.dataset.id})[0];if(!r)return;if(a=='prijmout'){var d={};try{d=JSON.parse(r.Data)}catch(e2){}if(window.AI&&AI.zapis)AI.zapis(d.agent||'AG-ELZA',{tool:({ollama:'Lokální (Ollama)',codex:'ChatGPT (Codex)',claude:'Claude (předplatné)'})[d.tool]||'Neznámý nástroj',model:(d.model||'')+' · noc'},{task:d.zadani||'',data:''},r.Vysledek,null)}await SDL.write(L,r.Id,{Title:r.Title||'nf',Stav:a=='prijmout'?'prijato':'zahozeno'});return draw(a=='prijmout'?'Výsledek přijat a zapsán do AI záznamu.':'Výsledek zahozen.')}
 if(a=='okno'){await most('/fronta/nastaveni',{od:+V('nod'),do:+V('ndo'),zapnuto:true});await pumpa().catch(function(){});return draw('Noční okno uloženo.')}
 if(a=='ted'){await pumpa();await most('/fronta',{ulohy:[],ted:true});return draw('Fronta na této stanici běží teď; výsledky se objeví po sebrání.')}
 if(a=='sync'){await pumpa();return draw('Předáno a sebráno.')}
 }catch(er){draw('Chyba: '+er.message)}}
function html(){return '<div id=nfx></div>'}
function mt(){EL=document.getElementById('nfx');EL.onclick=klik;draw();pumpa().then(function(){draw()}).catch(function(){});plan()}
window.NOC={patri:patri,ulohaZ:ulohaZ,idZ:idZ,pumpa:pumpa};
window.MODS=window.MODS||{};window.MODS.nocni=[html,mt];
})();
