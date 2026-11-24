import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { generarSemilla, generarRoles, generarUsuarios, generarSemillaBase } from '../../../src/contabilidad/semilla.js';
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

  it('cumple los mínimos acordados', () => {
    const datos = generarSemilla({ ...generarSemillaBase(), fechaReferencia: '2026-11-23' });
    expect(datos.periodos).toHaveLength(5);
    const cerrados = datos.periodos.filter((periodo) => periodo.status === 'cerrado');
    expect(cerrados.map((periodo) => periodo.id)).toEqual(['per-2026-07', 'per-2026-09']);
    expect(cerrados.some((periodo) => datos.asientos.some((asiento) => asiento.period_id === periodo.id)
      || datos.pagos.some((pago) => pago.date.startsWith(periodo.startDate.slice(0, 7))))).toBe(true);
    expect(cerrados.some((periodo) => !datos.asientos.some((asiento) => asiento.period_id === periodo.id)
      && !datos.pagos.some((pago) => pago.date.startsWith(periodo.startDate.slice(0, 7))))).toBe(true);
    expect(datos.cuentas.length).toBeGreaterThanOrEqual(8);
    expect(datos.asientos.filter((asiento) => asiento.status === 'aprobado').length).toBeGreaterThanOrEqual(8);
    expect(datos.pagos.length).toBeGreaterThanOrEqual(4);
    expect(datos.auditoria.length).toBeGreaterThanOrEqual(8);
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

  it('incluye usuarios y roles para los cuatro perfiles', () => {
    expect(generarUsuarios()).toHaveLength(4);
    expect(generarRoles()).toHaveLength(4);
  });
});
