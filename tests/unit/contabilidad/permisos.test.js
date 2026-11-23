import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarAcceso } from '../../../src/contabilidad/almacenamiento.js';
import { iniciarSesion } from '../../../src/contabilidad/sesion.js';
import { matrizPorRol, opcionesMenu, puedeAcceder, puedeEjecutar, normalizarSeccion } from '../../../src/contabilidad/permisos.js';

describe('matriz de permisos', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    globalThis.sessionStorage = almacen;
    inicializarAcceso();
  });

  it('normaliza destinos del menú', () => {
    expect(normalizarSeccion('dashboard')).toBe('panel');
    expect(normalizarSeccion('search')).toBe('busqueda');
  });

  it('describe el acceso por rol', () => {
    const matriz = matrizPorRol();
    expect(matriz.administrador.pagos).toBe('gestionar');
    expect(matriz.auditor.reportes).toBe('consultar');
    expect(matriz.tesorero.cuentas).toBe('noDisponible');
  });

  it('deriva opciones de menú desde la sesión', () => {
    const sesion = iniciarSesion('22.222.222-2', 'Contador2026!').sesion;
    expect(opcionesMenu(sesion).map((item) => item.seccion)).toEqual(['panel', 'resumen', 'cuentas', 'asientos', 'reportes']);
    expect(puedeAcceder('pagos', sesion)).toBe(false);
    expect(puedeEjecutar('crear', sesion)).toBe(true);
    expect(puedeEjecutar('restablecerDatos', sesion)).toBe(false);
  });
});
