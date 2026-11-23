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

async function abrirCuentas() {
  await bootContabilidad();
  qs('nav-cuentas').click();
}

describe('US8 - gestionar cuentas contables como contador', () => {
  it('crea una cuenta con descripción y permite consultar su detalle', async () => {
    await abrirCuentas();
    const padre = loadCuentas().find((c) => c.code === '1');

    qs('cuenta-code').value = '1999';
    qs('cuenta-name').value = 'Cuenta del contador';
    qs('cuenta-type').value = 'activo';
    qs('cuenta-description').value = ' Cuenta de prueba para el detalle ';
    qs('cuenta-parent').value = padre.id;
    enviar(qs('cuenta-form'));

    const creada = loadCuentas().find((c) => c.code === '1999');
    expect(creada.description).toBe('Cuenta de prueba para el detalle');
    expect(qs('cuentas-lista').textContent).toContain('Cuenta del contador');

    const verDetalle = document.querySelector(`[data-action="ver-detalle-cuenta"][data-id="${creada.id}"]`);
    expect(verDetalle).not.toBeNull();
    verDetalle.click();

    const detalle = qs('cuenta-detalle').textContent;
    expect(detalle).toContain('1999');
    expect(detalle).toContain('Cuenta del contador');
    expect(detalle).toContain('Cuenta de prueba para el detalle');
    expect(detalle).toContain('activo');
    expect(detalle).toContain('activa');
    expect(detalle).toContain(padre.code);
  });

  it('muestra mensajes específicos cuando faltan campos o el código se duplica', async () => {
    await abrirCuentas();
    enviar(qs('cuenta-form'));
    expect(qs('error-cuenta-code').textContent).toContain('obligatorio');
    expect(qs('error-cuenta-name').textContent).toContain('obligatorio');

    qs('cuenta-code').value = '1010';
    qs('cuenta-name').value = 'Caja duplicada';
    enviar(qs('cuenta-form'));
    expect(qs('error-cuenta-code').textContent).toContain('Ya existe');
  });

  it('rechaza una cuenta principal que no existe', async () => {
    await abrirCuentas();
    const opcion = document.createElement('option');
    opcion.value = 'cuenta-inexistente';
    opcion.textContent = 'Cuenta inexistente';
    qs('cuenta-parent').appendChild(opcion);

    qs('cuenta-code').value = '1888';
    qs('cuenta-name').value = 'Cuenta con padre inválido';
    qs('cuenta-parent').value = 'cuenta-inexistente';
    enviar(qs('cuenta-form'));

    expect(qs('error-cuenta-parent').textContent).toContain('no existe');
    expect(loadCuentas().some((c) => c.code === '1888')).toBe(false);
  });

  it('refleja la edición de la descripción en el listado y en el detalle', async () => {
    await abrirCuentas();
    qs('cuenta-code').value = '1777';
    qs('cuenta-name').value = 'Cuenta editable';
    qs('cuenta-type').value = 'gasto';
    qs('cuenta-description').value = 'Descripción original';
    enviar(qs('cuenta-form'));

    const creada = loadCuentas().find((c) => c.code === '1777');
    document.querySelector(`[data-action="editar-cuenta"][data-id="${creada.id}"]`).click();
    expect(qs('cuenta-description').value).toBe('Descripción original');
    qs('cuenta-description').value = 'Descripción actualizada';
    enviar(qs('cuenta-form'));

    expect(loadCuentas().find((c) => c.id === creada.id).description).toBe('Descripción actualizada');
    expect(qs('cuentas-lista').textContent).toContain('Descripción actualizada');
  });
});
