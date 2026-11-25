import { PALETA_ESTADOS } from '../../contabilidad/interfaz-config.js';

export function escapeHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizar(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function formatearMonto(centavos) {
  const valor = (Number(centavos) || 0) / 100;
  return valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

export const formatoMoneda = formatearMonto;

export function formatearFecha(valor) {
  if (!valor) return '';
  const texto = String(valor);
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const [anio, mes, dia] = texto.split('-');
    return `${dia}/${mes}/${anio}`;
  }
  const fecha = new Date(texto);
  if (Number.isNaN(fecha.getTime())) return texto;
  return fecha.toLocaleDateString('es-MX');
}

export const formatoFecha = formatearFecha;

export function claseEstado(estado) {
  const valor = String(estado || '').toLowerCase();
  return PALETA_ESTADOS[valor] || 'estado-neutro';
}

export function insigniaEstado(estado) {
  const texto = String(estado || '').toLowerCase();
  return `<span class="badge ${claseEstado(texto)}" data-estado="${escapeHtml(texto)}">${escapeHtml(texto)}</span>`;
}

export function filtrarYPaginar(registros = [], filtro = '', opciones = {}) {
  const lista = Array.isArray(registros) ? registros : [];
  const campos = Array.isArray(opciones.campos) && opciones.campos.length > 0
    ? opciones.campos
    : ['id', 'name', 'code', 'concept', 'status'];
  const texto = normalizar(typeof filtro === 'string' ? filtro : filtro?.texto || filtro?.text || '');
  const filtrados = texto
    ? lista.filter((registro) => campos.some((campo) => normalizar(registro?.[campo]).includes(texto)))
    : [...lista];
  const tamano = Math.max(1, Number(opciones.tamano) || 50);
  const total = filtrados.length;
  const totalPaginas = Math.max(1, Math.ceil(total / tamano));
  const paginaSolicitada = Math.max(1, Number(opciones.pagina) || 1);
  const pagina = Math.min(paginaSolicitada, totalPaginas);
  const inicio = (pagina - 1) * tamano;
  return {
    registros: filtrados.slice(inicio, inicio + tamano),
    pagina,
    tamano,
    total,
    totalPaginas
  };
}

export function poblarSelect(select, opciones = [], { placeholder = '', valor = '' } = {}) {
  if (!select) return;
  select.innerHTML = '';
  if (placeholder) {
    const opcionVacia = document.createElement('option');
    opcionVacia.value = '';
    opcionVacia.textContent = placeholder;
    select.appendChild(opcionVacia);
  }
  for (const dato of opciones) {
    const opcion = document.createElement('option');
    opcion.value = dato.value ?? '';
    opcion.textContent = dato.label ?? '';
    select.appendChild(opcion);
  }
  if (valor && [...select.options].some((opcion) => opcion.value === valor)) select.value = valor;
}

export function limpiarErrores(ids = []) {
  ids.forEach((id) => {
    const elemento = document.getElementById(id);
    if (!elemento) return;
    elemento.textContent = '';
    elemento.hidden = true;
  });
}

export function mostrarError(id, mensaje) {
  const elemento = document.getElementById(id);
  if (!elemento) return;
  elemento.textContent = mensaje || '';
  elemento.hidden = !mensaje;
}

export function mostrarMensaje(id, mensaje) {
  mostrarError(id, mensaje);
}

export function crearNodoEstadoVacio(mensaje, attrs = {}) {
  const nodo = document.createElement('p');
  nodo.className = `empty ${attrs.className || ''}`.trim();
  nodo.textContent = mensaje;
  if (attrs.id) nodo.id = attrs.id;
  if (attrs.hidden) nodo.hidden = true;
  Object.entries(attrs.dataset || {}).forEach(([clave, valor]) => { nodo.dataset[clave] = valor; });
  return nodo;
}

export function aplicarEstadoVacio(contenedor, mensaje, visible) {
  if (!contenedor) return;
  contenedor.textContent = mensaje || '';
  contenedor.hidden = !visible;
}

export function setAriaBusy(elemento, ocupado) {
  if (!elemento) return;
  if (ocupado) elemento.setAttribute('aria-busy', 'true');
  else elemento.removeAttribute('aria-busy');
}

export function anunciarMensaje(elemento, mensaje, tipo = 'info') {
  if (!elemento) return;
  elemento.textContent = mensaje || '';
  elemento.dataset.tipo = tipo;
  elemento.hidden = !mensaje;
}

export function encabezadoOrdenable(tabla, columna, etiqueta, tipo, orden, clase = '') {
  const activa = Boolean(orden && orden.tabla === tabla && orden.columna === columna);
  const direccion = activa && orden.direccion === 'desc' ? 'desc' : 'asc';
  const ariaSort = activa ? (direccion === 'desc' ? 'descending' : 'ascending') : 'none';
  const tipoOrden = tipo || 'text';
  const claseTh = clase ? ` class="${escapeHtml(clase)}"` : '';
  return `<th scope="col"${claseTh} aria-sort="${ariaSort}"><button type="button" class="orden-tabla" data-ordenar data-orden-tabla="${escapeHtml(tabla)}" data-orden-columna="${escapeHtml(columna)}" data-orden-tipo="${escapeHtml(tipoOrden)}" aria-label="Ordenar por ${escapeHtml(etiqueta)}">${escapeHtml(etiqueta)}</button></th>`;
}
