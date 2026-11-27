const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

async function run(path) {
  const data = new Map();
  const acc = { username: 'technik@example.test' };
  const localStorage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, val) => data.set(key, val),
    removeItem: key => data.delete(key),
  };
  const window = {};
  vm.runInNewContext(fs.readFileSync(path, 'utf8'), { window, acc, localStorage, SP: '' });
  window.kontextPripaduProPostu = async () => ({
    vazby: { A: 'WORK-1' },
    pripady: [{ id: 'WORK-1', cislo: 1, nazev: 'Objekt' }],
  });
  const from = { emailAddress: { address: 'kolega@example.test' } };
  const a = { id: '1', conversationId: 'A', from };
  const b = { id: '2', conversationId: 'B', from };
  const editor = window.POSTAZAR;
  editor.popis(a, 'První poznámka');
  assert.equal((await editor.stav(b)).popis, '');
  assert.equal((await editor.stav({ ...a, id: '3' })).popis, 'První poznámka');
  assert.equal((await editor.stav(a)).w, 'WORK-1');
  editor.popis(a, 'Opraveno');
  assert.equal((await editor.stav(a)).popis, 'Opraveno');
  acc.username = 'obchod@example.test';
  assert.equal((await editor.stav(a)).popis, '');
  acc.username = 'technik@example.test';
  editor.popis(a, '');
  assert.equal((await editor.stav(a)).popis, '');
  /* 0.87.1: stará poznámka u odesílatele se nabídne, dokud vlákno nemá vlastní; vlastní má přednost */
  localStorage.setItem('elzaUceni', JSON.stringify({ 'stary@example.test': { p: 'Hodnocení: nechtěná poptávka', v: 'ne' } }));
  const s = { id: '9', conversationId: 'S', from: { emailAddress: { address: 'Stary@Example.test' } } };
  assert.equal(editor.ctiPoznamku(s), 'Hodnocení: nechtěná poptávka');
  assert.equal(editor.jeStara(s), true);
  editor.popis(s, 'Nová k vláknu');
  assert.equal(editor.ctiPoznamku(s), 'Nová k vláknu');
  assert.equal(editor.jeStara(s), false);
}

Promise.all(['pripady.js', 'stable/pripady.js'].map(run)).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
