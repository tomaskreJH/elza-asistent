/* Noční fronta (0.69.0). Spuštění: node test/nocni.test.js */
global.window={SEZ:{S:{}}};global.localStorage={getItem:function(){return null},setItem:function(){}};require('../nocni.js');var N=window.NOC,bad=0;function t(c,m){if(!c){bad++;console.log('CHYBA',m)}}
t(N.patri({Stav:'ceka',Stanice:'PC1'},'PC1')&&N.patri({Stav:'ceka',Stanice:'*'},'PC2')&&!N.patri({Stav:'ceka',Stanice:'PC1'},'PC2')&&!N.patri({Stav:'predano',Stanice:'*'},'PC2'),'úloha patří jen své stanici nebo libovolné, a jen ve stavu čeká');
var u=N.ulohaZ({Id:7,Data:JSON.stringify({tool:'ollama',model:'qwen3.5:4b',system:'S',prompt:'P'})});t(u&&u.id=='nf7'&&u.tool=='ollama'&&u.prompt=='P','převod řádku na úlohu mostu');
t(N.ulohaZ({Id:1,Data:'{rozbité'})===null&&N.ulohaZ({Id:1,Data:'{}'})===null,'vadná data se přeskočí');
t(N.ulohaZ({Id:2,Data:JSON.stringify({tool:'x',prompt:'P'})}).tool=='claude','neznámý nástroj = claude');
t(N.idZ('nf12')==12&&N.idZ('jine')==0,'id z mostu zpět na řádek');
var ps=require('fs').readFileSync(__dirname+'/../tools/elza-most.ps1','utf8').split('\n').filter(function(l){return !/^\s*function /.test(l)});
t(!ps.some(function(l){return /\b(NactiFrontu|NactiNast|VNoci|Limity|MaClaude|MaOllamu|UlozFrontu|Nocni)\(\)/.test(l)}),'PowerShell: funkce se volají bez závorek');
console.log(bad?'SELHALO':'nocni OK');process.exit(bad?1:0);
