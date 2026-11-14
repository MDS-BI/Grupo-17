import { loadPagos, savePagos, loadAsientos, loadPeriodos, loadCuentas } from './almacenamiento.js';
import { loadEntities, loadDocuments } from '../storage.js';
import { validarPago } from './validaciones-pagos.js';
import { desdeCentavos } from './dinero.js';

function generarId() {
  return `pag-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ahora() {
  return new Date().toISOString();
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

export function listarPagos() {
  return [...loadPagos()].sort((a, b) => {
    const porFecha = String(b.date).localeCompare(String(a.date));
    if (porFecha !== 0) return porFecha;
    return String(a.numero).localeCompare(String(b.numero));
  });
}

export function obtenerPago(id) {
  return loadPagos().find((p) => p.id === id) || null;
}

export function siguienteFolio(series = '') {
  const serie = texto(series);
  const folios = loadPagos()
    .filter((p) => texto(p.series) === serie)
    .map((p) => Number(p.folio))
    .filter(Number.isInteger);
  return folios.length === 0 ? 1001 : Math.max(...folios) + 1;
}

function dependencias() {
  return {
    entidades: loadEntities(),
    documentos: loadDocuments(),
    asientos: loadAsientos()
  };
}

export function crearPago(payload = {}) {
  const tipo = texto(payload.tipo) || 'pago';
  const series = texto(payload.series) || (tipo === 'cobro' ? 'COB' : 'PAG');
  const folio = payload.folio === undefined || payload.folio === null || payload.folio === ''
    ? siguienteFolio(series)
    : Number(payload.folio);
  const numero = texto(payload.numero) || `${series}-${folio}`;
  const pagos = loadPagos();
  const { entidades, documentos, asientos } = dependencias();
  const datos = {
    ...payload,
    tipo,
    series,
    folio,
    numero,
    currency: 'MXN',
    status: payload.status || 'pendiente'
  };
  const revision = validarPago(datos, { pagos, entidades, documentos, asientos });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const marca = ahora();
  const pago = {
    id: generarId(),
    numero: revision.numero,
    series,
    folio,
    tipo,
    date: payload.date,
    entity_id: texto(payload.entity_id),
    document_id: texto(payload.document_id) || null,
    asiento_id: texto(payload.asiento_id) || null,
    amount: revision.centavos,
    currency: 'MXN',
    method: texto(payload.method) || null,
    status: payload.status || 'pendiente',
    notes: texto(payload.notes),
    createdAt: marca,
    updatedAt: marca
  };
  savePagos([...pagos, pago]);
  return pago;
}

export function actualizarPago(id, cambios = {}) {
  const pagos = loadPagos();
  const indice = pagos.findIndex((p) => p.id === id);
  if (indice === -1) throw new Error('Pago no encontrado');
  const actual = pagos[indice];
  const fusionado = { ...actual, ...cambios };
  const series = texto(fusionado.series);
  const folio = Number(fusionado.folio);
  const numero = texto(fusionado.numero) || `${series}-${folio}`;
  const { entidades, documentos, asientos } = dependencias();
  const monto = cambios.amount !== undefined
    ? cambios.amount
    : (actual.amount === undefined ? '' : desdeCentavos(actual.amount));
  const datos = { ...fusionado, series, folio, numero, amount: monto, currency: 'MXN' };
  const revision = validarPago(datos, { pagos, entidades, documentos, asientos, id });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const actualizado = {
    ...actual,
    numero: revision.numero,
    series,
    folio,
    tipo: texto(fusionado.tipo) || actual.tipo,
    date: fusionado.date,
    entity_id: texto(fusionado.entity_id),
    document_id: texto(fusionado.document_id) || null,
    asiento_id: texto(fusionado.asiento_id) || null,
    amount: revision.centavos,
    currency: 'MXN',
    method: texto(fusionado.method) || null,
    status: fusionado.status || actual.status,
    notes: texto(fusionado.notes),
    updatedAt: ahora()
  };
  const lista = [...pagos];
  lista[indice] = actualizado;
  savePagos(lista);
  return actualizado;
}

export function cancelarPago(id) {
  return actualizarPago(id, { status: 'cancelado' });
}

export function eliminarPago(id) {
  const pagos = loadPagos();
  const pago = pagos.find((p) => p.id === id);
  if (!pago) throw new Error('Pago no encontrado');
  if (pago.status !== 'pendiente') {
    throw new Error('Solo se pueden eliminar pagos pendientes; los demás se anulan lógicamente');
  }
  savePagos(pagos.filter((p) => p.id !== id));
  return { eliminado: true };
}
