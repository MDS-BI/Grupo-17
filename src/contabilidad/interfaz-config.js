import { leerValor, escribirValor, eliminarValor } from '../storage.js';

export const NOMBRE_EMPRESA = 'Comercial Los Andes SpA';
export const IDENTIDAD_EMPRESA = Object.freeze({
  nombre: NOMBRE_EMPRESA,
  logotipo: 'svg-en-linea',
  ariaLabel: 'Logo de Comercial Los Andes SpA'
});
export const CLAVE_CONFIG_INTERFAZ = 'erp_contabilidad:interfaz';

const DEFAULT_CONFIG = Object.freeze({
  nombreEmpresa: NOMBRE_EMPRESA,
  logoEmpresa: ''
});

export function obtenerConfigInterfaz() {
  try {
    const raw = leerValor(CLAVE_CONFIG_INTERFAZ);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      nombreEmpresa: String(parsed?.nombreEmpresa || DEFAULT_CONFIG.nombreEmpresa).trim() || DEFAULT_CONFIG.nombreEmpresa,
      logoEmpresa: String(parsed?.logoEmpresa || '').trim()
    };
  } catch (_) {
    return { ...DEFAULT_CONFIG };
  }
}

export function guardarConfigInterfaz(config = {}) {
  const actual = obtenerConfigInterfaz();
  const siguiente = {
    nombreEmpresa: String(config.nombreEmpresa ?? actual.nombreEmpresa).trim() || DEFAULT_CONFIG.nombreEmpresa,
    logoEmpresa: String(config.logoEmpresa ?? actual.logoEmpresa).trim()
  };
  escribirValor(CLAVE_CONFIG_INTERFAZ, JSON.stringify(siguiente));
  return siguiente;
}

export function restablecerConfigInterfaz() {
  eliminarValor(CLAVE_CONFIG_INTERFAZ);
  return { ...DEFAULT_CONFIG };
}

export const PALETA_ESTADOS = Object.freeze({
  pagado: 'estado-ok',
  aprobado: 'estado-ok',
  cerrado: 'estado-ok',
  pendiente: 'estado-aviso',
  borrador: 'estado-aviso',
  abierto: 'estado-aviso',
  vencido: 'estado-error',
  cancelado: 'estado-error',
  anulado: 'estado-error'
});

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

const ORDEN_ESTADO = { borrador: 0, pendiente: 1, abierto: 1, aprobado: 2, pagado: 2, cerrado: 2, vencido: 3, cancelado: 4, anulado: 5 };

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
