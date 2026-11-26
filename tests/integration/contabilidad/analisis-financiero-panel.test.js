import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

function sigue(anterior, posterior) {
  return Boolean(anterior.compareDocumentPosition(posterior) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
}

describe('sección Análisis financiero del Panel del Administrador', () => {
  it('ubica las gráficas entre el estado de periodos y las acciones', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const vista = qs('view-panel-inicio');
    const estado = vista.querySelector('[data-panel-seccion="estado-periodos"]');
    const analisis = vista.querySelector('[data-panel-seccion="analisis-financiero"]');
    const acciones = vista.querySelector('.panel-inicio-acciones');

    expect(analisis.querySelector('h3').textContent).toBe('Análisis financiero');
    expect(sigue(estado, analisis)).toBe(true);
    expect(sigue(analisis, acciones)).toBe(true);
    expect(analisis.querySelectorAll('.chart-card')).toHaveLength(3);
    expect(analisis.querySelector('[data-grafica="ingresos-gastos"] svg')).not.toBeNull();
    expect(analisis.querySelector('[data-grafica="resultado"] svg')).not.toBeNull();
    expect(analisis.querySelector('[data-grafica="gastos-cuenta"] svg')).not.toBeNull();
  });

  it('muestra tooltips en CLP y el periodo seleccionado', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const analisis = qs('view-panel-inicio').querySelector('[data-panel-seccion="analisis-financiero"]');
    expect(analisis.querySelector('#chart-gastos-periodo').textContent).toBe('2026-11');
    expect(analisis.querySelector('.chart-donut-segment title').textContent).toMatch(/\$\d/);
  });

  it('recalcula la dona al cambiar el periodo desde el panel financiero', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-dashboard').click();
    const analisis = qs('view-panel-inicio').querySelector('[data-panel-seccion="analisis-financiero"]');
    const periodoInicial = analisis.querySelector('#chart-gastos-periodo').textContent;
    elegir(qs('dashboard-periodo'), 'per-2026-08');
    expect(analisis.querySelector('#chart-gastos-periodo').textContent).not.toBe(periodoInicial);
    expect(analisis.querySelector('#chart-gastos-periodo').textContent).toBe('2026-08');
  });

  it('no monta la sección para roles distintos del administrador', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });
    expect(qs('view-panel-inicio').querySelector('[data-panel-seccion="analisis-financiero"]')).toBeNull();
  });
});
