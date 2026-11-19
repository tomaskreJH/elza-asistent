/* ELZA Asistent: Přehled (počty, upozornění, rychlé odkazy) a interaktivní mapa vazeb. Jen čtení ze SharePointu. */
(function(){
function nd(t){return list(t,"Id").then(function(r){return r.length}).catch(function(){return "?"})}
async function prehled(){
var L=[["Předpisy","pravo","Právo a normy"],["Skilly","skilly","Skilly"],["Agenti","agenti","Elzáčci"],["Workflow a vazby","mapa","Vazby"],["Prompty","prompty","Prompty"],["Postupy","postupy","Postupy"],["Foto příkazy","foto","Foto příkazy"],["Brand","brand","Brand"]];
var n=await Promise.all(L.map(function(x){return nd(x[0])}));
var P=[];try{P=await list("Předpisy","Title,Oznaceni,PlatiDo,DalsiKontrola")}catch(e){}
var now=Date.now();var po=P.filter(function(x){return x.DalsiKontrola&&new Date(x.DalsiKontrola)<now});var brzy=P.filter(function(x){return x.PlatiDo&&new Date(x.PlatiDo)>now&&(new Date(x.PlatiDo)-now)<60*864e5});
var al="<h3>Upozornění</h3>";
al+=po.length?"<p class=r>"+po.length+" předpisů má kontrolu po termínu.</p>":"<p class=note>Žádná kontrola předpisů není po termínu.</p>";
al+=brzy.length?"<p class=a>U "+brzy.length+" předpisů brzy končí platnost: "+brzy.slice(0,5).map(function(x){return esc(x.Oznaceni||x.Title)}).join(", ")+"</p>":"";
return "<h1>Přehled</h1><div class=grid>"+L.map(function(x,i){return "<button class=card data-v="+x[1]+" style=\"cursor:pointer;text-align:left;font:inherit;color:inherit\"><b style=pointer-events:none>"+n[i]+"</b><span style=pointer-events:none>"+esc(x[2])+"</span></button>"}).join("")+"</div>"+al+"<p class=note>"+(window.aiOk&&window.aiOk()?"AI je pro vás povolena (pravidla potvrzena).":"AI zatím není povolena: otevřete Pravidla AI.")+"</p>"}
/* MAPA */
var MD2=[],MS2="",MQ="";
async function mapa(){MD2=await list("Workflow a vazby","FromId,ToId,RelationType,Condition");var deg={};MD2.forEach(function(x){deg[x.FromId]=(deg[x.FromId]||0)+1;deg[x.ToId]=(deg[x.ToId]||0)+1});
if(!MS2){MS2=Object.keys(deg).sort(function(a,b){return deg[b]-deg[a]})[0]||""}
var ids=Array.from(new Set(MD2.flatMap(function(x){return [x.FromId,x.ToId]}).filter(Boolean))).sort();
return "<h1>Mapa vazeb</h1><p class=note>Klikněte na uzel, který chcete mít ve středu. Vlevo je to, co do něj vstupuje, vpravo to, kam vede.</p><div class=bar><input id=q list=ml placeholder=\"Najít uzel podle označení\" value=\""+esc(MS2)+"\"><datalist id=ml>"+ids.map(function(i){return "<option value=\""+esc(i)+"\">"}).join("")+"</datalist></div><div id=sv></div><div id=tb></div>"}
function mapaT(){var c=MS2;var ins=MD2.filter(function(x){return x.ToId==c});var outs=MD2.filter(function(x){return x.FromId==c});
var li=Array.from(new Set(ins.map(function(x){return x.FromId})));var lo=Array.from(new Set(outs.map(function(x){return x.ToId})));
var rh=34,H=Math.max(li.length,lo.length,1)*rh+30,W=900,cx=450,cy=H/2;
function yy(i,n){return (H-(n-1)*rh)/2+i*rh}
function box(x,y,id,w,cls){return "<g data-n=\""+esc(id)+"\" style=cursor:pointer><rect x="+(x-w/2)+" y="+(y-14)+" width="+w+" height=28 rx=8 fill="+(cls?"var(--b)":"var(--p)")+" stroke=var(--l) /><text x="+x+" y="+(y+4)+" text-anchor=middle font-size=12 fill="+(cls?"#fff":"var(--f)")+" style=pointer-events:none>"+esc(String(id).slice(0,30))+"</text></g>"}
var s="<svg viewBox=\"0 0 "+W+" "+H+"\" width=100% style=\"max-width:900px\">";
li.forEach(function(id,i){var y=yy(i,li.length);var rel=ins.filter(function(x){return x.FromId==id})[0];s+="<line x1=260 y1="+y+" x2=380 y2="+cy+" stroke=var(--m) /><text x=310 y="+((y+cy)/2-2)+" font-size=10 fill=var(--m) style=pointer-events:none>"+esc(rel.RelationType)+"</text>"});
lo.forEach(function(id,i){var y=yy(i,lo.length);var rel=outs.filter(function(x){return x.ToId==id})[0];s+="<line x1=520 y1="+cy+" x2=640 y2="+y+" stroke=var(--m) /><text x=560 y="+((y+cy)/2-2)+" font-size=10 fill=var(--m) style=pointer-events:none>"+esc(rel.RelationType)+"</text>"});
li.forEach(function(id,i){s+=box(160,yy(i,li.length),id,200,0)});lo.forEach(function(id,i){s+=box(740,yy(i,lo.length),id,200,0)});s+=box(cx,cy,c,200,1)+"</svg>";
$("#sv").innerHTML=s;
$("#sv").onclick=function(e){var g=e.target.closest&&e.target.closest("[data-n]");if(g){MS2=g.dataset.n;$("#q").value=MS2;mapaT()}};
var r=ins.concat(outs);$("#tb").innerHTML="<p class=note>"+r.length+" vazeb pro "+esc(c)+"</p><table><tr><th>Od<th>Vztah<th>Do<th>Podmínka</tr>"+r.map(function(x){return "<tr><td>"+esc(x.FromId)+"<td>"+esc(x.RelationType)+" →<td>"+esc(x.ToId)+"<td>"+esc(x.Condition)+"</tr>"}).join("")+"</table>"}
function mapaM(){$("#q").onchange=function(e){var v=e.target.value.trim();if(MD2.some(function(x){return x.FromId==v||x.ToId==v})){MS2=v;mapaT()}};mapaT()}
window.MODS=window.MODS||{};window.MODS.prehled=[prehled];window.MODS.mapa=[mapa,mapaM];
})();
