var R=require('../rano.js'),A=require('../analyza.js'),ok=0;function t(c,m){if(!c){console.log('CHYBA',m);process.exit(1)}ok++}
var p=R.predPD(new Date(2026,10,23));t(p.getDay()==5&&p.getDate()==20,'pondělí -> pátek');t(R.predPD(new Date(2026,10,24)).getDate()==23,'úterý -> pondělí');
var m=[{id:'1',conversationId:'c1',subject:'Poptávka PCO',bodyPreview:'Prosíme o cenu připojení EPS na PCO, objekt OBJ12345',from:{emailAddress:{name:'Novák',address:'n@x.cz'}}},{id:'2',conversationId:'c2',subject:'Oběd',bodyPreview:'dnes v 12',from:{emailAddress:{address:'a@x.cz'}}},{id:'3',conversationId:'c3',subject:'Poptávka',bodyPreview:'cena eps',from:{emailAddress:{address:'zla@bad.cz'}}},{id:'4',conversationId:'c1',subject:'Re: Poptávka PCO',bodyPreview:'eps',from:{emailAddress:{address:'n@x.cz'}}}];
var k=R.zpracuj(m,A,function(a){return a=='zla@bad.cz'});t(k.length==1,'jedna karta, blokovaný a nepoptávka vynechány, vlákno bez duplicity');t(k[0].obj=='OBJ12345'&&k[0].tech.indexOf('EPS')>=0,'OBJ a EPS');t(/Předpoklad|Cenu/.test(k[0].predpoklady.join(' ')),'předpoklady');
console.log('rano.test OK',ok)
// 0.72.0: automatické založení případu ze společné schránky
;(function(){var R=require('../rano.js');function t(c,m){if(!c){console.log('CHYBA',m);process.exit(1)}}
var karty=[{cid:'a',schranka:'elzy@elzy.cz',adresa:'n@x.cz'},{cid:'b',schranka:'elzy@elzy.cz',adresa:'m@x.cz'},{cid:'c',adresa:'o@x.cz'},{cid:'d',schranka:'elzy@elzy.cz',adresa:'elzy@elzy.cz'},{cid:'e',schranka:'elzy@elzy.cz',adresa:'p@x.cz'}];
var v=R.autoVyber(karty,{b:'W1'},5);t(v.map(function(x){return x.cid}).join()=='a,e','jen nové z elzy@, bez vlastní adresy a bez už založených');
t(R.autoVyber(karty,{},1).length==1,'strop na jeden běh');t(R.autoVyber([],{},5).length==0,'prázdné');console.log('rano auto OK')})();
