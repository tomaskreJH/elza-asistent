/* Model podle Úsilí, výchozí nástroj Elzáčků a ukazatele limitů (0.69.0). Spuštění: node test/model.test.js */
var M={};global.window={SEZ:{S:{}}};global.localStorage={getItem:function(k){return k in M?M[k]:null},setItem:function(k,v){M[k]=String(v)},removeItem:function(k){delete M[k]}};
global.acc={username:'tomas@elzy.cz'};global.cache={};global.list=async function(){return[]};global.esc=function(x){return String(x).replace(/</g,'&lt;')};
require('../katalog.js');require('../kontext.js');require('../ai.js');var A=window.AI,bad=0;function t(c,m){if(!c){bad++;console.log('CHYBA',m)}}
(async function(){
 t(A.modelPodle({e:'n'})=='haiku'&&A.modelPodle({e:'s'})=='sonnet'&&A.modelPodle({e:'v'})=='opus'&&A.modelPodle({})=='sonnet','Úsilí nízké/střední/vysoké = Haiku/Sonnet/Opus');
 var c=await A.cfg('AG-POSTA');t(c.tool=='Claude (předplatné)'&&c.model=='sonnet','výchozí Elzáčci jedou přes Claude (předplatné), model podle Úsilí');
 t(!/Copilot/.test((await A.cfg('AG-VYVOJ')).tool),'vývoj není na Copilotu ani na placeném API');
 var h=A.limityHtml({ok:true,pet:{pct:82,konec:''},tyden:{pct:10,konec:''}});t(/82%/.test(h)&&/10%/.test(h)&&/Claude 5 h/.test(h),'kruhy ukazují procenta');
 t(/nejsou dostupné/.test(A.limityHtml({ok:false}))&&!/>0%</.test(A.limityHtml({ok:false})),'nedostupné limity se neukáží jako nula');
 global.OCHRANA=window.OCHRANA={guardPrompt:function(x){return 'PRAVIDLO\n\n'+x}};var ap=await A.priprav('AG-ELZA',{task:'Co je EPS?',data:'text'});t(/Co je EPS\?/.test(ap.prompt)&&!/undefined/.test(ap.prompt)&&/PRAVIDLO/.test(ap.prompt)&&/<data>text<\/data>/.test(ap.prompt),'zadání se při přípravě neztratí a je obaleno ochranou');
 console.log(bad?'SELHALO':'model OK');process.exit(bad?1:0)})();
