import { SECCIONES_EXCLUIDAS, normalizarSeccion, permisosEfectivos } from '../contabilidad/permisos.js';
import { iconoSeccion } from '../contabilidad/interfaz-config.js';
import { iconoSvgLucide } from './iconos-lucide.js';

export const MAPA_NAVEGACION = Object.freeze([
  Object.freeze({ pantalla: 'dashboard', control: 'Panel', seccion: 'panel', roles: ['administrador', 'contador', 'tesorero', 'auditor'] }),
  Object.freeze({ pantalla: 'resumen', control: 'Resumen financiero', seccion: 'resumen', roles: ['administrador', 'contador'] }),
  Object.freeze({ pantalla: 'cuentas', control: 'Cuentas contables', seccion: 'cuentas', roles: ['administrador', 'contador'] }),
  Object.freeze({ pantalla: 'asientos', control: 'Asientos contables', seccion: 'asientos', roles: ['administrador', 'contador'] }),
  Object.freeze({ pantalla: 'pagos', control: 'Pagos y cobros', seccion: 'pagos', roles: ['administrador', 'tesorero'] }),
  Object.freeze({ pantalla: 'periodos', control: 'Periodos contables', seccion: 'periodos', roles: ['administrador'] }),
  Object.freeze({ pantalla: 'reportes', control: 'Reportes financieros', seccion: 'reportes', roles: ['administrador', 'contador', 'auditor'] })
]);

const ACCIONES = Object.freeze(['cargarDatos', 'restablecerDatos', 'cerrarSesion', 'configurarInterfaz']);
const MODULOS_ELIMINADOS = Object.freeze(['entities', 'documents', 'search']);

export function obtenerMapaNavegacion() {
  return MAPA_NAVEGACION.map((entrada) => ({ ...entrada, roles: [...entrada.roles] }));
}

export function moduloVisible(pantalla) {
  const destino = MAPA_NAVEGACION.find((item) => item.pantalla === pantalla);
  return Boolean(destino && !MODULOS_ELIMINADOS.includes(pantalla));
}

export function esAccion(control) {
  return ACCIONES.includes(String(control));
}

export function validarUnicidadControles(controles) {
  const visibles = controles.filter((control) => !control.hidden);
  const destinos = visibles.map((control) => control.dataset.destino || control.dataset.module);
  return new Set(destinos).size === destinos.length;
}

export function navegar(pantalla, permisos = []) {
  const entrada = MAPA_NAVEGACION.find((item) => item.pantalla === pantalla);
  if (!entrada || SECCIONES_EXCLUIDAS.includes(entrada.seccion)) {
    return { permitido: false, mensaje: 'Sección no disponible' };
  }
  const permiso = permisos.find((item) => normalizarSeccion(item.seccion) === entrada.seccion);
  if (!permiso || !permiso.visibleEnMenu || permiso.acceso === 'noDisponible') {
    return { permitido: false, mensaje: 'Acceso no disponible' };
  }
  return { permitido: true, mensaje: '' };
}

function escaparTexto(valor) {
  return String(valor ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function renderizarIconosMenu(botones = []) {
  const elementos = botones.length > 0
    ? botones
    : (typeof document !== 'undefined' ? [...document.querySelectorAll('.nav-module')] : []);
  for (const boton of elementos) {
    const destino = boton.dataset.module || boton.dataset.destino;
    const icono = boton.querySelector('.nav-icono');
    if (!icono) continue;
    const glifo = iconoSeccion(destino === 'dashboard' ? 'dashboard' : destino);
    icono.innerHTML = `<span class="nav-icono-glifo">${escaparTexto(glifo)}</span>${iconoSvgLucide(destino)}`;
  }
  return elementos;
}

export function renderizarMenu(permisos = [], sesion = null, botones = []) {
  // compat: renderizarMenu(permisos, { ...sesion, pantallaActiva })
  if (sesion && !Array.isArray(botones) && typeof botones === 'object' && botones !== null && botones.contenedor) {
    botones = [];
  }
  const elementos = Array.isArray(botones) && botones.length > 0
    ? botones
    : (typeof document !== 'undefined' ? [...document.querySelectorAll('.nav-module')] : []);
  renderizarIconosMenu(elementos);
  let permisosLista = Array.isArray(permisos) ? permisos : [];
  if ((!permisosLista.length || !permisosLista[0]?.seccion) && sesion) permisosLista = permisosEfectivos(sesion);
  if (permisosLista.length && typeof permisosLista[0] === 'string') permisosLista = permisosEfectivos(sesion);
  for (const boton of elementos) {
    const destino = boton.dataset.module || boton.dataset.destino;
    const resultado = navegar(destino, permisosLista);
    const permitido = resultado.permitido && moduloVisible(destino);
    boton.hidden = !permitido;
    boton.dataset.destino = destino;
    boton.dataset.menu = 'opcion';
    boton.disabled = false;
    boton.classList.remove('nav-disabled');
    boton.removeAttribute('aria-disabled');
    boton.removeAttribute('title');
    if (sesion) boton.dataset.rol = sesion.rolId || '';
    const etiqueta = boton.querySelector('.nav-label');
    if (etiqueta && !etiqueta.dataset.base) etiqueta.dataset.base = etiqueta.textContent;
    const activo = sesion?.pantallaActiva === destino || (destino === 'dashboard' && sesion?.pantallaActiva === 'panel');
    if (permitido && sesion && activo) {
      boton.setAttribute('aria-current', 'page');
      boton.classList.add('active');
    } else {
      boton.removeAttribute('aria-current');
      boton.classList.remove('active');
    }
  }
  return elementos;
}
