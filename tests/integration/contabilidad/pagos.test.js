import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, enviar, elegir } from '../../setup/contabilidad.js';
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

function llenarPago({ date = '2026-10-20', fechaVencimiento = '2026-11-20', amount = '500.50', tipo = 'cobro', entidad = 'ent-cliente-demo' } = {}){
  qs('pago-date').value = date;
  qs('pago-fecha-vencimiento').value = fechaVencimiento;
  qs('pago-amount').value = amount;
  qs('pago-tipo').value = tipo;
  qs('pago-method').value = 'transferencia';
  qs('pago-entity').value = entidad;
}

describe('registro y consulta de pagos y cobros', () => {
  it('lista los pagos de la semilla y muestra su detalle', async () => {
    await abrirPagos();
    expect(qs('view-pagos').hidden).toBe(false);
    expect(qs('pagos-lista').textContent).toContain('COB-1001');
    expect(qs('pagos-lista').textContent).toContain(formatearMXN(116000));
    expect(qs('pagos-empty').hidden).toBe(true);

    const toggle = document.querySelector('[data-acciones-menu="pag-0001"]');
    expect(toggle).not.toBeNull();
    expect(toggle.textContent.trim()).toBe('Acciones');
    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
    expect(menu.hidden).toBe(true);
    toggle.click();
    expect(menu.hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    document.querySelector('[data-action="ver-pago"][data-id="pag-0001"]').click();
    expect(qs('pago-detalle').hidden).toBe(false);
    expect(qs('pago-detalle').textContent).toContain('COB-1001');
    expect(qs('pago-detalle').textContent).toContain('Distribuidora del Norte');
    expect(qs('pago-detalle').textContent).toContain('Historial de auditoría');
    expect(qs('pago-detalle').querySelector('[data-historial-detalle="pago"] #historial-movimiento-empty')).not.toBeNull();
  });

  it('registra un cobro con folio automático y lo muestra en el listado', async () => {
    await abrirPagos();
    llenarPago();
    enviar(qs('pago-form'));

    const creado = loadPagos().find((p) => p.amount === 50050);
    expect(creado).toBeDefined();
    expect(creado.tipo).toBe('cobro');
    expect(creado.series).toBe('COB');
    expect(creado.folio).toBe(1003);
    expect(creado.numero).toBe('COB-1003');
    expect(qs('pagos-lista').textContent).toContain('COB-1003');
  });

  it('rechaza pagos sin monto o sin entidad', async () => {
    await abrirPagos();
    const antes = loadPagos().length;
    llenarPago({ amount: '' });
    enviar(qs('pago-form'));
    expect(qs('error-pago-amount').textContent).toContain('obligatorio');

    llenarPago({ entidad: '' });
    enviar(qs('pago-form'));
    expect(qs('error-pago-entity').textContent).toContain('obligatorio');
    expect(loadPagos()).toHaveLength(antes);
  });

  it('asocia el error de periodo cerrado con la fecha y lo anuncia', async () => {
    await abrirPagos();
    const antes = loadPagos().length;
    llenarPago({ date: '2026-09-15' });
    enviar(qs('pago-form'));

    expect(qs('error-pago-date').textContent).toContain('El periodo está cerrado');
    expect(qs('error-pago-amount').textContent).toBe('');
    expect(qs('mensaje-confirmacion').textContent).toContain('El periodo está cerrado');
    expect(loadPagos()).toHaveLength(antes);
  });

  it('mapea el error de periodo cerrado al marcar un pago como pagado', async () => {
    await abrirPagos();
    const accion = document.createElement('button');
    accion.dataset.action = 'marcar-pagado';
    accion.dataset.id = 'pag-0002';
    qs('pagos-lista').appendChild(accion);
    accion.click();

    expect(qs('error-pago-date').textContent).toContain('El periodo está cerrado');
    expect(qs('error-pago-amount').textContent).toBe('');
    expect(loadPagos().find((pago) => pago.id === 'pag-0002').status).toBe('pendiente');
  });

  it('filtra el listado por tipo de operación', async () => {
    await abrirPagos();
    elegir(qs('pagos-filtro-tipo'), 'cobro');
    expect(qs('pagos-lista').textContent).toContain('COB-1001');
    expect(qs('pagos-lista').textContent).not.toContain('PAG-1001');

    elegir(qs('pagos-filtro-tipo'), 'pago');
    expect(qs('pagos-lista').textContent).toContain('PAG-1001');
    expect(qs('pagos-lista').textContent).not.toContain('COB-1001');
  });
});
