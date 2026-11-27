// 0.88.0: poznámky k vláknu se ukládají trvale do ZnalostElza a načtou se na jiném zařízení; ze sdílené poznámky se učí odesílatel.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
async function zarizeni(server, ucet) {
  const data = new Map();
  const localStorage = { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: k => data.delete(k) };
  const ucen = [];
  const SDL = { demo: () => false, def() {}, read: async (l, f) => server.filter(z => !f || z.Druh === 'poznamka_posty'), write: async (l, id, b) => { if (id) Object.assign(server.find(z => z.Id === id), b); else server.push(Object.assign({ Id: server.length + 1 }, b)); } };
  const window = { SDL, SEZ: { S: { ZnalostElza: [] } }, UCENI: { popis: (a, p) => ucen.push([a, p]) } };
  vm.runInNewContext(fs.readFileSync('pripady.js', 'utf8'), { window, acc: { username: ucet }, localStorage, SP: '' });
  window.kontextPripaduProPostu = async () => ({ vazby: {}, pripady: [] });
  return { P: window.POSTAZAR, localStorage, ucen };
}
(async () => {
  const server = [];
  const x = { id: '1', conversationId: 'CONV-A', subject: 'Poptávka Makro', from: { emailAddress: { address: 'Nekdo@Makro.cz' } } };
  const a = await zarizeni(server, 'tkrejci@elzy.cz');
  a.P.popis(x, 'Hodnocení: patří k ZDP Makro');
  await new Promise(r => setTimeout(r, 50));
  assert.equal(server.length, 1, 'uloženo na server');
  assert.equal(server[0].Druh, 'poznamka_posty'); assert.equal(server[0].Stav, 'aktivni'); assert.equal(server[0].Kdo, 'tkrejci@elzy.cz');
  assert.deepEqual(a.ucen[0], ['nekdo@makro.cz', 'Hodnocení: patří k ZDP Makro'], 'učení u odesílatele');
  a.P.popis(x, 'Opraveno'); await new Promise(r => setTimeout(r, 50));
  assert.equal(server.length, 1, 'úprava přepíše stejný záznam, nevznikne duplicita'); assert.match(server[0].Text, /Opraveno/);
  const b = await zarizeni(server, 'tkrejci@elzy.cz');
  assert.equal(b.P.ctiPoznamku(x), '', 'na novém zařízení zatím prázdné');
  await b.P.stav(x);
  assert.equal(b.P.ctiPoznamku(x), 'Opraveno', 'po načtení ze serveru je poznámka tady');
  const c = await zarizeni(server, 'jiny@elzy.cz'); await c.P.stav(x);
  assert.equal(c.P.ctiPoznamku(x), '', 'cizí účet cizí poznámku nevidí');
  a.P.popis(x, ''); await new Promise(r => setTimeout(r, 50));
  assert.equal(server[0].Stav, 'vyrazeno', 'smazání = vyřazeno, záznam zůstává');
  console.log('poznamka-trvale OK');
})().catch(e => { console.error(e); process.exitCode = 1; });
