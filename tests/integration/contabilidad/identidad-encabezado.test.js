import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';
import { obtenerSesionActiva } from '../../../src/contabilidad/sesion.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('accesibilidad del shell', () => {
  it('muestra nombre, rol y cierre de sesión agrupados en el encabezado de todas las pantallas con sesión', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const sesion = obtenerSesionActiva();
    const identidad = document.querySelector('[data-identidad-usuario]');

    expect(identidad).not.toBeNull();
    expect(identidad.hidden).toBe(false);
    expect(qs('usuario-nombre').textContent).toBe(sesion.usuarioNombre);
    expect(qs('usuario-rol').textContent).toBe(sesion.rolNombre);
    expect(identidad.closest('header')).toBe(qs('brand-name').closest('header'));
    expect(identidad.querySelector('[data-cerrar-sesion]').textContent).toContain('Cerrar sesión');

    document.querySelectorAll('.nav-module:not([hidden])').forEach((boton) => {
      boton.click();
      expect(identidad.hidden).toBe(false);
      expect(qs('cerrar-sesion-encabezado').hidden).toBe(false);
    });

    qs('cerrar-sesion-encabezado').click();

    expect(identidad.hidden).toBe(true);
    expect(qs('view-acceso').hidden).toBe(false);
  });
});
