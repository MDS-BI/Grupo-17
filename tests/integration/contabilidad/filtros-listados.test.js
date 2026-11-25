import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('filtros avanzados de asientos y pagos', () => {
  it('filtra asientos por rango de fechas y permite limpiar', async () => {
    await bootContabilidad();
    qs('nav-asientos').click();

    expect(qs('asientos-total-resultados').textContent).toContain('10 registro(s)');
    expect(qs('filtro-asiento-cuenta').options.length).toBeGreaterThan(1);
    const limpiadores = document.querySelectorAll('.filtros-movimientos .limpiar-campo');
    expect(limpiadores).toHaveLength(12);
    limpiadores.forEach((boton) => {
      expect(boton.parentElement.classList.contains('campo-con-limpieza')).toBe(true);
    });

    elegir(qs('filtro-asiento-fecha-desde'), '2026-10-01');
    elegir(qs('filtro-asiento-fecha-hasta'), '2026-10-31');

    expect(qs('asientos-total-resultados').textContent).toContain('3 registro(s)');

    qs('asientos-limpiar-filtros').click();

    expect(qs('asientos-total-resultados').textContent).toContain('10 registro(s)');
    expect(qs('error-filtro-asientos').textContent).toBe('');
  });

  it('muestra el error de un rango de fechas inválido', async () => {
    await bootContabilidad();
    qs('nav-asientos').click();

    elegir(qs('filtro-asiento-fecha-desde'), '2026-10-31');
    const listadoPrevio = qs('asientos-total-resultados').textContent;
    elegir(qs('filtro-asiento-fecha-hasta'), '2026-10-01');

    expect(qs('error-filtro-asientos').textContent).toContain('La fecha desde no puede ser mayor que la fecha hasta');
    expect(qs('asientos-total-resultados').textContent).toBe(listadoPrevio);
    expect(qs('asientos-filtro-empty').hidden).toBe(true);
  });

  it('conserva el último listado válido cuando el monto del filtro es inválido', async () => {
    await bootContabilidad();
    qs('nav-pagos').click();

    elegir(qs('filtro-pago-monto-min'), '2000');
    expect(qs('pagos-total-resultados').textContent).toContain('1 registro(s)');

    elegir(qs('filtro-pago-monto-min'), '-1');

    expect(qs('error-filtro-pagos').textContent).toContain('monto mínimo');
    expect(qs('pagos-total-resultados').textContent).toContain('1 registro(s)');
    expect(qs('pagos-filtro-empty').hidden).toBe(true);
  });

  it('filtra pagos por monto expresado en pesos y permite limpiar', async () => {
    await bootContabilidad();
    qs('nav-pagos').click();

    expect(qs('pagos-total-resultados').textContent).toContain('5 registro(s)');
    expect(qs('filtro-pago-cuenta').options.length).toBeGreaterThan(1);

    elegir(qs('filtro-pago-monto-min'), '2000');

    expect(qs('pagos-total-resultados').textContent).toContain('1 registro(s)');

    qs('pagos-limpiar-filtros').click();

    expect(qs('pagos-total-resultados').textContent).toContain('5 registro(s)');
    expect(qs('error-filtro-pagos').textContent).toBe('');
  });
});
