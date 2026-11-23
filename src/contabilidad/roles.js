import { generarRoles } from './semilla.js';

export const CATALOGO_ROLES = Object.freeze(generarRoles());

export function obtenerRol(id, roles = CATALOGO_ROLES) {
  return roles.find((rol) => rol.id === id) || null;
}

export function permisosDelRol(id, roles = CATALOGO_ROLES) {
  const rol = obtenerRol(id, roles);
  return rol ? rol.permisos : [];
}

export function accionesDelRol(id, roles = CATALOGO_ROLES) {
  const rol = obtenerRol(id, roles);
  return rol ? rol.accionesPanel : [];
}

export function panelDelRol(id, roles = CATALOGO_ROLES) {
  const rol = obtenerRol(id, roles);
  return rol ? rol.panelInicio : '';
}
