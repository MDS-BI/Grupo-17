import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';
import { formatearMXN } from '../../../src/contabilidad/dinero.js';
import { loadAsientos, saveAsientos, loadLineas, saveLineas } from '../../../src/contabilidad/almacenamiento.js';

let dom;

function vaciarMovimientos(periodoId) {
  const asientos = loadAsientos().filter((asiento) => asiento.period_id !== periodoId);
  const ids = new Set(asientos.map((asiento) => asiento.id));
  saveAsientos(asientos);
  saveLineas(loadLineas().filter((linea) => ids.has(linea.asiento_id)));
}

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
    expect(qs('reportes-periodo').options).toHaveLength(5);
    expect(qs('reportes-periodo').value).toBe('per-2026-11');
    expect(qs('reportes-movimientos').querySelectorAll('tr')).toHaveLength(2);
    expect(qs('reportes-total-debitos').textContent).toBe(formatearMXN(60000));
    expect(qs('reportes-total-creditos').textContent).toBe(formatearMXN(60000));
    expect(qs('reportes-empty').hidden).toBe(true);
  });

  it('conserva el orden por monto al cambiar de pestaña', async () => {
    await bootContabilidad();
    qs('nav-reportes').click();

    document.querySelector('[data-orden-tabla="reporte-libroMayor"][data-orden-columna="monto-5"]').click();
    expect(document.querySelectorAll('[data-tabla-reporte] thead th')[5].getAttribute('aria-sort')).toBe('ascending');

    document.querySelector('[data-reporte="balanceComprobacion"]').click();
    document.querySelector('[data-reporte="libroMayor"]').click();

    expect(document.querySelectorAll('[data-tabla-reporte] thead th')[5].getAttribute('aria-sort')).toBe('ascending');
  });

  it('actualiza la información al cambiar de periodo', async () => {
    await bootContabilidad();
    qs('nav-reportes').click();
    vaciarMovimientos('per-2026-11');

    elegir(qs('reportes-periodo'), 'per-2026-08');
    expect(qs('reportes-movimientos').querySelectorAll('tr')).toHaveLength(11);
    expect(qs('reportes-total-debitos').textContent).toBe(formatearMXN(838000));

    elegir(qs('reportes-periodo'), 'per-2026-11');
    expect(qs('reportes-movimientos').querySelectorAll('tr')).toHaveLength(0);
    expect(qs('reportes-total-debitos').textContent).toBe(formatearMXN(0));
    expect(qs('reportes-empty').hidden).toBe(false);
    expect(qs('reportes-empty').textContent).toContain('No existen movimientos');
  });
});
