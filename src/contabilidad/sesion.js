import { listarUsuarios, buscarUsuarioPorRUT } from './usuarios.js';
import { obtenerRol } from './roles.js';
import { validarCredenciales, normalizarRUT } from './validaciones-acceso.js';
import { loadSesion, saveSesion, loadUsuarios } from './almacenamiento.js';
import { eliminarValor } from '../storage.js';
import { permisosEfectivos } from './permisos.js';

export const SESION_ACTIVA_KEY = 'erp_contabilidad:sesion';
export const SESION_USUARIO_KEY = SESION_ACTIVA_KEY;

const PANTALLA_POR_ROL = {
  administrador: 'dashboard',
  contador: 'dashboard',
  tesorero: 'pagos',
  auditor: 'reportes'
};

const PANEL_POR_ROL = {
  administrador: 'integral',
  contador: 'contable',
  tesorero: 'tesoreria',
  auditor: 'auditoria'
};

function pantallaInicial(rolId) {
  return PANTALLA_POR_ROL[rolId] || 'dashboard';
}

function normalizarSesion(sesion) {
  if (!sesion || typeof sesion !== 'object') return null;
  if (!sesion.usuarioId || !sesion.rolId) return null;
  return sesion;
}

export function cargarSesionActiva() {
  return normalizarSesion(loadSesion());
}

export function obtenerSesionActiva() {
  return cargarSesionActiva();
}

export function esSesionValida(sesion = obtenerSesionActiva()) {
  const actual = normalizarSesion(sesion);
  if (!actual) return false;
  const rol = obtenerRol(actual.rolId);
  if (!rol) return false;
  const usuarios = loadUsuarios();
  if (usuarios.length === 0) return true;
  const usuario = usuarios.find((item) => item.id === actual.usuarioId || normalizarRUT(item.rut) === normalizarRUT(actual.usuarioId));
  if (!usuario) return true;
  return usuario.activo !== false;
}

export function requiereConfiguracionInicial() {
  return loadUsuarios().length === 0;
}

export function iniciarSesion(usuarioId, pin) {
  const validacion = validarCredenciales(usuarioId, pin);
  if (!validacion.valido) {
    const mensaje = validacion.errores.rut || validacion.errores.contrasena || validacion.errores['contraseña'] || 'RUT o contraseña incorrectos';
    return { exito: false, ok: false, mensaje, error: mensaje, errores: validacion.errores };
  }

  const rut = normalizarRUT(usuarioId);
  const usuarios = listarUsuarios();
  const usuario = usuarios.find((item) => normalizarRUT(item.rut) === rut || item.id === usuarioId) || buscarUsuarioPorRUT(usuarioId);
  if (!usuario) {
    return { exito: false, ok: false, mensaje: 'RUT o contraseña incorrectos', error: 'RUT o contraseña incorrectos' };
  }
  if (usuario.activo === false) {
    return { exito: false, ok: false, mensaje: 'Usuario inactivo. Contacta al administrador.', error: 'Usuario inactivo. Contacta al administrador.' };
  }

  const contrasenaEsperada = String(usuario.contrasena || usuario['contraseña'] || usuario.contraseña || usuario.pin || usuario.password || '');
  if (String(pin) !== contrasenaEsperada) {
    return { exito: false, ok: false, mensaje: 'RUT o contraseña incorrectos', error: 'RUT o contraseña incorrectos' };
  }

  const rol = obtenerRol(usuario.rolId || usuario.rol_id);
  if (!rol) {
    return { exito: false, ok: false, mensaje: 'El usuario no tiene un rol válido asignado.', error: 'El usuario no tiene un rol válido asignado.' };
  }

  const permisos = permisosEfectivos({ rolId: rol.id });
  const sesion = {
    usuarioId: usuario.rut || usuario.id,
    usuarioRut: usuario.rut || null,
    usuarioNombre: usuario.nombre || null,
    nombreUsuario: usuario.nombre,
    rolId: rol.id,
    rolNombre: rol.nombre,
    nombreRol: rol.nombre,
    pantallaActiva: pantallaInicial(rol.id),
    fechaInicio: new Date().toISOString(),
    estado: 'autenticada',
    permisos
  };
  saveSesion(sesion);
  return { exito: true, ok: true, sesion, permisos };
}

export function cerrarSesion() {
  saveSesion(null);
  eliminarValor('erp_contabilidad_sesion_activa');
  return { exito: true, ok: true };
}

export function actualizarPantallaActiva(pantalla) {
  const sesion = obtenerSesionActiva();
  if (!sesion) return { exito: false, ok: false, mensaje: 'No hay una sesión activa.' };
  const siguiente = { ...sesion, pantallaActiva: String(pantalla || 'dashboard') };
  saveSesion(siguiente);
  return { exito: true, ok: true, sesion: siguiente };
}

export function obtenerPanelInicio(sesion = obtenerSesionActiva()) {
  const rolId = sesion?.rolId || sesion?.rol_id;
  return PANEL_POR_ROL[rolId] || 'dashboard';
}

export function restaurarSesionActiva() {
  const sesion = obtenerSesionActiva();
  if (!sesion) return { exito: false, ok: false, sesion: null };
  if (!esSesionValida(sesion)) {
    cerrarSesion();
    return { exito: false, ok: false, sesion: null };
  }
  const permisos = permisosEfectivos(sesion);
  return { exito: true, ok: true, sesion: { ...sesion, permisos }, permisos };
}
