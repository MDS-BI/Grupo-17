import { loadPagos, savePagos, loadAsientos, loadPeriodos, loadCuentas, loadSesion } from './almacenamiento.js';
import { loadEntities, loadDocuments } from '../storage.js';
import { validarPago } from './validaciones-pagos.js';
import { desdeCentavos, sumarCentavos } from './dinero.js';
import { fechaHoyISO } from './fechas.js';
import { registrarEvento, calcularCambios, historialPorMovimiento } from './auditoria.js';
import { asegurarEscrituraPeriodo, MENSAJE_PERIODO_CERRADO } from './validaciones-periodos.js';

export const ESTADOS_PAGO_DERIVADOS = Object.freeze(['anulado', 'pagado', 'vencido', 'pendiente']);

function generarId() {
  return `pag-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ahora() {
  return new Date().toISOString();
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function serieDe(series, tipo) {
  return texto(series) || (tipo === 'cobro' ? 'COB' : 'PAG');
}

function fechaDe(valor) {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor.toISOString().slice(0, 10);
  return texto(valor).slice(0, 10);
}

function sesionDe(opciones = {}) {
  if (opciones.sesion !== undefined) return opciones.sesion;
  const actual = loadSesion();
  return actual && (!actual.estado || actual.estado === 'autenticada') ? actual : null;
}

function esAnulado(pago) {
  return Boolean(pago && (pago.anulado || texto(pago.status) === 'cancelado'));
}

function estadoBase(pago) {
  if (esAnulado(pago)) return 'anulado';
  const estado = texto(pago && pago.status);
  if (estado === 'pagado' || estado === 'aplicado') return 'pagado';
  return 'pendiente';
}

export function calcularEstadoPago(pago, fechaActual = fechaHoyISO()) {
  const base = estadoBase(pago);
  if (base !== 'pendiente') return base;
  const vencimiento = fechaDe(pago && pago.fechaVencimiento) || fechaDe(pago && pago.date);
  const hoy = fechaDe(fechaActual);
  return vencimiento && vencimiento < hoy ? 'vencido' : 'pendiente';
}

export function esPagoVigente(pago, fechaActual = fechaHoyISO()) {
  return calcularEstadoPago(pago, fechaActual) !== 'anulado';
}

export function resumirEstadosPago(pagos = [], fechaActual = fechaHoyISO()) {
  const resumen = {};
  const importes = {};
  for (const estado of ESTADOS_PAGO_DERIVADOS) {
    resumen[estado] = { cantidad: 0, totalCentavos: 0 };
    importes[estado] = [];
  }
  for (const pago of pagos) {
    const estado = calcularEstadoPago(pago, fechaActual);
    resumen[estado].cantidad += 1;
    importes[estado].push(pago.amount);
  }
  for (const estado of ESTADOS_PAGO_DERIVADOS) {
    resumen[estado].totalCentavos = sumarCentavos(importes[estado]);
  }
  return resumen;
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

export function siguienteFolio(series = '', tipo = 'pago') {
  const serie = serieDe(series, tipo);
  const folios = loadPagos()
    .filter((p) => serieDe(p.series, p.tipo) === serie)
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

function banderaAnulacion(pago, marca = ahora()) {
  const anulado = esAnulado(pago);
  return {
    anulado,
    anuladoEn: anulado ? texto(pago.anuladoEn) || marca : undefined
  };
}

function auditarPago({ accion, antes, despues, sesion, cambios = [], descripcion }) {
  const movimiento = despues || antes || {};
  registrarEvento({
    accion,
    modulo: 'pagos',
    tipoMovimiento: 'pago',
    entidad: 'pago',
    entidadId: movimiento.id,
    numero: movimiento.numero,
    sesion,
    cambios,
    descripcion
  });
}

function cambiosDePago(antes, despues) {
  const cambios = calcularCambios(antes, despues, [
    'date', 'fechaVencimiento', 'entity_id', 'asiento_id',
    'amount', 'status', 'anulado', 'anuladoEn', 'method', 'notes'
  ]);
  if (cambios.some((cambio) => cambio.campo === 'status' || cambio.campo === 'anulado')) {
    return [
      {
        campo: 'estado',
        valorAnterior: calcularEstadoPago(antes),
        valorNuevo: calcularEstadoPago(despues)
      },
      ...cambios.filter((cambio) => cambio.campo !== 'status' && cambio.campo !== 'anulado')
    ];
  }
  return cambios;
}

export function crearPago(payload = {}, opciones = {}) {
  const tipo = texto(payload.tipo) || 'pago';
  const series = serieDe(payload.series, tipo);
  const folio = payload.folio === undefined || payload.folio === null || payload.folio === ''
    ? siguienteFolio(series, tipo)
    : Number(payload.folio);
  const numero = texto(payload.numero) || `${series}-${folio}`;
  const pagos = loadPagos();
  asegurarEscrituraPeriodo(null, payload.date, loadPeriodos());
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
  const anulacion = banderaAnulacion({ ...datos, status: revision.status }, marca);
  const pago = {
    id: generarId(),
    numero: revision.numero,
    series,
    folio,
    tipo,
    date: payload.date,
    fechaVencimiento: texto(payload.fechaVencimiento),
    entity_id: texto(payload.entity_id),
    asiento_id: texto(payload.asiento_id) || null,
    amount: revision.centavos,
    currency: 'MXN',
    method: texto(payload.method) || null,
    status: revision.status,
    ...anulacion,
    notes: texto(payload.notes),
    createdAt: marca,
    updatedAt: marca
  };
  savePagos([...pagos, pago]);
  auditarPago({
    accion: 'crear',
    despues: pago,
    sesion: sesionDe(opciones),
    descripcion: `Creó el ${pago.tipo} ${pago.numero}`
  });
  return pago;
}

export function actualizarPago(id, cambios = {}, opciones = {}) {
  const pagos = loadPagos();
  const indice = pagos.findIndex((p) => p.id === id);
  if (indice === -1) throw new Error('Pago no encontrado');
  const actual = pagos[indice];
  const fusionado = { ...actual, ...cambios };
  asegurarEscrituraPeriodo(actual.date, fusionado.date, loadPeriodos());
  if (esAnulado(actual) && !cambios.anular) {
    throw new Error('Los pagos anulados solo pueden consultarse');
  }
  if (estadoBase(actual) === 'pagado' && !cambios.anular && texto(cambios.status) !== 'cancelado') {
    throw new Error('Los pagos pagados solo pueden consultarse');
  }
  const series = serieDe(fusionado.series, fusionado.tipo || actual.tipo);
  const folio = Number(fusionado.folio);
  const numero = texto(fusionado.numero) || `${series}-${folio}`;
  const { entidades, documentos, asientos } = dependencias();
  const monto = cambios.amount !== undefined
    ? cambios.amount
    : (actual.amount === undefined ? '' : desdeCentavos(actual.amount));
  const datos = { ...fusionado, series, folio, numero, amount: monto, currency: 'MXN' };
  const revision = validarPago(datos, { pagos, entidades, documentos, asientos, id });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const marca = ahora();
  const actualizado = {
    ...actual,
    numero: revision.numero,
    series,
    folio,
    tipo: texto(fusionado.tipo) || actual.tipo,
    date: fusionado.date,
    fechaVencimiento: texto(fusionado.fechaVencimiento),
    entity_id: texto(fusionado.entity_id),
    asiento_id: texto(fusionado.asiento_id) || null,
    amount: revision.centavos,
    currency: 'MXN',
    method: texto(fusionado.method) || null,
    status: revision.status,
    ...banderaAnulacion({ ...fusionado, status: revision.status }, marca),
    notes: texto(fusionado.notes),
    updatedAt: marca
  };
  const cambiosDetectados = cambiosDePago(actual, actualizado);
  const lista = [...pagos];
  lista[indice] = actualizado;
  savePagos(lista);
  if (cambiosDetectados.length > 0) {
    auditarPago({
      accion: opciones.accionAuditoria || (esAnulado(actualizado) ? 'anular' : 'editar'),
      antes: actual,
      despues: actualizado,
      sesion: sesionDe(opciones),
      cambios: cambiosDetectados,
      descripcion: opciones.descripcionAuditoria
        || `Editó el ${actualizado.tipo} ${actualizado.numero}`
    });
  }
  return actualizado;
}

export function cancelarPago(id, opciones = {}) {
  const actual = obtenerPago(id);
  if (!actual) throw new Error('Pago no encontrado');
  if (esAnulado(actual)) return actual;
  return actualizarPago(id, { status: 'cancelado' }, {
    ...opciones,
    accionAuditoria: 'anular',
    descripcionAuditoria: `Anuló el ${actual.tipo} ${actual.numero}`
  });
}

export function marcarPagado(id, opciones = {}) {
  const actual = obtenerPago(id);
  if (!actual) throw new Error('Pago no encontrado');
  if (esAnulado(actual)) throw new Error('Los pagos anulados solo pueden consultarse');
  if (estadoBase(actual) === 'pagado') throw new Error('Los pagos pagados solo pueden consultarse');
  return actualizarPago(id, { status: 'pagado' }, {
    ...opciones,
    accionAuditoria: 'editar',
    descripcionAuditoria: `Marcó como pagado el ${actual.tipo} ${actual.numero}`
  });
}

export function normalizarEstadosHeredados() {
  const pagos = loadPagos();
  const normalizados = pagos.map((pago) => {
    const status = pago.status === 'aplicado' ? 'pagado' : texto(pago.status);
    const anulacion = banderaAnulacion({ ...pago, status });
    return {
      ...pago,
      status,
      ...anulacion,
      updatedAt: pago.status === status && pago.anulado === anulacion.anulado
        ? pago.updatedAt
        : ahora()
    };
  });
  if (pagos.some((pago, indice) => pago.status !== normalizados[indice].status
    || Boolean(pago.anulado) !== normalizados[indice].anulado)) {
    savePagos(normalizados);
    return true;
  }
  return false;
}

export function eliminarPago(id, opciones = {}) {
  const pagos = loadPagos();
  const pago = pagos.find((p) => p.id === id);
  if (!pago) throw new Error('Pago no encontrado');
  asegurarEscrituraPeriodo(pago.date, pago.date, loadPeriodos());
  if (esAnulado(pago)) throw new Error('Los pagos anulados solo pueden consultarse');
  if (estadoBase(pago) === 'pagado') throw new Error('Los pagos pagados solo pueden consultarse');
  if (texto(pago.status) !== 'pendiente') {
    throw new Error('Solo se pueden eliminar pagos pendientes; los demás se anulan lógicamente');
  }
  if (historialPorMovimiento('pago', id).length > 0) {
    const anulado = cancelarPago(id, opciones);
    return { eliminado: false, anulado: true, pago: anulado };
  }
  savePagos(pagos.filter((p) => p.id !== id));
  return { eliminado: true };
}

export { MENSAJE_PERIODO_CERRADO };
