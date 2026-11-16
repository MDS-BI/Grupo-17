import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';
import { formatearMXN } from '../../../src/contabilidad/dinero.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('vista de reportes financieros', () => {
  it('muestra los movimientos y totales del periodo seleccionado', async () => {
    await bootContabilidad();
    qs('nav-reportes').click();

    expect(qs('view-reportes').hidden).toBe(false);
    expect(qs('reportes-periodo').options).toHaveLength(4);
    expect(qs('reportes-periodo').value).toBe('per-2026-10');
    expect(qs('reportes-movimientos').querySelectorAll('tr')).toHaveLength(5);
    expect(qs('reportes-total-debitos').textContent).toBe(formatearMXN(366000));
    expect(qs('reportes-total-creditos').textContent).toBe(formatearMXN(366000));
    expect(qs('reportes-empty').hidden).toBe(true);
  });

  it('actualiza la información al cambiar de periodo', async () => {
    await bootContabilidad();
    qs('nav-reportes').click();

    elegir(qs('reportes-periodo'), 'per-2026-09');
    expect(qs('reportes-movimientos').querySelectorAll('tr')).toHaveLength(3);
    expect(qs('reportes-total-debitos').textContent).toBe(formatearMXN(58000));

    elegir(qs('reportes-periodo'), 'per-2026-11');
    expect(qs('reportes-movimientos').querySelectorAll('tr')).toHaveLength(0);
    expect(qs('reportes-total-debitos').textContent).toBe(formatearMXN(0));
    expect(qs('reportes-empty').hidden).toBe(false);
    expect(qs('reportes-empty').textContent).toContain('No existen movimientos');
  });
});
