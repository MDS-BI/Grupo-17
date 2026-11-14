import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, enviar } from '../../setup/contabilidad.js';
import { loadCuentas } from '../../../src/contabilidad/almacenamiento.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

async function abrirCuentas(){
  await bootContabilidad();
  qs('nav-cuentas').click();
}

describe('gestión de cuentas contables', () => {
  it('lista el plan de cuentas jerárquico de la semilla', async () => {
    await abrirCuentas();
    expect(qs('view-cuentas').hidden).toBe(false);
    expect(qs('cuentas-lista').querySelector('.cuenta-arbol')).not.toBeNull();
    expect(qs('cuentas-lista').textContent).toContain('Activo');
    expect(qs('cuentas-lista').textContent).toContain('Caja');
    expect(qs('cuentas-empty').hidden).toBe(true);
  });

  it('crea una cuenta, la muestra en el listado y permite editarla', async () => {
    await abrirCuentas();
    qs('cuenta-code').value = '9999';
    qs('cuenta-name').value = 'Cuenta de pruebas';
    qs('cuenta-type').value = 'gasto';
    enviar(qs('cuenta-form'));

    const creada = loadCuentas().find((c) => c.code === '9999');
    expect(creada).toBeDefined();
    expect(creada.name).toBe('Cuenta de pruebas');
    expect(qs('cuentas-lista').textContent).toContain('Cuenta de pruebas');
    expect(qs('cuenta-code').value).toBe('');

    document.querySelector(`[data-action="editar-cuenta"][data-id="${creada.id}"]`).click();
    expect(qs('cuenta-id').value).toBe(creada.id);
    qs('cuenta-name').value = 'Cuenta de pruebas editada';
    enviar(qs('cuenta-form'));

    expect(loadCuentas().find((c) => c.id === creada.id).name).toBe('Cuenta de pruebas editada');
  });

  it('rechaza un código duplicado sin agregar registros', async () => {
    await abrirCuentas();
    const antes = loadCuentas().length;
    qs('cuenta-code').value = '1010';
    qs('cuenta-name').value = 'Caja duplicada';
    qs('cuenta-type').value = 'activo';
    enviar(qs('cuenta-form'));

    expect(qs('error-cuenta-code').textContent).toContain('Ya existe');
    expect(loadCuentas()).toHaveLength(antes);
  });

  it('elimina una cuenta sin movimientos y confirma la eliminación', async () => {
    await abrirCuentas();
    qs('cuenta-code').value = '9998';
    qs('cuenta-name').value = 'Cuenta temporal';
    qs('cuenta-type').value = 'gasto';
    enviar(qs('cuenta-form'));
    const creada = loadCuentas().find((c) => c.code === '9998');

    document.querySelector(`[data-action="eliminar-cuenta"][data-id="${creada.id}"]`).click();

    expect(loadCuentas().some((c) => c.id === creada.id)).toBe(false);
  });
});
