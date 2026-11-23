import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { generarSemilla, generarRoles, generarUsuarios, generarSemillaBase } from '../../../src/contabilidad/semilla.js';

describe('semilla de datos de ejemplo', () => {
  let almacen;

  beforeEach(() => {
    almacen = instalarAlmacen();
    almacen.clear();
  });

  it('es determinista', () => {
    const base = generarSemillaBase();
    const primera = JSON.stringify(generarSemilla(base));
    const segunda = JSON.stringify(generarSemilla(base));
    expect(primera).toBe(segunda);
  });

  it('cumple los mínimos acordados', () => {
    const datos = generarSemilla(generarSemillaBase());
    expect(datos.periodos).toHaveLength(4);
    expect(datos.cuentas.length).toBeGreaterThanOrEqual(8);
    expect(datos.asientos.length).toBeGreaterThanOrEqual(6);
    expect(datos.pagos.length).toBeGreaterThanOrEqual(3);
  });

  it('incluye usuarios y roles para los cuatro perfiles', () => {
    expect(generarUsuarios()).toHaveLength(4);
    expect(generarRoles()).toHaveLength(4);
  });
});
