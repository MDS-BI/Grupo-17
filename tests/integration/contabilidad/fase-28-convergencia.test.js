import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';
import { loadCuentas, saveCuentas, loadPagos, savePagos } from '../../../src/contabilidad/almacenamiento.js';
import { construirModeloExportacion, serializarReporteCsv } from '../../../src/contabilidad/exportacion-reportes.js';
import { conectarEventosExportacion } from '../../../src/components/contabilidad/exportacion.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

function escribir(id, valor) {
  const control = qs(id);
  control.value = valor;
  control.dispatchEvent(new window.Event('input', { bubbles: true }));
}

function montosDeAsientos() {
  return [...qs('asientos-lista').querySelectorAll('tbody tr')]
    .map((fila) => Number(fila.children[5].textContent.replace(/[^\d-]/g, '')));
}

function botonOrden(contenedorId, columna) {
  return [...document.querySelectorAll(`#${contenedorId} [data-ordenar]`)]
    .find((boton) => boton.dataset.ordenColumna === columna);
}

describe('fase 28 de convergencia', () => {
  it('ordena créditos, vencimientos y cuentas en ambos sentidos', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });

    qs('nav-asientos').click();
    expect(botonOrden('asientos-lista', 'totalCredit')).not.toBeNull();
    botonOrden('asientos-lista', 'totalCredit').click();
    const cabeceraCreditos = [...document.querySelectorAll('#asientos-lista th')]
      .find((th) => th.textContent.includes('Créditos'));
    expect(cabeceraCreditos.getAttribute('aria-sort')).toBe('ascending');
    const ascendentes = montosDeAsientos();
    expect(ascendentes[0]).toBeLessThanOrEqual(ascendentes[ascendentes.length - 1]);
    botonOrden('asientos-lista', 'totalCredit').click();
    const cabeceraCreditosDescendente = [...document.querySelectorAll('#asientos-lista th')]
      .find((th) => th.textContent.includes('Créditos'));
    expect(cabeceraCreditosDescendente.getAttribute('aria-sort')).toBe('descending');
    const descendentes = montosDeAsientos();
    expect(descendentes[0]).toBeGreaterThanOrEqual(descendentes[descendentes.length - 1]);

    qs('nav-pagos').click();
    expect(botonOrden('pagos-lista', 'fechaVencimiento')).not.toBeNull();
    botonOrden('pagos-lista', 'fechaVencimiento').click();
    const cabeceraVencimiento = [...document.querySelectorAll('#pagos-lista th')]
      .find((th) => th.textContent.includes('Vencimiento'));
    expect(cabeceraVencimiento.getAttribute('aria-sort')).toBe('ascending');
    const primerAscendente = qs('pagos-lista').querySelector('tbody tr').dataset.pagoId;
    botonOrden('pagos-lista', 'fechaVencimiento').click();
    const cabeceraVencimientoDescendente = [...document.querySelectorAll('#pagos-lista th')]
      .find((th) => th.textContent.includes('Vencimiento'));
    expect(cabeceraVencimientoDescendente.getAttribute('aria-sort')).toBe('descending');
    expect(qs('pagos-lista').querySelector('tbody tr').dataset.pagoId).not.toBe(primerAscendente);

    qs('nav-cuentas').click();
    expect(botonOrden('cuentas-lista', 'code')).not.toBeNull();
    botonOrden('cuentas-lista', 'code').click();
    expect(document.querySelector('#cuentas-lista th').getAttribute('aria-sort')).toBe('ascending');
    botonOrden('cuentas-lista', 'code').click();
    expect(document.querySelector('#cuentas-lista th').getAttribute('aria-sort')).toBe('descending');
  });

  it('oculta eliminación de cuentas inactivas y pagos anulados', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });

    qs('nav-cuentas').click();
    expect(document.querySelector('[data-action="eliminar-cuenta"][data-id="cta-1010"]')).not.toBeNull();
    saveCuentas(loadCuentas().map((cuenta) => (
      cuenta.id === 'cta-1010' ? { ...cuenta, status: 'inactiva' } : cuenta
    )));
    qs('nav-pagos').click();
    qs('nav-cuentas').click();
    expect(document.querySelector('[data-action="eliminar-cuenta"][data-id="cta-1010"]')).toBeNull();

    qs('nav-pagos').click();
    expect(document.querySelector('[data-action="cancelar-pago"][data-id="pag-0002"]')).not.toBeNull();
    savePagos(loadPagos().map((pago) => (
      pago.id === 'pag-0002' ? { ...pago, anulado: true, status: 'pendiente' } : pago
    )));
    qs('nav-cuentas').click();
    qs('nav-pagos').click();
    expect(document.querySelector('[data-action="eliminar-pago"][data-id="pag-0002"]')).toBeNull();
    expect(document.querySelector('[data-action="cancelar-pago"][data-id="pag-0002"]')).toBeNull();
  });

  it('incluye la columna resultado en el archivo del estado de resultados', () => {
    const modelo = construirModeloExportacion('estadoResultados', '2026-10', {
      detalle: [{ codigo: '4010', nombre: 'Ventas', tipo: 'ingreso', ingresos: 10000, gastos: 4000 }],
      ingresos: 10000,
      gastos: 4000,
      resultado: 6000,
      valido: true
    });

    expect(modelo.columnas.map((columna) => columna.clave)).toContain('resultado');
    expect(modelo.filas[0].celdas.find((celda) => celda.clave === 'resultado').valor).toBe(6000);
    const csv = serializarReporteCsv(modelo);
    expect(csv).toContain('"Resultado"');
    expect(csv).toContain('$60');
  });

  it('invita a reintentar cuando falla la descarga', () => {
    const modelo = construirModeloExportacion('libroMayor', '2026-10', {
      cuentas: [{ codigo: '1010', nombre: 'Caja', saldoFinal: 10000 }],
      totales: { debitos: 10000, creditos: 10000 },
      valido: true
    });
    const contenedor = document.createElement('div');
    contenedor.innerHTML = '<button type="button" data-formato="pdf">PDF</button><div data-advertencia-exportacion hidden></div>';
    const onError = vi.fn();
    conectarEventosExportacion(contenedor, {
      obtenerModelo: () => modelo,
      onExportar: () => { throw new Error('red caída'); },
      onError,
      raiz: contenedor
    });

    contenedor.querySelector('button').click();

    const advertencia = contenedor.querySelector('[data-advertencia-exportacion]');
    expect(advertencia.hidden).toBe(false);
    expect(advertencia.textContent).toContain('red caída');
    expect(advertencia.textContent).toContain('Reintente la descarga');
    expect(onError.mock.calls[0][0]).toContain('Reintente la descarga');
  });

  it('muestra totales exactos en el formulario de asiento y en la dona del panel', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-asientos').click();
    escribir('linea-debit-0', '100');
    escribir('linea-credit-1', '90');

    expect(qs('asiento-total-debitos').textContent).toBe('$100');
    expect(qs('asiento-total-creditos').textContent).toBe('$90');
    expect(qs('asiento-diferencia').textContent).toBe('$10');

    escribir('linea-credit-1', '100');
    expect(qs('asiento-diferencia').textContent).toBe('$0');

    qs('nav-dashboard').click();
    elegir(qs('dashboard-periodo'), 'per-2026-11');
    expect(qs('chart-gastos-cuenta').querySelector('.chart-donut-total').textContent).toBe('$600');
  });

  it('expone los selectores contractuales de interfaz profesional', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    expect(document.querySelector('[data-menu-movil]')).not.toBeNull();

    qs('nav-asientos').click();
    expect(document.querySelectorAll('#asientos-lista [data-ordenar]').length).toBeGreaterThan(0);
    expect(document.querySelector('#asientos-lista [data-confirmar-eliminacion]')).not.toBeNull();
  });
});
