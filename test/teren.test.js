// Test Terénního režimu (čistá logika). Spuštění: node test/teren.test.js
var a=require('assert'),T=require('../teren.js');
var s=T.nova('Z-1','MAKRO');a.equal(T.stav(s).hotovo,0);a.ok(T.stav(s).chybiPovinne.length>=5);
s.odp.vstup='ano';s.odp.dokum='ne';s.odp.kontakty='ne';s.fotek=4;
a.equal(T.stav(s).hotovo,1);a.deepEqual(T.chybi(s).length,2);
var z=T.zprava(s,'Jan Kostka');a.ok(/MAKRO/.test(z)&&/4 fotograf/.test(z)&&/Dokumentace/.test(z)&&/Jan Kostka/.test(z));
a.ok(!/Dokumentace/.test(T.zprava(T.nova(),'x')));console.log('teren OK');
// fotky: plán uložení
var st=T.nova('W1','MAKRO');st.obj='OBJ00012';st.pr='PR000345';var pl=T.fotoPlan(st,[{name:'IMG_1.JPG'},{name:'b.jpeg'}],'2026-11-25');
a.equal(pl.length,2);a.ok(/^OBJ00012\/PR000345\/.+/.test(pl[0].rel));a.ok(/^OBJ00012_PR000345_foto_obhlidka_foto-01_v1_2026-11-25\.jpg$/.test(pl[0].name));a.ok(/foto-02/.test(pl[1].name)&&/\.jpg$/.test(pl[1].name));
a.throws(function(){T.fotoPlan(T.nova('x','y'),[{name:'a.jpg'}])},/kód objektu/);console.log('teren foto OK');
