import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { validarAsiento, validarTransicionAsiento } from '../../../src/contabilidad/validaciones-asientos.js';
import { inicializarContabilidad, loadLineas } from '../../../src/contabilidad/almacenamiento.js';
import { actualizarAsiento, obtenerAsiento } from '../../../src/contabilidad/asientos.js';

const cuentas = [
  { id: 'cta-a', code: '1010', name: 'Caja', isLeaf: true, status: 'activa' },
  { id: 'cta-b', code: '4010', name: 'Ventas', isLeaf: true, status: 'activa' }
];
const periodos = [
  { id: 'per-abierto', name: '2026-10', startDate: '2026-10-01', endDate: '2026-10-31', status: 'abierto' },
  { id: 'per-cerrado', name: '2026-09', startDate: '2026-09-01', endDate: '2026-09-30', status: 'cerrado' }
];

function asientoBase(cambios = {}){
  return {
    series: 'DI',
    folio: 1,
    date: '2026-10-10',
    period_id: 'per-abierto',
    concept: 'Venta de prueba',
    lines: [
      { cuenta_id: 'cta-a', debit: '100.00', credit: '' },
      { cuenta_id: 'cta-b', debit: '', credit: '100.00' }
    ],
    ...cambios
  };
}

function validar(payload, opciones = {}){
  return validarAsiento(payload, { cuentas, periodos, ...opciones });
}

describe('validación de asientos contables', () => {
  it('acepta un asiento cuadrado con dos líneas', () => {
    const revision = validar(asientoBase());
    expect(revision.valido).toBe(true);
    expect(revision.totalDebit).toBe(10000);
    expect(revision.totalCredit).toBe(10000);
  });

  it('exige al menos dos líneas y un monto en un solo lado', () => {
    const unaLinea = validar(asientoBase({ lines: [{ cuenta_id: 'cta-a', debit: '100', credit: '' }] }));
    expect(unaLinea.valido).toBe(false);
    expect(unaLinea.errores.lineas).toContain('al menos dos');

    const ambosLados = validar(asientoBase({
      lines: [
        { cuenta_id: 'cta-a', debit: '100', credit: '100' },
        { cuenta_id: 'cta-b', debit: '', credit: '100' }
      ]
    }));
    expect(ambosLados.valido).toBe(false);
    expect(ambosLados.errores.lineasDetalle).toBeDefined();

    const sinMonto = validar(asientoBase({
      lines: [
        { cuenta_id: 'cta-a', debit: '', credit: '' },
        { cuenta_id: 'cta-b', debit: '', credit: '100' }
      ]
    }));
    expect(sinMonto.valido).toBe(false);
  });

  it('rechaza asientos desbalanceados y folios duplicados', () => {
    const desbalanceado = validar(asientoBase({
      lines: [
        { cuenta_id: 'cta-a', debit: '100', credit: '' },
        { cuenta_id: 'cta-b', debit: '', credit: '90' }
      ]
    }));
    expect(desbalanceado.valido).toBe(false);
    expect(desbalanceado.errores.balance).toContain('cuadrado');

    const existente = [{ id: 'otro', series: 'DI', folio: 1 }];
    const duplicado = validar(asientoBase(), { asientos: existente });
    expect(duplicado.valido).toBe(false);
    expect(duplicado.errores.folio).toContain('Ya existe');
  });

  it('bloquea el registro en periodos cerrados y fechas fuera del periodo', () => {
    const cerrado = validar(asientoBase({ date: '2026-09-10', period_id: 'per-cerrado' }));
    expect(cerrado.valido).toBe(false);
    expect(cerrado.errores.period_id).toContain('cerrado');

    const fuera = validar(asientoBase({ date: '2026-11-02' }));
    expect(fuera.valido).toBe(false);
    expect(fuera.errores.date).toContain('dentro del periodo');
  });

  it('solo permite transiciones borrador → aprobado → cancelado', () => {
    expect(validarTransicionAsiento('borrador', 'aprobado').valido).toBe(true);
    expect(validarTransicionAsiento('borrador', 'cancelado').valido).toBe(true);
    expect(validarTransicionAsiento('aprobado', 'cancelado').valido).toBe(true);
    expect(validarTransicionAsiento('aprobado', 'borrador').valido).toBe(false);
    expect(validarTransicionAsiento('cancelado', 'aprobado').valido).toBe(false);
  });
});

describe('recalculo de asientos existentes', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    inicializarContabilidad();
  });

  it('conserva los importes en centavos al editar solo la cabecera', () => {
    const antes = obtenerAsiento('asi-0003');
    expect(antes.totalDebit).toBe(58000);

    const actualizado = actualizarAsiento('asi-0003', { concept: 'Papelería editada' });

    expect(actualizado.totalDebit).toBe(58000);
    expect(actualizado.totalCredit).toBe(58000);
    expect(loadLineas().filter((l) => l.asiento_id === 'asi-0003').map((l) => l.debit))
      .toEqual([58000, 0]);
  });
});
