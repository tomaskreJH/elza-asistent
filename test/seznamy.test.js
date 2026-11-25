const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

async function check(scriptMode) {
 const origin = "https://sp.test";
 const lists = {};
 const writes = [];
 let failField = "Milnik";
 let forbidRead = false;
 let dropIndex = false;
 const ctx = vm.createContext({
  URL, SP:origin, acc:{}, location:{origin, search:""}, esc:String,
  m:{acquireTokenSilent:async () => ({accessToken:"demo"})}
 });
 ctx.window = ctx;
 ctx.PRO = {role:"vlastnik"};
 const fields = vm.runInContext(fs.readFileSync("test/fixtures/sharepoint-fields.js","utf8")+"\nschemaFixture()",ctx);
 ctx.fetch = async (url, options = {}) => {
  const body = options.body && JSON.parse(options.body);
  if (forbidRead) return {ok:false, status:403};
  if (url.endsWith("/lists") && options.method === "POST") {
   lists[body.Title] = true;
   writes.push("list");
   return {ok:true};
  }
  if (url.includes("/fields") && options.method === "POST") {
   assert.ok(scriptMode ? options.headers["X-RequestDigest"] : options.headers.Authorization);
   if (failField && body.Title === failField) return {ok:false, status:500};
   writes.push(body.Title || "index");
   if (dropIndex && body.Indexed) return {ok:true};
  }
  return fields(url, options, lists) || {ok:true,json:async () => ({ItemCount:3})};
 };
 vm.runInContext(fs.readFileSync("seznamy.js","utf8"),ctx);
 const repair = () => scriptMode ? vm.runInContext(ctx.SEZ.skript(["Ukol"]),ctx) : ctx.SEZ.create(["Ukol"]);
 await assert.rejects(repair(), /Ukol.*Milnik.*500/);
 assert.equal(writes.filter(w => w === "ZavisiNa").length,1);
 let html = await ctx.MODS.seznamy[0]();
 assert.match(html, /Milnik/);
 failField = null;
 await repair();
 const row = (await ctx.SEZ.stav()).find(r => r.l === "Ukol");
 assert.equal(row.ok,true);
 assert.equal(row.n,3);
 const other = () => scriptMode ? vm.runInContext(ctx.SEZ.skript(["Tym"]),ctx) : ctx.SEZ.create(["Tym"]);
 dropIndex = true;
 await assert.rejects(other(), /Tym.*schéma po zápisu není úplné/);
 dropIndex = false;
 await other();
 assert.equal((await ctx.SEZ.stav()).find(r => r.l === "Tym").ok,true);
 const before = writes.length;
 await repair();
 assert.equal(writes.length,before);
 assert.equal(writes.filter(w => w === "list").length,2);
 forbidRead = true;
 html = await ctx.MODS.seznamy[0]();
 assert.match(html,/nebylo možné ověřit/);
 assert.doesNotMatch(html,/Schéma všech seznamů je úplné/);
 await assert.rejects(repair(), /403/);
 assert.equal(writes.length,before);
}
(async () => { await check(false); await check(true); console.log("seznamy OK"); })().catch(error => {console.error(error); process.exitCode=1;});
