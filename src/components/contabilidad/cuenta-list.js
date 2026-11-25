import { construirArbol } from '../../contabilidad/cuentas.js';
import { ordenarRegistros } from '../../contabilidad/interfaz-config.js';
import { escapeHtml, insigniaEstado, filtrarYPaginar, encabezadoOrdenable } from './comun.js';

const COLUMNAS_ORDEN = [
  { columna: 'code', etiqueta: 'Código', tipo: 'texto' },
  { columna: 'name', etiqueta: 'Nombre', tipo: 'texto' },
  { columna: 'status', etiqueta: 'Estado', tipo: 'estado' }
];

function aplicarOrden(cuentas, orden) {
  if (!orden?.columna) return cuentas;
  const columna = COLUMNAS_ORDEN.find((item) => item.columna === orden.columna);
  if (!columna) return cuentas;
  return ordenarRegistros(cuentas, orden.columna, orden.direccion || orden.sentido || 'asc', columna.tipo);
}

function encabezadosOrden(orden) {
  return `<table class="cuenta-orden-tabla"><thead><tr>${COLUMNAS_ORDEN
    .map((columna) => encabezadoOrdenable('cuentas', columna.columna, columna.etiqueta, columna.tipo, orden))
    .join('')}</tr></thead></table>`;
}

function nodo(cuenta, nivel, porId, eliminable) {
  const item = document.createElement('li');
  item.className = `cuenta-nodo nivel-${nivel}`;
  item.dataset.id = cuenta.id;
  item.setAttribute('role', 'treeitem');
  const etiqueta = cuenta.isLeaf ? 'Cuenta de detalle' : 'Cuenta principal';
  const padre = cuenta.parent_id ? porId.get(cuenta.parent_id) : null;
  const descripcion = cuenta.description
    ? `<span class="cuenta-descripcion">${escapeHtml(cuenta.description)}</span>`
    : '';
  const cuentaPrincipal = padre
    ? `<span class="cuenta-padre">Cuenta principal: ${escapeHtml(padre.code)} · ${escapeHtml(padre.name)}</span>`
    : '';
  const inactiva = cuenta.status === 'inactiva' || cuenta.status === 'inactive';
  const botonEliminar = eliminable && !inactiva
    ? `<button type="button" class="danger" data-action="eliminar-cuenta" data-confirmar-eliminacion data-id="${escapeHtml(cuenta.id)}">Eliminar</button>`
    : '';
  item.innerHTML = `
    <div class="cuenta-fila">
      <span class="cuenta-identidad">
        <strong>${escapeHtml(cuenta.code)}</strong>
        <span>${escapeHtml(cuenta.name)}</span>
        ${descripcion}
        ${cuentaPrincipal}
      </span>
      <span class="cuenta-meta">
        <span class="muted">${escapeHtml(cuenta.type)} · ${etiqueta}</span>
        ${insigniaEstado(cuenta.status)}
        <button type="button" class="secondary" data-action="ver-detalle-cuenta" data-id="${escapeHtml(cuenta.id)}">Ver detalle</button>
        <button type="button" class="secondary" data-action="editar-cuenta" data-id="${escapeHtml(cuenta.id)}">Editar</button>
        ${botonEliminar}
      </span>
    </div>`;
  if (cuenta.children && cuenta.children.length > 0) {
    const lista = document.createElement('ul');
    lista.setAttribute('role', 'group');
    for (const hija of cuenta.children) lista.appendChild(nodo(hija, nivel + 1, porId, eliminable));
    item.appendChild(lista);
  }
  return item;
}

export function renderCuentaList(container, cuentas, opciones = {}) {
  if (!container) return false;
  container.innerHTML = '';
  if (!cuentas || cuentas.length === 0) return false;
  const ordenadas = aplicarOrden(cuentas, opciones.orden);
  const resultado = filtrarYPaginar(ordenadas, opciones.filtro, {
    pagina: opciones.pagina,
    tamano: opciones.tamano,
    campos: ['code', 'name', 'description', 'type']
  });
  if (resultado.registros.length === 0) return false;
  container.insertAdjacentHTML('beforeend', encabezadosOrden(opciones.orden));
  const lista = document.createElement('ul');
  lista.className = 'cuenta-arbol';
  lista.setAttribute('role', 'tree');
  const porId = new Map(resultado.registros.map((c) => [c.id, c]));
  const eliminable = opciones.eliminable !== false;
  for (const raiz of construirArbol(resultado.registros)) lista.appendChild(nodo(raiz, 0, porId, eliminable));
  container.appendChild(lista);
  container.dataset.paginaActual = String(resultado.pagina);
  container.dataset.totalPaginas = String(resultado.totalPaginas);
  container.dataset.totalRegistros = String(resultado.total);
  return true;
}

export function renderCuentaDetalle(container, detalle) {
  if (!container) return false;
  container.innerHTML = '';
  if (!detalle) return false;
  const cuentaPrincipal = detalle.parentCode
    ? `${detalle.parentCode} · ${detalle.parentName}`
    : 'Ninguna';
  container.innerHTML = `
    <dl class="cuenta-detalle">
      <div><dt>Código</dt><dd>${escapeHtml(detalle.code)}</dd></div>
      <div><dt>Nombre</dt><dd>${escapeHtml(detalle.name)}</dd></div>
      <div><dt>Tipo</dt><dd>${escapeHtml(detalle.type)}</dd></div>
      <div><dt>Descripción</dt><dd>${escapeHtml(detalle.description || 'Sin descripción')}</dd></div>
      <div><dt>Estado</dt><dd>${insigniaEstado(detalle.status)}</dd></div>
      <div><dt>Cuenta principal</dt><dd>${escapeHtml(cuentaPrincipal)}</dd></div>
    </dl>`;
  return true;
}
