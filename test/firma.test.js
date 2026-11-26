const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ctx = vm.createContext({window:{},setTimeout(){}});
const source = fs.readFileSync("firma.js","utf8");
vm.runInContext(source.replace("window.MODS=window.MODS||{};", "window.testFirma={diffCompanies,body}; window.MODS=window.MODS||{};"), ctx);
const {diffCompanies,body}=ctx.window.testFirma;
const original={Id:7,Title:"firma",Firma_Nazev:"Název",Firma_Email:"test@example.test",Firma_Misto:"Tábor",RowNo:1};
let plan=diffCompanies([{...original,RowNo:90}],[original]);
assert.equal(plan.ch.length,0);
plan=diffCompanies([{...original,Firma_Email:null,Firma_Misto:"Brno"}],[original]);
assert.equal(plan.ch.length,1);
assert.equal(plan.ch[0].id,7);
assert.deepEqual(JSON.parse(JSON.stringify(plan.ch[0].b)),{
 __metadata:{type:"SP.Data.FirmaListItem"},Firma_Email:"",Firma_Misto:"Brno"
});
assert.deepEqual(JSON.parse(JSON.stringify(plan.fields)),{Firma_Email:1,Firma_Misto:1});
assert.equal(diffCompanies([{...original,Firma_Deleted:false}],[{...original,Firma_Deleted:true}]).ch[0].b.Firma_Deleted,false);
assert.equal(diffCompanies([],[original]).gone.length,1);
assert.equal(Object.hasOwn(body(original),"RowNo"),false);
console.log("firma OK");
