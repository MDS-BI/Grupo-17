import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad, loadRegistrosActividad, saveRegistrosActividad } from '../../../src/contabilidad/almacenamiento.js';
import {
  registrarEvento,
  listarEventos,
  consultarEventos,
  historialPorMovimiento,
  puedeConsultarAuditoria,
  calcularCambios,
  normalizarCambios
} from '../../../src/contabilidad/auditoria.js';
import { crearAsiento, aprobarAsiento } from '../../../src/contabilidad/asientos.js';
import { crearPago, cancelarPago } from '../../../src/contabilidad/pagos.js';

const ADMIN = { usuarioRut: '11.111.111-1', rolId: 'administrador' };

function asientoValido() {
  return {
    series: 'DI',
    folio: 9001,
    date: '2026-10-16',
    period_id: 'per-2026-10',
    concept: 'Asiento de prueba para auditoría',
    lines: [
      { cuenta_id: 'cta-1010', debit: 1000, credit: 0 },
      { cuenta_id: 'cta-4010', debit: 0, credit: 1000 }
    ]
  };
}

function pagoValido() {
  return {
    tipo: 'cobro',
    date: '2026-10-21',
    fechaVencimiento: '2026-11-30',
    entity_id: 'ent-cliente-demo',
    amount: '100.00',
    method: 'transferencia'
  };
}

describe('registro de auditoría', () => {
  let almacen;

  beforeEach(() => {
    almacen = instalarAlmacen();
    almacen.clear();
    inicializarContabilidad();
  });

  it('normaliza cambios y descarta diferencias vacías', () => {
    expect(calcularCambios({ a: 1, b: 2 }, { a: 1, b: 3 }, ['a', 'b'])).toEqual([
      { campo: 'b', valorAnterior: 2, valorNuevo: 3 }
    ]);
    expect(normalizarCambios({ a: { valorAnterior: 1, valorNuevo: 1 } })).toEqual([]);
  });

  it('registra eventos con actor, cambios y filtros deterministas', () => {
    const evento = registrarEvento({
      id: 'aud-prueba-1',
      timestamp: '2026-11-23T10:00:00.000Z',
      accion: 'editar',
      tipoMovimiento: 'asiento',
      entidad: 'asiento',
      entidadId: 'asi-0001',
      numero: 'DI-1001',
      sesion: ADMIN,
      descripcion: 'Editó el asiento DI-1001',
      cambios: [{ campo: 'concepto', valorAnterior: 'Antes', valorNuevo: 'Después' }]
    });

    expect(evento).toMatchObject({
      id: 'aud-prueba-1',
      timestamp: '2026-11-23T10:00:00.000Z',
      fechaHora: '2026-11-23T10:00:00.000Z',
      accion: 'editar',
      modulo: 'contabilidad',
      entidad: 'asiento',
      tipoMovimiento: 'asiento',
      entidadId: 'asi-0001',
      numero: 'DI-1001',
      rolId: 'administrador'
    });
    expect(evento.usuarioNombre).toBe('Administrador financiero');
    expect(evento.cambios).toHaveLength(1);

    expect(listarEventos({ entidad: 'asiento', accion: 'editar', entidadId: 'asi-0001' })).toEqual([evento]);
    expect(consultarEventos({ fechaDesde: '2026-10-02', fechaHasta: '2026-10-02' })).toHaveLength(0);
    expect(consultarEventos({ fechaDesde: '2026-11-23' })).toHaveLength(1);
    expect(listarEventos()[0].timestamp >= listarEventos()[1].timestamp).toBe(true);
  });

  it('rechaza acciones y tipos ajenos al registro consolidado, evita duplicados de anulación y restringe la consulta', () => {
    expect(registrarEvento({
      accion: 'crear',
      tipoMovimiento: 'periodo',
      entidadId: 'per-2026-11',
      sesion: ADMIN
    })).toBeNull();
    expect(registrarEvento({
      accion: 'cerrar',
      tipoMovimiento: 'asiento',
      entidadId: 'asi-0001',
      sesion: ADMIN
    })).toBeNull();
    expect(registrarEvento({
      accion: 'aprobar',
      tipoMovimiento: 'asiento',
      entidadId: 'asi-0001',
      sesion: ADMIN,
      cambios: [{ campo: 'status', valorAnterior: 'borrador', valorNuevo: 'aprobado' }]
    })).toBeNull();
    expect(registrarEvento({ accion: 'editar', tipoMovimiento: 'asiento' })).toBeNull();

    const primera = registrarEvento({
      accion: 'anular',
      tipoMovimiento: 'pago',
      entidadId: 'pag-temporal',
      sesion: ADMIN
    });
    const duplicada = registrarEvento({
      accion: 'anular',
      tipoMovimiento: 'pago',
      entidadId: 'pag-temporal',
      sesion: ADMIN
    });
    expect(primera).not.toBeNull();
    expect(duplicada).toBeNull();

    expect(puedeConsultarAuditoria({ rolId: 'auditor' })).toBe(true);
    expect(puedeConsultarAuditoria(ADMIN)).toBe(false);

    saveRegistrosActividad([]);
    expect(loadRegistrosActividad()).toEqual([]);
  });

  it('audita el ciclo de vida de asientos y pagos', () => {
    const asiento = crearAsiento(asientoValido(), { sesion: ADMIN });
    aprobarAsiento(asiento.id, { sesion: ADMIN });
    const historialAsiento = historialPorMovimiento('asiento', asiento.id);
    expect(historialAsiento.map((evento) => evento.accion).sort()).toEqual(['crear', 'editar']);
    expect(historialAsiento.every((evento) => evento.entidadId === asiento.id)).toBe(true);
    expect(historialAsiento.every((evento) => evento.usuarioRut === ADMIN.usuarioRut)).toBe(true);

    const pago = crearPago(pagoValido(), { sesion: ADMIN });
    cancelarPago(pago.id, { sesion: ADMIN });
    const historialPago = historialPorMovimiento('pago', pago.id);
    expect(historialPago.map((evento) => evento.accion).sort()).toEqual(['anular', 'crear']);
    expect(historialPago.find((evento) => evento.accion === 'anular').cambios[0]).toMatchObject({ campo: 'estado' });
    expect(historialPago.every((evento) => evento.usuarioRut === ADMIN.usuarioRut)).toBe(true);
  });
});
