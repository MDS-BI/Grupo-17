import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('permisos por rol en la interfaz', () => {
  it('muestra a la contadora las secciones contables y oculta pagos', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'contador' });
    expect(qs('nav-cuentas').hidden).toBe(false);
    expect(qs('nav-asientos').hidden).toBe(false);
    expect(qs('nav-pagos').hidden).toBe(true);
    expect(qs('nav-periodos').hidden).toBe(true);
  });

  it('bloquea al auditor la gestión de cuentas', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });
    qs('nav-cuentas').click();
    expect(qs('view-bloqueo').hidden).toBe(false);
    expect(qs('view-cuentas').hidden).toBe(true);
  });

  it('permite al tesorero marcar pagos pero no cargar datos de ejemplo', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'tesorero' });
    qs('nav-pagos').click();
    expect(qs('view-pagos').hidden).toBe(false);
    const marcar = document.querySelector('[data-action="marcar-pagado"]');
    expect(marcar).not.toBeNull();
    expect(qs('view-panel-inicio').textContent).not.toContain('Cargar datos de ejemplo');
  });
});
