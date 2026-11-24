import { formatoFecha, escapeHtml, insigniaEstado, filtrarYPaginar, encabezadoOrdenable } from './comun.js';

export function renderPeriodoList(container, periodos, opciones = {}) {
  if (!container) return false;
  const orden = opciones.orden;
  container.innerHTML = '';
  if (!periodos || periodos.length === 0) return false;
  const resultado = filtrarYPaginar(periodos, opciones.filtro, {
    pagina: opciones.pagina,
    tamano: opciones.tamano,
    campos: ['name', 'startDate', 'endDate', 'status']
  });
  if (resultado.registros.length === 0) return false;
  const tabla = document.createElement('table');
  tabla.className = 'tabla-financiera';
  tabla.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Nombre</th>
        ${encabezadoOrdenable('periodos', 'startDate', 'Inicio', 'date', orden)}
        ${encabezadoOrdenable('periodos', 'endDate', 'Término', 'date', orden)}
        ${encabezadoOrdenable('periodos', 'status', 'Estado', 'status', orden)}
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>`;
  const cuerpo = tabla.querySelector('tbody');
  for (const periodo of resultado.registros) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${escapeHtml(periodo.name)}</td>
      <td>${formatoFecha(periodo.startDate)}</td>
      <td>${formatoFecha(periodo.endDate)}</td>
      <td>${insigniaEstado(periodo.status)}</td>
       <td class="acciones">
         ${periodo.status === 'cerrado' ? '' : `<button type="button" class="secondary" data-action="editar-periodo" data-id="${escapeHtml(periodo.id)}">Editar</button>`}
          ${periodo.status === 'abierto' ? `<button type="button" class="secondary" data-action="cerrar-periodo" data-id="${escapeHtml(periodo.id)}">Cerrar</button>` : ''}
         ${periodo.status === 'cerrado' ? '' : `<button type="button" class="danger" data-action="eliminar-periodo" data-id="${escapeHtml(periodo.id)}">Eliminar</button>`}
       </td>`;
    cuerpo.appendChild(fila);
  }
  container.appendChild(tabla);
  container.dataset.paginaActual = String(resultado.pagina);
  container.dataset.totalPaginas = String(resultado.totalPaginas);
  container.dataset.totalRegistros = String(resultado.total);
  return true;
}
