/* ELZA Asistent: Plán fází (0.45.0). Odhad z množství práce a norem, plánování podle pracovní doby lidí, plán vs. realita, přesun lidí s dopadem, učení norem. Data jsou zatím jen v paměti okna (seznamy SablonaFaze, Norma, Koeficient, ZaznamFaze se zakládají po potvrzení vlastníka, viz docs/MERENI-FAZI-NAVRH.md). Nic se neodesílá. */
(function(){
var DW=58,ND=21,H0=8,HW=DW/10;
var DN=["Po","Út","St","Čt","Pá","So","Ne"];
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function dlab(i){var d=new Date(2026,10,23+i);return{n:d.getDate(),m:d.getMonth()+1,w:DN[(d.getDay()+6)%7],we:d.getDay()==0||d.getDay()==6}}
function dtxt(i){var d=dlab(i);return d.n+". "+d.m+"."}
function hh(x){var h=Math.floor(x),m=Math.round((x-h)*60);if(m==60){h++;m=0}return h+":"+(m<10?"0":"")+m}
var PEOPLE=[
 {n:"Jan Novák",hpd:8,off:[4],sk:["OZO PO","EPS"],busy:{0:5,1:5},note:"pátek volno"},
 {n:"Eva Horáková",hpd:8,off:[1,2],sk:["OZO PO","PZTS"],busy:{},note:"dovolená Út–St"},
 {n:"Petr Malý",hpd:6,off:[],sk:["OZO PO"],busy:{},note:"zkrácený úvazek 6 h"},
 {n:"Pavel Dvořák",hpd:8,off:[3],sk:["PZTS","Projekt"],busy:{},note:"školení Čt, bez OZO PO"}
];
var PH=[
 {id:"pr",n:"Příprava a podklady",u:"zakázka",fix:0.5,per:0,k:0,roles:"OZO PO",team:1},
 {id:"pv",n:"Přístup do objektu",u:"objekt",fix:0,per:0.25,k:1,roles:"OZO PO",team:1},
 {id:"hl",n:"Kontrola hlásičů",u:"hlásič",fix:0,per:0.05,k:1,roles:"OZO PO",team:2},
 {id:"us",n:"Kontrola ústředny",u:"ústředna",fix:0,per:0.5,k:0,roles:"OZO PO",team:1},
 {id:"pt",n:"Protokol a předání",u:"zakázka",fix:0.75,per:0,k:0,roles:"OZO PO",team:1}
];
var TPL={
 pilot:{n:"Kontrola OZO PO (pilot)",ph:PH.slice()},
 retez:{n:"Celý řetěz zakázky",ph:[
  {id:"pj",n:"Projekce",u:"objekt",fix:2,per:6,k:0,roles:"Projekt",team:1},
  {id:"jd",n:"Jednání (zákazník, úřady, HZS)",u:"zakázka",fix:3,per:0,k:0,roles:"Projekt",team:1},
  {id:"po",n:"Pracovní postupy a BOZP",u:"zakázka",fix:2,per:0,k:0,roles:"OZO BOZP",team:1},
  {id:"kb",n:"Kabeláž",u:"hlásič",fix:0,per:0.15,k:1,roles:"PZTS",team:2},
  {id:"mo",n:"Montáž a oživení",u:"hlásič",fix:2,per:0.2,k:1,roles:"PZTS",team:2},
  {id:"kz",n:"Kontrola podle zákonů a vyhlášek",u:"ústředna",fix:1,per:1,k:0,roles:"OZO PO",team:1},
  {id:"pk",n:"Protokol a předání",u:"zakázka",fix:1.5,per:0,k:0,roles:"OZO PO",team:1},
  {id:"re",n:"Revize elektro",u:"objekt",fix:1,per:2,k:0,roles:"Revizní technik",team:1}
 ]}
};
function can(P,role){return P.kv===false||P.sk.indexOf(role)>=0}
var REASONS=["přístup do objektu","chybějící podklad","porucha zařízení","nový požadavek zákazníka","počasí","jiné"];
function Model(){this.tplId="pilot";
 this.q={hl:520,us:3,pv:2};this.vyska=true;this.pristup=false;this.podlazi=false;
 this.norm={};PH.forEach(function(p){this.norm[p.id]={fix:p.fix,per:p.per,src:"odhad vedoucího",n:0}},this);
 this.as={pr:["Jan Novák"],pv:["Jan Novák"],hl:["Jan Novák","Eva Horáková"],us:["Jan Novák"],pt:["Jan Novák"]};
 this.rec={};this.sel="hl";
 var ok=this,first=PEOPLE[0]&&PEOPLE[0].n;Object.keys(this.as).forEach(function(k){var v=ok.as[k].filter(function(n){return PEOPLE.some(function(P){return P.n==n})});ok.as[k]=v.length?v:[first]});
}
Model.prototype.tpl=function(id){var t=TPL[id];if(!t)return;this.tplId=id;PH.length=0;t.ph.forEach(function(p){PH.push(p)});this.norm={};PH.forEach(function(p){this.norm[p.id]={fix:p.fix,per:p.per,src:"odhad vedoucího",n:0}},this);var f=PEOPLE[0]&&PEOPLE[0].n,self=this;this.as={};this.rec={};PH.forEach(function(p){var ok=PEOPLE.filter(function(P){return can(P,p.roles)})[0];self.as[p.id]=[(ok||PEOPLE[0]||{}).n].filter(Boolean)});this.sel=PH[0].id;this.q.hl=this.q.hl||0};
Model.prototype.unitsOf=function(p){return p.u=="zakázka"?1:(this.q[{"hlásič":"hl","ústředna":"us","objekt":"pv"}[p.u]]||0)};
Model.prototype.coef=function(p){return p.k?(this.vyska?1.2:1)*(this.pristup?1.3:1)*(this.podlazi?1.15:1):1};
Model.prototype.spread=function(p){var n=this.norm[p.id].n;return 0.4/Math.sqrt(1+n/3)};
Model.prototype.hours=function(p){var n=this.norm[p.id];return (n.fix+n.per*this.unitsOf(p))*this.coef(p)};
Model.prototype.range=function(p){var h=this.hours(p),s=this.spread(p);return[h*(1-s/2),h,h*(1+s)]};
Model.prototype.person=function(n){return PEOPLE.filter(function(x){return x.n==n})[0]};
Model.prototype.schedule=function(as){
 var self=this,used={},out=[],t0={day:0,h:H0};
 PEOPLE.forEach(function(p){used[p.n]={};for(var d in p.busy)used[p.n][d]=p.busy[d]});
 PH.forEach(function(p){
  var names=(as||self.as)[p.id]||[],hrs=self.hours(p),share=names.length?hrs/names.length:hrs,segs=[],endD=t0.day,endT=t0.h;
  names.forEach(function(nm){var P=self.person(nm),rem=share,d=t0.day;
   while(rem>0.001&&d<ND+30){
    var cap=P.hpd,off=P.off.indexOf(d)>=0,wk=(d%7)>=5;
    if(off||wk){d++;continue}
    var u=used[nm][d]||0,start=H0+u;if(d==t0.day&&t0.h>start)start=t0.h;
    var av=Math.max(0,H0+cap-start),take=Math.min(av,rem);
    if(take>0.001){segs.push({p:nm,d:d,f:start,t:start+take});used[nm][d]=start+take-H0;rem-=take;if(d>endD||(d==endD&&start+take>endT)){endD=d;endT=start+take}}
    if(rem>0.001)d++;
   }});
  out.push({ph:p,hours:hrs,segs:segs,endD:endD,endT:endT,names:names});
  t0={day:endD,h:endT};
 });
 return out;
};
Model.prototype.warns=function(p,names){var w=[];names.forEach(function(n){var P=this.person(n);if(P&&!can(P,p.roles))w.push(n+" nemá školení "+p.roles)},this);return w};
function median(a){var s=a.slice().sort(function(x,y){return x-y}),m=Math.floor(s.length/2);return s.length?(s.length%2?s[m]:(s[m-1]+s[m])/2):0}
Model.prototype.measured=function(p){var r=(this.rec[p.id]||[]).filter(function(x){return x.units>0&&x.hours>0});return{n:r.length,v:median(r.map(function(x){return x.hours/x.units/this.coef(p)},this))}};
var CSS=".fz .kp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:10px 0}.fz .kp div{background:var(--p);border:1px solid var(--l);border-radius:10px;padding:10px 12px;font-size:12px;color:var(--m)}.fz .kp b{display:block;font-size:22px;color:var(--f);font-variant-numeric:tabular-nums}.fz .kp .al b{color:var(--a)}"
+".fz .in{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;background:var(--p);border:1px solid var(--l);border-radius:10px;padding:10px 12px;margin-bottom:10px}.fz .in label{font-size:12px;color:var(--m);display:flex;flex-direction:column;gap:3px}.fz .in input[type=number]{width:84px;padding:5px;border:1px solid var(--l);border-radius:6px;background:var(--bg);color:var(--f)}.fz .in .ck{flex-direction:row;align-items:center;gap:5px;width:auto}.fz input[type=checkbox]{width:auto;margin:0;flex:none}.fz .in label{display:flex}.fz .fgt{overflow:visible;border:0;border-radius:0}.fz .fgr{display:grid;min-height:0}.fz .fgl{flex:none;display:block;line-height:1.3;padding:7px 10px}"
+".fz .gw{overflow-x:auto;border:1px solid var(--l);border-radius:10px;background:var(--bg)}.fz .fgr{display:grid;grid-template-columns:210px "+(DW*ND)+"px;border-bottom:1px solid var(--l)}.fz .fgl{padding:7px 10px;font-size:13px;position:sticky;left:0;background:var(--bg);z-index:3;border-right:1px solid var(--l);cursor:pointer}.fz .fgl small{display:block;color:var(--m);font-size:11px}.fz .fgl.on{box-shadow:inset 3px 0 0 var(--a);background:var(--p)}"
+".fz .fgt{position:relative;height:50px;background-image:linear-gradient(90deg,var(--l) 1px,transparent 1px);background-size:"+DW+"px 100%}.fz .fgt.sm{height:30px}.fz .hd{font:11px ui-monospace,Menlo,monospace;color:var(--m);position:sticky;top:0;z-index:4;background:var(--bg)}.fz .hd .fgt{height:auto;display:flex}.fz .hd span{width:"+DW+"px;flex:none;text-align:center;padding:4px 0;border-left:1px solid var(--l)}.fz .hd span.we,.fz .fgt .wk{background:rgba(120,130,140,.12)}.fz .hd .td{color:var(--a);font-weight:700}"
+".fz .wk{position:absolute;top:0;bottom:0;width:"+DW+"px}.fz .sg{position:absolute;top:6px;height:22px;border-radius:5px;background:var(--b);color:#fff;font-size:10px;line-height:22px;padding:0 4px;overflow:hidden;white-space:nowrap;border:1px solid rgba(255,255,255,.4)}.fz .sg.c1{background:#2f6fb0}.fz .sg.c2{background:#2e7d32}.fz .sg.c3{background:#8a6fb5}.fz .sg.c4{background:#c98a1b}.fz .re{position:absolute;top:34px;height:8px;border-radius:3px;background:var(--a)}.fz .re.ok{background:#2e7d32}"
+".fz .ms{position:absolute;top:0;bottom:0;width:2px;background:var(--a);z-index:1}.fz .ms em{position:absolute;top:2px;left:4px;font-style:normal;font-size:10px;color:var(--a);white-space:nowrap}.fz .today{position:absolute;top:0;bottom:0;width:2px;background:var(--a);opacity:.35}.fz .ex{position:absolute;top:0;bottom:0;background:repeating-linear-gradient(45deg,rgba(120,130,140,.28) 0 4px,transparent 4px 8px);width:"+DW+"px}"
+".fz .ut{position:absolute;top:5px;bottom:5px;width:"+(DW-4)+"px;margin-left:2px;border-radius:4px;font-size:10px;text-align:center;color:#fff;line-height:20px}.fz .pn{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}@media(max-width:900px){.fz .pn{grid-template-columns:1fr}}.fz .cd{background:var(--p);border:1px solid var(--l);border-radius:10px;padding:12px;font-size:13px}.fz .cd h3{margin:0 0 6px;font-size:14px}"
+".fz .cd table{width:100%;border-collapse:collapse}.fz .cd td,.fz .cd th{text-align:left;padding:4px 6px;border-top:1px solid var(--l);font-size:12px}.fz .pl{display:inline-block;padding:1px 8px;border-radius:99px;border:1px solid currentColor;font-size:11px;margin:2px 3px 2px 0}.fz .bd{color:var(--a)}.fz .gd{color:#2e7d32}.fz .wr{color:var(--w)}.fz button.b2{border:1px solid var(--l);background:var(--bg);color:var(--f);border-radius:6px;padding:5px 10px;cursor:pointer;font:inherit;margin:2px 4px 2px 0}.fz button.b2.pri{background:var(--b);color:#fff;border-color:var(--b)}.fz .rn{height:8px;background:var(--l);border-radius:4px;position:relative;margin:4px 0}.fz .rn i{position:absolute;top:0;bottom:0;background:#9fb6d3;border-radius:4px}.fz .rn b{position:absolute;top:-3px;width:3px;height:14px;background:var(--b)}.fz .tt{position:sticky;left:12px;margin:8px 0;padding:8px 12px;border-radius:8px;background:var(--b);color:#fff;font-size:13px;display:none}";
function mount(el,opt){
 opt=opt||{};
 if(!document.getElementById("fzcss")){var s=document.createElement("style");s.id="fzcss";s.textContent=CSS;document.head.appendChild(s)}
 var M=new Model(),S=null,base=null;
 function end(sc){var l=sc[sc.length-1];return{d:l.endD,t:l.endT}}
 function toast(t){var e=el.querySelector(".tt");if(!e)return;e.textContent=t;e.style.display="block";clearTimeout(e._h);e._h=setTimeout(function(){e.style.display="none"},6000)}
 function draw(){
  S=M.schedule();var e=end(S),tot=0,tl=0,th=0,act=0,over=0;
  S.forEach(function(r){var R=M.range(r.ph);tot+=R[1];tl+=R[0];th+=R[2];var rc=M.rec[r.ph.id]||[];if(rc.length)act+=rc[rc.length-1].hours});
  var late=0;S.forEach(function(r){var rc=M.rec[r.ph.id];if(rc&&rc.length){var x=rc[rc.length-1];if(x.hours>M.hours(r.ph)*1.2)over++}});
  var h='<div class="tt"></div><div class="in"><label>Typ zakázky<select id=tp>'+Object.keys(TPL).map(function(k){return '<option value='+k+(M.tplId==k?' selected':'')+'>'+esc(TPL[k].n)+'</option>'}).join('')+'</select></label><label>Hlásičů<input type=number id=qh min=0 value='+M.q.hl+'></label><label>Ústředen<input type=number id=qu min=0 value='+M.q.us+'></label><label>Objektů<input type=number id=qo min=1 value='+M.q.pv+'></label>'
   +'<label class=ck><input type=checkbox id=kv'+(M.vyska?" checked":"")+'> výška nad 3,5 m ×1,2</label><label class=ck><input type=checkbox id=kp'+(M.pristup?" checked":"")+'> obtížný přístup ×1,3</label><label class=ck><input type=checkbox id=kf'+(M.podlazi?" checked":"")+'> více než 5 podlaží ×1,15</label>'
   +'<button class="b2 pri" id=ai>Navrhnout obsazení (AI)</button><button class=b2 id=sm>Nasimulovat 10 záznamů (ukázka)</button></div>';
  h+='<div class="kp"><div>Odhad práce<b>'+tot.toFixed(1)+' h</b>rozsah '+tl.toFixed(1)+' až '+th.toFixed(1)+' h</div><div>Předání (plán)<b>'+dtxt(e.d)+'</b>'+hh(e.t)+'</div><div>Odpracováno<b>'+act.toFixed(1)+' h</b>zapsaná realita</div><div class="'+(over?"al":"")+'">Fáze s odchylkou<b>'+over+'</b>nad 20 % plánu</div></div>';
  h+='<div class="gw"><div class="fgr hd"><div class="fgl" style="cursor:default">Fáze / lidé</div><div class="fgt">';
  for(var i=0;i<ND;i++){var d=dlab(i);h+='<span class="'+(d.we?"we ":"")+(i==0?"td":"")+'">'+d.n+'.<br>'+d.w+'</span>'}
  h+='</div></div>';
  S.forEach(function(r,idx){
   var w=M.warns(r.ph,r.names),R=M.range(r.ph);
   h+='<div class="fgr"><div class="fgl'+(M.sel==r.ph.id?" on":"")+'" data-ph="'+r.ph.id+'">'+esc(r.ph.n)+'<small>'+r.hours.toFixed(1)+' h · '+esc(r.names.join(", ")||"nikdo")+(w.length?' <span class="wr">⚠</span>':"")+'</small></div><div class="fgt">';
   for(var i=0;i<ND;i++)if(dlab(i).we)h+='<div class="wk" style="left:'+(i*DW)+'px"></div>';
   h+='<div class="today" style="left:'+(DW/2)+'px"></div>';
   r.segs.forEach(function(s){var ci=1+Math.max(0,r.names.indexOf(s.p))%4;h+='<div class="sg c'+ci+'" title="'+esc(s.p)+' '+hh(s.f)+'–'+hh(s.t)+'" style="left:'+(s.d*DW+(s.f-H0)*HW)+'px;width:'+Math.max(8,(s.t-s.f)*HW)+'px;top:'+(3+Math.max(0,r.names.indexOf(s.p))*14)+'px;height:13px;line-height:13px">'+esc(s.p.split(" ")[0])+'</div>'});
   var rc=M.rec[r.ph.id];if(rc&&rc.length){var x=rc[rc.length-1];h+='<div class="re '+(x.hours>r.hours*1.2?"":"ok")+'" title="realita '+x.hours+' h" style="left:'+(x.d*DW)+'px;width:'+Math.max(8,DW*Math.max(1,x.hours/8))+'px"></div>'}
   h+='</div></div>';
  });
  h+='<div class="fgr"><div class="fgl" style="cursor:default;font-weight:600">Kapacita lidí<small>využití dne podle pracovní doby</small></div><div class="fgt sm"></div></div>';
  var use={};PEOPLE.forEach(function(P){use[P.n]={};for(var d in P.busy)use[P.n][d]=(use[P.n][d]||0)+P.busy[d]});
  S.forEach(function(r){r.segs.forEach(function(s){use[s.p][s.d]=(use[s.p][s.d]||0)+(s.t-s.f)})});
  PEOPLE.forEach(function(P){h+='<div class="fgr"><div class="fgl" style="cursor:default">'+esc(P.n)+'<small>'+P.hpd+' h/den · '+esc(P.note)+'</small></div><div class="fgt sm">';
   for(var i=0;i<ND;i++){var wk=dlab(i).we;if(P.off.indexOf(i)>=0){h+='<div class="ex" style="left:'+(i*DW)+'px"></div>';continue}if(wk)continue;var u=(use[P.n][i]||0)/P.hpd;if(u>0)h+='<div class="ut" style="left:'+(i*DW)+'px;background:'+(u>1?"#b00020":u>0.75?"#c98a1b":"#2f6fb0")+'">'+Math.round(u*100)+'%</div>'}
   h+='</div></div>'});
  h+='</div><p style="font-size:12px;color:var(--m)">Modré až fialové pruhy jsou plán po lidech v jejich pracovní době, tenký pruh pod nimi je zapsaná realita (zelený v toleranci, červený nad 20 %). Šrafování je nepřítomnost.</p>';
  h+='<div class="pn"><div class="cd" id=pd></div><div class="cd" id=ln></div></div>';
  el.innerHTML=h;bind();side();learn();
 }
 function side(){
  var r=S.filter(function(x){return x.ph.id==M.sel})[0],p=r.ph,R=M.range(p),w=M.warns(p,r.names),sp=Math.max(R[2],1),pos=function(v){return Math.min(100,v/sp*100)};
  var h='<h3>'+esc(p.n)+'</h3><div class="rn"><i style="left:'+pos(R[0])+'%;width:'+(pos(R[2])-pos(R[0]))+'%"></i><b style="left:'+pos(R[1])+'%"></b></div><small>odhad '+R[0].toFixed(1)+' – <b>'+R[1].toFixed(1)+'</b> – '+R[2].toFixed(1)+' h · zdroj normy: '+esc(M.norm[p.id].src)+', vzorků '+M.norm[p.id].n+'</small>';
  h+='<p><b>Kdo to dělá</b> (rozdělí se hodiny):</p>';
  PEOPLE.forEach(function(P){var on=r.names.indexOf(P.n)>=0,ok=can(P,p.roles);h+='<label style="display:block"><input type=checkbox data-pe="'+esc(P.n)+'"'+(on?" checked":"")+'> '+esc(P.n)+' <span class="'+(ok?"gd":"wr")+'">'+(P.kv===false?"kvalifikace neověřena":ok?"má "+p.roles:"bez "+p.roles)+'</span> <small>'+esc(P.note)+'</small></label>'});
  if(w.length)h+='<p class=wr>⚠ '+esc(w.join("; "))+'</p>';
  var rc=(M.rec[p.id]||[]).slice(-1)[0];
  h+='<p style="margin-top:10px"><b>Zapsat realitu</b></p><div class="in" style="margin:0"><label>Hodin<input type=number id=rh step=0.25 min=0 value="'+(rc?rc.hours:"")+'"></label><label>Provedeno jednotek<input type=number id=ru min=0 value="'+(rc?rc.units:M.unitsOf(p))+'"></label><label>Den dokončení<input type=number id=rd min=1 max='+ND+' value="'+(rc?rc.d+1:r.endD+1)+'"></label><label>Důvod odchylky<select id=rs><option value="">není</option>'+REASONS.map(function(x){return '<option>'+esc(x)+'</option>'}).join("")+'</select></label><button class="b2 pri" id=rz>Uložit záznam</button></div>';
  if(rc)h+='<p>Poslední: '+rc.hours+' h proti plánu '+r.hours.toFixed(1)+' h → <b class="'+(rc.hours>r.hours*1.2?"bd":"gd")+'">'+(((rc.hours/r.hours-1)*100)>=0?"+":"")+Math.round((rc.hours/r.hours-1)*100)+' %</b>'+(rc.why?' ('+esc(rc.why)+')':"")+'</p>';
  document.getElementById("pd").innerHTML=h;
  document.getElementById("pd").onchange=function(ev){var t=ev.target;if(t.dataset&&t.dataset.pe){var cur=M.as[p.id].slice(),i=cur.indexOf(t.dataset.pe);if(t.checked&&i<0)cur.push(t.dataset.pe);if(!t.checked&&i>=0)cur.splice(i,1);if(!cur.length){toast("Fáze musí mít alespoň jednoho člověka.");draw();return}apply(p.id,cur)}};
  document.getElementById("rz").onclick=function(){var hr=+document.getElementById("rh").value,un=+document.getElementById("ru").value,dd=(+document.getElementById("rd").value||1)-1;if(!(hr>0)){toast("Zadejte odpracované hodiny.");return}var dev=hr/r.hours-1,why=document.getElementById("rs").value;if(dev>0.2&&!why){toast("Odchylka nad 20 %: vyberte důvod.");return}(M.rec[p.id]=M.rec[p.id]||[]).push({hours:hr,units:un,d:dd,why:why});M.norm[p.id].n=M.rec[p.id].length;draw();toast("Záznam uložen v okně. Do SharePointu se zapíše po založení seznamu ZaznamFaze.")};
 }
 function learn(){
  var h='<h3>Učení norem</h3><table><tr><th>Fáze</th><th>Norma (h/jedn.)</th><th>Zdroj</th><th>Vzorků</th><th>Naměřeno</th><th></th></tr>';
  PH.forEach(function(p){var n=M.norm[p.id],m=M.measured(p),per=p.u=="zakázka"?"pevně "+n.fix:n.per.toFixed(3);var can=m.n>=10&&p.u!="zakázka";
   h+='<tr><td>'+esc(p.n)+'</td><td>'+per+'</td><td>'+esc(n.src)+'</td><td>'+m.n+'/10</td><td>'+(m.n?(p.u=="zakázka"?"—":m.v.toFixed(3)):"—")+'</td><td>'+(can?'<button class=b2 data-ok="'+p.id+'">Schválit '+m.v.toFixed(3)+'</button>':"")+'</td></tr>'});
  h+='</table><p style="font-size:12px;color:var(--m)">Pod 10 vzorků asistent nic nenavrhuje. Změna normy se provede jen vaším schválením a původní hodnota zůstává v historii. Rozsah odhadu se s počtem vzorků zužuje.</p>';
  var L=document.getElementById("ln");L.innerHTML=h;
  L.onclick=function(ev){var id=ev.target.dataset&&ev.target.dataset.ok;if(!id)return;var p=PH.filter(function(x){return x.id==id})[0],m=M.measured(p);M.norm[id].per=m.v;M.norm[id].src="schváleno z měření";draw();toast("Norma upravena: "+p.n+" → "+m.v.toFixed(3)+" h na jednotku.")};
 }
 function apply(id,names){
  var a=end(M.schedule()),prev=M.as[id];M.as[id]=names;var b=end(M.schedule());
  var dd=b.d-a.d;draw();toast("Změna obsazení: "+(dd==0?"předání se nemění ("+dtxt(b.d)+")":"předání "+dtxt(a.d)+" → "+dtxt(b.d)+" ("+(dd>0?"+":"")+dd+" d)")+(M.warns(PH.filter(function(x){return x.id==id})[0],names).length?" · pozor na chybějící školení":""))
 }
 function ai(){
  var rep=[],best={};var as0={};
  PH.forEach(function(p){as0[p.id]=M.as[p.id].slice()});
  PH.forEach(function(p){
   var q=PEOPLE.filter(function(P){return can(P,p.roles)}),cands=[];if(!q.length)return;
   q.forEach(function(P){cands.push([P.n])});
   if(p.team>1)for(var i=0;i<q.length;i++)for(var j=i+1;j<q.length;j++)cands.push([q[i].n,q[j].n]);
   var res=cands.map(function(c){var t=JSON.parse(JSON.stringify(as0));t[p.id]=c;var e=end(M.schedule.call(M,t));return{c:c,e:e.d+e.t/24}}).sort(function(x,y){return x.e-y.e||x.c.length-y.c.length});
   as0[p.id]=res[0].c;rep.push(p.n+": "+res[0].c.join(" + ")+" (hotovo "+dtxt(Math.floor(res[0].e))+")")});
  var a=end(M.schedule());M.as=as0;var b=end(M.schedule());draw();toast("Návrh obsazení: předání "+dtxt(a.d)+" → "+dtxt(b.d)+". "+rep.join(" | "))
 }
 function bind(){
  var g=function(i){return el.querySelector("#"+i)};
  g("tp").onchange=function(){M.tpl(this.value);base=null;draw()};g("qh").onchange=function(){M.q.hl=+this.value||0;draw()};g("qu").onchange=function(){M.q.us=+this.value||0;draw()};g("qo").onchange=function(){M.q.pv=+this.value||1;draw()};
  g("kv").onchange=function(){M.vyska=this.checked;draw()};g("kp").onchange=function(){M.pristup=this.checked;draw()};g("kf").onchange=function(){M.podlazi=this.checked;draw()};
  g("ai").onclick=ai;
  g("sm").onclick=function(){PH.forEach(function(p){if(p.u=="zakázka")return;var arr=[];for(var i=0;i<10;i++){var u=M.unitsOf(p),f=1.1+((i*37)%30)/100;arr.push({hours:+(u*M.norm[p.id].per*M.coef(p)*f).toFixed(2),units:u,d:2,why:"jiné"})}M.rec[p.id]=arr;M.norm[p.id].n=10});draw();toast("Ukázka: vloženo 10 vymyšlených záznamů ke každé fázi. Skutečná data vznikají jen zápisem.")};
  el.querySelectorAll("[data-ph]").forEach(function(n){n.onclick=function(){M.sel=this.dataset.ph;draw()}});
 }
 M.redraw=draw;draw();
 return M;
}
window.FAZE={mount:mount,Model:Model};
window.MODS=window.MODS||{};
window.MODS.faze=[function(){return "<h1>Plán fází</h1><p class=note>Odhad z množství práce, plán podle pracovní doby lidí, přesun lidí s dopadem na termín a porovnání plánu s realitou. Lidé se berou z kopie zaměstnanců (Správa → Synchronizace zaměstnanců); pracovní doba je výchozích 8 h a kvalifikace se ověří až po naplnění Lidé a školení. Plán a záznamy zatím žijí jen v tomto okně (ukládání po založení seznamů, docs/MERENI-FAZI-NAVRH.md).</p><p class=note id=fzsrc>Lidé: ukázková data.</p><div class=fz id=fz></div>"},function(){var M=window.FAZE.mount(document.getElementById("fz"));if(!window.zamestnanci)return;(window.osoby?window.osoby():window.zamestnanci()).then(function(rows){var o=document.getElementById("fzsrc");if(!rows||!rows.length||!o){return}
 PEOPLE.length=0;rows.forEach(function(z){PEOPLE.push({n:z.jm||("os. č. "+z.os),hpd:8,off:[],sk:[],kv:false,busy:{},note:"os. č. "+z.os+(z.n>1?", v "+z.n+" agendách":"")+", pracovní doba výchozí"})});var f=PEOPLE[0].n;Object.keys(M.as).forEach(function(k){M.as[k]=[f]});M.redraw();o.textContent="Lidé: "+rows.length+" osob (složeno z kopie Zamestnanec podle osobního čísla, bez duplicit z více agend). Pracovní doba je výchozích 8 h a kvalifikace neověřena, dokud se nenaplní Lidé a školení."})}];
})();
