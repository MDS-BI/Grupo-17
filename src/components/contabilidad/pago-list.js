import { formatoMoneda, formatoFecha, escapeHtml, insigniaEstado, filtrarYPaginar, encabezadoOrdenable } from './comun.js';
import { calcularEstadoPago, filtrarPagos } from '../../contabilidad/resumen-pagos.js';
import { calcularEstadoPago as estadoPago } from '../../contabilidad/pagos.js';
import { renderizarHistorialMovimiento } from './registro-actividad.js';

function nombreEntidad(entidades, entityId) {
  const entidad = entidades.find((e) => e.entity_id === entityId);
  return entidad ? entidad.name : 'Cliente o proveedor desconocido';
}

function acciones(pago, estado, permitirMarcar, puedeVerHistorial, puedeEditar, puedeAnular, eliminable = true) {
  const id = escapeHtml(pago.id);
  const menuId = `acciones-pago-${id}`;
  const botones = [
    `<button type="button" class="secondary" data-action="ver-pago" data-id="${id}">Detalle</button>`
  ];
  if (puedeVerHistorial) {
    botones.push(`<button type="button" class="secondary" data-action="ver-historial-pago" data-id="${id}">Historial</button>`);
  }
  if (!pago.soloLectura && estado !== 'anulado' && estado !== 'pagado') {
    if (puedeEditar) {
      botones.push(`<button type="button" class="secondary" data-action="editar-pago" data-id="${id}">Editar</button>`);
    }
    if (permitirMarcar) {
      botones.push(`<button type="button" class="secondary" data-action="marcar-pagado" data-id="${id}">Marcar pagado</button>`);
    }
    if (puedeAnular) {
      if (eliminable && (estado === 'pendiente' || estado === 'vencido')) {
        botones.push(`<button type="button" class="danger" data-action="eliminar-pago" data-confirmar-eliminacion data-id="${id}">Eliminar</button>`);
      }
      botones.push(`<button type="button" class="danger" data-action="cancelar-pago" data-confirmar-eliminacion data-id="${id}">Cancelar</button>`);
    }
  }
  return `
    <div class="acciones-menu">
      <button type="button" class="secondary acciones-menu-toggle" data-acciones-menu="${id}" aria-expanded="false" aria-controls="${menuId}" aria-label="Acciones para ${escapeHtml(pago.numero)}">Acciones</button>
      <div class="acciones-menu-lista" id="${menuId}" hidden>${botones.join('')}</div>
    </div>`;
}

export function renderPagoList(container, pagos, {
  entidades = [],
  tipo = '',
  entityId = '',
  estado = 'todos',
  fechaActual = new Date(),
  permitirMarcar = true,
  puedeEditar = true,
  puedeAnular = true,
  eliminable = true,
  texto = '',
  pagina = 1,
  tamano = 50,
  orden = undefined,
  puedeVerHistorial = true
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
      <tr>
        <th scope="col">Número</th>
        ${encabezadoOrdenable('pagos', 'date', 'Fecha', 'date', orden)}
        ${encabezadoOrdenable('pagos', 'fechaVencimiento', 'Vencimiento', 'date', orden)}
        <th scope="col">Tipo</th>
        <th scope="col">Cliente o proveedor</th>
        ${encabezadoOrdenable('pagos', 'amount', 'Monto', 'amount', orden, 'num')}
        <th scope="col">Método</th>
        ${encabezadoOrdenable('pagos', 'estado', 'Estado', 'status', orden)}
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>`;
  const cuerpo = tabla.querySelector('tbody');
  for (const pago of filtrados) {
    const estadoPagoCalculado = calcularEstadoPago(pago, fechaActual);
    const fila = document.createElement('tr');
    fila.dataset.pagoId = pago.id;
    fila.dataset.estadoPago = estadoPagoCalculado;
    fila.innerHTML = `
      <td>${escapeHtml(pago.numero)}</td>
      <td>${formatoFecha(pago.date)}</td>
      <td>${formatoFecha(pago.fechaVencimiento)}</td>
      <td><span class="tipo-badge tipo-${escapeHtml(pago.tipo)}">${escapeHtml(pago.tipo)}</span></td>
      <td>${escapeHtml(nombreEntidad(entidades, pago.entity_id))}</td>
      <td class="num">${formatoMoneda(pago.amount)}</td>
      <td>${escapeHtml(pago.method || '—')}</td>
      <td>${insigniaEstado(estadoPagoCalculado)}</td>
      <td class="acciones">${acciones(pago, estadoPagoCalculado, permitirMarcar, puedeVerHistorial, puedeEditar, puedeAnular, eliminable)}</td>`;
    cuerpo.appendChild(fila);
  }
  container.appendChild(tabla);
  container.querySelectorAll('[data-acciones-menu]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const menu = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!menu) return;
      const abierto = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!abierto));
      menu.hidden = abierto;
    });
  });
  container.querySelectorAll('.acciones-menu-lista [data-action]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const menu = boton.closest('.acciones-menu-lista');
      const toggle = menu?.previousElementSibling;
      if (!toggle || !menu) return;
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    });
  });
  container.dataset.paginaActual = String(resultado.pagina);
  container.dataset.totalPaginas = String(resultado.totalPaginas);
  container.dataset.totalRegistros = String(resultado.total);
  return true;
}

export function renderPagoDetalle(container, pago, { entidades = [], asientos = [], eventos = [], puedeVerHistorial = true } = {}) {
  if (!container) return;
  if (!pago) {
    container.innerHTML = '';
    container.hidden = true;
    delete container.dataset.movimientoId;
    return;
  }
  const asiento = asientos.find((a) => a.id === pago.asiento_id);
  container.hidden = false;
  container.dataset.movimientoId = pago.id;
  container.innerHTML = `
    <h3>Detalle del pago ${escapeHtml(pago.numero)}</h3>
    <dl class="detalle-pago">
      <div><dt>Tipo</dt><dd>${escapeHtml(pago.tipo)}</dd></div>
      <div><dt>Fecha</dt><dd>${formatoFecha(pago.date)}</dd></div>
      <div><dt>Cliente o proveedor</dt><dd>${escapeHtml(nombreEntidad(entidades, pago.entity_id))}</dd></div>
      <div><dt>Monto</dt><dd class="num">${formatoMoneda(pago.amount)}</dd></div>
      <div><dt>Método</dt><dd>${escapeHtml(pago.method || '—')}</dd></div>
      <div><dt>Estado</dt><dd>${insigniaEstado(estadoPago(pago))}</dd></div>
      <div><dt>Asiento</dt><dd>${asiento ? escapeHtml(`${asiento.series || ''}-${asiento.folio}`) : '—'}</dd></div>
      <div><dt>Notas</dt><dd>${escapeHtml(pago.notes || '—')}</dd></div>
    </dl>
    ${puedeVerHistorial ? '<h4>Historial de auditoría</h4><div data-historial-detalle="pago"></div>' : ''}`;
  if (puedeVerHistorial) {
    renderizarHistorialMovimiento(container.querySelector('[data-historial-detalle]'), eventos, { visible: true });
  }
}
