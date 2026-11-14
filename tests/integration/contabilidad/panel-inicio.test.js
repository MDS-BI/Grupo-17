import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir, enviar } from '../../setup/contabilidad.js';
import { formatearMXN } from '../../../src/contabilidad/dinero.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('panel de inicio de Contabilidad y Finanzas', () => {
  it('muestra los indicadores financieros del periodo con movimientos', async () => {
    await bootContabilidad();
    qs('nav-cuentas').click();
    qs('nav-dashboard').click();

    expect(qs('dashboard-periodo').value).toBe('per-2026-10');
    expect(qs('stat-ingresos').textContent).toBe(formatearMXN(100000));
    expect(qs('stat-gastos').textContent).toBe(formatearMXN(308000));
    expect(qs('stat-resultado').textContent).toBe(formatearMXN(-208000));
    expect(qs('stat-resultado').classList.contains('negative')).toBe(true);
    expect(qs('stat-asientos').textContent).toBe('3');
    expect(qs('dashboard-empty').hidden).toBe(true);
  });

  it('filtra los indicadores por el periodo seleccionado', async () => {
    await bootContabilidad();
    qs('nav-cuentas').click();
    qs('nav-dashboard').click();

    elegir(qs('dashboard-periodo'), 'per-2026-11');

    expect(qs('stat-ingresos').textContent).toBe(formatearMXN(0));
    expect(qs('stat-gastos').textContent).toBe(formatearMXN(0));
    expect(qs('stat-resultado').textContent).toBe(formatearMXN(0));
    expect(qs('stat-asientos').textContent).toBe('0');
    expect(qs('dashboard-empty').hidden).toBe(false);
  });

  it('navega a las secciones contables desde las acciones rápidas', async () => {
    await bootContabilidad();

    qs('action-nuevo-asiento').click();
    expect(qs('view-asientos').hidden).toBe(false);
    expect(qs('view-dashboard').hidden).toBe(true);

    qs('nav-dashboard').click();
    qs('action-cuentas').click();
    expect(qs('view-cuentas').hidden).toBe(false);

    qs('nav-dashboard').click();
    qs('action-registrar-pago').click();
    expect(qs('view-pagos').hidden).toBe(false);

    qs('nav-dashboard').click();
    qs('action-ver-reportes').click();
    expect(qs('view-reportes').hidden).toBe(false);
  });

  it('actualiza los indicadores al registrar un nuevo asiento', async () => {
    await bootContabilidad();
    qs('nav-asientos').click();

    qs('asiento-date').value = '2026-10-20';
    qs('asiento-concept').value = 'Ingreso adicional';
    qs('asiento-periodo').value = 'per-2026-10';
    qs('linea-cuenta-0').value = 'cta-1010';
    qs('linea-debit-0').value = '100';
    qs('linea-cuenta-1').value = 'cta-4010';
    qs('linea-credit-1').value = '100';
    enviar(qs('asiento-form'));

    qs('nav-dashboard').click();

    expect(qs('stat-ingresos').textContent).toBe(formatearMXN(110000));
    expect(qs('stat-gastos').textContent).toBe(formatearMXN(308000));
    expect(qs('stat-resultado').textContent).toBe(formatearMXN(-198000));
    expect(qs('stat-asientos').textContent).toBe('4');
  });
});
