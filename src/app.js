import { loadModuleConfig, normalizeConfig, setActiveConfig, labelFor } from './module-config.js';
import { loadEntities, addEntity, updateEntity, deleteEntity, validateEntity, searchEntities, loadDocuments, addDocument, updateDocument, deleteDocument, validateDocument } from './storage.js';
import { clearEntityForm, startEntityEdit, collectEntityPayload, showEntityErrors } from './components/entity-form.js';
import { createEntityItem } from './components/entity-list.js';
import { clearDocumentForm, startDocumentEdit, collectDocumentPayload, showDocumentErrors } from './components/document-form.js';
import { folioLabel } from './components/document-list.js';
import { renderLogo, applyShellLabels, setActiveModule } from './components/shell.js';
import { renderDashboard } from './components/dashboard.js';
import { setupSearchBar, renderSearchResults } from './components/search-bar.js';
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
import { renderCuentaList } from './components/contabilidad/cuenta-list.js';
import { clearAsientoForm, startAsientoEdit, collectAsientoPayload, showAsientoErrors, agregarLinea, quitarLinea, poblarPeriodosAsiento, poblarEntidadesAsiento } from './components/contabilidad/asiento-form.js';
import { renderAsientoList } from './components/contabilidad/asiento-list.js';
import { clearPagoForm, startPagoEdit, collectPagoPayload, showPagoErrors, poblarEntidadesPago, poblarDocumentosPago, poblarAsientosPago } from './components/contabilidad/pago-form.js';
import { renderPagoList, renderPagoDetalle } from './components/contabilidad/pago-list.js';
import { clearPeriodoForm, startPeriodoEdit, collectPeriodoPayload, showPeriodoErrors } from './components/contabilidad/periodo-form.js';
import { renderPeriodoList } from './components/contabilidad/periodo-list.js';
import { renderReporte } from './components/contabilidad/reportes.js';

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

const MODULES = ['dashboard', 'entities', 'documents', 'search', 'resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes'];
const VIEWS = {
  dashboard: 'view-dashboard',
  entities: 'view-entities',
  documents: 'view-documents',
  search: 'view-search',
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

function confirmar(mensaje){
  try{
    return typeof confirm === 'function' ? confirm(mensaje) : true;
  }catch(error){
    return true;
  }
}

function asegurarContabilidad(){
  if(!contabilidadInicializada){
    Almacen.inicializarContabilidad();
    contabilidadInicializada = true;
  }
}

function datosContabilidad(){
  return {
    entidades: loadEntities(),
    documentos: loadDocuments(),
    periodos: Periodos.listarPeriodos(),
    asientos: Asientos.listarAsientos()
  };
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
  const cuentas = Cuentas.listarCuentas();
  const hayCuentas = renderCuentaList(qs('cuentas-lista'), cuentas);
  qs('cuentas-empty').hidden = hayCuentas;
  populateCuentaParentSelect(cuentas, { excludeId: qs('cuenta-id').value || null });
}

function refrescarAsientos(){
  const hayAsientos = renderAsientoList(qs('asientos-lista'), Asientos.listarAsientos());
  qs('asientos-empty').hidden = hayAsientos;
}

function refrescarPagos(){
  const { entidades, documentos, asientos } = datosContabilidad();
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

  const hayPagos = renderPagoList(qs('pagos-lista'), Pagos.listarPagos(), {
    entidades,
    tipo: qs('pagos-filtro-tipo').value,
    entityId: filtroEntidad.value
  });
  qs('pagos-empty').hidden = hayPagos;
  if(!hayPagos) renderPagoDetalle(qs('pago-detalle'), null, { entidades, documentos, asientos });
}

function refrescarPeriodos(){
  const hayPeriodos = renderPeriodoList(qs('periodos-lista'), Periodos.listarPeriodos());
  qs('periodos-empty').hidden = hayPeriodos;
}

function refrescarReportes(){
  const periodos = Periodos.listarPeriodos();
  const periodoId = elegirPeriodo(periodos, qs('reportes-periodo').value);
  const resultado = periodoId ? Reportes.obtenerMovimientos(periodoId) : null;
  renderReporte({ periodos, periodoId, resultado });
}

function showModule(name, opts = {}){
  if(!MODULES.includes(name)) name = 'dashboard';
  MODULES.forEach(m => { qs(VIEWS[m]).hidden = m !== name; });
  setActiveModule(name);
  if(name === 'dashboard'){
    renderDashboard();
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
    refrescarAsientos();
    if(opts.focusForm) qs('asiento-date').focus();
  }
  if(name === 'pagos'){
    const { entidades, documentos, asientos } = datosContabilidad();
    if(opts.newRecord){
      clearPagoForm({ entidades, documentos, asientos });
    }else{
      poblarEntidadesPago(entidades, qs('pago-entity').value);
      poblarDocumentosPago(documentos, qs('pago-document').value);
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
}

function handleCuentaSubmit(ev){
  ev.preventDefault();
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
  }catch(e){
    showCuentaErrors({ code: e.message });
  }
}

function handleCuentaListClick(ev){
  const boton = ev.target.closest('button[data-action]');
  if(!boton) return;
  const id = boton.dataset.id;
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
    }catch(e){
      showCuentaErrors({ code: e.message });
    }
  }
}

function handleAsientoSubmit(ev){
  ev.preventDefault();
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
  }catch(e){
    showAsientoErrors({ balance: e.message });
  }
}

function handlePagoSubmit(ev){
  ev.preventDefault();
  const id = qs('pago-id').value;
  const payload = collectPagoPayload();
  const existente = id ? Pagos.obtenerPago(id) : null;
  const tipo = String(payload.tipo || '').trim() || 'pago';
  const series = String(payload.series || '').trim()
    || (existente ? existente.series : (tipo === 'cobro' ? 'COB' : 'PAG'));
  const folio = payload.folio !== ''
    ? Number(payload.folio)
    : (existente ? existente.folio : Pagos.siguienteFolio(series));
  const numero = existente && existente.series === series && Number(existente.folio) === folio
    ? existente.numero
    : `${series}-${folio}`;
  const revision = validarPago({ ...payload, tipo, series, folio, numero }, {
    pagos: Almacen.loadPagos(),
    entidades: loadEntities(),
    documentos: loadDocuments(),
    asientos: Almacen.loadAsientos(),
    id: id || null
  });
  showPagoErrors(revision.errores);
  if(!revision.valido) return;
  try{
    if(id) Pagos.actualizarPago(id, { ...payload, tipo, series, folio, numero });
    else Pagos.crearPago({ ...payload, tipo, series, folio, numero });
    const { entidades, documentos, asientos } = datosContabilidad();
    clearPagoForm({ entidades, documentos, asientos });
    refrescarPagos();
  }catch(e){
    showPagoErrors({ amount: e.message });
  }
}

function handlePagoListClick(ev){
  const boton = ev.target.closest('button[data-action]');
  if(!boton) return;
  const id = boton.dataset.id;
  const accion = boton.dataset.action;
  const { entidades, documentos, asientos } = datosContabilidad();
  if(accion === 'ver-pago'){
    const pago = Pagos.obtenerPago(id);
    renderPagoDetalle(qs('pago-detalle'), pago, { entidades, documentos, asientos });
    return;
  }
  if(accion === 'editar-pago'){
    const pago = Pagos.obtenerPago(id);
    if(!pago) return;
    startPagoEdit(pago, { entidades, documentos, asientos });
    qs('pago-date').focus();
    return;
  }
  const mensajes = {
    'cancelar-pago': '¿Cancelar el pago seleccionado?',
    'eliminar-pago': '¿Eliminar el pago seleccionado?'
  };
  if(!confirmar(mensajes[accion])) return;
  try{
    if(accion === 'cancelar-pago') Pagos.cancelarPago(id);
    if(accion === 'eliminar-pago') Pagos.eliminarPago(id);
    if(qs('pago-id').value === id){
      clearPagoForm({ entidades, documentos, asientos });
    }
    refrescarPagos();
  }catch(e){
    showPagoErrors({ amount: e.message });
  }
}

function handlePeriodoSubmit(ev){
  ev.preventDefault();
  const id = qs('periodo-id').value;
  const payload = collectPeriodoPayload();
  const revision = validarPeriodo(payload, { periodos: Almacen.loadPeriodos(), id: id || null });
  showPeriodoErrors(revision.errores);
  if(!revision.valido) return;
  try{
    if(id) Periodos.actualizarPeriodo(id, payload);
    else Periodos.crearPeriodo(payload);
    clearPeriodoForm();
    refrescarPeriodos();
  }catch(e){
    showPeriodoErrors({ name: e.message });
  }
}

function handlePeriodoListClick(ev){
  const boton = ev.target.closest('button[data-action]');
  if(!boton) return;
  const id = boton.dataset.id;
  const accion = boton.dataset.action;
  if(accion === 'editar-periodo'){
    const periodo = Periodos.obtenerPeriodo(id);
    if(periodo) startPeriodoEdit(periodo);
    return;
  }
  if(accion === 'alternar-periodo'){
    const periodo = Periodos.obtenerPeriodo(id);
    if(!periodo) return;
    const siguiente = periodo.status === 'abierto' ? 'cerrado' : 'abierto';
    if(!confirmar(`¿${siguiente === 'cerrado' ? 'Cerrar' : 'Abrir'} el periodo "${periodo.name}"?`)) return;
    try{
      Periodos.cambiarEstadoPeriodo(id, siguiente);
      refrescarPeriodos();
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
    }catch(e){
      showPeriodoErrors({ name: e.message });
    }
  }
}

function handleResetContabilidad(){
  if(!confirmar('¿Restaurar los datos de ejemplo de contabilidad? Se reemplazarán los datos contables actuales.')) return;
  Almacen.reiniciarDatosEjemplo();
  contabilidadInicializada = true;
  refrescarResumen();
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

function wireEvents(){
  if(wired) return;
  wired = true;
  document.querySelectorAll('.nav-module').forEach(btn => {
    btn.addEventListener('click', () => showModule(btn.dataset.module));
  });
  on('action-nuevo-asiento', 'click', () => showModule('asientos', { newRecord: true, focusForm: true }));
  on('action-cuentas', 'click', () => showModule('cuentas'));
  on('action-registrar-pago', 'click', () => showModule('pagos', { newRecord: true, focusForm: true }));
  on('action-ver-reportes', 'click', () => showModule('reportes'));
  on('dashboard-periodo', 'change', renderDashboard);
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
    const { entidades, documentos, asientos } = datosContabilidad();
    clearPagoForm({ entidades, documentos, asientos });
  });
  on('pagos-lista', 'click', handlePagoListClick);
  on('pagos-filtro-tipo', 'change', refrescarPagos);
  on('pagos-filtro-entidad', 'change', refrescarPagos);
  on('periodo-form', 'submit', handlePeriodoSubmit);
  on('periodo-cancel-edit', 'click', clearPeriodoForm);
  on('periodos-lista', 'click', handlePeriodoListClick);
  on('resumen-periodo', 'change', refrescarResumen);
  on('resumen-reset', 'click', handleResetContabilidad);
  on('reportes-periodo', 'change', refrescarReportes);
}

export function initApp(resolved){
  showConfigErrors(resolved.errors);
  setActiveConfig(resolved.config);
  applyTheme(resolved.config);
  renderLogo(qs('logo-mark'));
  applyLabels(resolved.config);
  wireEvents();
  clearEntityForm();
  clearDocumentForm();
  clearCuentaForm();
  clearPagoForm();
  clearPeriodoForm();
  showModule('dashboard');
}

export async function boot(overrideConfig){
  const resolved = overrideConfig !== undefined ? normalizeConfig(overrideConfig) : await loadModuleConfig();
  initApp(resolved);
}
