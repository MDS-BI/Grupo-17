import { describe, it, expect } from 'vitest';
import {
  filtrarPagos,
  filtrarAsientos,
  filtrarPagosDetallado,
  filtrarAsientosDetallado,
  validarFiltro,
  limpiarFiltros
} from '../../../src/contabilidad/filtros-movimientos.js';

describe('filtros-movimientos', () => {
  it('valida rango de fechas y montos', () => {
    expect(validarFiltro({ fechaDesde: '2026-03-10', fechaHasta: '2026-03-01' }).valido).toBe(false);
    expect(validarFiltro({ montoMin: 100, montoMax: 50 }).valido).toBe(false);
    expect(validarFiltro({ fechaDesde: '2026-03-01', fechaHasta: '2026-03-10' }).valido).toBe(true);
    expect(validarFiltro({ fechaDesde: '2026-02-30' }).valido).toBe(false);
    expect(validarFiltro({ montoMin: -1 }).valido).toBe(false);
    expect(validarFiltro({ montoMax: 'abc' }).valido).toBe(false);
  });

  it('filtra pagos por estado, cuenta y rango sin mutar', () => {
    const pagos = [
      { id: '1', estado: 'pendiente', cuentaIds: ['c1'], montoCentavos: 1000, fecha: '2026-03-05' },
      { id: '2', estado: 'pagado', cuentaIds: ['c2'], montoCentavos: 2000, fecha: '2026-03-06' }
    ];
    const copia = structuredClone(pagos);
    const resultado = filtrarPagos(pagos, { estado: 'pendiente', cuentaId: 'c1', montoMin: 5, montoMax: 15, fechaDesde: '2026-03-01', fechaHasta: '2026-03-10' });
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

  it('expone la API detallada como contrato canónico', () => {
    const detallado = filtrarAsientosDetallado([{ id: 'a1', fecha: '2026-03-05', montoCentavos: 1000 }], {});
    expect(detallado).toMatchObject({
      registros: [{ id: 'a1' }],
      totalCentavos: 1000,
      sinResultados: false
    });
    expect(filtrarPagosDetallado([], {})).toMatchObject({ registros: [], sinResultados: true });
  });

  it('conserva el listado completo cuando el filtro es inválido', () => {
    const pagos = [
      { id: '1', fecha: '2026-03-05', montoCentavos: 1000, estado: 'pendiente' },
      { id: '2', fecha: '2026-03-06', montoCentavos: 2000, estado: 'pagado' }
    ];
    const detallado = filtrarPagosDetallado(pagos, { fechaDesde: '2026-03-31', fechaHasta: '2026-03-01' });
    expect(detallado.registros).toHaveLength(2);
    expect(detallado.sinResultados).toBe(false);
  });

  it('exige fecha de movimiento y cuentas del asiento relacionado en pagos', () => {
    const pagos = [
      { id: 'con-asiento', fecha: '2026-03-05', cuentaIds: ['c1'], montoCentavos: 1000, estado: 'pendiente' },
      { id: 'solo-vencimiento', fechaVencimiento: '2026-03-05', cuentaId: 'c1', montoCentavos: 1000, estado: 'pendiente' }
    ];
    expect(filtrarPagos(pagos, { cuentaId: 'c1' }).map((pago) => pago.id)).toEqual(['con-asiento']);
    expect(filtrarPagos(pagos, { fechaDesde: '2026-03-01' }).map((pago) => pago.id)).toEqual(['con-asiento']);
  });

  it('convierte montos con la utilidad central de centavos', () => {
    const filtrar = (monto) => filtrarAsientosDetallado(
      [{ id: 'a1', fecha: '2026-03-05', monto }],
      {}
    ).totalCentavos;

    expect(filtrar('1,50')).toBe(150);
    expect(filtrar(10)).toBe(1000);
    expect(filtrar('1.005')).toBe(0);
    expect(filtrar('abc')).toBe(0);
  });

  it('limpiarFiltros devuelve objeto vacío utilizable', () => {
    expect(limpiarFiltros()).toEqual({});
  });
});
