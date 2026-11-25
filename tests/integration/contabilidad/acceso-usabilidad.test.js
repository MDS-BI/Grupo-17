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

describe('acceso centrado y angosto', () => {
  it('centra el formulario y coloca Ingresar junto a los campos en pantallas amplias y estrechas', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });

    const vista = qs('view-acceso');
    const formulario = qs('acceso-formulario');
    const boton = qs('acceso-ingresar');

    expect(vista.hidden).toBe(false);
    expect(vista.hasAttribute('data-acceso-pantalla')).toBe(true);
    expect(formulario.hasAttribute('data-acceso-centrado')).toBe(true);
    expect(qs('acceso-rut').compareDocumentPosition(boton) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(qs('acceso-contraseña').compareDocumentPosition(boton) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(css).toMatch(/#view-acceso\[data-acceso-pantalla\][^}]*align-items:\s*center/s);
    expect(css).toMatch(/#acceso-formulario\[data-acceso-centrado\][^}]*width:\s*min\(100%,\s*420px\)/s);
    expect(css).toMatch(/#acceso-formulario\[data-acceso-centrado\]\s*\.form-actions[^}]*margin-top:\s*0/s);
    expect(css).toMatch(/#acceso-formulario\[data-acceso-centrado\]\s*\.form-actions[^}]*flex-direction:\s*column/s);
    expect(css).toMatch(/#acceso-formulario\[data-acceso-centrado\]\s*\.form-actions\s*\.error:empty[^}]*display:\s*none/s);
    expect(qs('error-acceso').parentElement.classList.contains('form-actions')).toBe(true);
    expect(css).toMatch(/\.acceso-usuarios\s*\{[^}]*width:\s*min\(100%,\s*420px\)/s);
    expect(css).toMatch(/\.acceso-usuarios\s*\{[^}]*margin:\s*18px auto 0/s);
    expect(css).toMatch(/\.tabla-usuarios\s*\{[^}]*width:\s*100%/s);
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
