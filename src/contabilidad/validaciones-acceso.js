export const MENSAJE_ACCESO_INCORRECTO = 'RUT o contraseña incorrectos';

export function normalizarRUT(valor) {
  const texto = String(valor ?? '').trim().replace(/[.\s-]/g, '').toLowerCase();
  return texto.replace(/k$/, 'k');
}

export function validarFormatoRUT(valor) {
  const texto = normalizarRUT(valor);
  return /^\d{7,8}[\dk]$/.test(texto);
}

export function validarCredenciales(rut, contraseña) {
  const errores = {};
  if (!String(rut ?? '').trim()) errores.rut = 'El RUT es obligatorio';
  else if (!validarFormatoRUT(rut)) errores.rut = 'El RUT debe tener 7 u 8 dígitos y dígito verificador';
  if (!String(contraseña ?? '').trim()) errores.contraseña = 'La contraseña es obligatoria';
  return { valido: Object.keys(errores).length === 0, errores };
}

export function mensajeAccesoIncorrecto() {
  return MENSAJE_ACCESO_INCORRECTO;
}
