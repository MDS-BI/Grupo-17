import { normalizarImporte, formatearMXN } from './dinero.js';
import { esFechaValida, periodoContieneFecha } from './fechas.js';

export const ESTADOS_ASIENTO = Object.freeze(['borrador', 'aprobado', 'cancelado']);
export const TRANSICIONES_ASIENTO = Object.freeze({
  borrador: ['aprobado', 'cancelado'],
  aprobado: ['cancelado'],
  cancelado: []
});

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function numeroEnteroPositivo(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function importeNoNegativo(valor, etiqueta) {
  if (valor === undefined || valor === null || valor === '') {
    return { valido: true, centavos: 0 };
  }
  const resultado = normalizarImporte(valor);
  if (!resultado.valido) return { valido: false, error: `${etiqueta}: ${resultado.error}` };
  if (resultado.centavos < 0) return { valido: false, error: `${etiqueta} no puede ser negativo` };
  return { valido: true, centavos: resultado.centavos };
}

export function validarLinea(linea = {}, { cuentas = [], indice = 0 } = {}) {
  const errores = {};
  const sufijo = `Línea ${indice + 1}`;
  const cuentaId = texto(linea.cuenta_id);

  if (!cuentaId) {
    errores.cuenta_id = `${sufijo}: selecciona una cuenta`;
  } else {
    const cuenta = cuentas.find((c) => c.id === cuentaId);
    if (!cuenta) errores.cuenta_id = `${sufijo}: la cuenta no existe`;
    else if (!cuenta.isLeaf) errores.cuenta_id = `${sufijo}: solo las cuentas hoja admiten movimientos`;
    else if (cuenta.status !== 'activa') errores.cuenta_id = `${sufijo}: la cuenta está inactiva`;
  }

  const debe = importeNoNegativo(linea.debit, `${sufijo}: el débito`);
  const haber = importeNoNegativo(linea.credit, `${sufijo}: el crédito`);
  if (!debe.valido) errores.debit = debe.error;
  if (!haber.valido) errores.credit = haber.error;

  const debit = debe.valido ? debe.centavos : 0;
  const credit = haber.valido ? haber.centavos : 0;

  if (debe.valido && haber.valido) {
    if (debit === 0 && credit === 0) {
      errores.monto = `${sufijo}: registra un monto mayor que cero en el debe o en el haber`;
    } else if (debit > 0 && credit > 0) {
      errores.monto = `${sufijo}: registra el monto en el debe o en el haber, no en ambos`;
    }
  }

  return { valido: Object.keys(errores).length === 0, errores, debit, credit };
}

export function validarAsiento(payload = {}, {
  periodos = [],
  cuentas = [],
  asientos = [],
  id = null,
  documentoExiste = () => true,
  permitirPeriodoCerrado = false
} = {}) {
  const errores = {};
  const date = texto(payload.date);
  const periodId = texto(payload.period_id);
  const concept = texto(payload.concept);
  const series = texto(payload.series);
  const folio = numeroEnteroPositivo(payload.folio);

  if (!date) errores.date = 'La fecha es obligatoria';
  else if (!esFechaValida(date)) errores.date = 'La fecha debe ser una fecha válida (YYYY-MM-DD)';

  if (!periodId) {
    errores.period_id = 'El periodo contable es obligatorio';
  } else {
    const periodo = periodos.find((p) => p.id === periodId);
    if (!periodo) {
      errores.period_id = 'El periodo contable seleccionado no existe';
    } else if (!errores.date && !periodoContieneFecha(periodo, date)) {
      errores.date = 'La fecha debe estar dentro del periodo seleccionado';
    } else if (periodo.status === 'cerrado' && !permitirPeriodoCerrado) {
      errores.period_id = 'No se pueden registrar asientos en un periodo cerrado';
    }
  }

  if (!concept) errores.concept = 'El concepto es obligatorio';

  if (payload.folio === undefined || payload.folio === null || payload.folio === '') {
    errores.folio = 'El folio es obligatorio';
  } else if (!folio) {
    errores.folio = 'El folio debe ser un entero positivo';
  } else if (asientos.some((a) => a.id !== id && texto(a.series) === series && Number(a.folio) === folio)) {
    errores.folio = 'Ya existe un asiento con esa serie y folio';
  }

  if (payload.status !== undefined && texto(payload.status) && !ESTADOS_ASIENTO.includes(texto(payload.status))) {
    errores.status = `El estado debe ser uno de: ${ESTADOS_ASIENTO.join(', ')}`;
  }

  if (payload.sourceDocumentId && !documentoExiste(texto(payload.sourceDocumentId))) {
    errores.sourceDocumentId = 'El documento de origen no existe';
  }

  const lineas = Array.isArray(payload.lines) ? payload.lines : [];
  if (lineas.length < 2) {
    errores.lineas = 'El asiento debe tener al menos dos líneas contables';
  }

  let totalDebit = 0;
  let totalCredit = 0;
  const lineaErrores = [];
  lineas.forEach((linea, indice) => {
    const resultado = validarLinea(linea, { cuentas, indice });
    if (!resultado.valido) lineaErrores.push(resultado.errores);
    totalDebit += resultado.debit;
    totalCredit += resultado.credit;
  });
  if (lineaErrores.length > 0) {
    errores.lineasDetalle = lineaErrores;
    if (!errores.lineas) errores.lineas = Object.values(lineaErrores[0])[0];
  }

  if (lineaErrores.length === 0 && lineas.length >= 2 && totalDebit !== totalCredit) {
    errores.balance = `El asiento debe estar cuadrado: débitos ${formatearMXN(totalDebit)} y créditos ${formatearMXN(totalCredit)}`;
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
    totalDebit,
    totalCredit
  };
}

export function validarTransicionAsiento(actual, siguiente) {
  if (!ESTADOS_ASIENTO.includes(siguiente)) {
    return { valido: false, error: `El estado debe ser uno de: ${ESTADOS_ASIENTO.join(', ')}` };
  }
  if (actual === siguiente) return { valido: true };
  const permitidos = TRANSICIONES_ASIENTO[actual] || [];
  if (!permitidos.includes(siguiente)) {
    return { valido: false, error: `Transición de estado inválida de "${actual}" a "${siguiente}"` };
  }
  return { valido: true };
}
