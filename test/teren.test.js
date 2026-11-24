// Test Terénního režimu (čistá logika). Spuštění: node test/teren.test.js
var a=require('assert'),T=require('../teren.js');
var s=T.nova('Z-1','MAKRO');a.equal(T.stav(s).hotovo,0);a.ok(T.stav(s).chybiPovinne.length>=5);
s.odp.vstup='ano';s.odp.dokum='ne';s.odp.kontakty='ne';s.fotek=4;
a.equal(T.stav(s).hotovo,1);a.deepEqual(T.chybi(s).length,2);
var z=T.zprava(s,'Jan Kostka');a.ok(/MAKRO/.test(z)&&/4 fotograf/.test(z)&&/Dokumentace/.test(z)&&/Jan Kostka/.test(z));
a.ok(!/Dokumentace/.test(T.zprava(T.nova(),'x')));console.log('teren OK');
