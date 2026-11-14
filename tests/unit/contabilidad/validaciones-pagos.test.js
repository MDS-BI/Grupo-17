import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { validarPago } from '../../../src/contabilidad/validaciones-pagos.js';
import { inicializarContabilidad, loadPagos } from '../../../src/contabilidad/almacenamiento.js';
import { actualizarPago, obtenerPago } from '../../../src/contabilidad/pagos.js';
import { loadEntities } from '../../../src/storage.js';

const entidades = [{ entity_id: 'ent-1', name: 'Cliente' }];
const documentos = [{ id: 'doc-1' }];
const asientos = [{ id: 'asi-1' }];

function pagoBase(cambios = {}){
  return {
    date: '2026-10-10',
    amount: '100.50',
    tipo: 'cobro',
    entity_id: 'ent-1',
    series: 'COB',
    folio: '1',
    status: 'pendiente',
    ...cambios
  };
}

function validar(payload, opciones = {}){
  return validarPago(payload, { entidades, documentos, asientos, ...opciones });
}

describe('validación de pagos y cobros', () => {
  it('acepta un pago válido y convierte el monto a centavos', () => {
    const revision = validar(pagoBase());
    expect(revision.valido).toBe(true);
    expect(revision.centavos).toBe(10050);
    expect(revision.numero).toBe('COB-1');
  });

  it('rechaza montos vacíos, no positivos o con formato inválido', () => {
    expect(validar(pagoBase({ amount: '' })).errores.amount).toContain('obligatorio');
    expect(validar(pagoBase({ amount: '0' })).errores.amount).toContain('mayor que cero');
    expect(validar(pagoBase({ amount: '-5' })).errores.amount).toContain('mayor que cero');
    expect(validar(pagoBase({ amount: '10.999' })).errores.amount).toContain('2 decimales');
  });

  it('rechaza entidades inexistentes y referencias a documentos o asientos inválidos', () => {
    expect(validar(pagoBase({ entity_id: '' })).errores.entity_id).toContain('obligatoria');
    expect(validar(pagoBase({ entity_id: 'ent-x' })).errores.entity_id).toContain('no existe');
    expect(validar(pagoBase({ document_id: 'doc-x' })).errores.document_id).toContain('no existe');
    expect(validar(pagoBase({ asiento_id: 'asi-x' })).errores.asiento_id).toContain('no existe');
  });

  it('impide vincular un asiento ya usado por otro pago y números duplicados', () => {
    const pagos = [
      { id: 'pag-1', numero: 'COB-1', series: 'COB', folio: 1, asiento_id: 'asi-1' }
    ];
    const asientoRepetido = validar(pagoBase({ asiento_id: 'asi-1' }), { pagos });
    expect(asientoRepetido.errores.asiento_id).toContain('vinculado');

    const numeroRepetido = validar(pagoBase(), { pagos });
    expect(numeroRepetido.errores.numero).toContain('Ya existe');
  });

  it('valida el tipo de operación y el método de pago', () => {
    expect(validar(pagoBase({ tipo: 'otro' })).errores.tipo).toContain('cobro');
    expect(validar(pagoBase({ method: 'bitcoin' })).errores.method).toContain('método');
    expect(validar(pagoBase({ method: 'transferencia' })).valido).toBe(true);
  });
});

describe('actualización de pagos existentes', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    inicializarContabilidad();
  });

  it('conserva el monto en centavos al cancelar un pago sin reenviar el importe', () => {
    const entidad = loadEntities()[0];
    const pago = loadPagos().find((p) => p.entity_id === entidad.entity_id);
    const antes = pago.amount;
    expect(antes).toBe(116000);

    const actualizado = actualizarPago(pago.id, { status: 'cancelado' });

    expect(actualizado.amount).toBe(116000);
    expect(obtenerPago(pago.id).status).toBe('cancelado');
  });
});
