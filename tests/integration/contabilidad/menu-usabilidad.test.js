import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom } from '../../setup/contabilidad.js';
import { CATALOGO_ROLES } from '../../../src/contabilidad/roles.js';
import { permisosEfectivos } from '../../../src/contabilidad/permisos.js';
import { obtenerMapaNavegacion, renderizarMenu } from '../../../src/components/menu.js';

const css = fs.readFileSync(fileURLToPath(new URL('../../../src/styles.css', import.meta.url)), 'utf8');

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('menú lateral alineado a la izquierda', () => {
  it('alinea el drawer y las opciones al borde izquierdo en escritorio y celular', () => {
    expect(css).toMatch(/\.sidebar\s*\{[^}]*left:\s*0/s);
    expect(css).toMatch(/\.sidebar\.sidebar-abierta\s*\{[^}]*left:\s*0/s);
    expect(css).toMatch(/\.side-nav\s*\{[^}]*align-items:\s*flex-start/s);
    expect(css).toMatch(/@media \(max-width: 640px\)[\s\S]*\.sidebar\s*\{[^}]*left:\s*0/s);
  });

  it('conserva exactamente las secciones vigentes para los cuatro roles', () => {
    const mapa = obtenerMapaNavegacion();
    CATALOGO_ROLES.forEach((rol) => {
      const sesion = { rolId: rol.id, pantallaActiva: 'dashboard' };
      renderizarMenu(permisosEfectivos(sesion), sesion);
      const visibles = [...document.querySelectorAll('.nav-module')]
        .filter((boton) => !boton.hidden)
        .map((boton) => boton.dataset.module);
      const esperados = mapa.filter((entrada) => entrada.roles.includes(rol.id)).map((entrada) => entrada.pantalla);
      expect(visibles).toEqual(esperados);
    });
  });
});
