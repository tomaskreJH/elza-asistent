// Test hlídání nabídek (čistá logika). Spuštění: node test/nabidky.test.js
var a=require('assert'),N=require('../nabidky.js');
var n={Title:'N1',Stav:'odeslana',Odeslano:'2026-11-01',Pripomenuto:0};
a.equal(N.hlidej(n,'2026-11-05'),null);                       // 4 dny: nic
a.equal(N.hlidej(n,'2026-11-06').stupen,5);                   // 5 dní: první
a.equal(N.hlidej(Object.assign({},n,{Pripomenuto:5}),'2026-11-10'),null); // už připomenuto
a.equal(N.hlidej(Object.assign({},n,{Pripomenuto:5}),'2026-11-15').stupen,14);
a.equal(N.hlidej(n,'2026-12-05').stupen,30);                  // přeskočené stupně: nejvyšší
a.ok(N.hlidej(n,'2026-12-05').uzavrit);a.ok(!N.hlidej(n,'2026-11-06').uzavrit);
a.equal(N.hlidej(Object.assign({},n,{Stav:'odpoved'}),'2026-12-05'),null);
a.equal(N.hlidej({Stav:'odeslana',Odeslano:'blb'},'2026-12-05'),null);
a.equal(N.dnu('2026-11-01','2026-11-06'),5);
// fronta: moje první, pak nejstarší
var f=N.fronta([{Title:'a',Stav:'odeslana',Odeslano:'2026-10-01',Odpovedny:'x@elzy.cz'},{Title:'b',Stav:'odeslana',Odeslano:'2026-10-20',Odpovedny:'me@elzy.cz'},{Title:'c',Stav:'odeslana',Odeslano:'2026-10-10',Odpovedny:'me@elzy.cz'}],'2026-11-10','ME@elzy.cz');
a.deepEqual(f.map(function(x){return x.n.Title}),['c','b','a']);
a.deepEqual(N.pripomenuto(n,N.hlidej(n,'2026-11-06')),{Pripomenuto:5});a.equal(N.bezOdpovedi('2026-12-01').Stav,'bez_odpovedi');
console.log('nabidky OK');
// následná komunikace (0.75.0): v každém stupni se ověřuje jiná věc a vzniká koncept, nic se neodesílá
var h5=N.hlidej(n,'2026-11-06'),h14=N.hlidej(n,'2026-11-15'),h30=N.hlidej(n,'2026-12-05');
a.equal(h5.kontrola,'přečtení');a.equal(h14.kontrola,'srozumitelnost');a.equal(h30.kontrola,'chybějící informace');
a.ok(/Ověřit: přečtení/.test(h5.text)&&/uzavřít/.test(h30.text));
var k=N.koncept({Title:'N1',Zakazka:'Z-1'},14,'Dobrý den, pane Nováku');a.ok(/N1 \(Z-1\)/.test(k)&&/srozumitelné/.test(k)&&/^Dobrý den, pane Nováku/.test(k));a.equal(N.koncept(n,7),'');
console.log('nabidky následná komunikace OK');
