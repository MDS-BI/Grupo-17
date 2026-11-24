import { escapeHtml, formatoFecha, encabezadoOrdenable } from './comun.js';

const ETIQUETAS_ACCION = Object.freeze({
  crear: 'Creación',
  editar: 'Edición',
  anular: 'Anulación',
  aprobar: 'Aprobación',
  cerrar: 'Cierre',
  abrir: 'Apertura',
  acceso: 'Acceso',
  rol: 'Rol'
});

function texto(valor) {
  return String(valor ?? '').trim();
}

function fechaHora(valor) {
  const fecha = texto(valor);
  if (!fecha) return '—';
  const [dia, hora = ''] = fecha.split('T');
  return `${escapeHtml(formatoFecha(dia))}${hora ? ` · ${escapeHtml(hora.slice(0, 5))}` : ''}`;
}

function nombreCampo(campo) {
  const mapa = {
   status: 'Estado', estado: 'Estado', concept: 'Concepto', amount: 'Monto', total: 'Total',
    date: 'Fecha', fechaVencimiento: 'Vencimiento', entity_id: 'Cliente o proveedor', method: 'Método', notes: 'Notas'
  };
  return mapa[campo] || campo;
}

function valorLegible(valor) {
  if (valor === undefined || valor === null || valor === '') return '—';
  if (typeof valor === 'object') {
    try {
      return JSON.stringify(valor);
    } catch (_) {
      return String(valor);
    }
  }
  return String(valor);
}

function cambiosLegibles(evento) {
  const cambios = Array.isArray(evento.camposModificados || evento.cambios) ? evento.camposModificados || evento.cambios : [];
  if (cambios.length === 0) return '—';
  return cambios.map((cambio) => {
    const antes = valorLegible(cambio.valorAnterior);
    const despues = valorLegible(cambio.valorNuevo);
    return `${nombreCampo(cambio.campo)}: ${antes} → ${despues}`;
  }).join('; ');
}

export function renderizarRegistroActividad(contenedor, eventos = [], {
  visible = false,
  filtros = {},
  onFiltros = null,
  orden = undefined
} = {}) {
  if (!contenedor) return null;
  contenedor.hidden = !visible;
  if (!visible) return null;
  const lista = Array.isArray(eventos) ? eventos : [];
  const tipos = [...new Set(lista.map((evento) => texto(evento.tipoMovimiento || evento.entidad)).filter(Boolean))].sort();
  const acciones = [...new Set(lista.map((evento) => texto(evento.accion)).filter(Boolean))].sort();
  const usuarios = [...new Set(lista.map((evento) => texto(evento.usuarioNombre || evento.usuario)).filter(Boolean))].sort();

  const select = (id, etiqueta, opciones, valor) => `
    <div>
      <label for="${id}">${etiqueta}</label>
      <select id="${id}" data-auditoria-filtro="${id}">
        <option value="">Todos</option>
        ${opciones.map((opcion) => `<option value="${escapeHtml(opcion)}"${opcion === valor ? ' selected' : ''}>${escapeHtml(opcion)}</option>`).join('')}
      </select>
    </div>`;

  contenedor.innerHTML = `
    <h2 id="auditoria-heading">Registro de actividad</h2>
    <p class="muted">Historial inmutable de creación, edición y anulación de asientos y pagos.</p>
    <div class="filtros-auditoria">
      ${select('auditoria-filtro-tipo', 'Tipo', tipos, filtros.tipoMovimiento || '')}
      ${select('auditoria-filtro-accion', 'Acción', acciones, filtros.accion || '')}
      ${select('auditoria-filtro-usuario', 'Usuario', usuarios, filtros.usuario || '')}
    </div>
    <p id="auditoria-total-resultados" class="muted" aria-live="polite">${lista.length} evento(s)</p>
    <div id="auditoria-empty" class="empty"${lista.length === 0 ? '' : ' hidden'}>No hay eventos de auditoría para los filtros seleccionados.</div>
    <div class="tabla-auditoria-contenedor">
      <table class="tabla-financiera tabla-auditoria">
        <thead>
          <tr>
            ${encabezadoOrdenable('registro-actividad', 'timestamp', 'Fecha y hora', 'date', orden)}
            <th scope="col">Usuario</th>
            <th scope="col">RUT</th>
            <th scope="col">Rol</th>
            ${encabezadoOrdenable('registro-actividad', 'accion', 'Acción', 'status', orden)}
            <th scope="col">Movimiento</th>
            <th scope="col">Cambios</th>
          </tr>
        </thead>
        <tbody>
          ${lista.map((evento) => `
            <tr>
              <td>${fechaHora(evento.timestamp || evento.fechaHora)}</td>
              <td>${escapeHtml(evento.usuarioNombre || evento.usuario || 'sistema')}</td>
              <td>${escapeHtml(evento.usuarioRut || 'sistema')}</td>
              <td>${escapeHtml(evento.rolNombre || evento.rol || 'sistema')}</td>
              <td>${escapeHtml(ETIQUETAS_ACCION[evento.accion] || evento.accion || '—')}</td>
              <td>${escapeHtml(evento.numero || evento.entidadId || evento.entidad || '—')}</td>
              <td>${escapeHtml(cambiosLegibles(evento))}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  contenedor.__onFiltrosAuditoria = typeof onFiltros === 'function' ? onFiltros : null;
  if (contenedor.__auditoriaConectada) return { eventos: lista, filtros };
  contenedor.__auditoriaConectada = true;
  contenedor.addEventListener('change', (evento) => {
    const control = evento.target.closest('[data-auditoria-filtro]');
    if (!control || !contenedor.contains(control)) return;
    const siguiente = {
      tipoMovimiento: contenedor.querySelector('[data-auditoria-filtro="auditoria-filtro-tipo"]')?.value || '',
      accion: contenedor.querySelector('[data-auditoria-filtro="auditoria-filtro-accion"]')?.value || '',
      usuario: contenedor.querySelector('[data-auditoria-filtro="auditoria-filtro-usuario"]')?.value || ''
    };
    contenedor.__onFiltrosAuditoria?.(siguiente);
  });
  return { eventos: lista, filtros };
}

export function renderizarHistorialMovimiento(contenedor, eventos = [], { visible = true } = {}) {
  if (!contenedor) return null;
  const lista = Array.isArray(eventos) ? eventos : [];
  contenedor.innerHTML = `
    <p id="historial-movimiento-empty" class="empty"${lista.length === 0 ? '' : ' hidden'}>No hay eventos de auditoría para este movimiento.</p>
    <div class="tabla-historial-movimiento-contenedor">
      <table class="tabla-financiera tabla-historial-movimiento">
        <thead>
          <tr>
            <th scope="col">Fecha y hora</th>
            <th scope="col">Usuario</th>
            <th scope="col">RUT</th>
            <th scope="col">Rol</th>
            <th scope="col">Acción</th>
            <th scope="col">Descripción</th>
            <th scope="col">Cambios</th>
          </tr>
        </thead>
        <tbody>
          ${lista.map((evento) => `
            <tr>
              <td>${fechaHora(evento.timestamp || evento.fechaHora)}</td>
              <td>${escapeHtml(evento.usuarioNombre || evento.usuario || 'sistema')}</td>
              <td>${escapeHtml(evento.usuarioRut || 'sistema')}</td>
              <td>${escapeHtml(evento.rolNombre || evento.rol || 'sistema')}</td>
              <td>${escapeHtml(ETIQUETAS_ACCION[evento.accion] || evento.accion || '—')}</td>
              <td>${escapeHtml(evento.descripcion || '—')}</td>
              <td>${escapeHtml(cambiosLegibles(evento))}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  contenedor.hidden = !visible;
  return { eventos: lista };
}

export const renderizarHistorial = renderizarRegistroActividad;
