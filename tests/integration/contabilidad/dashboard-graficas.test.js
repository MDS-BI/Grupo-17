import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';
import { loadAsientos, saveAsientos, loadLineas, saveLineas } from '../../../src/contabilidad/almacenamiento.js';

const css = fs.readFileSync(fileURLToPath(new URL('../../../src/styles.css', import.meta.url)), 'utf8');

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

describe('gráficas del panel financiero', () => {
  it('muestra barras, línea y dona derivadas de reportes', async () => {
    await bootContabilidad();
    qs('nav-cuentas').click();
    qs('nav-dashboard').click();
    expect(qs('chart-ingresos-gastos').querySelectorAll('svg').length).toBe(1);
    expect(qs('chart-resultado').querySelectorAll('svg').length).toBe(1);
    expect(qs('chart-gastos-cuenta').querySelectorAll('svg').length).toBe(1);
    expect(qs('dashboard-empty').hidden).toBe(true);
    expect(qs('chart-gastos-cuenta').querySelector('.chart-donut-total').textContent).toMatch(/^\$-?[\d.,]+[kM]?$/);
    const etiquetasEje = [...document.querySelectorAll('.chart-axis-label')].map((etiqueta) => etiqueta.textContent);
    expect(etiquetasEje.some((etiqueta) => /^(\$|-\$)/.test(etiqueta))).toBe(true);
  });

  it('usa colores distintos para ingresos y gastos', () => {
    expect(css).toMatch(/\.chart-bar-ingresos\s*\{\s*fill:\s*var\(--exito\)/);
    expect(css).toMatch(/\.chart-bar-gastos\s*\{\s*fill:\s*var\(--danger\)/);
    expect(css).toMatch(/\.chart-swatch-ingresos\s*\{\s*background:\s*var\(--exito\)/);
    expect(css).toMatch(/\.chart-swatch-gastos\s*\{\s*background:\s*var\(--danger\)/);
  });

  it('actualiza las gráficas al cambiar de periodo', async () => {
    await bootContabilidad();
    qs('nav-cuentas').click();
    qs('nav-dashboard').click();
    const etiquetas = qs('chart-gastos-leyenda').textContent;
    vaciarMovimientos('per-2026-11');
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
