import { generarUsuarios } from './semilla.js';
import { normalizarRUT } from './validaciones-acceso.js';
import { loadUsuarios } from './almacenamiento.js';

export const USUARIOS_BASE = Object.freeze(generarUsuarios());

function usuariosDisponibles() {
  const almacenados = loadUsuarios();
  return almacenados.length > 0 ? almacenados : USUARIOS_BASE;
}

export function listarUsuarios() {
  return usuariosDisponibles().map((usuario) => ({ ...usuario }));
}

export function buscarUsuarioPorRUT(rut) {
  const normalizado = normalizarRUT(rut);
  return usuariosDisponibles().find((usuario) => normalizarRUT(usuario.rut) === normalizado) || null;
}

export function obtenerUsuarioPorRol(rolId) {
  return usuariosDisponibles().find((usuario) => usuario.rol_id === rolId) || null;
}
