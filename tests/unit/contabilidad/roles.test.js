import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarAcceso } from '../../../src/contabilidad/almacenamiento.js';
import { CATALOGO_ROLES, obtenerRol, permisosDelRol, accionesDelRol, panelDelRol } from '../../../src/contabilidad/roles.js';

describe('catálogo de roles', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    inicializarAcceso();
  });

  it('expone los cuatro roles con panel inicial', () => {
    expect(CATALOGO_ROLES.map((rol) => rol.id)).toEqual(['administrador', 'contador', 'tesorero', 'auditor']);
    expect(panelDelRol('tesorero')).toBe('tesoreria');
  });

  it('consulta permisos y acciones por rol', () => {
    expect(obtenerRol('auditor').nombre).toBe('Auditor');
    expect(permisosDelRol('contador').length).toBeGreaterThan(0);
    expect(accionesDelRol('administrador')).toContain('restablecerDatos');
  });
});
