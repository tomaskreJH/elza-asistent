/* Hranice AI (C18–C22): klasifikace zadání, výchozí režim, záznam a vrácení změn. Spuštění: node test/hranice.test.js */
var M={};global.window={localStorage:{getItem:function(k){return k in M?M[k]:null},setItem:function(k,v){M[k]=String(v)}}};
global.document={readyState:'loading',addEventListener(){},getElementById(){return null},querySelector(){return null},createElement(){return{style:{},setAttribute(){},appendChild(){}}},body:{appendChild(){}}};
require('../ochrana.js');var O=window.OCHRANA,bad=0;
function t(c,m){if(!c){bad++;console.log('CHYBA',m)}}
function ids(x){return O.kategorie(x).map(function(a){return a[0]}).join(',')}
t(ids('Připrav shrnutí vlákna')=='','čisté zadání')
t(/nasazeni/.test(ids('Nasaď verzi na ostro')),'nasazení')
t(/platba/.test(ids('Objednej 10 detektorů a zaplať fakturu')),'platba')
t(/udaje/.test(ids('Použij heslo z poznámky')),'údaje')
t(/prihlaseni/.test(ids('Přihlas se do portálu dodavatele')),'přihlášení')
t(/kontakt/.test(ids('Zavolej dodavateli')),'kontakt')
t(O.rezim('AG-VYVOJ')=='schvalovat','výchozí režim schvalovat');
O.setRezim('AG-VYVOJ','samostatny');t(O.rezim('AG-VYVOJ')=='samostatny','samostatný zapnut');t(O.rezim('AG-POSTA')=='schvalovat','jiný agent beze změny');
O.setRezim('AG-VYVOJ','cokoli');t(O.rezim('AG-VYVOJ')=='schvalovat','neznámá hodnota = schvalovat');
var spl=null;O.regVratit('x',async function(o){spl=o.pred});
O.zmena({t:'x',co:'test',id:1,pred:{Stav:'Nová'}});O.zmena({t:'bez',co:'bez vrácení',id:2});
t(O.zmeny().length==2&&O.zmeny()[0].t=='bez','záznam změn (nejnovější první)');
(async function(){try{await O.vratit(0);bad++;console.log('CHYBA vrácení bez handleru nemá projít')}catch(e){}
 await O.vratit(1);t(spl&&spl.Stav=='Nová','vrácení zavolalo handler');t(!!O.zmeny()[1].vraceno,'změna označena jako vrácená');await O.vratit(1);
 var p;try{O.guardPrompt('Shrň e-mail');p=1}catch(e){}t(p,'guardPrompt projde čistý text');
 if(bad)process.exit(1);console.log('hranice OK')})();
