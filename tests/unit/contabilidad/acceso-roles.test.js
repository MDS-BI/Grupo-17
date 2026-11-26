import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarAcceso, loadRoles, loadUsuarios } from '../../../src/contabilidad/almacenamiento.js';
import { CATALOGO_ROLES, permisosDelRol, panelDelRol } from '../../../src/contabilidad/roles.js';
import { iniciarSesion, cerrarSesion, obtenerPanelInicio } from '../../../src/contabilidad/sesion.js';
import { MENSAJE_RUT_INVALIDO, calcularDigitoVerificador, formatearRUT, normalizarRUT, validarDigitoVerificador, validarFormatoRUT } from '../../../src/contabilidad/validaciones-acceso.js';
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

  it('formatea el RUT mientras se escribe y acepta k como dígito verificador', () => {
    expect(formatearRUT('1')).toBe('1');
    expect(formatearRUT('111111111')).toBe('11.111.111-1');
    expect(formatearRUT('11.111.111-1')).toBe('11.111.111-1');
    expect(formatearRUT('1111119k')).toBe('1.111.119-K');
    expect(calcularDigitoVerificador('1111119')).toBe('k');
    expect(validarDigitoVerificador('1.111.119-k')).toBe(true);
    expect(validarDigitoVerificador('1.111.119-K')).toBe(true);
    expect(normalizarRUT('1.111.119-k')).toBe(normalizarRUT('1.111.119-K'));
    expect(formatearRUT('11.111.111-')).toBe('11.111.111');
    expect(formatearRUT('1.111.119-')).toBe('1.111.119');
    expect(formatearRUT('11.111.1112')).toBe('11.111.111-2');
  });

  it('rechaza un dígito verificador inválido con mensaje específico', () => {
    const resultado = iniciarSesion('11.111.111-2', 'Admin2026!');
    expect(resultado.ok).toBe(false);
    expect(resultado.error).toBe(MENSAJE_RUT_INVALIDO);
    expect(resultado.errores.rut).toBe(MENSAJE_RUT_INVALIDO);
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

  it('valida los RUT de prueba y autentica con formato sin puntos ni guion', () => {
    const usuarios = loadUsuarios();
    expect(usuarios).toHaveLength(4);
    for (const usuario of usuarios) {
      expect(validarDigitoVerificador(usuario.rut)).toBe(true);
      expect(normalizarRUT(usuario.rut)).toBe(usuario.rutNormalizado);
    }
    const conPuntos = iniciarSesion('44.444.444-4', 'Auditor2026!');
    expect(conPuntos.ok).toBe(true);
    expect(conPuntos.sesion.rolId).toBe('auditor');
    const sinFormato = iniciarSesion('444444444', 'Auditor2026!');
    expect(sinFormato.ok).toBe(true);
    expect(normalizarRUT(sinFormato.sesion.usuarioRut)).toBe('444444444');
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
