import { cargarSesionActiva } from '../contabilidad/sesion.js';
import { permisosEfectivos, puedeAcceder } from '../contabilidad/permisos.js';
import { listarUsuarios } from '../contabilidad/usuarios.js';
import { obtenerRol } from '../contabilidad/roles.js';

function escapeHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function cargarSesion() {
  return cargarSesionActiva();
}

export function mostrarBloqueoAcceso(motivo = '') {
  const mensaje = document.getElementById('error-mensaje') || document.getElementById('status');
  if (mensaje) {
    mensaje.textContent = motivo || 'No tiene permisos para acceder a esta sección.';
    mensaje.classList.add('visible');
  }
}

export function renderizarAccesoDenegado(contenedor, seccion) {
  if (!contenedor) return;
  contenedor.innerHTML = `
    <section class="acceso-denegado" role="alert" aria-live="assertive">
      <h2>Acceso denegado</h2>
      <p>No tiene permisos para acceder a la sección <strong>${escapeHtml(seccion || 'solicitada')}</strong>.</p>
      <p class="muted">Solicite acceso al administrador si necesita esta función.</p>
    </section>`;
}

export function validarAcceso(sesion, seccion) {
  const activa = sesion || cargarSesion();
  if (!activa) return { permitido: false, motivo: 'No hay una sesión activa.', permisos: [] };
  const permisos = permisosEfectivos(activa);
  const permitido = puedeAcceder(activa, seccion);
  return {
    permitido,
    motivo: permitido ? '' : 'No tiene permisos para acceder a esta sección.',
    permisos
  };
}

export function obtenerCredenciales(contenedor = document) {
  return {
    rut: contenedor?.querySelector?.('#acceso-rut')?.value || document.getElementById('acceso-rut')?.value || '',
    contraseña: contenedor?.querySelector?.('#acceso-contraseña')?.value || document.getElementById('acceso-contraseña')?.value || ''
  };
}

export function mostrarErroresAcceso(errores = {}) {
  const general = document.getElementById('error-acceso');
  if (general) general.textContent = typeof errores === 'string' ? errores : errores.acceso || '';
  const rut = document.getElementById('error-acceso-rut');
  if (rut) rut.textContent = errores.rut || '';
  const contraseña = document.getElementById('error-acceso-contraseña');
  if (contraseña) contraseña.textContent = errores.contraseña || '';
}

export function limpiarFormularioAcceso() {
  const rut = document.getElementById('acceso-rut');
  const contraseña = document.getElementById('acceso-contraseña');
  if (rut) rut.value = '';
  if (contraseña) contraseña.value = '';
  mostrarErroresAcceso({});
}

export function renderizarUsuariosPrueba(contenedor = document) {
  const cuerpo = contenedor?.querySelector?.('#usuarios-prueba-body')
    || (typeof document !== 'undefined' ? document.getElementById('usuarios-prueba-body') : null);
  if (!cuerpo) return;
  cuerpo.replaceChildren();
  for (const usuario of listarUsuarios()) {
    const rol = obtenerRol(usuario.rol_id);
    const valores = [usuario.rut, usuario.contraseña, rol?.nombre || usuario.rol_id || '—'];
    const fila = document.createElement('tr');
    fila.dataset.usuarioPrueba = usuario.rol_id || '';
    for (const valor of valores) {
      const celda = document.createElement('td');
      celda.textContent = String(valor ?? '');
      fila.appendChild(celda);
    }
    cuerpo.appendChild(fila);
  }
}

export function renderAcceso(contenedor, errores = {}) {
  if (!contenedor) return;
  const formulario = contenedor.querySelector('#acceso-formulario');
  if (!formulario) return;
  mostrarErroresAcceso(errores);
  renderizarUsuariosPrueba(contenedor);
}
