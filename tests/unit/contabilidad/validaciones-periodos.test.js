import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { validarPeriodo } from '../../../src/contabilidad/validaciones-periodos.js';
import { crearPeriodo, listarPeriodos, cambiarEstadoPeriodo, eliminarPeriodo } from '../../../src/contabilidad/periodos.js';
import { inicializarContabilidad, loadAsientos } from '../../../src/contabilidad/almacenamiento.js';

function periodoBase(cambios = {}){
  return {
    name: '2026-12',
    startDate: '2026-12-01',
    endDate: '2026-12-31',
    status: 'abierto',
    ...cambios
  };
}

describe('validación de periodos contables', () => {
  it('acepta un periodo con fechas válidas y ordenadas', () => {
    const revision = validarPeriodo(periodoBase());
    expect(revision.valido).toBe(true);
  });

  it('rechaza fechas inválidas, invertidas y nombres duplicados', () => {
    const invalido = validarPeriodo(periodoBase({ startDate: '2026-13-01' }));
    expect(invalido.errores.startDate).toContain('válida');

    const invertido = validarPeriodo(periodoBase({ startDate: '2026-12-31', endDate: '2026-12-01' }));
    expect(invertido.errores.endDate).toContain('posterior');

    const igual = validarPeriodo(periodoBase({ startDate: '2026-12-01', endDate: '2026-12-01' }));
    expect(igual.errores.endDate).toContain('posterior');

    const periodos = [{ id: 'per-1', name: '2026-12', startDate: '2026-12-01', endDate: '2026-12-31' }];
    const duplicado = validarPeriodo(periodoBase(), { periodos });
    expect(duplicado.errores.name).toContain('Ya existe');
  });

  it('impide periodos solapados sin importar su estado', () => {
    const periodos = [{ id: 'per-1', name: '2026-12', startDate: '2026-12-01', endDate: '2026-12-31', status: 'cerrado' }];
    const solapado = validarPeriodo(periodoBase({ name: 'Diciembre', startDate: '2026-12-15', endDate: '2027-01-15' }), { periodos });
    expect(solapado.valido).toBe(false);
    expect(solapado.errores.startDate).toContain('superpone');
  });
});

describe('gestión de periodos y bloqueo contable', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    inicializarContabilidad();
  });

  it('crea y cierra un periodo sin opción de reapertura', () => {
    const creado = crearPeriodo(periodoBase());
    expect(listarPeriodos()).toHaveLength(6);

    const cerrado = cambiarEstadoPeriodo(creado.id, 'cerrado');
    expect(cerrado.status).toBe('cerrado');
    expect(() => cambiarEstadoPeriodo(creado.id, 'abierto')).toThrow('no pueden reabrirse');
  });

  it('no elimina un periodo con asientos, lo cierra en su lugar', () => {
    const conAsientos = listarPeriodos().find((p) => p.status === 'abierto' && loadAsientos().some((a) => a.period_id === p.id));
    const resultado = eliminarPeriodo(conAsientos.id);

    expect(resultado.eliminado).toBe(false);
    expect(resultado.cerrado).toBe(true);
    expect(listarPeriodos().find((p) => p.id === conAsientos.id).status).toBe('cerrado');
  });
});
