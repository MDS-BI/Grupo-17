import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

function textoPanel() {
  return qs('view-panel-inicio').textContent;
}

function controlesDemo() {
  return qs('view-panel-inicio').querySelectorAll('[data-accion="cargar-datos"], [data-accion="restablecer-datos"]');
}

function esperarContenido(contenidos) {
  const texto = textoPanel();
  for (const contenido of contenidos) expect(texto).toContain(contenido);
}

function esperarSinControlesDemo() {
  expect(controlesDemo()).toHaveLength(0);
  expect(textoPanel()).not.toContain('Cargar datos de ejemplo');
  expect(textoPanel()).not.toContain('Restablecer datos');
}

describe('paneles de inicio diferenciados por rol', () => {
  it('muestra el panel integral y los controles de ejemplo solo al administrador', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });

    expect(qs('view-panel-inicio').dataset.panelRol).toBe('administrador');
    esperarContenido(['Resumen integral', 'Estado de periodos', 'Asuntos prioritarios', 'Ingresos del periodo']);
    expect(controlesDemo()).toHaveLength(2);
    expect(qs('view-panel-inicio').querySelector('[data-accion="restablecer-datos"]').textContent.trim()).toBe('Restablecer datos');
    expect(textoPanel()).not.toContain('Restablecer datos de ejemplo');
    expect(textoPanel()).not.toContain('Plan de cuentas');
    expect(textoPanel()).not.toContain('Flujo de efectivo');
    expect(textoPanel()).not.toContain('Trazabilidad de movimientos');
    expect(qs('panel-alertas')).toBeNull();
    expect(qs('view-panel-inicio').querySelector('[data-accion="cerrar-sesion"]')).not.toBeNull();
  });

  it('muestra cuentas, asientos y reportes al contador sin controles de ejemplo', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'contador' });

    expect(qs('view-panel-inicio').dataset.panelRol).toBe('contador');
    esperarContenido(['Plan de cuentas', 'Control de asientos', 'Reportes disponibles']);
    esperarSinControlesDemo();
    expect(textoPanel()).not.toContain('Resumen integral');
    expect(textoPanel()).not.toContain('Estado de periodos');
    expect(textoPanel()).not.toContain('Flujo de efectivo');
    expect(textoPanel()).not.toContain('Trazabilidad de movimientos');
    expect(qs('panel-alertas')).toBeNull();
    expect(qs('view-panel-inicio').querySelector('[data-accion="cerrar-sesion"]')).not.toBeNull();
  });

  it('muestra pagos, flujo de efectivo y alertas al tesorero sin controles de ejemplo', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'tesorero' });

    expect(qs('view-panel-inicio').dataset.panelRol).toBe('tesorero');
    esperarContenido(['Pagos y cobros', 'Flujo de efectivo', 'Vencimientos próximos']);
    esperarSinControlesDemo();
    expect(textoPanel()).not.toContain('Resumen integral');
    expect(textoPanel()).not.toContain('Plan de cuentas');
    expect(textoPanel()).not.toContain('Trazabilidad de movimientos');
    expect(qs('panel-alertas')).not.toBeNull();
    expect(qs('panel-alertas').hasAttribute('data-alertas-tesorero')).toBe(true);
    expect(qs('view-panel-inicio').querySelector('[data-accion="cerrar-sesion"]')).not.toBeNull();
  });

  it('muestra trazabilidad e historial al auditor sin controles de ejemplo', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });

    expect(qs('view-panel-inicio').dataset.panelRol).toBe('auditor');
    esperarContenido(['Trazabilidad de movimientos', 'Reportes financieros', 'Historial para consulta']);
    esperarSinControlesDemo();
    expect(textoPanel()).not.toContain('Resumen integral');
    expect(textoPanel()).not.toContain('Plan de cuentas');
    expect(textoPanel()).not.toContain('Flujo de efectivo');
    expect(qs('panel-alertas')).toBeNull();
    expect(qs('view-panel-inicio').querySelector('[data-accion="cerrar-sesion"]')).not.toBeNull();
  });
});
