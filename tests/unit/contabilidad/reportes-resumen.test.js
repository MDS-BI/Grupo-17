import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad, loadAsientos, saveAsientos, loadLineas, saveLineas } from '../../../src/contabilidad/almacenamiento.js';
import { calcularResumen, calcularGastosPorCuenta } from '../../../src/contabilidad/reportes.js';

function vaciarMovimientos(periodoId) {
  const asientos = loadAsientos().filter((asiento) => asiento.period_id !== periodoId);
  const ids = new Set(asientos.map((asiento) => asiento.id));
  saveAsientos(asientos);
  saveLineas(loadLineas().filter((linea) => ids.has(linea.asiento_id)));
}

beforeEach(() => {
  const almacen = instalarAlmacen();
  almacen.clear();
  inicializarContabilidad();
});

describe('resumen financiero', () => {
  it('calcula ingresos, gastos y resultado del periodo con montos en centavos', () => {
    const resumen = calcularResumen('per-2026-10');
    expect(resumen.ingresos).toBe(100000);
    expect(resumen.gastos).toBe(250000);
    expect(resumen.resultado).toBe(-150000);
    expect(resumen.totalDebit).toBe(366000);
    expect(resumen.totalCredit).toBe(366000);
    expect(resumen.movimientos).toBe(2);
    expect(resumen.hayMovimientos).toBe(true);
  });

  it('la distribución por cuenta suma el total de gastos del resumen', () => {
    for (const periodoId of ['per-2026-08', 'per-2026-10', 'per-2026-11']) {
      const filas = calcularGastosPorCuenta(periodoId);
      const total = filas.reduce((acumulado, fila) => acumulado + fila.gastoCentavos, 0);
      expect(total).toBe(calcularResumen(periodoId).gastos);
    }
  });

  it('excluye asientos cancelados del cálculo', () => {
    const agosto = calcularResumen('per-2026-08');
    expect(agosto.ingresos).toBe(240000);
    expect(agosto.gastos).toBe(90000);
    expect(agosto.resultado).toBe(150000);
    expect(agosto.movimientos).toBe(5);
  });

  it('reporta un periodo sin movimientos como vacío', () => {
    const noviembreInicial = calcularResumen('per-2026-11');
    expect(noviembreInicial.hayMovimientos).toBe(true);

    vaciarMovimientos('per-2026-11');
    const noviembre = calcularResumen('per-2026-11');
    expect(noviembre.ingresos).toBe(0);
    expect(noviembre.gastos).toBe(0);
    expect(noviembre.resultado).toBe(0);
    expect(noviembre.movimientos).toBe(0);
    expect(noviembre.hayMovimientos).toBe(false);
  });
});
