import { construirArbol } from '../../contabilidad/cuentas.js';
import { escapeHtml, insigniaEstado } from './comun.js';

function nodo(cuenta, nivel) {
  const item = document.createElement('li');
  item.className = `cuenta-nodo nivel-${nivel}`;
  item.dataset.id = cuenta.id;
  item.setAttribute('role', 'treeitem');
  const etiqueta = cuenta.isLeaf ? 'Cuenta de detalle' : 'Cuenta principal';
  item.innerHTML = `
    <div class="cuenta-fila">
      <span class="cuenta-identidad">
        <strong>${escapeHtml(cuenta.code)}</strong>
        <span>${escapeHtml(cuenta.name)}</span>
      </span>
      <span class="cuenta-meta">
        <span class="muted">${escapeHtml(cuenta.type)} · ${etiqueta}</span>
        ${insigniaEstado(cuenta.status)}
        <button type="button" class="secondary" data-action="editar-cuenta" data-id="${escapeHtml(cuenta.id)}">Editar</button>
        <button type="button" class="danger" data-action="eliminar-cuenta" data-id="${escapeHtml(cuenta.id)}">Eliminar</button>
      </span>
    </div>`;
  if (cuenta.children && cuenta.children.length > 0) {
    const lista = document.createElement('ul');
    lista.setAttribute('role', 'group');
    for (const hija of cuenta.children) lista.appendChild(nodo(hija, nivel + 1));
    item.appendChild(lista);
  }
  return item;
}

export function renderCuentaList(container, cuentas) {
  if (!container) return false;
  container.innerHTML = '';
  if (!cuentas || cuentas.length === 0) return false;
  const lista = document.createElement('ul');
  lista.className = 'cuenta-arbol';
  lista.setAttribute('role', 'tree');
  for (const raiz of construirArbol(cuentas)) lista.appendChild(nodo(raiz, 0));
  container.appendChild(lista);
  return true;
}
