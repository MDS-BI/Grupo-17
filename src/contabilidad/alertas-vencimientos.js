import { sumarCentavos } from './dinero.js';

function normalizarFecha(valor) {
  if (!valor) return null;
  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) return null;
    return new Date(valor.getFullYear(), valor.getMonth(), valor.getDate());
  }
  const texto = String(valor).trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(texto);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function inicioDia(fecha) {
  const d = normalizarFecha(fecha) || normalizarFecha(new Date());
  d.setHours(0, 0, 0, 0);
  return d;
}

export function semanaReferencia(fechaReferencia = new Date()) {
  const ref = inicioDia(fechaReferencia);
  const dia = ref.getDay();
  const deltaLunes = dia === 0 ? -6 : 1 - dia;
  const inicioLunes = new Date(ref);
  inicioLunes.setDate(ref.getDate() + deltaLunes);
  inicioLunes.setHours(0, 0, 0, 0);
  const finDomingo = new Date(inicioLunes);
  finDomingo.setDate(inicioLunes.getDate() + 6);
  finDomingo.setHours(23, 59, 59, 999);
  return { inicioLunes, finDomingo };
}

function normalizarEstado(estado) {
  return String(estado || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

export function clasificarAlertaPago(pago, fechaReferencia = new Date()) {
  const estado = normalizarEstado(pago?.estado || pago?.estadoPago || pago?.status || '') || 'pendiente';
  if (estado === 'anulado' || estado === 'cancelado') return 'anulado';
  if (estado === 'pagado' || estado === 'cobrado') return 'pagado';
  if (estado !== 'pendiente') return estado;

  const fechaVencimiento = normalizarFecha(pago?.fechaVencimiento || pago?.fecha_vencimiento || pago?.vencimiento);
  if (!fechaVencimiento) return 'pendiente';
  const ref = inicioDia(fechaReferencia);
  if (fechaVencimiento < ref) return 'vencido';
  const { finDomingo } = semanaReferencia(ref);
  const finDia = inicioDia(finDomingo);
  if (fechaVencimiento >= ref && fechaVencimiento <= finDia) return 'venceEstaSemana';
  return 'pendiente';
}

function nombreEntidad(pago, entidades) {
  const id = pago?.entidadId || pago?.entidad_id || pago?.entity_id;
  const lista = Array.isArray(entidades) ? entidades : [];
  const entidad = lista.find((e) => e.id === id || e.entity_id === id || e.entidad_id === id);
  return entidad?.nombre || entidad?.name || pago?.entidadNombre || pago?.nombreEntidad || 'Entidad sin nombre';
}

function montoCentavos(pago) {
  if (Number.isFinite(pago?.montoCentavos)) return Math.round(pago.montoCentavos);
  if (Number.isFinite(pago?.monto_centavos)) return Math.round(pago.monto_centavos);
  if (Number.isFinite(pago?.amount)) return Math.round(pago.amount);
  const monto = Number(pago?.monto ?? pago?.total ?? 0);
  return Math.round(monto * 100);
}

function construirAlerta(categoria, pagos, entidades) {
  const detallesBase = pagos.map((pago) => ({
    pagoId: pago.id,
    entidad: nombreEntidad(pago, entidades),
    montoCentavos: montoCentavos(pago),
    fechaVencimiento: String(pago.fechaVencimiento || pago.fecha_vencimiento || pago.vencimiento || '').slice(0, 10)
  }));
  const totalCentavos = sumarCentavos(detallesBase.map((detalle) => detalle.montoCentavos));
  const detalles = detallesBase.slice(0, 3);
  return {
    categoria,
    cantidad: detallesBase.length,
    totalCentavos,
    detalles,
    adicionales: Math.max(0, detallesBase.length - detalles.length)
  };
}

export function alertasDeVencimientos(pagos = [], entidades = [], fechaReferencia = new Date()) {
  const lista = Array.isArray(pagos) ? pagos : [];
  const vencidos = [];
  const venceEstaSemana = [];
  for (const pago of lista) {
    const categoria = clasificarAlertaPago(pago, fechaReferencia);
    if (categoria === 'vencido') vencidos.push(pago);
    else if (categoria === 'venceEstaSemana') venceEstaSemana.push(pago);
  }
  const alertaVencidos = construirAlerta('vencido', vencidos, entidades);
  const alertaSemana = construirAlerta('venceEstaSemana', venceEstaSemana, entidades);
  return {
    vencidos: alertaVencidos,
    vencido: alertaVencidos,
    venceEstaSemana: alertaSemana
  };
}

export function formatearAlerta(alerta, { formatearMoneda, formatearFecha } = {}) {
  const fmtMonto = typeof formatearMoneda === 'function' ? formatearMoneda : (c) => String(c);
  const fmtFecha = typeof formatearFecha === 'function' ? formatearFecha : (f) => String(f || '');
  return {
    ...alerta,
    total: fmtMonto(alerta?.totalCentavos || 0),
    detalles: (alerta?.detalles || []).map((d) => ({
      ...d,
      monto: fmtMonto(d.montoCentavos),
      fecha: fmtFecha(d.fechaVencimiento)
    }))
  };
}

export const ESTADOS_ALERTA = Object.freeze({
  VENCIDO: 'vencido',
  VENCE_ESTA_SEMANA: 'venceEstaSemana',
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  ANULADO: 'anulado'
});
