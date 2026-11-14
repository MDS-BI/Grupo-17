import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';
import { formatearMXN } from '../../../src/contabilidad/dinero.js';
import { limpiarContabilidad, loadAsientos } from '../../../src/contabilidad/almacenamiento.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('panel de resumen financiero', () => {
  it('muestra los indicadores del periodo con movimientos más reciente', async () => {
    await bootContabilidad();
    qs('nav-resumen').click();

    expect(qs('view-resumen').hidden).toBe(false);
    expect(qs('resumen-periodo').options).toHaveLength(4);
    expect(qs('resumen-periodo').value).toBe('per-2026-10');
    expect(qs('resumen-ingresos').textContent).toBe(formatearMXN(100000));
    expect(qs('resumen-gastos').textContent).toBe(formatearMXN(308000));
    expect(qs('resumen-resultado').textContent).toBe(formatearMXN(-208000));
    expect(qs('resumen-resultado').classList.contains('negative')).toBe(true);
    expect(qs('resumen-empty').hidden).toBe(true);
  });

  it('filtra por periodo y muestra el estado vacío cuando no hay movimientos', async () => {
    await bootContabilidad();
    qs('nav-resumen').click();

    elegir(qs('resumen-periodo'), 'per-2026-11');

    expect(qs('resumen-ingresos').textContent).toBe(formatearMXN(0));
    expect(qs('resumen-gastos').textContent).toBe(formatearMXN(0));
    expect(qs('resumen-resultado').textContent).toBe(formatearMXN(0));
    expect(qs('resumen-empty').hidden).toBe(false);
    expect(qs('resumen-empty').textContent).toContain('No hay información financiera');
  });

  it('restaura los datos de ejemplo con la acción de reinicio', async () => {
    await bootContabilidad();
    qs('nav-resumen').click();
    limpiarContabilidad();
    expect(loadAsientos()).toHaveLength(0);

    qs('resumen-reset').click();

    expect(loadAsientos()).toHaveLength(6);
    expect(qs('resumen-periodo').options).toHaveLength(4);
    expect(qs('resumen-ingresos').textContent).toBe(formatearMXN(100000));
  });
});
