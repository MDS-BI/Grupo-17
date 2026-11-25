import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

const PANTALLAS = [
  ['cuentas', 'cuenta-form', 'cuentas-lista'],
  ['asientos', 'asiento-form', 'asientos-lista'],
  ['pagos', 'pago-form', 'pagos-lista'],
  ['periodos', 'periodo-form', 'periodos-lista']
];

describe('formulario y listado visibles', () => {
  it('mantiene el formulario sobre el listado y sin botón Nuevo en las cuatro pantallas', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    for (const [vista, formularioId, listaId] of PANTALLAS) {
      qs(`nav-${vista}`).click();
      const formulario = qs(formularioId);
      const lista = qs(listaId);
      expect(formulario.hidden).toBe(false);
      expect(lista.hidden).toBe(false);
      expect(formulario.compareDocumentPosition(lista) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(document.querySelectorAll('[data-nuevo]').length).toBe(0);
    expect(qs('ventana-formulario')).toBeNull();
  });

  it('conserva filtros y datos al usar el formulario visible', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-cuentas').click();
    const filtro = qs('cuentas-filtro');
    filtro.value = 'Caja';
    filtro.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(qs('cuenta-form').hidden).toBe(false);
    expect(qs('cuentas-lista').hidden).toBe(false);
    expect(filtro.value).toBe('Caja');
  });

  it('muestra el formulario y el listado también para roles sin permiso de creación', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });
    qs('nav-cuentas').click();
    expect(qs('cuenta-form').hidden).toBe(false);
    expect(qs('cuentas-lista').hidden).toBe(false);
    expect(document.querySelectorAll('[data-nuevo]').length).toBe(0);
  });
});
