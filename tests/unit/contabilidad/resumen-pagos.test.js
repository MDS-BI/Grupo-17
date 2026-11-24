import { describe, it, expect } from 'vitest';
import {
  calcularEstadoPago,
  filtrarPagos,
  formatearResumen,
  normalizarEstadoPago,
  resumirPagos
} from '../../../src/contabilidad/resumen-pagos.js';

const HOY = '2026-11-23';

function pago(id, cambios = {}) {
  return {
    id,
    date: '2026-10-01',
    fechaVencimiento: '2026-12-31',
    amount: 10000,
    status: 'pendiente',
    ...cambios
  };
}

describe('resumen de pagos por estado', () => {
  it('normaliza el estado heredado aplicado', () => {
    expect(normalizarEstadoPago({ status: 'aplicado' })).toBe('pagado');
    expect(normalizarEstadoPago({ status: 'pagado' })).toBe('pagado');
  });

  it('deriva pagado, vencido y pendiente', () => {
    expect(calcularEstadoPago(pago('a', { status: 'pagado' }), HOY)).toBe('pagado');
    expect(calcularEstadoPago(pago('b', { fechaVencimiento: '2026-11-01' }), HOY)).toBe('vencido');
    expect(calcularEstadoPago(pago('c', { fechaVencimiento: '2026-12-01' }), HOY)).toBe('pendiente');
  });

  it('excluye los pagos anulados del resumen visible', () => {
    const anulado = pago('anulado', { anulado: true, amount: 45000 });
    expect(calcularEstadoPago(anulado, HOY)).toBe('anulado');
    const resumen = resumirPagos([pago('vigente'), anulado], HOY);
    expect(resumen.pendiente).toEqual({ cantidad: 1, totalCentavos: 10000 });
    expect(filtrarPagos([pago('vigente'), anulado], 'anulado', HOY).map((item) => item.id)).toEqual(['anulado']);
  });

  it('resume cantidades y totales en centavos', () => {
    const resumen = resumirPagos([
      pago('a', { status: 'pagado', amount: 10000 }),
      pago('b', { fechaVencimiento: '2026-11-01', amount: 25000 }),
      pago('c', { amount: 5000 })
    ], HOY);
    expect(resumen.pagado).toEqual({ cantidad: 1, totalCentavos: 10000 });
    expect(resumen.vencido).toEqual({ cantidad: 1, totalCentavos: 25000 });
    expect(resumen.pendiente).toEqual({ cantidad: 1, totalCentavos: 5000 });
  });

  it('filtra por estado y formatea totales', () => {
    const pagos = [
      pago('a', { status: 'pagado' }),
      pago('b', { fechaVencimiento: '2026-11-01' }),
      pago('c')
    ];
    expect(filtrarPagos(pagos, 'vencido', HOY).map((item) => item.id)).toEqual(['b']);
    expect(filtrarPagos(pagos, 'todos', HOY)).toHaveLength(3);
    const resumen = formatearResumen(resumirPagos(pagos, HOY));
    expect(resumen.pagado.total).toContain('100.00');
    expect(resumen.vencido.total).toContain('100.00');
  });
});
