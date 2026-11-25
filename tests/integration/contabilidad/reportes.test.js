import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';
import { formatearCLP } from '../../../src/contabilidad/dinero.js';
import { libroMayor } from '../../../src/contabilidad/reportes.js';
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

describe('vista de reportes financieros', () => {
  it('muestra los movimientos y totales del periodo seleccionado', async () => {
    await bootContabilidad();
    qs('nav-reportes').click();

    expect(qs('view-reportes').hidden).toBe(false);
    expect(qs('reportes-periodo').options).toHaveLength(5);
    expect(qs('reportes-periodo').value).toBe('per-2026-11');
    expect(qs('reportes-movimientos').querySelectorAll('tr')).toHaveLength(2);
    expect(qs('reportes-total-debitos').textContent).toBe(formatearCLP(60000));
    expect(qs('reportes-total-creditos').textContent).toBe(formatearCLP(60000));
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
    expect(qs('reportes-total-debitos').textContent).toBe(formatearCLP(838000));

    elegir(qs('reportes-periodo'), 'per-2026-11');
    expect(qs('reportes-movimientos').querySelectorAll('tr')).toHaveLength(0);
    expect(qs('reportes-total-debitos').textContent).toBe(formatearCLP(0));
    expect(qs('reportes-empty').hidden).toBe(false);
    expect(qs('reportes-empty').textContent).toContain('No existen movimientos');
  });

  it('alinea la fila de totales del Libro Mayor con las cuatro columnas monetarias', async () => {
    await bootContabilidad();
    qs('nav-reportes').click();
    document.querySelector('[data-reporte="libroMayor"]').click();

    const fila = document.querySelector('[data-tabla-reporte] tfoot tr.fila-totales');
    const celdas = [...fila.children];
    const estado = libroMayor('per-2026-11');
    const suma = (campo) => estado.cuentas.reduce((total, cuenta) => total + (Number(cuenta[campo]) || 0), 0);
    const saldoInicial = suma('saldoInicial');
    const debitos = suma('debitos');
    const creditos = suma('creditos');
    const saldoFinal = suma('saldoFinal');

    expect(celdas.map((celda) => celda.tagName)).toEqual(['TH', 'TD', 'TD', 'TD', 'TD', 'TD']);
    expect(celdas.slice(2).every((celda) => celda.classList.contains('num'))).toBe(true);
    expect(celdas[2].textContent).toBe(formatearCLP(saldoInicial));
    expect(celdas[3].textContent).toBe(formatearCLP(debitos));
    expect(celdas[4].textContent).toBe(formatearCLP(creditos));
    expect(celdas[5].textContent).toBe(formatearCLP(saldoFinal));
    expect(saldoInicial + debitos - creditos).toBe(saldoFinal);
    expect(css).toMatch(/\.tabla-financiera tfoot tr\.fila-totales[^}]*border-top/s);
  });

  it('conserva la alineación de totales en pantallas estrechas', () => {
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]*\.tabla-financiera\s*\{[^}]*overflow-x:\s*auto/s);
    expect(css).toMatch(/\.tabla-financiera tfoot tr\.fila-totales\s+td\.num\s*\{[^}]*text-align:\s*right/s);
  });
});
