import { esFechaValida, compararFechas, haySolapamiento, periodoContieneFecha } from './fechas.js';
import { sumarCentavos } from './dinero.js';

export const ESTADOS_PERIODO = Object.freeze(['abierto', 'cerrado']);
export const MENSAJE_PERIODO_CERRADO = 'El periodo está cerrado y no permite registrar ni modificar movimientos.';

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

export function validarPeriodo(payload = {}, { periodos = [], id = null } = {}) {
  const errores = {};
  const name = texto(payload.name);
  const startDate = texto(payload.startDate);
  const endDate = texto(payload.endDate);
  const status = texto(payload.status) || 'abierto';

  if (!name) errores.name = 'El nombre del periodo es obligatorio';
  else if (periodos.some((p) => p.id !== id && texto(p.name).toLowerCase() === name.toLowerCase())) {
    errores.name = 'Ya existe un periodo con ese nombre';
  }

  if (!startDate) errores.startDate = 'La fecha de inicio es obligatoria';
  else if (!esFechaValida(startDate)) errores.startDate = 'La fecha de inicio debe ser una fecha válida (YYYY-MM-DD)';

  if (!endDate) errores.endDate = 'La fecha de término es obligatoria';
  else if (!esFechaValida(endDate)) errores.endDate = 'La fecha de término debe ser una fecha válida (YYYY-MM-DD)';

  if (!errores.startDate && !errores.endDate && compararFechas(endDate, startDate) <= 0) {
    errores.endDate = 'La fecha de término debe ser posterior a la fecha de inicio';
  }

  if (!ESTADOS_PERIODO.includes(status)) {
    errores.status = `El estado debe ser uno de: ${ESTADOS_PERIODO.join(', ')}`;
  }

  if (!errores.startDate && !errores.endDate) {
    const candidato = { id, name, startDate, endDate, status };
    const solapado = periodos.find((p) => p.id !== id && haySolapamiento(candidato, p));
    if (solapado) {
      errores.startDate = `El periodo se superpone con "${solapado.name}"`;
    }
  }

  return { valido: Object.keys(errores).length === 0, errores };
}

function fechaDe(valor) {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor.toISOString().slice(0, 10);
  return texto(valor).slice(0, 10);
}

export function periodoPorFecha(fecha, periodos = []) {
  const dia = fechaDe(fecha);
  if (!dia) return null;
  return periodos.find((periodo) => periodoContieneFecha(periodo, dia)) || null;
}

export function esPeriodoAbiertoPorFecha(fecha, periodos = []) {
  const periodo = periodoPorFecha(fecha, periodos);
  return Boolean(periodo && periodo.status === 'abierto');
}

export function validarEscrituraPeriodo(fechaOriginal, fechaNueva, periodos = []) {
  const fechas = [fechaOriginal, fechaNueva].map(fechaDe).filter(Boolean);
  for (const fecha of fechas) {
    if (!esPeriodoAbiertoPorFecha(fecha, periodos)) {
      return { valido: false, error: MENSAJE_PERIODO_CERRADO };
    }
  }
  return { valido: true, error: null };
}

export function asegurarEscrituraPeriodo(fechaOriginal, fechaNueva, periodos = []) {
  const revision = validarEscrituraPeriodo(fechaOriginal, fechaNueva, periodos);
  if (!revision.valido) throw new Error(revision.error);
  return true;
}

export function validarCierrePeriodo(periodoId, {
  periodos = [],
  asientos = [],
  lineas = [],
  pagos = []
} = {}) {
  const errores = {};
  const periodo = periodos.find((item) => item.id === periodoId);
  if (!periodo) {
    return { valido: false, errores: { periodo: 'Periodo contable no encontrado' }, resumen: null };
  }
  if (periodo.status === 'cerrado') {
    errores.periodo = 'El periodo ya está cerrado';
  }
  if (periodos.some((item) => item.id !== periodo.id && haySolapamiento(periodo, item))) {
    errores.solapamiento = 'El periodo se superpone con otro periodo contable';
  }
  const asientosPeriodo = asientos.filter((item) => item.period_id === periodo.id);
  let asientosAprobados = 0;
  for (const asiento of asientosPeriodo) {
    if (!esFechaValida(texto(asiento.date)) || !periodoContieneFecha(periodo, fechaDe(asiento.date))) {
      errores.asientos = `El asiento ${asiento.id} tiene una fecha fuera del periodo`;
      break;
    }
    const propias = lineas.filter((linea) => linea.asiento_id === asiento.id);
    const debe = sumarCentavos(propias.map((linea) => linea.debit));
    const haber = sumarCentavos(propias.map((linea) => linea.credit));
    if (asiento.status === 'aprobado') asientosAprobados += 1;
    if (asiento.status === 'aprobado' && (debe !== haber || debe === 0)) {
      errores.asientos = `El asiento ${asiento.id} no está cuadrado`;
      break;
    }
    if (Number(asiento.totalDebit) !== debe || Number(asiento.totalCredit) !== haber) {
      errores.asientos = `Los totales del asiento ${asiento.id} no coinciden con sus líneas`;
      break;
    }
  }
  const pagosPeriodo = pagos.filter((item) => periodoContieneFecha(periodo, fechaDe(item.date)));
  for (const pago of pagosPeriodo) {
    if (!esFechaValida(texto(pago.date)) || !esFechaValida(texto(pago.fechaVencimiento))) {
      errores.pagos = `El pago ${pago.id} tiene fechas inválidas`;
      break;
    }
    if (!Number.isInteger(Number(pago.amount)) || Number(pago.amount) <= 0) {
      errores.pagos = `El pago ${pago.id} tiene un monto inválido`;
      break;
    }
    if (!['pendiente', 'pagado', 'cancelado'].includes(texto(pago.status))) {
      errores.pagos = `El pago ${pago.id} tiene un estado inválido`;
      break;
    }
    if (pago.anulado && !texto(pago.anuladoEn)) {
      errores.pagos = `El pago ${pago.id} está anulado sin fecha de anulación`;
      break;
    }
    if (texto(pago.asiento_id) && !asientos.some((item) => item.id === pago.asiento_id)) {
      errores.pagos = `El pago ${pago.id} referencia un asiento inexistente`;
      break;
    }
  }
  return {
    valido: Object.keys(errores).length === 0,
    errores,
    resumen: {
      periodoId: periodo.id,
      asientos: asientosPeriodo.length,
      asientosAprobados,
      pagos: pagosPeriodo.length
    }
  };
}
