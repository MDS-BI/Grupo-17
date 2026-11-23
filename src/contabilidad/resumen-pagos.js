import { formatearMXN } from './dinero.js';
import { fechaHoyISO } from './fechas.js';

export const ESTADOS_VISIBLES = Object.freeze(['pendiente', 'pagado', 'vencido']);
export const FILTROS_ESTADO = Object.freeze(['todos', ...ESTADOS_VISIBLES]);

function texto(valor) {
  return String(valor ?? '').trim();
}

function fechaISO(fechaActual) {
  if (typeof fechaActual === 'string') return fechaActual;
  if (fechaActual instanceof Date && !Number.isNaN(fechaActual.getTime())) {
    return fechaActual.toISOString().slice(0, 10);
  }
  return fechaHoyISO();
}

export function normalizarEstadoPago(pago) {
  const estado = texto(pago && pago.status);
  if (estado === 'pagado' || estado === 'aplicado') return 'pagado';
  return 'pendiente';
}

export function calcularEstadoPago(pago, fechaActual = new Date()) {
  const base = normalizarEstadoPago(pago);
  if (base === 'pagado') return 'pagado';
  const vencimiento = texto(pago && pago.fechaVencimiento) || texto(pago && pago.date);
  const hoy = fechaISO(fechaActual);
  return vencimiento && vencimiento < hoy ? 'vencido' : 'pendiente';
}

const cacheResumenPagos = new Map();

export function resumirPagos(pagos = [], fechaActual = new Date()) {
  const clave = `${fechaISO(fechaActual)}:${JSON.stringify(pagos)}`;
  if (cacheResumenPagos.has(clave)) return cacheResumenPagos.get(clave);
  const resumen = {};
  for (const estado of ESTADOS_VISIBLES) {
    resumen[estado] = { cantidad: 0, totalCentavos: 0 };
  }
  for (const pago of pagos) {
    const estado = calcularEstadoPago(pago, fechaActual);
    resumen[estado].cantidad += 1;
    resumen[estado].totalCentavos += Number(pago.amount) || 0;
  }
  cacheResumenPagos.set(clave, resumen);
  if (cacheResumenPagos.size > 50) cacheResumenPagos.delete(cacheResumenPagos.keys().next().value);
  return resumen;
}

export function filtrarPagos(pagos = [], filtro = 'todos', fechaActual = new Date()) {
  if (filtro === 'todos' || !FILTROS_ESTADO.includes(filtro)) return [...pagos];
  return pagos.filter((pago) => calcularEstadoPago(pago, fechaActual) === filtro);
}

export function formatearResumen(resumen) {
  const salida = {};
  for (const estado of ESTADOS_VISIBLES) {
    const grupo = resumen[estado] || { cantidad: 0, totalCentavos: 0 };
    salida[estado] = {
      cantidad: grupo.cantidad,
      totalCentavos: grupo.totalCentavos,
      total: formatearMXN(grupo.totalCentavos)
    };
  }
  return salida;
}
