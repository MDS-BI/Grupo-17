import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad } from '../../../src/contabilidad/almacenamiento.js';
import { obtenerSeriesDashboard, periodosDisponibles } from '../../../src/contabilidad/reportes.js';

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
    expect(series.ingresosGastos).toHaveLength(4);
    expect(series.resultado).toHaveLength(4);
    expect(series.vacio).toBe(false);
  });

  it('distribuye los gastos por cuenta con porcentajes', () => {
    const series = obtenerSeriesDashboard(periodosDisponibles());
    expect(series.distribucion.length).toBeGreaterThan(0);
    expect(series.distribucion[0].gastoCentavos).toBeGreaterThan(0);
    expect(series.distribucion[0].porcentaje).toBeGreaterThan(0);
  });
});
