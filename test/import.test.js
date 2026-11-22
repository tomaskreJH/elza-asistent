// Test importu z Excelu: node test/import.test.js (z kořene repozitáře)
const fs=require('fs'),assert=require('assert');
const s=fs.readFileSync('plan.js','utf8');
const code=s.slice(s.indexOf('var IF={'),s.indexOf('async function hlidac'));
const T=new Function(code+';return{parseImp,pdate,fld}')();
let R=T.parseImp('Kontrola','Název\tTechnologie\tPerioda\tTermín\tOdpovědný\nEPS revize\tEPS-1\t12\t31.12.2026\tNovák');
assert.deepStrictEqual(R,[{Title:'EPS revize',Technologie:'EPS-1',PeriodaMesice:12,PristiTermin:'2026-12-31T12:00:00Z',Odpovedny:'Novák'}]);
R=T.parseImp('Smlouva','Název;Zákazník;Od;Do\nS1;ACME;2026-01-01;2027-01-01');assert.strictEqual(R[0].Zakaznik,'ACME');
assert.throws(()=>T.parseImp('Kontrola','Název\tTermín\nX\t99'),/Neplatné/);
assert.throws(()=>T.parseImp('Ukol','Řešitel\nX'),/Název/);
assert.throws(()=>T.parseImp('Ukol','Název'),/záhlaví/);
console.log('import ok');
