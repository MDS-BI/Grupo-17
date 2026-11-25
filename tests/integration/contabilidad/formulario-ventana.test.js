import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';
import * as Cuentas from '../../../src/contabilidad/cuentas.js';

const css = fs.readFileSync(fileURLToPath(new URL('../../../src/styles.css', import.meta.url)), 'utf8');

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('ventana reutilizable de Nuevo', () => {
  it('muestra primero el listado y abre el formulario sobre él conservando filtros y datos', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-cuentas').click();

    expect(css).toMatch(/#view-cuentas\s*>\s*\[data-lista-principal\][^}]*order:\s*2/s);
    expect(css).toMatch(/#view-cuentas\s*>\s*\[data-formulario-nuevo\][^}]*order:\s*3/s);

    const filtro = qs('cuentas-filtro');
    filtro.value = 'Caja';
    filtro.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    const totalAntes = Cuentas.listarCuentas().length;
    const lista = qs('view-cuentas').querySelector('[data-lista-principal]');

    document.querySelector('[data-nuevo="cuenta"]').click();

    const ventana = qs('ventana-formulario');
    const formulario = document.querySelector('[data-formulario-nuevo="cuenta"]');
    expect(ventana.hidden).toBe(false);
    expect(formulario.closest('[data-ventana-formulario]')).not.toBeNull();
    expect(qs('view-cuentas').contains(lista)).toBe(true);
    expect(lista.hidden).toBe(false);
    expect(filtro.value).toBe('Caja');

    qs('ventana-formulario-cerrar').click();

    expect(ventana.hidden).toBe(true);
    expect(qs('view-cuentas').contains(formulario)).toBe(true);
    expect(filtro.value).toBe('Caja');
    expect(Cuentas.listarCuentas().length).toBe(totalAntes);
  });

  it('oculta Nuevo para los roles sin permiso de creación', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });

    const botones = [...document.querySelectorAll('[data-nuevo]')];
    expect(botones.length).toBeGreaterThan(0);
    botones.forEach((boton) => expect(boton.hidden).toBe(true));
  });

  it('muestra Nuevo en las vistas con creación permitida', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });

    const botones = [...document.querySelectorAll('[data-nuevo]')];
    expect(botones.length).toBeGreaterThan(0);
    botones.forEach((boton) => expect(boton.hidden).toBe(false));
  });
});
