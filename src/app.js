import { loadModuleConfig, normalizeConfig, setActiveConfig, labelFor } from './module-config.js';
import { loadEntities, addEntity, updateEntity, deleteEntity, validateEntity, searchEntities, loadDocuments, addDocument, updateDocument, deleteDocument, validateDocument, migrarAlmacenLegado } from './storage.js';
import { clearEntityForm, startEntityEdit, collectEntityPayload, showEntityErrors } from './components/entity-form.js';
import { createEntityItem } from './components/entity-list.js';
import { clearDocumentForm, startDocumentEdit, collectDocumentPayload, showDocumentErrors } from './components/document-form.js';
import { folioLabel } from './components/document-list.js';
import { renderLogo, applyShellLabels, setActiveModule, inicializarShellAccesible, cerrarDrawerNavegacion } from './components/shell.js';
import { renderDashboard, renderAlertasTesorero } from './components/dashboard.js';
import { setupSearchBar, renderSearchResults } from './components/search-bar.js';
import { formatearMXN, sumarCentavos } from './contabilidad/dinero.js';
import * as Almacen from './contabilidad/almacenamiento.js';
import * as Cuentas from './contabilidad/cuentas.js';
import * as Periodos from './contabilidad/periodos.js';
import * as Asientos from './contabilidad/asientos.js';
import * as Pagos from './contabilidad/pagos.js';
import * as Reportes from './contabilidad/reportes.js';
import { validarCuenta } from './contabilidad/validaciones-cuentas.js';
import { validarPeriodo } from './contabilidad/validaciones-periodos.js';
import { validarAsiento } from './contabilidad/validaciones-asientos.js';
import { validarPago } from './contabilidad/validaciones-pagos.js';
import { renderResumen } from './components/contabilidad/resumen.js';
import { populateCuentaParentSelect, clearCuentaForm, startCuentaEdit, collectCuentaPayload, showCuentaErrors } from './components/contabilidad/cuenta-form.js';
import { renderCuentaList, renderCuentaDetalle } from './components/contabilidad/cuenta-list.js';
import { clearAsientoForm, startAsientoEdit, collectAsientoPayload, showAsientoErrors, agregarLinea, quitarLinea, poblarPeriodosAsiento, poblarEntidadesAsiento } from './components/contabilidad/asiento-form.js';
import { renderAsientoList, renderAsientoDetalle } from './components/contabilidad/asiento-list.js';
import { clearPagoForm, startPagoEdit, collectPagoPayload, showPagoErrors, poblarEntidadesPago, poblarAsientosPago } from './components/contabilidad/pago-form.js';
import { renderPagoList, renderPagoDetalle } from './components/contabilidad/pago-list.js';
import { clearPeriodoForm, startPeriodoEdit, collectPeriodoPayload, showPeriodoErrors } from './components/contabilidad/periodo-form.js';
import { renderPeriodoList } from './components/contabilidad/periodo-list.js';
import { renderReporte } from './components/contabilidad/reportes.js';
import { renderAcceso, renderizarUsuariosPrueba, obtenerCredenciales, mostrarErroresAcceso, limpiarFormularioAcceso } from './components/acceso.js';
import { renderizarMenu, renderizarIconosMenu, moduloVisible, navegar } from './components/menu.js';
import { renderizarPanelInicio } from './components/panel-por-rol.js';
import { renderizarResumenPagos } from './components/contabilidad/pago-resumen.js';
import * as Sesion from './contabilidad/sesion.js';
import * as Permisos from './contabilidad/permisos.js';
import * as ResumenPagos from './contabilidad/resumen-pagos.js';
import * as FiltrosMovimientos from './contabilidad/filtros-movimientos.js';
import * as Auditoria from './contabilidad/auditoria.js';
import { ordenarRegistros } from './contabilidad/interfaz-config.js';

function qs(id){ return document.getElementById(id); }

function on(id, evento, manejador){
  const elemento = qs(id);
  if(elemento) elemento.addEventListener(evento, manejador);
}

// Ayudantes de género gramatical para etiquetas configurables en español.
// El género se deduce de la primera palabra (p. ej., "Pedido de Venta" → masculino)
// usando terminaciones femeninas comunes (-a, -dad, -ción, ...).
const palabraClave = (word) => String(word).trim().split(/\s+/)[0] || '';
const esFemenina = (word) => /(a|dad|tad|ción|sión|tud|umbre|ie)$/i.test(palabraClave(word));
const articulo = (word) => esFemenina(word) ? 'la' : 'el';
const demostrativo = (word) => esFemenina(word) ? 'esta' : 'este';
const seleccionada = (word) => esFemenina(word) ? 'seleccionada' : 'seleccionado';

const MODULES = ['dashboard', 'entities', 'documents', 'search', 'panel', 'resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes'];
const VIEWS = {
  acceso: 'view-acceso',
  bloqueo: 'view-bloqueo',
  dashboard: 'view-dashboard',
  entities: 'view-entities',
  documents: 'view-documents',
  search: 'view-search',
  panel: 'view-panel-inicio',
  resumen: 'view-resumen',
  cuentas: 'view-cuentas',
  asientos: 'view-asientos',
  pagos: 'view-pagos',
  periodos: 'view-periodos',
  reportes: 'view-reportes'
};
const MODULOS_CONTABILIDAD = ['resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes'];

let wired = false;
let contabilidadInicializada = false;
let modoAcceso = false;
let filtroEstadoPago = 'todos';
let focoResumenPendiente = null;
let filtrosAuditoria = { tipoMovimiento: '', accion: '', usuario: '' };
let ordenTablas = {};
let pantallaActual = 'dashboard';

function confirmar(mensaje){
  try{
    return typeof confirm === 'function' ? confirm(mensaje) : true;
  }catch(error){
    return true;
  }
}

function anunciarConfirmacion(mensaje){
  const elemento = qs('mensaje-confirmacion');
  if(!elemento) return;
  elemento.textContent = mensaje || '';
  elemento.hidden = !mensaje;
}

function asegurarContabilidad(){
  if(!contabilidadInicializada){
    Almacen.inicializarContabilidad();
    contabilidadInicializada = true;
  }
}

function sesionActual(){
  return Sesion.obtenerSesionActiva();
}

function puede(accion){
  return !modoAcceso || Permisos.puedeEjecutar(accion, sesionActual());
}

function puedeSeccion(seccion, accion){
  if(!modoAcceso) return true;
  const permiso = Permisos.obtenerPermiso(seccion, sesionActual());
  if(!permiso) return false;
  const acciones = Array.isArray(permiso.acciones) ? permiso.acciones : [];
  if(acciones.includes(accion)) return true;
  const equivalencias = {
    crear: 'puedeCrear',
    editar: 'puedeEditar',
    eliminar: 'puedeAnular',
    anular: 'puedeAnular',
    marcarPagado: 'puedeEditar',
    aprobar: 'puedeEditar',
    exportar: 'puedeExportar',
    cerrar: 'puedeCerrar'
  };
  return Boolean(permiso[equivalencias[accion]]);
}

function verificarPermiso(seccion, accion){
  if(puedeSeccion(seccion, accion)) return true;
  mostrarBloqueo('No tienes permiso para realizar esta acción.');
  return false;
}

function puedeConsultarAuditoriaMovimiento(){
  if(!modoAcceso) return true;
  const sesion = sesionActual();
  return Permisos.puedeVerAuditoria(sesion) || Auditoria.puedeConsultarAuditoria(sesion);
}

function exigirAuditoriaMovimiento(){
  if(puedeConsultarAuditoriaMovimiento()) return true;
  mostrarBloqueo('Acceso no disponible para el registro de auditoría.');
  return false;
}

function ocultarVistas(){
  Object.values(VIEWS).forEach(id => { const vista = qs(id); if(vista) vista.hidden = true; });
}

function establecerVisibilidadMenu(visible){
  const workspace = document.querySelector('.workspace');
  if(workspace) workspace.classList.toggle('sin-sidebar', !visible);
  const sidebar = qs('sidebar-nav');
  if(sidebar) sidebar.hidden = !visible;
  const toggle = qs('menu-toggle');
  if(toggle) toggle.hidden = !visible;
  if(!visible){
    sidebar?.classList.remove('sidebar-abierta');
    toggle?.setAttribute('aria-expanded', 'false');
  }
}

function mostrarAcceso(mensaje = ''){
  ocultarVistas();
  establecerVisibilidadMenu(false);
  document.querySelectorAll('.nav-module').forEach(boton => { boton.hidden = true; });
  const vista = qs(VIEWS.acceso);
  if(vista) vista.hidden = false;
  if(mensaje) mostrarErroresAcceso({ acceso: mensaje });
  renderAcceso(vista);
}

function mostrarBloqueo(mensaje){
  ocultarVistas();
  const vista = qs(VIEWS.bloqueo);
  if(vista) vista.hidden = false;
  const texto = qs('mensaje-bloqueo');
  if(texto) texto.textContent = mensaje || 'No tienes acceso a esta sección.';
}

function datosPanel(){
  const periodos = Periodos.listarPeriodos();
  const periodoId = elegirPeriodo(periodos);
  return {
    entidades: loadEntities(),
    documentos: loadDocuments(),
    cuentas: Cuentas.listarCuentas(),
    periodos,
    asientos: Asientos.listarAsientos(),
    pagos: Pagos.listarPagos(),
    resumen: periodoId ? Reportes.calcularResumen(periodoId) : { ingresos: 0, gastos: 0, resultado: 0, movimientos: 0 }
  };
}

function aplicarSesion(){
  const sesion = sesionActual();
  if(!sesion){
    mostrarAcceso();
    return false;
  }
  const dato = datosPanel();
  renderizarPanelInicio(sesion, dato);
  actualizarAlertasPanel();
  establecerVisibilidadMenu(true);
  renderizarMenu(sesion.permisos, { ...sesion, pantallaActiva: 'panel' });
  return showModule('panel');
}

function datosContabilidad(){
  return {
    entidades: loadEntities(),
    documentos: loadDocuments(),
    periodos: Periodos.listarPeriodos(),
    asientos: Asientos.listarAsientos()
  };
}

function refrescarDashboard(){
  const visible = Boolean(modoAcceso && Permisos.puedeVerAlertas(sesionActual()));
  renderDashboard({ mostrarAlertasTesorero: visible });
}

function actualizarAlertasPanel(){
  const raiz = qs('panel-alertas');
  if(!raiz) return;
  renderAlertasTesorero(raiz, {
    pagos: Pagos.listarPagos(),
    entidades: loadEntities(),
    visible: Boolean(modoAcceso && Permisos.puedeVerAlertas(sesionActual()))
  });
}

function poblarSelectCuentas(select){
  if(!select) return;
  const previo = select.value;
  select.innerHTML = '';
  const todas = document.createElement('option');
  todas.value = '';
  todas.textContent = 'Todas';
  select.appendChild(todas);
  for(const cuenta of Cuentas.listarCuentas()){
    const opcion = document.createElement('option');
    opcion.value = cuenta.id;
    opcion.textContent = `${cuenta.code} · ${cuenta.name}`;
    select.appendChild(opcion);
  }
  if(previo && [...select.options].some(opcion => opcion.value === previo)) select.value = previo;
}

function limpiarControles(ids, valor = ''){
  for(const id of ids){
    const elemento = qs(id);
    if(elemento) elemento.value = valor;
  }
}

function asientosParaFiltro(){
  const lineas = Almacen.loadLineas();
  return Asientos.listarAsientos().map(asiento => ({
    ...asiento,
    fecha: asiento.date,
    estado: asiento.status,
    concepto: asiento.concept,
    montoCentavos: Number(asiento.totalDebit) || 0,
    cuentaIds: lineas.filter(linea => linea.asiento_id === asiento.id).map(linea => linea.cuenta_id)
  }));
}

function pagosParaFiltro(){
  const lineas = Almacen.loadLineas();
  const asientos = Asientos.listarAsientos();
  return Pagos.listarPagos().map(pago => {
    const asiento = asientos.find(item => item.id === pago.asiento_id);
    const cuentaIds = asiento
      ? lineas.filter(linea => linea.asiento_id === asiento.id).map(linea => linea.cuenta_id)
      : [];
    return {
      ...pago,
      fecha: pago.date,
      estado: ResumenPagos.calcularEstadoPago(pago),
      concepto: pago.numero,
      montoCentavos: Number(pago.amount) || 0,
      cuentaIds
    };
  });
}

function leerFiltroAsientos(){
  return {
    fechaDesde: qs('filtro-asiento-fecha-desde')?.value || '',
    fechaHasta: qs('filtro-asiento-fecha-hasta')?.value || '',
    cuentaId: qs('filtro-asiento-cuenta')?.value || '',
    montoMin: qs('filtro-asiento-monto-min')?.value || '',
    montoMax: qs('filtro-asiento-monto-max')?.value || '',
    estado: qs('filtro-asiento-estado')?.value || 'todos',
    texto: qs('asientos-filtro')?.value || '',
    unidad: 'mxn'
  };
}

function leerFiltroPagos(){
  return {
    fechaDesde: qs('filtro-pago-fecha-desde')?.value || '',
    fechaHasta: qs('filtro-pago-fecha-hasta')?.value || '',
    cuentaId: qs('filtro-pago-cuenta')?.value || '',
    montoMin: qs('filtro-pago-monto-min')?.value || '',
    montoMax: qs('filtro-pago-monto-max')?.value || '',
    estado: filtroEstadoPago,
    texto: qs('pagos-filtro-texto')?.value || '',
    unidad: 'mxn'
  };
}

function mostrarErrorFiltro(id, revision){
  const elemento = qs(id);
  if(!elemento) return;
  elemento.textContent = revision.valido ? '' : (Object.values(revision.errores)[0] || 'Los filtros no son válidos.');
}

function mostrarTotalResultados(id, cantidad, totalCentavos){
  const elemento = qs(id);
  if(!elemento) return;
  elemento.textContent = `${cantidad} registro(s) · ${formatearMXN(totalCentavos || 0)}`;
}

function ordenarParaVista(tabla, registros){
  const orden = ordenTablas[tabla];
  if(!orden) return registros;
  return ordenarRegistros(registros, orden.columna, orden.direccion, orden.tipo);
}

function refrescarVistaOrdenada(tabla){
  if(tabla === 'asientos') return refrescarAsientos();
  if(tabla === 'pagos') return refrescarPagos();
  if(tabla === 'periodos') return refrescarPeriodos();
  if(tabla === 'cuentas') return refrescarCuentas();
  if(tabla === 'registro-actividad') return refrescarReportes();
  if(String(tabla).startsWith('reporte-')) return refrescarReportes();
}

function alternarOrden(tabla, columna, tipo){
  const actual = ordenTablas[tabla];
  const direccion = actual?.columna === columna && actual.direccion === 'asc' ? 'desc' : 'asc';
  const tipos = { amount: 'numero', date: 'fecha', status: 'estado', texto: 'texto' };
  ordenTablas = { ...ordenTablas, [tabla]: { tabla, columna, direccion, tipo: tipos[tipo] || 'texto' } };
  refrescarVistaOrdenada(tabla);
}

function eventosParaAuditoria(){
  let eventos = Auditoria.listarEventos();
  if(filtrosAuditoria.tipoMovimiento){
    eventos = eventos.filter(evento => (evento.tipoMovimiento || evento.entidad) === filtrosAuditoria.tipoMovimiento);
  }
  if(filtrosAuditoria.accion){
    eventos = eventos.filter(evento => evento.accion === filtrosAuditoria.accion);
  }
  if(filtrosAuditoria.usuario){
    eventos = eventos.filter(evento => (evento.usuarioNombre || evento.usuario) === filtrosAuditoria.usuario);
  }
  return ordenarParaVista('registro-actividad', eventos);
}

function elegirPeriodo(periodos, preferido = ''){
  if(preferido && periodos.some(p => p.id === preferido)) return preferido;
  const asientos = Reportes.asientosAprobadosDelPeriodo();
  const conMovimientos = [...periodos].reverse().find(p => asientos.some(a => a.period_id === p.id));
  const elegido = conMovimientos || periodos[0];
  return elegido ? elegido.id : '';
}

function refrescarResumen(){
  const periodos = Periodos.listarPeriodos();
  const periodoId = elegirPeriodo(periodos, qs('resumen-periodo').value);
  const resumen = periodoId ? Reportes.calcularResumen(periodoId) : null;
  renderResumen({ periodos, periodoId, resumen });
}

function refrescarCuentas(){
  const cuentas = ordenarParaVista('cuentas', Cuentas.listarCuentas());
  const hayCuentas = renderCuentaList(qs('cuentas-lista'), cuentas, { filtro: qs('cuentas-filtro').value, orden: ordenTablas.cuentas });
  qs('cuentas-empty').hidden = hayCuentas;
  populateCuentaParentSelect(cuentas, { excludeId: qs('cuenta-id').value || null });
  const detalle = Cuentas.obtenerDetalleCuenta(qs('cuenta-detalle-id').value);
  const hayDetalle = renderCuentaDetalle(qs('cuenta-detalle'), detalle);
  qs('cuenta-detalle-empty').hidden = hayDetalle;
}

function periodoDeRegistro(registro){
  const periodos = Periodos.listarPeriodos();
  const porId = periodos.find(periodo => periodo.id === (registro.period_id || registro.periodoId));
  if(porId) return porId;
  return periodos.find(periodo => periodo.startDate <= registro.date && registro.date <= periodo.endDate) || null;
}

function registroEnPeriodoCerrado(registro){
  return periodoDeRegistro(registro)?.status === 'cerrado';
}

function refrescarAsientos(){
  const todos = asientosParaFiltro();
  const filtro = leerFiltroAsientos();
  const revision = FiltrosMovimientos.validarFiltro(filtro);
  mostrarErrorFiltro('error-filtro-asientos', revision);
  const detallado = revision.valido ? FiltrosMovimientos.filtrarAsientosDetallado(todos, filtro) : { registros: [], totalCentavos: 0 };
  const registros = ordenarParaVista('asientos', detallado.registros).map(asiento => ({
    ...asiento,
    soloLectura: registroEnPeriodoCerrado(asiento)
  }));
  const hayAsientos = renderAsientoList(qs('asientos-lista'), registros, {
    filtro: filtro.texto,
    orden: ordenTablas.asientos,
    puedeVerHistorial: puedeConsultarAuditoriaMovimiento()
  });
  qs('asientos-empty').hidden = todos.length > 0;
  const vacioFiltro = qs('asientos-filtro-empty');
  if(vacioFiltro) vacioFiltro.hidden = todos.length === 0 || hayAsientos;
  mostrarTotalResultados('asientos-total-resultados', detallado.registros.length, detallado.totalCentavos);
  refrescarDetalleAsiento();
}

function refrescarPagos(){
  const { entidades, asientos } = datosContabilidad();
  const filtroEntidad = qs('pagos-filtro-entidad');
  const entidadPrevia = filtroEntidad.value;
  filtroEntidad.innerHTML = '';
  const todas = document.createElement('option');
  todas.value = '';
  todas.textContent = 'Todas';
  filtroEntidad.appendChild(todas);
  entidades.forEach(e => {
    const opcion = document.createElement('option');
    opcion.value = e.entity_id;
    opcion.textContent = e.name;
    filtroEntidad.appendChild(opcion);
  });
  if(entidadPrevia && [...filtroEntidad.options].some(o => o.value === entidadPrevia)) filtroEntidad.value = entidadPrevia;
  poblarSelectCuentas(qs('filtro-pago-cuenta'));

  const todosLosPagos = pagosParaFiltro();
  const resumen = ResumenPagos.resumirPagos(todosLosPagos);
  const tarjetaEnFoco = renderizarResumenPagos(
    qs('pago-resumen-tarjetas'),
    resumen,
    filtroEstadoPago,
    todosLosPagos.length === 0,
    focoResumenPendiente
  );
  focoResumenPendiente = null;
  tarjetaEnFoco?.focus();

  const filtro = leerFiltroPagos();
  const revision = FiltrosMovimientos.validarFiltro(filtro);
  mostrarErrorFiltro('error-filtro-pagos', revision);
  const detallado = revision.valido ? FiltrosMovimientos.filtrarPagosDetallado(todosLosPagos, filtro) : { registros: [], totalCentavos: 0 };
  const tipo = qs('pagos-filtro-tipo').value;
  const filtrados = ordenarParaVista('pagos', detallado.registros.filter(pago => (!tipo || pago.tipo === tipo) && (!filtroEntidad.value || pago.entity_id === filtroEntidad.value))).map(pago => ({
    ...pago,
    soloLectura: registroEnPeriodoCerrado(pago)
  }));
  const hayPagos = renderPagoList(qs('pagos-lista'), filtrados, {
    entidades,
    permitirMarcar: puedeSeccion('pagos', 'marcarPagado'),
    orden: ordenTablas.pagos,
    puedeVerHistorial: puedeConsultarAuditoriaMovimiento()
  });
  qs('pagos-empty').hidden = todosLosPagos.length > 0;
  const vacioFiltro = qs('pagos-filtro-empty');
  if(vacioFiltro) vacioFiltro.hidden = todosLosPagos.length === 0 || hayPagos;
  mostrarTotalResultados('pagos-total-resultados', filtrados.length, sumarCentavos(filtrados.map(pago => pago.amount)));
  if(!hayPagos) renderPagoDetalle(qs('pago-detalle'), null, { entidades, asientos });
  else refrescarDetallePago();
}

function refrescarPeriodos(){
  const periodos = ordenarParaVista('periodos', Periodos.listarPeriodos());
  const hayPeriodos = renderPeriodoList(qs('periodos-lista'), periodos, { filtro: qs('periodos-filtro').value, orden: ordenTablas.periodos });
  qs('periodos-empty').hidden = hayPeriodos;
}

function refrescarReportes(){
  const periodos = Periodos.listarPeriodos();
  const periodoId = elegirPeriodo(periodos, qs('reportes-periodo').value);
  const resultado = periodoId ? Reportes.obtenerMovimientos(periodoId) : null;
  const sesion = sesionActual();
  renderReporte({
    periodos,
    periodoId,
    resultado,
    puedeExportar: !modoAcceso || Permisos.puedeExportar(sesion, 'reportes'),
    puedeVerAuditoria: Boolean(modoAcceso && Permisos.puedeVerAuditoria(sesion)),
    eventosAuditoria: eventosParaAuditoria(),
    orden: ordenTablas['registro-actividad'],
    ordenes: Object.fromEntries(Object.entries(ordenTablas)
      .filter(([tabla]) => tabla.startsWith('reporte-'))
      .map(([tabla, valor]) => [tabla.slice('reporte-'.length), valor])),
    filtrosAuditoria,
    onFiltrosAuditoria: (filtros) => {
      filtrosAuditoria = filtros;
      refrescarReportes();
    }
  });
}

function mostrarDetalleAsiento(id, anunciar = true){
  const registro = Asientos.asientoConLineas(id);
  if(!registro) return;
  const eventos = Auditoria.historialPorMovimiento('asiento', id).filter(Boolean);
  renderAsientoDetalle(qs('asiento-detalle'), registro, { eventos, puedeVerHistorial: puedeConsultarAuditoriaMovimiento() });
  if(anunciar) anunciarConfirmacion(`Historial de asiento ${id} actualizado.`);
}

function mostrarDetallePago(id, anunciar = true){
  const pago = Pagos.obtenerPago(id);
  if(!pago) return;
  const { entidades, asientos } = datosContabilidad();
  const eventos = Auditoria.historialPorMovimiento('pago', id).filter(Boolean);
  renderPagoDetalle(qs('pago-detalle'), pago, {
    entidades,
    asientos,
    eventos,
    puedeVerHistorial: puedeConsultarAuditoriaMovimiento()
  });
  if(anunciar) anunciarConfirmacion(`Historial de pago ${id} actualizado.`);
}

function refrescarDetalleAsiento(){
  const contenedor = qs('asiento-detalle');
  if(!contenedor || contenedor.hidden) return;
  if(contenedor.dataset.movimientoId) mostrarDetalleAsiento(contenedor.dataset.movimientoId, false);
  else renderAsientoDetalle(contenedor, null);
}

function refrescarDetallePago(){
  const contenedor = qs('pago-detalle');
  if(!contenedor || contenedor.hidden) return;
  if(contenedor.dataset.movimientoId) mostrarDetallePago(contenedor.dataset.movimientoId, false);
  else{
    const { entidades, asientos } = datosContabilidad();
    renderPagoDetalle(contenedor, null, { entidades, asientos });
  }
}

function activarFiltroEstadoPago(estado, { enfocar = false } = {}){
  filtroEstadoPago = estado || 'todos';
  const control = qs('filtro-estado-pago');
  if(control) control.value = filtroEstadoPago;
  focoResumenPendiente = enfocar ? filtroEstadoPago : null;
  refrescarPagos();
  const etiquetas = { todos: 'Todos', pendiente: 'Pendiente', pagado: 'Pagado', vencido: 'Vencido', anulado: 'Anulado' };
  anunciarConfirmacion(`Filtro aplicado: ${etiquetas[filtroEstadoPago] || filtroEstadoPago}.`);
}

function handleAccionesGlobales(ev){
  const botonOrden = ev.target.closest('.orden-tabla[data-orden-tabla]');
  if(botonOrden){
    alternarOrden(botonOrden.dataset.ordenTabla, botonOrden.dataset.ordenColumna, botonOrden.dataset.ordenTipo);
    return;
  }
  const botonLimpiar = ev.target.closest('[data-limpiar-campo]');
  if(botonLimpiar){
    const control = qs(botonLimpiar.dataset.limpiarCampo);
    if(control){
      if(control.id === 'filtro-estado-pago') activarFiltroEstadoPago('todos');
      else{
        control.value = '';
        control.dispatchEvent(new Event(control.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
      }
    }
    anunciarConfirmacion('Filtro eliminado.');
    return;
  }
  const tarjetaResumen = ev.target.closest('[data-resumen-pago-estado]');
  if(tarjetaResumen){
    activarFiltroEstadoPago(tarjetaResumen.dataset.resumenPagoEstado, { enfocar: true });
    return;
  }
}

function handleAccionesGlobalesTeclado(ev){
  if(ev.key !== 'Enter' && ev.key !== ' ') return;
  const tarjetaResumen = ev.target.closest?.('[data-resumen-pago-estado]');
  if(!tarjetaResumen) return;
  ev.preventDefault();
  activarFiltroEstadoPago(tarjetaResumen.dataset.resumenPagoEstado, { enfocar: true });
}

function showModule(name, opts = {}){
  if(!MODULES.includes(name)) name = 'dashboard';
  if(modoAcceso){
    const sesion = sesionActual();
    if(!sesion){
      mostrarAcceso();
      return false;
    }
    if(name !== 'panel'){
      const revision = navegar(name, sesion.permisos);
      if(!revision.permitido){
        mostrarBloqueo(revision.mensaje);
        return false;
      }
    }
    establecerVisibilidadMenu(true);
    renderizarMenu(sesion.permisos, { ...sesion, pantallaActiva: name });
  }
  ocultarVistas();
  cerrarDrawerNavegacion();
  pantallaActual = name;
  const vista = qs(VIEWS[name]);
  if(vista) vista.hidden = false;
  setActiveModule(name);
  if(modoAcceso) sesionActual().pantallaActiva = name;
  if(name === 'dashboard'){
    refrescarDashboard();
  }
  if(name === 'panel'){
    const sesion = sesionActual();
    if(sesion){
      renderizarPanelInicio(sesion, datosPanel());
      actualizarAlertasPanel();
    }
  }
  if(name === 'entities'){
    populateDocumentEntitySelect();
    populateEditEntitySelect();
    if(opts.newRecord) clearEntityForm();
    if(opts.focusForm) qs('name').focus();
  }
  if(name === 'documents'){
    populateDocumentEntitySelect();
    populateEditDocumentSelect();
    if(opts.newRecord) clearDocumentForm();
    if(opts.focusForm) qs('document-entity').focus();
  }
  if(name === 'search'){
    refreshSearch();
    if(opts.focusSearch) qs('search-input').focus();
  }
  if(MODULOS_CONTABILIDAD.includes(name)){
    asegurarContabilidad();
  }
  if(name === 'resumen'){
    refrescarResumen();
  }
  if(name === 'cuentas'){
    if(opts.newRecord) clearCuentaForm();
    refrescarCuentas();
    if(opts.focusForm) qs('cuenta-code').focus();
  }
  if(name === 'asientos'){
    const { periodos, entidades } = datosContabilidad();
    if(opts.newRecord || !qs('asiento-lineas').childElementCount){
      clearAsientoForm({ periodos, entidades });
    }else{
      poblarPeriodosAsiento(periodos, qs('asiento-periodo').value);
      poblarEntidadesAsiento(entidades, qs('asiento-entity').value);
    }
    poblarSelectCuentas(qs('filtro-asiento-cuenta'));
    refrescarAsientos();
    if(opts.focusForm) qs('asiento-date').focus();
  }
  if(name === 'pagos'){
    const { entidades, asientos } = datosContabilidad();
    if(opts.newRecord){
      clearPagoForm({ entidades, asientos });
    }else{
      poblarEntidadesPago(entidades, qs('pago-entity').value);
      poblarAsientosPago(asientos, qs('pago-asiento').value);
    }
    refrescarPagos();
    if(opts.focusForm) qs('pago-date').focus();
  }
  if(name === 'periodos'){
    if(opts.newRecord) clearPeriodoForm();
    refrescarPeriodos();
    if(opts.focusForm) qs('periodo-name').focus();
  }
  if(name === 'reportes'){
    refrescarReportes();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return true;
}

function populateDocumentEntitySelect(){
  const select = qs('document-entity');
  const prev = select.value;
  select.innerHTML = '';
  loadEntities().forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.entity_id;
    opt.textContent = e.name;
    select.appendChild(opt);
  });
  if(prev && [...select.options].some(o => o.value === prev)) select.value = prev;
}

function populateEditEntitySelect(){
  const select = qs('edit-entity');
  const prev = select.value;
  select.innerHTML = '';
  const none = document.createElement('option');
  none.value = '';
  none.textContent = `-- Selecciona ${articulo(labelFor('entity'))} ${labelFor('entity').toLowerCase()} --`;
  select.appendChild(none);
  loadEntities().forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.id;
    opt.textContent = `${e.name} — ${e.code}`;
    select.appendChild(opt);
  });
  if(prev && [...select.options].some(o => o.value === prev)) select.value = prev;
}

function populateEditDocumentSelect(){
  const select = qs('edit-document');
  const prev = select.value;
  select.innerHTML = '';
  const none = document.createElement('option');
  none.value = '';
  none.textContent = `-- Selecciona ${articulo(labelFor('document'))} ${labelFor('document').toLowerCase()} --`;
  select.appendChild(none);
  const entities = loadEntities();
  loadDocuments().forEach(d => {
    const entity = entities.find(e => e.entity_id === d.entity_id);
    const label = `${entity ? entity.name : 'Entidad desconocida'} · ${folioLabel(d)} · ${d.startDate} → ${d.endDate}`;
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = label;
    select.appendChild(opt);
  });
  if(prev && [...select.options].some(o => o.value === prev)) select.value = prev;
}

function refreshSearch(){
  renderSearchResults(qs('search-results-list'), qs('search-empty'), searchEntities(qs('search-input').value), (e) => createEntityItem(e));
}

function onEditEntityChange(){
  const id = qs('edit-entity').value;
  if(!id){ clearEntityForm(); return; }
  const entity = loadEntities().find(e => e.id === id);
  if(entity) startEntityEdit(entity);
}

function handleDeleteSelectedEntity(){
  const id = qs('edit-entity').value;
  if(!id){ qs('error-edit-entity').textContent = `Selecciona ${articulo(labelFor('entity'))} ${labelFor('entity').toLowerCase()} para eliminar.`; return; }
  if(!confirm(`¿Eliminar ${demostrativo(labelFor('entity'))} ${labelFor('entity').toLowerCase()}? Sus ${labelFor('documents').toLowerCase()} también se eliminarán.`)) return;
  deleteEntity(id);
  qs('error-edit-entity').textContent = '';
  clearEntityForm();
  populateDocumentEntitySelect();
  populateEditEntitySelect();
  populateEditDocumentSelect();
  anunciarConfirmacion('Entidad eliminada correctamente.');
}

function onEditDocumentChange(){
  const id = qs('edit-document').value;
  if(!id){ clearDocumentForm(); return; }
  const doc = loadDocuments().find(d => d.id === id);
  if(doc) startDocumentEdit(doc);
}

function handleDeleteSelectedDocument(){
  const id = qs('edit-document').value;
  if(!id){ qs('error-edit-document').textContent = `Selecciona ${articulo(labelFor('document'))} ${labelFor('document').toLowerCase()} para eliminar.`; return; }
  if(!confirm(`¿Eliminar ${demostrativo(labelFor('document'))} ${labelFor('document').toLowerCase()}?`)) return;
  deleteDocument(id);
  qs('error-edit-document').textContent = '';
  clearDocumentForm();
  populateEditDocumentSelect();
  anunciarConfirmacion('Documento eliminado correctamente.');
}

function afterSaveRefresh(){
  populateDocumentEntitySelect();
  populateEditEntitySelect();
  populateEditDocumentSelect();
}

function handleEntitySubmit(ev){
  ev.preventDefault();
  const id = qs('entity-id').value;
  const payload = collectEntityPayload();
  const { valid, errors } = validateEntity(payload);
  showEntityErrors(errors);
  if(!valid) return;
  if(id){
    try{
      updateEntity(id, payload);
      clearEntityForm();
    }catch(e){ alert(e.message); }
  }else{
    addEntity(payload);
    clearEntityForm();
  }
  afterSaveRefresh();
  anunciarConfirmacion(id ? 'Entidad actualizada correctamente.' : 'Entidad creada correctamente.');
}

function handleDocumentSubmit(ev){
  ev.preventDefault();
  const id = qs('document-id').value;
  const payload = collectDocumentPayload();
  const existing = id ? loadDocuments().find(d => d.id === id) : undefined;
  const { valid, errors } = validateDocument(payload, existing ? existing.status : undefined);
  showDocumentErrors(errors);
  if(!valid) return;
  try{
    if(id){
      updateDocument(id, payload);
    }else{
      addDocument(payload);
    }
    clearDocumentForm();
  }catch(e){
    alert(e.message);
    showDocumentErrors({ status: e.message });
  }
  afterSaveRefresh();
  anunciarConfirmacion(id ? 'Documento actualizado correctamente.' : 'Documento creado correctamente.');
}

function handleCuentaSubmit(ev){
  ev.preventDefault();
  if(!verificarPermiso('cuentas', qs('cuenta-id').value ? 'editar' : 'crear')) return;
  const id = qs('cuenta-id').value;
  const payload = collectCuentaPayload();
  const revision = validarCuenta(payload, { cuentas: Almacen.loadCuentas(), id: id || null });
  showCuentaErrors(revision.errores);
  if(!revision.valido) return;
  try{
    if(id) Cuentas.actualizarCuenta(id, payload);
    else Cuentas.crearCuenta(payload);
    clearCuentaForm();
    refrescarCuentas();
    anunciarConfirmacion(id ? 'Cuenta contable actualizada correctamente.' : 'Cuenta contable creada correctamente.');
  }catch(e){
    showCuentaErrors({ code: e.message });
  }
}

function handleCuentaListClick(ev){
  const boton = ev.target.closest('button[data-action]');
  if(!boton) return;
  const id = boton.dataset.id;
  const permisosAccion = { 'editar-cuenta': 'editar', 'eliminar-cuenta': 'eliminar' };
  if(permisosAccion[boton.dataset.action] && !verificarPermiso('cuentas', permisosAccion[boton.dataset.action])) return;
  if(boton.dataset.action === 'ver-detalle-cuenta'){
    qs('cuenta-detalle-id').value = id;
    refrescarCuentas();
    return;
  }
  if(boton.dataset.action === 'editar-cuenta'){
    const cuenta = Cuentas.obtenerCuenta(id);
    if(!cuenta) return;
    startCuentaEdit(cuenta);
    refrescarCuentas();
    qs('cuenta-code').focus();
    return;
  }
  if(boton.dataset.action === 'eliminar-cuenta'){
    if(!confirmar('¿Eliminar la cuenta contable seleccionada?')) return;
    try{
      const resultado = Cuentas.eliminarCuenta(id);
      if(resultado.inactivada){
        qs('error-cuenta-code').textContent = 'La cuenta tiene movimientos o subcuentas, por lo que fue inactivada.';
      }else{
        qs('error-cuenta-code').textContent = '';
      }
      clearCuentaForm();
      refrescarCuentas();
      anunciarConfirmacion(resultado.inactivada ? 'Cuenta contable inactivada por tener movimientos.' : 'Cuenta contable eliminada correctamente.');
    }catch(e){
      showCuentaErrors({ code: e.message });
    }
  }
}

function handleAsientoSubmit(ev){
  ev.preventDefault();
  if(!verificarPermiso('asientos', qs('asiento-id').value ? 'editar' : 'crear')) return;
  const id = qs('asiento-id').value;
  const payload = collectAsientoPayload();
  const existente = id ? Asientos.obtenerAsiento(id) : null;
  const series = String(payload.series || '').trim();
  const folio = payload.folio !== ''
    ? Number(payload.folio)
    : (existente ? existente.folio : Asientos.siguienteFolio(series));
  const revision = validarAsiento({ ...payload, series, folio }, {
    periodos: Almacen.loadPeriodos(),
    cuentas: Almacen.loadCuentas(),
    asientos: Almacen.loadAsientos(),
    id: id || null
  });
  showAsientoErrors(revision.errores);
  if(!revision.valido) return;
  try{
    if(id) Asientos.actualizarAsiento(id, { ...payload, series, folio });
    else Asientos.crearAsiento({ ...payload, series, folio });
    const { periodos, entidades } = datosContabilidad();
    clearAsientoForm({ periodos, entidades });
    refrescarAsientos();
    anunciarConfirmacion(id ? 'Asiento contable actualizado correctamente.' : 'Asiento contable creado correctamente.');
  }catch(e){
    showAsientoErrors({ balance: e.message });
  }
}

function handleAsientoListClick(ev){
  const boton = ev.target.closest('button[data-action]');
  if(!boton) return;
  const id = boton.dataset.id;
  const accion = boton.dataset.action;
  const { periodos, entidades } = datosContabilidad();
  const permisosAccion = {
    'editar-asiento': 'editar',
    'aprobar-asiento': 'editar',
    'cancelar-asiento': 'editar',
    'eliminar-asiento': 'eliminar'
  };
  if(permisosAccion[accion] && !verificarPermiso('asientos', permisosAccion[accion])) return;
  if(accion === 'ver-detalle-asiento' || accion === 'ver-historial-asiento'){
    if(accion === 'ver-historial-asiento' && !exigirAuditoriaMovimiento()) return;
    mostrarDetalleAsiento(id, accion === 'ver-historial-asiento');
    return;
  }
  if(accion === 'editar-asiento'){
    const registro = Asientos.asientoConLineas(id);
    if(!registro) return;
    startAsientoEdit(registro, registro.lines, { periodos, entidades });
    qs('asiento-date').focus();
    return;
  }
  const mensajes = {
    'aprobar-asiento': '¿Aprobar el asiento contable seleccionado?',
    'cancelar-asiento': '¿Cancelar el asiento contable seleccionado?',
    'eliminar-asiento': '¿Eliminar el asiento contable seleccionado?'
  };
  if(!confirmar(mensajes[accion])) return;
  try{
    if(accion === 'aprobar-asiento') Asientos.aprobarAsiento(id);
    if(accion === 'cancelar-asiento') Asientos.cancelarAsiento(id);
    if(accion === 'eliminar-asiento') Asientos.eliminarAsiento(id);
    qs('error-asiento-lineas').textContent = '';
    if(qs('asiento-id').value === id) clearAsientoForm({ periodos, entidades });
    refrescarAsientos();
    const verbos = { 'aprobar-asiento': 'aprobado', 'cancelar-asiento': 'cancelado', 'eliminar-asiento': 'eliminado' };
    anunciarConfirmacion(`Asiento contable ${verbos[accion] || 'actualizado'} correctamente.`);
  }catch(e){
    showAsientoErrors({ balance: e.message });
  }
}

function mostrarErrorPago(error){
  const mensaje = error?.message || 'No se pudo completar la operación.';
  if(mensaje === Pagos.MENSAJE_PERIODO_CERRADO || /periodo.*cerrado/i.test(mensaje)){
    showPagoErrors({ date: mensaje });
    anunciarConfirmacion(mensaje);
    qs('pago-date')?.focus();
    return;
  }
  showPagoErrors({ amount: mensaje });
}

function handlePagoSubmit(ev){
  ev.preventDefault();
  if(!verificarPermiso('pagos', qs('pago-id').value ? 'editar' : 'crear')) return;
  const id = qs('pago-id').value;
  const payload = collectPagoPayload();
  const existente = id ? Pagos.obtenerPago(id) : null;
  const tipo = String(payload.tipo || '').trim() || 'pago';
  const series = String(payload.series || '').trim()
    || (existente ? existente.series : (tipo === 'cobro' ? 'COB' : 'PAG'));
  const folio = payload.folio !== ''
    ? Number(payload.folio)
    : (existente ? existente.folio : Pagos.siguienteFolio(series, tipo));
  const numero = existente && existente.series === series && Number(existente.folio) === folio
    ? existente.numero
    : `${series}-${folio}`;
  const revision = validarPago({ ...payload, tipo, series, folio, numero }, {
    pagos: Almacen.loadPagos(),
    entidades: loadEntities(),
    asientos: Almacen.loadAsientos(),
    id: id || null
  });
  showPagoErrors(revision.errores);
  if(!revision.valido) return;
  try{
    if(id) Pagos.actualizarPago(id, { ...payload, tipo, series, folio, numero, status: revision.status });
    else Pagos.crearPago({ ...payload, tipo, series, folio, numero, status: revision.status });
    const { entidades, asientos } = datosContabilidad();
    clearPagoForm({ entidades, asientos });
    refrescarPagos();
    refrescarDashboard();
    anunciarConfirmacion(id ? 'Pago o cobro actualizado correctamente.' : 'Pago o cobro creado correctamente.');
  }catch(e){
    mostrarErrorPago(e);
  }
}

function handlePagoListClick(ev){
  const boton = ev.target.closest('button[data-action]');
  if(!boton) return;
  const id = boton.dataset.id;
  const accion = boton.dataset.action;
  const { entidades, asientos } = datosContabilidad();
  if(accion === 'ver-pago' || accion === 'ver-historial-pago'){
    if(accion === 'ver-historial-pago' && !exigirAuditoriaMovimiento()) return;
    mostrarDetallePago(id, accion === 'ver-historial-pago');
    return;
  }
  if(accion === 'editar-pago'){
    if(!verificarPermiso('pagos', 'editar')) return;
    const pago = Pagos.obtenerPago(id);
    if(!pago) return;
    startPagoEdit(pago, { entidades, asientos });
    qs('pago-date').focus();
    return;
  }
  if(accion === 'marcar-pagado'){
    if(!verificarPermiso('pagos', 'marcarPagado')) return;
    try{
      Pagos.marcarPagado(id);
      refrescarPagos();
      refrescarDashboard();
      anunciarConfirmacion('Pago marcado como pagado correctamente.');
    }catch(e){
      mostrarErrorPago(e);
    }
    return;
  }
  const permisosAccion = { 'editar-pago': 'editar', 'cancelar-pago': 'editar', 'eliminar-pago': 'eliminar' };
  if(permisosAccion[accion] && !verificarPermiso('pagos', permisosAccion[accion])) return;
  const mensajes = {
    'cancelar-pago': '¿Cancelar el pago seleccionado?',
    'eliminar-pago': '¿Eliminar el pago seleccionado?'
  };
  if(!confirmar(mensajes[accion])) return;
  try{
    if(accion === 'cancelar-pago') Pagos.cancelarPago(id);
    if(accion === 'eliminar-pago') Pagos.eliminarPago(id);
    if(qs('pago-id').value === id){
      clearPagoForm({ entidades, asientos });
    }
    refrescarPagos();
    refrescarDashboard();
    const verbos = { 'cancelar-pago': 'cancelado', 'eliminar-pago': 'eliminado' };
    anunciarConfirmacion(`Pago o cobro ${verbos[accion] || 'actualizado'} correctamente.`);
  }catch(e){
    mostrarErrorPago(e);
  }
}

function handlePeriodoSubmit(ev){
  ev.preventDefault();
  if(!verificarPermiso('periodos', qs('periodo-id').value ? 'editar' : 'crear')) return;
  const id = qs('periodo-id').value;
  const payload = collectPeriodoPayload();
  const revision = validarPeriodo(payload, { periodos: Almacen.loadPeriodos(), id: id || null });
  showPeriodoErrors(revision.errores);
  if(!revision.valido) return;
  const actual = id ? Almacen.loadPeriodos().find((periodo) => periodo.id === id) : null;
  if(payload.status === 'cerrado' && actual?.status !== 'cerrado'){
    if(!confirmar(`¿Cerrar el periodo "${payload.name}"? Esta acción es definitiva.`)){
      qs('periodo-status').value = actual?.status || 'abierto';
      return;
    }
  }
  try{
    if(id) Periodos.actualizarPeriodo(id, payload);
    else Periodos.crearPeriodo(payload);
    clearPeriodoForm();
    refrescarPeriodos();
    anunciarConfirmacion(id ? 'Periodo contable actualizado correctamente.' : 'Periodo contable creado correctamente.');
  }catch(e){
    showPeriodoErrors({ name: e.message });
  }
}

function handlePeriodoListClick(ev){
  const boton = ev.target.closest('button[data-action]');
  if(!boton) return;
  const id = boton.dataset.id;
  const accion = boton.dataset.action;
  const permisosAccion = { 'editar-periodo': 'editar', 'cerrar-periodo': 'cerrar', 'eliminar-periodo': 'eliminar' };
  if(permisosAccion[accion] && !verificarPermiso('periodos', permisosAccion[accion])) return;
  if(accion === 'editar-periodo'){
    const periodo = Periodos.obtenerPeriodo(id);
    if(periodo) startPeriodoEdit(periodo);
    return;
  }
  if(accion === 'cerrar-periodo'){
    const periodo = Periodos.obtenerPeriodo(id);
    if(!periodo || periodo.status !== 'abierto') return;
    if(!confirmar(`¿Cerrar el periodo "${periodo.name}"? Esta acción es definitiva.`)) return;
    try{
      Periodos.cambiarEstadoPeriodo(id, 'cerrado', { sesion: sesionActual() });
      refrescarPeriodos();
      anunciarConfirmacion('Periodo cerrado correctamente.');
    }catch(e){
      showPeriodoErrors({ name: e.message });
    }
    return;
  }
  if(accion === 'eliminar-periodo'){
    if(!confirmar('¿Eliminar el periodo contable seleccionado?')) return;
    try{
      const resultado = Periodos.eliminarPeriodo(id);
      if(resultado.cerrado){
        qs('error-periodo-name').textContent = 'El periodo tiene asientos asociados, por lo que fue cerrado en lugar de eliminado.';
      }else{
        qs('error-periodo-name').textContent = '';
      }
      if(qs('periodo-id').value === id) clearPeriodoForm();
      refrescarPeriodos();
      anunciarConfirmacion(resultado.cerrado ? 'Periodo cerrado por tener movimientos asociados.' : 'Periodo eliminado correctamente.');
    }catch(e){
      showPeriodoErrors({ name: e.message });
    }
  }
}

function handleAccesoSubmit(ev){
  ev.preventDefault();
  const { rut, contraseña } = obtenerCredenciales(qs(VIEWS.acceso));
  const revision = Sesion.iniciarSesion(rut, contraseña);
  if(!revision.ok){
    const errores = revision.errores || { acceso: revision.mensaje || revision.error || 'RUT o contraseña incorrectos' };
    mostrarErroresAcceso(errores);
    renderAcceso(qs(VIEWS.acceso), errores);
    return;
  }
  limpiarFormularioAcceso();
  aplicarSesion();
}

function handlePanelClick(ev){
  const boton = ev.target.closest('button[data-accion]');
  if(!boton) return;
  const accion = boton.dataset.accion;
  const mensaje = qs('mensaje-panel');
  const informar = (texto) => {
    if(mensaje){
      mensaje.textContent = texto;
      mensaje.hidden = !texto;
    }
    anunciarConfirmacion(texto);
  };
  if(accion === 'cerrar-sesion'){
    Sesion.cerrarSesion();
    mostrarAcceso();
    return;
  }
  if(accion === 'cargar-datos'){
    if(!puede('cargarDatos')){
      mostrarBloqueo('No tienes permiso para cargar datos de ejemplo.');
      return;
    }
    if(!confirmar('¿Cargar los datos de ejemplo? Se reemplazarán los datos contables actuales.')) return;
    Almacen.cargarDatosEjemplo();
    contabilidadInicializada = true;
    aplicarSesion();
    informar('Datos de ejemplo cargados correctamente.');
    return;
  }
  if(accion === 'restablecer-datos'){
    if(!puede('restablecerDatos')){
      mostrarBloqueo('No tienes permiso para restablecer los datos.');
      return;
    }
    if(!confirmar('¿Restablecer los datos iniciales? Se conservarán los usuarios y los roles.')) return;
    Almacen.restablecerEstadoInicial();
    contabilidadInicializada = true;
    aplicarSesion();
    informar('Datos restablecidos correctamente.');
  }
}

function applyLabels(config){
  const entity = config.labels.entity;
  const entities = config.labels.entities;
  const document_ = config.labels.document;
  const documents = config.labels.documents;

  document.title = config.moduleName;
  qs('brand-name').textContent = config.moduleName;
  applyShellLabels();

  qs('dashboard-heading').textContent = config.moduleName;
  qs('dashboard-subtitle').textContent = 'Administra cuentas, asientos, pagos, periodos y reportes financieros en un solo lugar.';

  qs('entities-view-heading').textContent = entities;
  qs('documents-view-heading').textContent = documents;
  qs('entity-form-heading').textContent = `Agregar / Editar ${entity}`;
  qs('edit-entity-heading').textContent = `Editar o eliminar ${articulo(entity)} ${entity.toLowerCase()}`;
  qs('document-form-heading').textContent = `Agregar / Editar ${document_}`;
  qs('edit-document-heading').textContent = `Editar o eliminar ${articulo(document_)} ${document_.toLowerCase()}`;
  qs('search-view-heading').textContent = `Buscar ${entities}`;
  qs('search-heading').textContent = `Buscar ${articulo(entity)} ${entity.toLowerCase()}`;
  qs('search-input').placeholder = 'Buscar por nombre, código, categoría...';
  qs('search-input').setAttribute('aria-label', `Buscar ${entities.toLowerCase()}`);
  qs('search-empty').textContent = 'Sin coincidencias para tu búsqueda.';
  qs('delete-entity').textContent = `Eliminar ${articulo(entity)} ${entity.toLowerCase()} ${seleccionada(entity)}`;
  qs('delete-document').textContent = `Eliminar ${articulo(document_)} ${document_.toLowerCase()} ${seleccionada(document_)}`;

  qs('resumen-view-heading').textContent = config.labels.resumen;
  qs('cuentas-view-heading').textContent = config.labels.cuentas;
  qs('asientos-view-heading').textContent = config.labels.asientos;
  qs('pagos-view-heading').textContent = 'Pagos y cobros';
  qs('periodos-view-heading').textContent = config.labels.periodos;
  qs('reportes-view-heading').textContent = config.labels.reportes;
  qs('cuenta-form-heading').textContent = `Agregar / Editar ${config.labels.cuenta.toLowerCase()}`;
  qs('asiento-form-heading').textContent = `Registrar ${config.labels.asiento.toLowerCase()}`;
  qs('periodo-form-heading').textContent = `Agregar / Editar ${config.labels.periodo.toLowerCase()}`;
}

function applyTheme(config){
  document.documentElement.style.setProperty('--accent', config.theme.accentColor);
}

function showConfigErrors(errors){
  const banner = qs('config-errors');
  if(errors && errors.length > 0){
    banner.textContent = `Problema de configuración del módulo: ${errors.join(' ')}`;
    banner.hidden = false;
  } else {
    banner.hidden = true;
    banner.textContent = '';
  }
}

function limpiarFiltrosAsientos(){
  limpiarControles([
    'filtro-asiento-fecha-desde', 'filtro-asiento-fecha-hasta', 'filtro-asiento-cuenta',
    'filtro-asiento-monto-min', 'filtro-asiento-monto-max', 'asientos-filtro'
  ]);
  const estado = qs('filtro-asiento-estado');
  if(estado) estado.value = 'todos';
}

function limpiarFiltrosPagos(){
  limpiarControles([
    'filtro-pago-fecha-desde', 'filtro-pago-fecha-hasta', 'filtro-pago-cuenta',
    'filtro-pago-monto-min', 'filtro-pago-monto-max', 'pagos-filtro-texto',
    'pagos-filtro-tipo', 'pagos-filtro-entidad'
  ]);
  filtroEstadoPago = 'todos';
  const estado = qs('filtro-estado-pago');
  if(estado) estado.value = 'todos';
}

function wireEvents(){
  if(wired) return;
  wired = true;
  document.querySelectorAll('.nav-module').forEach(btn => {
    btn.addEventListener('click', () => showModule(btn.dataset.module));
  });
  on('dashboard-periodo', 'change', refrescarDashboard);
  qs('entity-form').addEventListener('submit', handleEntitySubmit);
  qs('cancel-edit').addEventListener('click', clearEntityForm);
  qs('document-form').addEventListener('submit', handleDocumentSubmit);
  qs('document-cancel-edit').addEventListener('click', clearDocumentForm);
  setupSearchBar(qs('search-input'), () => refreshSearch());
  qs('edit-entity').addEventListener('change', onEditEntityChange);
  qs('edit-document').addEventListener('change', onEditDocumentChange);
  qs('delete-entity').addEventListener('click', handleDeleteSelectedEntity);
  qs('delete-document').addEventListener('click', handleDeleteSelectedDocument);
  on('cuenta-form', 'submit', handleCuentaSubmit);
  on('cuenta-cancel-edit', 'click', clearCuentaForm);
  on('cuentas-lista', 'click', handleCuentaListClick);
  on('asiento-form', 'submit', handleAsientoSubmit);
  on('asiento-cancel-edit', 'click', () => {
    const { periodos, entidades } = datosContabilidad();
    clearAsientoForm({ periodos, entidades });
  });
  on('asiento-agregar-linea', 'click', () => agregarLinea());
  on('asiento-lineas', 'click', (ev) => {
    const boton = ev.target.closest('[data-action="quitar-linea"]');
    if(boton) quitarLinea(boton);
  });
  on('asientos-lista', 'click', handleAsientoListClick);
  on('pago-form', 'submit', handlePagoSubmit);
  on('pago-cancel-edit', 'click', () => {
    const { entidades, asientos } = datosContabilidad();
    clearPagoForm({ entidades, asientos });
  });
  on('pagos-lista', 'click', handlePagoListClick);
  on('pagos-filtro-tipo', 'change', refrescarPagos);
  on('pagos-filtro-entidad', 'change', refrescarPagos);
  on('pagos-filtro-texto', 'input', refrescarPagos);
  on('cuentas-filtro', 'input', refrescarCuentas);
  on('asientos-filtro', 'input', refrescarAsientos);
  on('periodos-filtro', 'input', refrescarPeriodos);
  on('periodo-form', 'submit', handlePeriodoSubmit);
  on('periodo-cancel-edit', 'click', clearPeriodoForm);
  on('periodos-lista', 'click', handlePeriodoListClick);
  on('filtro-estado-pago', 'change', (ev) => {
    filtroEstadoPago = ev.target.value;
    refrescarPagos();
  });
  on('resumen-periodo', 'change', refrescarResumen);
  on('reportes-periodo', 'change', refrescarReportes);
  on('acceso-formulario', 'submit', handleAccesoSubmit);
  on('view-panel-inicio', 'click', handlePanelClick);
  document.addEventListener('click', handleAccionesGlobales);
  document.addEventListener('keydown', handleAccionesGlobalesTeclado);

  const conectarFiltro = (id, manejador) => {
    on(id, 'change', manejador);
    on(id, 'input', manejador);
  };
  [
    'filtro-asiento-fecha-desde', 'filtro-asiento-fecha-hasta', 'filtro-asiento-cuenta',
    'filtro-asiento-monto-min', 'filtro-asiento-monto-max', 'filtro-asiento-estado'
  ].forEach(id => conectarFiltro(id, refrescarAsientos));
  [
    'filtro-pago-fecha-desde', 'filtro-pago-fecha-hasta', 'filtro-pago-cuenta',
    'filtro-pago-monto-min', 'filtro-pago-monto-max'
  ].forEach(id => conectarFiltro(id, refrescarPagos));
  on('asientos-limpiar-filtros', 'click', () => {
    limpiarFiltrosAsientos();
    refrescarAsientos();
  });
  on('pagos-limpiar-filtros', 'click', () => {
    limpiarFiltrosPagos();
    refrescarPagos();
  });
}

export function initApp(resolved, opciones = {}){
  migrarAlmacenLegado();
  modoAcceso = Boolean(opciones.requireAccess);
  showConfigErrors(resolved.errors);
  setActiveConfig(resolved.config);
  applyTheme(resolved.config);
  renderLogo(qs('logo-mark'));
  applyLabels(resolved.config);
  renderizarIconosMenu();
  inicializarShellAccesible();
  wireEvents();
  clearEntityForm();
  clearDocumentForm();
  clearCuentaForm();
  clearPagoForm();
  clearPeriodoForm();
  Almacen.inicializarAcceso();
  renderizarUsuariosPrueba(qs(VIEWS.acceso));
  if(modoAcceso) asegurarContabilidad();
  Pagos.normalizarEstadosHeredados();
  if(modoAcceso){
    if(sesionActual()) aplicarSesion();
    else mostrarAcceso();
  }else{
    establecerVisibilidadMenu(true);
    document.querySelectorAll('.nav-module').forEach(boton => {
      boton.hidden = !moduloVisible(boton.dataset.module || boton.dataset.destino);
    });
    showModule('dashboard');
  }
}

export function iniciarSesionApp(rut, contraseña){
  const revision = Sesion.iniciarSesion(rut, contraseña);
  if(!revision.ok) return revision;
  const aceptada = aplicarSesion();
  return { ok: aceptada, sesion: revision.sesion };
}

export async function boot(overrideConfig, opciones = {}){
  const resolved = overrideConfig !== undefined ? normalizeConfig(overrideConfig) : await loadModuleConfig();
  initApp(resolved, opciones);
}
