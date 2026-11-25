import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { crearDom } from '../../setup/contabilidad.js';
import {
  IDENTIDAD_EMPRESA,
  NOMBRE_EMPRESA,
  PALETA_ESTADOS,
  paleta,
  confirmarEliminacion,
  mostrarMensaje,
  obtenerOpcionesMenu
} from '../../../src/contabilidad/interfaz-config.js';
import { claseEstado } from '../../../src/components/contabilidad/comun.js';

const ADMIN = { rolId: 'administrador' };
const TESORERO = { rolId: 'tesorero' };

describe('interfaz-config', () => {
  let dom;

  beforeEach(() => {
    dom = crearDom();
  });

  afterEach(() => {
    dom.window.close();
  });

  it('mantiene la identidad corporativa inmutable', () => {
    expect(Object.isFrozen(IDENTIDAD_EMPRESA)).toBe(true);
    expect(IDENTIDAD_EMPRESA.nombre).toBe(NOMBRE_EMPRESA);
    expect(IDENTIDAD_EMPRESA.nombre).toBe('Comercial Los Andes SpA');
    expect(IDENTIDAD_EMPRESA.logotipo).toBe('svg-en-linea');
  });

  it('expone la paleta contractual y la reutilizan las insignias de estado', () => {
    expect(Object.keys(paleta)).toEqual(expect.arrayContaining([
      'primario', 'exito', 'error', 'advertencia', 'informacion', 'texto', 'fondo'
    ]));
    expect(claseEstado('pagado')).toBe(PALETA_ESTADOS.pagado);
    expect(claseEstado('pendiente')).toBe(PALETA_ESTADOS.pendiente);
    expect(claseEstado('vencido')).toBe(PALETA_ESTADOS.vencido);
  });

  it('confirma eliminaciones a través del diálogo del navegador', () => {
    globalThis.confirm = vi.fn(() => false);
    dom.window.confirm = globalThis.confirm;
    expect(confirmarEliminacion('¿Eliminar?')).toBe(false);
    expect(globalThis.confirm).toHaveBeenCalledWith('¿Eliminar?');
  });

  it('muestra mensajes con el token semántico compartido', () => {
    const contenedor = document.querySelector('[data-mensaje="global"]');
    expect(contenedor).not.toBeNull();

    mostrarMensaje('exito', 'Guardado correctamente.');
    expect(contenedor.textContent).toBe('Guardado correctamente.');
    expect(contenedor.dataset.tipo).toBe('exito');
    expect(contenedor.hidden).toBe(false);

    mostrarMensaje('error', '');
    expect(contenedor.hidden).toBe(true);
  });

  it('deriva las mismas opciones para menú amplio y drawer móvil', () => {
    const amplio = obtenerOpcionesMenu(ADMIN, 1280).map((opcion) => opcion.pantalla);
    const movil = obtenerOpcionesMenu(ADMIN, 640).map((opcion) => opcion.pantalla);
    expect(amplio).toEqual(movil);
    expect(amplio).toEqual(expect.arrayContaining(['dashboard', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes']));

    const tesorero = obtenerOpcionesMenu(TESORERO, 640).map((opcion) => opcion.pantalla);
    expect(tesorero).toContain('pagos');
    expect(tesorero).not.toContain('cuentas');
  });
});
