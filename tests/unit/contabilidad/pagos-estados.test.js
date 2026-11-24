import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad, loadPagos, savePagos } from '../../../src/contabilidad/almacenamiento.js';
import { generarSemilla, generarSemillaBase } from '../../../src/contabilidad/semilla.js';
import {
  calcularEstadoPago,
  esPagoVigente,
  resumirEstadosPago,
  normalizarEstadosHeredados,
  cancelarPago,
  ESTADOS_PAGO_DERIVADOS
} from '../../../src/contabilidad/pagos.js';
import { listarEventos } from '../../../src/contabilidad/auditoria.js';

const HOY = '2026-11-23';
const ADMIN = { usuarioRut: '11.111.111-1', rolId: 'administrador' };

describe('estados derivados de pagos', () => {
  let almacen;

  beforeEach(() => {
    almacen = instalarAlmacen();
    almacen.clear();
    inicializarContabilidad();
  });

  it('aplica la precedencia anulado, pagado, vencido, pendiente', () => {
    expect(calcularEstadoPago({ status: 'pendiente', anulado: true, fechaVencimiento: '2020-01-01' }, HOY)).toBe('anulado');
    expect(calcularEstadoPago({ status: 'pagado', fechaVencimiento: '2020-01-01' }, HOY)).toBe('pagado');
    expect(calcularEstadoPago({ status: 'pendiente', fechaVencimiento: '2026-11-22' }, HOY)).toBe('vencido');
    expect(calcularEstadoPago({ status: 'pendiente', fechaVencimiento: HOY }, HOY)).toBe('pendiente');
    expect(calcularEstadoPago({ status: 'aplicado' }, HOY)).toBe('pagado');
    expect(calcularEstadoPago({ status: 'cancelado' }, HOY)).toBe('anulado');
    expect(esPagoVigente({ status: 'pagado' }, HOY)).toBe(true);
    expect(esPagoVigente({ status: 'cancelado' }, HOY)).toBe(false);
  });

  it('resume cantidades y totales por estado derivado', () => {
    const pagos = [
      { amount: 100, status: 'pendiente', anulado: true },
      { amount: 200, status: 'pagado' },
      { amount: 300, status: 'pendiente', fechaVencimiento: '2020-01-01' },
      { amount: 400, status: 'pendiente', fechaVencimiento: '2026-12-01' }
    ];
    const resumen = resumirEstadosPago(pagos, HOY);
    expect(Object.keys(resumen)).toEqual([...ESTADOS_PAGO_DERIVADOS]);
    expect(resumen.anulado).toEqual({ cantidad: 1, totalCentavos: 100 });
    expect(resumen.pagado).toEqual({ cantidad: 1, totalCentavos: 200 });
    expect(resumen.vencido).toEqual({ cantidad: 1, totalCentavos: 300 });
    expect(resumen.pendiente).toEqual({ cantidad: 1, totalCentavos: 400 });
  });

  it('genera pagos de semilla relativos a la fecha de referencia', () => {
    const datos = generarSemilla({ ...generarSemillaBase(), fechaReferencia: HOY });
    const porId = new Map(datos.pagos.map((pago) => [pago.id, pago]));
    expect(calcularEstadoPago(porId.get('pag-0001'), HOY)).toBe('pagado');
    expect(calcularEstadoPago(porId.get('pag-0005'), HOY)).toBe('pendiente');
    expect(calcularEstadoPago(porId.get('pag-0003'), HOY)).toBe('vencido');
    expect(calcularEstadoPago(porId.get('pag-0004'), HOY)).toBe('anulado');
    expect(calcularEstadoPago(porId.get('pag-0005'), HOY)).toBe('pendiente');
  });

  it('normaliza estados heredados sin perder la anulación', () => {
    const pagos = loadPagos().map((pago) => ({ ...pago }));
    pagos.push({
      ...pagos[0],
      id: 'pag-heredado-pagado',
      numero: 'COB-9001',
      status: 'aplicado',
      anulado: false,
      anuladoEn: undefined
    });
    pagos.push({
      ...pagos[0],
      id: 'pag-heredado-anulado',
      numero: 'COB-9002',
      status: 'cancelado',
      anulado: false,
      anuladoEn: undefined
    });
    savePagos(pagos);

    expect(normalizarEstadosHeredados()).toBe(true);
    const porId = new Map(loadPagos().map((pago) => [pago.id, pago]));
    expect(porId.get('pag-heredado-pagado').status).toBe('pagado');
    expect(porId.get('pag-heredado-anulado')).toMatchObject({ status: 'cancelado', anulado: true });
    expect(calcularEstadoPago(porId.get('pag-heredado-anulado'), HOY)).toBe('anulado');
    expect(normalizarEstadosHeredados()).toBe(false);
  });

  it('conserva la anulación como dato y genera auditoría', () => {
    const anulado = cancelarPago('pag-0005', { sesion: ADMIN });
    expect(anulado.status).toBe('cancelado');
    expect(anulado.anulado).toBe(true);
    expect(anulado.anuladoEn).toBeTruthy();
    expect(calcularEstadoPago(anulado, HOY)).toBe('anulado');
    expect(listarEventos({ accion: 'anular', entidadId: 'pag-0005' })).toHaveLength(1);
    expect(() => cancelarPago('pag-0005', { sesion: ADMIN })).not.toThrow();
    expect(listarEventos({ accion: 'anular', entidadId: 'pag-0005' })).toHaveLength(1);
  });
});
