/* Profil firmy, Znalosti s oprávněním a náhled kontextu (0.61.0). Spuštění: node test/kontext.test.js */
var M={};global.window={SEZ:{S:{}}};global.localStorage={getItem:function(k){return k in M?M[k]:null},setItem:function(k,v){M[k]=String(v)},removeItem:function(k){delete M[k]}};
global.acc={username:'tomas@elzy.cz'};global.cache={};global.list=async function(){return[]};global.esc=function(x){return String(x)};
require('../katalog.js');require('../kontext.js');require('../ai.js');var K=window.KTX,A=window.AI,bad=0;function t(c,m){if(!c){bad++;console.log('CHYBA',m)}}
(async function(){
 await K.nacti();var p=K.profilText();t(/Profil firmy[\s\S]*Tón: Vykáme/.test(p)&&/Zakázané fráze/.test(p),'výchozí profil firmy');
 await K.pridej({n:'Poplach na PCO',a:'AG-EPS',k:'poplach pco',t:'Ověř spojení a volej technika.'});
 await K.pridej({n:'Fakturace',a:'*',k:'faktura',t:'Splatnost 14 dní.'});
 t(K.znalostiPro('AG-EPS','Přišel poplach z PCO').length==1,'znalost jen pro povoleného Elzáčka a téma');
 t(K.znalostiPro('AG-POSTA','Přišel poplach z PCO').length==0,'jiný Elzáček znalost nedostane');
 t(K.znalostiPro('AG-POSTA','Zkontroluj fakturu').length==1,'* = všichni');
 t(K.znalostiPro('AG-EPS','pozdrav').length==0,'bez tématu se znalost nenačte (šetří limit)');
 var b=K.blok('AG-EPS','poplach na pco');t(/Poplach na PCO[\s\S]*Ověř spojení/.test(b),'blok obsahuje text znalosti');
 t(K.kontrolaFrazi('Garantujeme termín').length==1,'kontrola zakázaných frází');
 await K.ulozProfil({ton:'Tykáme.',zakazane:[],faq:[],kontakty:''});t(/Tón: Tykáme/.test(K.profilText()),'uložení profilu');
 var z=K.data().zn[0];await K.vyrad(z.id);t(K.data().zn.length==1,'vyřazení znalosti');
 t(K.potreba('AG-ELZA')===false,'bez prohlížeče se náhled neotevírá (testy, pozadí)');
 if(bad)process.exit(1);console.log('kontext OK')})();
