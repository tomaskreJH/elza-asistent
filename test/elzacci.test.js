/* Elzáčci podle rolí (B11–B14): galerie, balíček role, líné načítání postupů, návrh z věty. Spuštění: node test/elzacci.test.js */
var M={};global.window={SEZ:{S:{}}};global.localStorage={getItem:function(k){return k in M?M[k]:null},setItem:function(k,v){M[k]=String(v)},removeItem:function(k){delete M[k]}};
global.acc={username:'tomas@elzy.cz'};global.cache={};global.list=async function(){return[]};global.esc=function(x){return String(x)};global.document={getElementById(){return null},head:{appendChild(){}},createElement(){return{}}};
require('../ai.js');var A=window.AI,bad=0;function t(c,m){if(!c){bad++;console.log('CHYBA',m)}}
(async function(){
 await A.nacti();t(A.agents.length==6,'základní Elzáčci bez změny');
 t(A.presets.length==7&&['Kancelář','Obchod','Data','Technika'].every(function(g){return A.presets.some(function(p){return p.g==g})}),'galerie má 4 skupiny a 7 rolí');
 await A.pridejPre('AG-EPS');await A.nacti(true);var e=A.agents.filter(function(a){return a.id=='AG-EPS'})[0];t(e&&e.c&&e.sk.length==2,'balíček role přidán včetně postupů');
 t(A.moji().length==1,'moji Elzáčci (zatím jen prohlížeč)');await A.pridejPre('AG-EPS');await A.nacti(true);t(A.agents.filter(function(a){return a.id=='AG-EPS'}).length==1,'dvojí přidání nevytvoří duplicitu');
 var b=A.blok('AG-EPS','Připrav kontrolu EPS pro objekt školy');t(/Pravidelná kontrola EPS – U každé kontroly EPS/.test(b),'agent vidí název a kdy');t(/Načtené postupy[\s\S]*Příprava: objekt, ústředna/.test(b),'postup se načte při shodě tématu');t(!/Příprava: objekt[\s\S]*## Protokol/.test(b)&&!/## Protokol a závady/.test(b),'nesouvisející postup se nenačte');
 var b2=A.blok('AG-EPS','Napiš zdvořilý pozdrav');t(!/Načtené postupy/.test(b2)&&/Postupy \(název/.test(b2),'bez shody jen názvy (šetří limit)');
 t(A.blok('AG-POSTA','cokoli')==='','vestavěný Elzáček bez pokynů nic nepřidá');
 var n=A.parseNavrh('Tady je návrh: {"n":"Hlídač revizí","g":"Nesmysl","d":"d","p":"p","sk":[{"n":"Termíny","kdy":"ráno","k":"revize","t":"kroky"},{"n":"","t":"x"}]} konec','věta');t(n.n=='Hlídač revizí'&&n.g=='Kancelář'&&n.sk.length==1,'návrh z věty: JSON z textu, neznámá skupina, prázdný postup zahozen');
 var f=A.parseNavrh('není json','Hlídej platnost revizí u zakázek každé ráno');t(f.n&&f.p=='Hlídej platnost revizí u zakázek každé ráno','bez JSONu návrh z věty');
 await A.odeber('AG-EPS');t(A.moji().length==0&&A.agents.length==6,'odebrání Elzáčka');
 if(bad)process.exit(1);console.log('elzacci OK')})();
