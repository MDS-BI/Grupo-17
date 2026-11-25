import { obtenerPermiso, permisosEfectivos, puedeVerAlertas } from '../contabilidad/permisos.js';
import { formatearMXN } from '../contabilidad/dinero.js';
import { resumirPagos } from '../contabilidad/resumen-pagos.js';

function alertasTesorero(sesion) {
  if (!puedeVerAlertas(sesion)) return '';
  return `
    <div id="panel-alertas" class="alertas-dashboard" data-alertas-tesorero>
      <section class="alerta-bloque alerta-vencidos" data-alerta-vencidos aria-live="polite"></section>
      <section class="alerta-bloque alerta-semana" data-alerta-semanal aria-live="polite"></section>
      <p id="panel-sin-alertas" class="empty alerta-sin" data-sin-alertas hidden>No hay pagos vencidos ni pagos que venzan esta semana.</p>
    </div>`;
}


export function renderizarPanelPorRol({ sesion, contenedor, onNavegar }) {
  if (!contenedor) return;
  const permisos = permisosEfectivos(sesion);
  const visibles = permisos.filter((permiso) => permiso.visibleEnMenu && permiso.acceso !== 'noDisponible');
  contenedor.innerHTML = `
    <section class="panel-rol" aria-label="Panel por rol">
      <header class="panel-rol-header">
        <div>
          <p class="muted panel-rol-eyebrow">Sesión activa</p>
          <h2 class="panel-rol-titulo">Bienvenido, ${escapeHtml(sesion?.nombreUsuario || 'usuario')}</h2>
          <p class="muted">Rol: ${escapeHtml(sesion?.nombreRol || sesion?.rolId || '')}</p>
        </div>
      </header>
      <div class="panel-rol-grid">
        ${visibles.map((permiso) => {
          const soloLectura = permiso.acceso === 'soloLectura';
          return `
            <article class="panel-rol-card" data-seccion="${escapeHtml(permiso.seccion)}">
              <div class="panel-rol-card-top">
                <h3>${escapeHtml(permiso.etiquetaMenu || permiso.seccion)}</h3>
                ${soloLectura ? '<span class="badge-lectura" aria-label="Solo lectura">Solo lectura</span>' : ''}
              </div>
              <p class="muted">${escapeHtml(descripcionSeccion(permiso.seccion))}</p>
              <button type="button" class="secondary panel-rol-ir" data-ir-seccion="${escapeHtml(permiso.seccion)}">
                Ir a ${escapeHtml(permiso.etiquetaMenu || permiso.seccion)}
              </button>
            </article>`;
        }).join('')}
      </div>
    </section>`;

  contenedor.querySelectorAll('[data-ir-seccion]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const seccion = boton.dataset.irSeccion;
      const permiso = obtenerPermiso(sesion, seccion) || permisos.find((item) => item.seccion === seccion);
      if (!permiso || permiso.acceso === 'noDisponible') return;
      if (typeof onNavegar === 'function') onNavegar(seccion, permiso);
    });
  });
}

function lista(valor) {
  return Array.isArray(valor) ? valor : [];
}

function texto(valor) {
  return String(valor ?? '').trim().toLowerCase();
}

function resumenDatos(datos) {
  return datos?.resumen || { ingresos: 0, gastos: 0, resultado: 0, movimientos: 0 };
}

function tarjeta(titulo, valor, variante = '') {
  const clase = variante ? ` stat-card-${escapeHtml(variante)}` : '';
  return `<article class="stat-card${clase}"><h3>${escapeHtml(titulo)}</h3><p class="stat-value">${escapeHtml(valor)}</p></article>`;
}

function seccion(clave, titulo, contenido, clase = '') {
  const claseExtra = clase ? ` ${clase}` : '';
  return `<section class="panel-rol-seccion${claseExtra}" data-panel-seccion="${escapeHtml(clave)}"><h3>${escapeHtml(titulo)}</h3>${contenido}</section>`;
}

function panelAdministrador(datos) {
  const cifras = resumenDatos(datos);
  const periodos = lista(datos.periodos);
  const asientos = lista(datos.asientos);
  const abiertos = periodos.filter((periodo) => texto(periodo.status) === 'abierto');
  const cerrados = periodos.filter((periodo) => texto(periodo.status) === 'cerrado');
  const borradores = asientos.filter((asiento) => ['borrador', 'pendiente'].includes(texto(asiento.status)));
  const resultado = Number(cifras.resultado) || 0;
  const varianteResultado = resultado > 0 ? 'positivo' : resultado < 0 ? 'negativo' : 'neutro';
  const detallePeriodos = periodos.length
    ? `<div class="tabla-wrap"><table class="panel-tabla-periodos">
        <thead><tr><th scope="col">Periodo</th><th scope="col">Estado</th></tr></thead>
        <tbody>${periodos.map((periodo) => `<tr><td>${escapeHtml(periodo.name || periodo.id)}</td><td>${escapeHtml(periodo.status || 'sin estado')}</td></tr>`).join('')}</tbody>
      </table></div>`
    : '<p class="muted">No hay periodos registrados.</p>';
  return `
    ${seccion('resumen-integral', 'Resumen integral', `
      <div class="stats-grid">
        ${tarjeta('Ingresos del periodo', formatearMXN(cifras.ingresos || 0), 'ingresos')}
        ${tarjeta('Gastos del periodo', formatearMXN(cifras.gastos || 0), 'gastos')}
        ${tarjeta('Resultado del periodo', formatearMXN(resultado), varianteResultado)}
        ${tarjeta('Asientos contables', String(Number(cifras.movimientos) || 0), 'neutro')}
      </div>`)}
    <div class="panel-secciones-duo">
      ${seccion('estado-periodos', 'Estado de periodos', `
        <p class="muted">Abiertos: ${abiertos.length} · Cerrados: ${cerrados.length}</p>
        ${detallePeriodos}`, 'panel-seccion-periodos')}
      ${seccion('asuntos-prioritarios', 'Asuntos prioritarios', `
        <ul class="panel-rol-lista">
          <li>Periodos abiertos: ${abiertos.length}</li>
          <li>Asientos en borrador: ${borradores.length}</li>
          <li>Cuentas contables: ${lista(datos.cuentas).length}</li>
        </ul>`, 'panel-seccion-prioritarios')}
    </div>
  `;
}

function panelContador(datos) {
  const cuentas = lista(datos.cuentas);
  const asientos = lista(datos.asientos);
  const aprobados = asientos.filter((asiento) => texto(asiento.status) === 'aprobado');
  const borradores = asientos.filter((asiento) => ['borrador', 'pendiente'].includes(texto(asiento.status)));
  return `
    ${seccion('plan-cuentas', 'Plan de cuentas', `
      <p class="muted">Cuentas registradas: ${cuentas.length}</p>
      <p class="muted">Cuentas de detalle: ${cuentas.filter((cuenta) => cuenta.isLeaf).length}</p>`)}
    ${seccion('control-asientos', 'Control de asientos', `
      <p class="muted">Asientos registrados: ${asientos.length}</p>
      <p class="muted">Aprobados: ${aprobados.length}</p>
      <p class="muted">En borrador: ${borradores.length}</p>`)}
    ${seccion('reportes-disponibles', 'Reportes disponibles', `
      <p class="muted">Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General.</p>
      <p class="muted">Consulta de reportes financieros sin modificar registros.</p>`)}
  `;
}

function panelTesorero(datos) {
  const pagos = lista(datos.pagos);
  const resumenPagos = resumirPagos(pagos);
  const cobros = pagos.filter((pago) => texto(pago.tipo) === 'cobro');
  const egresos = pagos.filter((pago) => texto(pago.tipo) === 'pago');
  const entidades = new Set(pagos.map((pago) => pago.entity_id).filter(Boolean));
  return `
    ${seccion('pagos-cobros', 'Pagos y cobros', `
      <p class="muted">Cobros registrados: ${cobros.length}</p>
      <p class="muted">Pagos registrados: ${egresos.length}</p>
      <p class="muted">Clientes o proveedores vinculados: ${entidades.size}</p>`)}
    ${seccion('flujo-efectivo', 'Flujo de efectivo', `
      <p class="muted">Pendiente: ${resumenPagos.pendiente.cantidad} · ${formatearMXN(resumenPagos.pendiente.totalCentavos)}</p>
      <p class="muted">Pagado: ${resumenPagos.pagado.cantidad} · ${formatearMXN(resumenPagos.pagado.totalCentavos)}</p>
      <p class="muted">Vencido: ${resumenPagos.vencido.cantidad} · ${formatearMXN(resumenPagos.vencido.totalCentavos)}</p>`)}
    ${seccion('vencimientos-proximos', 'Vencimientos próximos', `
      <p class="muted">Las alertas de vencidos y de la semana se muestran en esta vista.</p>`)}
  `;
}

function panelAuditor(datos) {
  const asientos = lista(datos.asientos);
  const pagos = lista(datos.pagos);
  return `
    ${seccion('trazabilidad-movimientos', 'Trazabilidad de movimientos', `
      <p class="muted">Asientos con trazabilidad: ${asientos.length}</p>
      <p class="muted">Pagos y cobros con trazabilidad: ${pagos.length}</p>
      <p class="muted">Consulta de solo lectura.</p>`)}
    ${seccion('reportes-financieros', 'Reportes financieros', `
      <p class="muted">Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General disponibles para consulta.</p>`)}
    ${seccion('historial-consulta', 'Historial para consulta', `
      <p class="muted">El registro de actividad se consulta desde Reportes financieros.</p>
      <p class="muted">Sin acciones de creación, edición ni anulación.</p>`)}
  `;
}

function panelGenerico() {
  return seccion('resumen-general', 'Resumen general', '<p class="muted">Información disponible según su rol.</p>');
}

function descripcionRol(rolId) {
  const mapa = {
    administrador: 'Supervisión integral, estado de periodos y asuntos prioritarios.',
    contador: 'Cuentas contables, asientos y reportes disponibles.',
    tesorero: 'Pagos, cobros, flujo de efectivo y vencimientos.',
    auditor: 'Trazabilidad, reportes e historial para consulta.'
  };
  return mapa[rolId] || 'Información disponible según su rol.';
}

export function renderizarPanelInicio(sesion = {}, datos = {}) {
  const vista = document.getElementById('view-panel-inicio');
  const contenedor = document.getElementById('panel-inicio-contenido');
  if (!vista) return;
  const rolId = sesion?.rolId || '';
  if (rolId) vista.dataset.panelRol = rolId;
  if (!contenedor) return;
  const paneles = {
    administrador: panelAdministrador,
    contador: panelContador,
    tesorero: panelTesorero,
    auditor: panelAuditor
  };
  const construirPanel = paneles[rolId] || panelGenerico;
  const esAdministrador = rolId === 'administrador';
  const botones = [
    `<button type="button" class="secondary" data-accion="cerrar-sesion">Cerrar sesión</button>`,
    esAdministrador ? `<button type="button" class="secondary boton-destacado" data-accion="cargar-datos">Cargar datos de ejemplo</button>` : '',
    esAdministrador ? `<button type="button" class="secondary" data-accion="restablecer-datos">Restablecer datos</button>` : ''
  ].filter(Boolean).join('');
  contenedor.innerHTML = `
    <section class="card panel-inicio" aria-label="Panel de inicio por rol" data-panel-rol="${escapeHtml(rolId)}">
      <header class="panel-rol-header">
        <div>
          <p class="muted panel-rol-eyebrow">Sesión activa</p>
          <h2>Panel de ${escapeHtml(sesion?.nombreRol || rolId || 'inicio')}</h2>
          <p class="muted">${escapeHtml(descripcionRol(rolId))}</p>
        </div>
      </header>
      ${construirPanel(datos)}
      ${alertasTesorero(sesion)}
      <div class="panel-inicio-acciones form-actions">${botones}</div>
    </section>`;
}

function descripcionSeccion(seccion) {
  const mapa = {
    panel: 'Resumen operativo y alertas relevantes para su rol.',
    resumen: 'Indicadores financieros y visión general del periodo.',
    cuentas: 'Catálogo y administración de cuentas contables.',
    asientos: 'Registro y control de asientos contables.',
    pagos: 'Gestión de pagos, cobros y vencimientos.',
    periodos: 'Consulta y cierre de periodos.',
    reportes: 'Reportes financieros y exportación de información.',
    auditoria: 'Consulta de eventos y trazabilidad del sistema.',
    alertas: 'Seguimiento de pagos vencidos y próximos a vencer.',
    configInterfaz: 'Configuración de identidad visual y preferencias.'
  };
  return mapa[seccion] || 'Acceso disponible según su rol.';
}

function escapeHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
