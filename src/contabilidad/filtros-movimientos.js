import { sumarCentavos } from './dinero.js';

function normalizarTexto(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function aCentavos(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  if (Number.isInteger(valor) && Math.abs(valor) >= 1000) return valor; // heurística conservadora no usada por defecto
  const num = Number(valor);
  if (!Number.isFinite(num)) return null;
  return Math.round(num * 100);
}

function montoCentavosRegistro(registro) {
  if (Number.isFinite(registro?.montoCentavos)) return Math.round(registro.montoCentavos);
  if (Number.isFinite(registro?.monto_centavos)) return Math.round(registro.monto_centavos);
  if (Number.isFinite(registro?.totalCentavos)) return Math.round(registro.totalCentavos);
  if (Number.isFinite(registro?.totalDebit)) return Math.round(registro.totalDebit);
  if (Number.isFinite(registro?.amount)) return Math.round(registro.amount);
  if (Array.isArray(registro?.lineas)) {
    return sumarCentavos(registro.lineas.map((l) => Math.abs(Number(
      l.montoCentavos ?? l.monto_centavos ?? l.debit ?? l.credit ?? Math.round(Number(l.monto || 0) * 100)
    )) || 0));
  }
  return Math.round(Number(registro?.monto ?? registro?.total ?? 0) * 100);
}

function fechaRegistro(registro, tipo) {
  if (tipo === 'pago') return String(registro?.fechaPago || registro?.fecha || registro?.date || registro?.fechaVencimiento || registro?.fecha_vencimiento || '').slice(0, 10);
  return String(registro?.fecha || registro?.date || registro?.fechaContable || registro?.fecha_contable || '').slice(0, 10);
}

function estadoRegistro(registro) {
  return normalizarTexto(registro?.estado || registro?.status || '');
}

function cuentaIdsRegistro(registro) {
  const ids = [];
  if (registro?.cuentaId) ids.push(registro.cuentaId);
  if (registro?.cuenta_id) ids.push(registro.cuenta_id);
  if (registro?.asientoCuentaId) ids.push(registro.asientoCuentaId);
  if (Array.isArray(registro?.cuentaIds)) ids.push(...registro.cuentaIds);
  if (Array.isArray(registro?.lineas)) {
    for (const l of registro.lineas) {
      if (l?.cuentaId) ids.push(l.cuentaId);
      if (l?.cuenta_id) ids.push(l.cuenta_id);
    }
  }
  return ids.filter(Boolean);
}

export function limpiarFiltros() {
  return {};
}

export function validarFiltro(filtro = {}) {
  const errores = {};
  const desde = String(filtro.fechaDesde || '').slice(0, 10);
  const hasta = String(filtro.fechaHasta || '').slice(0, 10);
  if (desde && hasta && desde > hasta) errores.fecha = 'La fecha desde no puede ser mayor que la fecha hasta.';
  const min = filtro.montoMin ?? filtro.montoDesde;
  const max = filtro.montoMax ?? filtro.montoHasta;
  const minN = min === '' || min === null || min === undefined ? null : Number(min);
  const maxN = max === '' || max === null || max === undefined ? null : Number(max);
  if (minN !== null && !Number.isFinite(minN)) errores.monto = 'El monto mínimo no es válido.';
  if (maxN !== null && !Number.isFinite(maxN)) errores.monto = 'El monto máximo no es válido.';
  if (minN !== null && maxN !== null && Number.isFinite(minN) && Number.isFinite(maxN) && minN > maxN) {
    errores.monto = 'El monto mínimo no puede ser mayor que el monto máximo.';
  }
  return { valido: Object.keys(errores).length === 0, errores };
}

function filtrarLista(registros, filtro = {}, tipo) {
  const lista = Array.isArray(registros) ? registros : [];
  const validacion = validarFiltro(filtro);
  if (!validacion.valido) return { registros: [], errores: validacion.errores, totalCentavos: 0 };
  const desde = String(filtro.fechaDesde || '').slice(0, 10);
  const hasta = String(filtro.fechaHasta || '').slice(0, 10);
  const cuentaId = String(filtro.cuentaId || filtro.cuenta || '').trim();
  const estado = normalizarTexto(filtro.estado || 'todos');
  const texto = normalizarTexto(filtro.texto || filtro.q || '');
  const min = filtro.montoMin ?? filtro.montoDesde;
  const max = filtro.montoMax ?? filtro.montoHasta;
  const factor = (valor) => (filtro.unidad === 'mxn' ? 100 : (Number.isInteger(Number(valor)) && Math.abs(Number(valor)) >= 100 ? 1 : 100));
  const minCent = min === '' || min === null || min === undefined ? null : Math.round(Number(min) * factor(min));
  const maxCent = max === '' || max === null || max === undefined ? null : Math.round(Number(max) * factor(max));

  const resultado = lista.filter((registro) => {
    const fecha = fechaRegistro(registro, tipo);
    if (desde && (!fecha || fecha < desde)) return false;
    if (hasta && (!fecha || fecha > hasta)) return false;
    if (cuentaId) {
      const cuentas = cuentaIdsRegistro(registro);
      if (!cuentas.includes(cuentaId)) return false;
    }
    if (estado && estado !== 'todos') {
      if (estadoRegistro(registro) !== estado) return false;
    }
    if (minCent !== null && montoCentavosRegistro(registro) < minCent) return false;
    if (maxCent !== null && montoCentavosRegistro(registro) > maxCent) return false;
    if (texto) {
      const campos = [registro.concepto, registro.concept, registro.descripcion, registro.numero, registro.folio, registro.entidadNombre, registro.nombreEntidad, registro.referencia, registro.notas, registro.notes]
        .filter(Boolean).map(normalizarTexto).join(' ');
      if (!campos.includes(texto)) return false;
    }
    return true;
  });
  const totalCentavos = sumarCentavos(resultado.map(montoCentavosRegistro));
  return { registros: resultado, errores: {}, totalCentavos, sinResultados: resultado.length === 0 };
}

export function filtrarAsientos(asientos, filtro = {}) {
  return filtrarLista(asientos, filtro, 'asiento').registros;
}

export function filtrarPagos(pagos, filtro = {}) {
  return filtrarLista(pagos, filtro, 'pago').registros;
}

export function filtrarAsientosDetallado(asientos, filtro = {}) {
  return filtrarLista(asientos, filtro, 'asiento');
}

export function filtrarPagosDetallado(pagos, filtro = {}) {
  return filtrarLista(pagos, filtro, 'pago');
}

export function ordenarPorColumna(registros, columna, sentido = 'asc', tipo = 'texto') {
  const dir = sentido === 'desc' ? -1 : 1;
  const copia = [...(Array.isArray(registros) ? registros : [])];
  copia.sort((a, b) => {
    let va = a?.[columna];
    let vb = b?.[columna];
    if (tipo === 'numero') return ((Number(va) || 0) - (Number(vb) || 0)) * dir;
    if (tipo === 'fecha') return String(va || '').localeCompare(String(vb || '')) * dir;
    return normalizarTexto(va).localeCompare(normalizarTexto(vb), 'es', { sensitivity: 'base' }) * dir;
  });
  return copia;
}
