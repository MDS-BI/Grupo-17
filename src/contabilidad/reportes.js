import { loadAsientos, loadLineas, loadCuentas, loadPeriodos } from './almacenamiento.js';

function asientosDelPeriodo(periodoId) {
  return loadAsientos().filter((a) => !periodoId || a.period_id === periodoId);
}

function asientosAprobados(asientos) {
  return asientos.filter((a) => a.status === 'aprobado');
}

export function asientosAprobadosDelPeriodo(periodoId = null) {
  return asientosAprobados(asientosDelPeriodo(periodoId));
}

function lineasDe(asientos) {
  const ids = new Set(asientos.map((a) => a.id));
  return loadLineas().filter((l) => ids.has(l.asiento_id));
}

const cacheResumen = new Map();

export function calcularResumen(periodoId = null) {
  const clave = `${periodoId || '*'}:${JSON.stringify([loadAsientos(), loadLineas(), loadCuentas()])}`;
  if (cacheResumen.has(clave)) return cacheResumen.get(clave);
  const asientos = asientosAprobadosDelPeriodo(periodoId);
  const lineas = lineasDe(asientos);
  const cuentas = new Map(loadCuentas().map((c) => [c.id, c]));
  let ingresos = 0;
  let gastos = 0;
  let totalDebit = 0;
  let totalCredit = 0;

  for (const linea of lineas) {
    const cuenta = cuentas.get(linea.cuenta_id);
    totalDebit += Number(linea.debit) || 0;
    totalCredit += Number(linea.credit) || 0;
    if (!cuenta) continue;
    if (cuenta.type === 'ingreso') {
      ingresos += (Number(linea.credit) || 0) - (Number(linea.debit) || 0);
    } else if (cuenta.type === 'gasto') {
      gastos += (Number(linea.debit) || 0) - (Number(linea.credit) || 0);
    }
  }

  const resultado = {
    periodoId: periodoId || null,
    ingresos,
    gastos,
    resultado: ingresos - gastos,
    totalDebit,
    totalCredit,
    movimientos: asientos.length,
    hayMovimientos: asientos.length > 0
  };
  cacheResumen.set(clave, resultado);
  if (cacheResumen.size > 50) cacheResumen.delete(cacheResumen.keys().next().value);
  return resultado;
}

export function obtenerMovimientos(periodoId = null) {
  const asientos = asientosAprobadosDelPeriodo(periodoId);
  const lineas = lineasDe(asientos);
  const cuentas = new Map(loadCuentas().map((c) => [c.id, c]));
  const asientosPorId = new Map(asientos.map((a) => [a.id, a]));
  const movimientos = [];

  for (const linea of lineas) {
    const asiento = asientosPorId.get(linea.asiento_id);
    const cuenta = cuentas.get(linea.cuenta_id);
    if (!asiento) continue;
    movimientos.push({
      asientoId: asiento.id,
      series: asiento.series,
      folio: asiento.folio,
      date: asiento.date,
      concept: asiento.concept,
      lineConcept: linea.concept || asiento.concept,
      cuenta_id: linea.cuenta_id,
      accountCode: cuenta ? cuenta.code : '',
      accountName: cuenta ? cuenta.name : 'Cuenta desconocida',
      debit: Number(linea.debit) || 0,
      credit: Number(linea.credit) || 0,
      status: asiento.status
    });
  }

  movimientos.sort((a, b) => {
    const porFecha = String(a.date).localeCompare(String(b.date));
    if (porFecha !== 0) return porFecha;
    const porSerie = String(a.series).localeCompare(String(b.series));
    if (porSerie !== 0) return porSerie;
    const porFolio = Number(a.folio) - Number(b.folio);
    if (porFolio !== 0) return porFolio;
    return String(a.accountCode).localeCompare(String(b.accountCode));
  });

  const totalDebit = movimientos.reduce((total, m) => total + m.debit, 0);
  const totalCredit = movimientos.reduce((total, m) => total + m.credit, 0);

  return {
    periodoId: periodoId || null,
    movimientos,
    totalDebit,
    totalCredit,
    vacio: movimientos.length === 0
  };
}

export function calcularSaldosCuentas(periodoId = null) {
  const asientos = asientosAprobadosDelPeriodo(periodoId);
  const lineas = lineasDe(asientos);
  const cuentas = loadCuentas();
  const saldos = new Map(cuentas.map((c) => [c.id, 0]));
  for (const linea of lineas) {
    if (!saldos.has(linea.cuenta_id)) continue;
    saldos.set(linea.cuenta_id, saldos.get(linea.cuenta_id) + (Number(linea.debit) || 0) - (Number(linea.credit) || 0));
  }
  return cuentas
    .map((cuenta) => ({ ...cuenta, saldo: saldos.get(cuenta.id) || 0 }))
    .sort((a, b) => String(a.code).localeCompare(String(b.code), 'es', { numeric: true }));
}

export function movimientosDeCuenta(cuentaId, periodoId = null) {
  return obtenerMovimientos(periodoId).movimientos.filter((m) => m.cuenta_id === cuentaId);
}

export function periodosDisponibles() {
  return [...loadPeriodos()].sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
}

export function obtenerSeriesDashboard(periodos = periodosDisponibles()) {
  const ingresosGastos = periodos.map((periodo) => {
    const resumen = calcularResumen(periodo.id);
    return {
      periodoId: periodo.id,
      periodo: periodo.name,
      ingresosCentavos: resumen.ingresos,
      gastosCentavos: resumen.gastos
    };
  });
  const resultado = ingresosGastos.map((punto) => ({
    periodoId: punto.periodoId,
    periodo: punto.periodo,
    resultadoCentavos: punto.ingresosCentavos - punto.gastosCentavos
  }));
  const distribucion = calcularSaldosCuentas()
    .filter((cuenta) => cuenta.type === 'gasto' && cuenta.saldo > 0)
    .map((cuenta) => ({
      cuentaId: cuenta.id,
      codigo: cuenta.code,
      nombre: cuenta.name,
      gastoCentavos: cuenta.saldo
    }))
    .sort((a, b) => b.gastoCentavos - a.gastoCentavos);
  const totalGastos = distribucion.reduce((total, cuenta) => total + cuenta.gastoCentavos, 0);
  return {
    ingresosGastos,
    resultado,
    distribucion: distribucion.map((cuenta) => ({
      ...cuenta,
      porcentaje: totalGastos === 0 ? 0 : Math.round((cuenta.gastoCentavos / totalGastos) * 1000) / 10
    })),
    vacio: ingresosGastos.every((punto) => punto.ingresosCentavos === 0 && punto.gastosCentavos === 0)
  };
}
