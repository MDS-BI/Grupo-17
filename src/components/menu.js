import { SECCIONES_EXCLUIDAS, normalizarSeccion } from '../contabilidad/permisos.js';

export const MAPA_NAVEGACION = Object.freeze([
  Object.freeze({ pantalla: 'dashboard', control: 'Panel', seccion: 'panel', roles: ['administrador', 'contador', 'tesorero', 'auditor'] }),
  Object.freeze({ pantalla: 'resumen', control: 'Resumen financiero', seccion: 'resumen', roles: ['administrador', 'contador'] }),
  Object.freeze({ pantalla: 'cuentas', control: 'Cuentas contables', seccion: 'cuentas', roles: ['administrador', 'contador'] }),
  Object.freeze({ pantalla: 'asientos', control: 'Asientos contables', seccion: 'asientos', roles: ['administrador', 'contador'] }),
  Object.freeze({ pantalla: 'pagos', control: 'Pagos y cobros', seccion: 'pagos', roles: ['administrador', 'tesorero'] }),
  Object.freeze({ pantalla: 'periodos', control: 'Periodos contables', seccion: 'periodos', roles: ['administrador'] }),
  Object.freeze({ pantalla: 'reportes', control: 'Reportes financieros', seccion: 'reportes', roles: ['administrador', 'contador', 'auditor'] })
]);

const ACCIONES = Object.freeze(['cargarDatos', 'restablecerDatos', 'cerrarSesion']);

export function obtenerMapaNavegacion() {
  return MAPA_NAVEGACION.map((entrada) => ({ ...entrada, roles: [...entrada.roles] }));
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

export function renderizarMenu(permisos = [], sesion = null, botones = []) {
  const elementos = botones.length > 0
    ? botones
    : (typeof document !== 'undefined' ? [...document.querySelectorAll('.nav-module')] : []);
  for (const boton of elementos) {
    const destino = boton.dataset.module || boton.dataset.destino;
    const permitido = navegar(destino, permisos).permitido;
    boton.hidden = !permitido;
    boton.dataset.destino = destino;
    boton.dataset.menu = 'opcion';
    if (sesion) boton.dataset.rol = sesion.rolId || '';
    if (permitido && sesion && sesion.pantallaActiva === destino) {
      boton.setAttribute('aria-current', 'page');
      boton.classList.add('active');
    } else {
      boton.removeAttribute('aria-current');
      boton.classList.remove('active');
    }
  }
  return elementos;
}
