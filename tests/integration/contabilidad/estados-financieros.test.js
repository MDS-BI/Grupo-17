import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, elegir } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('estados financieros en la interfaz', () => {
  it('muestra las cuatro pestañas y permite cambiar de estado', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    document.getElementById('nav-reportes').click();

    const pestanas = document.querySelectorAll('[data-reportes-tabs] [data-reporte]');
    expect(pestanas).toHaveLength(4);
    expect([...pestanas].map((boton) => boton.textContent)).toEqual([
      'Libro Mayor',
      'Balance de Comprobación',
      'Estado de Resultados',
      'Balance General'
    ]);

    document.querySelector('[data-reporte="balanceComprobacion"]').click();

    const seleccionada = document.querySelector('[data-reporte="balanceComprobacion"]');
    expect(seleccionada.getAttribute('aria-selected')).toBe('true');
    expect(document.querySelector('[data-tabla-reporte] thead').textContent).toContain('Saldo deudor');
    expect(document.querySelector('[data-tabla-reporte] thead').textContent).toContain('Saldo acreedor');
  });

  it('conserva el periodo seleccionado al volver a renderizar', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    document.getElementById('nav-reportes').click();

    elegir(document.getElementById('reportes-periodo'), 'per-2026-09');

    expect(document.getElementById('reportes-periodo').value).toBe('per-2026-09');
    expect(document.querySelector('[data-tabla-reporte] tbody').textContent).not.toBe('');
  });

  it('no muestra advertencias para el periodo semilla cuadrado', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    document.getElementById('nav-reportes').click();

    document.querySelector('[data-reporte="balanceGeneral"]').click();

    const advertencia = document.querySelector('[data-advertencia-reporte]');
    expect(advertencia.hidden).toBe(true);
    expect(advertencia.textContent).toBe('');
  });
});
