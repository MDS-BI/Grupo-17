import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom } from '../../setup/contabilidad.js';
import { inicializarContabilidad, loadAsientos, saveAsientos, loadLineas, saveLineas } from '../../../src/contabilidad/almacenamiento.js';
import {
  obtenerMovimientos,
  obtenerReportesFinancieros,
  periodosDisponibles
} from '../../../src/contabilidad/reportes.js';
import { renderReporte } from '../../../src/components/contabilidad/reportes.js';
import { formatearMXN } from '../../../src/contabilidad/dinero.js';

let dom;

function vaciarMovimientos(periodoId) {
  const asientos = loadAsientos().filter((asiento) => asiento.period_id !== periodoId);
  const ids = new Set(asientos.map((asiento) => asiento.id));
  saveAsientos(asientos);
  saveLineas(loadLineas().filter((linea) => ids.has(linea.asiento_id)));
}

function renderVista(periodoId = 'per-2026-10', opciones = {}) {
  const periodos = periodosDisponibles();
  const resultado = obtenerMovimientos(periodoId);
  return renderReporte({
    periodos,
    periodoId,
    resultado,
    estados: obtenerReportesFinancieros(periodoId, { resultado }),
    ...opciones
  });
}

beforeEach(() => {
  dom = crearDom();
  globalThis.localStorage.clear();
  inicializarContabilidad();
});

afterEach(() => {
  dom.window.close();
});

describe('pestañas de estados financieros', () => {
  it('muestra los cuatro reportes y permite cambiar entre ellos', () => {
    renderVista();

    const pestanas = [...document.querySelectorAll('[data-reportes-tabs] [data-reporte]')];
    expect(pestanas.map((boton) => boton.textContent)).toEqual([
      'Libro Mayor',
      'Balance de Comprobación',
      'Estado de Resultados',
      'Balance General'
    ]);
    expect(document.querySelector('[data-tabla-reporte]').tHead.textContent).toContain('Saldo inicial');
    const filaTotales = document.querySelector('[data-tabla-reporte] tfoot tr');
    expect(filaTotales.children).toHaveLength(6);
    expect(filaTotales.querySelector('th').textContent).toContain('Totales del periodo');
    expect(document.querySelector('[data-totales-reporte]')).toBeNull();

    pestanas.find((boton) => boton.dataset.reporte === 'estadoResultados').click();
    expect(document.querySelector('[data-tabla-reporte]').tHead.textContent).toContain('Ingresos');
    expect(document.querySelector('[data-tabla-reporte] tfoot').textContent).toContain(formatearMXN(-150000));
    expect(document.querySelector('[data-reporte="estadoResultados"]').getAttribute('aria-selected')).toBe('true');

    document.querySelector('[data-reporte="balanceGeneral"]').click();
    expect(document.querySelector('[data-tabla-reporte]').tHead.textContent).toContain('Concepto');
    expect(document.querySelector('[data-advertencia-reporte]').hidden).toBe(true);
  });

  it('alinea los totales con el número de columnas y usa formato MXN', () => {
    renderVista();

    for (const clave of ['libroMayor', 'balanceComprobacion', 'estadoResultados', 'balanceGeneral']) {
      document.querySelector(`[data-reporte="${clave}"]`).click();
      const tabla = document.querySelector('[data-tabla-reporte]');
      const columnas = tabla.tHead.querySelectorAll('th').length;
      const celdas = [...tabla.tFoot.rows[0].children];
      expect(celdas).toHaveLength(columnas);
      const montos = celdas.filter((celda) => celda.classList.contains('num'));
      expect(montos.length).toBeGreaterThan(0);
      expect(montos.every((celda) => /\d/.test(celda.textContent) && celda.textContent !== '0')).toBe(true);
    }
  });

  it('aplica el orden por monto configurado a cada reporte al cambiar de pestaña', () => {
    const columnas = {
      libroMayor: 5,
      balanceComprobacion: 2,
      estadoResultados: 3,
      balanceGeneral: 1
    };
    const ordenes = Object.fromEntries(Object.entries(columnas).map(([clave, indice]) => [
      clave,
      { tabla: `reporte-${clave}`, columna: `monto-${indice}`, direccion: 'desc' }
    ]));
    renderVista('per-2026-10', { ordenes });

    for (const [clave, indice] of Object.entries(columnas)) {
      document.querySelector(`[data-reporte="${clave}"]`).click();
      const tabla = document.querySelector('[data-tabla-reporte]');
      expect(tabla.tHead.querySelectorAll('th')[indice].getAttribute('aria-sort')).toBe('descending');
      const montos = [...tabla.tBodies[0].rows].map((fila) => Number(fila.cells[indice].textContent.replace(/[^\d-]/g, '')));
      expect(montos).toEqual([...montos].sort((a, b) => b - a));
    }
  });

  it('conserva la pestaña activa al recalcular otro periodo', () => {
    renderVista();
    document.querySelector('[data-reporte="estadoResultados"]').click();
    vaciarMovimientos('per-2026-11');
    renderVista('per-2026-11');

    expect(document.querySelector('[data-reporte="estadoResultados"]').getAttribute('aria-selected')).toBe('true');
    expect(document.querySelector('[data-tabla-reporte] tfoot').textContent).toContain(formatearMXN(0));
    expect(document.querySelector('[data-estado-vacio-reporte]').hidden).toBe(false);
  });
});
