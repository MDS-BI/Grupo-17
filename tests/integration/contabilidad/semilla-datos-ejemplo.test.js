import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, enviar } from '../../setup/contabilidad.js';
import {
  cargarDatosEjemplo,
  loadAsientos,
  loadPagos,
  loadPeriodos,
  loadRoles,
  loadUsuarios,
  restablecerEstadoInicial
} from '../../../src/contabilidad/almacenamiento.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('cargar y restablecer datos de ejemplo', () => {
  it('permite al administrador recargar la semilla sin duplicados', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const antes = loadPeriodos().length;
    const asientosCerrados = loadAsientos().filter((asiento) => asiento.period_id === 'per-2026-09').map((asiento) => asiento.id);
    qs('view-panel-inicio').querySelector('[data-accion="cargar-datos"]').click();
    expect(loadPeriodos()).toHaveLength(antes);
    expect(loadPeriodos().find((periodo) => periodo.id === 'per-2026-09').status).toBe('cerrado');
    expect(loadPeriodos().find((periodo) => periodo.id === 'per-2026-07').status).toBe('cerrado');
    expect(asientosCerrados).toEqual([]);
    expect(loadPagos().filter((pago) => pago.date.startsWith('2026-09'))).toEqual([]);
    expect(loadAsientos().filter((asiento) => asiento.period_id === 'per-2026-09').map((asiento) => asiento.id)).toEqual(asientosCerrados);
    expect(qs('mensaje-panel').textContent).toContain('Datos de ejemplo cargados');
  });

  it('carga fechas idénticas en dos cargas consecutivas', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    cargarDatosEjemplo();
    const primera = JSON.stringify(loadPagos().map((pago) => [pago.id, pago.fechaVencimiento]));
    cargarDatosEjemplo();
    const segunda = JSON.stringify(loadPagos().map((pago) => [pago.id, pago.fechaVencimiento]));
    expect(segunda).toBe(primera);
  });

  it('conserva periodos y registros cerrados al restablecer y cargar de nuevo', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const asientosCerrados = loadAsientos().filter((asiento) => asiento.period_id === 'per-2026-09').map((asiento) => asiento.id);
    const pagosCerrados = loadPagos().filter((pago) => pago.date.startsWith('2026-09')).map((pago) => pago.id);
    restablecerEstadoInicial();
    expect(loadPeriodos()).toHaveLength(0);
    cargarDatosEjemplo();
    expect(loadPeriodos().filter((periodo) => periodo.status === 'cerrado').map((periodo) => periodo.id)).toEqual(['per-2026-07', 'per-2026-09']);
    expect(loadAsientos().filter((asiento) => asiento.period_id === 'per-2026-09').map((asiento) => asiento.id)).toEqual(asientosCerrados);
    expect(loadPagos().filter((pago) => pago.date.startsWith('2026-09')).map((pago) => pago.id)).toEqual(pagosCerrados);
  });

  it('restablece el estado inicial conservando usuarios y roles', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('view-panel-inicio').querySelector('[data-accion="restablecer-datos"]').click();
    expect(loadPeriodos()).toHaveLength(0);
    expect(loadUsuarios()).toHaveLength(4);
    expect(loadRoles()).toHaveLength(4);
  });

  it('carga los datos de ejemplo al iniciar sesión cuando no hay periodos', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    restablecerEstadoInicial();
    expect(loadPeriodos()).toHaveLength(0);

    qs('acceso-rut').value = '11.111.111-1';
    qs('acceso-contraseña').value = 'Admin2026!';
    enviar(qs('acceso-formulario'));

    expect(loadPeriodos()).toHaveLength(5);
    expect(qs('view-panel-inicio').textContent).toContain('Abiertos: 3 · Cerrados: 2');
  });

  it('carga y restablece los datos desde el panel financiero sin abandonar la vista', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const dashboard = qs('view-dashboard');
    qs('nav-dashboard').click();

    dashboard.querySelector('[data-accion="restablecer-datos"]').click();
    expect(loadPeriodos()).toHaveLength(0);
    expect(dashboard.hidden).toBe(false);
    expect(qs('dashboard-empty').hidden).toBe(false);

    dashboard.querySelector('[data-accion="cargar-datos"]').click();
    expect(loadPeriodos()).toHaveLength(5);
    expect(dashboard.hidden).toBe(false);
    expect(qs('dashboard-periodo').options).toHaveLength(5);
    expect(qs('mensaje-confirmacion').textContent).toContain('Datos de ejemplo cargados');
  });

  it('no muestra acciones de semilla a otros roles', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });
    expect(qs('view-panel-inicio').querySelector('[data-accion="cargar-datos"]')).toBeNull();
    expect(qs('view-panel-inicio').querySelector('[data-accion="restablecer-datos"]')).toBeNull();
  });
});
