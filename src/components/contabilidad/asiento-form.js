import { listarCuentas } from '../../contabilidad/cuentas.js';
import { normalizarImporte, desdeCentavos, formatearMXN } from '../../contabilidad/dinero.js';
import { poblarSelect, limpiarErrores, mostrarError } from './comun.js';

function qs(id) {
  return document.getElementById(id);
}

const ERRORES_CABECERA = [
  'error-asiento-series',
  'error-asiento-folio',
  'error-asiento-date',
  'error-asiento-concept',
  'error-asiento-periodo',
  'error-asiento-lineas'
];

function cuentasDisponibles(valorActual) {
  const cuentas = listarCuentas().filter((c) => c.isLeaf && c.status === 'activa');
  if (valorActual && !cuentas.some((c) => c.id === valorActual)) {
    const extra = listarCuentas().find((c) => c.id === valorActual);
    if (extra) cuentas.push(extra);
  }
  return cuentas;
}

function crearFilaLinea(valores = {}) {
  const fila = document.createElement('div');
  fila.className = 'linea-asiento';
  fila.dataset.linea = '';

  const cuentaWrap = document.createElement('div');
  const cuentaLabel = document.createElement('label');
  cuentaLabel.textContent = 'Cuenta *';
  const select = document.createElement('select');
  select.dataset.campo = 'cuenta';
  poblarSelect(select, cuentasDisponibles(valores.cuenta_id).map((c) => ({
    value: c.id,
    label: `${c.code} · ${c.name}`
  })), { placeholder: '-- Selecciona una cuenta --', valor: valores.cuenta_id || '' });
  cuentaWrap.appendChild(cuentaLabel);
  cuentaWrap.appendChild(select);

  const conceptoWrap = document.createElement('div');
  const conceptoLabel = document.createElement('label');
  conceptoLabel.textContent = 'Concepto';
  const concepto = document.createElement('input');
  concepto.type = 'text';
  concepto.dataset.campo = 'concepto';
  concepto.value = valores.concept || '';
  conceptoWrap.appendChild(conceptoLabel);
  conceptoWrap.appendChild(concepto);

  const debeWrap = document.createElement('div');
  const debeLabel = document.createElement('label');
  debeLabel.textContent = 'Débito';
  const debe = document.createElement('input');
  debe.type = 'number';
  debe.min = '0';
  debe.step = '0.01';
  debe.dataset.campo = 'debit';
  debe.value = valores.debit === undefined ? '' : valores.debit;
  debeWrap.appendChild(debeLabel);
  debeWrap.appendChild(debe);

  const haberWrap = document.createElement('div');
  const haberLabel = document.createElement('label');
  haberLabel.textContent = 'Crédito';
  const haber = document.createElement('input');
  haber.type = 'number';
  haber.min = '0';
  haber.step = '0.01';
  haber.dataset.campo = 'credit';
  haber.value = valores.credit === undefined ? '' : valores.credit;
  haberWrap.appendChild(haberLabel);
  haberWrap.appendChild(haber);

  const quitar = document.createElement('button');
  quitar.type = 'button';
  quitar.className = 'secondary quitar-linea';
  quitar.dataset.action = 'quitar-linea';
  quitar.textContent = 'Quitar';

  const error = document.createElement('div');
  error.className = 'error linea-error';
  error.dataset.errorLinea = '';
  error.setAttribute('aria-live', 'polite');

  fila.appendChild(cuentaWrap);
  fila.appendChild(conceptoWrap);
  fila.appendChild(debeWrap);
  fila.appendChild(haberWrap);
  fila.appendChild(quitar);
  fila.appendChild(error);

  [debe, haber, select, concepto].forEach((control) => control.addEventListener('input', actualizarTotalesAsiento));
  return fila;
}

function reindexarLineas() {
  const filas = qs('asiento-lineas').querySelectorAll('[data-linea]');
  filas.forEach((fila, indice) => {
    fila.dataset.indice = String(indice);
    const select = fila.querySelector('[data-campo="cuenta"]');
    const concepto = fila.querySelector('[data-campo="concepto"]');
    const debe = fila.querySelector('[data-campo="debit"]');
    const haber = fila.querySelector('[data-campo="credit"]');
    if (select) select.id = `linea-cuenta-${indice}`;
    if (concepto) concepto.id = `linea-concepto-${indice}`;
    if (debe) debe.id = `linea-debit-${indice}`;
    if (haber) haber.id = `linea-credit-${indice}`;
  });
}

export function agregarLinea(valores = {}) {
  const contenedor = qs('asiento-lineas');
  if (!contenedor) return;
  contenedor.appendChild(crearFilaLinea(valores));
  reindexarLineas();
  actualizarTotalesAsiento();
}

export function quitarLinea(boton) {
  const fila = boton.closest('[data-linea]');
  const contenedor = qs('asiento-lineas');
  if (!fila || !contenedor) return;
  if (contenedor.querySelectorAll('[data-linea]').length <= 1) return;
  fila.remove();
  reindexarLineas();
  actualizarTotalesAsiento();
}

export function actualizarTotalesAsiento() {
  const contenedor = qs('asiento-lineas');
  if (!contenedor) return;
  let debitos = 0;
  let creditos = 0;
  contenedor.querySelectorAll('[data-linea]').forEach((fila) => {
    const debe = fila.querySelector('[data-campo="debit"]');
    const haber = fila.querySelector('[data-campo="credit"]');
    const d = normalizarImporte(debe ? debe.value : '');
    const h = normalizarImporte(haber ? haber.value : '');
    if (d.valido) debitos += d.centavos;
    if (h.valido) creditos += h.centavos;
  });
  const totalDebe = qs('asiento-total-debitos');
  const totalHaber = qs('asiento-total-creditos');
  const diferencia = qs('asiento-diferencia');
  if (totalDebe) totalDebe.textContent = formatearMXN(debitos);
  if (totalHaber) totalHaber.textContent = formatearMXN(creditos);
  if (diferencia) {
    const delta = debitos - creditos;
    diferencia.textContent = formatearMXN(delta);
    diferencia.classList.toggle('negative', delta !== 0);
  }
}

export function poblarPeriodosAsiento(periodos = [], valor = '') {
  const select = qs('asiento-periodo');
  poblarSelect(select, periodos.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.status})`
  })), { placeholder: '-- Selecciona un periodo --', valor });
}

export function poblarEntidadesAsiento(entidades = [], valor = '') {
  const select = qs('asiento-entity');
  poblarSelect(select, entidades.map((e) => ({
    value: e.entity_id,
    label: `${e.name} — ${e.code}`
  })), { placeholder: '-- Sin entidad --', valor });
}

export function clearAsientoForm({ periodos = [], entidades = [] } = {}) {
  qs('asiento-id').value = '';
  qs('asiento-series').value = '';
  qs('asiento-folio').value = '';
  qs('asiento-date').value = '';
  qs('asiento-concept').value = '';
  poblarPeriodosAsiento(periodos);
  poblarEntidadesAsiento(entidades);
  qs('asiento-lineas').innerHTML = '';
  agregarLinea();
  agregarLinea();
  limpiarErrores(ERRORES_CABECERA);
  qs('asiento-cancel-edit').hidden = true;
  qs('asiento-submit').textContent = 'Guardar asiento';
  actualizarTotalesAsiento();
}

export function startAsientoEdit(asiento, lineas = [], { periodos = [], entidades = [] } = {}) {
  qs('asiento-id').value = asiento.id;
  qs('asiento-series').value = asiento.series || '';
  qs('asiento-folio').value = asiento.folio === undefined ? '' : asiento.folio;
  qs('asiento-date').value = asiento.date || '';
  qs('asiento-concept').value = asiento.concept || '';
  poblarPeriodosAsiento(periodos, asiento.period_id);
  poblarEntidadesAsiento(entidades, asiento.entity_id || '');
  qs('asiento-lineas').innerHTML = '';
  const filas = lineas.length > 0 ? lineas : [{}, {}];
  for (const linea of filas) {
    agregarLinea({
      cuenta_id: linea.cuenta_id || '',
      concept: linea.concept || '',
      debit: linea.debit ? desdeCentavos(linea.debit) : '',
      credit: linea.credit ? desdeCentavos(linea.credit) : ''
    });
  }
  limpiarErrores(ERRORES_CABECERA);
  qs('asiento-cancel-edit').hidden = false;
  qs('asiento-submit').textContent = 'Actualizar asiento';
}

export function collectAsientoPayload() {
  const lineas = [...qs('asiento-lineas').querySelectorAll('[data-linea]')].map((fila) => ({
    cuenta_id: fila.querySelector('[data-campo="cuenta"]').value,
    concept: fila.querySelector('[data-campo="concepto"]').value,
    debit: fila.querySelector('[data-campo="debit"]').value,
    credit: fila.querySelector('[data-campo="credit"]').value
  }));
  return {
    series: qs('asiento-series').value,
    folio: qs('asiento-folio').value,
    date: qs('asiento-date').value,
    concept: qs('asiento-concept').value,
    period_id: qs('asiento-periodo').value,
    entity_id: qs('asiento-entity').value || null,
    lines: lineas
  };
}

export function showAsientoErrors(errores = {}) {
  mostrarError('error-asiento-series', errores.series);
  mostrarError('error-asiento-folio', errores.folio);
  mostrarError('error-asiento-date', errores.date);
  mostrarError('error-asiento-concept', errores.concept);
  mostrarError('error-asiento-periodo', errores.period_id);
  mostrarError('error-asiento-lineas', errores.lineas || errores.balance || errores.sourceDocumentId);
  const filas = [...qs('asiento-lineas').querySelectorAll('[data-linea]')];
  filas.forEach((fila) => {
    const error = fila.querySelector('[data-error-linea]');
    if (error) error.textContent = '';
  });
  if (Array.isArray(errores.lineasDetalle)) {
    errores.lineasDetalle.forEach((detalle, indice) => {
      const fila = filas[indice];
      if (!fila) return;
      const error = fila.querySelector('[data-error-linea]');
      if (error) error.textContent = Object.values(detalle)[0] || '';
    });
  }
}
