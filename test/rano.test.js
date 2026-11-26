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
(function(){var R=require('../rano.js'),n=0;function t(c,m){if(!c){console.log('FAIL',m);process.exit(1)}n++}
var k={adresa:'jan@firma.cz',cid:'c1',obj:'OBJ0012',pr:'',chybi:['adresa objektu']},seznam=[{id:'WORK-1',zak:'PR1',nazev:'Firma Praha',klice:'@firma.cz'},{id:'WORK-2',zak:'',nazev:'Jiná',klice:'jine@x.cz'}];
t(R.navrhShoda(k,seznam,{},{c1:'WORK-9'}).druh=='existujici','vlákno už má případ');
t(R.navrhShoda(k,seznam,{},{}).druh=='shoda'&&R.navrhShoda(k,seznam,{},{}).w=='WORK-1','shoda podle domény');
t(R.navrhShoda(k,seznam,{'jan@firma.cz':{v:'ne',n:2}},{}).druh=='ne','naučeno ne-případ');
t(R.navrhShoda(k,seznam,{'jan@firma.cz':{v:'pripad',w:'WORK-2',n:1}},{}).w=='WORK-2','naučené zařazení má přednost před shodou');
t(R.navrhShoda({adresa:'a@gmail.com',cid:'x'},[{id:'W',nazev:'g',klice:'@gmail.com'}],{},{}).druh=='novy','volná doména se nepoužije jako shoda');
t(R.navrhShoda({adresa:'a@nova.cz',cid:'x'},seznam,{},{}).ok==0,'bez shody je k ověření, nic se nedomýšlí');
t(R.navrhShoda({adresa:'a@firma.cz',cid:'x'},seznam.concat([{id:'WORK-3',nazev:'dvojí',klice:'@firma.cz'}]),{},{}).druh=='vice','více shod vyžaduje výběr');
t(/vyžádat/.test(R.doporuceni(k)),'doporučení uvádí chybějící');console.log('rano návrhy OK ('+n+')')})();
// 0.73.1: nastavení ranní analýzy
;(function(){var R=require('../rano.js');function t(c,m){if(!c){console.log('CHYBA',m);process.exit(1)}}
var o={model:'claude',hotovo:'07:30',doba:{claude:240}},r=R.rnStart(o,'claude',new Date(2026,10,24,20,0));
t(r.hotovo.getDate()==25&&r.hotovo.getHours()==7&&r.hotovo.getMinutes()==30,'hotovo je příští ráno');t(r.start<r.hotovo&&(r.hotovo-r.start)==960000,'start = 1,5× doba + 10 min před koncem');
t(R.rnStart(o,'claude',new Date(2026,10,25,6,0)).hotovo.getDate()==25,'před 7:30 platí dnešek');
t(R.rnZmer({doba:{claude:240}},'claude',480).doba.claude==320,'doba se průměruje');
t(R.rnModel({model:'auto'},{claude:1})=='claude'&&R.rnModel({model:'auto'},{lokalni:1})=='lokalni'&&R.rnModel({model:'auto'},{})=='pravidla'&&R.rnModel({model:'lokalni'},{})=='lokalni','výběr modelu');console.log('rano nastavení OK')})();
{
 const assert=require('node:assert/strict'), R=require('../rano.js');
 const den=(h,m)=>new Date(2026,10,26,h,m,0);
 const event=(h1,m1,h2,m2,showAs)=>({start:{dateTime:den(h1,m1).toISOString()},end:{dateTime:den(h2,m2).toISOString()},showAs});
 assert.equal(R.oknoPosty([event(8,0,9,17,'busy'),event(9,0,11,0,'free')],den(8,12)).start.getTime(),den(9,20).getTime());
 assert.equal(R.oknoPosty([],den(16,36)),null);
 assert.match(R.duvodPriority('Havárie v objektu','','normal'),/Naléhavost/);
 assert.equal(R.duvodPriority('Newsletter','', 'high'),'');
}
