import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';
import { inicializarContabilidad } from '../../../src/contabilidad/almacenamiento.js';
import {
  obtenerMovimientos,
  obtenerReportesFinancieros,
  periodosDisponibles
} from '../../../src/contabilidad/reportes.js';
import { renderReporte } from '../../../src/components/contabilidad/reportes.js';

let dom;

function renderVista(opciones = {}) {
  const periodoId = 'per-2026-10';
  const periodos = periodosDisponibles();
  const resultado = obtenerMovimientos(periodoId);
  return renderReporte({
    periodos,
    periodoId,
    resultado,
    estados: obtenerReportesFinancieros(periodoId, { resultado }),
    ...opciones
  });
}

beforeEach(() => {
  dom = crearDom();
  globalThis.localStorage.clear();
  inicializarContabilidad();
});

afterEach(() => {
  vi.restoreAllMocks();
  dom.window.close();
});

describe('exportación desde la vista de reportes', () => {
  it('muestra los botones y descarga el archivo sin mostrar advertencias', () => {
    renderVista();

    const pdf = document.querySelector('[data-exportar-pdf]');
    const excel = document.querySelector('[data-exportar-excel]');
    expect(pdf).not.toBeNull();
    expect(excel).not.toBeNull();
    expect(pdf.textContent).toBe('Exportar PDF');
    expect(excel.textContent).toBe('Exportar Excel');
    expect(pdf.classList.contains('boton-destacado')).toBe(true);
    expect(excel.classList.contains('boton-destacado')).toBe(true);

    if (typeof globalThis.URL.createObjectURL !== 'function') {
      globalThis.URL.createObjectURL = () => 'blob:prueba';
      globalThis.URL.revokeObjectURL = () => {};
    }
    const crearUrl = vi.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:prueba');
    const clic = vi.spyOn(dom.window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    excel.click();

    expect(crearUrl).toHaveBeenCalledOnce();
    expect(clic).toHaveBeenCalledOnce();
    expect(document.querySelector('[data-advertencia-exportacion]').hidden).toBe(true);
  });

  it('oculta los controles de exportación cuando no hay permiso', () => {
    renderVista({ puedeExportar: false });

    expect(document.querySelector('[data-exportar-pdf]')).toBeNull();
    expect(document.querySelector('[data-exportar-excel]')).toBeNull();
  });
});

describe('exportación por rol', () => {
  it.each(['administrador', 'contador', 'auditor'])('muestra los botones para %s con acceso a reportes', async (rol) => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: rol });
    qs('nav-reportes').click();

    expect(document.querySelector('[data-exportar-pdf]')).not.toBeNull();
    expect(document.querySelector('[data-exportar-excel]')).not.toBeNull();
  });

  it('oculta los botones al Tesorero sin acceso a reportes', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'tesorero' });
    qs('nav-reportes')?.click();

    expect(document.querySelector('[data-exportar-pdf]')).toBeNull();
    expect(document.querySelector('[data-exportar-excel]')).toBeNull();
  });
});
