import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad } from '../../../src/contabilidad/almacenamiento.js';
import { calcularGastosPorCuenta, obtenerSeriesDashboard, periodosDisponibles } from '../../../src/contabilidad/reportes.js';

describe('series del panel financiero', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    globalThis.sessionStorage = almacen;
    inicializarContabilidad({ forzar: true });
  });

  it('expone ingresos, gastos y resultado por periodo', () => {
    const periodos = periodosDisponibles();
    const series = obtenerSeriesDashboard(periodos);
    expect(series.ingresosGastos).toHaveLength(5);
    expect(series.resultado).toHaveLength(5);
    expect(series.vacio).toBe(false);
  });

  it('distribuye los gastos por cuenta con porcentajes', () => {
    const series = obtenerSeriesDashboard(periodosDisponibles());
    expect(series.distribucion.length).toBeGreaterThan(0);
    expect(series.distribucion[0].gastoCentavos).toBeGreaterThan(0);
    expect(series.distribucion[0].porcentaje).toBeGreaterThan(0);
  });

  it('filtra la distribución por el periodo solicitado', () => {
    const periodoId = 'per-2026-11';
    const esperado = calcularGastosPorCuenta(periodoId);
    const series = obtenerSeriesDashboard(periodosDisponibles(), periodoId);
    expect(series.distribucion).toEqual(esperado);
    expect(series.distribucion.map((fila) => fila.cuentaId)).toEqual(esperado.map((fila) => fila.cuentaId));
    expect(series.distribucion.reduce((total, fila) => total + fila.gastoCentavos, 0)).toBeGreaterThan(0);
  });
});
