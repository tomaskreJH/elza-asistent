// Audit vazeb (0.71.0): menu ↔ moduly ↔ Návod ↔ boot ↔ stable. Spuštění: node tools/audit.js (jen čte, nic nemění)
var fs=require('fs'),r=[],src={};fs.readdirSync('.').filter(n=>/\.js$/.test(n)).forEach(n=>src[n]=fs.readFileSync(n,'utf8'));
var all=Object.values(src).join('\n'),app=src['app.js'];
var menu=[...app.matchAll(/\["([a-z0-9_]+)","([^"]+)"\]/g)].map(m=>m[1]).filter(i=>!/^-?\d/.test(i)&&!/^_/.test(i));
var mods=new Set([...all.matchAll(/MODS\.([a-z0-9_]+)\s*=/g)].map(m=>m[1]).concat([...all.matchAll(/MODS\[["']([a-z0-9_]+)["']\]\s*=/g)].map(m=>m[1])));
var dup={};menu.forEach(i=>dup[i]=(dup[i]||0)+1);Object.keys(dup).filter(i=>dup[i]>1).forEach(i=>r.push('Menu: duplicitní položka '+i));
var guide=[...(src['centrum.js']||'').matchAll(/mod:'([a-z0-9_]+)'/g)].map(m=>m[1]);
guide.forEach(g=>{if(!mods.has(g)&&menu.indexOf(g)<0)r.push('Návod: modul '+g+' nemá registraci')});
var boot=src['boot.js']||'',L=(/var L=\[([^\]]*)\]/.exec(boot)||[,''])[1].match(/"[a-z0-9_]+"/g)||[];L=L.map(x=>x.slice(1,-1));
L.forEach(n=>{if(!src[n+'.js'])r.push('boot: chybí soubor '+n+'.js');else if(!fs.existsSync('stable/'+n+'.js')||fs.readFileSync('stable/'+n+'.js','utf8')!=src[n+'.js'])r.push('stable se liší: '+n+'.js')});
Object.keys(src).filter(n=>!/^(msal-browser|portal|portal\.html)/.test(n)).forEach(n=>{var b=n.slice(0,-3);if(L.indexOf(b)<0&&!/^(app|boot|demo|pruvodce|portal|mobil|vzhled)$/.test(b)&&!/pripady|roadmapa|graf|chat|posta|kalendar|ulohy|nocni|ai|katalog|kontext/.test(b))r.push('Soubor '+n+' není v seznamu boot.js')});
menu.forEach(i=>{if(!mods.has(i)&&!new RegExp("['\"]"+i+"['\"]").test(all.replace(app,'')))r.push('Menu: '+i+' nemá modul (ověřit ručně)')});
var ver=/VER="([^"]+)"/.exec(app)[1];[['index.html'],['boot.js']].forEach(f=>{var v=[...new Set((fs.readFileSync(f[0],'utf8').match(/\?v=\d+/g)||[]))];if(v.length>2)r.push(f[0]+': různé ?v= '+v.join(','))});
console.log('Verze',ver,'| menu',menu.length,'| moduly',mods.size,'| Návod',guide.length);console.log(r.length?r.join('\n'):'Audit: bez nálezů');
