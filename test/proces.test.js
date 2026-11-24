// Test procesního modelu nabídek (čistá logika). Spuštění: node test/proces.test.js
var a=require('assert'),P=require('../proces.js');
// nic nezávislého nesmí čekat: bez PBŘ jde dál dokumentace zdolávání, kontakty, obhlídka po výběru
var d=P.dalsi({poptavka:true});var idT=d.ted.map(function(x){return x.k.id});
['nab1','dokumZd','pbr','ktpo','kont'].forEach(function(i){a.ok(idT.indexOf(i)>=0,'hned: '+i)});
a.ok(d.ceka.some(function(x){return x.k.id=='urad'&&x.ceka.indexOf('PBŘ k dispozici')>=0}),'žádost úřad čeká na PBŘ');
a.ok(d.ceka.some(function(x){return x.k.id=='pco'}),'PCO čeká');
// bez PBŘ se nabídne PBŘ i DZP od nás
var nb=d.nabidnout.map(function(n){return n.krok}).join('|');a.ok(/PBŘ/.test(nb)&&/DZP/.test(nb));
// PCO se nepřipojí, dokud není DZP
var f={poptavka:1,nabidka1:1,vyber:1,hovor:1,obhlidkaPlan:1,obhlidka:1,nabSchv:1,real:1,prenos:1};a.ok(P.stav(f).filter(function(x){return x.k.id=='pco'})[0].s=='ceka');
f.dzp=1;a.equal(P.stav(f).filter(function(x){return x.k.id=='pco'})[0].s,'ted');
// obchod: první nabídka bez ceny → eskalace; s cenou ne
var k=P.KROKY[0];a.deepEqual(P.rozdel(k,{}).obchod,['cena']);a.ok(P.rozdel(k,{}).eskaluj);a.ok(!P.rozdel(k,{cena:'1'}).eskaluj);
a.ok(/Obchod:/.test(P.eskalace(k,'x',{zakaznik:'MAKRO'}).Title));
// koncept nabídky: cena se nevymýšlí, je krátká, má strojový blok
var n=P.nabidkaKoncept({zakaznik:'MAKRO'});a.ok(/\[cenu doplní obchod\]/.test(n.telo));a.ok(n.telo.length<1200);a.ok(/STROJOVĚ ČITELNÉ/.test(n.strojove)&&/krok: Požárně bezpečnostní/.test(n.strojove)&&/ELZY nabízí/.test(n.strojove));a.deepEqual(n.obchodDoplni,['cena','odkaz na další kolo']);
a.deepEqual(P.nabidkaKoncept({cena:'od 990 Kč',odkaz:'https://x'}).obchodDoplni,[]);
// kalendář: výchozí obsazen → jiný technik; nikdo → posun
var sl={od:'2026-11-25T09:00:00Z',do:'2026-11-25T10:00:00Z'},tom={jmeno:'Tomáš',skupiny:['EPS'],obsazen:[{od:'2026-11-25T08:30:00Z',do:'2026-11-25T09:30:00Z'}]},jan={jmeno:'Jan Kostka',skupiny:['EPS'],obsazen:[]},voj={jmeno:'Vojtěch',skupiny:['EPS'],obsazen:[{od:'2026-11-25T13:00:00Z',do:'2026-11-25T14:00:00Z'}]};
var r=P.navrhTechnika(sl,tom,[voj,jan]);a.equal(r.rozhodnuti,'jiny');a.equal(r.technik,'Jan Kostka');
a.equal(P.navrhTechnika(sl,jan,[]).rozhodnuti,'ponechat');
var zam={od:'2026-11-25T08:00:00Z',do:'2026-11-25T12:00:00Z'};var rp=P.navrhTechnika(sl,{jmeno:'T',skupiny:['EPS'],obsazen:[zam]},[{jmeno:'J',skupiny:['EPS'],obsazen:[zam]}]);a.equal(rp.rozhodnuti,'posunout');a.ok(rp.alternativy.length>=1);
// odpověď podle role
a.ok(/Cenu a podmínky určuješ ty/.test(P.konceptOdpovedi('obchod',{})));a.ok(/kroků hotovo/.test(P.konceptOdpovedi('ředitel',{fakta:{}})));a.ok(/ELZY, spol/.test(P.konceptOdpovedi('zákazník / externí',{})));
a.ok(/Hovor/.test(P.hovorZaznam({vysledek:'v'}).popis)&&P.hovorZaznam({}).fakta.hovor);
console.log('proces OK');
// 0.72.0: Elzáček Nabídka a zápis obhlídky do kalendáře
;(function(){var a=require('assert'),P=require('../proces.js');
var k=P.nabidkaTok({zak:'W1',zakaznik:'MAKRO',kdo:'t@elzy.cz'},{poptavka:1});a.equal(k.uloha.Agent,'AG-NABIDKA');a.equal(k.uloha.Stav,'Nová');a.ok(/NEDOPLŇUJ/.test(k.uloha.Zadani)&&/Radim/.test(k.uloha.Zadani));
a.ok(k.ukol&&/cena/.test(k.ukol.Poznamka)&&/Radim/.test(k.ukol.Poznamka)&&k.ukol.Hotovo===0,'bez ceny padne úkol obchodu');
var k2=P.nabidkaTok({zak:'W1',cena:'dle obchodu',odkaz:'https://x.cz'},{poptavka:1});a.equal(k2.ukol,null,'s cenou a odkazem se neeskaluje');
var ev=P.terminUdalost({zak:'W1',zakaznik:'MAKRO',od:'2026-11-25T08:00:00Z',min:90,technik:'Kostka',email:'k@elzy.cz',zkusebne:true,pozvat:true});a.ok(/^\[ZKOUŠKA\]/.test(ev.subject));a.ok(!ev.attendees,'zkušebně nikomu nic neodejde');a.equal(ev.end.dateTime,'2026-11-25T09:30:00');
var ev2=P.terminUdalost({zak:'W1',od:'2026-11-25T08:00:00Z',technik:'Kostka',email:'k@elzy.cz',pozvat:true});a.equal(ev2.attendees.length,1);a.equal(ev2.transactionId,P.terminUdalost({zak:'W1',od:'2026-11-25T08:00:00Z'}).transactionId,'stejný případ a termín = jedna událost');
a.throws(function(){P.terminUdalost({od:'x'})},/začátek/);
a.equal(P.smiZapsat({},{od:'2026-11-25T08:00:00Z',technik:'K'}).ok,false,'bez potvrzení zákazníkem se nezapíše');
a.equal(P.smiZapsat({obhlidkaPlan:true},{od:'2026-11-25T08:00:00Z',technik:'K'}).ok,true);a.equal(P.smiZapsat({},{od:'2026-11-25T08:00:00Z',zkusebne:true}).ok,true);a.equal(P.smiZapsat({obhlidkaPlan:true},{od:'2026-11-25T08:00:00Z'}).ok,false,'bez technika ne');
console.log('proces 0.72 OK')})();
