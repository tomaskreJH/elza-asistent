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
