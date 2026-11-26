/* ELZA Asistent: Otevřené otázky zákazníka (0.75.0). Zásada Tomáše (2026-11-25): odpovědi dává často po telefonu a do e-mailu je přesně nezapíše.
   Proto je každý dotaz zákazníka otevřená položka případu, dokud není zapsána odpověď; hovor se zapisuje a zákazník dostane písemné shrnutí.
   Položka starší než 2 pracovní dny se v Můj den ukáže nahoře. Čistá logika: test/otazky.test.js. Ukládá se do ZnalostElza (Druh otazka), nic se neodesílá. */
(function(){var W=typeof window!="undefined"?window:globalThis;
var PRAH_DNU=2;
function nrm(s){return String(s==null?"":s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function hash(s){var h=5381;s=nrm(s).replace(/[^a-z0-9]+/g," ").trim();for(var i=0;i<s.length;i++)h=((h*33)^s.charCodeAt(i))>>>0;return h.toString(36)}
/* z textu e-mailu zákazníka: věty s otazníkem a body číslovaného nebo odrážkového seznamu, které jsou požadavkem; citace (> …) a podpis se nečtou */
function extrahuj(text){var out=[],seen={};String(text||"").split(/\r?\n/).forEach(function(r){r=r.trim();if(!r||/^>/.test(r))return;if(/^(s pozdravem|diky|dekuji|best regards|--)/.test(nrm(r)))return;
 var li=/^(?:\d{1,2}[.)]|[-*•–])\s+(.+)$/.exec(r),t=li?li[1]:r;
 var parts=li?[t]:t.split(/(?<=[.!?])\s+/);parts.forEach(function(p){p=p.replace(/\s+/g," ").trim();if(p.length<8||p.length>400)return;
  var je=/\?\s*$/.test(p)||(li&&/\?/.test(p))||(li&&/^(prosim|potrebujeme|zaslete|poslete|doplnte|dodejte|jak|kdy|kde|kolik|zda|bude|lze|je mozne|muzete|mohli|informaci|potvrzeni|upresneni|specifikaci|navrh|orientacni harmonogram)/.test(nrm(p)));
  if(!je)return;var k=hash(p);if(seen[k])return;seen[k]=1;out.push({id:k,q:p})})});return out}
function pracDny(od,dnes){var a=new Date(od),b=new Date(dnes);if(isNaN(a)||isNaN(b)||b<=a)return 0;a=new Date(Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()));b=new Date(Date.UTC(b.getFullYear(),b.getMonth(),b.getDate()));var n=0;while(a<b){a=new Date(a.getTime()+864e5);var d=a.getUTCDay();if(d!=0&&d!=6)n++}return n}
function otevrena(x){return !x||x.Stav!="zodpovezena"}
/* nové položky z e-mailu: ty, které už v případu jsou (podle hashe), se nepřidají znovu */
function nove(existujici,qs){var m={};(existujici||[]).forEach(function(x){m[x.id]=1});return qs.filter(function(q){return !m[q.id]})}
function polozka(q,work,od,kanal){return{id:q.id,work:work,q:q.q,od:od,kanal:kanal||"email",Stav:"otevrena"}}
/* zodpovězení: odpověď se vždy zapisuje s tím, kdo a kdy ji dal a jakým kanálem (telefon, e-mail, osobně) */
function zodpovez(p,odp,kdo,kdy,kanal){if(!String(odp||"").trim())throw new Error("Doplňte odpověď.");return Object.assign({},p,{Stav:"zodpovezena",odp:String(odp).trim(),odpKdo:kdo||"",odpKdy:kdy,odpKanal:kanal||"telefon"})}
/* co je v Můj den nahoře: otevřené starší než 2 pracovní dny, nejstarší první */
function zpozdene(arr,dnes){return (arr||[]).filter(function(p){return otevrena(p)&&pracDny(p.od,dnes)>=PRAH_DNU}).sort(function(a,b){return new Date(a.od)-new Date(b.od)})}
/* po hovoru ELZA připomene Zapsat hovor, dokud existuje otevřená otázka daného případu */
function pripomenoutHovor(arr,work){return (arr||[]).some(function(p){return p.work==work&&otevrena(p)})}
/* písemné shrnutí pro zákazníka: jen zodpovězené položky z hovoru (co se ptal, co jsme odpověděli); nic se neodesílá, je to koncept pro Tomáše */
function shrnuti(arr,work,oslovení){var z=(arr||[]).filter(function(p){return p.work==work&&!otevrena(p)&&!p.odeslano});if(!z.length)return "";
 return (oslovení||"Dobrý den")+",\n\nděkuji za dnešní hovor. Pro jistotu shrnuji, co jsme si řekli:\n\n"+z.map(function(p,i){return (i+1)+". "+p.q+"\n   "+p.odp}).join("\n\n")+"\n\nPokud je něco jinak, dejte mi prosím vědět."}
/* zapisuje se do ZnalostElza: Klic otazka:WORK:id, Text JSON; čtení zpět */
function naZaznam(p){return{Title:("Otázka "+p.work+": "+p.q).slice(0,200),Druh:"otazka",Klic:"otazka:"+p.work+":"+p.id,Stav:p.Stav,Text:JSON.stringify({q:p.q,od:p.od,kanal:p.kanal,odp:p.odp||"",odpKdo:p.odpKdo||"",odpKdy:p.odpKdy||"",odpKanal:p.odpKanal||"",odeslano:!!p.odeslano})}}
function zZaznamu(r){if(!r||r.Druh!="otazka")return null;var m=/^otazka:([^:]+):(.+)$/.exec(r.Klic||"");if(!m)return null;var t={};try{t=JSON.parse(r.Text||"{}")}catch(e){}return Object.assign({Id:r.Id,id:m[2],work:m[1],Stav:r.Stav=="zodpovezena"?"zodpovezena":"otevrena"},t)}
W.OTAZKY={PRAH_DNU:PRAH_DNU,extrahuj:extrahuj,pracDny:pracDny,otevrena:otevrena,nove:nove,polozka:polozka,zodpovez:zodpovez,zpozdene:zpozdene,pripomenoutHovor:pripomenoutHovor,shrnuti:shrnuti,naZaznam:naZaznam,zZaznamu:zZaznamu};
if(typeof module!="undefined")module.exports=W.OTAZKY;
if(typeof window=="undefined"||!window.document)return;
function es(s){return typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var L="ZnalostElza",DB=[],loaded=false,msg="";
function ok(){return window.SDL&&!SDL.demo()&&window.SEZ&&SEZ.S&&SEZ.S.ZnalostElza}
async function nacti(strict){try{if(ok()){SDL.def(L,SEZ.S.ZnalostElza,"ELZA asistent: Znalosti a profil firmy");var rows=await SDL.read(L);if(strict&&!Array.isArray(rows))throw new Error("Seznam ZnalostElza není dostupný.");DB=(rows||[]).map(zZaznamu).filter(Boolean)}else if(window.SDL&&SDL.demo())DB=[{Id:1,id:"d1",work:"WORK-DEMO",q:"Kdy můžete přijet na obhlídku?",od:new Date(Date.now()-5*864e5).toISOString(),kanal:"email",Stav:"otevrena"}]}catch(e){msg="Čtení otázek selhalo: "+e.message;if(strict)throw e}loaded=true}
function radek(p,pripad){
 return '<div class=it><span>'+(pripad?'':'<b>'+es(p.work)+'</b>: ')+es(p.q)+
  '<br><small>'+es(otevrena(p)?'Bez zapsané odpovědi':'Odpověď zapsána')+'</small><br>'+
  '<textarea rows=2 aria-label="Odpověď zákazníkovi" data-oq>'+es(p.odp||"")+'</textarea> '+
  '<label>Kanál <select data-oqkanal>'+["telefon","e-mail","osobně"].map(function(k){
   return '<option'+(k===(p.odpKanal||"telefon")?' selected':'')+'>'+k+'</option>';
  }).join("")+'</select></label></span><button class=b data-oz="'+es(p.Id||p.id)+'">'+
  (otevrena(p)?'Zapsat odpověď':'Uložit úpravu')+'</button><span data-oqstatus role=status></span></div>';
}
async function box(){
 if(!loaded)await nacti();
 var z=zpozdene(DB,new Date().toISOString());
 if(!z.length)return "";
 return '<div class=wait id=otzbox><b>Otázky zákazníků bez zapsané odpovědi ('+z.length+')</b>'+
  z.slice(0,6).map(function(p){return radek(p,false)}).join("")+'</div>';
}
async function boxPripadu(work){
 try{if(ok())await nacti(true);else if(!loaded)await nacti()}
 catch(e){return '<p class=note>'+es(msg)+'</p>'}
 var polozky=DB.filter(function(p){return p.work===work});
 return '<details><summary>Otázky zákazníka ('+polozky.length+')</summary>'+
  (polozky.length?polozky.map(function(p){return radek(p,true)}).join(""):'<p class=note>Otázky můžete přidat z přiřazeného vlákna v Poště.</p>')+'</details>';
}
async function ulozOdpoved(p,odp,kanal,kdo){
 if(!ok()||!p.Id)throw new Error("Úprava vyžaduje existující položku v seznamu ZnalostElza.");
 var n=zodpovez(p,odp,kdo,new Date().toISOString(),kanal);
 var z=naZaznam(n);
 await SDL.write(L,p.Id,{Stav:z.Stav,Text:z.Text,Kdo:n.odpKdo,Kdy:n.odpKdy});
 Object.assign(p,n);
 return n;
}
async function klik(e){
 var b=e.target.closest&&e.target.closest("[data-oz]");
 if(!b||b.disabled)return;
 var it=b.closest(".it"),status=it.querySelector("[data-oqstatus]");
 var p=DB.find(function(x){return String(x.Id||x.id)===b.dataset.oz});
 if(!p){status.textContent="Položku se nepodařilo načíst. Obnovte stránku.";return}
 var kdo=typeof acc!=="undefined"&&acc?(acc.username||acc.name||""):"";
 b.disabled=true;
 try{
  await ulozOdpoved(p,it.querySelector("[data-oq]").value,it.querySelector("[data-oqkanal]").value,kdo);
  it.querySelector("small").textContent="Odpověď zapsána.";
  status.textContent="Odpověď uložena.";
  b.textContent="Uložit úpravu";
 }catch(err){status.textContent="Zápis se nepodařil: "+err.message}
 finally{b.disabled=false}
}
W.OTAZKY.ulozOdpoved=ulozOdpoved;
W.OTAZKY.boxPripadu=boxPripadu;
var uklada=Promise.resolve();
function ulozZPosty(work,qs){
 var zapis=uklada.then(async function(){
  if(!ok())throw new Error("Zápis otázek vyžaduje dostupný seznam ZnalostElza.");
  await nacti(true);
  var count=0,existujici=DB.filter(function(p){return p.work===work});
  for(var q of qs){
   if(!nove(existujici,[q]).length)continue;
   var p=polozka(q,work,q.od,"email");
   await SDL.write(L,0,naZaznam(p));
   existujici.push(p);loaded=false;
   count++;
  }
  return count;
 });
 uklada=zapis.catch(function(){});
 return zapis;
}
W.OTAZKY.ulozZPosty=ulozZPosty;
W.OTAZKY.cekaNaOdpoved=async function(work){
 if(!loaded)await nacti();
 return pripomenoutHovor(DB,work);
};
W.OTAZKY.box=box;W.OTAZKY.bind=function(){var mn=document.getElementById("main");if(mn&&!mn._ot){mn._ot=1;mn.addEventListener("click",klik)}};
})();
