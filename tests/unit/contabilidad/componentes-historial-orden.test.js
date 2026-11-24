// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { encabezadoOrdenable } from '../../../src/components/contabilidad/comun.js';
import { renderizarHistorialMovimiento, renderizarRegistroActividad } from '../../../src/components/contabilidad/registro-actividad.js';

describe('componentes contabilidad historial y orden', () => {
  it('encabezadoOrdenable devuelve aria-sort según orden activo', () => {
    const sinOrden = encabezadoOrdenable('asientos', 'date', 'Fecha', 'date', undefined);
    const asc = encabezadoOrdenable('asientos', 'date', 'Fecha', 'date', { tabla: 'asientos', columna: 'date', direccion: 'asc' });
    const desc = encabezadoOrdenable('asientos', 'date', 'Fecha', 'date', { tabla: 'asientos', columna: 'date', direccion: 'desc' });
    const otraColumna = encabezadoOrdenable('asientos', 'totalDebit', 'Débitos', 'amount', { tabla: 'asientos', columna: 'date', direccion: 'asc' });

    expect(sinOrden).toContain('aria-sort="none"');
    expect(sinOrden).toContain('data-orden-tabla="asientos"');
    expect(sinOrden).toContain('data-orden-columna="date"');
    expect(sinOrden).toContain('data-orden-tipo="date"');
    expect(sinOrden).toContain('<button type="button" class="orden-tabla"');
    expect(asc).toContain('aria-sort="ascending"');
    expect(desc).toContain('aria-sort="descending"');
    expect(otraColumna).toContain('aria-sort="none"');
    expect(encabezadoOrdenable('asientos', 'totalDebit', 'Débitos', 'amount', undefined, 'num')).toContain('class="num"');
  });

  it('renderizarHistorialMovimiento muestra estado vacío con id requerido', () => {
    const contenedor = document.createElement('div');
    renderizarHistorialMovimiento(contenedor, [], { visible: true });

    const vacio = contenedor.querySelector('#historial-movimiento-empty');
    expect(vacio).not.toBeNull();
    expect(vacio.hidden).toBe(false);
    expect(vacio.textContent).toBe('No hay eventos de auditoría para este movimiento.');

    renderizarHistorialMovimiento(contenedor, [{
      timestamp: '2026-11-23T10:00:00.000Z',
      usuarioNombre: 'Ana',
      usuarioRut: '11.111.111-1',
      rolNombre: 'Administrador',
      accion: 'editar',
      descripcion: 'Cambio',
      cambios: [{ campo: 'concept', valorAnterior: 'A', valorNuevo: 'B' }]
    }], { visible: true });
    expect(contenedor.querySelector('#historial-movimiento-empty').hidden).toBe(true);
    expect(contenedor.textContent).toContain('Ana');
    expect(contenedor.textContent).toContain('11.111.111-1');
    expect(contenedor.textContent).toContain('Administrador');
    expect(contenedor.textContent).toContain('Cambio');
  });

  it('renderizarRegistroActividad muestra la columna RUT', () => {
    const contenedor = document.createElement('div');
    renderizarRegistroActividad(contenedor, [{
      timestamp: '2026-11-23T10:00:00.000Z',
      usuarioNombre: 'Ana',
      usuarioRut: '11.111.111-1',
      rolNombre: 'Auditor',
      accion: 'crear',
      descripcion: 'Alta',
      cambios: []
    }], { visible: true });

    expect(contenedor.textContent).toContain('RUT');
    expect(contenedor.textContent).toContain('11.111.111-1');
  });
});
