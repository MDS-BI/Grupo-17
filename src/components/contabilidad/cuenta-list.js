import { construirArbol } from '../../contabilidad/cuentas.js';
import { escapeHtml, insigniaEstado, filtrarYPaginar } from './comun.js';

function nodo(cuenta, nivel, porId) {
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
        <button type="button" class="danger" data-action="eliminar-cuenta" data-id="${escapeHtml(cuenta.id)}">Eliminar</button>
      </span>
    </div>`;
  if (cuenta.children && cuenta.children.length > 0) {
    const lista = document.createElement('ul');
    lista.setAttribute('role', 'group');
    for (const hija of cuenta.children) lista.appendChild(nodo(hija, nivel + 1, porId));
    item.appendChild(lista);
  }
  return item;
}

export function renderCuentaList(container, cuentas, opciones = {}) {
  if (!container) return false;
  container.innerHTML = '';
  if (!cuentas || cuentas.length === 0) return false;
  const resultado = filtrarYPaginar(cuentas, opciones.filtro, {
    pagina: opciones.pagina,
    tamano: opciones.tamano,
    campos: ['code', 'name', 'description', 'type']
  });
  if (resultado.registros.length === 0) return false;
  const lista = document.createElement('ul');
  lista.className = 'cuenta-arbol';
  lista.setAttribute('role', 'tree');
  const porId = new Map(resultado.registros.map((c) => [c.id, c]));
  for (const raiz of construirArbol(resultado.registros)) lista.appendChild(nodo(raiz, 0, porId));
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
