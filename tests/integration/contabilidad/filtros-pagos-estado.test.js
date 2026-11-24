import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('filtros de pagos y cobros', () => {
  it('ofrece el estado anulado y permite limpiar un filtro sin afectar los demas', async () => {
    await bootContabilidad();
    qs('nav-pagos').click();

    const estado = qs('filtro-estado-pago');
    expect([...estado.options].map((opcion) => opcion.value)).toContain('anulado');

    elegir(estado, 'anulado');
    const fecha = qs('filtro-pago-fecha-desde');
    fecha.value = '2026-08-01';
    fecha.dispatchEvent(new window.Event('input', { bubbles: true }));

    document.querySelector('[data-limpiar-campo="filtro-pago-fecha-desde"]').click();

    expect(qs('filtro-pago-fecha-desde').value).toBe('');
    expect(qs('filtro-estado-pago').value).toBe('anulado');
  });
});
