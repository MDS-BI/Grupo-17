import { opcionesMenu } from './permisos.js';

export const NOMBRE_EMPRESA = 'Comercial Los Andes SpA';

export const IDENTIDAD_EMPRESA = Object.freeze({
  nombre: NOMBRE_EMPRESA,
  logotipo: 'svg-en-linea',
  ariaLabel: 'Logo de Comercial Los Andes SpA'
});

export const paleta = Object.freeze({
  primario: '#0f4c5c',
  exito: '#16794c',
  error: '#b42318',
  advertencia: '#a15c00',
  informacion: '#1d6f8c',
  texto: '#0b3946',
  fondo: '#f7fafb'
});

export const PALETA_ESTADOS = Object.freeze({
  pagado: 'estado-ok',
  aprobado: 'estado-ok',
  cerrado: 'estado-ok',
  activa: 'estado-ok',
  pendiente: 'estado-aviso',
  borrador: 'estado-aviso',
  abierto: 'estado-aviso',
  vencido: 'estado-error',
  cancelado: 'estado-error',
  anulado: 'estado-error',
  inactiva: 'estado-error'
});

const TIPOS_MENSAJE = new Set(['exito', 'error', 'advertencia', 'informacion']);

export function confirmarEliminacion(mensaje) {
  const dialogo = globalThis.window?.confirm || globalThis.confirm;
  if (typeof dialogo !== 'function') return false;
  try {
    return Boolean(dialogo(mensaje));
  } catch (_) {
    return false;
  }
}

export function mostrarMensaje(tipo, texto) {
  if (typeof document === 'undefined') return null;
  const tipoNormalizado = TIPOS_MENSAJE.has(tipo) ? tipo : 'informacion';
  const contenedor = document.querySelector('[data-mensaje="global"]')
    || document.querySelector('[data-mensaje]');
  if (!contenedor) return null;
  contenedor.textContent = texto || '';
  contenedor.dataset.tipo = tipoNormalizado;
  contenedor.hidden = !texto;
  return contenedor;
}

const PANTALLA_SECCION = Object.freeze({
  panel: 'dashboard',
  resumen: 'resumen',
  cuentas: 'cuentas',
  asientos: 'asientos',
  pagos: 'pagos',
  periodos: 'periodos',
  reportes: 'reportes',
  auditoria: 'auditoria',
  alertas: 'alertas',
  configInterfaz: 'configInterfaz'
});

export function obtenerOpcionesMenu(sesion, ancho = 1280) {
  const movil = Number(ancho) <= 900;
  return opcionesMenu(sesion || null).map((opcion) => ({
    seccion: opcion.seccion,
    pantalla: PANTALLA_SECCION[opcion.seccion] || opcion.seccion,
    etiqueta: opcion.etiqueta,
    acceso: opcion.acceso,
    movil
  }));
}

export const ICONOS_SECCION = Object.freeze({
  dashboard: '⌂',
  panel: '⌂',
  resumen: '▤',
  cuentas: '☰',
  asientos: '✎',
  pagos: '$',
  periodos: '◷',
  reportes: '▥',
  auditoria: '◎',
  alertas: '!',
  configInterfaz: '⚙'
});

export function iconoSeccion(seccion) {
  return ICONOS_SECCION[String(seccion || '')] || '•';
}

function normalizarTexto(valor) {
  return String(valor ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

export function compararTexto(a, b) {
  return normalizarTexto(a).localeCompare(normalizarTexto(b), 'es', { sensitivity: 'base' });
}

export function compararNumero(a, b) {
  return (Number(a) || 0) - (Number(b) || 0);
}

export function compararFecha(a, b) {
  const da = String(a || '');
  const db = String(b || '');
  return da.localeCompare(db);
}

const ORDEN_ESTADO = { borrador: 0, pendiente: 1, abierto: 1, aprobado: 2, pagado: 2, cerrado: 2, activa: 2, vencido: 3, cancelado: 4, anulado: 5, inactiva: 5 };

export function compararEstado(estado) {
  const clave = normalizarTexto(estado);
  return ORDEN_ESTADO[clave] ?? 99;
}

export function ordenarRegistros(registros, columna, sentido = 'asc', tipo = 'texto') {
  const dir = sentido === 'desc' ? -1 : 1;
  const copia = [...(Array.isArray(registros) ? registros : [])];
  copia.sort((a, b) => {
    const va = a?.[columna];
    const vb = b?.[columna];
    let cmp = 0;
    if (tipo === 'numero') cmp = compararNumero(va, vb);
    else if (tipo === 'fecha') cmp = compararFecha(va, vb);
    else if (tipo === 'estado') cmp = compararNumero(compararEstado(va), compararEstado(vb));
    else cmp = compararTexto(va, vb);
    return cmp * dir;
  });
  return copia;
}
