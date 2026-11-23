import { poblarSelect, limpiarErrores, mostrarError } from './comun.js';

function qs(id) {
  return document.getElementById(id);
}

const ERRORES = ['error-cuenta-code', 'error-cuenta-name', 'error-cuenta-type', 'error-cuenta-description', 'error-cuenta-parent', 'error-cuenta-status'];

export function populateCuentaParentSelect(cuentas = [], { excludeId = null } = {}) {
  const select = qs('cuenta-parent');
  const valor = select ? select.value : '';
  const opciones = cuentas
    .filter((c) => c.id !== excludeId)
    .map((c) => ({ value: c.id, label: `${c.code} · ${c.name}` }));
  poblarSelect(select, opciones, { placeholder: '-- Sin cuenta padre --', valor });
  if (select) select.value = valor;
}

export function clearCuentaForm() {
  qs('cuenta-id').value = '';
  qs('cuenta-code').value = '';
  qs('cuenta-name').value = '';
  qs('cuenta-type').value = 'activo';
  qs('cuenta-description').value = '';
  qs('cuenta-parent').value = '';
  qs('cuenta-status').value = 'activa';
  limpiarErrores(ERRORES);
  qs('cuenta-cancel-edit').hidden = true;
  qs('cuenta-submit').textContent = 'Guardar cuenta';
}

export function startCuentaEdit(cuenta) {
  qs('cuenta-id').value = cuenta.id;
  qs('cuenta-code').value = cuenta.code || '';
  qs('cuenta-name').value = cuenta.name || '';
  qs('cuenta-type').value = cuenta.type || 'activo';
  qs('cuenta-description').value = cuenta.description || '';
  qs('cuenta-parent').value = cuenta.parent_id || '';
  qs('cuenta-status').value = cuenta.status || 'activa';
  limpiarErrores(ERRORES);
  qs('cuenta-cancel-edit').hidden = false;
  qs('cuenta-submit').textContent = 'Actualizar cuenta';
}

export function collectCuentaPayload() {
  return {
    code: qs('cuenta-code').value,
    name: qs('cuenta-name').value,
    type: qs('cuenta-type').value,
    description: qs('cuenta-description').value,
    parent_id: qs('cuenta-parent').value || null,
    status: qs('cuenta-status').value
  };
}

export function showCuentaErrors(errores = {}) {
  mostrarError('error-cuenta-code', errores.code);
  mostrarError('error-cuenta-name', errores.name);
  mostrarError('error-cuenta-type', errores.type);
  mostrarError('error-cuenta-description', errores.description);
  mostrarError('error-cuenta-parent', errores.parent_id);
  mostrarError('error-cuenta-status', errores.status);
}
