var a=require('assert'),S=require('../skica.js');
var w=40,h=30,d=new Uint8ClampedArray(w*h*4);for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=(y*w+x)*4,v=(x>=15&&x<30&&y>=8&&y<24)?30:220;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}
var o=S.hrany(d,w,h);a.equal(o.length,w*h*4);
function px(x,y){var i=(y*w+x)*4;return o[i]}
a.ok(px(5,5)>240&&px(22,15)>240,'plocha je bílý papír');a.ok(px(15,15)<150||px(14,15)<150,'okraj budovy je čára');a.equal(o[3],255);
var f=new Uint8ClampedArray(w*h*4).fill(128);var of=S.hrany(f,w,h);var tmav=0;for(var j=0;j<w*h;j++)if(of[j*4]<200)tmav++;a.equal(tmav,0,'jednobarevná fotka nemá čáry');
a.ok(S.jeFotka({contentType:'image/jpeg',size:400000}));a.ok(!S.jeFotka({contentType:'image/png',size:3000}),'logo/podpis ne');a.ok(!S.jeFotka({contentType:'image/png',size:400000,isInline:true}));a.ok(!S.jeFotka({contentType:'application/pdf',size:400000}));
console.log('skica OK');
