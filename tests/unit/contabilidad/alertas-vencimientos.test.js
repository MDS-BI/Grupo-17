import { describe, it, expect } from 'vitest';
import { clasificarAlertaPago, alertasDeVencimientos } from '../../../src/contabilidad/alertas-vencimientos.js';

describe('alertas-vencimientos', () => {
  it('clasifica pagos pendientes vencidos y de la semana', () => {
    const ref = new Date('2026-03-10T12:00:00');
    expect(clasificarAlertaPago({ estado: 'pendiente', fechaVencimiento: '2026-03-01' }, ref)).toBe('vencido');
    expect(clasificarAlertaPago({ estado: 'pendiente', fechaVencimiento: '2026-03-11' }, ref)).toBe('venceEstaSemana');
    expect(clasificarAlertaPago({ estado: 'pendiente', fechaVencimiento: '2026-03-20' }, ref)).toBe('pendiente');
  });

  it('prioriza anulado y pagado sobre vencimiento', () => {
    const ref = new Date('2026-03-10T12:00:00');
    expect(clasificarAlertaPago({ estado: 'anulado', fechaVencimiento: '2026-03-01' }, ref)).toBe('anulado');
    expect(clasificarAlertaPago({ estado: 'pagado', fechaVencimiento: '2026-03-01' }, ref)).toBe('pagado');
  });

  it('agrupa alertas por severidad con totales', () => {
    const pagos = [
      { id: 'p1', entidadId: 'e1', montoCentavos: 1000, estado: 'pendiente', fechaVencimiento: '2026-03-01' },
      { id: 'p2', entidadId: 'e1', montoCentavos: 2000, estado: 'pendiente', fechaVencimiento: '2026-03-12' },
      { id: 'p3', entidadId: 'e2', montoCentavos: 500, estado: 'pagado', fechaVencimiento: '2026-03-01' }
    ];
    const entidades = [{ id: 'e1', nombre: 'Cliente Uno' }, { id: 'e2', nombre: 'Cliente Dos' }];
    const resultado = alertasDeVencimientos(pagos, entidades, new Date('2026-03-10T12:00:00'));
    expect(resultado.vencido.cantidad).toBe(1);
    expect(resultado.vencido.totalCentavos).toBe(1000);
    expect(resultado.venceEstaSemana.cantidad).toBe(1);
    expect(resultado.vencido.detalles[0].entidad).toBe('Cliente Uno');
  });
});
