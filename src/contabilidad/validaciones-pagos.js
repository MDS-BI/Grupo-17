import { normalizarImporte } from './dinero.js';
import { esFechaValida } from './fechas.js';

export const TIPOS_PAGO = Object.freeze(['cobro', 'pago']);
export const METODOS_PAGO = Object.freeze(['efectivo', 'transferencia', 'cheque', 'tarjeta']);
export const ESTADOS_PAGO = Object.freeze(['pendiente', 'pagado', 'cancelado']);
export const ESTADOS_PAGO_LEGADOS = Object.freeze({ aplicado: 'pagado' });

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function folioPositivo(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

export function validarPago(payload = {}, {
  pagos = [],
  entidades = [],
  documentos = [],
  asientos = [],
  id = null
} = {}) {
  const errores = {};
  const date = texto(payload.date);
  const tipo = texto(payload.tipo);
  const entityId = texto(payload.entity_id);
  const documentId = texto(payload.document_id);
  const asientoId = texto(payload.asiento_id);
  const method = texto(payload.method);
  const estadoEntrada = texto(payload.status) || 'pendiente';
  const status = ESTADOS_PAGO_LEGADOS[estadoEntrada] || estadoEntrada;
  const vencimiento = texto(payload.fechaVencimiento);
  const series = texto(payload.series);
  const folio = payload.folio === undefined || payload.folio === null || payload.folio === ''
    ? null
    : folioPositivo(payload.folio);

  if (!date) errores.date = 'La fecha es obligatoria';
  else if (!esFechaValida(date)) errores.date = 'La fecha debe ser una fecha válida (YYYY-MM-DD)';

  if (!vencimiento) errores.fechaVencimiento = 'La fecha de vencimiento es obligatoria';
  else if (!esFechaValida(vencimiento)) errores.fechaVencimiento = 'La fecha de vencimiento debe ser válida (YYYY-MM-DD)';

  if (!TIPOS_PAGO.includes(tipo)) {
    errores.tipo = `El tipo de operación debe ser uno de: ${TIPOS_PAGO.join(', ')}`;
  }

  const importe = normalizarImporte(payload.amount);
  if (payload.amount === undefined || payload.amount === null || payload.amount === '') {
    errores.amount = 'El monto es obligatorio';
  } else if (!importe.valido) {
    errores.amount = importe.error;
  } else if (importe.centavos <= 0) {
    errores.amount = 'El monto debe ser mayor que cero';
  }

  if (!entityId) errores.entity_id = 'La entidad es obligatoria';
  else if (!entidades.some((e) => e.entity_id === entityId)) {
    errores.entity_id = 'La entidad seleccionada no existe';
  }

  if (documentId && !documentos.some((d) => d.id === documentId)) {
    errores.document_id = 'El documento seleccionado no existe';
  }

  if (asientoId) {
    if (!asientos.some((a) => a.id === asientoId)) {
      errores.asiento_id = 'El asiento seleccionado no existe';
    } else if (pagos.some((p) => p.id !== id && texto(p.asiento_id) === asientoId)) {
      errores.asiento_id = 'El asiento ya está vinculado a otro pago';
    }
  }

  if (method && !METODOS_PAGO.includes(method)) {
    errores.method = `El método debe ser uno de: ${METODOS_PAGO.join(', ')}`;
  }

  if (!ESTADOS_PAGO.includes(status)) {
    errores.status = `El estado debe ser uno de: ${ESTADOS_PAGO.join(', ')}`;
  }

  if (payload.folio !== undefined && payload.folio !== null && payload.folio !== '' && !folio) {
    errores.folio = 'El folio debe ser un entero positivo';
  }

  const numero = texto(payload.numero) || (folio ? `${series || (tipo === 'cobro' ? 'COB' : 'PAG')}-${folio}` : '');
  if (!numero) {
    errores.numero = 'El número del pago es obligatorio';
  } else if (pagos.some((p) => p.id !== id && texto(p.numero) === numero)) {
    errores.numero = 'Ya existe un pago con ese número';
  }

  if (folio && pagos.some((p) => p.id !== id && texto(p.series) === series && Number(p.folio) === folio)) {
    errores.folio = 'Ya existe un pago con esa serie y folio';
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
    centavos: importe.valido ? importe.centavos : 0,
    numero,
    status
  };
}
