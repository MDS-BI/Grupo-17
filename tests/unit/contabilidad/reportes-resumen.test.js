import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad } from '../../../src/contabilidad/almacenamiento.js';
import { calcularResumen } from '../../../src/contabilidad/reportes.js';

beforeEach(() => {
  const almacen = instalarAlmacen();
  almacen.clear();
  inicializarContabilidad();
});

describe('resumen financiero', () => {
  it('calcula ingresos, gastos y resultado del periodo con montos en centavos', () => {
    const resumen = calcularResumen('per-2026-10');
    expect(resumen.ingresos).toBe(100000);
    expect(resumen.gastos).toBe(308000);
    expect(resumen.resultado).toBe(-208000);
    expect(resumen.totalDebit).toBe(424000);
    expect(resumen.totalCredit).toBe(424000);
    expect(resumen.movimientos).toBe(3);
    expect(resumen.hayMovimientos).toBe(true);
  });

  it('excluye asientos cancelados del cálculo', () => {
    const septiembre = calcularResumen('per-2026-09');
    expect(septiembre.ingresos).toBe(50000);
    expect(septiembre.gastos).toBe(0);
    expect(septiembre.resultado).toBe(50000);
    expect(septiembre.movimientos).toBe(1);
  });

  it('reporta un periodo sin movimientos como vacío', () => {
    const noviembre = calcularResumen('per-2026-11');
    expect(noviembre.ingresos).toBe(0);
    expect(noviembre.gastos).toBe(0);
    expect(noviembre.resultado).toBe(0);
    expect(noviembre.movimientos).toBe(0);
    expect(noviembre.hayMovimientos).toBe(false);
  });
});
