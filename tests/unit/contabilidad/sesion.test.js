import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarAcceso, loadSesion } from '../../../src/contabilidad/almacenamiento.js';
import { iniciarSesion, cerrarSesion, obtenerSesionActiva, obtenerPanelInicio } from '../../../src/contabilidad/sesion.js';

describe('sesión de acceso', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    globalThis.sessionStorage = almacen;
    inicializarAcceso();
  });

  it('crea una sesión autenticada con permisos copiados', () => {
    const resultado = iniciarSesion('44.444.444-4', 'Auditor2026!');
    expect(resultado.ok).toBe(true);
    expect(loadSesion().estado).toBe('autenticada');
    expect(resultado.sesion.permisos.length).toBeGreaterThan(0);
    expect(resultado.sesion.usuarioRut).toBe('44.444.444-4');
    expect(loadSesion().usuarioRut).toBe('44.444.444-4');
    expect(obtenerPanelInicio()).toBe('auditoria');
  });

  it('propaga errores por campo cuando faltan credenciales', () => {
    const resultado = iniciarSesion('', '');

    expect(resultado.ok).toBe(false);
    expect(resultado.errores.rut).toContain('obligatorio');
    expect(resultado.errores.contraseña).toContain('obligatoria');
  });

  it('devuelve null cuando no hay sesión activa', () => {
    expect(obtenerSesionActiva()).toBeNull();
  });

  it('elimina la sesión al cerrar', () => {
    iniciarSesion('11.111.111-1', 'Admin2026!');
    cerrarSesion();
    expect(loadSesion()).toBeNull();
    expect(obtenerSesionActiva()).toBeNull();
  });
});
