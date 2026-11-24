/* ELZA Asistent: osobní prostor (Můj den, Pošta, Kalendář). Jen čtení přes Microsoft Graph, delegovaně: každý vidí jen svou poštu a svůj kalendář. Nic se neukládá. */
(function(){
var G="https://graph.microsoft.com/v1.0";
async function gtok(sc,popup){try{return (await m.acquireTokenSilent({scopes:sc,account:acc})).accessToken}catch(e){if(!popup)throw e;return (await m.acquireTokenPopup({scopes:sc,account:acc})).accessToken}}
async function gget(sc,path,hd){var t=await gtok(sc,false);var h={Authorization:"Bearer "+t};for(var k in (hd||{}))h[k]=hd[k];var r=await fetch(G+path,{headers:h});if(!r.ok)throw new Error("Graph HTTP "+r.status);return (await r.json()).value}
function nic(sc,txt){return "<h1>"+txt+"</h1><p class=a>Přístup zatím není povolen (čeká se na souhlas správce nebo na vaše svolení).</p><button class=b id=gt>Povolit přístup</button><p id=gs class=note></p>"}
function gtM(sc,view){var b=$("#gt");if(!b)return;b.onclick=async function(){try{await gtok(sc,true);go(view)}catch(e){$("#gs").textContent="Nepovoleno: "+e.message}}}
var SM=["Mail.Read"],SC2=["Calendars.Read"];
function den(d){return new Date(d).toLocaleDateString("cs-CZ",{weekday:"long",day:"numeric",month:"numeric"})}
function cas(d){return new Date(d).toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})}
async function mail(){try{var r=await gget(SM,"/me/mailFolders/inbox/messages?$top=25&$select=subject,from,receivedDateTime,isRead,bodyPreview&$orderby=receivedDateTime desc");
return "<h1>Pošta</h1><p class=note>Posledních "+r.length+" zpráv v doručené poště, jen čtení. Nepřečtené: "+r.filter(function(x){return !x.isRead}).length+"</p>"+r.map(function(x){var f=x.from&&x.from.emailAddress||{};return "<div class=card style=\"margin-bottom:8px\"><h3>"+(x.isRead?"":"● ")+esc(x.subject||"(bez předmětu)")+"</h3><span>"+esc(f.name||f.address)+" · "+esc(new Date(x.receivedDateTime).toLocaleString("cs-CZ"))+"</span><p>"+esc(x.bodyPreview)+"</p></div>"}).join("")}catch(e){return nic(SM,"Pošta")}}
async function kal(){try{var a=new Date(),b=new Date(Date.now()+7*864e5);var r=await gget(SC2,"/me/calendarView?startDateTime="+a.toISOString()+"&endDateTime="+b.toISOString()+"&$orderby=start/dateTime&$top=50&$select=subject,start,end,location,isAllDay",{Prefer:'outlook.timezone="Europe/Prague"'});
var g={};r.forEach(function(x){var k=den(x.start.dateTime);(g[k]=g[k]||[]).push(x)});
return "<h1>Kalendář</h1><p class=note>Příštích 7 dní, jen čtení. "+r.length+" událostí</p>"+Object.keys(g).map(function(k){return "<h3>"+esc(k)+"</h3><table>"+g[k].map(function(x){return "<tr><td style=width:120px>"+(x.isAllDay?"celý den":cas(x.start.dateTime)+" – "+cas(x.end.dateTime))+"<td>"+esc(x.subject)+"<td>"+esc(x.location&&x.location.displayName)+"</tr>"}).join("")+"</table>"}).join("")}catch(e){return nic(SC2,"Kalendář")}}
window.MODS=window.MODS||{};window.MODS.posta=[mail,function(){gtM(SM,"posta")}];window.MODS.kalendar=[kal,function(){gtM(SC2,"kalendar")}];
})();
