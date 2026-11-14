import { formatoFecha, escapeHtml, insigniaEstado } from './comun.js';

export function renderPeriodoList(container, periodos) {
  if (!container) return false;
  container.innerHTML = '';
  if (!periodos || periodos.length === 0) return false;
  const tabla = document.createElement('table');
  tabla.className = 'tabla-financiera';
  tabla.innerHTML = `
    <thead>
      <tr><th scope="col">Nombre</th><th scope="col">Inicio</th><th scope="col">Término</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr>
    </thead>
    <tbody></tbody>`;
  const cuerpo = tabla.querySelector('tbody');
  for (const periodo of periodos) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${escapeHtml(periodo.name)}</td>
      <td>${formatoFecha(periodo.startDate)}</td>
      <td>${formatoFecha(periodo.endDate)}</td>
      <td>${insigniaEstado(periodo.status)}</td>
      <td class="acciones">
        <button type="button" class="secondary" data-action="editar-periodo" data-id="${escapeHtml(periodo.id)}">Editar</button>
        <button type="button" class="secondary" data-action="alternar-periodo" data-id="${escapeHtml(periodo.id)}">${periodo.status === 'abierto' ? 'Cerrar' : 'Abrir'}</button>
        <button type="button" class="danger" data-action="eliminar-periodo" data-id="${escapeHtml(periodo.id)}">Eliminar</button>
      </td>`;
    cuerpo.appendChild(fila);
  }
  container.appendChild(tabla);
  return true;
}
