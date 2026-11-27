// Test Průběhu komunikace (čistá logika). Spuštění: node test/vlakno.test.js
var a=require('assert'),V=require('../vlakno.js');
a.equal(V.role('Jusko@elzy.cz'),'ředitel');a.equal(V.role('elzy@elzy.cz'),'společná schránka (recepce)');a.equal(V.role('x@makro.cz'),'zákazník / externí');a.equal(V.role('novy@elzy.cz'),'kolega ELZY');
var m=function(d,f,t,b){return{receivedDateTime:d,from:{emailAddress:{address:f,name:'N'}},toRecipients:[{emailAddress:{address:t}}],bodyPreview:b}};
var p=V.prehled([m('2026-11-13T14:01','x@makro.cz','hamernik@elzy.cz','Dobrý den\r\nFrom: stará'),m('2026-09-14T13:30','elzy@elzy.cz','jusko@elzy.cz','FW')]);
a.equal(p[0].role,'společná schránka (recepce)');a.equal(p[1].text,'Dobrý den');a.equal(V.souhrn(p).pocet,2);a.equal(V.prvniExterniOdesilatel([m('','elzy@elzy.cz','','FW'),m('','X@MAKRO.CZ','','Dotaz'),m('','jiny@firma.cz','','Další')]),'x@makro.cz');
a.equal(V.prvniExterniOdesilatel([m('','x@elzycz.onmicrosoft.com','','FW')]),'');
/* 0.88.0: bodovaná shoda */
const mk=[{id:'A',nazev:'ZDP Makro České Budějovice',klice:'@makro.cz'},{id:'B',nazev:'Servis EPS Makro Praha',klice:'@makro.cz'},{id:'C',nazev:'Stará věc Makro Brno',klice:'@makro.cz',uzavreny:true}];
const vs=V.vazbaSkore({text:'Obhlídka v Českých Budějovicích',predmet:'Makro České Budějovice',adresa:'x@makro.cz'},mk);
a.equal(vs[0].id,'A');a.ok(vs[0].skore>vs[1].skore,'název rozhoduje mezi případy stejné firmy');a.ok(vs.every(c=>c.id!=='C'||c.skore<vs[0].skore),'uzavřený má postih');
a.equal(V.vazbaPripadu({text:'cokoliv',adresa:'x@makro.cz',uceni:{'x@makro.cz':{w:'B',v:'pripad',n:2}}},mk).id,'B','dříve potvrzené rozhodnutí');
a.equal(V.vazbaPripadu({text:'Dobrý den, posíláme podklady',adresa:'novy@jina.cz',adresy:['kolega@makro.cz','novy@jina.cz']},[{id:'K',nazev:'X',klice:'kolega@makro.cz'}]).id,'K','další účastník vlákna');
a.equal(V.vazbaPripadu({text:'text',adresa:'x@gmail.com'},[{id:'G',nazev:'Něco',klice:'@gmail.com'}]).stav,'bez','volná doména nestačí');
a.equal(V.vazbaPripadu({text:'bez vazby',adresa:'x@nikdo.cz'},mk).stav,'bez');
const pr=V.ucastnici([{from:{emailAddress:{address:'A@Makro.cz'}},toRecipients:[{emailAddress:{address:'hamernik@elzy.cz'}}],ccRecipients:[{emailAddress:{address:'b@makro.cz'}}]}]);a.deepEqual(pr,['a@makro.cz','b@makro.cz']);
a.equal(V.vazbaPripadu({text:'poznámka',adresa:'q@neznamy.cz',poznamka:'patří k Servis EPS Praha'},mk).id,'B','poznámka člověka');
console.log('vlakno OK');
const cases=[
 {id:'WORK-20261124-0001',espo:'PR001401',zak:'Z-2026-100',klice:'@makro.cz; OBJ02666'},
 {id:'WORK-20261125-0002',espo:'PR001402',klice:'@makro.cz'},
 {id:'WORK-20261119-0001',espo:'PR001403',klice:'@makro.cz; OBJ02666',uzavreny:true}
];
a.equal(V.vazbaPripadu({text:'PR001402'},cases,cases[0].id).id,cases[0].id);
a.equal(V.vazbaPripadu({text:'PR001401',adresa:'x@makro.cz'},cases).stav,'kod');
a.equal(V.vazbaPripadu({text:'Z-2026-100'},cases).id,cases[0].id);
a.equal(V.vazbaPripadu({text:'PR001401 a PR001402'},cases).stav,'vice');
a.equal(V.vazbaPripadu({text:'OBJ02666'},cases).stav,'mozna');
a.equal(V.vazbaPripadu({text:'porucha',adresa:'x@makro.cz'},cases).moznosti.length,2);
a.equal(V.vazbaPripadu({text:'PR0014011'},cases).stav,'bez');
a.equal(V.vazbaPripadu({text:'porucha'},null).stav,'nedostupne');
const espoSubject='Byli jste zmíněni ve streamu případu ZDP Makro ČB';
a.equal(V.vazbaPripadu({predmet:espoSubject},[{id:'W1',aliasy:['ZDP Makro CB']}]).id,'W1');
a.equal(V.vazbaPripadu({predmet:espoSubject},[{id:'W1',aliasy:['ZDP Makro CB']}]).stav,'mozna');
a.equal(V.vazbaPripadu({predmet:espoSubject},[]).stav,'espo');
