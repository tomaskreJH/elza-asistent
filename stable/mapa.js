/* Workflow a vazby ze SharePointu. */
(function(){
const sample=[
 {FromId:'Pošta',ToId:'Případ',RelationType:'Přiřadí vlákno',Condition:'Po ověření shody'},
 {FromId:'Případ',ToId:'Nabídka',RelationType:'Předá zadání'},
 {FromId:'Nabídka',ToId:'Zakázka',RelationType:'Založí podklady',Condition:'Po přijetí nabídky'},
 {FromId:'Zakázka',ToId:'Portál',RelationType:'Zobrazí zveřejněný stav'}
];
let edges=[], selected='';
function text(s){return String(s||'').trim()}
async function mapa(){
 try{
  const rows=tok==='demo'?sample:await list('Workflow a vazby','FromId,ToId,RelationType,Condition');
  edges=rows.map(row=>({from:text(row.FromId),to:text(row.ToId),relation:text(row.RelationType),condition:text(row.Condition)})).filter(row=>row.from&&row.to);
 }catch(e){return '<h1>Mapa vazeb</h1><p role=status>Vazby se nepodařilo načíst. '+esc(e.message)+'</p>'}
 const labels=[...new Set(edges.flatMap(row=>[row.from,row.to]))].sort((a,b)=>a.localeCompare(b,'cs'));
 if(!labels.length)return '<h1>Mapa vazeb</h1><p class=note>V seznamu Workflow a vazby nejsou žádné platné vazby.</p>';
 if(!labels.includes(selected))selected=labels.includes('Případ')?'Případ':labels[0];
 return '<h1>Mapa vazeb</h1><div class=bar><label for=map-node>Vyberte položku</label><select id=map-node>'+
  labels.map(name=>'<option value="'+esc(name)+'"'+(name===selected?' selected':'')+'>'+esc(name)+'</option>').join('')+
  '</select></div><div id=map-edges aria-live=polite></div>';
}
function draw(){
 const root=document.getElementById('map-edges');
 if(!root)return;
 function group(title,rows,key){
  return '<section class=flow-stage><h2>'+title+'</h2>'+
   (rows.length?'<ul>'+rows.map(row=>'<li><button class=g data-map-node="'+esc(row[key])+'">'+esc(row[key])+'</button>'+
    '<p>'+esc(row.relation||'Vazba')+(row.condition?' · '+esc(row.condition):'')+'</p></li>').join('')+'</ul>':'<p class=note>Žádné vazby.</p>')+'</section>';
 }
 root.innerHTML='<h2>'+esc(selected)+'</h2><div class=map-directions>'+
  group('Co vstupuje',edges.filter(row=>row.to===selected),'from')+
  group('Kam pokračuje',edges.filter(row=>row.from===selected),'to')+'</div>';
}
function bind(){
 const select=document.getElementById('map-node'),root=document.getElementById('map-edges');
 if(!select||!root)return;
 select.onchange=()=>{selected=select.value;draw()};
 root.onclick=e=>{
  const b=e.target.closest('[data-map-node]');
  if(!b)return;
  selected=select.value=b.dataset.mapNode;
  draw();
  select.focus();
 };
 draw();
}
window.MODS=window.MODS||{};
window.MODS.mapa=[mapa,bind];
})();
