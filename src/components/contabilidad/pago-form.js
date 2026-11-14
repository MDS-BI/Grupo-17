import { desdeCentavos } from '../../contabilidad/dinero.js';
import { poblarSelect, limpiarErrores, mostrarError } from './comun.js';

function qs(id) {
  return document.getElementById(id);
}

const ERRORES = [
  'error-pago-date',
  'error-pago-amount',
  'error-pago-tipo',
  'error-pago-method',
  'error-pago-entity',
  'error-pago-document',
  'error-pago-asiento',
  'error-pago-series',
  'error-pago-folio',
  'error-pago-status'
];

export function poblarEntidadesPago(entidades = [], valor = '') {
  poblarSelect(qs('pago-entity'), entidades.map((e) => ({
    value: e.entity_id,
    label: `${e.name} — ${e.code}`
  })), { placeholder: '-- Selecciona una entidad --', valor });
}

export function poblarDocumentosPago(documentos = [], valor = '') {
  poblarSelect(qs('pago-document'), documentos.map((d) => ({
    value: d.id,
    label: `${d.series || 'DOC'}-${d.folio}`
  })), { placeholder: '-- Sin documento --', valor });
}

export function poblarAsientosPago(asientos = [], valor = '') {
  poblarSelect(qs('pago-asiento'), asientos.map((a) => ({
    value: a.id,
    label: `${a.series || ''}-${a.folio} · ${a.concept}`
  })), { placeholder: '-- Sin asiento --', valor });
}

export function clearPagoForm({ entidades = [], documentos = [], asientos = [] } = {}) {
  qs('pago-id').value = '';
  qs('pago-date').value = '';
  qs('pago-amount').value = '';
  qs('pago-tipo').value = 'pago';
  qs('pago-method').value = '';
  qs('pago-series').value = '';
  qs('pago-folio').value = '';
  qs('pago-status').value = 'pendiente';
  qs('pago-notes').value = '';
  poblarEntidadesPago(entidades);
  poblarDocumentosPago(documentos);
  poblarAsientosPago(asientos);
  limpiarErrores(ERRORES);
  qs('pago-cancel-edit').hidden = true;
  qs('pago-submit').textContent = 'Guardar pago';
}

export function startPagoEdit(pago, { entidades = [], documentos = [], asientos = [] } = {}) {
  qs('pago-id').value = pago.id;
  qs('pago-date').value = pago.date || '';
  qs('pago-amount').value = pago.amount === undefined ? '' : desdeCentavos(pago.amount);
  qs('pago-tipo').value = pago.tipo || 'pago';
  qs('pago-method').value = pago.method || '';
  qs('pago-series').value = pago.series || '';
  qs('pago-folio').value = pago.folio === undefined ? '' : pago.folio;
  qs('pago-status').value = pago.status || 'pendiente';
  qs('pago-notes').value = pago.notes || '';
  poblarEntidadesPago(entidades, pago.entity_id || '');
  poblarDocumentosPago(documentos, pago.document_id || '');
  poblarAsientosPago(asientos, pago.asiento_id || '');
  limpiarErrores(ERRORES);
  qs('pago-cancel-edit').hidden = false;
  qs('pago-submit').textContent = 'Actualizar pago';
}

export function collectPagoPayload() {
  return {
    date: qs('pago-date').value,
    amount: qs('pago-amount').value,
    tipo: qs('pago-tipo').value,
    method: qs('pago-method').value,
    entity_id: qs('pago-entity').value,
    document_id: qs('pago-document').value || null,
    asiento_id: qs('pago-asiento').value || null,
    series: qs('pago-series').value,
    folio: qs('pago-folio').value,
    status: qs('pago-status').value,
    notes: qs('pago-notes').value
  };
}

export function showPagoErrors(errores = {}) {
  mostrarError('error-pago-date', errores.date);
  mostrarError('error-pago-amount', errores.amount);
  mostrarError('error-pago-tipo', errores.tipo);
  mostrarError('error-pago-method', errores.method);
  mostrarError('error-pago-entity', errores.entity_id);
  mostrarError('error-pago-document', errores.document_id);
  mostrarError('error-pago-asiento', errores.asiento_id);
  mostrarError('error-pago-series', errores.series || errores.numero);
  mostrarError('error-pago-folio', errores.folio);
  mostrarError('error-pago-status', errores.status);
}
