export const MENSAJE_ACCESO_INCORRECTO = 'RUT o contraseña incorrectos';
export const MENSAJE_RUT_INVALIDO = 'El RUT ingresado no es válido';

export function normalizarRUT(valor) {
  const texto = String(valor ?? '').trim().replace(/[.\s-]/g, '').toLowerCase();
  return texto.replace(/k$/, 'k');
}

export function formatearRUT(valor) {
  const original = String(valor ?? '');
  const borrandoVerificador = /-\s*$/.test(original);
  const texto = original.toUpperCase().replace(/[^\dK]/g, '').replace(/K(?=.)/g, '');
  if (texto.length <= 1) return texto;
  const cuerpo = borrandoVerificador ? texto : texto.slice(0, -1);
  const puntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return borrandoVerificador ? puntos : `${puntos}-${texto.slice(-1)}`;
}

export function calcularDigitoVerificador(cuerpo) {
  const digitos = String(cuerpo ?? '').replace(/\D/g, '');
  if (!digitos) return '';
  let suma = 0;
  let multiplicador = 2;
  for (let indice = digitos.length - 1; indice >= 0; indice -= 1) {
    suma += Number(digitos[indice]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = suma % 11;
  const digito = 11 - resto;
  if (digito === 11) return '0';
  if (digito === 10) return 'k';
  return String(digito);
}

export function validarFormatoRUT(valor) {
  const texto = normalizarRUT(valor);
  return /^\d{7,8}[\dk]$/.test(texto);
}

export function validarDigitoVerificador(valor) {
  const texto = normalizarRUT(valor);
  if (!/^\d{7,8}[\dk]$/.test(texto)) return false;
  return texto.slice(-1) === calcularDigitoVerificador(texto.slice(0, -1));
}

export function validarCredenciales(rut, contraseña) {
  const errores = {};
  if (!String(rut ?? '').trim()) errores.rut = 'El RUT es obligatorio';
  else if (!validarFormatoRUT(rut)) errores.rut = 'El RUT debe tener 7 u 8 dígitos y dígito verificador';
  else if (!validarDigitoVerificador(rut)) errores.rut = MENSAJE_RUT_INVALIDO;
  if (!String(contraseña ?? '').trim()) errores.contraseña = 'La contraseña es obligatoria';
  return { valido: Object.keys(errores).length === 0, errores };
}

export function mensajeAccesoIncorrecto() {
  return MENSAJE_ACCESO_INCORRECTO;
}
