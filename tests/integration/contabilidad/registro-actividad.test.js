import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('registro de actividad dentro de reportes', () => {
  it('muestra el historial al auditor sin crear una opción de menú', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });

    expect(qs('nav-auditoria')).toBeNull();

    qs('nav-reportes').click();
    expect(qs('view-reportes').hidden).toBe(false);

    const seccion = document.querySelector('[data-registro-actividad]');
    expect(seccion.hidden).toBe(false);
    expect(seccion.textContent).toContain('Registro de actividad');
    expect(seccion.querySelectorAll('tbody tr').length).toBeGreaterThan(0);
  });

  it('filtra los eventos por acción desde la vista de reportes', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });
    qs('nav-reportes').click();

    const totalInicial = qs('auditoria-total-resultados').textContent;
    const filtro = qs('auditoria-filtro-accion');
    const accion = [...filtro.options].map((opcion) => opcion.value).find(Boolean);
    expect(accion).toBeTruthy();

    elegir(filtro, accion);

    expect(qs('auditoria-total-resultados').textContent).not.toBe(totalInicial);
    expect(qs('auditoria-filtro-accion').value).toBe(accion);
  });

  it('oculta el historial a roles sin permiso', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'contador' });
    qs('nav-reportes').click();

    expect(document.querySelector('[data-registro-actividad]').hidden).toBe(true);
  });

  it('oculta los botones de historial en listados y bloquea el acceso directo', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'contador' });
    qs('nav-asientos').click();

    expect(document.querySelector('[data-action="ver-historial-asiento"]')).toBeNull();

    const boton = document.createElement('button');
    boton.dataset.action = 'ver-historial-asiento';
    boton.dataset.id = 'asi-0001';
    qs('asientos-lista').appendChild(boton);
    boton.click();

    expect(qs('view-bloqueo').hidden).toBe(false);
    expect(qs('mensaje-bloqueo').textContent).toContain('auditoría');
  });

  it('oculta el historial de pagos al Tesorero', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'tesorero' });
    qs('nav-pagos').click();

    expect(document.querySelector('[data-action="ver-historial-pago"]')).toBeNull();

    const boton = document.createElement('button');
    boton.dataset.action = 'ver-historial-pago';
    boton.dataset.id = 'pag-0001';
    qs('pagos-lista').appendChild(boton);
    boton.click();

    expect(qs('view-bloqueo').hidden).toBe(false);
  });
});
