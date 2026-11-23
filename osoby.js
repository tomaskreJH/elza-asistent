/* ELZA Asistent: Osoby (klíč osoby = osobní číslo). Kopie Zamestnanec má řádek na osobu a agendu (106 řádků = 65 lidí); osoba se skládá podle osobního čísla.
   E-mail osoby (klíč pro školení, kalendář, týmy) se navrhuje jako příjmení@elzy.cz bez diakritiky a vždy se potvrzuje člověkem. Kvalifikace osoby určuje, kdo smí dělat kterou fázi.
   Čistá logika bez přístupu k datům (testy: test/osoby.test.js). Nic se nezapisuje. */
(function(){var W=typeof window!="undefined"?window:globalThis;
function nrm(s){return String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim()}
function tok(s){return nrm(s).split(" ").filter(Boolean).sort().join(" ")}
/* "Příjmení Jméno" -> {pr, jm} (první slovo je příjmení) */
function jmeno(s){var w=String(s||"").trim().split(/\s+/);return{pr:w[0]||"",jm:w.slice(1).join(" ")}}
function emailTvar(s){var p=nrm(jmeno(s).pr).replace(/ /g,"");return p?p+"@elzy.cz":""}
/* rows: [{id,os,jm}] -> osoby: [{os,jm,n,ids,konflikt,email}] */
function sloucit(rows){var m={},ord=[];(rows||[]).forEach(function(r){var k=r.os?"os:"+String(r.os).trim():"id:"+r.id;var o=m[k];if(!o){o=m[k]={os:r.os||"",jm:r.jm||"",n:0,ids:[],jmena:{},konflikt:false};ord.push(k)}o.n++;o.ids.push(r.id);if(r.jm){o.jmena[tok(r.jm)]=1;if(!o.jm)o.jm=r.jm}});
 return ord.map(function(k){var o=m[k];o.konflikt=Object.keys(o.jmena).length>1;delete o.jmena;o.email=emailTvar(o.jm);return o})}
/* schránky: [{email,jmeno}] z tenantu; vrací {email, jistota:"shoda"|"tvar"|""} */
function email(o,schranky){var t=tok(o.jm);var f=(schranky||[]).filter(function(s){return tok(s.jmeno)==t})[0];if(f)return{email:f.email,jistota:"shoda"};var g=emailTvar(o.jm);var h=(schranky||[]).filter(function(s){return String(s.email).toLowerCase()==g})[0];return h?{email:h.email,jistota:"tvar"}:{email:"",jistota:""}}
/* kvalifikace: [{email,typ,platnost}] ; platnost "RRRR-MM-DD" nebo prázdná = bez omezení */
function ma(kv,mail,typ,kdy){var d=kdy||new Date().toISOString().slice(0,10);return(kv||[]).some(function(k){return String(k.email).toLowerCase()==String(mail).toLowerCase()&&nrm(k.typ)==nrm(typ)&&(!k.platnost||String(k.platnost).slice(0,10)>=d)})}
function schopni(osoby,kv,typ,kdy){return osoby.filter(function(o){return o.email&&ma(kv,o.email,typ,kdy)})}
/* upozornění na platnost: kvalifikace, které vyprší do dní */
function brzy(kv,dni,kdy){var d0=new Date(kdy||Date.now()),lim=new Date(d0.getTime()+dni*864e5).toISOString().slice(0,10),dnes=d0.toISOString().slice(0,10);return(kv||[]).filter(function(k){return k.platnost&&String(k.platnost).slice(0,10)<=lim}).map(function(k){return{email:k.email,typ:k.typ,platnost:k.platnost,prosle:String(k.platnost).slice(0,10)<dnes}})}
W.OSOBY={nrm:nrm,jmeno:jmeno,emailTvar:emailTvar,sloucit:sloucit,email:email,ma:ma,schopni:schopni,brzy:brzy};
W.osoby=async function(force){if(!W.zamestnanci)return[];return sloucit(await W.zamestnanci(force))};
if(typeof module!="undefined")module.exports=W.OSOBY;
})();
