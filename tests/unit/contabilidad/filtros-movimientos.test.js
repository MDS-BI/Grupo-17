import { describe, it, expect } from 'vitest';
import { filtrarPagos, filtrarAsientos, validarFiltro, limpiarFiltros } from '../../../src/contabilidad/filtros-movimientos.js';

describe('filtros-movimientos', () => {
  it('valida rango de fechas y montos', () => {
    expect(validarFiltro({ fechaDesde: '2026-03-10', fechaHasta: '2026-03-01' }).valido).toBe(false);
    expect(validarFiltro({ montoMin: 100, montoMax: 50 }).valido).toBe(false);
    expect(validarFiltro({ fechaDesde: '2026-03-01', fechaHasta: '2026-03-10' }).valido).toBe(true);
  });

  it('filtra pagos por estado, cuenta y rango sin mutar', () => {
    const pagos = [
      { id: '1', estado: 'pendiente', cuentaId: 'c1', montoCentavos: 1000, fechaVencimiento: '2026-03-05' },
      { id: '2', estado: 'pagado', cuentaId: 'c2', montoCentavos: 2000, fechaVencimiento: '2026-03-06' }
    ];
    const copia = structuredClone(pagos);
    const resultado = filtrarPagos(pagos, { estado: 'pendiente', cuentaId: 'c1', montoMin: 500, montoMax: 1500, fechaDesde: '2026-03-01', fechaHasta: '2026-03-10' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('1');
    expect(pagos).toEqual(copia);
  });

  it('filtra asientos por texto normalizado y estado', () => {
    const asientos = [
      { id: 'a1', concepto: 'Pago Nómina', estado: 'aprobado', fecha: '2026-03-05', lineas: [{ cuentaId: 'c1', montoCentavos: 1000 }] },
      { id: 'a2', concepto: 'Compra', estado: 'borrador', fecha: '2026-03-06', lineas: [{ cuentaId: 'c2', montoCentavos: 500 }] }
    ];
    const resultado = filtrarAsientos(asientos, { texto: 'nomina', estado: 'aprobado' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('a1');
  });

  it('limpiarFiltros devuelve objeto vacío utilizable', () => {
    expect(limpiarFiltros()).toEqual({});
  });
});
