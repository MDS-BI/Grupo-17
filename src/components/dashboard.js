import { loadAsientos } from '../contabilidad/almacenamiento.js';
import { listarPeriodos } from '../contabilidad/periodos.js';
import { calcularResumen } from '../contabilidad/reportes.js';
import { formatearMXN } from '../contabilidad/dinero.js';

function setText(id, text){
  const elemento = document.getElementById(id);
  if(elemento) elemento.textContent = text;
}

function elegirPeriodoDashboard(periodos, preferido = ''){
  if(preferido && periodos.some(p => p.id === preferido)) return preferido;
  const asientos = loadAsientos();
  const conMovimientos = [...periodos].reverse().find(p => asientos.some(a => a.period_id === p.id));
  const elegido = conMovimientos || periodos[0];
  return elegido ? elegido.id : '';
}

function renderPeriodos(periodos, periodoId){
  const selector = document.getElementById('dashboard-periodo');
  if(!selector) return;

  const anterior = periodoId || selector.value;
  selector.innerHTML = '';

  if(periodos.length === 0){
    const opcion = document.createElement('option');
    opcion.value = '';
    opcion.textContent = 'Sin periodos contables';
    selector.appendChild(opcion);
    selector.disabled = true;
    return;
  }

  selector.disabled = false;
  periodos.forEach(p => {
    const opcion = document.createElement('option');
    opcion.value = p.id;
    opcion.textContent = `${p.name} (${p.status})`;
    selector.appendChild(opcion);
  });

  if(anterior && periodos.some(p => p.id === anterior)) selector.value = anterior;
  else if(periodoId) selector.value = periodoId;
}

export function renderDashboard(){
  const periodos = listarPeriodos();
  const selector = document.getElementById('dashboard-periodo');
  const periodoId = elegirPeriodoDashboard(periodos, selector ? selector.value : '');
  renderPeriodos(periodos, periodoId);

  const resumen = periodoId
    ? calcularResumen(periodoId)
    : { ingresos: 0, gastos: 0, resultado: 0, hayMovimientos: false };
  const asientos = loadAsientos().filter(a => !periodoId || a.period_id === periodoId);

  setText('stat-ingresos', formatearMXN(resumen.ingresos));
  setText('stat-gastos', formatearMXN(resumen.gastos));
  setText('stat-resultado', formatearMXN(resumen.resultado));
  setText('stat-asientos', String(asientos.length));

  const resultado = document.getElementById('stat-resultado');
  if(resultado) resultado.classList.toggle('negative', resumen.resultado < 0);

  const vacio = document.getElementById('dashboard-empty');
  if(vacio){
    if(periodos.length === 0){
      vacio.textContent = 'No hay periodos contables registrados.';
      vacio.hidden = false;
    }else if(!resumen.hayMovimientos){
      vacio.textContent = 'No hay información financiera disponible para el periodo seleccionado.';
      vacio.hidden = false;
    }else{
      vacio.textContent = '';
      vacio.hidden = true;
    }
  }
}
