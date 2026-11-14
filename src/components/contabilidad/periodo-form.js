import { limpiarErrores, mostrarError } from './comun.js';

function qs(id) {
  return document.getElementById(id);
}

const ERRORES = ['error-periodo-name', 'error-periodo-start', 'error-periodo-end', 'error-periodo-status'];

export function clearPeriodoForm() {
  qs('periodo-id').value = '';
  qs('periodo-name').value = '';
  qs('periodo-start').value = '';
  qs('periodo-end').value = '';
  qs('periodo-status').value = 'abierto';
  limpiarErrores(ERRORES);
  qs('periodo-cancel-edit').hidden = true;
  qs('periodo-submit').textContent = 'Guardar periodo';
}

export function startPeriodoEdit(periodo) {
  qs('periodo-id').value = periodo.id;
  qs('periodo-name').value = periodo.name || '';
  qs('periodo-start').value = periodo.startDate || '';
  qs('periodo-end').value = periodo.endDate || '';
  qs('periodo-status').value = periodo.status || 'abierto';
  limpiarErrores(ERRORES);
  qs('periodo-cancel-edit').hidden = false;
  qs('periodo-submit').textContent = 'Actualizar periodo';
}

export function collectPeriodoPayload() {
  return {
    name: qs('periodo-name').value,
    startDate: qs('periodo-start').value,
    endDate: qs('periodo-end').value,
    status: qs('periodo-status').value
  };
}

export function showPeriodoErrors(errores = {}) {
  mostrarError('error-periodo-name', errores.name);
  mostrarError('error-periodo-start', errores.startDate);
  mostrarError('error-periodo-end', errores.endDate);
  mostrarError('error-periodo-status', errores.status);
}
