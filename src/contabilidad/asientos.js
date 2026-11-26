import { loadAsientos, saveAsientos, loadLineas, saveLineas, loadCuentas, loadPeriodos, loadSesion } from './almacenamiento.js';
import { loadDocuments } from '../storage.js';
import { validarAsiento, validarTransicionAsiento } from './validaciones-asientos.js';
import { normalizarImporte, desdeCentavos } from './dinero.js';
import { registrarEvento, calcularCambios, historialPorMovimiento } from './auditoria.js';
import { asegurarEscrituraPeriodo, MENSAJE_PERIODO_CERRADO } from './validaciones-periodos.js';

function generarId(prefijo) {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ahora() {
  return new Date().toISOString();
}

function sesionDe(opciones = {}) {
  if (opciones.sesion !== undefined) return opciones.sesion;
  const actual = loadSesion();
  return actual && (!actual.estado || actual.estado === 'autenticada') ? actual : null;
}

function ordenarAsientos(asientos) {
  return [...asientos].sort((a, b) => {
    const porFecha = String(a.date).localeCompare(String(b.date));
    if (porFecha !== 0) return porFecha;
    return String(a.series).localeCompare(String(b.series)) || Number(a.folio) - Number(b.folio);
  });
}

function serieDe(series) {
  return String(series || '').trim() || 'DI';
}

function numeroDe(asiento) {
  return asiento && asiento.series && asiento.folio
    ? `${asiento.series}-${asiento.folio}`
    : '';
}

function resumenLineas(lineas = []) {
  return lineas.map((linea) => ({
    cuenta_id: linea.cuenta_id,
    concept: linea.concept,
    debit: Number(linea.debit) || 0,
    credit: Number(linea.credit) || 0,
    entity_id: linea.entity_id || null
  }));
}

export function listarAsientos() {
  return ordenarAsientos(loadAsientos());
}

export function obtenerAsiento(id) {
  return loadAsientos().find((a) => a.id === id) || null;
}

export function lineasDeAsiento(asientoId) {
  return loadLineas().filter((l) => l.asiento_id === asientoId);
}

export function asientoConLineas(id) {
  const asiento = obtenerAsiento(id);
  if (!asiento) return null;
  return { ...asiento, lines: lineasDeAsiento(id) };
}

export function siguienteFolio(series = '') {
  const serie = serieDe(series);
  const folios = loadAsientos()
    .filter((a) => serieDe(a.series) === serie)
    .map((a) => Number(a.folio))
    .filter(Number.isInteger);
  return folios.length === 0 ? 1001 : Math.max(...folios) + 1;
}

function documentoExiste(id) {
  return loadDocuments().some((d) => d.id === id);
}

function construirLineas(asientoId, lineas, conceptoCabecera, marcas) {
  return lineas.map((linea) => ({
    id: generarId('lin'),
    asiento_id: asientoId,
    cuenta_id: linea.cuenta_id,
    concept: String(linea.concept || '').trim() || conceptoCabecera,
    debit: normalizarImporte(linea.debit).centavos || 0,
    credit: normalizarImporte(linea.credit).centavos || 0,
    entity_id: linea.entity_id || null,
    createdAt: marcas,
    updatedAt: marcas
  }));
}

function normalizarLineas(lineas) {
  return (Array.isArray(lineas) ? lineas : []).map((linea) => ({
    cuenta_id: linea.cuenta_id,
    concept: linea.concept,
    debit: linea.debit === '' || linea.debit === undefined ? 0 : Number(linea.debit),
    credit: linea.credit === '' || linea.credit === undefined ? 0 : Number(linea.credit),
    entity_id: linea.entity_id || null
  }));
}

function auditarAsiento({ accion, antes, despues, sesion, cambios = [], descripcion }) {
  const movimiento = despues || antes || {};
  registrarEvento({
    accion,
    modulo: 'asientos',
    tipoMovimiento: 'asiento',
    entidad: 'asiento',
    entidadId: movimiento.id,
    numero: numeroDe(movimiento),
    sesion,
    cambios,
    descripcion
  });
}

export function crearAsiento(payload = {}, opciones = {}) {
  const periodos = loadPeriodos();
  const cuentas = loadCuentas();
  const asientos = loadAsientos();
  const series = serieDe(payload.series);
  const folio = payload.folio === undefined || payload.folio === null || payload.folio === ''
    ? siguienteFolio(series)
    : Number(payload.folio);
  const lineas = normalizarLineas(payload.lines);
  asegurarEscrituraPeriodo(null, payload.date, periodos);
  const datos = {
    ...payload,
    series,
    folio,
    currency: 'CLP',
    status: payload.status || 'borrador',
    lines: lineas
  };
  const revision = validarAsiento(datos, { periodos, cuentas, asientos, documentoExiste });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const marca = ahora();
  const asiento = {
    id: generarId('asi'),
    series,
    folio,
    date: payload.date,
    period_id: payload.period_id,
    concept: String(payload.concept).trim(),
    sourceDocumentType: payload.sourceDocumentId ? 'document' : (payload.sourceDocumentType || null),
    sourceDocumentId: payload.sourceDocumentId || null,
    entity_id: payload.entity_id || null,
    totalDebit: revision.totalDebit,
    totalCredit: revision.totalCredit,
    currency: 'CLP',
    status: payload.status || 'borrador',
    notes: String(payload.notes || '').trim(),
    createdAt: marca,
    updatedAt: marca
  };
  saveAsientos([...asientos, asiento]);
  saveLineas([...loadLineas(), ...construirLineas(asiento.id, lineas, asiento.concept, marca)]);
  auditarAsiento({
    accion: 'crear',
    despues: asiento,
    sesion: sesionDe(opciones),
    descripcion: `Creó el asiento contable ${numeroDe(asiento)}`
  });
  return asiento;
}

export function actualizarAsiento(id, cambios = {}, opciones = {}) {
  const asientos = loadAsientos();
  const indice = asientos.findIndex((a) => a.id === id);
  if (indice === -1) throw new Error('Asiento contable no encontrado');
  const actual = asientos[indice];
  const periodos = loadPeriodos();
  const fusionado = { ...actual, ...cambios };
  asegurarEscrituraPeriodo(actual.date, fusionado.date, periodos);
  if (actual.status !== 'borrador') {
    throw new Error('Solo se pueden editar asientos en estado borrador');
  }
  const lineasGuardadas = lineasDeAsiento(id).map((linea) => ({
    ...linea,
    debit: desdeCentavos(linea.debit),
    credit: desdeCentavos(linea.credit)
  }));
  const lineas = normalizarLineas(cambios.lines !== undefined ? cambios.lines : lineasGuardadas);
  const datos = {
    ...fusionado,
    series: serieDe(fusionado.series),
    folio: fusionado.folio,
    status: actual.status,
    currency: 'CLP',
    lines: lineas
  };
  const revision = validarAsiento(datos, {
    periodos,
    cuentas: loadCuentas(),
    asientos,
    id,
    documentoExiste
  });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const marca = ahora();
  const actualizado = {
    ...actual,
    series: datos.series,
    folio: datos.folio,
    date: fusionado.date,
    period_id: fusionado.period_id,
    concept: String(fusionado.concept).trim(),
    sourceDocumentType: fusionado.sourceDocumentId ? 'document' : (fusionado.sourceDocumentType || null),
    sourceDocumentId: fusionado.sourceDocumentId || null,
    entity_id: fusionado.entity_id || null,
    totalDebit: revision.totalDebit,
    totalCredit: revision.totalCredit,
    notes: String(fusionado.notes || '').trim(),
    updatedAt: marca
  };
  const cambiosDetectados = calcularCambios(actual, actualizado, [
    'series', 'folio', 'date', 'period_id', 'concept', 'sourceDocumentId', 'entity_id', 'totalDebit', 'totalCredit', 'notes'
  ]);
  const cambiosLineas = calcularCambios(
    { lineas: resumenLineas(lineasGuardadas) },
    { lineas: resumenLineas(lineas) },
    ['lineas']
  );
  const lista = [...asientos];
  lista[indice] = actualizado;
  saveAsientos(lista);
  saveLineas([
    ...loadLineas().filter((l) => l.asiento_id !== id),
    ...construirLineas(id, lineas, actualizado.concept, marca)
  ]);
  const todosLosCambios = [...cambiosDetectados, ...cambiosLineas];
  if (todosLosCambios.length > 0) {
    auditarAsiento({
      accion: 'editar',
      antes: actual,
      despues: actualizado,
      sesion: sesionDe(opciones),
      cambios: todosLosCambios,
      descripcion: `Editó el asiento contable ${numeroDe(actualizado)}`
    });
  }
  return actualizado;
}

export function cambiarEstadoAsiento(id, estado, opciones = {}) {
  const asientos = loadAsientos();
  const indice = asientos.findIndex((a) => a.id === id);
  if (indice === -1) throw new Error('Asiento contable no encontrado');
  const actual = asientos[indice];
  asegurarEscrituraPeriodo(actual.date, actual.date, loadPeriodos());
  if (actual.status === estado) return actual;
  const revision = validarTransicionAsiento(actual.status, estado);
  if (!revision.valido) throw new Error(revision.error);
  if (estado === 'aprobado') {
    const periodo = loadPeriodos().find((p) => p.id === actual.period_id);
    if (!periodo || periodo.status === 'cerrado') throw new Error(MENSAJE_PERIODO_CERRADO);
    if (actual.totalDebit !== actual.totalCredit) throw new Error('No se puede aprobar un asiento desbalanceado');
  }
  const actualizado = { ...actual, status: estado, updatedAt: ahora() };
  const lista = [...asientos];
  lista[indice] = actualizado;
  saveAsientos(lista);
  auditarAsiento({
    accion: estado === 'cancelado' ? 'anular' : 'editar',
    antes: actual,
    despues: actualizado,
    sesion: sesionDe(opciones),
    cambios: calcularCambios(actual, actualizado, ['status']),
    descripcion: estado === 'aprobado'
      ? `Aprobó el asiento contable ${numeroDe(actualizado)}`
      : estado === 'cancelado'
        ? `Anuló el asiento contable ${numeroDe(actualizado)}`
        : `Cambió el estado del asiento contable ${numeroDe(actualizado)}`
  });
  return actualizado;
}

export function aprobarAsiento(id, opciones = {}) {
  return cambiarEstadoAsiento(id, 'aprobado', opciones);
}

export function cancelarAsiento(id, opciones = {}) {
  return cambiarEstadoAsiento(id, 'cancelado', opciones);
}

export function eliminarAsiento(id, opciones = {}) {
  const asientos = loadAsientos();
  const asiento = asientos.find((a) => a.id === id);
  if (!asiento) throw new Error('Asiento contable no encontrado');
  asegurarEscrituraPeriodo(asiento.date, asiento.date, loadPeriodos());
  if (asiento.status !== 'borrador') {
    throw new Error('Solo se pueden eliminar asientos en estado borrador');
  }
  const sesion = sesionDe(opciones);
  if (historialPorMovimiento('asiento', id).length > 0) {
    if (asiento.status === 'cancelado') return { eliminado: false, anulado: true, asiento };
    const actualizado = { ...asiento, status: 'cancelado', updatedAt: ahora() };
    saveAsientos(asientos.map((item) => item.id === id ? actualizado : item));
    auditarAsiento({
      accion: 'anular',
      antes: asiento,
      despues: actualizado,
      sesion,
      cambios: calcularCambios(asiento, actualizado, ['status']),
      descripcion: `Anuló el asiento contable ${numeroDe(asiento)}`
    });
    return { eliminado: false, anulado: true, asiento: actualizado };
  }
  saveAsientos(asientos.filter((a) => a.id !== id));
  saveLineas(loadLineas().filter((l) => l.asiento_id !== id));
  return { eliminado: true };
}

export { MENSAJE_PERIODO_CERRADO };
