/* ELZA Asistent: Hlídání nabídek (0.50.0). Eviduje odeslané nabídky (cenu a obsah řeší obchodní oddělení, aplikace jen eviduje) a hlídá, zda zákazník odpověděl: připomínky po 5, 14 a 30 dnech.
   Fronta čeká na rozhodnutí podle odpovědné osoby; po 30 dnech navrhne přechod na uzavření jako „bez odpovědi“ (neúspěšný případ s důvodem). Všechno se zapisuje až po klepnutí; zákazníkovi se nic neposílá.
   Čistá logika: test/nabidky.test.js. Seznam NabidkaEvid na webu Zakázky ELZA zakládá tlačítko v modulu. */
(function(){var W=typeof window!="undefined"?window:globalThis;
var PRAH=[5,14,30];
function den(s){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(s||""));return m?Date.UTC(+m[1],+m[2]-1,+m[3]):NaN}
function iso(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function dnu(od,dnes){var a=den(od),b=den(dnes);return isNaN(a)||isNaN(b)?NaN:Math.floor((b-a)/864e5)}
var TXT={5:"Připomenout zákazníkovi (první připomínka).",14:"Druhá připomínka, zvažte telefonát.",30:"Bez odpovědi 30 dní: navrhuji uzavřít případ jako neúspěšný (důvod: bez odpovědi)."};
/* co je u nabídky teď potřeba: jen odeslané bez odpovědi; vrací nejvyšší dosažený a ještě nepřipomenutý stupeň */
function hlidej(n,dnes){if(!n||n.Stav!="odeslana")return null;var d=dnu(n.Odeslano,dnes);if(isNaN(d))return null;var pr=+n.Pripomenuto||0,due=PRAH.filter(function(p){return d>=p&&p>pr});if(!due.length)return null;var s=due[due.length-1];return{stupen:s,dnu:d,text:TXT[s],uzavrit:s==30}}
/* fronta: všechny nabídky, které čekají na rozhodnutí; nejdřív osoba, pak nejstarší */
function fronta(arr,dnes,kdo){var k=String(kdo||"").toLowerCase();return (arr||[]).map(function(n){var h=hlidej(n,dnes);return h?{n:n,h:h,moje:!!k&&String(n.Odpovedny||"").toLowerCase()==k}:null}).filter(Boolean).sort(function(a,b){return (b.moje-a.moje)||(b.h.dnu-a.h.dnu)})}
/* změny po akci uživatele */
function pripomenuto(n,h){return{Pripomenuto:h.stupen}}
function odpoved(dnes){return{Stav:"odpoved",Odpoved:dnes}}
function bezOdpovedi(dnes){return{Stav:"bez_odpovedi",Odpoved:dnes,Pripomenuto:30}}
W.NABIDKY={PRAH:PRAH,dnu:dnu,hlidej:hlidej,fronta:fronta,pripomenuto:pripomenuto,odpoved:odpoved,bezOdpovedi:bezOdpovedi};
if(typeof module!="undefined")module.exports=W.NABIDKY;
if(typeof window=="undefined"||!window.document)return;
function es(s){return typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var L="NabidkaEvid",DB=[],ST={msg:"",miss:false,loaded:false,busy:false},demo=function(){return SDL.demo()};
SDL.def(L,SEZ.S.NabidkaEvid,"ELZA asistent: evidence odeslaných nabídek");
SDL.def("Ukol",SEZ.S.Ukol,"ELZA asistent: úkoly");
function dnesIso(){return iso(new Date())}
function me(){return String((window.acc&&(acc.username||acc.name))||"").toLowerCase()}
var DEMOROWS=function(){var t=new Date();function d(n){var x=new Date(t);x.setDate(x.getDate()-n);return iso(x)}return[{Id:1,Title:"NAB-DEMO-1",Zakazka:"Z-2026-001",Zakaznik:"Ukázkový zákazník A",Odeslano:d(6),Stav:"odeslana",Odpovedny:"tkrejci@elzy.cz",Pripomenuto:0},{Id:2,Title:"NAB-DEMO-2",Zakazka:"Z-2026-002",Zakaznik:"Ukázkový zákazník B",Odeslano:d(15),Stav:"odeslana",Odpovedny:"jiny@elzy.cz",Pripomenuto:5},{Id:3,Title:"NAB-DEMO-3",Zakazka:"Z-2026-003",Zakaznik:"Ukázkový zákazník C",Odeslano:d(31),Stav:"odeslana",Odpovedny:"tkrejci@elzy.cz",Pripomenuto:14},{Id:4,Title:"NAB-DEMO-4",Zakazka:"Z-2026-004",Zakaznik:"Ukázkový zákazník D",Odeslano:d(2),Stav:"odeslana",Odpovedny:"tkrejci@elzy.cz",Pripomenuto:0}]};
async function load(){if(demo()){DB=DEMOROWS();ST.loaded=true;draw();return}try{var r=await SDL.read(L);if(r==null){ST.miss=true;DB=[]}else{ST.miss=false;DB=r}}catch(e){ST.msg="Čtení selhalo: "+e.message}ST.loaded=true;draw()}
async function run(fn,ok){if(ST.busy)return;ST.busy=true;try{await fn();ST.msg=ok||"Hotovo."}catch(e){ST.msg="Chyba: "+e.message}ST.busy=false;if(!demo())await load();else draw()}
function row(q){var n=q.n,h=q.h;return '<tr><td>'+es(n.Title)+'<td>'+es(n.Zakaznik||"")+'<br><small>'+es(n.Zakazka||"")+'</small><td>'+es(n.Odpovedny||"")+(q.moje?' <b>(vy)</b>':'')+'<td>'+h.dnu+' dní<td>'+es(h.text)+'<td><button class=b data-a=pr data-i="'+n.Id+'">Připomenuto, založit úkol</button> <button class=b data-a=od data-i="'+n.Id+'">Zákazník odpověděl</button>'+(h.uzavrit?' <button class=b data-a=bo data-i="'+n.Id+'">Uzavřít bez odpovědi</button>':'')+'</tr>'}
var EL=null;
function draw(){if(!EL)return;var dn=dnesIso(),F=fronta(DB,dn,me()),ost=DB.filter(function(n){return n.Stav=="odeslana"&&!hlidej(n,dn)});
 var h='<h1>Hlídání nabídek</h1><p class=note>Eviduje odeslané nabídky a hlídá odpověď zákazníka: připomínky po 5, 14 a 30 dnech. Ceny a obsah nabídek řeší obchodní oddělení, aplikace nabídky jen eviduje. Nic se zákazníkovi neposílá, každý krok potvrdíte klepnutím.</p>';
 if(ST.miss)h+='<div class=card><p>Seznam <b>NabidkaEvid</b> ještě není založen na webu Zakázky ELZA.</p><p><button class=b id=nbmk>Založit seznam</button></p></div>';
 h+='<div class=card><h3>Čeká na rozhodnutí ('+F.length+')</h3>'+(F.length?'<table><tr><th>Nabídka<th>Zákazník<th>Odpovědný<th>Stáří<th>Co teď<th></tr>'+F.map(row).join("")+'</table>':'<p class=note>'+(ST.loaded?'Žádná nabídka teď nevyžaduje akci.':'Načítám…')+'</p>')+'</div>';
 if(ost.length)h+='<div class=card><h3>Odeslané, bez akce ('+ost.length+')</h3><table><tr><th>Nabídka<th>Zákazník<th>Odesláno<th>Stáří</tr>'+ost.map(function(n){return '<tr><td>'+es(n.Title)+'<td>'+es(n.Zakaznik||"")+'<td>'+es(n.Odeslano)+'<td>'+dnu(n.Odeslano,dn)+' dní</tr>'}).join("")+'</table></div>';
 h+='<div class=card><h3>Zapsat odeslanou nabídku</h3><div class=in><label>Číslo nabídky<input id=nbt style="width:130px"></label> <label>Zakázka<input id=nbz placeholder="Z-2026-014" style="width:120px"></label> <label>Zákazník<input id=nbk style="width:200px"></label> <label>Odesláno<input id=nbd type=date value="'+dn+'"></label> <label>Odpovědný (e-mail)<input id=nbo value="'+es(me())+'" style="width:200px"></label> <button class=b id=nbs>Zapsat</button></div></div>';
 if(ST.msg)h+='<p class=note>'+es(ST.msg)+'</p>';EL.innerHTML=h;
 var mk=EL.querySelector("#nbmk");if(mk)mk.onclick=function(){run(async function(){await SDL.create([L])},"Seznam NabidkaEvid je založen.")};
 var sv=EL.querySelector("#nbs");if(sv)sv.onclick=function(){var t=EL.querySelector("#nbt").value.trim();if(!t){ST.msg="Vyplňte číslo nabídky.";draw();return}run(async function(){if(ST.miss)throw new Error("Nejdřív založte seznam.");await SDL.write(L,0,{Title:t,Zakazka:EL.querySelector("#nbz").value.trim(),Zakaznik:EL.querySelector("#nbk").value.trim(),Odeslano:EL.querySelector("#nbd").value,Stav:"odeslana",Odpovedny:EL.querySelector("#nbo").value.trim(),Pripomenuto:0})},"Nabídka zapsána.")};
 EL.querySelectorAll("button[data-a]").forEach(function(b){b.onclick=function(){var n=DB.filter(function(x){return x.Id==b.dataset.i})[0],a=b.dataset.a;if(!n)return;
  run(async function(){var d=dnesIso(),hh=hlidej(n,d);
   if(a=="pr"){await SDL.write("Ukol",0,{Title:"Připomenout nabídku "+n.Title+" ("+(n.Zakaznik||"")+")",KodZakazky:n.Zakazka||"",Resitel:n.Odpovedny||"",Od:d,Do:d,Hotovo:0,Poznamka:(hh?hh.text:"")});await SDL.write(L,n.Id,pripomenuto(n,hh))}
   else if(a=="od")await SDL.write(L,n.Id,odpoved(d));
   else await SDL.write(L,n.Id,bezOdpovedi(d))},a=="pr"?"Úkol založen a připomínka zaznamenána.":a=="od"?"Odpověď zaznamenána.":"Nabídka uzavřena jako bez odpovědi. Důvod doplňte u případu.")}})}
function html(){return '<div id=nbx></div>'}
function mt(){EL=document.getElementById("nbx");draw();load()}
window.MODS=window.MODS||{};window.MODS.nabidky=[html,mt];
})();
