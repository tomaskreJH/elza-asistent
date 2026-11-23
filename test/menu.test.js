// Test skládání sdíleného menu: node test/menu.test.js (z kořene repozitáře)
const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('app.js','utf8'),cx=fs.readFileSync('centrum.js','utf8');
const MENU=eval(html.match(/const MENU=(\[.*?\]\]\]);/s)[1]+'');
const code=cx.slice(cx.indexOf('var BASE=null'),cx.indexOf('var mo0=window.menuOff'));
const f=new Function('MENU',code+';return{norm0,build,applyCfg,baseMenu}');
const T=f(MENU),ids=g=>g.it.filter(i=>i[0][0]!='-').map(i=>i[0]);
const base=JSON.stringify(MENU);
// 1 výchozí = původní
let G=T.build(T.norm0());assert.deepStrictEqual(G.map(g=>g.n),JSON.parse(base).map(g=>g[0]));
// 2 pořadí skupin
G=T.build(T.norm0({ord:['AI','Moje práce']}));assert.strictEqual(G[0].n,'AI');assert.strictEqual(G[1].n,'Moje práce');
// 3 pořadí položek, zamčená 'dnes' zůstane první
G=T.build(T.norm0({iord:['dnes','posta','rano','kalendar']}));assert.deepStrictEqual(ids(G[0]).slice(0,3),['dnes','posta','rano']);
// 4 přesun do nové skupiny, zamčené se nehýbou
G=T.build(T.norm0({grp:{trh:'Nová',dnes:'Nová'}}));assert.ok(G.find(g=>g.n=='Nová').it.some(i=>i[0]=='trh'));assert.ok(!G.find(g=>g.n=='Nová').it.some(i=>i[0]=='dnes'));
// 5 poškozená/cizí data se ignorují
const c=T.norm0({hide:['x',1,'trh'],grp:{nic:'A',trh:5},ord:'blb',iord:[null,'trh']});
assert.deepStrictEqual(c.hide,['trh']);assert.deepStrictEqual(c.grp,{});assert.deepStrictEqual(c.ord,[]);assert.deepStrictEqual(c.iord,['trh']);
assert.doesNotThrow(()=>T.norm0(null));assert.doesNotThrow(()=>T.norm0('x'));
// 6 přejmenování + prázdná skupina se nezobrazí
T.applyCfg(T.norm0({ren:{'AI':'Umělá inteligence'}}));assert.ok(MENU.some(g=>g[0]=='Umělá inteligence'));
console.log('menu OK');
// 7 editor: vykreslení a šipky
const ed=cx.slice(cx.indexOf('var ED=null'),cx.indexOf('window.MODS=window.MODS'));
let went=0,mn={};
const g=new Function('MENU','window','esc','document','localStorage','go','nav','cfgSave','confirm',code+';var CFG=norm0(),LOCK=LOCK;'+ed+';return{menuEd,menuEdM,getED:()=>ED}');
const win={PRO:{role:'vlastnik'}};
const E=g(MENU,win,s=>String(s),{getElementById:i=>i=='main'?mn:{}},{getItem:()=>null,setItem(){},removeItem(){}},()=>went++,()=>{},async()=>{},()=>true);
let h=E.menuEd();assert.ok(h.includes('data-gu')&&h.includes('data-iu')&&h.includes('Uložit pro všechny'));
E.menuEdM();
const click=async d=>{const el={dataset:d,closest:q=>q.split(',').some(s=>d[s.replace(/\[data-|\]/g,'')]!==undefined)||q=='[data-cs]'&&false?el:null};await mn.onclick({target:el})};
(async()=>{await click({gd:'0'});let o=E.getED().ord;assert.strictEqual(o[1],'Moje práce');
await click({id:'pripady'});let io=E.getED().iord;assert.ok(io.indexOf('pripady')>io.indexOf('analyza'),'pripady za analyza');assert.strictEqual(io[0],'dnes');
console.log('editor OK')})();
