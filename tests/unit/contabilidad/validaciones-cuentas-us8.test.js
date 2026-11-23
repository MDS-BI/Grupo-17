import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { validarCuenta, normalizarDescripcionCuenta } from '../../../src/contabilidad/validaciones-cuentas.js';
import { crearCuenta, actualizarCuenta, obtenerDetalleCuenta } from '../../../src/contabilidad/cuentas.js';

let almacen;

beforeEach(() => {
  almacen = instalarAlmacen();
  almacen.clear();
});

describe('US8 - validación de cuentas contables', () => {
  it('rechaza campos obligatorios y códigos duplicados', () => {
    const vacia = validarCuenta({ code: '', name: '', type: '' });
    expect(vacia.valido).toBe(false);
    expect(vacia.errores.code).toContain('obligatorio');
    expect(vacia.errores.name).toContain('obligatorio');
    expect(vacia.errores.type).toContain('tipo');

    const cuentas = [{ id: 'cta-1', code: '1010', name: 'Caja' }];
    const duplicada = validarCuenta({ code: '1010', name: 'Otra caja', type: 'activo' }, { cuentas });
    expect(duplicada.errores.code).toContain('Ya existe');
  });

  it('rechaza una cuenta principal inexistente', () => {
    const revision = validarCuenta(
      { code: '1020', name: 'Bancos', type: 'activo', parent_id: 'no-existe' },
      { cuentas: [] }
    );
    expect(revision.valido).toBe(false);
    expect(revision.errores.parent_id).toContain('no existe');
  });

  it('normaliza la descripción y rechaza descripciones demasiado largas', () => {
    expect(normalizarDescripcionCuenta('  Cuenta de efectivo  ')).toBe('Cuenta de efectivo');
    const revision = validarCuenta({
      code: '1010',
      name: 'Caja',
      type: 'activo',
      description: 'x'.repeat(501)
    });
    expect(revision.valido).toBe(false);
    expect(revision.errores.description).toContain('500');
  });

  it('persiste la descripción al crear y editar una cuenta', () => {
    const cuenta = crearCuenta({
      code: '1010',
      name: 'Caja',
      type: 'activo',
      description: '  Efectivo en caja  '
    });
    expect(cuenta.description).toBe('Efectivo en caja');

    const editada = actualizarCuenta(cuenta.id, { description: ' Caja general ' });
    expect(editada.description).toBe('Caja general');
  });
});

describe('US8 - consulta de detalle de cuentas contables', () => {
  it('devuelve el detalle con la cuenta principal y null si la cuenta no existe', () => {
    const padre = crearCuenta({ code: '1', name: 'Activo', type: 'activo' });
    const hija = crearCuenta({
      code: '1010',
      name: 'Caja',
      type: 'activo',
      parent_id: padre.id,
      description: 'Efectivo disponible'
    });

    const detalle = obtenerDetalleCuenta(hija.id);
    expect(detalle.code).toBe('1010');
    expect(detalle.name).toBe('Caja');
    expect(detalle.type).toBe('activo');
    expect(detalle.description).toBe('Efectivo disponible');
    expect(detalle.status).toBe('activa');
    expect(detalle.parentCode).toBe('1');
    expect(detalle.parentName).toBe('Activo');
    expect(obtenerDetalleCuenta('no-existe')).toBeNull();
  });
});
