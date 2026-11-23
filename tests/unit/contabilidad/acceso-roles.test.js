import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarAcceso, loadRoles, loadUsuarios } from '../../../src/contabilidad/almacenamiento.js';
import { CATALOGO_ROLES, permisosDelRol, panelDelRol } from '../../../src/contabilidad/roles.js';
import { iniciarSesion, cerrarSesion, obtenerPanelInicio } from '../../../src/contabilidad/sesion.js';
import { normalizarRUT, validarFormatoRUT } from '../../../src/contabilidad/validaciones-acceso.js';
import { matrizPorRol, opcionesMenu, puedeAcceder, puedeEjecutar } from '../../../src/contabilidad/permisos.js';

describe('acceso por roles', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    globalThis.sessionStorage = almacen;
    inicializarAcceso();
  });

  it('normaliza RUT y valida su formato', () => {
    expect(normalizarRUT('11.111.111-1')).toBe('111111111');
    expect(validarFormatoRUT('11.111.111-1')).toBe(true);
    expect(validarFormatoRUT('abc')).toBe(false);
  });

  it('registra cuatro roles y cuatro usuarios de demostración', () => {
    expect(CATALOGO_ROLES).toHaveLength(4);
    expect(loadRoles()).toHaveLength(4);
    expect(loadUsuarios()).toHaveLength(4);
    expect(panelDelRol('administrador')).toBe('integral');
    expect(panelDelRol('contador')).toBe('contable');
    expect(panelDelRol('tesorero')).toBe('tesoreria');
    expect(panelDelRol('auditor')).toBe('auditoria');
  });

  it('rechaza credenciales inválidas con mensaje genérico', () => {
    const resultado = iniciarSesion('11.111.111-1', 'incorrecta');
    expect(resultado.ok).toBe(false);
    expect(resultado.error).toBe('RUT o contraseña incorrectos');
  });

  it('inicia sesión, guarda permisos y cierra la sesión', () => {
    const resultado = iniciarSesion('11.111.111-1', 'Admin2026!');
    expect(resultado.ok).toBe(true);
    expect(resultado.sesion.rolId).toBe('administrador');
    expect(obtenerPanelInicio()).toBe('integral');
    expect(puedeAcceder('reportes', resultado.sesion)).toBe(true);
    expect(puedeEjecutar('restablecerDatos', resultado.sesion)).toBe(true);
    cerrarSesion();
    expect(puedeAcceder('reportes')).toBe(false);
  });

  it('ocultaEntidades, documentos y búsqueda para todos los roles', () => {
    const matriz = matrizPorRol();
    for (const rol of CATALOGO_ROLES) {
      expect(matriz[rol.id].entidades).toBe('noDisponible');
      expect(matriz[rol.id].documentos).toBe('noDisponible');
      expect(matriz[rol.id].busqueda).toBe('noDisponible');
    }
  });

  it('filtra el menú según el rol activo', () => {
    const sesion = iniciarSesion('33.333.333-3', 'Tesorero2026!').sesion;
    const opciones = opcionesMenu(sesion).map((opcion) => opcion.seccion);
    expect(opciones).toEqual(['panel', 'pagos']);
    expect(permisosDelRol('auditor').find((permiso) => permiso.seccion === 'pagos').acceso).toBe('noDisponible');
  });
});
