import { describe, it, expect } from 'vitest';
import {
  MAPA_NAVEGACION,
  esAccion,
  obtenerMapaNavegacion,
  navegar,
  validarUnicidadControles
} from '../../../src/components/menu.js';

const permisos = [
  { seccion: 'panel', visibleEnMenu: true, acceso: 'ver' },
  { seccion: 'pagos', visibleEnMenu: true, acceso: 'registrarConsultar' }
];

describe('mapa de navegación única', () => {
  it('no incluye entidades, documentos ni búsqueda', () => {
    const destinos = MAPA_NAVEGACION.map((item) => item.pantalla);
    expect(destinos).not.toContain('entities');
    expect(destinos).not.toContain('documents');
    expect(destinos).not.toContain('search');
  });

  it('devuelve una copia del mapa y reconoce acciones', () => {
    const copia = obtenerMapaNavegacion();
    copia[0].roles.push('extra');
    expect(MAPA_NAVEGACION[0].roles).not.toContain('extra');
    expect(esAccion('cerrarSesion')).toBe(true);
    expect(esAccion('pagos')).toBe(false);
  });

  it('permite sólo secciones autorizadas', () => {
    expect(navegar('pagos', permisos).permitido).toBe(true);
    expect(navegar('cuentas', permisos).permitido).toBe(false);
    expect(navegar('entities', permisos).mensaje).toBe('Sección no disponible');
  });

  it('detecta controles duplicados visibles', () => {
    const controles = [
      { hidden: false, dataset: { destino: 'pagos' } },
      { hidden: false, dataset: { destino: 'pagos' } },
      { hidden: true, dataset: { destino: 'cuentas' } }
    ];
    expect(validarUnicidadControles(controles)).toBe(false);
  });
});
