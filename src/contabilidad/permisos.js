import { loadRoles, loadSesion } from './almacenamiento.js';
import { CATALOGO_ROLES } from './roles.js';

export const SECCIONES = Object.freeze(['panel', 'resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes', 'entidades', 'documentos', 'busqueda', 'datosDemo']);
export const SECCIONES_EXCLUIDAS = Object.freeze(['entidades', 'documentos', 'busqueda']);

const MAPEO = Object.freeze({
  dashboard: 'panel',
  resumen: 'resumen',
  cuentas: 'cuentas',
  asientos: 'asientos',
  pagos: 'pagos',
  periodos: 'periodos',
  reportes: 'reportes',
  entidades: 'entidades',
  documentos: 'documentos',
  search: 'busqueda',
  datosDemo: 'datosDemo'
});

const ETIQUETAS = Object.freeze({
  panel: 'Panel',
  resumen: 'Resumen financiero',
  cuentas: 'Cuentas contables',
  asientos: 'Asientos contables',
  pagos: 'Pagos y cobros',
  periodos: 'Periodos contables',
  reportes: 'Reportes financieros'
});

export function normalizarSeccion(seccion) {
  return MAPEO[seccion] || seccion;
}

export function obtenerSesionActiva() {
  const sesion = loadSesion();
  return sesion && sesion.estado === 'autenticada' ? sesion : null;
}

export function obtenerPermiso(seccion, sesion = obtenerSesionActiva()) {
  if (!sesion) return null;
  const clave = normalizarSeccion(seccion);
  return sesion.permisos.find((permiso) => permiso.seccion === clave) || null;
}

export function puedeAcceder(seccion, sesion = obtenerSesionActiva()) {
  const permiso = obtenerPermiso(seccion, sesion);
  return Boolean(permiso && permiso.visibleEnMenu && permiso.acceso !== 'noDisponible');
}

export function puedeEjecutar(accion, sesion = obtenerSesionActiva()) {
  if (!sesion) return false;
  if (sesion.accionesPanel && sesion.accionesPanel.includes(accion)) return true;
  return sesion.permisos.some((permiso) => permiso.acciones.includes(accion));
}

export function opcionesMenu(sesion = obtenerSesionActiva()) {
  if (!sesion) return [];
  return sesion.permisos
    .filter((permiso) => permiso.visibleEnMenu && !SECCIONES_EXCLUIDAS.includes(permiso.seccion))
    .map((permiso) => ({
      destino: Object.keys(MAPEO).find((clave) => MAPEO[clave] === permiso.seccion) || permiso.seccion,
      seccion: permiso.seccion,
      etiqueta: ETIQUETAS[permiso.seccion] || permiso.seccion,
      acceso: permiso.acceso,
      acciones: [...permiso.acciones]
    }));
}

export function matrizPorRol() {
  const roles = loadRoles().length > 0 ? loadRoles() : CATALOGO_ROLES;
  return roles.reduce((matriz, rol) => {
    matriz[rol.id] = rol.permisos.reduce((mapa, permiso) => {
      mapa[permiso.seccion] = permiso.acceso;
      return mapa;
    }, {});
    return matriz;
  }, {});
}
