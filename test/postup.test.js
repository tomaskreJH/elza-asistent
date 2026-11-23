/* Postupy (B15): rozhodování řetězu agentů a vynucená kontrola. Spuštění: node test/postup.test.js */
var M={};global.window={localStorage:{getItem:function(k){return k in M?M[k]:null},setItem:function(k,v){M[k]=String(v)}}};
global.document={readyState:'loading',addEventListener(){},getElementById(){return null},querySelector(){return null},createElement(){return{style:{},setAttribute(){},appendChild(){}}},body:{appendChild(){}}};
require('../ochrana.js');
global.OCHRANA=window.OCHRANA;require('../ulohy.js');var P=window.ULOHY_PR,bad=0;
function t(c,m){if(!c){bad++;console.log('CHYBA',m)}}
var c={stav:'bezi',krok:0,kroky:[{k:0},{k:1},{k:1}]};
t(P.rozhodni(c,null)=='cekat','bez úlohy čeká');
t(P.rozhodni(c,{Stav:'Nová'})=='cekat','úloha běží');
t(P.rozhodni(c,{Stav:'K schválení'})=='schvalit-dal','krok bez kontroly naváže sám');
c.krok=1;t(P.rozhodni(c,{Stav:'K schválení'})=='cekat','krok s kontrolou čeká na člověka');
t(P.rozhodni(c,{Stav:'Schváleno'})=='dal','po schválení další krok');
t(P.rozhodni(c,{Stav:'Zamítnuto'})=='zastavit','zamítnutí zastaví postup');
c.krok=2;t(P.rozhodni(c,{Stav:'K schválení'})=='cekat','poslední krok se nikdy neschvaluje automaticky');
t(P.rozhodni(c,{Stav:'Schváleno'})=='hotovo','po schválení posledního kroku je hotovo');
t(P.rozhodni({stav:'zastaveno'},null)=='nic','zastavený postup se nehýbe');
var u=P.uprav([{a:'AG-POSTA',t:'Shrň',z:'Shrň poštu',k:0},{a:'AG-VYVOJ',t:'',z:'prázdný název'},{a:'AG-POSTA',t:'Napiš',z:'Napiš návrh',k:0}]);
t(u.length==2,'prázdný krok se vynechá');t(u[1].k==1,'poslední krok má kontrolu vždy');
var r=P.uprav([{a:'AG-POSTA',t:'Objednej',z:'Objednej detektory a zaplať fakturu',k:0},{a:'AG-POSTA',t:'Shrň',z:'Shrň',k:0},{a:'AG-POSTA',t:'Konec',z:'Konec',k:0}]);
t(r[0].k==1,'citlivé zadání (platba) má kontrolu vždy');t(r[1].k==0,'běžný krok bez kontroly zůstane bez kontroly');
if(bad)process.exit(1);console.log('postup OK');
