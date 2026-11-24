import { describe, it, expect } from 'vitest';
import { normalizarImporte, aCentavos, formatearMXN, formatearMXNCompacto, sumarCentavos } from '../../../src/contabilidad/dinero.js';

describe('normalizarImporte', () => {
  it('normaliza importes válidos a centavos', () => {
    expect(normalizarImporte('0')).toEqual({ valido: true, centavos: 0 });
    expect(normalizarImporte('0.1')).toEqual({ valido: true, centavos: 10 });
    expect(normalizarImporte('0.01')).toEqual({ valido: true, centavos: 1 });
    expect(normalizarImporte('-1.50')).toEqual({ valido: true, centavos: -150 });
  });

  it('acepta una sola coma decimal y espacios circundantes', () => {
    expect(normalizarImporte(' 1,50 ')).toEqual({ valido: true, centavos: 150 });
    expect(normalizarImporte('-0,05')).toEqual({ valido: true, centavos: -5 });
  });

  it('rechaza el formato con separador de miles "1,234.56"', () => {
    expect(normalizarImporte('1,234.56')).toEqual({
      valido: false,
      error: 'El importe debe ser un número con hasta 2 decimales'
    });
  });

  it('rechaza formatos inválidos, vacíos y nulos', () => {
    const errorFormato = { valido: false, error: 'El importe debe ser un número con hasta 2 decimales' };
    const errorObligatorio = { valido: false, error: 'El importe es obligatorio' };

    expect(normalizarImporte('1.234')).toEqual(errorFormato);
    expect(normalizarImporte('abc')).toEqual(errorFormato);
    expect(normalizarImporte('')).toEqual(errorObligatorio);
    expect(normalizarImporte('   ')).toEqual(errorObligatorio);
    expect(normalizarImporte(null)).toEqual(errorObligatorio);
    expect(normalizarImporte(undefined)).toEqual(errorObligatorio);
  });

  it('rechaza importes fuera del rango de enteros seguros', () => {
    const errorRango = { valido: false, error: 'El importe excede el rango permitido' };

    expect(normalizarImporte('90071992547409.92')).toEqual(errorRango);
    expect(normalizarImporte('9999999999999999')).toEqual(errorRango);
  });
});

describe('aCentavos', () => {
  it('devuelve los centavos de importes válidos', () => {
    expect(aCentavos('0')).toBe(0);
    expect(aCentavos('0.01')).toBe(1);
    expect(aCentavos('-1.50')).toBe(-150);
    expect(aCentavos(1.5)).toBe(150);
  });

  it('devuelve 0 para importes inválidos', () => {
    expect(aCentavos('1.234')).toBe(0);
    expect(aCentavos('')).toBe(0);
    expect(aCentavos(null)).toBe(0);
    expect(aCentavos('9999999999999999')).toBe(0);
  });
});

describe('formatearMXNCompacto', () => {
  it('usa miles, millones y signo pesos desde centavos', () => {
    expect(formatearMXNCompacto(50000)).toBe('$500');
    expect(formatearMXNCompacto(150000)).toBe('$1.5k');
    expect(formatearMXNCompacto(250000000)).toBe('$2.5M');
    expect(formatearMXNCompacto(-150000)).toBe('$-1.5k');
  });
});

describe('sumarCentavos', () => {
  it('devuelve 0 para un arreglo vacío', () => {
    expect(sumarCentavos([])).toBe(0);
  });

  it('suma importes negativos y positivos', () => {
    expect(sumarCentavos([-150, 250, -100])).toBe(0);
    expect(sumarCentavos([-150, -50])).toBe(-200);
    expect(sumarCentavos([0, 0])).toBe(0);
  });

  it('acepta centavos enteros expresados como número o cadena', () => {
    expect(sumarCentavos([10, '25', -5])).toBe(30);
    expect(aCentavos('10.50')).toBe(1050);
    expect(sumarCentavos([aCentavos('10.50'), 25])).toBe(1075);
  });

  it('rechaza importes que no son centavos enteros', () => {
    expect(() => sumarCentavos([0.1, 0.2])).toThrow(/centavos enteros/);
    expect(() => sumarCentavos([100, null])).toThrow(/centavos enteros/);
    expect(() => sumarCentavos([100, 'abc'])).toThrow(/centavos enteros/);
  });

  it('suma valores grandes dentro del rango seguro', () => {
    expect(sumarCentavos([Number.MAX_SAFE_INTEGER - 1, 1])).toBe(Number.MAX_SAFE_INTEGER);
    expect(sumarCentavos([Number.MAX_SAFE_INTEGER, -1])).toBe(Number.MAX_SAFE_INTEGER - 1);
    expect(() => sumarCentavos([Number.MAX_SAFE_INTEGER, 1])).toThrow(/rango permitido/);
  });
});

describe('formatearMXN', () => {
  it('formatea centavos como MXN con dos decimales', () => {
    expect(formatearMXN(0)).toBe('$0.00');
    expect(formatearMXN(1)).toBe('$0.01');
    expect(formatearMXN(123456)).toBe('$1,234.56');
    expect(formatearMXN(-150)).toBe('-$1.50');
  });

  it('formatea importes grandes', () => {
    expect(formatearMXN(900719925475)).toBe('$9,007,199,254.75');
  });

  it('trata entradas inválidas como cero', () => {
    expect(formatearMXN(null)).toBe('$0.00');
    expect(formatearMXN('abc')).toBe('$0.00');
  });
});
