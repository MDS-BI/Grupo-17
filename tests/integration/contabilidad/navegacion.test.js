import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('navegación simplificada', () => {
  it('oculta entidades, documentos y búsqueda para el administrador', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    expect(qs('nav-entities').hidden).toBe(true);
    expect(qs('nav-documents').hidden).toBe(true);
    expect(qs('nav-search').hidden).toBe(true);
  });

  it('mantiene un único control visible por destino', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'contador' });
    const destinos = [...document.querySelectorAll('.nav-module')]
      .filter((boton) => !boton.hidden)
      .map((boton) => boton.dataset.destino);
    expect(destinos.length).toBe(new Set(destinos).size);
  });

  it('muestra Sección no disponible al intentar una ruta eliminada', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-entities').click();
    expect(qs('view-bloqueo').hidden).toBe(false);
    expect(qs('mensaje-bloqueo').textContent).toBe('Sección no disponible');
  });
});
