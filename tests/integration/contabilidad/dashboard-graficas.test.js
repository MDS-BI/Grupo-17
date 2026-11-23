import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('gráficas del panel financiero', () => {
  it('muestra barras, línea y dona derivadas de reportes', async () => {
    await bootContabilidad();
    qs('nav-cuentas').click();
    qs('nav-dashboard').click();
    expect(qs('chart-ingresos-gastos').querySelectorAll('svg').length).toBe(1);
    expect(qs('chart-resultado').querySelectorAll('svg').length).toBe(1);
    expect(qs('chart-gastos-cuenta').querySelectorAll('svg').length).toBe(1);
    expect(qs('dashboard-empty').hidden).toBe(true);
  });

  it('actualiza las gráficas al cambiar de periodo', async () => {
    await bootContabilidad();
    qs('nav-cuentas').click();
    qs('nav-dashboard').click();
    const etiquetas = qs('chart-gastos-leyenda').textContent;
    elegir(qs('dashboard-periodo'), 'per-2026-11');
    expect(qs('chart-gastos-leyenda').textContent).not.toBe(etiquetas);
    expect(qs('dashboard-empty').hidden).toBe(false);
  });

  it('muestra mensaje vacío cuando no hay periodos', async () => {
    await bootContabilidad();
    const { savePeriodos } = await import('../../../src/contabilidad/almacenamiento.js');
    savePeriodos([]);
    qs('nav-dashboard').click();
    expect(qs('dashboard-empty').hidden).toBe(false);
    expect(qs('dashboard-empty').textContent).toContain('No hay periodos');
  });
});
