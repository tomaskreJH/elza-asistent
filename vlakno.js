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
W.VLAKNO={ROLE:ROLE,role:role,radek:radek,prehled:prehled,souhrn:souhrn};
if(typeof module!="undefined")module.exports=W.VLAKNO;
})();
