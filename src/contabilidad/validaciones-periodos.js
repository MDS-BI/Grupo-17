import { esFechaValida, compararFechas, haySolapamiento } from './fechas.js';

export const ESTADOS_PERIODO = Object.freeze(['abierto', 'cerrado']);

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

  if (!errores.startDate && !errores.endDate && compararFechas(endDate, startDate) < 0) {
    errores.endDate = 'La fecha de término debe ser igual o posterior a la fecha de inicio';
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
