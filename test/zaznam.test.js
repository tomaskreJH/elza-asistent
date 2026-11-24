// Test záznamu činnosti (čistá logika). Spuštění: node test/zaznam.test.js
var a=require('assert'),Z=require('../zaznam.js');
var z=Z.novy({zak:'W1',zakaznik:'MAKRO',obj:'obj00012',pr:'pr000345',druh:'servis',tech:['EPS'],popis:'Stará ústředna nefunguje, zákazník se ptá na kamery a BOZP školení.',min:45});
var pl=Z.fotoPlan(Z.novy({obj:'OBJ00012',pr:'PR000345',druh:'servis'}),[{name:'a.JPG'},{name:'b.jpeg'}],'2026-11-25');
a.equal(pl.length,2);a.ok(/^OBJ00012\/Podklady objektu\/Fotodokumentace-z-cinnosti$/.test(pl[0].rel),pl[0].rel);a.ok(/^OBJ00012_foto_cinnost_servis-01_v1_2026-11-25\.jpg$/.test(pl[0].name),pl[0].name);a.ok(/servis-02/.test(pl[1].name));
var ob=Z.fotoPlan(Z.novy({obj:'OBJ00012',pr:'PR000345',druh:'obhlidka'}),[{name:'a.jpg'}],'2026-11-25');a.ok(/^OBJ00012\/PR000345\/2 Pracovní\//.test(ob[0].rel)&&/foto_obhlidka_foto-01/.test(ob[0].name),'obhlídka zůstává ve staré složce');
var zk=Z.fotoPlan(Z.novy({obj:'OBJ00012',druh:'servis',zdroj:'zakaznik'}),[{name:'x.png'}],'2026-11-25');a.ok(/Fotky-a-podklady-od-zakaznika/.test(zk[0].rel)&&/foto_zakaznik/.test(zk[0].name));
a.throws(function(){Z.fotoPlan(Z.novy({druh:'servis'}),[{name:'a.jpg'}])},/kód objektu/);
var p=Z.prilezitosti(z.popis);var typy=p.map(function(x){return x.typ});a.ok(typy.some(function(t){return /Kamerov/.test(t)})&&typy.some(function(t){return /BOZP/.test(t)})&&typy.some(function(t){return /Modernizace/.test(t)}),typy.join('|'));
a.equal(Z.prilezitosti('Vše v pořádku, protokol podepsán.').length,0);
var u=Z.ulohaPrilezitost(p[0],z);a.ok(/Příležitost/.test(u.Title)&&/Radim/.test(u.Poznamka)&&u.Resitel==='','úkol obchodu, ne Tomášovi');
var m=Z.manifest(z,[{nazev:'a.jpg'}]);a.equal(m.schema,'elza-zaznam-1');a.equal(m.fotky.length,1);a.ok(m.prilezitosti.length>=3);
var f=Z.manifestSoubor(z,'2026-11-25');a.ok(/^OBJ00012\/Podklady objektu\/Zaznamy-cinnosti$/.test(f.rel)&&/\.json$/.test(f.name),f.rel+' '+f.name);
var r=Z.radek(Z.novy({zak:'W1',obj:'OBJ00012',druh:'servis',tech:['EPS','PZTS'],popis:'kamery',min:30,ulozeno:4}),'c');a.equal(r.Fotek,4);a.equal(r.Technologie,'EPS, PZTS');
var an=Z.analyza([r,Z.radek(Z.novy({druh:'servis',tech:['EPS'],popis:'ok',min:60}))]);a.equal(an.celkem,2);a.equal(an.druh.servis.prumMin,45);a.equal(an.tech.EPS,2);a.equal(an.bezFotek,1);a.ok(an.prilezitosti['Kamerové systémy (CCTV)']==1);
console.log('zaznam OK');
