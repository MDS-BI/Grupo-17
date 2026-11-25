import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';
import { MENSAJE_LISTA_VACIA } from '../../../src/components/contabilidad/comun.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('estados vacíos de listados', () => {
  it('muestra el mensaje informativo solo cuando el filtro no tiene resultados', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-cuentas').click();

    const filtro = qs('cuentas-filtro');
    filtro.value = 'NO-EXISTE-9999';
    filtro.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

    expect(qs('cuentas-filtro-empty').hidden).toBe(false);
    expect(qs('cuentas-filtro-empty').textContent).toBe(MENSAJE_LISTA_VACIA);
    expect(qs('cuentas-empty').hidden).toBe(true);

    filtro.value = '';
    filtro.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

    expect(qs('cuentas-filtro-empty').hidden).toBe(true);
  });

  it('distingue los errores de filtro del mensaje de lista vacía', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-asientos').click();

    qs('filtro-asiento-fecha-desde').value = '2026-12-31';
    qs('filtro-asiento-fecha-hasta').value = '2026-01-01';
    qs('filtro-asiento-fecha-hasta').dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(qs('error-filtro-asientos').textContent).not.toBe('');
    expect(qs('asientos-filtro-empty').hidden).toBe(true);
    expect(qs('asientos-filtro-empty').textContent).toBe(MENSAJE_LISTA_VACIA);
  });
});
