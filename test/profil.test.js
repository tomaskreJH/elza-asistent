const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

async function test(file) {
  const acc = { username: 'kolega@example.test' };
  const window = {};
  let down = true;
  let calls = 0;
  const technician = { Upn: acc.username, Role: 'technik', Modules: 'teren,zakazky,chat', Active: true, PruvodceHotov: 'ano' };
  let users = [technician];
  const context = {
    window, acc, tok: 'test',
    list: async name => {
      calls++;
      if (down) throw new Error('SharePoint nedostupný');
      if (name === 'RoleAplikace') return [
        { Title: 'technik', Nazev: 'Technik', Moduly: 'teren,kalendar,zakazky' },
        { Title: 'ostatni', Nazev: 'Základní', Moduly: '' },
      ];
      if (name === 'Uživatelé') return users;
      return [];
    },
  };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
  assert.equal(window.hide('zakazky'), true);
  await Promise.all([window.profilInit(), window.profilInit()]);
  assert.equal(calls, 3);
  assert.equal(window.PRO.stav, 'nedostupny');
  assert.equal(window.hide('zakazky'), true);
  down = false;
  await window.profilInit();
  assert.equal(window.PRO.role, 'technik');
  assert.equal(window.hide('dnes'), false);
  assert.equal(window.hide('teren'), false);
  assert.equal(window.hide('chat'), true);
  assert.equal(window.hide('kalendar'), true);
  assert.equal(JSON.stringify(window.pracovniPlocha().links.map(row => row[0])), '["teren","zakazky"]');
  technician.Active = false;
  window._prDone = false;
  await window.profilInit();
  assert.equal(window.PRO.stav, 'neaktivni');
  assert.equal(window.hide('posta'), true);
  assert.equal(window.hide('pruvodce'), true);
  users = [{ Upn: acc.username, Role: 'vlastnik' }];
  window._prDone = false;
  await window.profilInit();
  assert.equal(window.PRO.stav, 'nedostupny');
  assert.equal(window.hide('sprava'), true);
  users = [];
  acc.username = 'novy@example.test';
  await window.profilInit();
  assert.equal(window.PRO.role, 'ostatni');
  assert.equal(window._first, true);
  assert.equal(window.hide('zakazky'), true);
  context.tok = 'demo';
  window.PRO = null;
  assert.equal(window.hide('zakazky'), false);
}
Promise.all(['ucet.js', 'stable/ucet.js'].map(test)).then(() => console.log('Pracovní profily OK')).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
