import { formatoMoneda, poblarSelect, mostrarMensaje } from './comun.js';

export function renderResumen({ periodos = [], periodoId = '', resumen }) {
  const selector = document.getElementById('resumen-periodo');
  const opciones = periodos.map((p) => ({ value: p.id, label: `${p.name} (${p.status})` }));
  poblarSelect(selector, opciones, { valor: periodoId });
  if (selector && periodoId) selector.value = periodoId;

  const datos = resumen || { ingresos: 0, gastos: 0, resultado: 0, hayMovimientos: false };
  const ingresos = document.getElementById('resumen-ingresos');
  const gastos = document.getElementById('resumen-gastos');
  const resultado = document.getElementById('resumen-resultado');
  if (ingresos) ingresos.textContent = formatoMoneda(datos.ingresos);
  if (gastos) gastos.textContent = formatoMoneda(datos.gastos);
  if (resultado) {
    resultado.textContent = formatoMoneda(datos.resultado);
    resultado.classList.toggle('negative', datos.resultado < 0);
  }
  mostrarMensaje('resumen-empty', datos.hayMovimientos ? '' : 'No hay información financiera disponible para el periodo seleccionado.');
}

export function renderResumenError(mensaje) {
  mostrarMensaje('resumen-empty', mensaje);
}
