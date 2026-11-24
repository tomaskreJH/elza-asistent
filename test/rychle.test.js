/* Rychlá odpověď bez nástrojů, poznatek po běhu a statistiky D25 (0.62.0). Spuštění: node test/rychle.test.js */
var M={};global.window={SEZ:{S:{}}};global.localStorage={getItem:function(k){return k in M?M[k]:null},setItem:function(k,v){M[k]=String(v)},removeItem:function(k){delete M[k]}};
global.acc={username:'tomas@elzy.cz'};global.cache={};global.list=async function(){return[]};global.esc=function(x){return String(x)};
require('../katalog.js');require('../kontext.js');require('../ai.js');var K=window.KTX,A=window.AI,bad=0;function t(c,m){if(!c){bad++;console.log('CHYBA',m)}}
(async function(){
 await K.nacti();
 var h=A.hlavicka('AG-POSTA','');t(/^\[REZIM:rychle\]/.test(h)&&/\[\[tools\]\]/.test(h),'výchozí je rychlá odpověď bez nástrojů');
 t(/^\[REZIM:nastroje\]/.test(A.hlavicka('AG-VYVOJ','')),'vývoj, video a příspěvky jedou rovnou s nástroji');
 t(/^\[REZIM:nastroje\]/.test(A.hlavicka('AG-POSTA','nastroje'))&&/^\[REZIM:rychle\]/.test(A.hlavicka('AG-VYVOJ','rychle')),'ruční volba režimu má přednost');
 t(A.rezimZ(h+'Zadání')=='rychle'&&A.rezimZ('bez značky')=='','čtení režimu ze zadání');
 t(A.eskalace('Potřebuji web.\n[[tools]]')&&!A.eskalace('Hotovo.'),'značka [[tools]] = eskalace');
 t(A.poznatek('Hotovo.\n[[poznatek]] Objekt ZŠ Nová Bystřice má ústřednu v kotelně.')=='Objekt ZŠ Nová Bystřice má ústřednu v kotelně.'&&A.poznatek('bez')=='','čtení poznatku');
 t(A.bezH(h+'Zadání úlohy')=='Zadání úlohy','odstranění hlavičky při eskalaci');
 // poznatek se uloží a dostane ho jen jeho Elzáček a jen k tématu
 t(await K.poznatek('AG-EPS','Objekt ZŠ Nová Bystřice má ústřednu v kotelně.')===true,'poznatek se uloží');
 t(await K.poznatek('AG-EPS','Objekt ZŠ Nová Bystřice má ústřednu v kotelně.')===false,'duplicita se nezapíše');
 t(await K.poznatek('AG-EPS','krátké')===false,'příliš krátký poznatek se nezapíše');
 var b=K.blok('AG-EPS','kontrola ústředny Nová Bystřice');t(/Sdílené poznámky[\s\S]*nedůvěryhodná[\s\S]*kotelně/.test(b),'poznatek je v kontextu označený jako data');
 t(!/kotelně/.test(K.blok('AG-POSTA','kontrola ústředny Nová Bystřice')),'jiný Elzáček poznatek nedostane');
 t(!/kotelně/.test(K.blok('AG-EPS','pozdrav')),'bez tématu se nenačte (šetří limit)');
 t(K.znalostiPro('AG-EPS','Nová Bystřice ústředna').length==0,'poznatek není mezi znalostmi');
 // statistiky D25
 var now=Date.parse('2026-11-24T08:00:00Z'),d=function(n){return new Date(now-n*864e5).toISOString()};
 var R=[{Title:'AG-EPS',Kdy:d(1),Stav:'ok',VstupZnaku:100,VystupZnaku:50},{Title:'AG-EPS',Kdy:d(10),Stav:'chyba',VstupZnaku:10,VystupZnaku:0},{Title:'AG-EPS',Kdy:d(60),Stav:'ok',VstupZnaku:20,VystupZnaku:20},{Title:'AG-OZO',Kdy:d(200),Stav:'ok',VstupZnaku:1,VystupZnaku:1}];
 var S=A.stat(R,now,function(k){return k});t(S.length==1&&S[0].n=='AG-EPS','jen Elzáčci s voláním v posledních 90 dnech');
 var x=S[0].d;t(x[0].v==1&&x[0].ok==1&&x[0].z==150,'7 dní');t(x[1].v==2&&x[1].ok==1&&x[1].z==160,'30 dní');t(x[2].v==3&&x[2].ok==2&&x[2].z==200,'90 dní');
 t(/Úspěšnost a znaky[\s\S]*50 %/.test(A.statTab(R.slice(0,2).map(function(r){r.Kdy=new Date().toISOString();return r}))),'tabulka statistik');
 console.log(bad?'SELHALO '+bad:'OK rychle.test');process.exit(bad?1:0)})();
