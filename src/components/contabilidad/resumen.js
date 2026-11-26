import { escapeHtml, formatoMoneda, poblarSelect, mostrarMensaje } from './comun.js';

function renderGastosPorCuenta(filas = []) {
  const cuerpo = document.getElementById('resumen-gastos-cuerpo');
  const tabla = document.getElementById('resumen-gastos-tabla');
  const vacio = document.getElementById('resumen-gastos-empty');
  if (!cuerpo || !tabla || !vacio) return;
  cuerpo.textContent = '';
  const hayFilas = filas.length > 0;
  tabla.hidden = !hayFilas;
  vacio.hidden = hayFilas;
  if (!hayFilas) return;

  for (const fila of filas) {
    const filaDom = document.createElement('tr');
    filaDom.dataset.cuentaId = fila.cuentaId;
    filaDom.dataset.valorCentavos = String(fila.gastoCentavos);
    filaDom.innerHTML = `
      <td>${escapeHtml(`${fila.codigo} — ${fila.nombre}`)}</td>
      <td class="num">${formatoMoneda(fila.gastoCentavos)}</td>
      <td class="num">${Number(fila.porcentaje).toFixed(1)}%</td>
    `;
    cuerpo.appendChild(filaDom);
  }
}

export function renderResumen({ periodos = [], periodoId = '', resumen, gastosPorCuenta = [] }) {
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
  renderGastosPorCuenta(gastosPorCuenta);
}

export function renderResumenError(mensaje) {
  mostrarMensaje('resumen-empty', mensaje);
  renderGastosPorCuenta([]);
}
