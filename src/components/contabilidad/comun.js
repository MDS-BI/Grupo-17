import { formatearMXN } from '../../contabilidad/dinero.js';
import { formatearFecha } from '../../contabilidad/fechas.js';

export function escapeHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatoMoneda(centavos) {
  return formatearMXN(centavos);
}

export function formatoFecha(valor) {
  return formatearFecha(valor) || escapeHtml(valor || '');
}

export function poblarSelect(select, opciones, { placeholder = null, valor = '' } = {}) {
  if (!select) return;
  select.innerHTML = '';
  if (placeholder !== null) {
    const opcion = document.createElement('option');
    opcion.value = '';
    opcion.textContent = placeholder;
    select.appendChild(opcion);
  }
  for (const item of opciones) {
    const opcion = document.createElement('option');
    opcion.value = item.value;
    opcion.textContent = item.label;
    select.appendChild(opcion);
  }
  if (valor !== '' && [...select.options].some((o) => o.value === String(valor))) {
    select.value = String(valor);
  }
}

export function asignarTexto(id, texto) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = texto;
}

export function mostrarError(id, mensaje) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = mensaje || '';
}

export function limpiarErrores(ids) {
  ids.forEach((id) => mostrarError(id, ''));
}

export function insigniaEstado(status) {
  return `<span class="status-badge status-${escapeHtml(status)}">${escapeHtml(status)}</span>`;
}

export function mostrarMensaje(id, mensaje) {
  const elemento = document.getElementById(id);
  if (!elemento) return;
  elemento.textContent = mensaje || '';
  elemento.hidden = !mensaje;
}
