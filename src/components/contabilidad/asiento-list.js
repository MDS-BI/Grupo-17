import { formatoMoneda, formatoFecha, escapeHtml, insigniaEstado } from './comun.js';
import { lineasDeAsiento } from '../../contabilidad/asientos.js';

function acciones(asiento) {
  const botones = [];
  if (asiento.status === 'borrador') {
    botones.push(`<button type="button" class="secondary" data-action="editar-asiento" data-id="${escapeHtml(asiento.id)}">Editar</button>`);
    botones.push(`<button type="button" class="primary" data-action="aprobar-asiento" data-id="${escapeHtml(asiento.id)}">Aprobar</button>`);
    botones.push(`<button type="button" class="danger" data-action="eliminar-asiento" data-id="${escapeHtml(asiento.id)}">Eliminar</button>`);
  }
  if (asiento.status !== 'cancelado') {
    botones.push(`<button type="button" class="danger" data-action="cancelar-asiento" data-id="${escapeHtml(asiento.id)}">Cancelar</button>`);
  }
  return botones.join('');
}

export function renderAsientoList(container, asientos) {
  if (!container) return false;
  container.innerHTML = '';
  if (!asientos || asientos.length === 0) return false;
  const tabla = document.createElement('table');
  tabla.className = 'tabla-financiera';
  tabla.innerHTML = `
    <caption class="muted">Asientos contables ordenados por fecha</caption>
    <thead>
      <tr><th scope="col">Número</th><th scope="col">Fecha</th><th scope="col">Concepto</th><th scope="col">Líneas</th><th scope="col" class="num">Débitos</th><th scope="col" class="num">Créditos</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr>
    </thead>
    <tbody></tbody>`;
  const cuerpo = tabla.querySelector('tbody');
  for (const asiento of asientos) {
    const fila = document.createElement('tr');
    const lineas = lineasDeAsiento(asiento.id).length;
    fila.innerHTML = `
      <td>${escapeHtml(`${asiento.series || ''}-${asiento.folio}`)}</td>
      <td>${formatoFecha(asiento.date)}</td>
      <td>${escapeHtml(asiento.concept)}</td>
      <td class="num">${lineas}</td>
      <td class="num">${formatoMoneda(asiento.totalDebit)}</td>
      <td class="num">${formatoMoneda(asiento.totalCredit)}</td>
      <td>${insigniaEstado(asiento.status)}</td>
      <td class="acciones">${acciones(asiento)}</td>`;
    cuerpo.appendChild(fila);
  }
  container.appendChild(tabla);
  return true;
}
