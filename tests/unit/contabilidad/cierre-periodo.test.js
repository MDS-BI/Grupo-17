import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import {
  inicializarContabilidad,
  loadAsientos,
  loadLineas,
  loadPagos,
  loadPeriodos,
  saveAsientos,
  saveLineas
} from '../../../src/contabilidad/almacenamiento.js';
import { validarCierrePeriodo, MENSAJE_PERIODO_CERRADO } from '../../../src/contabilidad/validaciones-periodos.js';
import {
  crearPeriodo,
  actualizarPeriodo,
  cerrarPeriodo,
  cambiarEstadoPeriodo,
  obtenerPeriodo,
  validarFechasDeEscritura
} from '../../../src/contabilidad/periodos.js';
import { crearAsiento, actualizarAsiento, MENSAJE_PERIODO_CERRADO as MENSAJE_ASIENTOS } from '../../../src/contabilidad/asientos.js';
import { crearPago, actualizarPago, MENSAJE_PERIODO_CERRADO as MENSAJE_PAGOS } from '../../../src/contabilidad/pagos.js';
import { listarEventos } from '../../../src/contabilidad/auditoria.js';

const ADMIN = { usuarioRut: '11.111.111-1', rolId: 'administrador' };
const AUDITOR = { usuarioRut: '44.444.444-4', rolId: 'auditor' };

function datosCierre() {
  return {
    periodos: loadPeriodos(),
    asientos: loadAsientos(),
    lineas: loadLineas(),
    pagos: loadPagos()
  };
}

function asientoValido() {
  return {
    series: 'DI',
    folio: 9100,
    date: '2026-11-05',
    period_id: 'per-2026-11',
    concept: 'Movimiento posterior al cierre',
    lines: [
      { cuenta_id: 'cta-1010', debit: 1000, credit: 0 },
      { cuenta_id: 'cta-4010', debit: 0, credit: 1000 }
    ]
  };
}

function pagoValido() {
  return {
    tipo: 'cobro',
    date: '2026-11-05',
    fechaVencimiento: '2026-11-30',
    entity_id: 'ent-cliente-demo',
    amount: '100.00',
    method: 'transferencia'
  };
}

describe('cierre integral de periodos contables', () => {
  let almacen;

  beforeEach(() => {
    almacen = instalarAlmacen();
    almacen.clear();
    inicializarContabilidad();
  });

  it('valida el cierre de un periodo sin inconsistencias', () => {
    const revision = validarCierrePeriodo('per-2026-11', datosCierre());
    expect(revision.valido).toBe(true);
    expect(revision.resumen).toMatchObject({ periodoId: 'per-2026-11', asientos: 1, pagos: 1 });
  });

  it('rechaza el cierre cuando un asiento aprobado no está cuadrado', () => {
    saveAsientos([...loadAsientos(), {
      id: 'asi-deshabilitado',
      series: 'DI',
      folio: 9500,
      date: '2026-11-04',
      period_id: 'per-2026-11',
      concept: 'Asiento desbalanceado',
      status: 'aprobado',
      totalDebit: 100,
      totalCredit: 50
    }]);
    saveLineas([...loadLineas(), {
      id: 'lin-deshabilitado',
      asiento_id: 'asi-deshabilitado',
      cuenta_id: 'cta-1010',
      debit: 100,
      credit: 50
    }]);

    const revision = validarCierrePeriodo('per-2026-11', datosCierre());
    expect(revision.valido).toBe(false);
    expect(revision.errores.asientos).toContain('no está cuadrado');
  });

  it('cierra solo con administrador sin añadir eventos de periodos a la auditoría', () => {
    expect(() => cerrarPeriodo('per-2026-11', AUDITOR)).toThrow('Acceso no disponible');

    const cerrado = cerrarPeriodo('per-2026-11', ADMIN);
    expect(cerrado.status).toBe('cerrado');
    expect(obtenerPeriodo('per-2026-11').status).toBe('cerrado');
    expect(listarEventos({ entidadId: 'per-2026-11' })).toHaveLength(0);
  });

  it('bloquea altas, ediciones y aprobaciones en periodos cerrados', () => {
    cerrarPeriodo('per-2026-11', ADMIN);

    expect(validarFechasDeEscritura(null, '2026-11-05', loadPeriodos()).error).toBe(MENSAJE_PERIODO_CERRADO);
    expect(() => crearAsiento(asientoValido(), { sesion: ADMIN })).toThrow(MENSAJE_ASIENTOS);
    expect(() => crearPago(pagoValido(), { sesion: ADMIN })).toThrow(MENSAJE_PAGOS);
    expect(() => actualizarAsiento('asi-0003', { date: '2026-11-05' }, { sesion: ADMIN })).toThrow(MENSAJE_PERIODO_CERRADO);
    expect(() => actualizarPago('pag-0005', { date: '2026-11-05' }, { sesion: ADMIN })).toThrow(MENSAJE_PERIODO_CERRADO);
  });

  it('no permite reabrir un periodo cerrado', () => {
    cerrarPeriodo('per-2026-11', ADMIN);
    expect(() => cambiarEstadoPeriodo('per-2026-11', 'abierto', { sesion: ADMIN })).toThrow('no pueden reabrirse');
    expect(() => actualizarPeriodo('per-2026-11', { status: 'abierto' }, { sesion: ADMIN })).toThrow('no pueden reabrirse');
    expect(obtenerPeriodo('per-2026-11').status).toBe('cerrado');
    expect(listarEventos({ accion: 'abrir', entidadId: 'per-2026-11' })).toHaveLength(0);
  });

  it('rechaza periodos solapados al crearlos', () => {
    expect(() => crearPeriodo({
      name: '2026-11-duplicado',
      startDate: '2026-11-15',
      endDate: '2026-12-15'
    }, { sesion: ADMIN })).toThrow('superpone');
  });
});
