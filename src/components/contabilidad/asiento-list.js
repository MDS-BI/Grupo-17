import { formatoMoneda, formatoFecha, escapeHtml, insigniaEstado, filtrarYPaginar, encabezadoOrdenable } from './comun.js';
import { lineasDeAsiento } from '../../contabilidad/asientos.js';
import { renderizarHistorialMovimiento } from './registro-actividad.js';

function acciones(asiento, puedeVerHistorial) {
  const botones = [];
  botones.push(`<button type="button" class="secondary" data-action="ver-detalle-asiento" data-id="${escapeHtml(asiento.id)}">Detalle</button>`);
  if (puedeVerHistorial) {
    botones.push(`<button type="button" class="secondary" data-action="ver-historial-asiento" data-id="${escapeHtml(asiento.id)}">Historial</button>`);
  }
  if (asiento.soloLectura) return botones.join('');
  if (asiento.status === 'borrador') {
    botones.push(`<button type="button" class="secondary" data-action="editar-asiento" data-id="${escapeHtml(asiento.id)}">Editar</button>`);
    botones.push(`<button type="button" class="primary" data-action="aprobar-asiento" data-id="${escapeHtml(asiento.id)}">Aprobar</button>`);
    botones.push(`<button type="button" class="danger" data-action="eliminar-asiento" data-confirmar-eliminacion data-id="${escapeHtml(asiento.id)}">Eliminar</button>`);
  }
  if (asiento.status !== 'cancelado') {
    botones.push(`<button type="button" class="danger" data-action="cancelar-asiento" data-confirmar-eliminacion data-id="${escapeHtml(asiento.id)}">Cancelar</button>`);
  }
  return botones.join('');
}

export function renderAsientoList(container, asientos, opciones = {}) {
  if (!container) return false;
  const orden = opciones.orden;
  const puedeVerHistorial = opciones.puedeVerHistorial !== false;
  container.innerHTML = '';
  if (!asientos || asientos.length === 0) return false;
  const resultado = filtrarYPaginar(asientos, opciones.filtro, {
    pagina: opciones.pagina,
    tamano: opciones.tamano,
    campos: ['numero', 'series', 'folio', 'concept', 'status']
  });
  if (resultado.registros.length === 0) return false;
  const tabla = document.createElement('table');
  tabla.className = 'tabla-financiera';
  tabla.innerHTML = `
    <caption class="muted">Asientos contables ordenados por fecha</caption>
    <thead>
      <tr>
        <th scope="col">Número</th>
        ${encabezadoOrdenable('asientos', 'date', 'Fecha', 'date', orden)}
        <th scope="col">Concepto</th>
        <th scope="col">Líneas</th>
        ${encabezadoOrdenable('asientos', 'totalDebit', 'Débitos', 'amount', orden, 'num')}
        ${encabezadoOrdenable('asientos', 'totalCredit', 'Créditos', 'amount', orden, 'num')}
        ${encabezadoOrdenable('asientos', 'status', 'Estado', 'status', orden)}
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>`;
  const cuerpo = tabla.querySelector('tbody');
  for (const asiento of resultado.registros) {
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
      <td class="acciones">${acciones(asiento, puedeVerHistorial)}</td>`;
    cuerpo.appendChild(fila);
  }
  container.appendChild(tabla);
  container.dataset.paginaActual = String(resultado.pagina);
  container.dataset.totalPaginas = String(resultado.totalPaginas);
  container.dataset.totalRegistros = String(resultado.total);
  return true;
}

export function renderAsientoDetalle(container, asiento, { eventos = [], puedeVerHistorial = true } = {}) {
  if (!container) return;
  if (!asiento) {
    container.innerHTML = '';
    container.hidden = true;
    delete container.dataset.movimientoId;
    return;
  }
  const lineas = asiento.lines || lineasDeAsiento(asiento.id);
  container.hidden = false;
  container.dataset.movimientoId = asiento.id;
  container.innerHTML = `
    <h3>Detalle del asiento ${escapeHtml(`${asiento.series || ''}-${asiento.folio}`)}</h3>
    <dl class="detalle-pago">
      <div><dt>Concepto</dt><dd>${escapeHtml(asiento.concept || '—')}</dd></div>
      <div><dt>Fecha</dt><dd>${formatoFecha(asiento.date)}</dd></div>
      <div><dt>Estado</dt><dd>${insigniaEstado(asiento.status)}</dd></div>
      <div><dt>Débitos</dt><dd class="num">${formatoMoneda(asiento.totalDebit || 0)}</dd></div>
      <div><dt>Créditos</dt><dd class="num">${formatoMoneda(asiento.totalCredit || 0)}</dd></div>
    </dl>
    <h4>Líneas del asiento</h4>
    <div class="tabla-historial-movimiento-contenedor">
      <table class="tabla-financiera tabla-historial-movimiento">
        <thead>
          <tr>
            <th scope="col">Cuenta</th>
            <th scope="col">Débito</th>
            <th scope="col">Crédito</th>
          </tr>
        </thead>
        <tbody>
          ${lineas.length === 0 ? '<tr><td colspan="3">Sin líneas registradas.</td></tr>' : lineas.map((linea) => `
            <tr>
              <td>${escapeHtml(linea.cuenta_id || '—')}</td>
              <td class="num">${formatoMoneda(linea.debit || 0)}</td>
              <td class="num">${formatoMoneda(linea.credit || 0)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${puedeVerHistorial ? '<h4>Historial de auditoría</h4><div data-historial-detalle="asiento"></div>' : ''}`;
  if (puedeVerHistorial) {
    renderizarHistorialMovimiento(container.querySelector('[data-historial-detalle]'), eventos, { visible: true });
  }
}
