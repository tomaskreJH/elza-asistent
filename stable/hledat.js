/* ELZA Asistent: Hledat vše (bez AI): prohledá předpisy, skilly, agenty, prompty, postupy, foto příkazy a brand. */
(function(){
var SRC=[["Předpisy","pravo","Právo a normy","Title,Oznaceni,Oblast,Poznamka"],["Skilly","skilly","Skilly","Title,Purpose,Domain,SkillGroup"],["Agenti","agenti","Elzáčci","Title,Role,Skills"],["Prompty","prompty","Prompty","Title,Skupina,Data"],["Postupy","postupy","Postupy","Title,Skupina,Data"],["Foto příkazy","foto","Foto příkazy","Title,Skupina,Data"],["Brand","brand","Brand","Title,Data"]];
var ALL=null;
async function hledat(){return "<h1>Hledat vše</h1><div class=bar><input id=q placeholder=\"Hledaný výraz (např. § 12, PCO, /enhance, Elza)\" value=\""+esc(Q)+"\"></div><div id=tb><p class=note>Načítám obsah…</p></div>"}
async function hledatM(){if(!ALL){ALL=[];await Promise.all(SRC.map(async function(s){try{var r=await list(s[0],s[3]);r.forEach(function(x){if(s[0]=="Skilly"&&window.skillOk&&!window.skillOk(x))return;ALL.push({s:s,x:x,t:Object.keys(x).map(function(k){return String(x[k]==null?"":x[k])}).join(" ").toLowerCase()})})}catch(e){}}))}
$("#q").oninput=function(e){Q=e.target.value;vys()};$("#tb").onclick=function(e){var v=e.target.dataset&&e.target.dataset.v;if(v)go(v)};vys()}
function vys(){var q=Q.trim().toLowerCase();if(q.length<2){$("#tb").innerHTML="<p class=note>Napište alespoň dva znaky. Prohledává se "+ALL.length+" položek.</p>";return}
var r=ALL.filter(function(a){return a.t.indexOf(q)>=0});var g={};r.forEach(function(a){(g[a.s[2]]=g[a.s[2]]||[]).push(a)});
$("#tb").innerHTML="<p class=note>"+r.length+" nalezeno</p>"+Object.keys(g).map(function(k){var m=g[k];return "<h3>"+esc(k)+" ("+m.length+")</h3><table>"+m.slice(0,15).map(function(a){var sn=a.x.Oznaceni||a.x.Purpose||a.x.Role||a.x.Skupina||a.x.Poznamka||"";return "<tr><td>"+esc(a.x.Title)+"<td class=note>"+esc(String(sn).slice(0,90))+"<td><button class=nav style=width:auto data-v="+a.s[1]+">otevřít</button></tr>"}).join("")+"</table>"+(m.length>15?"<p class=note>a dalších "+(m.length-15)+", zpřesněte hledání</p>":"")}).join("")}
window.MODS=window.MODS||{};window.MODS.hledat=[hledat,hledatM];
})();
