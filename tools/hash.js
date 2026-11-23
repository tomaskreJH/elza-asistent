// Vytvoří integrity.json (otisky SHA-256 souborů aplikace). Spouští se při každém nasazení: node tools/hash.js
var fs=require('fs'),c=require('crypto'),f={},ver=(/const VER="([^"]+)"/.exec(fs.readFileSync('app.js','utf8'))||[])[1];
['index.html','portal.html','pruvodce.html','portal.js','msal-browser.min.js'].concat(fs.readdirSync('.').filter(n=>/\.js$/.test(n)&&n!='portal.js'&&n!='msal-browser.min.js'),fs.readdirSync('stable').filter(n=>/\.js$/.test(n)).map(n=>'stable/'+n)).forEach(function(n){f[n]=c.createHash('sha256').update(fs.readFileSync(n)).digest('hex')});
fs.writeFileSync('integrity.json',JSON.stringify({ver:ver,d:new Date().toISOString(),f:f},null,1));console.log('integrity.json',ver,Object.keys(f).length,'souborů');
