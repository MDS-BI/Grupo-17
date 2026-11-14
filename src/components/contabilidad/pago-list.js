import { formatoMoneda, formatoFecha, escapeHtml, insigniaEstado } from './comun.js';

function nombreEntidad(entidades, entityId) {
  const entidad = entidades.find((e) => e.entity_id === entityId);
  return entidad ? entidad.name : 'Entidad desconocida';
}

function acciones(pago) {
  const botones = [
    `<button type="button" class="secondary" data-action="ver-pago" data-id="${escapeHtml(pago.id)}">Detalle</button>`,
    `<button type="button" class="secondary" data-action="editar-pago" data-id="${escapeHtml(pago.id)}">Editar</button>`
  ];
  if (pago.status === 'pendiente') {
    botones.push(`<button type="button" class="danger" data-action="eliminar-pago" data-id="${escapeHtml(pago.id)}">Eliminar</button>`);
  }
  if (pago.status !== 'cancelado') {
    botones.push(`<button type="button" class="danger" data-action="cancelar-pago" data-id="${escapeHtml(pago.id)}">Cancelar</button>`);
  }
  return botones.join('');
}

export function renderPagoList(container, pagos, { entidades = [], tipo = '', entityId = '' } = {}) {
  if (!container) return false;
  container.innerHTML = '';
  const filtrados = pagos.filter((p) => (!tipo || p.tipo === tipo) && (!entityId || p.entity_id === entityId));
  if (filtrados.length === 0) return false;
  const tabla = document.createElement('table');
  tabla.className = 'tabla-financiera';
  tabla.innerHTML = `
    <thead>
      <tr><th scope="col">Número</th><th scope="col">Fecha</th><th scope="col">Tipo</th><th scope="col">Entidad</th><th scope="col" class="num">Monto</th><th scope="col">Método</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr>
    </thead>
    <tbody></tbody>`;
  const cuerpo = tabla.querySelector('tbody');
  for (const pago of filtrados) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${escapeHtml(pago.numero)}</td>
      <td>${formatoFecha(pago.date)}</td>
      <td><span class="tipo-badge tipo-${escapeHtml(pago.tipo)}">${escapeHtml(pago.tipo)}</span></td>
      <td>${escapeHtml(nombreEntidad(entidades, pago.entity_id))}</td>
      <td class="num">${formatoMoneda(pago.amount)}</td>
      <td>${escapeHtml(pago.method || '—')}</td>
      <td>${insigniaEstado(pago.status)}</td>
      <td class="acciones">${acciones(pago)}</td>`;
    cuerpo.appendChild(fila);
  }
  container.appendChild(tabla);
  return true;
}

export function renderPagoDetalle(container, pago, { entidades = [], documentos = [], asientos = [] } = {}) {
  if (!container) return;
  if (!pago) {
    container.innerHTML = '';
    container.hidden = true;
    return;
  }
  const documento = documentos.find((d) => d.id === pago.document_id);
  const asiento = asientos.find((a) => a.id === pago.asiento_id);
  container.hidden = false;
  container.innerHTML = `
    <h3>Detalle del pago ${escapeHtml(pago.numero)}</h3>
    <dl class="detalle-pago">
      <div><dt>Tipo</dt><dd>${escapeHtml(pago.tipo)}</dd></div>
      <div><dt>Fecha</dt><dd>${formatoFecha(pago.date)}</dd></div>
      <div><dt>Entidad</dt><dd>${escapeHtml(nombreEntidad(entidades, pago.entity_id))}</dd></div>
      <div><dt>Monto</dt><dd class="num">${formatoMoneda(pago.amount)}</dd></div>
      <div><dt>Método</dt><dd>${escapeHtml(pago.method || '—')}</dd></div>
      <div><dt>Estado</dt><dd>${insigniaEstado(pago.status)}</dd></div>
      <div><dt>Documento</dt><dd>${documento ? escapeHtml(`${documento.series || 'DOC'}-${documento.folio}`) : '—'}</dd></div>
      <div><dt>Asiento</dt><dd>${asiento ? escapeHtml(`${asiento.series || ''}-${asiento.folio}`) : '—'}</dd></div>
      <div><dt>Notas</dt><dd>${escapeHtml(pago.notes || '—')}</dd></div>
    </dl>`;
}
