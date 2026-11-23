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
async function create(names){return SEZ.create(names)}
/* složky: cesta relativně ke knihovně, vytváří se po segmentech, existující se nechá být */
function okCesta(p){if(!/^[A-Za-z0-9 _\-\/.ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž]+$/.test(p)||/\.\./.test(p))throw new Error("Neplatná cesta složky: "+p)}
async function folder(base,rel){if(demo())throw new Error("V ukázkovém režimu se nic nezakládá.");okCesta(base);okCesta(rel);var H=jh(await tkn("AllSites.Write")),cur=ZS+"/"+base.replace(/^\/+|\/+$/g,""),segs=String(rel).split("/").filter(Boolean),made=0;
 for(var i=0;i<segs.length;i++){cur+="/"+segs[i];var r=await fetch(SP+ZS+"/_api/web/folders",{method:"POST",headers:H,body:JSON.stringify({ServerRelativeUrl:cur})});if(!r.ok)throw new Error("Složka "+segs[i]+": HTTP "+r.status);made++}return cur}
/* soubory ve složce jen čtením (stará struktura); cesta je serverově relativní, např. /sites/ZakazkyELZA/Shared Documents/Stare */
function okAbs(p){okCesta(p);if(!/^\/sites\/[A-Za-z0-9_\-]+\//.test(p))throw new Error("Cesta musí začínat /sites/název webu/: "+p)}
function q(p){return encodeURIComponent(String(p).replace(/'/g,"''"))}
async function files(path){okAbs(path);if(demo())return[{name:"TZ_Dodatek k PBŘ.pdf",src:path+"/TZ_Dodatek k PBŘ.pdf",datum:"2024-05-02"},{name:"Revizní zpráva EPS.pdf",src:path+"/Revizní zpráva EPS.pdf",datum:"2025-01-10"},{name:"foto1.jpg",src:path+"/foto1.jpg",datum:"2025-02-01"}];
 await token(false);var web=path.split("/").slice(0,3).join("/"),r=await fetch(SP+web+"/_api/web/GetFolderByServerRelativeUrl('"+q(path)+"')/Files?$select=Name,ServerRelativeUrl,TimeLastModified&$top=5000",{headers:{Authorization:"Bearer "+tok,Accept:"application/json;odata=nometadata"}});
 if(r.status==404)return null;if(!r.ok)throw new Error("Čtení složky selhalo, HTTP "+r.status);return (await r.json()).value.map(function(f){return{name:f.Name,src:f.ServerRelativeUrl,datum:f.TimeLastModified}})}
/* kopie jednoho schváleného souboru do nové struktury; originál zůstává, existující cíl se nepřepíše */
async function copy(src,base,rel){if(demo())throw new Error("V ukázkovém režimu se nic nekopíruje.");okAbs(src);okCesta(base);okCesta(rel);var d=rel.split("/");d.pop();await folder(base,d.join("/"));var H=jh(await tkn("AllSites.Write"));
 var r=await fetch(SP+ZS+"/_api/SP.MoveCopyUtil.CopyFileByPath()",{method:"POST",headers:H,body:JSON.stringify({srcPath:{DecodedUrl:SP+src},destPath:{DecodedUrl:SP+ZS+"/"+base.replace(/^\/+|\/+$/g,"")+"/"+rel},options:{KeepBoth:false,ResetAuthorAndCreatedOnCopy:false,ShouldBypassSharedLocks:false}})});
 if(!r.ok)throw new Error(r.status==409||r.status==400?"cíl už existuje nebo nejde zkopírovat (HTTP "+r.status+")":"kopie selhala, HTTP "+r.status)}
/* ověří, že cílová knihovna a složka existuje (jen čtení) */
async function exists(base){okCesta(base);if(demo())return true;await token(false);var r=await fetch(SP+ZS+"/_api/web/GetFolderByServerRelativeUrl('"+q(ZS+"/"+base.replace(/^\/+|\/+$/g,""))+"')?$select=Exists",{headers:{Authorization:"Bearer "+tok,Accept:"application/json;odata=nometadata"}});if(r.status==404)return false;if(!r.ok)throw new Error("Ověření knihovny selhalo, HTTP "+r.status);return !!(await r.json()).Exists}
W.SDL={files:files,copy:copy,exists:exists,def:def,read:read,write:write,create:create,folder:folder,demo:demo,ZS:ZS};
})();
