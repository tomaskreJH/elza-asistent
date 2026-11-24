/* ELZA Asistent: Profil firmy, Znalosti s oprávněním po Elzáčcích a náhled přesného kontextu před odesláním (0.61.0, bod 0 z docs/DALSI-KROKY.md, vzor Syniru kap. 6, 9 a 10).
   Profil firmy = jeden zdroj tónu, zakázaných frází a FAQ pro všechny Elzáčky. Znalost = text s klíčovými slovy a seznamem Elzáčků, kteří ji smějí číst;
   do dotazu se přidá jen povolená znalost, jejíž téma je v zadání (hledá se jen v zadání, nikdy v datech). Ukládá seznam ZnalostElza (Správa → Seznamy), do jeho založení jen tento prohlížeč.
   Náhled: před každým voláním AI se ukáže přesně to, co odejde poskytovateli; Schválit a odeslat / Schválit a příště se neptat (pro tohoto Elzáčka) / Zamítnout. */
(function(){
var W=window;
function LS(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}return null}
function J(k,d){try{var v=JSON.parse(LS(k)||'null');return v==null?d:v}catch(e){return d}}
function me(){return String(W.acc&&W.acc.username||(typeof acc!='undefined'&&acc&&acc.username)||'').toLowerCase()}
function bez(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function E(x){return typeof esc=='function'?esc(x):String(x==null?'':x).replace(/[&<>"']/g,function(c){return '&#'+c.charCodeAt(0)+';'})}
var P0={ton:'Vykáme. Píšeme věcně, zdvořile a stručně, první věta je odpověď. Podpis: ELZY, spol. s r.o.',zakazane:['garantujeme','zaručeně','100%','nejlevnější','to nejde'],faq:[{q:'Jak připojujete objekty na PCO?',a:'Přes internet se zálohou GPRS/LTE.'},{q:'Kdo dělá cenové nabídky?',a:'Obchodní oddělení; Elzáčci ceny neuvádějí.'}],kontakty:'ELZY, spol. s r.o., Jarošovská 433/II, Jindřichův Hradec'};
var D={profil:null,zn:[],src:'prohlížeč'},NACT=0;
function sdlOk(){return W.SDL&&!SDL.demo()&&W.SEZ&&SEZ.S&&SEZ.S.ZnalostElza}
async function nacti(force){if(NACT&&!force)return D;NACT=1;var p=J('elzaProfilFirmy',null),z=J('elzaZnalosti',[]),src='prohlížeč';
 try{if(sdlOk()){SDL.def('ZnalostElza',SEZ.S.ZnalostElza,'ELZA asistent: Znalosti a profil firmy');var r=await SDL.read('ZnalostElza');if(r){src='SharePoint';var zz=[];r.forEach(function(x){if(x.Stav=='vyrazeno')return;if(x.Druh=='profil'){try{p=JSON.parse(x.Text);p.sid=x.Id}catch(e){}}else zz.push({sid:x.Id,id:'S'+x.Id,n:x.Title,a:x.Agenti||'*',k:x.Klic||'',t:x.Text||'',kdo:x.Kdo||'',kdy:x.Kdy||''})});z=zz.concat(z.filter(function(l){return !zz.some(function(s){return s.n==l.n})}))}}}catch(e){}
 D={profil:p||JSON.parse(JSON.stringify(P0)),zn:z,src:src};return D}
function povol(z,id){var a=String(z.a||'*').split(/[ ,;]+/).filter(Boolean);return a.indexOf('*')>=0||a.indexOf(id)>=0}
function tema(z,text){var k=String(z.k||'').split(/[ ,;]+/).filter(Boolean);if(!k.length)return true;var t=bez(text);return k.some(function(w){w=bez(w);if(w.length>4)w=w.slice(0,-1);return w.length>2&&t.indexOf(w)>=0})}
function znalostiPro(id,text){return D.zn.filter(function(z){return povol(z,id)&&tema(z,text)})}
function profilText(){var p=D.profil||P0,o='Profil firmy (platí pro všechny Elzáčky):\nTón: '+(p.ton||'')+'\n';if((p.zakazane||[]).length)o+='Zakázané fráze (nepoužívej): '+p.zakazane.join(', ')+'\n';if((p.faq||[]).length)o+='Časté otázky:\n'+p.faq.map(function(f){return '- '+f.q+' → '+f.a}).join('\n')+'\n';if(p.kontakty)o+='Kontakty: '+p.kontakty+'\n';return o}
function blok(id,text){var o=profilText(),z=znalostiPro(id,text);if(z.length)o+='Znalosti povolené tomuto Elzáčkovi (podle tématu zadání):\n'+z.map(function(x){return '## '+x.n+'\n'+String(x.t).slice(0,3000)}).join('\n')+'\n';return o+'\n'}
function kontrolaFrazi(text){var p=D.profil||P0,t=bez(text);return (p.zakazane||[]).filter(function(f){return f&&t.indexOf(bez(f))>=0})}
async function ulozProfil(p){p.kdo=me();p.kdy=new Date().toISOString();var ok=false;try{if(sdlOk()){await nacti();var sid=D.profil&&D.profil.sid;var c=Object.assign({},p);delete c.sid;await SDL.write('ZnalostElza',sid||0,{Title:'Profil firmy',Druh:'profil',Agenti:'*',Klic:'',Text:JSON.stringify(c),Stav:'aktivni',Kdo:me(),Kdy:p.kdy});ok=true}}catch(e){}
 if(!ok)LS('elzaProfilFirmy',JSON.stringify(p));await nacti(true);return ok}
async function pridej(z){z={id:'L'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),n:String(z.n||'').slice(0,120),a:String(z.a||'*').slice(0,250),k:String(z.k||'').slice(0,250),t:String(z.t||'').slice(0,8000),kdo:me(),kdy:new Date().toISOString()};if(!z.n||!z.t)throw new Error('Doplňte název a text znalosti.');var ok=false;
 try{if(sdlOk()){await SDL.write('ZnalostElza',0,{Title:z.n,Druh:'znalost',Agenti:z.a,Klic:z.k,Text:z.t,Stav:'aktivni',Kdo:z.kdo,Kdy:z.kdy});ok=true}}catch(e){}
 if(!ok){var L=J('elzaZnalosti',[]);L.push(z);LS('elzaZnalosti',JSON.stringify(L))}await nacti(true);return ok}
async function vyrad(id){var z=D.zn.filter(function(x){return x.id==id})[0];try{if(z&&z.sid)await SDL.write('ZnalostElza',z.sid,{Stav:'vyrazeno'})}catch(e){}LS('elzaZnalosti',JSON.stringify(J('elzaZnalosti',[]).filter(function(x){return x.id!=id})));await nacti(true)}
/* Náhled přesného kontextu */
function zapnut(){return LS('elzaNahled')!=='0'}
function preskoc(id){return J('elzaNahledSkip',[]).indexOf(id)>=0}
function potreba(id){return typeof document!='undefined'&&!!document.body&&!!document.body.appendChild&&zapnut()&&!preskoc(id)}
function nahled(i){return new Promise(function(res){var ov=document.createElement('div');ov.id='kxov';ov.style.cssText='position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:10px';
 var chars=String(i.sys||'').length+String(i.user||'').length+String(i.data||'').length,zf=kontrolaFrazi(i.user);
 ov.innerHTML='<div style="background:var(--p,#fff);color:var(--f,#111);max-width:820px;width:100%;max-height:92vh;overflow:auto;border-radius:12px;padding:14px 16px"><h3 style="margin-top:0">Náhled: co přesně odejde do AI</h3><p class=note>Elzáček: <b>'+E(i.agent)+'</b> · nástroj '+E(i.tool)+(i.model?' · model '+E(i.model):'')+' · asi '+Math.round(chars/3.5)+' tokenů ('+chars+' znaků). Nic se neodešle bez vašeho schválení.</p>'+(zf.length?'<p class=r>Zadání obsahuje zakázanou frázi z Profilu firmy: '+E(zf.join(', '))+'</p>':'')
 +(i.sys?'<h4>Systémová instrukce</h4><pre style="white-space:pre-wrap;font-size:12px">'+E(i.sys)+'</pre>':'')+'<h4>Zadání (role, profil firmy, znalosti, postupy, text)</h4><pre style="white-space:pre-wrap;font-size:12px">'+E(i.user)+'</pre>'+(i.data?'<h4>Přiložená data (jen data, ne pokyny)</h4><pre style="white-space:pre-wrap;font-size:12px;max-height:200px;overflow:auto">'+E(i.data)+'</pre>':'')
 +'<div class=bar><button class=b data-kxn=ok>Schválit a odeslat</button><button class=g data-kxn=skip>Schválit a příště se neptat</button><button class=g data-kxn=no>Zamítnout</button></div></div>';
 ov.onclick=function(e){var b=e.target.closest&&e.target.closest('[data-kxn]');if(!b)return;var k=b.dataset.kxn;if(k=='skip'){var s=J('elzaNahledSkip',[]);if(s.indexOf(i.id)<0)s.push(i.id);LS('elzaNahledSkip',JSON.stringify(s))}ov.remove();res(k!='no')};document.body.appendChild(ov)})}
/* Co agent ví (pravý panel v Chatu) */
function coVi(id,text){var A=W.AI,a=A&&A.agents.filter(function(x){return x.id==id})[0],z=D.zn.filter(function(x){return povol(x,id)}),zt=znalostiPro(id,text||'');
 return '<div class=aiw style="white-space:normal"><b>Co agent ví</b><br><span class=note>'+E(a?a.n:id)+(a&&a.d?' – '+E(a.d):'')+'</span><br>• Profil firmy: tón, '+((D.profil||P0).zakazane||[]).length+' zakázaných frází, '+((D.profil||P0).faq||[]).length+' FAQ<br>• Znalosti povolené: '+z.length+(text?' (k tomuto zadání '+zt.length+')':'')+'<br>• Postupy: '+E(a&&a.sk&&a.sk.length?a.sk.map(function(s){return s.n}).join(', '):'žádné')+'<br>• Náhled před odesláním: '+(zapnut()?(preskoc(id)?'u tohoto Elzáčka vypnut':'zapnut'):'vypnut')+'<br>• Smí: jen navrhovat, nic neodesílá ani neukládá</div>'}
/* UI v AI nastavení */
function ui(){var p=D.profil||P0,ag=(W.AI&&AI.agents||[]).map(function(a){return a.id+' ('+a.n+')'}).join(', '),sk=J('elzaNahledSkip',[]);
 return '<h3>Náhled před odesláním</h3><p class=note>Před každým voláním AI ukáže přesně to, co odejde poskytovateli (jako Syniru). Doporučeno nechat zapnuté.</p><div class=bar><label><input type=checkbox id=kxnz'+(zapnut()?' checked':'')+'> Zapnuto</label><button class=g data-kx=nz>Uložit</button>'+(sk.length?'<button class=g data-kx=nzr>Znovu se ptát u všech ('+sk.length+')</button>':'')+'</div>'
 +'<h3>Profil firmy (jeden zdroj pro všechny Elzáčky)</h3><p class=note>Uloženo: '+E(D.src)+(p.kdo?' · naposledy '+E(p.kdo)+' '+E(String(p.kdy||'').slice(0,10)):'')+'. Tón, zakázané fráze a FAQ dostane každý Elzáček v každém dotazu.</p>'
 +'<p><textarea id=kxton rows=2 style="width:100%">'+E(p.ton||'')+'</textarea></p><p><input id=kxzak style="width:100%" value="'+E((p.zakazane||[]).join(', '))+'" placeholder="Zakázané fráze oddělené čárkou"></p><p><textarea id=kxfaq rows=4 style="width:100%" placeholder="Otázka | odpověď (jedna na řádek)">'+E((p.faq||[]).map(function(f){return f.q+' | '+f.a}).join('\n'))+'</textarea></p><p><input id=kxkon style="width:100%" value="'+E(p.kontakty||'')+'" placeholder="Kontakty"></p><div class=bar><button class=b data-kx=pr>Uložit profil firmy</button><span class=note id=kxm></span></div>'
 +'<h3>Znalosti s oprávněním</h3><p class=note>Znalost dostane jen Elzáček, který je v poli „Kdo smí číst“ (* = všichni), a jen když zadání obsahuje některé klíčové slovo (bez klíčových slov vždy). Elzáčci: '+E(ag)+'</p>'
 +'<table><tr><th>Znalost<th>Kdo smí číst<th>Klíčová slova<th>Kdo, kdy<th></tr>'+(D.zn.length?D.zn.map(function(z){return '<tr><td><b>'+E(z.n)+'</b><br><span class=note>'+E(String(z.t).slice(0,160))+'</span><td>'+E(z.a)+'<td>'+E(z.k)+'<td class=note>'+E(z.kdo)+' '+E(String(z.kdy).slice(0,10))+'<td><button class=g data-kx=del data-id="'+E(z.id)+'">Vyřadit</button></tr>'}).join(''):'<tr><td colspan=5 class=note>Zatím žádná znalost.</tr>')+'</table>'
 +'<p><input id=kxn placeholder="Název (např. Postup při poplachu na PCO)" style="width:100%;max-width:440px"> <input id=kxa value="*" placeholder="Kdo smí číst: * nebo ID oddělená čárkou" style="width:100%;max-width:300px"> <input id=kxk placeholder="Klíčová slova" style="width:100%;max-width:300px"></p><p><textarea id=kxt rows=4 style="width:100%" placeholder="Text znalosti"></textarea></p><div class=bar><button class=b data-kx=add>Přidat znalost</button></div>'}
function v(id){var e=document.getElementById(id);return e?e.value:''}
if(typeof document!='undefined'&&document.addEventListener)document.addEventListener('click',async function(e){var el=e.target.closest&&e.target.closest('[data-kx]');if(!el)return;var k=el.dataset.kx,ms=document.getElementById('kxm');try{
 if(k=='nz'){LS('elzaNahled',document.getElementById('kxnz').checked?'1':'0')}
 else if(k=='nzr'){LS('elzaNahledSkip',null)}
 else if(k=='pr'){var ok=await ulozProfil({ton:v('kxton').trim().slice(0,600),zakazane:v('kxzak').split(',').map(function(s){return s.trim()}).filter(Boolean).slice(0,40),faq:v('kxfaq').split('\n').map(function(l){var i=l.indexOf('|');return i<0?null:{q:l.slice(0,i).trim(),a:l.slice(i+1).trim()}}).filter(function(f){return f&&f.q&&f.a}).slice(0,40),kontakty:v('kxkon').trim().slice(0,400)});if(ms)ms.textContent=ok?'Uloženo do SharePointu.':'Uloženo jen v tomto prohlížeči (seznam ZnalostElza založte ve Správa → Seznamy).'}
 else if(k=='add'){await pridej({n:v('kxn').trim(),a:v('kxa').trim()||'*',k:v('kxk').trim(),t:v('kxt').trim()})}
 else if(k=='del'){await vyrad(el.dataset.id)}
 if(k!='pr'&&typeof go=='function')go('ainast')}catch(er){if(ms)ms.textContent='Chyba: '+er.message;else console.warn(er.message)}});
W.KTX={nacti:nacti,blok:blok,profilText:profilText,znalostiPro:znalostiPro,kontrolaFrazi:kontrolaFrazi,ulozProfil:ulozProfil,pridej:pridej,vyrad:vyrad,potreba:potreba,nahled:nahled,zapnut:zapnut,coVi:coVi,ui:ui,P0:P0,data:function(){return D}};
})();
