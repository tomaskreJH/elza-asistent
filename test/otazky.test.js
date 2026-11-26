// Test otevřených otázek zákazníka (čistá logika). Spuštění: node test/otazky.test.js
var a=require('assert'),O=require('../otazky.js');
var t='Dobrý den,\n\nmáme zájem o připojení 10 objektů.\n1. Jaká je cena připojení na PCO?\n2) Prosím zašlete vzor smlouvy\n- Bude potřeba obhlídka?\n> Kdy to půjde? (citace se nečte)\nKdy můžete přijet? Děkuji.\nS pozdravem\nNovák';
a.deepEqual(O.extrahuj('• potvrzení termínu obhlídky\n• specifikaci podkladů pro nabídku').map(x=>x.q),['potvrzení termínu obhlídky','specifikaci podkladů pro nabídku']);
var q=O.extrahuj(t);a.deepEqual(q.map(function(x){return x.q}),['Jaká je cena připojení na PCO?','Prosím zašlete vzor smlouvy','Bude potřeba obhlídka?','Kdy můžete přijet?'],JSON.stringify(q));
a.equal(O.extrahuj('Ano?\nOk.').length,0,'krátké věty nejsou otázky');
a.equal(O.extrahuj('Kdy to půjde?\nKdy to půjde?').length,1,'duplicity se slučují');
a.equal(O.nove([{id:q[0].id}],q).length,3);
// pracovní dny: pátek → pondělí = 1, pátek → úterý = 2, víkend se nepočítá
a.equal(O.pracDny('2026-11-20T10:00:00Z','2026-11-23T10:00:00Z'),1);a.equal(O.pracDny('2026-11-20T10:00:00Z','2026-11-24T10:00:00Z'),2);a.equal(O.pracDny('2026-11-21T10:00:00Z','2026-11-22T10:00:00Z'),0);
var p1=O.polozka(q[0],'W1','2026-11-20T10:00:00Z'),p2=O.polozka(q[1],'W1','2026-11-24T08:00:00Z');
var z=O.zpozdene([p1,p2],'2026-11-25T10:00:00Z');a.deepEqual(z.map(function(x){return x.id}),[p1.id],'jen starší než 2 pracovní dny');
a.ok(O.pripomenoutHovor([p1],'W1'));a.ok(!O.pripomenoutHovor([p1],'W2'));
a.throws(function(){O.zodpovez(p1,'  ','tk','2026-11-25')},/odpověď/);
var h=O.zodpovez(p1,'Cena je v nabídce.','tk@elzy.cz','2026-11-25T11:00:00Z','telefon');a.equal(h.Stav,'zodpovezena');a.equal(h.odpKanal,'telefon');
a.equal(O.zpozdene([h],'2026-11-30T10:00:00Z').length,0,'zodpovězená se nehlásí');a.ok(!O.pripomenoutHovor([h],'W1'));
var s=O.shrnuti([h,p2],'W1','Dobrý den, pane Nováku');a.ok(/Cena je v nabídce/.test(s)&&!/vzor smlouvy/.test(s),'jen zodpovězené');a.equal(O.shrnuti([p2],'W1'),'');
var r=O.naZaznam(h);a.equal(r.Druh,'otazka');a.ok(/^otazka:W1:/.test(r.Klic));var b=O.zZaznamu(r);a.equal(b.q,h.q);a.equal(b.odp,h.odp);a.equal(b.Stav,'zodpovezena');a.equal(O.zZaznamu({Druh:'trideni'}),null);
(async function(){
 var fs=require('fs'),vm=require('vm'),rows=[],fail=true;
 var ctx={document:{},SEZ:{S:{ZnalostElza:[]}},SDL:{
  demo:()=>false,def:()=>{},read:async()=>rows.slice(),
  write:async(list,id,row)=>{if(id){Object.assign(rows.find(x=>x.Id===id),row);return}if(fail&&rows.length){fail=false;throw new Error('simulovany vypadek')}rows.push({...row,Id:rows.length+1})}
 }};
 ctx.window=ctx;
 vm.runInNewContext(fs.readFileSync(require.resolve('../otazky.js'),'utf8'),ctx);
 var otazky=ctx.OTAZKY,podklady=q.slice(0,2).map(x=>({...x,od:'2026-11-20T10:00:00Z'}));
 await a.rejects(otazky.ulozZPosty('W1',podklady),/simulovany/);
 a.equal(await otazky.ulozZPosty('W1',podklady),1);
 a.equal(await otazky.ulozZPosty('W1',podklady),0);
 a.equal(await otazky.ulozZPosty('W2',[podklady[0]]),1);
 a.equal(rows.length,3);
 a.ok(await otazky.cekaNaOdpoved('W1'));
 a.ok(!(await otazky.cekaNaOdpoved('W3')));
 var polozka=otazky.zZaznamu(rows[0]),id=polozka.Id;
 await otazky.ulozOdpoved(polozka,'Odpoved 1','telefon','tester');
 await otazky.ulozOdpoved(polozka,'Opravena odpoved','e-mail','tester');
 a.equal(rows.length,3);
 a.equal(rows[0].Id,id);
 a.equal(otazky.zZaznamu(rows[0]).odp,'Opravena odpoved');
 a.equal(otazky.zZaznamu(rows[0]).odpKanal,'e-mail');
 a.match(await otazky.boxPripadu('W1'),/Opravena odpoved/);
 await a.rejects(otazky.ulozOdpoved({},'test','telefon','tester'),/ZnalostElza/);
 console.log('otazky OK');
})().catch(function(error){console.error(error);process.exitCode=1});
