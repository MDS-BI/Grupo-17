import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';
import { loadPeriodos, loadRoles, loadUsuarios } from '../../../src/contabilidad/almacenamiento.js';

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
    qs('view-panel-inicio').querySelector('[data-accion="cargar-datos"]').click();
    expect(loadPeriodos()).toHaveLength(antes);
    expect(qs('mensaje-panel').textContent).toContain('Datos de ejemplo cargados');
  });

  it('restablece el estado inicial conservando usuarios y roles', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('view-panel-inicio').querySelector('[data-accion="restablecer-datos"]').click();
    expect(loadPeriodos()).toHaveLength(0);
    expect(loadUsuarios()).toHaveLength(4);
    expect(loadRoles()).toHaveLength(4);
  });

  it('no muestra acciones de semilla a otros roles', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'auditor' });
    expect(qs('view-panel-inicio').querySelector('[data-accion="cargar-datos"]')).toBeNull();
    expect(qs('view-panel-inicio').querySelector('[data-accion="restablecer-datos"]')).toBeNull();
  });
});
