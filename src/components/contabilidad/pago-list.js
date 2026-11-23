import { formatoMoneda, formatoFecha, escapeHtml, insigniaEstado, filtrarYPaginar } from './comun.js';
import { calcularEstadoPago, filtrarPagos } from '../../contabilidad/resumen-pagos.js';

function nombreEntidad(entidades, entityId) {
  const entidad = entidades.find((e) => e.entity_id === entityId);
  return entidad ? entidad.name : 'Entidad desconocida';
}

function acciones(pago, estado, permitirMarcar) {
  const botones = [
    `<button type="button" class="secondary" data-action="ver-pago" data-id="${escapeHtml(pago.id)}">Detalle</button>`,
    `<button type="button" class="secondary" data-action="editar-pago" data-id="${escapeHtml(pago.id)}">Editar</button>`
  ];
  if (permitirMarcar && estado !== 'pagado') {
    botones.push(`<button type="button" class="secondary" data-action="marcar-pagado" data-id="${escapeHtml(pago.id)}">Marcar pagado</button>`);
  }
  if (pago.status === 'pendiente') {
    botones.push(`<button type="button" class="danger" data-action="eliminar-pago" data-id="${escapeHtml(pago.id)}">Eliminar</button>`);
  }
  if (pago.status !== 'cancelado' && pago.status !== 'pagado') {
    botones.push(`<button type="button" class="danger" data-action="cancelar-pago" data-id="${escapeHtml(pago.id)}">Cancelar</button>`);
  }
  return botones.join('');
}

export function renderPagoList(container, pagos, {
  entidades = [],
  tipo = '',
  entityId = '',
  estado = 'todos',
  fechaActual = new Date(),
  permitirMarcar = true,
  texto = '',
  pagina = 1,
  tamano = 50
} = {}) {
  if (!container) return false;
  container.innerHTML = '';
  const porEstado = filtrarPagos(pagos, estado, fechaActual);
  const porContexto = porEstado.filter((p) => (!tipo || p.tipo === tipo) && (!entityId || p.entity_id === entityId));
  const resultado = filtrarYPaginar(porContexto, texto, {
    pagina,
    tamano,
    campos: ['numero', 'tipo', 'method', 'notes']
  });
  const filtrados = resultado.registros;
  if (filtrados.length === 0) return false;
  const tabla = document.createElement('table');
  tabla.className = 'tabla-financiera';
  tabla.innerHTML = `
    <thead>
      <tr><th scope="col">Número</th><th scope="col">Fecha</th><th scope="col">Vencimiento</th><th scope="col">Tipo</th><th scope="col">Entidad</th><th scope="col" class="num">Monto</th><th scope="col">Método</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr>
    </thead>
    <tbody></tbody>`;
  const cuerpo = tabla.querySelector('tbody');
  for (const pago of filtrados) {
    const estado = calcularEstadoPago(pago, fechaActual);
    const fila = document.createElement('tr');
    fila.dataset.pagoId = pago.id;
    fila.dataset.estadoPago = estado;
    fila.innerHTML = `
      <td>${escapeHtml(pago.numero)}</td>
      <td>${formatoFecha(pago.date)}</td>
      <td>${formatoFecha(pago.fechaVencimiento)}</td>
      <td><span class="tipo-badge tipo-${escapeHtml(pago.tipo)}">${escapeHtml(pago.tipo)}</span></td>
      <td>${escapeHtml(nombreEntidad(entidades, pago.entity_id))}</td>
      <td class="num">${formatoMoneda(pago.amount)}</td>
      <td>${escapeHtml(pago.method || '—')}</td>
      <td>${insigniaEstado(estado)}</td>
      <td class="acciones">${acciones(pago, estado, permitirMarcar)}</td>`;
    cuerpo.appendChild(fila);
  }
  container.appendChild(tabla);
  container.dataset.paginaActual = String(resultado.pagina);
  container.dataset.totalPaginas = String(resultado.totalPaginas);
  container.dataset.totalRegistros = String(resultado.total);
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
