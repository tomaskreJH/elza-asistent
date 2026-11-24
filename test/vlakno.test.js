// Test Průběhu komunikace (čistá logika). Spuštění: node test/vlakno.test.js
var a=require('assert'),V=require('../vlakno.js');
a.equal(V.role('Jusko@elzy.cz'),'ředitel');a.equal(V.role('elzy@elzy.cz'),'společná schránka (recepce)');a.equal(V.role('x@makro.cz'),'zákazník / externí');a.equal(V.role('novy@elzy.cz'),'kolega ELZY');
var m=function(d,f,t,b){return{receivedDateTime:d,from:{emailAddress:{address:f,name:'N'}},toRecipients:[{emailAddress:{address:t}}],bodyPreview:b}};
var p=V.prehled([m('2026-11-13T14:01','x@makro.cz','hamernik@elzy.cz','Dobrý den\r\nFrom: stará'),m('2026-09-14T13:30','elzy@elzy.cz','jusko@elzy.cz','FW')]);
a.equal(p[0].role,'společná schránka (recepce)');a.equal(p[1].text,'Dobrý den');a.equal(V.souhrn(p).pocet,2);console.log('vlakno OK');
