async function loadData(){
  const res = await fetch('data/contabilidad.json');
  if(!res.ok){throw new Error('No se pudo cargar contabilidad.json');}
  return res.json();
}

function fillSelect(select, items){
  select.innerHTML='';
  items.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;select.appendChild(o);});
}

function detectNumericColumns(rows){
  if(!rows||rows.length===0) return [];
  const sample=rows[0];
  return Object.keys(sample).filter(k=>typeof sample[k]==='number');
}

function detectCategoricalColumns(rows){
  if(!rows||rows.length===0) return [];
  const sample=rows[0];
  return Object.keys(sample).filter(k=>typeof sample[k]==='string');
}

function buildTable(rows){
  const container=document.getElementById('tableContainer');
  container.innerHTML='';
  const table=document.createElement('table');
  const thead=document.createElement('thead');
  const tbody=document.createElement('tbody');
  if(rows.length===0){container.textContent='Sin registros';return;}
  const headers=Object.keys(rows[0]);
  const htr=document.createElement('tr');
  headers.forEach(h=>{const th=document.createElement('th');th.textContent=h;htr.appendChild(th);});
  thead.appendChild(htr);
  rows.forEach(r=>{
    const tr=document.createElement('tr');
    headers.forEach(h=>{const td=document.createElement('td');td.textContent=r[h];tr.appendChild(td);});
    tbody.appendChild(tr);
  });
  table.appendChild(thead);table.appendChild(tbody);container.appendChild(table);
}

function aggregate(rows, categoryKey, valueKey){
  const acc={};
  rows.forEach(r=>{const cat=r[categoryKey];const val=Number(r[valueKey])||0;acc[cat]=(acc[cat]||0)+val;});
  const labels=Object.keys(acc);const values=labels.map(l=>acc[l]);
  return {labels, values};
}

let chartInstance=null;
function renderChart(data, categoryKey, valueKey){
  if(chartInstance){chartInstance.destroy();}
  const ctx=document.getElementById('chart');
  chartInstance=new Chart(ctx,{type:'bar',data:{labels:data.labels,datasets:[{label:`Suma de ${valueKey}`,data:data.values,backgroundColor:'#0284c7'}]},options:{responsive:true,plugins:{legend:{display:true}},scales:{y:{beginAtZero:true}}}});
}

function exportCSV(rows){
  if(rows.length===0) return;
  const headers=Object.keys(rows[0]);
  const lines=[headers.join(',')].concat(rows.map(r=>headers.map(h=>JSON.stringify(r[h]??'')).join(',')));
  const blob=new Blob([lines.join('\n')],{type:'text/csv'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='export.csv';a.click();
}

(async function init(){
  try{
    const data=await loadData();
    document.getElementById('fuente').textContent='Fuente: '+data.fuente;
    document.getElementById('generado').textContent='Generado: '+new Date(data.generado).toLocaleString();
    const sheetSelect=document.getElementById('sheetSelect');
    const categorySelect=document.getElementById('categorySelect');
    const valueSelect=document.getElementById('valueSelect');
    const quickFilter=document.getElementById('quickFilter');
    const btnExport=document.getElementById('btnExport');

    const sheetNames=Object.keys(data.hojas);
    fillSelect(sheetSelect,sheetNames);

    let currentRows=data.hojas[sheetNames[0]];
    fillSelect(categorySelect,detectCategoricalColumns(currentRows));
    const numericCols=detectNumericColumns(currentRows);
    fillSelect(valueSelect,numericCols);

    function refresh(){
      const sheet=sheetSelect.value;
      currentRows=data.hojas[sheet]||[];
      const filt=quickFilter.value.trim().toLowerCase();
      let filtered=currentRows;
      if(filt){filtered=currentRows.filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(filt)));}
      buildTable(filtered);
      const catCol=categorySelect.value;const valCol=valueSelect.value;
      if(catCol&&valCol){const agg=aggregate(filtered,catCol,valCol);renderChart(agg,catCol,valCol);}else{if(chartInstance){chartInstance.destroy();}}
    }

    sheetSelect.addEventListener('change',()=>{
      currentRows=data.hojas[sheetSelect.value]||[];
      fillSelect(categorySelect,detectCategoricalColumns(currentRows));
      fillSelect(valueSelect,detectNumericColumns(currentRows));
      refresh();
    });
    categorySelect.addEventListener('change',refresh);
    valueSelect.addEventListener('change',refresh);
    quickFilter.addEventListener('input',refresh);
    btnExport.addEventListener('click',()=>exportCSV(currentRows));

    refresh();
  }catch(err){
    document.body.innerHTML='<h2>Error cargando datos</h2><pre>'+err.message+'</pre>';
  }
})();
