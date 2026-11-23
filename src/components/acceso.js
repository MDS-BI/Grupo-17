function qs(id) {
  return document.getElementById(id);
}

export function renderAcceso(container, errores = {}) {
  if (!container) return;
  container.hidden = false;
  const mensaje = errores.acceso || '';
  const elementoError = container.querySelector('[data-acceso="error"]');
  if (elementoError) {
    elementoError.textContent = mensaje;
    elementoError.hidden = !mensaje;
  }
  const rut = container.querySelector('[data-acceso="rut"]');
  const contraseña = container.querySelector('[data-acceso="contraseña"]');
  if (rut) {
    rut.classList.toggle('invalido', Boolean(errores.rut));
    if (rut !== document.activeElement) rut.focus();
  }
  if (contraseña) contraseña.classList.toggle('invalido', Boolean(errores.contraseña));
}

export function obtenerCredenciales(container) {
  return {
    rut: container?.querySelector('[data-acceso="rut"]')?.value || '',
    contraseña: container?.querySelector('[data-acceso="contraseña"]')?.value || ''
  };
}

export function mostrarErroresAcceso(errores = {}) {
  const rut = qs('error-acceso-rut');
  const contraseña = qs('error-acceso-contraseña');
  const general = qs('error-acceso');
  if (rut) rut.textContent = errores.rut || '';
  if (contraseña) contraseña.textContent = errores.contraseña || '';
  if (general) {
    general.textContent = errores.acceso || '';
    general.hidden = !errores.acceso;
  }
}

export function limpiarFormularioAcceso() {
  const rut = qs('acceso-rut');
  const contraseña = qs('acceso-contraseña');
  if (rut) rut.value = '';
  if (contraseña) contraseña.value = '';
  mostrarErroresAcceso({});
}
