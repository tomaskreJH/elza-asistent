/* ELZA Asistent: Synchronizace firem. Zdroj ciselnik_firma (Implementace365, plní ho SQL) se JEN ČTE. Zapisuje se výhradně do seznamu Firma na webu ZakazkyELZA. Klíč = Title (GUID). */
(function(){
var SRC,DST,LS="firmaSnapshot",LA="firmaAuto",LR="firmaLast";
var F=["Firma_Kod","Firma_Nazev","Firma_Email","Firma_ICO","Firma_Misto","Firma_PSC","Firma_Ulice"],SEL="Id,Title,Firma_Deleted,"+F.join(",");
var ST={};function init(){SRC=SP+"/sites/Implementace365";DST=SP+"/sites/ZakazkyELZA"}
function lst(site,l){return site+"/_api/web/lists/getbytitle('"+l+"')"}
async function rd(site,l){init();await token(false);var u=lst(site,l)+"/items?$select="+SEL+"&$top=5000&$orderby=Id",a=[];while(u){var r=await fetch(u,{headers:{Authorization:"Bearer "+tok,Accept:"application/json;odata=nometadata"}});if(!r.ok)throw new Error(l+": HTTP "+r.status);var j=await r.json();a=a.concat(j.value);u=j["odata.nextLink"]||j["@odata.nextLink"]||null}return a}
function nv(v){return v==null?"":String(v)}
function metadata(){return {__metadata:{type:"SP.Data.FirmaListItem"}}}
function patch(source,target){
 var out={};
 F.forEach(function(k){if(nv(source[k])!==nv(target[k]))out[k]=nv(source[k])});
 if(!!source.Firma_Deleted!==!!target.Firma_Deleted)out.Firma_Deleted=!!source.Firma_Deleted;
 return out;
}
function body(s){var b=Object.assign(metadata(),{Title:s.Title,Firma_Deleted:!!s.Firma_Deleted});F.forEach(function(k){b[k]=nv(s[k])});return b}
function diffCompanies(s,t){
 var targets=new Map(t.map(x=>[x.Title,x])), seen=new Set(), nw=[],ch=[],fields={};
 s.forEach(function(x){
  seen.add(x.Title);
  var old=targets.get(x.Title);
  if(!old){nw.push(x);return}
  var delta=patch(x,old), names=Object.keys(delta);
  if(!names.length)return;
  names.forEach(function(k){fields[k]=(fields[k]||0)+1});
  ch.push({id:old.Id,b:Object.assign(metadata(),delta)});
 });
 return {s:s,t:t,nw:nw,ch:ch,gone:t.filter(x=>!seen.has(x.Title)&&!x.Firma_Deleted),fields:fields};
}
async function wtok(){var W=[SP+"/AllSites.Write"];try{return(await m.acquireTokenSilent({scopes:W,account:acc})).accessToken}catch(e){return(await m.acquireTokenPopup({scopes:W,account:acc})).accessToken}}
async function batch(reqs,t){init();var bid="batch_"+crypto.randomUUID(),cid="changeset_"+crypto.randomUUID(),b="--"+bid+"\r\nContent-Type: multipart/mixed; boundary="+cid+"\r\n\r\n";
 reqs.forEach(function(q){var u=q.id?lst(DST,"Firma")+"/items("+q.id+")":lst(DST,"Firma")+"/items";if(u.indexOf(DST+"/")!=0)throw new Error("Zápis je povolen jen do ZakazkyELZA.");b+="--"+cid+"\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\n"+(q.id?"MERGE":"POST")+" "+u+" HTTP/1.1\r\nContent-Type: application/json;odata=verbose\r\nAccept: application/json;odata=verbose\r\n"+(q.id?"IF-MATCH: *\r\n":"")+"\r\n"+JSON.stringify(q.b)+"\r\n\r\n"});
 b+="--"+cid+"--\r\n--"+bid+"--\r\n";var r=await fetch(DST+"/_api/$batch",{method:"POST",headers:{Authorization:"Bearer "+t,"Content-Type":"multipart/mixed; boundary="+bid,Accept:"application/json;odata=verbose"},body:b});var x=await r.text();if(!r.ok||/HTTP\/1\.1 [45]\d\d/.test(x))throw new Error("Dávka selhala: HTTP "+r.status+" "+x.slice(0,160))}
async function compare(){init();var a=await Promise.all([rd(SRC,"ciselnik_firma"),rd(DST,"Firma")]);return diffCompanies(a[0],a[1])}
function stability(s){var o={};try{o=JSON.parse(localStorage.getItem(LS)||"null")}catch(e){}if(!o||!o.rows)return null;var old={};o.rows.forEach(function(r){old[r[1]]=r});var n=0,gone=0,idd=0,md=0,cur={};s.forEach(function(x){cur[x.Title]=1;var r=old[x.Title];if(!r)n++;else{if(r[0]!=x.Id)idd++}});Object.keys(old).forEach(function(k){if(!cur[k])gone++});return{at:o.at,nove:n,zmizelo:gone,zmenaId:idd,pocet:o.rows.length}}
function snap(s){try{localStorage.setItem(LS,JSON.stringify({at:new Date().toISOString(),rows:s.map(function(x){return[x.Id,x.Title,x.Firma_Kod,nv(x.Firma_Nazev).length]})}))}catch(e){}}
async function sync(c,log){var s=c.s.length,t=c.t.length;if(s<5||s<t*0.5)throw new Error("Zdroj má jen "+s+" záznamů (cíl "+t+"). Zřejmě probíhá nahrávání ze SQL, synchronizace se pro jistotu nespustila.");var shod=s-c.nw.length;if(t>0&&shod<t*0.5)throw new Error("Klíče (Title) se shodují jen u "+shod+" z "+t+" záznamů ve Firma. Synchronizace se pro jistotu nespustila, protože by vytvořila duplicity.");var tk=await wtok(),reqs=[];c.nw.forEach(function(x){reqs.push({b:body(x)})});reqs=reqs.concat(c.ch);c.gone.forEach(function(o){reqs.push({id:o.Id,b:Object.assign(metadata(),{Firma_Deleted:true})})});
 for(var i=0;i<reqs.length;i+=100){await batch(reqs.slice(i,i+100),tk);log("Zapsáno "+Math.min(i+100,reqs.length)+" z "+reqs.length)}localStorage.setItem(LR,new Date().toISOString());return reqs.length}
async function firmy(){var H1="<h1>Synchronizace firem</h1>";
 if(!acc)return H1+"<p>Přihlaste se firemním účtem.</p>";
 try{var c=await compare();ST.c=c;var sb=stability(c.s);var auto=localStorage.getItem(LA)=="1";
  var out=H1+"<p class=note>Zdroj plní SQL a aplikace do něj nikdy nezapisuje. Zapisuje se jen do seznamu Firma na webu Zakázky ELZA. Klíč záznamu je Title (GUID). U existující firmy se zapíšou jen změněné údaje. RowNo se nepřenáší.</p><div class=grid><div class=card><h3>Zdroj</h3><b>"+c.s.length+"</b></div><div class=card><h3>Firma (kopie)</h3><b>"+c.t.length+"</b></div><div class=card><h3>K přidání</h3><b>"+c.nw.length+"</b></div><div class=card><h3>K aktualizaci</h3><b>"+c.ch.length+"</b></div><div class=card><h3>Ve zdroji zmizelo</h3><b>"+c.gone.length+"</b></div></div>"
  +(Object.keys(c.fields).length?"<p class=note>Změny podle polí: "+Object.entries(c.fields).map(function(x){return esc(x[0].replace("Firma_",""))+" ("+x[1]+")"}).join(" · ")+"</p>":"")
  +"<h3>Stabilita zdroje od posledního otisku</h3><p>"+(sb?"Otisk z "+new Date(sb.at).toLocaleString("cs-CZ")+": nových "+sb.nove+", zmizelých "+sb.zmizelo+", změněné ID u "+sb.zmenaId+" z "+sb.pocet+". "+(sb.zmenaId>sb.pocet/2?"<b class=r>ID se mění (zdroj se nahrává znovu), klíčem zůstává Title.</b>":"ID zůstávají stabilní."):"Otisk zatím není uložen.")+"</p>"
  +"<div class=bar><button class=b data-a=sync"+(c.nw.length+c.ch.length+c.gone.length?"":" disabled")+">Synchronizovat teď</button> <button class=g data-a=snap>Uložit otisk zdroje</button> <label><input type=checkbox data-a=auto"+(auto?" checked":"")+"> Automaticky jednou denně, když je aplikace otevřená</label></div><p id=fst class=note>"+(localStorage.getItem(LR)?"Poslední synchronizace: "+new Date(localStorage.getItem(LR)).toLocaleString("cs-CZ"):"Zatím neproběhla.")+"</p>";
  if(!sb)snap(c.s);return out}catch(e){return H1+"<p class=r>"+esc(e.message)+"</p>"}}
function firmyM(){var mn=document.getElementById("main");mn.onclick=async function(e){var b=e.target.closest("[data-a]");if(!b)return;var a=b.dataset.a,st=document.getElementById("fst");
 if(a=="snap"){snap(ST.c.s);st.textContent="Otisk uložen."}
 if(a=="sync"){b.disabled=true;try{var fresh=await compare();var n=await sync(fresh,function(x){st.textContent=x});st.textContent="Hotovo, zapsáno "+n+" změn.";setTimeout(function(){go("firmy")},1200)}catch(x){st.innerHTML="<span class=r>"+esc(x.message)+"</span>";b.disabled=false}}};
 mn.onchange=function(e){if(e.target.dataset&&e.target.dataset.a=="auto")localStorage.setItem(LA,e.target.checked?"1":"0")}}
window.firmaDenne=async function(){try{if(!acc||localStorage.getItem(LA)!="1")return;var l=localStorage.getItem(LR);if(l&&Date.now()-new Date(l)<20*36e5)return;var c=await compare();if(c.nw.length+c.ch.length+c.gone.length)await sync(c,function(){});else localStorage.setItem(LR,new Date().toISOString());snap(c.s)}catch(e){console.warn("firmaDenne",e.message)}};
setTimeout(function(){window.firmaDenne()},25000);
window.MODS=window.MODS||{};window.MODS.firmy=[firmy,firmyM];
})();
