import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { validarCuenta, saldoNormalPara } from '../../../src/contabilidad/validaciones-cuentas.js';
import { crearCuenta, listarCuentas, construirArbol } from '../../../src/contabilidad/cuentas.js';

let almacen;

beforeEach(() => {
  almacen = instalarAlmacen();
  almacen.clear();
});

describe('validación de cuentas contables', () => {
  it('acepta una cuenta activa con datos completos', () => {
    const revision = validarCuenta({ code: '1010', name: 'Caja', type: 'activo', status: 'activa' });
    expect(revision.valido).toBe(true);
    expect(revision.errores).toEqual({});
    expect(saldoNormalPara('activo')).toBe('debit');
    expect(saldoNormalPara('ingreso')).toBe('credit');
  });

  it('rechaza códigos duplicados y campos obligatorios vacíos', () => {
    const cuentas = [{ id: 'cta-1', code: '1010', name: 'Caja' }];
    const duplicada = validarCuenta({ code: '1010', name: 'Otra caja', type: 'activo' }, { cuentas });
    expect(duplicada.valido).toBe(false);
    expect(duplicada.errores.code).toContain('Ya existe');

    const vacia = validarCuenta({ code: '', name: '', type: '' });
    expect(vacia.valido).toBe(false);
    expect(vacia.errores.code).toContain('obligatorio');
    expect(vacia.errores.name).toContain('obligatorio');
    expect(vacia.errores.type).toContain('tipo');
  });

  it('impide que una cuenta sea su propia padre o forme ciclos', () => {
    const cuentas = [
      { id: 'cta-a', code: '1', name: 'Activo', type: 'activo', parent_id: null },
      { id: 'cta-b', code: '11', name: 'Corriente', type: 'activo', parent_id: 'cta-a' }
    ];
    const propia = validarCuenta({ code: '1', name: 'Activo', type: 'activo', parent_id: 'cta-a' }, { cuentas, id: 'cta-a' });
    expect(propia.errores.parent_id).toContain('propia');

    const ciclo = validarCuenta({ code: '1', name: 'Activo', type: 'activo', parent_id: 'cta-b' }, { cuentas, id: 'cta-a' });
    expect(ciclo.valido).toBe(false);
    expect(ciclo.errores.parent_id).toContain('ciclos');
  });
});

describe('jerarquía de cuentas contables', () => {
  it('crea cuentas padre e hijas y construye el árbol ordenado', () => {
    const padre = crearCuenta({ code: '1', name: 'Activo', type: 'activo' });
    const hija = crearCuenta({ code: '1010', name: 'Caja', type: 'activo', parent_id: padre.id });
    const otra = crearCuenta({ code: '1020', name: 'Bancos', type: 'activo', parent_id: padre.id });

    const cuentas = listarCuentas();
    expect(cuentas.find((c) => c.id === padre.id).isLeaf).toBe(false);
    expect(cuentas.find((c) => c.id === hija.id).isLeaf).toBe(true);
    expect(cuentas.find((c) => c.id === otra.id).isLeaf).toBe(true);

    const arbol = construirArbol();
    expect(arbol).toHaveLength(1);
    expect(arbol[0].code).toBe('1');
    expect(arbol[0].children.map((c) => c.code)).toEqual(['1010', '1020']);
  });
});
