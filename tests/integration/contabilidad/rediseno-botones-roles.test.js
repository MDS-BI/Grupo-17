import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

const ROLES = Object.freeze([
  {
    id: 'administrador',
    rut: '11.111.111-1',
    contraseña: 'Admin2026!',
    menu: ['dashboard', 'resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes']
  },
  {
    id: 'contador',
    rut: '22.222.222-2',
    contraseña: 'Contador2026!',
    menu: ['dashboard', 'resumen', 'cuentas', 'asientos', 'reportes']
  },
  {
    id: 'tesorero',
    rut: '33.333.333-3',
    contraseña: 'Tesorero2026!',
    menu: ['dashboard', 'pagos']
  },
  {
    id: 'auditor',
    rut: '44.444.444-4',
    contraseña: 'Auditor2026!',
    menu: ['dashboard', 'reportes']
  }
]);

const VISTAS = Object.freeze({
  dashboard: 'view-dashboard',
  resumen: 'view-resumen',
  cuentas: 'view-cuentas',
  asientos: 'view-asientos',
  pagos: 'view-pagos',
  periodos: 'view-periodos',
  reportes: 'view-reportes'
});

function botonesDeVista(vista) {
  return [...vista.querySelectorAll('button')].filter((boton) => {
    if (boton.disabled || boton.hidden) return false;
    if (boton.closest('[hidden]')) return false;
    if (boton.matches('[data-accion="cerrar-sesion"]')) return false;
    return true;
  });
}

function visible(control) {
  return control && !control.hidden && !control.closest('[hidden]');
}

let dom;

beforeEach(() => {
  dom = crearDom();
  vi.stubGlobal('confirm', () => false);
  dom.window.confirm = globalThis.confirm;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  dom.window.close();
});

describe('rediseño formal y revisión por roles', () => {
  it('usa iconos SVG Lucide uniformes en todas las opciones del menú', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const botones = [...document.querySelectorAll('.nav-module')].filter((boton) => !boton.hidden);
    const nombres = new Set();

    expect(botones).toHaveLength(7);
    for (const boton of botones) {
      const svg = boton.querySelector('.nav-icono svg[data-lucide]');
      expect(svg).not.toBeNull();
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg.getAttribute('fill')).toBe('none');
      expect(svg.getAttribute('stroke')).toBe('currentColor');
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      nombres.add(svg.dataset.lucide);
    }
    expect(nombres.size).toBe(botones.length);
  });

  it('muestra el estado de periodos como tabla junto a asuntos prioritarios', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const periodos = qs('view-panel-inicio').querySelector('[data-panel-seccion="estado-periodos"]');
    const asuntos = qs('view-panel-inicio').querySelector('[data-panel-seccion="asuntos-prioritarios"]');
    const filas = periodos.querySelectorAll('table.panel-tabla-periodos tbody tr');

    expect(filas.length).toBeGreaterThan(0);
    expect([...periodos.querySelectorAll('thead th')].map((th) => th.textContent.trim())).toEqual(['Periodo', 'Estado']);
    expect(periodos.parentElement.classList.contains('panel-secciones-duo')).toBe(true);
    expect(asuntos.parentElement).toBe(periodos.parentElement);
  });

  it('oculta acciones no permitidas a cada rol', async () => {
    for (const rol of ROLES) {
      dom = crearDom();
      dom.window.confirm = globalThis.confirm;
      await bootContabilidad(undefined, { requireAccess: true, sesion: rol.id });

      const visibles = [...document.querySelectorAll('.nav-module')]
        .filter((boton) => !boton.hidden)
        .map((boton) => boton.dataset.module);
      expect(visibles).toEqual(rol.menu);

      const selectorDemo = '[data-accion="cargar-datos"], [data-accion="restablecer-datos"]';
      const demoPanel = qs('view-panel-inicio').querySelectorAll(selectorDemo);
      const demoDashboard = qs('view-dashboard').querySelectorAll(selectorDemo);
      qs('nav-dashboard').click();
      const accionesDashboard = qs('view-dashboard').querySelector('[data-acciones-datos-ejemplo]');
      if (rol.id === 'administrador') {
        expect(demoPanel).toHaveLength(2);
        expect(demoDashboard).toHaveLength(2);
        expect(accionesDashboard.hidden).toBe(false);
      } else {
        expect(demoPanel).toHaveLength(0);
        expect(accionesDashboard.hidden).toBe(true);
      }

      if (rol.id === 'tesorero') {
        qs('nav-pagos').click();
        expect(document.querySelector('[data-action="marcar-pagado"]')).not.toBeNull();
        expect(document.querySelector('[data-action="editar-pago"]')).not.toBeNull();
        expect(document.querySelector('[data-action="eliminar-pago"]')).toBeNull();
        expect(document.querySelector('[data-action="cancelar-pago"]')).toBeNull();
      }

      if (rol.id === 'contador' || rol.id === 'auditor') {
        qs('nav-reportes').click();
        expect(qs('view-reportes').hidden).toBe(false);
        expect(qs('view-bloqueo').hidden).toBe(true);
      }
      dom.window.close();
    }
  });

  it('ejecuta todos los botones visibles para los cuatro roles sin errores ni accesos denegados', async () => {
    for (const rol of ROLES) {
      dom = crearDom();
      dom.window.confirm = globalThis.confirm;
      const errores = [];
      vi.spyOn(console, 'error').mockImplementation((...args) => errores.push(args.join(' ')));
      await bootContabilidad(undefined, { requireAccess: true, sesion: rol.id });

      let botonesProbados = 0;
      for (const destino of rol.menu) {
        const idBoton = `nav-${destino}`;
        const vista = qs(VISTAS[destino]);
        if (!visible(qs(idBoton)) || !vista) continue;
        qs(idBoton).click();
        expect(qs(VISTAS[destino]).hidden, `${rol.id}: ${destino} no abrió su vista`).toBe(false);

        for (const boton of botonesDeVista(vista)) {
          const descripcion = boton.dataset.action || boton.dataset.accion || boton.dataset.reporte || boton.id || boton.textContent.trim();
          boton.click();
          botonesProbados += 1;
          expect(qs('view-bloqueo').hidden, `${rol.id}: botón ${descripcion} fue bloqueado`).toBe(true);
        }
      }

      const { iniciarSesionApp } = await import('../../../src/app.js');
      const reingreso = iniciarSesionApp(rol.rut, rol.contraseña);
      expect(reingreso.ok, `${rol.id}: reingreso`).toBe(true);
      const cerrar = qs('view-panel-inicio').querySelector('[data-accion="cerrar-sesion"]');
      expect(cerrar).not.toBeNull();
      cerrar.click();
      botonesProbados += 1;
      expect(qs('view-acceso').hidden).toBe(false);

      expect(botonesProbados, `${rol.id}: botones probados`).toBeGreaterThan(0);
      expect(errores.filter((mensaje) => /Uncaught|TypeError|ReferenceError/.test(mensaje)), `${rol.id}: errores`).toEqual([]);
      dom.window.close();
    }
  });

  it('limpia filtros usando eventos compatibles con el DOM', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-pagos').click();
    const control = qs('filtro-pago-fecha-desde');
    control.value = '2026-01-01';
    control.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    const limpiar = document.querySelector('[data-limpiar-campo="filtro-pago-fecha-desde"]');
    expect(limpiar).not.toBeNull();

    const errores = [];
    vi.spyOn(console, 'error').mockImplementation((...args) => errores.push(args.join(' ')));
    limpiar.click();

    expect(control.value).toBe('');
    expect(errores.filter((mensaje) => /Uncaught|TypeError/.test(mensaje))).toEqual([]);
  });
});
