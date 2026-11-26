import { loadAsientos, loadLineas, loadCuentas, loadPeriodos } from './almacenamiento.js';
import { periodoContieneFecha } from './fechas.js';
import { sumarCentavos } from './dinero.js';

const TIPOS_VALIDOS = new Set(['activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto']);

function num(valor) {
  return Number(valor) || 0;
}

function texto(valor) {
  return String(valor ?? '');
}

function ordenarCuentas(lista) {
  return [...lista].sort((a, b) => {
    const porCodigo = texto(a.code ?? a.codigo).localeCompare(texto(b.code ?? b.codigo), 'es', { numeric: true });
    if (porCodigo !== 0) return porCodigo;
    return texto(a.id).localeCompare(texto(b.id), 'es', { numeric: true });
  });
}

function ordenarAsientos(lista) {
  return [...lista].sort((a, b) => {
    const porFecha = texto(a.date).localeCompare(texto(b.date));
    if (porFecha !== 0) return porFecha;
    const porSerie = texto(a.series).localeCompare(texto(b.series));
    if (porSerie !== 0) return porSerie;
    const porFolio = num(a.folio) - num(b.folio);
    if (porFolio !== 0) return porFolio;
    return texto(a.id).localeCompare(texto(b.id));
  });
}

function resolverPeriodo(periodo) {
  if (!periodo) return null;
  if (typeof periodo === 'string') {
    return loadPeriodos().find((p) => p.id === periodo) || { id: periodo };
  }
  return periodo;
}

function inicioPeriodo(periodo) {
  return texto(periodo?.startDate ?? periodo?.start_date);
}

function finPeriodo(periodo) {
  return texto(periodo?.endDate ?? periodo?.end_date);
}

function etiquetaPeriodo(periodo) {
  if (!periodo) return '';
  if (typeof periodo === 'string') return periodo;
  return texto(periodo.name ?? periodo.etiqueta ?? periodo.id);
}

function idPeriodo(periodo) {
  if (!periodo) return null;
  if (typeof periodo === 'string') return periodo;
  return periodo.id ?? null;
}

function asientoEnPeriodo(asiento, periodo) {
  if (!periodo) return true;
  const inicio = inicioPeriodo(periodo);
  const fin = finPeriodo(periodo);
  if (inicio && fin && /^\d{4}-\d{2}-\d{2}$/.test(texto(asiento.date))) {
    return periodoContieneFecha(periodo, asiento.date);
  }
  if (periodo.id) return !asiento.period_id || asiento.period_id === periodo.id;
  return true;
}

function asientoAnterior(asiento, periodo) {
  if (!periodo) return false;
  const inicio = inicioPeriodo(periodo);
  if (inicio && asiento.date) return texto(asiento.date) < inicio;
  if (periodo.id) return asiento.period_id !== periodo.id;
  return false;
}

function normalizarLinea(linea, asiento = null) {
  return {
    asiento_id: linea.asiento_id ?? linea.asientoId ?? asiento?.id ?? null,
    cuenta_id: linea.cuenta_id ?? linea.cuentaId ?? null,
    debit: num(linea.debit ?? linea.debitCentavos ?? linea.debe),
    credit: num(linea.credit ?? linea.creditCentavos ?? linea.haber),
    concept: texto(linea.concept ?? linea.concepto ?? asiento?.concept)
  };
}

function lineasDeAsientos(asientos, externas = null) {
  if (Array.isArray(externas)) {
    const ids = new Set(asientos.map((a) => a.id));
    return externas
      .filter((linea) => ids.has(linea.asiento_id ?? linea.asientoId))
      .map((linea) => normalizarLinea(linea));
  }
  const incrustadas = [];
  for (const asiento of asientos) {
    const propias = asiento.lineas ?? asiento.lines ?? [];
    for (const linea of propias) incrustadas.push(normalizarLinea(linea, asiento));
  }
  if (incrustadas.length > 0) return incrustadas;
  const ids = new Set(asientos.map((a) => a.id));
  return loadLineas()
    .filter((linea) => ids.has(linea.asiento_id))
    .map((linea) => normalizarLinea(linea));
}

function asientosAprobados(asientos) {
  return asientos.filter((a) => a.status === 'aprobado');
}

export function asientosAprobadosDelPeriodo(periodoId = null, asientos = null) {
  const lista = Array.isArray(asientos) ? asientos : loadAsientos();
  const aprobados = asientosAprobados(lista);
  if (!periodoId) return ordenarAsientos(aprobados);
  const periodo = resolverPeriodo(periodoId);
  return ordenarAsientos(aprobados.filter((a) => asientoEnPeriodo(a, periodo)));
}

const cacheResumen = new Map();

export function calcularResumen(periodoId = null) {
  const clave = `${texto(periodoId) || '*'}:${JSON.stringify([loadAsientos(), loadLineas(), loadCuentas()])}`;
  if (cacheResumen.has(clave)) return cacheResumen.get(clave);
  const asientos = asientosAprobadosDelPeriodo(periodoId);
  const lineas = lineasDeAsientos(asientos);
  const cuentas = new Map(loadCuentas().map((c) => [c.id, c]));
  const ingresosDetalle = [];
  const gastosDetalle = [];
  const debitos = [];
  const creditos = [];

  for (const linea of lineas) {
    const cuenta = cuentas.get(linea.cuenta_id);
    debitos.push(linea.debit);
    creditos.push(linea.credit);
    if (!cuenta) continue;
    if (cuenta.type === 'ingreso') {
      ingresosDetalle.push(sumarCentavos([linea.credit, -linea.debit]));
    } else if (cuenta.type === 'gasto') {
      gastosDetalle.push(sumarCentavos([linea.debit, -linea.credit]));
    }
  }

  const ingresos = sumarCentavos(ingresosDetalle);
  const gastos = sumarCentavos(gastosDetalle);
  const totalDebit = sumarCentavos(debitos);
  const totalCredit = sumarCentavos(creditos);

  const resultado = {
    periodoId: periodoId || null,
    ingresos,
    gastos,
    resultado: sumarCentavos([ingresos, -gastos]),
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
  const lineas = lineasDeAsientos(asientos);
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
      debit: linea.debit,
      credit: linea.credit,
      status: asiento.status
    });
  }

  movimientos.sort((a, b) => {
    const porFecha = texto(a.date).localeCompare(texto(b.date));
    if (porFecha !== 0) return porFecha;
    const porSerie = texto(a.series).localeCompare(texto(b.series));
    if (porSerie !== 0) return porSerie;
    const porFolio = num(a.folio) - num(b.folio);
    if (porFolio !== 0) return porFolio;
    const porCuenta = texto(a.accountCode).localeCompare(texto(b.accountCode), 'es', { numeric: true });
    if (porCuenta !== 0) return porCuenta;
    return texto(a.asientoId).localeCompare(texto(b.asientoId));
  });

  const totalDebit = sumarCentavos(movimientos.map((m) => m.debit));
  const totalCredit = sumarCentavos(movimientos.map((m) => m.credit));

  return {
    periodoId: periodoId || null,
    movimientos,
    totalDebit,
    totalCredit,
    vacio: movimientos.length === 0
  };
}

export function calcularSaldosCuentas(arg1 = null, arg2 = null, fechaLimite = null, cuentasBase = null) {
  if (Array.isArray(arg1)) {
    const cuentas = ordenarCuentas(arg1);
    const listaAsientos = Array.isArray(arg2) ? arg2 : loadAsientos();
    const limite = fechaLimite ? texto(fechaLimite).slice(0, 10) : '';
    const aprobados = listaAsientos.filter((a) => a.status === 'aprobado' && (!limite || texto(a.date) <= limite));
    const lineas = lineasDeAsientos(aprobados);
    const base = new Map();
    if (Array.isArray(cuentasBase)) {
      for (const cuenta of cuentasBase) base.set(cuenta.id ?? cuenta.cuentaId, cuenta);
    } else if (cuentasBase && typeof cuentasBase === 'object') {
      for (const [id, valor] of Object.entries(cuentasBase)) {
        base.set(id, typeof valor === 'number' ? { saldo: valor } : valor);
      }
    }
    const saldos = new Map(cuentas.map((c) => [c.id, num(base.get(c.id)?.saldo ?? base.get(c.id)?.saldoCentavos)]));
    for (const linea of lineas) {
      if (!saldos.has(linea.cuenta_id)) continue;
    saldos.set(linea.cuenta_id, sumarCentavos([saldos.get(linea.cuenta_id), linea.debit, -linea.credit]));
    }
    return cuentas.map((cuenta) => ({ ...cuenta, saldo: saldos.get(cuenta.id) || 0 }));
  }

  const periodoId = arg1;
  const asientos = asientosAprobadosDelPeriodo(periodoId);
  const lineas = lineasDeAsientos(asientos);
  const cuentas = loadCuentas();
  const saldos = new Map(cuentas.map((c) => [c.id, 0]));
  for (const linea of lineas) {
    if (!saldos.has(linea.cuenta_id)) continue;
    saldos.set(linea.cuenta_id, sumarCentavos([saldos.get(linea.cuenta_id), linea.debit, -linea.credit]));
  }
  return cuentas
    .map((cuenta) => ({ ...cuenta, saldo: saldos.get(cuenta.id) || 0 }))
    .sort((a, b) => texto(a.code).localeCompare(texto(b.code), 'es', { numeric: true }));
}

export function calcularGastosPorCuenta(periodoId = null, opciones = {}) {
  const cuentas = ordenarCuentas(opciones.cuentas ?? loadCuentas());
  const listaAsientos = Array.isArray(opciones.asientos) ? opciones.asientos : loadAsientos();
  const periodo = resolverPeriodo(periodoId);
  const aprobados = listaAsientos.filter(
    (asiento) => asiento.status === 'aprobado' && asientoEnPeriodo(asiento, periodo)
  );
  const lineas = lineasDeAsientos(aprobados, opciones.lineas ?? null);
  const cuentasPorId = new Map(cuentas.map((cuenta) => [cuenta.id ?? cuenta.cuentaId, cuenta]));
  const porCuenta = new Map();

  for (const linea of lineas) {
    const cuenta = cuentasPorId.get(linea.cuenta_id);
    if (cuenta?.type !== 'gasto') continue;
    const gasto = sumarCentavos([linea.debit, -linea.credit]);
    if (gasto <= 0) continue;
    const id = cuenta.id ?? cuenta.cuentaId;
    porCuenta.set(id, sumarCentavos([porCuenta.get(id) || 0, gasto]));
  }

  const filas = [...porCuenta.entries()].map(([id, gastoCentavos]) => {
    const cuenta = cuentasPorId.get(id);
    return {
      cuentaId: id,
      codigo: texto(cuenta.code ?? cuenta.codigo),
      nombre: texto(cuenta.name ?? cuenta.nombre),
      gastoCentavos
    };
  });
  const total = sumarCentavos(filas.map((fila) => fila.gastoCentavos));

  return filas
    .sort((a, b) => {
      const porGasto = b.gastoCentavos - a.gastoCentavos;
      if (porGasto !== 0) return porGasto;
      const porCodigo = a.codigo.localeCompare(b.codigo, 'es', { numeric: true });
      return porCodigo !== 0 ? porCodigo : a.cuentaId.localeCompare(b.cuentaId);
    })
    .map((fila) => ({
      ...fila,
      porcentaje: total === 0 ? 0 : Math.round((fila.gastoCentavos / total) * 1000) / 10
    }));
}

function sumarPorCuenta(lineas) {
  const mapa = new Map();
  for (const linea of lineas) {
    if (!linea.cuenta_id) continue;
    const actual = mapa.get(linea.cuenta_id) || { debitos: 0, creditos: 0 };
    actual.debitos = sumarCentavos([actual.debitos, linea.debit]);
    actual.creditos = sumarCentavos([actual.creditos, linea.credit]);
    mapa.set(linea.cuenta_id, actual);
  }
  return mapa;
}

function contextoReporte(periodo, cuentas = null, asientos = null, lineas = null) {
  const periodoResuelto = resolverPeriodo(periodo);
  const listaCuentas = ordenarCuentas(Array.isArray(cuentas) ? cuentas : loadCuentas());
  const listaAsientos = Array.isArray(asientos) ? asientos : loadAsientos();
  const aprobados = listaAsientos.filter((a) => a.status === 'aprobado');
  const actuales = aprobados.filter((a) => asientoEnPeriodo(a, periodoResuelto));
  const anteriores = aprobados.filter((a) => asientoAnterior(a, periodoResuelto));
  const lineasActuales = lineasDeAsientos(actuales, lineas);
  const lineasAnteriores = lineasDeAsientos(anteriores, lineas);
  const movimientos = sumarPorCuenta(lineasActuales);
  const initialization = sumarPorCuenta(lineasAnteriores);
  const cuentasPorId = new Map(listaCuentas.map((c) => [c.id, c]));
  const conMovimientoAnterior = new Set(lineasAnteriores.map((l) => l.cuenta_id));

  const filas = listaCuentas.map((cuenta) => {
    const anterior = initialization.get(cuenta.id) || { debitos: 0, creditos: 0 };
    const movimiento = movimientos.get(cuenta.id) || { debitos: 0, creditos: 0 };
    const saldoInicial = conMovimientoAnterior.has(cuenta.id)
      ? sumarCentavos([anterior.debitos, -anterior.creditos])
      : num(cuenta.saldoInicial ?? cuenta.saldoInicialCentavos);
    const saldoFinal = sumarCentavos([saldoInicial, movimiento.debitos, -movimiento.creditos]);
    return {
      cuentaId: cuenta.id,
      codigo: texto(cuenta.code ?? cuenta.codigo),
      nombre: texto(cuenta.name ?? cuenta.nombre),
      tipo: texto(cuenta.type ?? cuenta.tipo),
      saldoInicial,
      debitos: movimiento.debitos,
      creditos: movimiento.creditos,
      saldoFinal
    };
  }).filter((fila) => fila.saldoInicial !== 0 || fila.debitos !== 0 || fila.creditos !== 0 || fila.saldoFinal !== 0);

  const totales = {
    debitos: sumarCentavos(filas.map((fila) => fila.debitos)),
    creditos: sumarCentavos(filas.map((fila) => fila.creditos))
  };

  return {
    periodo: periodoResuelto,
    etiqueta: etiquetaPeriodo(periodoResuelto),
    periodoId: idPeriodo(periodoResuelto),
    cuentas: listaCuentas,
    cuentasPorId,
    filas,
    totales,
    aprobados,
    lineas
  };
}

function cuentasInvalidas(ctx, filas) {
  const vistas = new Set(filas.map((fila) => fila.cuentaId));
  return ctx.cuentas.filter((cuenta) => vistas.has(cuenta.id) && !TIPOS_VALIDOS.has(texto(cuenta.type ?? cuenta.tipo)));
}

function erroresDeCuentasInvalidas(cuentas) {
  return cuentas.map((cuenta) => `La cuenta ${texto(cuenta.code ?? cuenta.codigo ?? cuenta.id)} (${texto(cuenta.name ?? cuenta.nombre ?? 'sin nombre')}) no tiene un tipo válido.`);
}

export function validarBalanceCuadrado(debitos, creditos) {
  return num(debitos) === num(creditos);
}

export function revisionBalanceCuadrado(debitos, creditos) {
  const debe = num(debitos);
  const haber = num(creditos);
  return { valido: debe === haber, diferencia: sumarCentavos([debe, -haber]) };
}

export function libroMayor(periodo, cuentas = null, asientos = null, lineas = null) {
  const ctx = contextoReporte(periodo, cuentas, asientos, lineas);
  const errores = [];
  if (!validarBalanceCuadrado(ctx.totales.debitos, ctx.totales.creditos)) {
    errores.push('El libro mayor no cuadra: los débitos y créditos del periodo son diferentes.');
  }
  errores.push(...erroresDeCuentasInvalidas(cuentasInvalidas(ctx, ctx.filas)));
  return {
    periodo: ctx.etiqueta,
    periodoId: ctx.periodoId,
    cuentas: ctx.filas.map(({ cuentaId, codigo, nombre, saldoInicial, debitos, creditos, saldoFinal }) => ({
      cuentaId, codigo, nombre, saldoInicial, debitos, creditos, saldoFinal
    })),
    totales: { ...ctx.totales },
    valido: errores.length === 0,
    errores,
    advertencias: [...errores],
    vacio: ctx.filas.length === 0
  };
}

export function balanceComprobacion(periodo, cuentas = null, asientos = null, lineas = null) {
  const ctx = contextoReporte(periodo, cuentas, asientos, lineas);
  const saldos = ctx.filas.map((fila) => ({
    cuentaId: fila.cuentaId,
    codigo: fila.codigo,
    nombre: fila.nombre,
    saldoDeudor: fila.saldoFinal > 0 ? fila.saldoFinal : 0,
    saldoAcreedor: fila.saldoFinal < 0 ? -fila.saldoFinal : 0
  })).filter((fila) => fila.saldoDeudor !== 0 || fila.saldoAcreedor !== 0);
  const totalDeudor = sumarCentavos(saldos.map((fila) => fila.saldoDeudor));
  const totalAcreedor = sumarCentavos(saldos.map((fila) => fila.saldoAcreedor));
  const errores = [];
  if (!validarBalanceCuadrado(totalDeudor, totalAcreedor)) {
    errores.push('El balance de comprobación no cuadra: los totales deudores y acreedores son diferentes.');
  }
  errores.push(...erroresDeCuentasInvalidas(cuentasInvalidas(ctx, ctx.filas)));
  return {
    periodo: ctx.etiqueta,
    periodoId: ctx.periodoId,
    saldos,
    totalDeudor,
    totalAcreedor,
    valido: errores.length === 0,
    errores,
    advertencias: [...errores],
    vacio: saldos.length === 0
  };
}

export function estadoResultados(periodo, cuentas = null, asientos = null, lineas = null) {
  const ctx = contextoReporte(periodo, cuentas, asientos, lineas);
  const filas = ctx.filas.filter((fila) => fila.debitos !== 0 || fila.creditos !== 0);
  const detalle = filas.map((fila) => ({
    cuentaId: fila.cuentaId,
    codigo: fila.codigo,
    nombre: fila.nombre,
    tipo: fila.tipo,
    ingresos: fila.tipo === 'ingreso' ? sumarCentavos([fila.creditos, -fila.debitos]) : 0,
    gastos: fila.tipo === 'gasto' ? sumarCentavos([fila.debitos, -fila.creditos]) : 0
  }));
  const ingresos = sumarCentavos(detalle.map((fila) => fila.ingresos));
  const gastos = sumarCentavos(detalle.map((fila) => fila.gastos));
  const errores = erroresDeCuentasInvalidas(cuentasInvalidas(ctx, filas));
  return {
    periodo: ctx.etiqueta,
    periodoId: ctx.periodoId,
    ingresos,
    gastos,
    resultado: sumarCentavos([ingresos, -gastos]),
    detalle,
    valido: errores.length === 0,
    errores,
    advertencias: [...errores],
    vacio: detalle.length === 0
  };
}

function resultadoAcumulado(ctx) {
  const fin = finPeriodo(ctx.periodo);
  const asientosHasta = fin
    ? ctx.aprobados.filter((asiento) => texto(asiento.date) <= fin)
    : ctx.aprobados;
  const lineas = lineasDeAsientos(asientosHasta, ctx.lineas);
  const importes = [];
  for (const linea of lineas) {
    const cuenta = ctx.cuentasPorId.get(linea.cuenta_id);
    if (!cuenta) continue;
    const tipo = texto(cuenta.type ?? cuenta.tipo);
    if (tipo === 'ingreso') importes.push(sumarCentavos([linea.credit, -linea.debit]));
    if (tipo === 'gasto') importes.push(sumarCentavos([-linea.debit, linea.credit]));
  }
  return sumarCentavos(importes);
}

export function balanceGeneral(periodo, cuentas = null, asientos = null, lineas = null) {
  const ctx = contextoReporte(periodo, cuentas, asientos, lineas);
  const activos = sumarCentavos(ctx.filas
    .filter((fila) => fila.tipo === 'activo')
    .map((fila) => fila.saldoFinal));
  const pasivos = sumarCentavos(ctx.filas
    .filter((fila) => fila.tipo === 'pasivo')
    .map((fila) => -fila.saldoFinal));
  const patrimonioCuentas = sumarCentavos(ctx.filas
    .filter((fila) => fila.tipo === 'patrimonio')
    .map((fila) => -fila.saldoFinal));
  const acumulado = resultadoAcumulado(ctx);
  const patrimonio = sumarCentavos([patrimonioCuentas, acumulado]);
  const errores = erroresDeCuentasInvalidas(cuentasInvalidas(ctx, ctx.filas));
  if (!validarBalanceCuadrado(activos, sumarCentavos([pasivos, patrimonio]))) {
    errores.push('El balance general no cuadra: los activos son diferentes a pasivos más patrimonio.');
  }
  return {
    periodo: ctx.etiqueta,
    periodoId: ctx.periodoId,
    activos,
    pasivos,
    patrimonio,
    resultadoAcumulado: acumulado,
    valido: errores.length === 0,
    errores,
    advertencias: [...errores],
    vacio: ctx.filas.length === 0
  };
}

export const generarLibroMayor = libroMayor;
export const generarBalanceComprobacion = balanceComprobacion;
export const generarEstadoResultados = estadoResultados;
export const generarBalanceGeneral = balanceGeneral;

export function obtenerReportesFinancieros(periodoId = null, opciones = {}) {
  const periodo = resolverPeriodo(periodoId);
  const cuentas = Array.isArray(opciones.cuentas) ? opciones.cuentas : loadCuentas();
  const asientos = Array.isArray(opciones.asientos) ? opciones.asientos : loadAsientos();
  const lineas = Array.isArray(opciones.lineas) ? opciones.lineas : null;
  const identificador = idPeriodo(periodo);
  const movimientos = opciones.resultado || obtenerMovimientos(identificador);
  const estados = {
    libroMayor: libroMayor(periodo, cuentas, asientos, lineas),
    balanceComprobacion: balanceComprobacion(periodo, cuentas, asientos, lineas),
    estadoResultados: estadoResultados(periodo, cuentas, asientos, lineas),
    balanceGeneral: balanceGeneral(periodo, cuentas, asientos, lineas)
  };
  return {
    periodo: etiquetaPeriodo(periodo),
    periodoId: identificador,
    movimientos,
    estados,
    ...estados
  };
}

export const construirReportesDelPeriodo = obtenerReportesFinancieros;

export function movimientosDeCuenta(cuentaId, periodoId = null) {
  return obtenerMovimientos(periodoId).movimientos.filter((m) => m.cuenta_id === cuentaId);
}

export function periodosDisponibles() {
  return [...loadPeriodos()].sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
}

export function obtenerSeriesDashboard(periodos = periodosDisponibles(), periodoId = null) {
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
    resultadoCentavos: sumarCentavos([punto.ingresosCentavos, -punto.gastosCentavos])
  }));
  const distribucion = calcularGastosPorCuenta(periodoId);
  return {
    ingresosGastos,
    resultado,
    distribucion,
    vacio: ingresosGastos.every((punto) => punto.ingresosCentavos === 0 && punto.gastosCentavos === 0)
  };
}
