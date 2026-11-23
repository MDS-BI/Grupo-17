import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';
import { loadPagos } from '../../../src/contabilidad/almacenamiento.js';
import { formatearMXN } from '../../../src/contabilidad/dinero.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

async function abrirPagos(){
  await bootContabilidad();
  qs('nav-pagos').click();
}

describe('resumen de pagos por estado', () => {
  it('muestra cantidades y totales por estado', async () => {
    await abrirPagos();
    const tarjetas = qs('pago-resumen-tarjetas');
    expect(tarjetas.textContent).toContain('Pagado');
    expect(tarjetas.textContent).toContain(formatearMXN(116000));
    expect(tarjetas.textContent).toContain(formatearMXN(250000));
    expect(tarjetas.textContent).toContain(formatearMXN(58000));
    expect(qs('pago-resumen-empty').hidden).toBe(true);
  });

  it('filtra el listado por estado y muestra el estado vacío', async () => {
    await abrirPagos();
    elegir(qs('filtro-estado-pago'), 'vencido');
    expect(qs('pagos-lista').querySelectorAll('tbody tr')).toHaveLength(1);
    expect(qs('pagos-filtro-empty').hidden).toBe(true);

    elegir(qs('filtro-estado-pago'), 'pagado');
    expect(qs('pagos-lista').querySelectorAll('tbody tr')).toHaveLength(1);
  });

  it('marca un cobro vencido como pagado y actualiza el resumen', async () => {
    await abrirPagos();
    const boton = document.querySelector('[data-action="marcar-pagado"][data-id="pag-0003"]');
    expect(boton).not.toBeNull();
    boton.click();
    expect(loadPagos().find((pago) => pago.id === 'pag-0003').status).toBe('pagado');
    expect(qs('pago-resumen-tarjetas').textContent).toContain(formatearMXN(174000));
  });
});
