import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { FECHA_REFERENCIA_SEMILLA, generarSemilla, generarRoles, generarUsuarios, generarSemillaBase, validarSemilla } from '../../../src/contabilidad/semilla.js';
import { calcularEstadoPago } from '../../../src/contabilidad/pagos.js';

describe('semilla de datos de ejemplo', () => {
  let almacen;

  beforeEach(() => {
    almacen = instalarAlmacen();
    almacen.clear();
  });

  it('es determinista', () => {
    const base = generarSemillaBase();
    const primera = JSON.stringify(generarSemilla(base));
    const segunda = JSON.stringify(generarSemilla(base));
    expect(primera).toBe(segunda);
  });

  it('usa una fecha de referencia fija para los vencimientos', () => {
    const datos = generarSemilla(generarSemillaBase());
    expect(FECHA_REFERENCIA_SEMILLA).toBe('2026-10-01');
    expect(datos.pagos.find((pago) => pago.id === 'pag-0003').fechaVencimiento).toBe('2026-09-11');
    expect(datos.pagos.find((pago) => pago.id === 'pag-0004').fechaVencimiento).toBe('2026-11-30');
    expect(datos.pagos.find((pago) => pago.id === 'pag-0005').fechaVencimiento).toBe('2026-10-06');
  });

  it('cumple los mínimos acordados', () => {
    const datos = generarSemilla({ ...generarSemillaBase(), fechaReferencia: '2026-11-23' });
    expect(datos.periodos).toHaveLength(5);
    const cerrados = datos.periodos.filter((periodo) => periodo.status === 'cerrado');
    expect(cerrados.map((periodo) => periodo.id)).toEqual(['per-2026-07', 'per-2026-09']);
    for (const periodo of cerrados) {
      expect(datos.asientos.some((asiento) => asiento.period_id === periodo.id)).toBe(false);
      expect(datos.pagos.some((pago) => pago.date.startsWith(periodo.startDate.slice(0, 7)))).toBe(false);
    }
    expect(datos.cuentas.length).toBeGreaterThanOrEqual(8);
    expect(datos.asientos.filter((asiento) => asiento.status === 'aprobado').length).toBeGreaterThanOrEqual(8);
    expect(datos.pagos.length).toBeGreaterThanOrEqual(4);
    expect(datos.auditoria.length).toBeGreaterThanOrEqual(8);
  });

  it('usa CLP y terminología de IVA chilena en los datos de ejemplo', () => {
    const datos = generarSemilla({ ...generarSemillaBase(), fechaReferencia: '2026-11-23' });
    const base = generarSemillaBase();
    const nombresCuentas = datos.cuentas.map((cuenta) => cuenta.name);
    const monedas = [...datos.asientos, ...datos.pagos, ...base.documentos].map((registro) => registro.currency);

    expect(nombresCuentas).toContain('IVA Crédito Fiscal');
    expect(nombresCuentas).toContain('IVA Débito Fiscal');
    expect([...new Set(monedas)]).toEqual(['CLP']);
  });

  it('genera pagos relativos a la fecha de referencia con estados derivados', () => {
    const hoy = '2026-11-23';
    const datos = generarSemilla({ ...generarSemillaBase(), fechaReferencia: hoy });
    const estados = datos.pagos.map((pago) => calcularEstadoPago(pago, hoy));
    expect(estados).toContain('pagado');
    expect(estados).toContain('vencido');
    expect(estados).toContain('pendiente');
    expect(estados).toContain('anulado');
    expect(datos.pagos.find((pago) => pago.anulado)).toMatchObject({ anulado: true, status: 'pendiente' });
  });

  it('rechaza asientos y pagos ubicados en periodos cerrados', () => {
    const datos = generarSemilla({ ...generarSemillaBase(), fechaReferencia: '2026-11-23' });
    datos.asientos.push({
      id: 'asi-cerrado',
      series: 'DI',
      folio: 9999,
      date: '2026-09-10',
      period_id: 'per-2026-09',
      concept: 'Movimiento en periodo cerrado',
      status: 'aprobado',
      totalDebit: 1000,
      totalCredit: 1000
    });
    datos.pagos.push({
      id: 'pag-cerrado',
      numero: 'PAG-9999',
      date: '2026-09-11',
      fechaVencimiento: '2026-12-11',
      amount: 1000,
      status: 'pendiente'
    });

    const revision = validarSemilla(datos, { fechaReferencia: '2026-11-23' });
    expect(revision.valido).toBe(false);
    expect(revision.errores.some((error) => error.includes('asi-cerrado') && error.includes('cerrado'))).toBe(true);
    expect(revision.errores.some((error) => error.includes('PAG-9999') && error.includes('cerrado'))).toBe(true);
  });

  it('incluye usuarios y roles para los cuatro perfiles', () => {
    expect(generarUsuarios()).toHaveLength(4);
    expect(generarRoles()).toHaveLength(4);
  });
});
