/* ELZA Asistent: Kdo je zákazník (0.76.0). Krok 0 procesu nabídky: před první nabídkou, dotazy i odpovědí ELZA ukáže, co o zákazníkovi víme.
   Zásada Tomáše (2026-11-25): vše interní (kroky, dokumenty, historie, slevy, rámcové dohody, poznámky typu „kamarád majitele“) se vede v ELZA systému,
   v seznamu ZakaznikInfo na webu Zakázky ELZA; zapisuje se ručně a hned, zatím lze doplnit i vyčtením z Espa (jen čtení, Zdroj = espo).
   Účetnictví se nečte. Veřejné informace o firmě až potom a jen pro Tomáše (zde nejsou). Čistá logika: test/zakaznik.test.js. Nic se neodesílá. */
(function(){var W=typeof window!="undefined"?window:globalThis;
var TYP={sleva:"Sleva nebo cenová dohoda",dohoda:"Rámcová dohoda nebo smlouva",historie:"Co jsme dodali nebo odebrali",postup:"Interní postup u zákazníka",osoba:"Osoba a vztahy (kdo je kdo)",riziko:"Riziko nebo upozornění",poznamka:"Poznámka"};
var ZDROJ={rucne:"Zapsáno ručně",espo:"Vyčteno z Espa (jen čtení)"};
function nrm(s){return String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\b(s\.?\s?r\.?\s?o\.?|a\.?\s?s\.?|spol)\b/g,"").replace(/[^a-z0-9]+/g," ").trim()}
function shoda(a,b){a=nrm(a);b=nrm(b);return !!a&&!!b&&(a==b||(Math.min(a.length,b.length)>=5&&(a.indexOf(b)>=0||b.indexOf(a)>=0)))}
/* karta: záznamy zákazníka seskupené podle typu, aktivní; nabídky podle jména; co chybí */
function karta(jmeno,info,nabidky){var z=(info||[]).filter(function(x){return x.Stav!="vyrazeno"&&shoda(x.Zakaznik,jmeno)}),g={};Object.keys(TYP).forEach(function(k){g[k]=[]});z.forEach(function(x){(g[TYP[x.Typ]?x.Typ:"poznamka"]).push(x)});
 var nb=(nabidky||[]).filter(function(n){return shoda(n.Zakaznik,jmeno)}),spoluprace=z.length>0||nb.length>0;
 return{jmeno:jmeno,znamy:spoluprace,skupiny:g,celkem:z.length,nabidky:nb,upozorneni:g.riziko.concat(g.sleva).length,chybi:spoluprace?[]:["O zákazníkovi zatím nemáme nic zapsáno: doplňte ručně, nebo vyčtěte z Espa."]}}
function novy(o){if(!String(o.Zakaznik||"").trim())throw new Error("Doplňte zákazníka.");if(!String(o.Text||"").trim())throw new Error("Doplňte text.");return{Title:(o.Zakaznik+": "+(TYP[o.Typ]||"Poznámka")).slice(0,200),Zakaznik:o.Zakaznik.trim(),Typ:TYP[o.Typ]?o.Typ:"poznamka",Text:String(o.Text).trim(),Zdroj:o.Zdroj=="espo"?"espo":"rucne",Kdo:o.Kdo||"",Kdy:o.Kdy||"",Stav:"platne",Zakazka:o.Zakazka||""}}
function E(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
/* stručná karta pro detail případu (0.84.0): jen co se týká jednání; upozornění (riziko, sleva) nahoře; vše escapované */
function stru(k){if(!k.jmeno)return"";var h='<h3>Kdo je zákazník</h3>';if(!k.znamy)return h+'<p class=note>'+E(k.jmeno)+': zatím nic zapsáno. Doplňte v Nabídky → Kdo je zákazník (před první odpovědí a nabídkou).</p>';
 var up=k.skupiny.riziko.concat(k.skupiny.sleva);if(up.length)h+='<div class=wait>'+up.map(function(x){return '<b>'+E(TYP[x.Typ])+':</b> '+E(x.Text)}).join('<br>')+'</div>';
 h+='<ul>'+["dohoda","historie","postup","osoba","poznamka"].reduce(function(a,t){return a.concat(k.skupiny[t])},[]).slice(0,6).map(function(x){return '<li>'+E(TYP[x.Typ])+': '+E(x.Text)+' <small>('+E(ZDROJ[x.Zdroj]||x.Zdroj||"")+')</small></li>'}).join("")+'</ul>';
 if(k.nabidky.length)h+='<p class=note>Nabídky: '+k.nabidky.map(function(n){return E(n.Title)+' ('+E(n.Stav||"")+')'}).join(', ')+'</p>';return h}
W.ZAKAZNIK={TYP:TYP,ZDROJ:ZDROJ,shoda:shoda,karta:karta,novy:novy,stru:stru};
if(typeof module!="undefined")module.exports=W.ZAKAZNIK;
if(typeof window=="undefined"||!window.document)return;
function es(s){return typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var L="ZakaznikInfo",DB=[],NB=[],ST={q:"",msg:"",miss:false,busy:false},EL=null,demo=function(){return SDL.demo()};
SDL.def(L,SEZ.S.ZakaznikInfo,"ELZA asistent: interní informace o zákazníkovi");SDL.def("NabidkaEvid",SEZ.S.NabidkaEvid,"ELZA asistent: evidence odeslaných nabídek");
function me(){return String((window.acc&&(acc.username||acc.name))||"")}
async function load(){if(demo()){DB=[{Id:1,Zakaznik:"Ukázkový zákazník A",Typ:"sleva",Text:"Trvalá sleva 8 % dle dohody s jednatelem.",Zdroj:"rucne",Kdo:"tkrejci@elzy.cz",Kdy:"2026-11-20"}];NB=[];draw();return}try{var r=await SDL.read(L);if(r==null){ST.miss=true;DB=[]}else{ST.miss=false;DB=r}NB=(await SDL.read("NabidkaEvid"))||[]}catch(e){ST.msg="Čtení selhalo: "+e.message}draw()}
async function run(fn,ok){if(ST.busy)return;ST.busy=true;try{await fn();ST.msg=ok}catch(e){ST.msg="Chyba: "+e.message}ST.busy=false;if(!demo())await load();else draw()}
function draw(){if(!EL)return;var h='<h1>Kdo je zákazník</h1><p class=note>Krok 0 před první nabídkou, dotazy i odpovědí. Interní informace (slevy, dohody, historie, poznámky) se vedou tady, zapisují se hned. Účetnictví se nečte, nic se neodesílá.</p>';
 if(ST.miss)h+='<div class=card><p>Seznam <b>ZakaznikInfo</b> ještě není založen na webu Zakázky ELZA.</p><p><button class=b id=zkmk>Založit seznam</button></p></div>';
 h+='<div class=bar><input id=zkq placeholder="Jméno zákazníka (např. MAKRO)" value="'+es(ST.q)+'" style="min-width:260px"><button class=b id=zkh>Ukázat kartu</button></div>';
 if(ST.q){var k=karta(ST.q,DB,NB);h+='<div class=card><h3>'+es(k.jmeno)+'</h3>'+(k.chybi.length?'<p class=note>'+es(k.chybi[0])+'</p>':'')+Object.keys(TYP).filter(function(t){return k.skupiny[t].length}).map(function(t){return '<h4>'+es(TYP[t])+'</h4><ul>'+k.skupiny[t].map(function(x){return '<li>'+es(x.Text)+' <small>('+es(ZDROJ[x.Zdroj]||x.Zdroj||"")+', '+es(x.Kdo||"")+' '+es(String(x.Kdy||"").slice(0,10))+')</small></li>'}).join("")+'</ul>'}).join("")+(k.nabidky.length?'<h4>Nabídky</h4><ul>'+k.nabidky.map(function(n){return '<li>'+es(n.Title)+' ('+es(n.Stav||"")+', odesláno '+es(n.Odeslano||"")+')</li>'}).join("")+'</ul>':'')+'</div>'}
 h+='<div class=card><h3>Zapsat informaci</h3><div class=in><label>Typ<select id=zkt>'+Object.keys(TYP).map(function(t){return '<option value='+t+'>'+es(TYP[t])+'</option>'}).join("")+'</select></label> <label>Zákazník<input id=zkz value="'+es(ST.q)+'" style="width:200px"></label> <label>Text<input id=zkx style="width:340px" placeholder="např. trvalá sleva 8 %, domluvil jednatel"></label> <label>Zdroj<select id=zks><option value=rucne>Ručně</option><option value=espo>Vyčteno z Espa</option></select></label> <button class=b id=zku>Zapsat</button></div></div>';
 if(ST.msg)h+='<p class=note>'+es(ST.msg)+'</p>';EL.innerHTML=h;
 var q=function(i){return EL.querySelector(i)};
 q("#zkh").onclick=function(){ST.q=q("#zkq").value.trim();draw()};
 var mk=q("#zkmk");if(mk)mk.onclick=function(){run(async function(){await SDL.create([L])},"Seznam ZakaznikInfo je založen.")};
 q("#zku").onclick=function(){var o;try{o=novy({Zakaznik:q("#zkz").value,Typ:q("#zkt").value,Text:q("#zkx").value,Zdroj:q("#zks").value,Kdo:me(),Kdy:new Date().toISOString().slice(0,10)})}catch(e){ST.msg=e.message;draw();return}
  run(async function(){if(ST.miss)throw new Error("Nejdřív založte seznam.");await SDL.write(L,0,o);ST.q=o.Zakaznik},"Zapsáno.")}}
function html(){return '<div id=zkx0></div>'}
function mt(){EL=document.getElementById("zkx0");draw();load()}
/* detail případu: karta bez zápisu; při chybě čtení neblokuje, jen to sdělí */
W.ZAKAZNIK.box=async function(jmeno){try{W.ZAKAZNIK.posl=null;if(!String(jmeno||"").trim())return"";var d,n;if(demo()){d=DB.length?DB:[{Zakaznik:"Ukázkový zákazník A",Typ:"sleva",Text:"Trvalá sleva 8 % dle dohody s jednatelem.",Zdroj:"rucne"}];n=NB}else{d=await SDL.read(L);n=(await SDL.read("NabidkaEvid"))||[];if(d==null)return'<h3>Kdo je zákazník</h3><p class=note>Seznam ZakaznikInfo ještě není založen.</p>'}var kk=karta(jmeno,d,n);W.ZAKAZNIK.posl={jmeno:jmeno,znamy:kk.znamy};return stru(kk)}catch(e){return'<h3>Kdo je zákazník</h3><p class=note>Kartu se nepodařilo načíst: '+E(e.message)+'</p>'}};
window.MODS=window.MODS||{};window.MODS.zakaznik=[html,mt];
})();
