/* Model podle Úsilí, výchozí nástroj Elzáčků a ukazatele limitů (0.69.0). Spuštění: node test/model.test.js */
var M={};global.window={SEZ:{S:{}}};global.localStorage={getItem:function(k){return k in M?M[k]:null},setItem:function(k,v){M[k]=String(v)},removeItem:function(k){delete M[k]}};
global.acc={username:'tomas@elzy.cz'};global.cache={};global.__R=[];global.list=async function(n){return n=='NastaveniAI'?global.__R:[]};global.esc=function(x){return String(x).replace(/</g,'&lt;')};
require('../katalog.js');require('../kontext.js');require('../ai.js');var A=window.AI,bad=0;function t(c,m){if(!c){bad++;console.log('CHYBA',m)}}
(async function(){
 t(A.modelPodle({e:'n'})=='haiku'&&A.modelPodle({e:'s'})=='sonnet'&&A.modelPodle({e:'v'})=='opus'&&A.modelPodle({})=='sonnet','Úsilí nízké/střední/vysoké = Haiku/Sonnet/Opus');
 var c=await A.cfg('AG-POSTA');t(c.tool=='Claude (předplatné)'&&c.model=='sonnet','výchozí Elzáčci jedou přes Claude (předplatné), model podle Úsilí');
 t(!/Copilot/.test((await A.cfg('AG-VYVOJ')).tool),'vývoj není na Copilotu ani na placeném API');
 var h=A.limityHtml({ok:true,pet:{pct:82,konec:''},tyden:{pct:10,konec:''}});t(/82%/.test(h)&&/10%/.test(h)&&/Claude 5 h/.test(h),'kruhy ukazují procenta');
 t(/nejsou dostupné/.test(A.limityHtml({ok:false}))&&!/>0%</.test(A.limityHtml({ok:false})),'nedostupné limity se neukáží jako nula');
 global.OCHRANA=window.OCHRANA={guardPrompt:function(x){return 'PRAVIDLO\n\n'+x}};var ap=await A.priprav('AG-ELZA',{task:'Co je EPS?',data:'text'});t(/Co je EPS\?/.test(ap.prompt)&&!/undefined/.test(ap.prompt)&&/PRAVIDLO/.test(ap.prompt)&&/<data>text<\/data>/.test(ap.prompt),'zadání se při přípravě neztratí a je obaleno ochranou');
 var za=function(d){return new Date(Date.now()+d*864e5).toISOString()};t(A.prah({pet:{pct:9},tyden:{pct:64,konec:za(5)}})==80,'týden 64 % po 2 dnech předbíhá čas = Haiku');t(A.prah({pet:{pct:9},tyden:{pct:64,konec:za(2)}})==0,'týden 64 % po 5 dnech je v normě');t(A.prah({pet:{pct:96},tyden:{pct:5,konec:za(3)}})==95&&A.prah({pet:{pct:1},tyden:{pct:98,konec:za(1)}})==97,'tvrdé prahy 5 h a týdne');
 /* 0.74.0 priorita voleb: vlastní text > model ze seznamu > dočasně levnější (limit) > předvolba > automatika */
 var rw=function(o){return Object.assign({Id:1,Upn:'tomas@elzy.cz',Agent:'AG-VYVOJ',Nastroj:'Claude (předplatné)',Model:'auto',Poznamka:''},o)};
 global.__R=[];var c0=await A.cfg('AG-VYVOJ');t(c0.model=='sonnet'&&c0.src=='výchozí kód'&&!c0.vlastni,'bez řádku: automatika, zdroj výchozí kód');
 global.__R=[rw({Poznamka:'predvolba=L | x'})];var c1=await A.cfg('AG-VYVOJ');t(c1.model=='opus'&&/předvolba Lepší/.test(c1.src)&&c1.src.indexOf('osobní')==0,'předvolba Lepší = Opus, zdroj osobní');
 global.__R=[rw({Poznamka:'predvolba=U'})];t((await A.cfg('AG-VYVOJ')).model=='haiku','předvolba Levnější = Haiku');
 global.__R=[rw({Poznamka:'predvolba=V'})];t((await A.cfg('AG-VYVOJ')).model=='sonnet','předvolba Vyvážený = Sonnet');
 global.__R=[rw({Model:'opus',Poznamka:'predvolba=U'})];var c2=await A.cfg('AG-VYVOJ');t(c2.model=='opus'&&!c2.vlastni,'model ze seznamu přebíjí předvolbu');
 global.__R=[rw({Model:'muj-model-x',Poznamka:'predvolba=U'})];var c3=await A.cfg('AG-VYVOJ');t(c3.model=='muj-model-x'&&c3.vlastni&&c3.src=='vlastní text','vlastní text přebíjí předvolbu a je označen');
 localStorage.setItem('elzaTok',JSON.stringify({p:'U'}));global.__R=[rw({Poznamka:'predvolba=L'})];var c4=await A.cfg('AG-VYVOJ');t(c4.model=='haiku'&&c4.docasne,'dočasně levnější tok (limit) přebíjí předvolbu');
 global.__R=[rw({Model:'opus'})];t((await A.cfg('AG-VYVOJ')).model=='opus','dočasný tok nepřebíjí výslovný model');
 global.__R=[rw({Model:'muj-model-x'})];t((await A.cfg('AG-VYVOJ')).model=='muj-model-x','dočasný tok nepřebíjí vlastní text');
 global.__R=[rw({Nastroj:'ChatGPT',Model:'auto'})];t((await A.cfg('AG-VYVOJ')).model=='gpt-4o-mini','jiný nástroj: automatika = výchozí model nástroje (dočasný tok se týká jen Claude předplatné)');
 localStorage.removeItem('elzaTok');
 global.__R=[rw({Upn:'*',Poznamka:'predvolba=L'})];var c5=await A.cfg('AG-VYVOJ');t(c5.model=='opus'&&c5.src.indexOf('sdílená volba')==0,'sdílená volba (*) platí pro všechny');
 global.__R=[rw({Upn:'*',Poznamka:'predvolba=L'}),rw({Id:2,Poznamka:'predvolba=U'})];t((await A.cfg('AG-VYVOJ')).model=='haiku','osobní volba má přednost před sdílenou');
 global.__R=[rw({Agent:'AG-POSTA',Poznamka:'predvolba=U'})];t((await A.cfg('AG-POSTA')).tool=='Claude (předplatné)','Levnější bez mostu zůstává u Haiku');
 localStorage.setItem('elzaMostKod','0123456789abcdef0123');var c6=await A.cfg('AG-POSTA');t(c6.tool=='Lokální (Ollama)'&&/předvolba Levnější/.test(c6.src),'Levnější u Elzáčka s ol: lokální Ollama, je-li most spárovaný');t((await A.cfg('AG-VYVOJ')).tool=='Claude (předplatné)','Levnější u vývoje (bez ol) Ollamu nepoužije');localStorage.removeItem('elzaMostKod');
 /* 0.77.0 ChatGPT (Codex) */
 global.__R=[rw({Nastroj:'ChatGPT (Codex)',Model:'auto',Poznamka:'predvolba=L'})];var cx=await A.cfg('AG-VYVOJ');t(cx.tool=='ChatGPT (Codex)'&&cx.model=='výchozí Codexu','Codex: předvolba nemění model, bere se výchozí z Codexu');
 global.__R=[rw({Nastroj:'ChatGPT (Codex)',Model:'gpt-5-codex'})];var cx2=await A.cfg('AG-VYVOJ');t(cx2.model=='gpt-5-codex'&&cx2.vlastni,'Codex: vlastní model se předá a je označen');
 t(A.MODELY('ChatGPT (Codex)').join()=='výchozí Codexu'&&A.CX=='ChatGPT (Codex)','Codex: seznam modelů a název nástroje');
 t(/nejsou dostupné/.test(A.limityCxHtml({ok:false,duvod:'x'}))&&!/>0%</.test(A.limityCxHtml({ok:false})),'Codex: nedostupné limity nejsou nula');
 var hx=A.limityCxHtml({ok:true,pet:{pct:85,konec:'',okno:'5 h'},tyden:{pct:null,konec:'',okno:'7 dní'},stari:'25. 11. 20:00'});t(/85%/.test(hx)&&/nad 80 %/.test(hx)&&/nic se nepřepíná samo/.test(hx)&&/–/.test(hx),'Codex: nad 80 % jen doporučení, prošlé okno je pomlčka');
 global.__R=[];
 t(A.vaha('Claude (předplatné)','opus')==15&&A.vaha('Claude (předplatné)','haiku')==1&&A.vaha('Lokální (Ollama)','x')==0,'váhy spotřeby');
 t(A.MODELY('Claude (předplatné)').join()=='haiku,sonnet,opus'&&A.MODELY('ChatGPT').length==2,'seznam platných modelů pro nástroj');
 global.__R=[];t(A.PV.L=='Lepší'&&A.PV.V=='Vyvážený'&&A.PV.U=='Levnější','tři předvolby');
 var nk=A.nakladyTab([{Title:'AG-POSTA',Kdy:new Date().toISOString(),Stav:'ok',Model:'opus · 100/50 tok · ekv. $0.500'},{Title:'Zkusit',Kdy:new Date().toISOString(),Stav:'ok',Model:'opus · 9/9 tok'}]);t(/Analýza pošty/.test(nk)&&/150/.test(nk)&&/0\.50/.test(nk)&&/5× limitu/.test(nk)&&!/Zkusit/.test(nk.replace(/Zkoušky tlačítkem Zkusit/,'')),'přehled nákladů: tokeny a ekvivalent z AI záznamu, zkoušky mimo, tip zlevnění');
 var pnl=A.tokPanel({pet:85,tyden:40});t(/Přepnout na levnější/.test(pnl)&&/data-aitok=on/.test(pnl)&&/Nic se nepřepíná samo/.test(pnl),'doporučení při limitu nad 80 % je jedním klepnutím a nic nepřepíná samo');
 console.log(bad?'SELHALO':'model OK');process.exit(bad?1:0)})();
