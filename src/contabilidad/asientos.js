import { loadAsientos, saveAsientos, loadLineas, saveLineas, loadCuentas, loadPeriodos } from './almacenamiento.js';
import { loadDocuments } from '../storage.js';
import { validarAsiento, validarTransicionAsiento } from './validaciones-asientos.js';
import { normalizarImporte, desdeCentavos } from './dinero.js';

function generarId(prefijo) {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ahora() {
  return new Date().toISOString();
}

function ordenarAsientos(asientos) {
  return [...asientos].sort((a, b) => {
    const porFecha = String(a.date).localeCompare(String(b.date));
    if (porFecha !== 0) return porFecha;
    return String(a.series).localeCompare(String(b.series)) || Number(a.folio) - Number(b.folio);
  });
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
  const serie = String(series || '').trim();
  const folios = loadAsientos()
    .filter((a) => String(a.series || '').trim() === serie)
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

export function crearAsiento(payload = {}) {
  const periodos = loadPeriodos();
  const cuentas = loadCuentas();
  const asientos = loadAsientos();
  const series = String(payload.series || '').trim();
  const folio = payload.folio === undefined || payload.folio === null || payload.folio === ''
    ? siguienteFolio(series)
    : Number(payload.folio);
  const lineas = normalizarLineas(payload.lines);
  const datos = {
    ...payload,
    series,
    folio,
    currency: 'MXN',
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
    currency: 'MXN',
    status: payload.status || 'borrador',
    notes: String(payload.notes || '').trim(),
    createdAt: marca,
    updatedAt: marca
  };
  saveAsientos([...asientos, asiento]);
  saveLineas([...loadLineas(), ...construirLineas(asiento.id, lineas, asiento.concept, marca)]);
  return asiento;
}

export function actualizarAsiento(id, cambios = {}) {
  const asientos = loadAsientos();
  const indice = asientos.findIndex((a) => a.id === id);
  if (indice === -1) throw new Error('Asiento contable no encontrado');
  const actual = asientos[indice];
  if (actual.status !== 'borrador') {
    throw new Error('Solo se pueden editar asientos en estado borrador');
  }
  const fusionado = { ...actual, ...cambios };
  const lineasGuardadas = lineasDeAsiento(id).map((linea) => ({
    ...linea,
    debit: desdeCentavos(linea.debit),
    credit: desdeCentavos(linea.credit)
  }));
  const lineas = normalizarLineas(cambios.lines !== undefined ? cambios.lines : lineasGuardadas);
  const datos = {
    ...fusionado,
    series: String(fusionado.series || '').trim(),
    folio: fusionado.folio,
    status: actual.status,
    currency: 'MXN',
    lines: lineas
  };
  const revision = validarAsiento(datos, {
    periodos: loadPeriodos(),
    cuentas: loadCuentas(),
    asientos,
    id,
    documentoExiste
  });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);

  const marca = ahora();
  const actualizado = {
    ...actual,
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
  const lista = [...asientos];
  lista[indice] = actualizado;
  saveAsientos(lista);
  saveLineas([
    ...loadLineas().filter((l) => l.asiento_id !== id),
    ...construirLineas(id, lineas, actualizado.concept, marca)
  ]);
  return actualizado;
}

export function cambiarEstadoAsiento(id, estado) {
  const asientos = loadAsientos();
  const indice = asientos.findIndex((a) => a.id === id);
  if (indice === -1) throw new Error('Asiento contable no encontrado');
  const actual = asientos[indice];
  const revision = validarTransicionAsiento(actual.status, estado);
  if (!revision.valido) throw new Error(revision.error);
  if (estado === 'aprobado') {
    const periodo = loadPeriodos().find((p) => p.id === actual.period_id);
    if (!periodo || periodo.status === 'cerrado') {
      throw new Error('No se puede aprobar un asiento en un periodo cerrado');
    }
    if (actual.totalDebit !== actual.totalCredit) {
      throw new Error('No se puede aprobar un asiento desbalanceado');
    }
  }
  const actualizado = { ...actual, status: estado, updatedAt: ahora() };
  const lista = [...asientos];
  lista[indice] = actualizado;
  saveAsientos(lista);
  return actualizado;
}

export function aprobarAsiento(id) {
  return cambiarEstadoAsiento(id, 'aprobado');
}

export function cancelarAsiento(id) {
  return cambiarEstadoAsiento(id, 'cancelado');
}

export function eliminarAsiento(id) {
  const asientos = loadAsientos();
  const asiento = asientos.find((a) => a.id === id);
  if (!asiento) throw new Error('Asiento contable no encontrado');
  if (asiento.status !== 'borrador') {
    throw new Error('Solo se pueden eliminar asientos en estado borrador');
  }
  saveAsientos(asientos.filter((a) => a.id !== id));
  saveLineas(loadLineas().filter((l) => l.asiento_id !== id));
  return { eliminado: true };
}
