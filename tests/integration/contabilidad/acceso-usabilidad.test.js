import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

const css = fs.readFileSync(fileURLToPath(new URL('../../../src/styles.css', import.meta.url)), 'utf8');

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('acceso con formato anterior', () => {
  it('mantiene el formulario y la tabla de usuarios visibles sin centrado especial', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });

    const vista = qs('view-acceso');
    const formulario = qs('acceso-formulario');
    const boton = qs('acceso-ingresar');

    expect(vista.hidden).toBe(false);
    expect(vista.hasAttribute('data-acceso-pantalla')).toBe(false);
    expect(formulario.hasAttribute('data-acceso-centrado')).toBe(false);
    expect(qs('acceso-rut').compareDocumentPosition(boton) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(qs('acceso-contraseña').compareDocumentPosition(boton) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(qs('usuarios-prueba-body')).not.toBeNull();
    expect(css).not.toMatch(/#view-acceso\[data-acceso-pantalla\]/);
    expect(css).not.toMatch(/#acceso-formulario\[data-acceso-centrado\]/);
    expect(css).not.toMatch(/\.acceso-card\s*\{[^}]*max-width:\s*420px/s);
    expect(css).toMatch(/\.acceso-usuarios\s*\{[^}]*width:\s*100%/s);
    expect(css).not.toMatch(/\.acceso-usuarios\s*\{[^}]*margin:[^}]*auto/s);
  });

  it('formatea el RUT en el formulario real y valida el dígito verificador', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });

    const rut = qs('acceso-rut');
    rut.value = '111111111';
    rut.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(rut.value).toBe('11.111.111-1');

    rut.value = '1111119k';
    rut.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(rut.value).toBe('1.111.119-K');

    rut.value = '11.111.111-2';
    qs('acceso-contraseña').value = 'Admin2026!';
    qs('acceso-formulario').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    expect(qs('error-acceso-rut').textContent).toBe('El RUT ingresado no es válido');
    expect(qs('view-acceso').hidden).toBe(false);
  });

  it('permite borrar y corregir el dígito verificador con el teclado', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });

    const rut = qs('acceso-rut');
    rut.value = '11.111.111-1';
    rut.focus();
    rut.setSelectionRange(rut.value.length, rut.value.length);
    rut.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    rut.value = rut.value.slice(0, -1);
    rut.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(rut.value).toBe('11.111.111');

    rut.value += '2';
    rut.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(rut.value).toBe('11.111.111-2');
  });

  it('conserva los campos y las validaciones del acceso', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });

    expect(qs('acceso-rut').required).toBe(true);
    expect(qs('acceso-contraseña').required).toBe(true);
    expect(qs('acceso-ingresar').textContent).toBe('Ingresar');

    qs('acceso-formulario').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));

    const errores = ['error-acceso', 'error-acceso-rut', 'error-acceso-contraseña']
      .map((id) => qs(id).textContent)
      .join('');
    expect(errores.length).toBeGreaterThan(0);
  });
});
