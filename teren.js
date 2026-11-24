/* ELZA Asistent: Terénní režim technika (0.70.0). Na obhlídce vede technika kontrolním seznamem, počítá fotky a ještě na místě připraví koncept zprávy zákazníkovi
   a úkol pro obchod (nabídka z obhlídky). Nic se neodesílá bez klepnutí a souhlasu; zprávu technik zkopíruje nebo odešle po kontrole.
   Čistá logika: test/teren.test.js. Fotky se ukládají do složky zakázky (0.71.0: OBJ/PR/pracovní/fotodokumentace z obhlídky), zakázka se vybírá z Případů. */
(function(){var W=typeof window!="undefined"?window:globalThis;
var POL=[["vstup","Vstup a kontakt na místě ověřen (kdo nás provede)",1],["ustredna","Ústředna EPS: typ, výrobce, stav, štítek",1],["prvky","Hlásiče a prvky: druhy, počty, vzorek stavu",1],["kabelaz","Kabeláž a trasy: stav, označení",0],["napajeni","Napájení a záložní zdroje",0],["prenos","Přenos na PCO: stávající (GPRS/LTE/internet), připojení k internetu",1],["dokum","Dokumentace: PBŘ, projekt, revize, provozní kniha",1],["kontakty","Kontakty odpovědných osob a provozovatele",1],["rizika","Závady a rizika k okamžitému upozornění",0]];
function nova(zak,zakaznik){return{zak:zak||"",zakaznik:zakaznik||"",odp:{},fotek:0,pozn:"",obj:"",pr:"",ulozeno:0}}
/* plán uložení fotek: složka a název podle struktury.js (foto_obhlidka); chyba, když chybí kód objektu nebo zakázky */
function fotoPlan(s,files,datum){var ST=W.STRUKTURA||(typeof require!="undefined"?require("./struktura.js"):null);if(!ST)throw new Error("Chybí struktura.js");var d=datum||new Date().toISOString().slice(0,10),out=[];
 (files||[]).forEach(function(f,i){var nm=String(f.name||""),m=/\.([A-Za-z0-9]{2,5})$/.exec(nm),e=m?m[1].toLowerCase():"jpg";if(e=="jpeg")e="jpg";var o={obj:String(s.obj||"").toUpperCase(),pr:String(s.pr||"").toUpperCase(),typ:"foto_obhlidka",popis:"foto-"+("0"+(s.ulozeno+i+1)).slice(-2),pripona:e,datum:d};
  out.push({rel:ST.slozka(o),name:ST.nazev(o),orig:nm})});return out}
function stav(s){var ok=POL.filter(function(p){return s.odp[p[0]]=="ano"}).length,pov=POL.filter(function(p){return p[2]&&s.odp[p[0]]!="ano"&&s.odp[p[0]]!="ne"});return{hotovo:ok,celkem:POL.length,chybiPovinne:pov.map(function(p){return p[1]}),pct:Math.round(100*ok/POL.length)}}
/* chybí podklady = položky označené „ne“ (nemáme, žádáme zákazníka) */
function chybi(s){return POL.filter(function(p){return s.odp[p[0]]=="ne"&&(p[0]=="dokum"||p[0]=="kontakty"||p[0]=="prenos")}).map(function(p){return p[1]})}
function zprava(s,tech){var c=chybi(s),r=POL.filter(function(p){return s.odp[p[0]]=="ano"}).length;
 var t="Dobrý den,\n\nděkujeme za dnešní přijetí na obhlídce"+(s.zakaznik?" ("+s.zakaznik+")":"")+". Zkontrolovali jsme "+r+" z "+POL.length+" bodů a pořídili "+s.fotek+" fotografií.\n";
 if(s.pozn)t+="\nShrnutí z místa: "+s.pozn+"\n";
 if(c.length)t+="\nPro zpracování nabídky a řešení nám prosím pošlete:\n"+c.map(function(x){return "- "+x}).join("\n")+"\n";
 t+="\nNabídku vám připravujeme a zašleme co nejdříve."+"\n\nS pozdravem\n"+(tech||"")+"\nELZY, spol. s r.o.";return t}
W.TEREN={POL:POL,nova:nova,stav:stav,chybi:chybi,zprava:zprava,fotoPlan:fotoPlan};
if(typeof module!="undefined")module.exports=W.TEREN;
if(typeof window=="undefined"||!window.document)return;
function es(s){return typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var S=nova(),EL=null,MSG="",FILES=[],PRI=null;
function me(){return String((window.acc&&(acc.name||acc.username))||"")}
function draw(){if(!EL)return;var st=stav(S);
 var h='<h1>Na obhlídce</h1><p class=note>ELZA vás vede obhlídkou. Odškrtejte body, pořiďte fotky a na konci dostanete hotový koncept zprávy zákazníkovi i úkol pro obchod. Nic se neodešle bez vašeho klepnutí.</p>';
 h+='<div class=card><div class=in><label>Případ z Případů<select id=tcs><option value="">(vybrat)</option>'+(PRI||[]).map(function(c){return '<option value="'+es(c.id)+'"'+(c.id==S.zak?' selected':'')+'>'+es(c.id+' '+(c.nazev||''))+'</option>'}).join('')+'</select></label><label>Zakázka / případ<input id=tz value="'+es(S.zak)+'"></label><label>Kód objektu (OBJ00000)<input id=to value="'+es(S.obj)+'"></label><label>Číslo zakázky (PR000000)<input id=tpr value="'+es(S.pr)+'"></label><label>Zákazník<input id=tk value="'+es(S.zakaznik)+'"></label></div></div>';
 h+='<div class=card><h3>Kontrolní seznam ('+st.hotovo+' / '+st.celkem+')</h3>'+POL.map(function(p){var o=S.odp[p[0]]||"";return '<p><b>'+es(p[1])+'</b>'+(p[2]?' <small>povinné</small>':'')+'<br><button class=b data-k="'+p[0]+'" data-v=ano>'+(o=="ano"?"✓ ":"")+'Ano</button> <button class=b data-k="'+p[0]+'" data-v=ne>'+(o=="ne"?"✓ ":"")+'Chybí / nemáme</button></p>'}).join("")+'</div>';
 h+='<div class=card><h3>Fotky ('+S.fotek+')</h3><input type=file id=tf accept="image/*" capture=environment multiple><p class=note>Vybrané fotky ('+FILES.length+') se po klepnutí uloží do složky zakázky (OBJ / PR / pracovní / fotodokumentace z obhlídky). Už uloženo: '+S.ulozeno+'.</p><p><button class=b id=tfu>Uložit fotky do složky zakázky</button></p><p id=tfm class=note>'+es(MSG&&/Fotk|fotk/.test(MSG)?MSG:'')+'</p><label>Shrnutí z místa<textarea id=tp rows=3>'+es(S.pozn)+'</textarea></label></div>';
 h+='<div class=card><h3>Hotovo na místě</h3>'+(st.chybiPovinne.length?'<p class=note>Ještě neodpovězeno: '+st.chybiPovinne.map(es).join("; ")+'</p>':'')+'<p><button class=b id=tz1>Připravit zprávu zákazníkovi</button> <button class=b id=tz2>Založit úkol: nabídka z obhlídky pro obchod</button></p>'+(MSG?'<p class=note>'+es(MSG)+'</p>':'')+'<div id=tout></div></div>';
 EL.innerHTML=h;
 EL.querySelectorAll("[data-k]").forEach(function(b){b.onclick=function(){S.odp[b.dataset.k]=b.dataset.v;sync();draw()}});
 document.getElementById("tf").onchange=function(e){var a=[].slice.call(e.target.files);FILES=FILES.concat(a);S.fotek+=a.length;sync();draw()};
 var cs=document.getElementById("tcs");if(cs)cs.onchange=function(){sync();S.zak=cs.value;var c=(PRI||[]).filter(function(x){return x.id==cs.value})[0];if(c){var t=(c.zak+" "+c.klice+" "+c.nazev),o=/OBJ\d{5}/i.exec(t),p=/PR\d{6}/i.exec(t);if(o)S.obj=o[0].toUpperCase();if(p)S.pr=p[0].toUpperCase();if(!S.zakaznik)S.zakaznik=c.nazev||""}draw()};
 document.getElementById("tfu").onclick=async function(){sync();if(!FILES.length){MSG="Fotky: nejdřív vyberte fotky.";return draw()}try{if(!window.SDL||SDL.demo())throw new Error("V ukázkovém režimu se fotky neukládají.");var pl=fotoPlan(S,FILES),ok=0,ch=[],zb=[];
  for(var i=0;i<pl.length;i++){try{await SDL.upload("Shared Documents/Zakazky",pl[i].rel,pl[i].name,FILES[i]);ok++}catch(e){ch.push(pl[i].orig+": "+e.message);zb.push(FILES[i])}}
  S.ulozeno+=ok;FILES=zb;MSG="Fotky: uloženo "+ok+" z "+pl.length+(ch.length?". Chyby: "+ch.join("; "):".");
  if(ok&&window.pripadyAkt&&S.zak)try{await pripadyAkt(S.zak,"Obhlídka",0,"Uloženo "+ok+" fotek do složky zakázky","Na obhlídce")}catch(e){}}catch(e){MSG="Fotky: "+e.message}draw()};
 document.getElementById("tz1").onclick=function(){sync();document.getElementById("tout").innerHTML='<textarea rows=14 style="width:100%">'+es(zprava(S,me()))+'</textarea><p class=note>Zkopírujte do e-mailu a před odesláním zkontrolujte.</p>'};
 document.getElementById("tz2").onclick=async function(){sync();try{var d=new Date(),i=d.toISOString().slice(0,10);if(window.SDL&&!SDL.demo()){await SDL.write("Ukol",0,{Title:"Nabídka z obhlídky: "+(S.zakaznik||S.zak),KodZakazky:S.zak,Resitel:"",Od:i,Do:i,Hotovo:0,Poznamka:"Po obhlídce, chybí: "+(chybi(S).join("; ")||"nic")+". "+S.pozn});MSG="Úkol pro obchod založen."}else MSG="V ukázkovém režimu se úkol nezapisuje."}catch(e){MSG="Chyba: "+e.message}draw()}}
function sync(){var a=document.getElementById("tz"),b=document.getElementById("tk"),c=document.getElementById("tp"),o=document.getElementById("to"),r=document.getElementById("tpr");if(o)S.obj=o.value.trim().toUpperCase();if(r)S.pr=r.value.trim().toUpperCase();if(a)S.zak=a.value;if(b)S.zakaznik=b.value;if(c)S.pozn=c.value}
function html(){return '<div id=trx></div>'}
function mt(){EL=document.getElementById("trx");draw();if(window.pripadySeznam)pripadySeznam().then(function(x){PRI=x;draw()}).catch(function(){})}
window.MODS=window.MODS||{};window.MODS.teren=[html,mt];
})();
