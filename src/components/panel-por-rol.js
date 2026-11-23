import { escapeHtml } from './contabilidad/comun.js';
import { formatearMXN } from '../contabilidad/dinero.js';

function tarjeta(titulo, valor, detalle = '') {
  return `<article class="panel-card"><h3>${escapeHtml(titulo)}</h3><strong>${escapeHtml(valor)}</strong>${detalle ? `<p class="muted">${escapeHtml(detalle)}</p>` : ''}</article>`;
}

function acciones(sesion) {
  const botones = [];
  if (sesion.accionesPanel.includes('cargarDatos')) {
    botones.push('<button type="button" class="primary" data-accion="cargar-datos">Cargar datos de ejemplo</button>');
  }
  if (sesion.accionesPanel.includes('restablecerDatos')) {
    botones.push('<button type="button" class="secondary" data-accion="restablecer-datos">Restablecer datos</button>');
  }
  if (sesion.accionesPanel.includes('cerrarSesion')) {
    botones.push('<button type="button" class="secondary" data-accion="cerrar-sesion">Cerrar sesión</button>');
  }
  return botones.join('');
}

function contenidoIntegral(datos) {
  const resumen = datos.resumen || {};
  return `
    ${tarjeta('Ingresos del periodo', formatearMXN(resumen.ingresos || 0), 'Movimientos aprobados')}
    ${tarjeta('Gastos del periodo', formatearMXN(resumen.gastos || 0), 'Movimientos aprobados')}
    ${tarjeta('Resultado financiero', formatearMXN(resumen.resultado || 0), 'Ingresos menos gastos')}
    ${tarjeta('Periodos registrados', String((datos.periodos || []).length), 'Estado y vigencia')}`;
}

function contenidoContable(datos) {
  const pendientes = (datos.asientos || []).filter((asiento) => asiento.status === 'borrador').length;
  return `
    ${tarjeta('Cuentas contables', String((datos.cuentas || []).length), 'Plan de cuentas disponible')}
    ${tarjeta('Asientos en borrador', String(pendientes), 'Pendientes de aprobación')}
    ${tarjeta('Reportes', 'Disponibles', 'Consulta por periodo')}`;
}

function contenidoTesoreria(datos) {
  const pagos = datos.pagos || [];
  const cobrado = pagos.filter((pago) => pago.tipo === 'cobro').reduce((total, pago) => total + (Number(pago.amount) || 0), 0);
  return `
    ${tarjeta('Pagos y cobros', String(pagos.length), 'Movimientos registrados')}
    ${tarjeta('Cobros acumulados', formatearMXN(cobrado), 'Flujo de efectivo')}
    ${tarjeta('Resumen por estado', 'Disponible', 'Dentro de Pagos y cobros')}`;
}

function contenidoAuditoria(datos) {
  return `
    ${tarjeta('Asientos registrados', String((datos.asientos || []).length), 'Trazabilidad contable')}
    ${tarjeta('Reportes', 'Solo consulta', 'Historial por periodo')}
    ${tarjeta('Movimientos', String((datos.resumen || {}).movimientos || 0), 'Asientos aprobados')}`;
}

const CONTENIDOS = Object.freeze({
  integral: contenidoIntegral,
  contable: contenidoContable,
  tesoreria: contenidoTesoreria,
  auditoria: contenidoAuditoria
});

export function renderizarPanelInicio(sesion, datos = {}, contenedor = null) {
  const destino = contenedor || (typeof document !== 'undefined' ? document.getElementById('panel-inicio-contenido') : null);
  if (!destino || !sesion) return false;
  const contenido = CONTENIDOS[sesion.panelInicio] || contenidoIntegral;
  const rol = escapeHtml(sesion.rolId || '');
  destino.innerHTML = `
    <div class="panel-cabecera">
      <span class="rol-badge" data-rol="${rol}">${rol}</span>
      <span class="muted">Sesión iniciada como ${escapeHtml(sesion.usuarioRut || '')}</span>
    </div>
    <div class="panel-grid">${contenido(datos)}</div>
    <div class="panel-acciones">${acciones(sesion)}</div>`;
  const seccion = typeof document !== 'undefined' ? document.getElementById('view-panel-inicio') : null;
  if (seccion) seccion.dataset.panelRol = sesion.rolId || '';
  return true;
}
