import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { crearDom, bootContabilidad, qs, enviar } from '../../setup/contabilidad.js';
import { loadPeriodos } from '../../../src/contabilidad/almacenamiento.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

async function abrirPeriodos(){
  await bootContabilidad();
  qs('nav-periodos').click();
}

function llenarPeriodo({ name = '2026-12', start = '2026-12-01', end = '2026-12-31' } = {}){
  qs('periodo-name').value = name;
  qs('periodo-start').value = start;
  qs('periodo-end').value = end;
  qs('periodo-status').value = 'abierto';
}

describe('gestión de periodos contables', () => {
  it('lista los periodos de la semilla con su estado', async () => {
    await abrirPeriodos();
    expect(qs('view-periodos').hidden).toBe(false);
    expect(qs('periodos-lista').textContent).toContain('2026-10');
    expect(qs('periodos-lista').textContent).toContain('abierto');
    expect(qs('periodos-lista').textContent).toContain('cerrado');
  });

  it('crea un periodo y permite cerrarlo desde el listado', async () => {
    await abrirPeriodos();
    llenarPeriodo();
    enviar(qs('periodo-form'));

    const creado = loadPeriodos().find((p) => p.name === '2026-12');
    expect(creado).toBeDefined();
    expect(creado.status).toBe('abierto');
    expect(qs('periodos-lista').textContent).toContain('2026-12');

    document.querySelector(`[data-action="cerrar-periodo"][data-id="${creado.id}"]`).click();
    expect(loadPeriodos().find((p) => p.id === creado.id).status).toBe('cerrado');
    expect(qs('periodos-lista').textContent).not.toContain('Abrir');
    const filaCerrada = [...document.querySelectorAll('#periodos-lista tbody tr')]
      .find((fila) => fila.textContent.includes('2026-12'));
    expect(filaCerrada.querySelector('[data-action="editar-periodo"]')).toBeNull();
    expect(filaCerrada.querySelector('[data-action="eliminar-periodo"]')).toBeNull();
  });

  it('pide confirmación antes de cerrar desde el formulario y conserva el estado al cancelar', async () => {
    await abrirPeriodos();
    llenarPeriodo({ name: '2026-12-confirm' });
    qs('periodo-status').value = 'cerrado';
    vi.mocked(globalThis.confirm).mockReturnValueOnce(false);

    enviar(qs('periodo-form'));

    expect(loadPeriodos().some((periodo) => periodo.name === '2026-12-confirm')).toBe(false);
    expect(qs('periodo-status').value).toBe('abierto');
  });

  it('rechaza periodos solapados', async () => {
    await abrirPeriodos();
    const antes = loadPeriodos().length;
    llenarPeriodo();
    enviar(qs('periodo-form'));

    llenarPeriodo({ name: 'Diciembre parcial', start: '2026-12-15', end: '2027-01-15' });
    enviar(qs('periodo-form'));

    expect(qs('error-periodo-start').textContent).toContain('superpone');
    expect(loadPeriodos()).toHaveLength(antes + 1);
  });

  it('bloquea asientos en un periodo recién cerrado', async () => {
    await abrirPeriodos();
    llenarPeriodo();
    enviar(qs('periodo-form'));
    const creado = loadPeriodos().find((p) => p.name === '2026-12');
    document.querySelector(`[data-action="cerrar-periodo"][data-id="${creado.id}"]`).click();

    qs('nav-asientos').click();
    qs('asiento-date').value = '2026-12-10';
    qs('asiento-concept').value = 'Intento en periodo cerrado';
    qs('asiento-periodo').value = creado.id;
    qs('linea-cuenta-0').value = 'cta-1010';
    qs('linea-debit-0').value = '100';
    qs('linea-cuenta-1').value = 'cta-4010';
    qs('linea-credit-1').value = '100';
    enviar(qs('asiento-form'));

    expect(qs('error-asiento-periodo').textContent).toContain('cerrado');
  });
});
