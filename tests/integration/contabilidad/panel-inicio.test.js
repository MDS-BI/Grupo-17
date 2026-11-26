import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir, enviar } from '../../setup/contabilidad.js';
import { formatearCLP } from '../../../src/contabilidad/dinero.js';
import { loadAsientos } from '../../../src/contabilidad/almacenamiento.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('panel de inicio de Contabilidad y Finanzas', () => {
  it('muestra el panel del administrador con secciones accesibles y controles de ejemplo', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const vista = qs('view-panel-inicio');

    expect(vista.hidden).toBe(false);
    expect(vista.querySelector('section[aria-label="Panel de inicio por rol"]')).not.toBeNull();
    expect(vista.dataset.panelRol).toBe('administrador');
    expect([...vista.querySelectorAll('[data-panel-seccion]')].map((seccion) => seccion.dataset.panelSeccion)).toEqual([
      'resumen-integral',
      'estado-periodos',
      'asuntos-prioritarios',
      'analisis-financiero'
    ]);
    expect([...vista.querySelectorAll('[data-panel-seccion] > h3')].map((titulo) => titulo.textContent)).toEqual([
      'Resumen integral',
      'Estado de periodos',
      'Asuntos prioritarios',
      'Análisis financiero'
    ]);
    expect(vista.textContent).toContain('Ingresos del periodo');
    expect(vista.textContent).toContain('Abiertos: 3 · Cerrados: 2');
    const filaPeriodo = [...vista.querySelectorAll('.panel-tabla-periodos tbody tr')]
      .find((fila) => fila.cells[0].textContent.trim() === '2026-11');
    expect(filaPeriodo).toBeTruthy();
    expect(filaPeriodo.cells[1].textContent.trim()).toBe('abierto');
    expect(vista.querySelector('[data-accion="cargar-datos"]').textContent.trim()).toBe('Cargar datos de ejemplo');
    expect(vista.querySelector('[data-accion="cargar-datos"]').classList.contains('boton-destacado')).toBe(true);
    expect(vista.querySelector('[data-accion="restablecer-datos"]').textContent.trim()).toBe('Restablecer datos');
    expect(vista.querySelector('[data-accion="cerrar-sesion"]').textContent.trim()).toBe('Cerrar sesión');

    const tarjetas = [...vista.querySelectorAll('[data-panel-seccion="resumen-integral"] .stat-card')];
    expect(tarjetas).toHaveLength(4);
    expect(tarjetas.map((tarjeta) => tarjeta.querySelector('.stat-value') !== null)).toEqual([true, true, true, true]);
    expect(tarjetas[0].classList.contains('stat-card-ingresos')).toBe(true);
    expect(tarjetas[1].classList.contains('stat-card-gastos')).toBe(true);
    expect(tarjetas[2].classList.contains('stat-card-negativo')).toBe(true);
    expect(vista.querySelector('[data-panel-seccion="estado-periodos"]').classList.contains('panel-seccion-periodos')).toBe(true);
    expect(vista.querySelector('[data-panel-seccion="asuntos-prioritarios"]').classList.contains('panel-seccion-prioritarios')).toBe(true);
    expect(vista.querySelector('[data-panel-seccion="analisis-financiero"]').classList.contains('panel-seccion-analisis')).toBe(true);
    expect(vista.querySelector('[data-panel-seccion="analisis-financiero"] .chart-grid')).not.toBeNull();
  });

  it('muestra las acciones de datos al final del panel financiero solo para el administrador', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-dashboard').click();
    const acciones = qs('view-dashboard').querySelector('[data-acciones-datos-ejemplo]');

    expect(acciones.hidden).toBe(false);
    expect(qs('view-dashboard').querySelector('.chart-grid')).toBeNull();
    expect(qs('view-panel-inicio').querySelector('[data-panel-seccion="analisis-financiero"] .chart-grid')).not.toBeNull();
    expect([...acciones.querySelectorAll('button')].map((boton) => boton.textContent.trim())).toEqual([
      'Cargar datos de ejemplo',
      'Restablecer datos'
    ]);
  });

  it('oculta las acciones de datos del panel financiero a otros roles', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });
    qs('nav-dashboard').click();

    expect(qs('view-dashboard').querySelector('[data-acciones-datos-ejemplo]').hidden).toBe(true);
  });

  it('muestra el panel del contador sin controles de ejemplo', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'contador' });
    const vista = qs('view-panel-inicio');

    expect(vista.dataset.panelRol).toBe('contador');
    expect([...vista.querySelectorAll('[data-panel-seccion]')].map((seccion) => seccion.dataset.panelSeccion)).toEqual([
      'plan-cuentas',
      'control-asientos',
      'reportes-disponibles'
    ]);
    expect(vista.textContent).toContain('Plan de cuentas');
    expect(vista.textContent).toContain('Cuentas registradas: 17');
    expect(vista.querySelector('[data-accion="cargar-datos"]')).toBeNull();
    expect(vista.querySelector('[data-accion="restablecer-datos"]')).toBeNull();
    expect(vista.querySelector('[data-accion="cerrar-sesion"]')).not.toBeNull();
  });

  it('navega a las secciones contables desde el menú lateral', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const destinos = [
      ['nav-asientos', 'view-asientos'],
      ['nav-cuentas', 'view-cuentas'],
      ['nav-pagos', 'view-pagos'],
      ['nav-reportes', 'view-reportes']
    ];

    for (const [botonId, vistaId] of destinos) {
      qs(botonId).click();
      expect(qs(vistaId).hidden).toBe(false);
      expect(qs('view-panel-inicio').hidden).toBe(true);
    }
  });

  it('muestra los indicadores financieros del periodo con movimientos', async () => {
    await bootContabilidad();
    qs('nav-cuentas').click();
    qs('nav-dashboard').click();

    expect([...qs('dashboard-periodo').options].map((opcion) => opcion.textContent)).toEqual([
      '2026-07 (cerrado)',
      '2026-08 (abierto)',
      '2026-09 (cerrado)',
      '2026-10 (abierto)',
      '2026-11 (abierto)'
    ]);
    expect(qs('dashboard-periodo').value).toBe('per-2026-11');
    expect(qs('stat-ingresos').textContent).toBe(formatearCLP(0));
    expect(qs('stat-gastos').textContent).toBe(formatearCLP(60000));
    expect(qs('stat-resultado').textContent).toBe(formatearCLP(-60000));
    expect(qs('stat-resultado').classList.contains('negative')).toBe(true);
    expect(qs('stat-asientos').textContent).toBe('1');
    expect(qs('dashboard-empty').hidden).toBe(true);
  });

  it('filtra los indicadores por el periodo seleccionado', async () => {
    await bootContabilidad();
    qs('nav-cuentas').click();
    qs('nav-dashboard').click();

    elegir(qs('dashboard-periodo'), 'per-2026-10');

    expect(qs('stat-ingresos').textContent).toBe(formatearCLP(100000));
    expect(qs('stat-gastos').textContent).toBe(formatearCLP(250000));
    expect(qs('stat-resultado').textContent).toBe(formatearCLP(-150000));
    expect(qs('stat-asientos').textContent).toBe('2');
    expect(qs('dashboard-empty').hidden).toBe(true);
  });

  it('actualiza los indicadores al aprobar un nuevo asiento', async () => {
    await bootContabilidad();
    qs('nav-asientos').click();

    qs('asiento-date').value = '2026-11-20';
    qs('asiento-concept').value = 'Ingreso adicional';
    qs('asiento-periodo').value = 'per-2026-11';
    qs('linea-cuenta-0').value = 'cta-1010';
    qs('linea-debit-0').value = '100';
    qs('linea-cuenta-1').value = 'cta-4010';
    qs('linea-credit-1').value = '100';
    enviar(qs('asiento-form'));

    const creado = loadAsientos().find((asiento) => asiento.concept === 'Ingreso adicional');
    document.querySelector(`[data-action="aprobar-asiento"][data-id="${creado.id}"]`).click();

    qs('nav-dashboard').click();

    expect(qs('dashboard-periodo').value).toBe('per-2026-11');
    expect(qs('stat-ingresos').textContent).toBe(formatearCLP(10000));
    expect(qs('stat-gastos').textContent).toBe(formatearCLP(60000));
    expect(qs('stat-resultado').textContent).toBe(formatearCLP(-50000));
    expect(qs('stat-asientos').textContent).toBe('2');
  });
});
