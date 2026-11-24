import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('alertas de vencimientos por rol', () => {
  it('muestra vencidos y próximos a vencer en el panel del tesorero', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'tesorero' });

    const alertas = qs('panel-alertas');
    expect(alertas).not.toBeNull();
    expect(alertas.hidden).toBe(false);
    expect(alertas.textContent).toContain('Pagos vencidos');
    expect(alertas.textContent).toContain('Vencen esta semana');
    expect(qs('panel-sin-alertas').hidden).toBe(true);
  });

  it('muestra las mismas alertas en el panel financiero del tesorero', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'tesorero' });
    qs('nav-dashboard').click();

    expect(qs('dashboard-alertas').hidden).toBe(false);
    expect(qs('dashboard-alertas').textContent).toContain('Pagos vencidos');
    expect(qs('dashboard-alertas').textContent).toContain('Vencen esta semana');
  });

  it('oculta las alertas a roles sin permiso', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'contador' });

    expect(qs('panel-alertas')).toBeNull();
    qs('nav-dashboard').click();
    expect(qs('dashboard-alertas').hidden).toBe(true);
  });
});
