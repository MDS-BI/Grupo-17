import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';
import { formatearCLP } from '../../../src/contabilidad/dinero.js';
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

describe('panel de resumen financiero', () => {
  it('muestra los indicadores del periodo con movimientos más reciente', async () => {
    await bootContabilidad();
    qs('nav-resumen').click();

    expect(qs('view-resumen').hidden).toBe(false);
    expect(qs('resumen-periodo').options).toHaveLength(5);
    expect(qs('resumen-periodo').value).toBe('per-2026-11');
    expect(qs('resumen-ingresos').textContent).toBe(formatearCLP(0));
    expect(qs('resumen-gastos').textContent).toBe(formatearCLP(60000));
    expect(qs('resumen-resultado').textContent).toBe(formatearCLP(-60000));
    expect(qs('resumen-resultado').classList.contains('negative')).toBe(true);
    expect(qs('resumen-empty').hidden).toBe(true);
  });

  it('filtra por periodo y muestra el estado vacío cuando no hay movimientos', async () => {
    await bootContabilidad();
    qs('nav-resumen').click();
    vaciarMovimientos('per-2026-11');

    elegir(qs('resumen-periodo'), 'per-2026-11');

    expect(qs('resumen-ingresos').textContent).toBe(formatearCLP(0));
    expect(qs('resumen-gastos').textContent).toBe(formatearCLP(0));
    expect(qs('resumen-resultado').textContent).toBe(formatearCLP(0));
    expect(qs('resumen-empty').hidden).toBe(false);
    expect(qs('resumen-empty').textContent).toContain('No hay información financiera');
  });

});
