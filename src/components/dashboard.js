import { listarPeriodos } from '../contabilidad/periodos.js';
import { calcularResumen, asientosAprobadosDelPeriodo } from '../contabilidad/reportes.js';
import { formatearCLP } from '../contabilidad/dinero.js';
import { formatearFecha } from '../contabilidad/fechas.js';
import { escapeHtml } from './contabilidad/comun.js';
import { alertasDeVencimientos } from '../contabilidad/alertas-vencimientos.js';
import { loadPagos } from '../contabilidad/almacenamiento.js';
import { loadEntities } from '../storage.js';

function setText(id, text){
  const elemento = document.getElementById(id);
  if(elemento) elemento.textContent = text;
}

function elegirPeriodoDashboard(periodos, preferido = ''){
  if(preferido && periodos.some(p => p.id === preferido)) return preferido;
  const asientos = asientosAprobadosDelPeriodo();
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

function renderBloqueAlerta(contenedor, alerta, titulo, clase){
  if(!contenedor) return;
  const detalles = (alerta.detalles || []).map((detalle) => `
    <li class="alerta-detalle-item">
      <span class="alerta-detalle-entidad">${escapeHtml(detalle.entidad)}</span>
      <span class="alerta-detalle-monto">${formatearCLP(detalle.montoCentavos)}</span>
      <span class="alerta-detalle-fecha">Vence: ${formatearFecha(detalle.fechaVencimiento)}</span>
    </li>`).join('');
  contenedor.className = `alerta-bloque ${clase}${alerta.cantidad === 0 ? ' alerta-vacia' : ''}`;
  contenedor.innerHTML = `
    <div class="alerta-cabecera">
      <h3 class="alerta-titulo">${escapeHtml(titulo)}</h3>
      <span class="alerta-badge">${alerta.cantidad}</span>
    </div>
    <p class="alerta-total">Total: <strong>${formatearCLP(alerta.totalCentavos)}</strong></p>
    ${alerta.cantidad > 0 ? `<ul class="alerta-detalles">${detalles}</ul>` : '<p class="muted alerta-sin-items">Sin pagos en esta categoría.</p>'}
    ${alerta.adicionales > 0 ? `<p class="muted alerta-adicionales">+${alerta.adicionales} pago(s) adicional(es) con esta condición.</p>` : ''}`;
}

export function renderAlertasTesorero(contenedor, { pagos = [], entidades = [], fechaReferencia = new Date(), visible = false } = {}){
  const raiz = contenedor || document.getElementById('dashboard-alertas');
  if(!raiz) return;
  raiz.hidden = !visible;
  if(!visible) return;
  const alertas = alertasDeVencimientos(pagos, entidades, fechaReferencia);
  renderBloqueAlerta(raiz.querySelector('[data-alerta-vencidos]'), alertas.vencido, 'Pagos vencidos', 'alerta-vencidos');
  renderBloqueAlerta(raiz.querySelector('[data-alerta-semanal]'), alertas.venceEstaSemana, 'Vencen esta semana', 'alerta-semana');
  const sinAlertas = raiz.querySelector('[data-sin-alertas]') || document.getElementById('dashboard-sin-alertas');
  if(sinAlertas) sinAlertas.hidden = !(alertas.vencido.cantidad === 0 && alertas.venceEstaSemana.cantidad === 0);
}

export function renderDashboard(opciones = {}){
  const periodos = listarPeriodos();
  const selector = document.getElementById('dashboard-periodo');
  const periodoId = elegirPeriodoDashboard(periodos, selector ? selector.value : '');
  renderPeriodos(periodos, periodoId);

  const resumen = periodoId
    ? calcularResumen(periodoId)
    : { ingresos: 0, gastos: 0, resultado: 0, movimientos: 0, hayMovimientos: false };

  setText('stat-ingresos', formatearCLP(resumen.ingresos));
  setText('stat-gastos', formatearCLP(resumen.gastos));
  setText('stat-resultado', formatearCLP(resumen.resultado));
  setText('stat-asientos', String(resumen.movimientos));

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

  const pagos = opciones.pagos || loadPagos();
  const entidades = opciones.entidades || loadEntities();
  renderAlertasTesorero(document.getElementById('dashboard-alertas'), {
    pagos,
    entidades,
    fechaReferencia: opciones.fechaReferencia || new Date(),
    visible: Boolean(opciones.mostrarAlertasTesorero)
  });
}
