/* ELZA Asistent: Průběh komunikace případu (0.70.1). Z e-mailové konverzace složí chronologický přehled od první zprávy a u každé zprávy
   rozliší, od koho přišla (zákazník, ředitel, obchod, technik, společná schránka = recepce ELZY, kolega). Jen čtení, nic se nezapisuje.
   Role kolegů jsou v ROLE (adresa → role); doplní se v kódu, později ze seznamu zaměstnanců. Čistá logika: test/vlakno.test.js. */
(function(){var W=typeof window!="undefined"?window:globalThis;
var ROLE={"jusko@elzy.cz":"ředitel","hamernik@elzy.cz":"obchod","knapikova@elzy.cz":"obchod","kostka@elzy.cz":"technik","jasansky@elzy.cz":"technik","krejci@elzy.cz":"vedoucí techniků","elzy@elzy.cz":"společná schránka (recepce)"};
function role(a){a=String(a||"").toLowerCase();if(ROLE[a])return ROLE[a];return /@elzy\.(cz|biz)$|@elzycz\.onmicrosoft\.com$/.test(a)?"kolega ELZY":"zákazník / externí"}
function jmeno(p){var e=p&&p.emailAddress||{};return e.name&&e.name.indexOf("@")<0?e.name:(e.address||"")}
function adr(p){return String(p&&p.emailAddress&&p.emailAddress.address||"").toLowerCase()}
function cisti(t){return String(t||"").split(/\r?\n\s*(?:From|Od|Odesílatel):/i)[0].replace(/\s+/g," ").trim()}
/* jedna zpráva → řádek přehledu */
function radek(m){var od=adr(m.from);return{kdy:m.receivedDateTime||"",od:jmeno(m.from),role:role(od),komu:(m.toRecipients||[]).map(function(p){return role(adr(p))+" ("+jmeno(p)+")"}),kopie:(m.ccRecipients||[]).map(function(p){return jmeno(p)}),priloha:!!m.hasAttachments,text:cisti(m.bodyPreview).slice(0,220)}}
function prehled(msgs){return (msgs||[]).map(radek).sort(function(a,b){return a.kdy<b.kdy?-1:a.kdy>b.kdy?1:0})}
/* souhrn pro hlavičku: první zpráva, kolik zpráv, kdo se zapojil */
function souhrn(r){if(!r.length)return null;var kdo={};r.forEach(function(x){kdo[x.role]=(kdo[x.role]||0)+1});return{prvni:r[0].kdy,posledni:r[r.length-1].kdy,pocet:r.length,role:kdo}}
function prvniExterniOdesilatel(messages){
 for(var m of messages){
  var address=String((m.from&&m.from.emailAddress&&m.from.emailAddress.address)||"").trim().toLowerCase();
  if(address&&role(address)==="zákazník / externí")return address;
 }
 return "";
}
function nazevEspo(subject){
 var m=/^\s*(?:(?:re|fw|fwd):\s*)*byli jste zmíněni ve streamu případu\s+(.+)$/i.exec(String(subject||""));
 return m?m[1].trim():"";
}
function klicNazvu(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function vazbaPripadu(input,cases,linked){
 if(linked)return {stav:"prirazeno",id:linked,duvod:"Vlákno už je přiřazené."};
 if(!Array.isArray(cases))return {stav:"nedostupne",duvod:"Případy se nepodařilo načíst."};
 var text=String(input.text||"").toUpperCase();
 var codes=new Set(text.match(/\b(?:WORK-\d{8}-\d+|PR\d{6}|OBJ\d{5}|Z-\d{4}-\d{3,}|ZK\d+)\b/g)||[]);
 var exact=cases.filter(function(c){return [c.id,c.espo,c.zak].some(function(k){return k&&codes.has(String(k).toUpperCase())})});
 if(exact.length===1)return {stav:"kod",id:exact[0].id,duvod:"Shoduje se kód případu nebo zakázky v textu."};
 if(exact.length>1)return {stav:"vice",duvod:"Text odkazuje na více případů.",moznosti:exact.map(function(c){return c.id})};
 var espo=nazevEspo(input.predmet);
 if(espo){
  var matches=cases.filter(function(c){return [c.nazev].concat(c.aliasy||[]).some(function(n){return klicNazvu(n)===klicNazvu(espo)})});
  if(matches.length===1)return {stav:"mozna",id:matches[0].id,duvod:"Název případu v oznámení z Espa odpovídá evidenci. Ověřte vazbu."};
  if(matches.length>1)return {stav:"vice",duvod:"Název z oznámení odpovídá více případům.",moznosti:matches.map(function(c){return c.id})};
  return {stav:"espo",duvod:"Oznámení z Espa o existujícím případu. Vazbu v ELZE je potřeba dohledat."};
 }
 var sk=vazbaSkore(input,cases,codes);
 if(!sk.length)return {stav:"bez",duvod:"V načtených podkladech se nenašla vazba. Může jít o novou věc."};
 var t=sk[0],n=sk[1],text0=function(c){return c.id+" ("+c.skore+" b.: "+c.duvody.slice(0,3).join(", ")+")"};
 if(!n||t.skore-n.skore>=20)return {stav:"mozna",id:t.id,skore:t.skore,kandidati:sk.slice(0,3),duvod:"Nejlepší shoda "+text0(t)+(n?"; druhý je o "+(t.skore-n.skore)+" b. níž":"")+". Ověřte, že jde o stejnou věc."};
 var blizko=sk.filter(function(c){return t.skore-c.skore<20}).slice(0,5);
 return {stav:"vice",duvod:"Více případů má podobnou shodu: "+blizko.slice(0,3).map(text0).join("; ")+".",moznosti:blizko.map(function(c){return c.id}),kandidati:blizko}}
/* 0.88.0: bodovaná shoda místo „adresa musí být v klíčových slovech“. Důkazy: kód v textu, adresa odesílatele i dalších účastníků vlákna, doména firmy, slova z názvu případu a jeho klíčová slova
   v CELÉM textu (ne v náhledu), dříve potvrzená rozhodnutí o odesílateli a poznámky člověka. Uzavřený případ je kandidát jen s postihem. Nic se nedomýšlí: bez důkazu žádný návrh. */
var STOP={dobry:1,prosim:1,dekuji:1,dekujeme:1,zprava:1,zpravy:1,nabidka:1,nabidku:1,poptavka:1,poptavku:1,pozdrav:1,pozdravem:1,email:1,tento:1,takze:1,ohledne:1,vase:1,vasi:1,zakazka:1,zakazku:1,objekt:1,objektu:1,systemu:1,system:1,firma:1,firmy:1,mobil:1,telefon:1,odeslano:1,predmet:1,prijemce:1,kopie:1,datum:1,pozn:1,cesky:1,cesko:1};
function nrm(t){return String(t||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}
function tokeny(t){var o={};nrm(t).split(/[^a-z0-9]+/).forEach(function(w){if(w.length>=5&&!STOP[w]&&!/^\d+$/.test(w))o[w]=1});return o}
var BROAD=/^(?:gmail|seznam|email|centrum|outlook|post|volny|icloud|hotmail|atlas|tiscali)\./i;
/* externí adresy všech zpráv vlákna (od, komu, kopie), bez kolegů ELZY; první je odesílatel první externí zprávy */
function ucastnici(messages){var out=[],seen={};(messages||[]).forEach(function(m){[m.from].concat(m.toRecipients||[],m.ccRecipients||[]).forEach(function(p){var a=adr(p);if(a&&!seen[a]&&role(a)==="zákazník / externí"){seen[a]=1;out.push(a)}})});return out}
function vazbaSkore(input,cases,codes){codes=codes||new Set();
 var text=String(input.text||""),tk=tokeny((input.predmet||"")+" "+text),sub=tokeny(input.predmet||""),pozn=tokeny((input.poznamka||"")+" "+[String(input.adresa||"")].concat(input.adresy||[]).map(function(a){return ((input.uceni||{})[String(a).toLowerCase()]||{}).p||""}).join(" ")),
  odes=String(input.adresa||"").trim().toLowerCase(),ostatni=(input.adresy||[]).map(function(a){return String(a).toLowerCase()}).filter(function(a){return a&&a!==odes}),
  vsechny=(odes?[odes]:[]).concat(ostatni),uc=input.uceni||{},out=[];
 (cases||[]).forEach(function(c){var s=0,d=[],klice=String(c.klice||"").toLowerCase().split(/[;,\s]+/).filter(Boolean),adrK=klice.filter(function(k){return k.indexOf("@")>=0}),slovaK=klice.filter(function(k){return k.indexOf("@")<0&&!/^obj\d{5}$/.test(k)&&k.length>=4});
  if(odes&&adrK.indexOf(odes)>=0){s+=40;d.push("odesílatel je v klíčových slovech")}
  else if(ostatni.some(function(a){return adrK.indexOf(a)>=0})){s+=30;d.push("účastník vlákna je v klíčových slovech")}
  var dom=vsechny.map(function(a){return a.split("@")[1]}).filter(function(x){return x&&!BROAD.test(x)}).some(function(x){return adrK.indexOf("@"+x)>=0});
  if(dom&&!d.length){s+=15;d.push("shodná firemní doména")}
  if(klice.some(function(k){return /^obj\d{5}$/.test(k)&&codes.has(k.toUpperCase())})){s+=60;d.push("kód objektu v textu")}
  var nz={};[c.nazev].concat(c.aliasy||[]).forEach(function(n){var t=tokeny(n);Object.keys(t).forEach(function(w){nz[w]=1})});var ws=Object.keys(nz),hit=ws.filter(function(w){return tk[w]}),hs=ws.filter(function(w){return sub[w]});
  if(hit.length){s+=Math.min(30,12*hit.length);d.push("slova z názvu případu: "+hit.slice(0,3).join(", "))}if(hs.length){s+=10;d.push("v předmětu")}
  var kh=slovaK.filter(function(k){return tk[nrm(k)]||nrm(text).indexOf(nrm(k))>=0});if(kh.length){s+=Math.min(24,8*kh.length);d.push("klíčová slova v textu: "+kh.slice(0,3).join(", "))}
  vsechny.forEach(function(a){var u=uc[a];if(u&&u.w===c.id&&u.v!=="ne"&&u.n>0&&d.indexOf("dříve potvrzeno")<0){s+=40+Math.min(10,(u.n-1)*3);d.push("dříve potvrzeno")}});
  if(ws.some(function(w){return pozn[w]})){s+=12;d.push("shoda s vaší poznámkou")}
  if(c.uzavreny)s-=25;
  if(s>=10)out.push({id:c.id,skore:s,duvody:d})});
 return out.sort(function(a,b){return b.skore-a.skore})}
W.VLAKNO={ucastnici:ucastnici,vazbaSkore:vazbaSkore,tokeny:tokeny,nazevEspo:nazevEspo,vazbaPripadu:vazbaPripadu,ROLE:ROLE,role:role,prvniExterniOdesilatel:prvniExterniOdesilatel,radek:radek,prehled:prehled,souhrn:souhrn};
if(typeof module!="undefined")module.exports=W.VLAKNO;
})();
