import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom } from '../../setup/contabilidad.js';
import { inicializarContabilidad, loadAsientos, saveAsientos, loadLineas, saveLineas } from '../../../src/contabilidad/almacenamiento.js';
import {
  obtenerMovimientos,
  obtenerReportesFinancieros,
  periodosDisponibles
} from '../../../src/contabilidad/reportes.js';
import { renderReporte } from '../../../src/components/contabilidad/reportes.js';
import { formatearCLP } from '../../../src/contabilidad/dinero.js';

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

function centavosDeTexto(texto) {
  return Number(String(texto).replace(/[^\d-]/g, '')) || 0;
}

function importesDelDetalle() {
  return [...document.querySelectorAll('[data-detalle-filas] tr')]
    .map((fila) => centavosDeTexto(fila.cells[2].textContent));
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
    expect(document.querySelector('[data-tabla-reporte] tfoot').textContent).toContain(formatearCLP(-150000));
    expect(document.querySelector('[data-reporte="estadoResultados"]').getAttribute('aria-selected')).toBe('true');

    document.querySelector('[data-reporte="balanceGeneral"]').click();
    expect(document.querySelector('[data-tabla-reporte]').tHead.textContent).toContain('Concepto');
    expect(document.querySelector('[data-advertencia-reporte]').hidden).toBe(true);
  });

  it('alinea los totales con el número de columnas y usa formato CLP', () => {
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
    expect(document.querySelector('[data-tabla-reporte] tfoot').textContent).toContain(formatearCLP(0));
    expect(document.querySelector('[data-estado-vacio-reporte]').hidden).toBe(false);
  });

  it('indica CLP en todos los encabezados monetarios', () => {
    renderVista();

    const encabezadosMovimientos = [...document.querySelectorAll('#reportes-tabla thead th.num')];
    expect(encabezadosMovimientos.length).toBeGreaterThan(0);
    expect(encabezadosMovimientos.every((th) => th.textContent.includes('(CLP)'))).toBe(true);

    for (const clave of ['libroMayor', 'balanceComprobacion', 'estadoResultados', 'balanceGeneral']) {
      document.querySelector(`[data-reporte="${clave}"]`).click();
      const encabezados = [...document.querySelectorAll('[data-tabla-reporte] thead th.num')];
      expect(encabezados.length).toBeGreaterThan(0);
      expect(encabezados.every((th) => th.textContent.includes('(CLP)'))).toBe(true);
    }
  });

  it('permite ordenar el reporte Estado de Resultados por tipo', () => {
    renderVista('per-2026-10', {
      reporte: 'estadoResultados',
      orden: { tabla: 'reporte-estadoResultados', columna: 'tipo', direccion: 'asc' }
    });

    const tabla = document.querySelector('[data-tabla-reporte]');
    const cabeceraTipo = tabla.tHead.querySelectorAll('th')[2];
    const tipos = [...tabla.tBodies[0].rows].map((fila) => fila.cells[2].textContent);

    expect(cabeceraTipo.textContent).toContain('Tipo');
    expect(cabeceraTipo.getAttribute('aria-sort')).toBe('ascending');
    expect(tipos).toEqual([...tipos].sort((a, b) => a.localeCompare(b, 'es')));
  });

  it('muestra el detalle de los totales de la tabla de movimientos', () => {
    renderVista();
    const panel = document.querySelector('[data-detalle-totales]');
    expect(panel.hidden).toBe(true);

    for (const [id, campo] of [['reportes-total-debitos', 'debit'], ['reportes-total-creditos', 'credit']]) {
      const total = document.getElementById(id);
      const boton = total.querySelector('[data-detalle-total="movimientos"]');
      expect(boton).not.toBeNull();

      boton.click();

      const movimientos = obtenerMovimientos('per-2026-10').movimientos.filter((movimiento) => movimiento[campo] !== 0);
      expect(panel.hidden).toBe(false);
      expect(panel.querySelector('[data-detalle-titulo]').textContent).toContain('CLP');
      expect(panel.querySelectorAll('[data-detalle-filas] tr')).toHaveLength(movimientos.length);
      expect(importesDelDetalle().reduce((suma, valor) => suma + valor, 0)).toBe(centavosDeTexto(total.textContent));
      expect(boton.getAttribute('aria-expanded')).toBe('true');
    }

    panel.querySelector('[data-cerrar-detalle]').click();
    expect(panel.hidden).toBe(true);
  });

  it('muestra el detalle de cada total de los cuatro reportes', () => {
    renderVista();
    const panel = document.querySelector('[data-detalle-totales]');

    for (const clave of ['libroMayor', 'balanceComprobacion', 'estadoResultados', 'balanceGeneral']) {
      document.querySelector(`[data-reporte="${clave}"]`).click();
      const botones = [...document.querySelectorAll('[data-tabla-reporte] [data-detalle-total="reporte"]')];
      expect(botones.length).toBeGreaterThan(0);

      for (const boton of botones) {
        boton.click();
        const importes = importesDelDetalle();
        expect(panel.hidden).toBe(false);
        expect(importes.length).toBeGreaterThan(0);
        expect(importes.reduce((suma, valor) => suma + valor, 0)).toBe(centavosDeTexto(boton.textContent));
        expect(boton.getAttribute('aria-expanded')).toBe('true');
      }
    }
  });
});
