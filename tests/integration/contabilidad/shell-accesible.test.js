import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';
import { iconoSeccion } from '../../../src/contabilidad/interfaz-config.js';
import { cerrarDrawerNavegacion, renderizarIconosEncabezados } from '../../../src/components/shell.js';

const ENCABEZADOS = {
  'dashboard-heading': 'dashboard',
  'resumen-view-heading': 'resumen',
  'cuentas-view-heading': 'cuentas',
  'asientos-view-heading': 'asientos',
  'pagos-view-heading': 'pagos',
  'periodos-view-heading': 'periodos',
  'reportes-view-heading': 'reportes',
  'entities-view-heading': 'entities',
  'documents-view-heading': 'documents',
  'search-view-heading': 'search'
};

const css = fs.readFileSync(fileURLToPath(new URL('../../../src/styles.css', import.meta.url)), 'utf8');

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('shell accesible de contabilidad', () => {
  it('muestra el icono de cada seccion en su encabezado sin alterar el texto', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });

    expect(typeof renderizarIconosEncabezados).toBe('function');
    Object.entries(ENCABEZADOS).forEach(([id, seccion]) => {
      const encabezado = qs(id);
      expect(encabezado).not.toBeNull();
      expect(encabezado.tagName).toBe('H1');
      expect(encabezado.getAttribute('data-icono')).toBe(iconoSeccion(seccion));
      expect(encabezado.children.length).toBe(0);
    });

    expect(qs('dashboard-heading').textContent).toBe('Contabilidad y Finanzas');
    expect(qs('resumen-view-heading').textContent).toBe('Resumen financiero');

    const texto = qs('dashboard-heading').textContent;
    renderizarIconosEncabezados();
    expect(qs('dashboard-heading').textContent).toBe(texto);
  });

  it('usa el mismo icono del menu en el encabezado de la seccion activa', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-cuentas').click();

    const iconoMenu = qs('nav-cuentas').querySelector('.nav-icono').textContent;
    expect(qs('cuentas-view-heading').getAttribute('data-icono')).toBe(iconoMenu);
  });

  it('describe el logotipo con el nombre de la empresa', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });

    const svg = qs('logo-mark').querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toContain('Comercial Los Andes SpA');
    expect(qs('empresa-nombre').textContent).toBe('Comercial Los Andes SpA');
  });

  it('mantiene etiquetas y identidad visibles y cierra el drawer al navegar', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });

    expect(typeof cerrarDrawerNavegacion).toBe('function');
    document.querySelectorAll('.nav-module .nav-label').forEach(etiqueta => {
      expect(etiqueta.textContent.length).toBeGreaterThan(0);
    });

    expect(css).toMatch(/h1\[data-icono\]::before\s*\{[^}]*content:\s*attr\(data-icono\)[^}]*margin-right:/s);
    expect(css).not.toMatch(/\.nav-module\s+\.nav-label\s*\{[^}]*display:\s*none/s);

    const mediaEstrecho = css.slice(css.lastIndexOf('@media (max-width: 640px)'));
    expect(mediaEstrecho).toContain('#empresa-nombre');
    expect(mediaEstrecho).not.toMatch(/\.brand-modulo\s*\{[^}]*display:\s*none/s);

    qs('sidebar-nav').classList.add('sidebar-abierta');
    qs('menu-toggle').setAttribute('aria-expanded', 'true');
    qs('nav-resumen').click();

    expect(qs('sidebar-nav').classList.contains('sidebar-abierta')).toBe(false);
    expect(qs('menu-toggle').getAttribute('aria-expanded')).toBe('false');

    qs('sidebar-nav').classList.add('sidebar-abierta');
    qs('menu-toggle').setAttribute('aria-expanded', 'true');
    cerrarDrawerNavegacion();
    expect(qs('sidebar-nav').classList.contains('sidebar-abierta')).toBe(false);
    expect(qs('menu-toggle').getAttribute('aria-expanded')).toBe('false');
  });
});
