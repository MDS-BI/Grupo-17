import { escapeHtml, formatoMoneda } from './comun.js';
import { ESTADOS_VISIBLES, formatearResumen } from '../../contabilidad/resumen-pagos.js';

const ETIQUETAS = Object.freeze({
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  vencido: 'Vencido'
});

export function renderizarResumenPagos(contenedor, resumen, filtro = 'todos', vacio = false) {
  if (!contenedor) return;
  const formateado = formatearResumen(resumen);
  contenedor.innerHTML = ESTADOS_VISIBLES.map((estado) => {
    const grupo = formateado[estado];
    const activo = filtro === estado ? ' activo' : '';
    return `<article class="resumen-pago-card${activo}" data-estado="${estado}" data-total-centavos="${grupo.totalCentavos}">
      <h3>${ETIQUETAS[estado]}</h3>
      <strong>${escapeHtml(grupo.total)}</strong>
      <span>${grupo.cantidad} movimiento${grupo.cantidad === 1 ? '' : 's'}</span>
    </article>`;
  }).join('');
  const estadoVacio = document.getElementById('pago-resumen-empty');
  if (estadoVacio) estadoVacio.hidden = !vacio;
}

export function renderizarFiltroEstado(select, filtro = 'todos') {
  if (!select) return;
  select.value = filtro;
  select.dispatchEvent(new window.CustomEvent('pagos:filtro-cambiado', { detail: { filtro } }));
}

export function resumenDesdePagos(pagos, fechaActual = new Date(), resumirPagos) {
  return resumirPagos(pagos, fechaActual);
}

export function totalLegible(centavos) {
  return formatoMoneda(centavos);
}
