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
function vazbaPripadu(input,cases,linked){
 if(linked)return {stav:"prirazeno",id:linked,duvod:"Vlákno už je přiřazené."};
 if(!Array.isArray(cases))return {stav:"nedostupne",duvod:"Případy se nepodařilo načíst."};
 var text=String(input.text||"").toUpperCase();
 var codes=new Set(text.match(/\b(?:WORK-\d{8}-\d+|PR\d{6}|OBJ\d{5}|Z-\d{4}-\d{3,}|ZK\d+)\b/g)||[]);
 var exact=cases.filter(function(c){return [c.id,c.espo,c.zak].some(function(k){return k&&codes.has(String(k).toUpperCase())})});
 if(exact.length===1)return {stav:"kod",id:exact[0].id,duvod:"Shoduje se kód případu nebo zakázky v textu."};
 if(exact.length>1)return {stav:"vice",duvod:"Text odkazuje na více případů.",moznosti:exact.map(function(c){return c.id})};
 var address=String(input.adresa||"").trim().toLowerCase(),domain=address.split("@")[1];
 var broad=/^(?:gmail|seznam|email|centrum|outlook|post|volny|icloud|hotmail|atlas|tiscali)\./i;
 var weak=cases.filter(function(c){
  if(c.uzavreny)return false;
  return String(c.klice||"").toLowerCase().split(/[;,\s]+/).some(function(k){
   return (address&&(k===address||(domain&&!broad.test(domain)&&k==="@"+domain)))||
    (/^obj\d{5}$/.test(k)&&codes.has(k.toUpperCase()));
  });
 });
 if(weak.length===1)return {stav:"mozna",id:weak[0].id,duvod:"Podobnost kontaktu nebo objektu stačí k návrhu vazby. Ověřte, že jde o stejnou věc."};
 if(weak.length>1)return {stav:"vice",duvod:"Kontaktu nebo objektu odpovídá více otevřených případů.",moznosti:weak.map(function(c){return c.id})};
 return {stav:"bez",duvod:"V načtených podkladech se nenašla vazba. Může jít o novou věc."};
}
W.VLAKNO={vazbaPripadu:vazbaPripadu,ROLE:ROLE,role:role,prvniExterniOdesilatel:prvniExterniOdesilatel,radek:radek,prehled:prehled,souhrn:souhrn};
if(typeof module!="undefined")module.exports=W.VLAKNO;
})();
