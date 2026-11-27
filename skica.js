/* ELZA Asistent: Skica budovy z fotky (0.86.0). Zásada Tomáše (2026-11-27): odpověď a nabídka mají být osobní; skica budovy zákazníka z fotky,
   kterou dodal, ať je přímo v přípravě odpovědi. Vše se počítá v prohlížeči (hrany z fotky, bez AI, bez placených služeb, nic se nikam neposílá).
   Fotka ze stránek zákazníka se v prohlížeči zpracovat nedá (cizí web nepovolí čtení obrázku); to je zapsáno v DALSI-KROKY.
   Čistá logika hrany(): test/skica.test.js; vykreslení přes canvas: test/skica.py. */
(function(){var W=typeof window!="undefined"?window:globalThis;
/* rgba (Uint8ClampedArray nebo pole) → nové rgba: bílý papír, tmavě modré čáry podle síly hrany (Sobel nad lehce rozmazaným šedým obrazem) */
function hrany(d,w,h){var n=w*h,g=new Float32Array(n),i,x,y;for(i=0;i<n;i++)g[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
 var b=new Float32Array(n);for(y=0;y<h;y++)for(x=0;x<w;x++){var s=0,c=0;for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<w&&yy<h){s+=g[yy*w+xx];c++}}b[y*w+x]=s/c}
 var m=new Float32Array(n),sum=0,sq=0;for(y=1;y<h-1;y++)for(x=1;x<w-1;x++){var p=y*w+x,gx=-b[p-w-1]+b[p-w+1]-2*b[p-1]+2*b[p+1]-b[p+w-1]+b[p+w+1],gy=-b[p-w-1]-2*b[p-w]-b[p-w+1]+b[p+w-1]+2*b[p+w]+b[p+w+1],v=Math.sqrt(gx*gx+gy*gy);m[p]=v;sum+=v;sq+=v*v}
 var N=Math.max(1,(w-2)*(h-2)),mean=sum/N,sd=Math.sqrt(Math.max(0,sq/N-mean*mean)),t0=mean+.25*sd,gain=255/Math.max(1,2.2*sd);
 var o=new Uint8ClampedArray(n*4);for(i=0;i<n;i++){var k=Math.max(0,Math.min(1,(m[i]-t0)*gain/255));o[i*4]=255-Math.round(k*(255-27));o[i*4+1]=255-Math.round(k*(255-42));o[i*4+2]=255-Math.round(k*(255-65));o[i*4+3]=255}return o}
function obrazek(f){return new Promise(function(ok,ko){var u=typeof f=="string"?f:URL.createObjectURL(f),im=new Image();im.onload=function(){if(typeof f!="string")URL.revokeObjectURL(u);ok(im)};im.onerror=function(){ko(new Error("Obrázek se nepodařilo načíst."))};im.src=u})}
/* src: Blob/File nebo data:/blob: URL; vrací data URL PNG (nejdelší strana nejvýš max px) */
async function vykresli(src,max){max=max||900;var im=await obrazek(src),r=Math.min(1,max/Math.max(im.width,im.height)),w=Math.max(3,Math.round(im.width*r)),h=Math.max(3,Math.round(im.height*r)),c=document.createElement("canvas");c.width=w;c.height=h;var x=c.getContext("2d");x.drawImage(im,0,0,w,h);var d=x.getImageData(0,0,w,h);x.putImageData(new ImageData(hrany(d.data,w,h),w,h),0,0);return c.toDataURL("image/png")}
function jeFotka(a){return !!a&&!a.isInline&&/^image\/(jpeg|png|webp)$/i.test(a.contentType||"")&&(a.size||0)>20000&&(a.size||0)<12000000}
W.SKICA={hrany:hrany,vykresli:vykresli,jeFotka:jeFotka};
if(typeof module!="undefined")module.exports=W.SKICA;
if(typeof window=="undefined"||!window.document)return;
/* detail případu (0.87.0): fotky zákazníka se berou ze složky objektu na webu Zakázky ELZA (Podklady objektu / Fotky a podklady od zákazníka), ne z portálu;
   na portál se nahrávají až odtud. Co v podkladech není, vloží člověk ručně (vlastní fotka). Jen čtení, nic se neukládá. */
function es(s){return typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function obj(x){var t=[x&&x.Klice,x&&x.PoznamkaPripadu,x&&x.Title,x&&x.Predmet].join(" "),m=/OBJ\d{5}/i.exec(t);return m?m[0].toUpperCase():""}
function zaklad(){try{return localStorage.getItem("elzaSlozkyZaklad")||"Shared Documents/Zakazky"}catch(e){return"Shared Documents/Zakazky"}}
function cesta(o){return SDL.ZS+"/"+zaklad().replace(/^\/+|\/+$/g,"")+"/"+STRUKTURA.slozka({obj:o,typ:"foto_zakaznik"})}
W.SKICA.cesta=cesta;W.SKICA.obj=obj;
W.SKICA.boxPripadu=function(x){return '<details id=skbox><summary>Skica budovy z fotky zákazníka</summary><p class=note>Fotka se hledá ve složce objektu na webu Zakázky ELZA (Fotky a podklady od zákazníka). Co tam není, vložte ručně. Nic se neukládá ani neposílá.</p><div class=in><label>Objekt <input data-skobj value="'+es(obj(x))+'" placeholder="OBJ02666" style="width:120px"></label> <button class=g data-skh>Najít fotky v podkladech</button> <label>nebo vlastní fotka <input type=file accept="image/jpeg,image/png,image/webp" data-skf></label></div><div data-skl></div><div data-sko></div></details>'};
function ukaz(bx,du,nm){bx.innerHTML='<img alt="Skica budovy" style="max-width:100%;border:1px solid #cdd5df;border-radius:6px" src="'+du+'"><p><a class=g download="'+es(nm)+'" href="'+du+'">Stáhnout skicu (PNG)</a></p>'}
document.addEventListener("click",async function(e){var h=e.target.closest&&e.target.closest("[data-skh],[data-skp]");if(!h)return;var d=h.closest("#skbox");if(!d)return;var lst=d.querySelector("[data-skl]"),out=d.querySelector("[data-sko]");
 try{if(h.hasAttribute("data-skh")){var o=d.querySelector("[data-skobj]").value.trim().toUpperCase();if(!/^OBJ\d{5}$/.test(o)){lst.innerHTML='<p class=note>Doplňte kód objektu (OBJ + 5 číslic).</p>';return}
   lst.innerHTML='<p class=note>Hledám…</p>';var f=await SDL.files(cesta(o));if(f===null){lst.innerHTML='<p class=note>Složka s fotkami zákazníka u objektu '+es(o)+' zatím neexistuje. Vložte fotku ručně.</p>';return}
   f=f.filter(function(y){return /\.(jpe?g|png|webp)$/i.test(y.name)});lst.innerHTML=f.length?f.map(function(y){return '<button class=g data-skp="'+es(y.src)+'">✏ '+es(y.name)+'</button>'}).join(" "):'<p class=note>Ve složce nejsou žádné obrázky. Vložte fotku ručně.</p>'}
  else{out.innerHTML='<p class=note>Kreslím skicu…</p>';var bl=await SDL.blob(h.getAttribute("data-skp"));ukaz(out,await vykresli(bl),h.textContent.replace(/^✏ /,"").replace(/\.[^.]+$/,"")+"-skica.png")}}
 catch(er){(out||lst).innerHTML='<p class=note>Nepodařilo se: '+es(er.message)+'</p>'}});
document.addEventListener("change",async function(e){var i=e.target;if(!i.matches||!i.matches("[data-skf]")||!i.files||!i.files[0])return;var out=i.closest("#skbox").querySelector("[data-sko]");out.innerHTML='<p class=note>Kreslím skicu…</p>';
 try{ukaz(out,await vykresli(i.files[0]),i.files[0].name.replace(/\.[^.]+$/,"")+"-skica.png")}catch(er){out.innerHTML='<p class=note>Nepodařilo se: '+es(er.message)+'</p>'}});
})();
