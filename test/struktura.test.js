// Test nové souborové struktury a analýzy vstupu (čistá logika). Spuštění: node test/struktura.test.js
var assert=require('assert');var S=require('../struktura.js');global.STRUKTURA=S;var A=require('../analyza.js');
// cesty: trvalé dokumenty u objektu, ostatní u zakázky
assert.equal(S.slozka({obj:'OBJ02664',pr:'PR001399',typ:'vykres_sk'}),'OBJ02664/PR001399/3b Skutečné provedení/Vykresy-skutecneho-provedeni');
assert.equal(S.slozka({obj:'OBJ02664',typ:'revize'}),'OBJ02664/Kontroly/Revizni-zprava');
assert.throws(function(){S.slozka({obj:'X',pr:'PR001399',typ:'tz'})});assert.throws(function(){S.slozka({obj:'OBJ02664',typ:'tz'})});assert.throws(function(){S.slozka({obj:'OBJ02664',pr:'PR001399',typ:'nic'})});
// název a zpětné parsování, i s malým písmem v popisu
var n=S.nazev({obj:'OBJ02664',pr:'PR001399',typ:'vykres_sk',popis:'Výměna NVR',pripona:'PDF',datum:'2026-11-23',verze:2});assert.equal(n,'OBJ02664_PR001399_vykres_sk_Vymena-NVR_v2_2026-11-23.pdf');
var p=S.parse('OBJ02664_PR001399_vykres_sk_vymena-nvr_v2_2026-11-23.pdf');assert.equal(p.typ,'vykres_sk');assert.equal(p.popis,'vymena-nvr');assert.equal(p.verze,2);
assert.equal(S.parse('OBJ02664_revize_Revizni-zprava_v1_2026-11-23.pdf').pr,'');assert.equal(S.parse('nahodny nazev.pdf'),null);
// návrh typu starých názvů
assert.equal(S.navrhTypu('TZ_Dodatek k PBŘ.pdf'),'tz');assert.equal(S.navrhTypu('Revizní zpráva EPS.pdf'),'revize');assert.equal(S.navrhTypu('xyz.pdf'),'');
// povinné dokumenty
assert.deepEqual(S.chybi('realizace',['zadani','bozp','vykres_sk','tz_sk','foto_real','navod','predavaci']),[]);assert.ok(S.chybi('realizace',['zadani']).indexOf('predavaci')>=0);
// rozpoznání
var k=A.klasifikuj('Nová PZTS a kamery v přístavbě ZŠ, napojení na PCO, objekt OBJ02661');assert.equal(k.druh,'realizace');assert.equal(k.obj,'OBJ02661');assert.equal(k.stav,'nová poptávka');assert.ok(k.tech.map(function(x){return x.kod}).indexOf('PZTS')>=0);
assert.equal(A.klasifikuj('Porucha komunikace, nefunguje ústředna PR001300').druh,'servis');assert.equal(A.klasifikuj('PR001300 kontrola EPS').stav,'existující zakázka');assert.equal(A.klasifikuj('nic').jistota,'žádná');
// návrh: kvalifikace a upozornění
var nv=A.navrh('Pravidelná kontrola EPS Esser',A.knihovna(),{lide:[{n:'Jan',sk:['OZO PO']},{n:'Petr',sk:[]}]});assert.equal(nv.kval[0].kval,'OZO PO');assert.deepEqual(nv.kval[0].kdo,['Jan']);assert.ok(nv.varovani.some(function(v){return /schválení/.test(v)}));
// učení: pod prahem nic, nad prahem návrh, schválení = nová verze a stará zůstává
var z=[];for(var i=0;i<2;i++)z.push({postup:'kontrola',krok:'k4',akce:'upraveno',text:'Nový text'});assert.equal(A.navrhyVylepseni(A.knihovna(),z).length,0);z.push({postup:'kontrola',krok:'k4',akce:'upraveno',text:'nový text'});
var v=A.navrhyVylepseni(A.knihovna(),z);assert.equal(v.length,1);assert.equal(v[0].n,3);var p0=A.knihovna().filter(function(x){return x.id=='kontrola'})[0],old=p0.kroky[3].text,np=A.schval(p0,v[0],'Tomáš','2026-11-23');
assert.equal(np.verze,2);assert.equal(np.historie.length,1);assert.equal(np.historie[0].kroky[3].text,old);assert.notEqual(np.kroky[3].text,old);assert.equal(p0.verze,1);assert.equal(A.knihovna([np]).filter(function(x){return x.id=='kontrola'})[0].verze,2);
// kroky navíc a vynechané
var z2=[1,2,3].map(function(){return{postup:'servis',krok:'',akce:'pridano',text:'Zavolat zákazníkovi'}});assert.equal(A.navrhyVylepseni(A.knihovna(),z2)[0].typ,'pridat');
var z3=[1,2,3].map(function(){return{postup:'servis',krok:'s1',akce:'vynechano'}});assert.equal(A.navrhyVylepseni(A.knihovna(),z3)[0].typ,'nepovinny');
console.log('struktura a analýza OK');

var pl=S.plan({obj:'OBJ02664',pr:'PR001399',druh:'kontrola'});assert.ok(pl.indexOf('OBJ02664/PR001399/1 Vstup')>=0&&pl.indexOf('OBJ02664/Provoz')>=0&&pl.indexOf('OBJ02664/Kontroly/Protokol-o-kontrole-nebo-zkousce')>=0);assert.throws(function(){S.plan({obj:'x',pr:'PR001399'})});console.log('plan OK');
var d=S.navrhDavky([{name:'TZ_Dodatek k PBŘ.pdf',src:'/sites/X/a/TZ.pdf',datum:'2024-05-02T10:00:00Z'},{name:'foto1.jpg',src:'/sites/X/a/f.jpg'},{name:'Revizní zpráva.pdf',src:'/sites/X/a/r.pdf',datum:'2025-01-10'}],{obj:'OBJ02664',pr:'PR001399'},0,25);
assert.equal(d.length,3);assert.equal(d[0].typ,'tz');assert.equal(d[0].cil,'OBJ02664/PR001399/3a Pro provedení/Technicka-zprava/OBJ02664_PR001399_tz_TZ-Dodatek-k-PBR_v1_2024-05-02.pdf');assert.ok(d[1].chyba&&!d[1].cil);assert.equal(d[2].role,'Kontroly');
assert.equal(S.navrhDavky([{name:'foto1.jpg',typ:'foto_real',datum:'2025-02-01'}],{obj:'OBJ02664',pr:'PR001399'})[0].role,'3b Skutečné provedení');assert.equal(S.navrhDavky(new Array(30).fill({name:'a.pdf'}),{obj:'OBJ02664',pr:'PR001399'},25,25).length,5);console.log('davka OK');
