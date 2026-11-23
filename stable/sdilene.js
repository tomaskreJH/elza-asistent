/* ELZA Asistent: sdílené ukládání (0.50.0). Malá společná vrstva nad SharePointem (web Zakázky ELZA): čtení po dávkách, zápis, zakládání seznamů a složek.
   Zapisuje jen do seznamů, které si moduly samy popíšou přes SDL.def, a jen po klepnutí uživatele. Nic se nemaže (zrušené záznamy mají Stav = zruseno nebo zpracovano).
   Používají ji Analýza vstupu (postupy a zpětná vazba), Složky zakázky a Hlídání nabídek. Test: test/sdilene.py. */
(function(){var W=window,ZS="/sites/ZakazkyELZA",SCH={},DESC={};
function demo(){return /[?&]demo=1/.test(location.search)}
function sb(l){return SP+ZS+"/_api/web/lists/getbytitle('"+l+"')"}
function jh(t){return{Authorization:"Bearer "+t,Accept:"application/json;odata=nometadata","Content-Type":"application/json;odata=nometadata"}}
async function tkn(sc){var S=[SP+"/"+sc];try{return(await m.acquireTokenSilent({scopes:S,account:acc})).accessToken}catch(e){return(await m.acquireTokenPopup({scopes:S,account:acc})).accessToken}}
/* popis seznamu: pole [název, druh (2 text, 3 víc řádků, 4 datum, 9 číslo), indexovat] */
function def(l,fields,desc){SCH[l]=fields;DESC[l]=desc||"ELZA asistent"}
function sel(l){return"Id,Title,"+(SCH[l]||[]).map(function(f){return f[0]}).join(",")}
async function read(l,flt){if(demo())return[];await token(false);var a=[],last=0;for(;;){var u=sb(l)+"/items?$select="+sel(l)+"&$filter=Id gt "+last+(flt?" and "+flt:"")+"&$orderby=Id&$top=500";var r=await fetch(u,{headers:{Authorization:"Bearer "+tok,Accept:"application/json;odata=nometadata"}});if(r.status==404)return null;if(!r.ok)throw new Error(l+": čtení selhalo, HTTP "+r.status);var j=(await r.json()).value;a=a.concat(j);if(j.length<500)break;last=j[j.length-1].Id}return a}
async function write(l,id,b){if(demo())throw new Error("V ukázkovém režimu se nic nezapisuje.");if(!SCH[l])throw new Error("Zápis je povolen jen do seznamů, které modul popsal.");var h=jh(await tkn("AllSites.Write"));if(id){h["IF-MATCH"]="*";h["X-HTTP-Method"]="MERGE"}var r=await fetch(sb(l)+"/items"+(id?"("+id+")":""),{method:"POST",headers:h,body:JSON.stringify(b)});if(!r.ok)throw new Error(l+": zápis selhal, HTTP "+r.status)}
/* založí chybějící seznamy a sloupce (po klepnutí; nic nemaže) */
async function create(names){if(demo())throw new Error("V ukázkovém režimu se nic nezakládá.");var H=jh(await tkn("AllSites.Manage")),M=Object.assign({"IF-MATCH":"*","X-HTTP-Method":"MERGE"},H),n=0;
 for(var i=0;i<names.length;i++){var l=names[i],fl=SCH[l];if(!fl)continue;var r=await fetch(SP+ZS+"/_api/web/lists",{method:"POST",headers:H,body:JSON.stringify({Title:l,BaseTemplate:100,Description:DESC[l]})});if(!r.ok&&r.status!=409&&r.status!=500)throw new Error("Seznam "+l+": HTTP "+r.status);
  for(var k=0;k<fl.length;k++){var f=fl[k];await fetch(sb(l)+"/fields",{method:"POST",headers:H,body:JSON.stringify({Title:f[0],FieldTypeKind:f[1]})});if(f[2])await fetch(sb(l)+"/fields/getbytitle('"+f[0]+"')",{method:"POST",headers:M,body:JSON.stringify({Indexed:true})})}
  await fetch(sb(l)+"/fields/getbytitle('Title')",{method:"POST",headers:M,body:JSON.stringify({Indexed:true})});n++}return n}
/* složky: cesta relativně ke knihovně, vytváří se po segmentech, existující se nechá být */
function okCesta(p){if(!/^[A-Za-z0-9 _\-\/.ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž]+$/.test(p)||/\.\./.test(p))throw new Error("Neplatná cesta složky: "+p)}
async function folder(base,rel){if(demo())throw new Error("V ukázkovém režimu se nic nezakládá.");okCesta(base);okCesta(rel);var H=jh(await tkn("AllSites.Write")),cur=ZS+"/"+base.replace(/^\/+|\/+$/g,""),segs=String(rel).split("/").filter(Boolean),made=0;
 for(var i=0;i<segs.length;i++){cur+="/"+segs[i];var r=await fetch(SP+ZS+"/_api/web/folders",{method:"POST",headers:H,body:JSON.stringify({ServerRelativeUrl:cur})});if(!r.ok)throw new Error("Složka "+segs[i]+": HTTP "+r.status);made++}return cur}
W.SDL={def:def,read:read,write:write,create:create,folder:folder,demo:demo,ZS:ZS};
})();
