import { loadSesion, saveSesion, loadRoles } from './almacenamiento.js';
import { buscarUsuarioPorRUT } from './usuarios.js';
import { CATALOGO_ROLES } from './roles.js';
import { MENSAJE_ACCESO_INCORRECTO, normalizarRUT, validarCredenciales } from './validaciones-acceso.js';

function copiar(valor) {
  return valor === undefined ? undefined : JSON.parse(JSON.stringify(valor));
}

function emitir(nombre, detail) {
  if (typeof document === 'undefined' || typeof CustomEvent === 'undefined') return;
  document.dispatchEvent(new CustomEvent(nombre, { detail }));
}

export function obtenerSesionActiva() {
  const sesion = loadSesion();
  return sesion && sesion.estado === 'autenticada' ? sesion : null;
}

export function iniciarSesion(rut, contraseña) {
  const revision = validarCredenciales(rut, contraseña);
  if (!revision.valido) {
    return { ok: false, errores: revision.errores, error: Object.values(revision.errores)[0] };
  }
  const usuario = buscarUsuarioPorRUT(rut);
  if (!usuario || usuario.contraseña !== contraseña) {
    return { ok: false, errores: { acceso: MENSAJE_ACCESO_INCORRECTO }, error: MENSAJE_ACCESO_INCORRECTO };
  }
  const roles = loadRoles().length > 0 ? loadRoles() : CATALOGO_ROLES;
  const rol = roles.find((item) => item.id === usuario.rol_id);
  if (!rol) {
    return { ok: false, errores: { acceso: MENSAJE_ACCESO_INCORRECTO }, error: MENSAJE_ACCESO_INCORRECTO };
  }
  const sesion = {
    id: `ses-${Date.now().toString(36)}`,
    usuarioRut: usuario.rut,
    rolId: rol.id,
    permisos: copiar(rol.permisos),
    accionesPanel: copiar(rol.accionesPanel) || [],
    panelInicio: rol.panelInicio,
    estado: 'autenticada',
    iniciadaEn: new Date().toISOString()
  };
  saveSesion(sesion);
  emitir('acceso:sesion-iniciada', {
    usuarioRut: sesion.usuarioRut,
    rolId: sesion.rolId,
    panelInicio: sesion.panelInicio
  });
  return { ok: true, sesion };
}

export function cerrarSesion() {
  saveSesion(null);
  emitir('acceso:sesion-cerrada');
  return true;
}

export function obtenerPanelInicio() {
  const sesion = obtenerSesionActiva();
  return sesion ? sesion.panelInicio : '';
}

export function rolNormalizado(rut) {
  return normalizarRUT(rut);
}
