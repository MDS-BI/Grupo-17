import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('interfaz profesional y cierre integral', () => {
  it('mantiene la identidad corporativa fija sin opción de menú', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });

    expect(qs('brand-name').textContent).toBe('Contabilidad y Finanzas');
    expect(qs('empresa-nombre').textContent).toBe('Comercial Los Andes SpA');
    expect(qs('logo-mark').querySelector('svg')).not.toBeNull();
    const { renderizarPanelPorRol } = await import('../../../src/components/panel-por-rol.js');
    const panel = document.createElement('div');
    renderizarPanelPorRol({
      sesion: { rolId: 'administrador', nombreRol: 'Administrador financiero' },
      contenedor: panel,
      onNavegar: () => {}
    });
    expect(panel.textContent).toContain('Consulta y cierre de periodos.');

    const navConfig = [...document.querySelectorAll('.nav-module')]
      .find((boton) => boton.dataset.destino === 'configInterfaz');
    expect(!navConfig || navConfig.hidden).toBe(true);
  });

  it('propaga el tema configurado a los tokens principales', async () => {
    await bootContabilidad({ theme: { accentColor: '#123456' } }, { requireAccess: true, sesion: 'administrador' });

    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#123456');
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#123456');
    expect(document.documentElement.style.getPropertyValue('--primary-dark')).toContain('color-mix');
  });

  it('cierra un periodo desde el listado y deja constancia en auditoría', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-periodos').click();

    document.querySelector('[data-action="cerrar-periodo"][data-id="per-2026-11"]').click();

    expect(qs('periodos-lista').textContent).toContain('cerrado');
    expect(qs('periodos-lista').querySelectorAll('.estado-ok').length).toBeGreaterThan(0);

    qs('nav-reportes').click();
    const actividad = document.querySelector('[data-registro-actividad]');
    expect(actividad.hidden).toBe(true);
  });

  it('bloquea el cierre de un periodo con asientos inconsistentes', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const {
      loadAsientos,
      loadLineas,
      saveAsientos,
      saveLineas
    } = await import('../../../src/contabilidad/almacenamiento.js');

    saveAsientos([...loadAsientos(), {
      id: 'asi-inconsistente',
      series: 'DI',
      folio: 9900,
      date: '2026-11-04',
      period_id: 'per-2026-11',
      concept: 'Asiento desbalanceado',
      status: 'aprobado',
      totalDebit: 100,
      totalCredit: 50
    }]);
    saveLineas([...loadLineas(), {
      id: 'lin-inconsistente',
      asiento_id: 'asi-inconsistente',
      cuenta_id: 'cta-1010',
      debit: 100,
      credit: 50
    }]);

    qs('nav-periodos').click();
    document.querySelector('[data-action="cerrar-periodo"][data-id="per-2026-11"]').click();

    expect(qs('error-periodo-name').textContent).toContain('no está cuadrado');
    expect(qs('periodos-lista').textContent).toContain('abierto');
  });
});
