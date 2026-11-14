import { formatoMoneda, formatoFecha, escapeHtml, poblarSelect, mostrarMensaje } from './comun.js';

export function renderReporte({ periodos = [], periodoId = '', resultado }) {
  const selector = document.getElementById('reportes-periodo');
  poblarSelect(selector, periodos.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.status})`
  })), { valor: periodoId });
  if (selector && periodoId) selector.value = periodoId;

  const datos = resultado || { movimientos: [], totalDebit: 0, totalCredit: 0, vacio: true };
  const cuerpo = document.getElementById('reportes-movimientos');
  const totalDebe = document.getElementById('reportes-total-debitos');
  const totalHaber = document.getElementById('reportes-total-creditos');
  if (cuerpo) {
    cuerpo.innerHTML = '';
    for (const movimiento of datos.movimientos) {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${formatoFecha(movimiento.date)}</td>
        <td>${escapeHtml(movimiento.concept)}</td>
        <td>${escapeHtml(`${movimiento.accountCode} · ${movimiento.accountName}`)}</td>
        <td class="num">${formatoMoneda(movimiento.debit)}</td>
        <td class="num">${formatoMoneda(movimiento.credit)}</td>`;
      cuerpo.appendChild(fila);
    }
  }
  if (totalDebe) totalDebe.textContent = formatoMoneda(datos.totalDebit);
  if (totalHaber) totalHaber.textContent = formatoMoneda(datos.totalCredit);
  mostrarMensaje('reportes-empty', datos.vacio ? 'No existen movimientos registrados para el periodo seleccionado.' : '');
}
