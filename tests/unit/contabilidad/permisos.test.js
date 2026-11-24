import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarAcceso } from '../../../src/contabilidad/almacenamiento.js';
import { iniciarSesion } from '../../../src/contabilidad/sesion.js';
import { matrizPorRol, opcionesMenu, puedeAcceder, puedeEjecutar, normalizarSeccion, puedeExportar, puedeVerAlertas } from '../../../src/contabilidad/permisos.js';

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

  it('permite exportar reportes solo con acceso de gestión o lectura', () => {
    const sesiones = [
      ['11.111.111-1', 'Admin2026!', true],
      ['22.222.222-2', 'Contador2026!', true],
      ['33.333.333-3', 'Tesorero2026!', false],
      ['44.444.444-4', 'Auditor2026!', true]
    ];
    sesiones.forEach(([rut, contraseña, esperado]) => {
      const sesion = iniciarSesion(rut, contraseña).sesion;
      expect(puedeExportar(sesion, 'reportes')).toBe(esperado);
    });
  });

  it('muestra alertas de vencimiento solo al tesorero', () => {
    const roles = [
      ['11.111.111-1', 'Admin2026!', false],
      ['22.222.222-2', 'Contador2026!', false],
      ['33.333.333-3', 'Tesorero2026!', true],
      ['44.444.444-4', 'Auditor2026!', false]
    ];
    roles.forEach(([rut, contraseña, esperado]) => {
      const sesion = iniciarSesion(rut, contraseña).sesion;
      expect(puedeVerAlertas(sesion)).toBe(esperado);
    });
  });
});
