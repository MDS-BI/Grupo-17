import { describe, it, expect, afterEach, vi } from 'vitest';
import { esFechaValida, compararFechas, periodoContieneFecha, haySolapamiento, fechaHoyISO } from '../../../src/contabilidad/fechas.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('esFechaValida', () => {
  it('acepta fechas ISO válidas, bisiestos y límites de mes', () => {
    expect(esFechaValida('2024-02-29')).toBe(true);
    expect(esFechaValida('2023-02-28')).toBe(true);
    expect(esFechaValida('2026-01-01')).toBe(true);
    expect(esFechaValida('2026-12-31')).toBe(true);
  });

  it('rechaza fechas inexistentes', () => {
    expect(esFechaValida('2023-02-29')).toBe(false);
    expect(esFechaValida('2026-04-31')).toBe(false);
    expect(esFechaValida('2026-13-01')).toBe(false);
    expect(esFechaValida('2026-00-10')).toBe(false);
    expect(esFechaValida('2026-10-00')).toBe(false);
  });

  it('rechaza formatos y tipos inválidos', () => {
    expect(esFechaValida('')).toBe(false);
    expect(esFechaValida(null)).toBe(false);
    expect(esFechaValida(undefined)).toBe(false);
    expect(esFechaValida(20261231)).toBe(false);
    expect(esFechaValida('2026-1-01')).toBe(false);
    expect(esFechaValida('2026-12-01T00:00:00Z')).toBe(false);
  });
});

describe('compararFechas', () => {
  it('ordena fechas ISO en ambos sentidos', () => {
    expect(compararFechas('2026-12-31', '2027-01-01')).toBe(-1);
    expect(compararFechas('2026-12-31', '2026-12-31')).toBe(0);
    expect(compararFechas('2027-01-01', '2026-12-31')).toBe(1);
  });

  it('devuelve 0 para la misma referencia', () => {
    const fecha = { startDate: '2026-12-01' };
    expect(compararFechas(fecha, fecha)).toBe(0);
  });
});

describe('periodoContieneFecha', () => {
  const periodo = { startDate: '2026-12-01', endDate: '2026-12-31' };

  it('incluye las fechas límite y las interiores', () => {
    expect(periodoContieneFecha(periodo, '2026-12-01')).toBe(true);
    expect(periodoContieneFecha(periodo, '2026-12-15')).toBe(true);
    expect(periodoContieneFecha(periodo, '2026-12-31')).toBe(true);
  });

  it('excluye fechas anteriores y posteriores', () => {
    expect(periodoContieneFecha(periodo, '2026-11-30')).toBe(false);
    expect(periodoContieneFecha(periodo, '2027-01-01')).toBe(false);
  });

  it('incluye límites en periodos que cruzan el fin de año', () => {
    const cruceAnio = { startDate: '2026-12-31', endDate: '2027-01-01' };
    expect(periodoContieneFecha(cruceAnio, '2026-12-31')).toBe(true);
    expect(periodoContieneFecha(cruceAnio, '2027-01-01')).toBe(true);
    expect(periodoContieneFecha(cruceAnio, '2027-01-02')).toBe(false);
  });

  it('rechaza periodos nulos o fechas inválidas', () => {
    expect(periodoContieneFecha(null, '2026-12-15')).toBe(false);
    expect(periodoContieneFecha(periodo, '2026-13-01')).toBe(false);
    expect(periodoContieneFecha(periodo, '')).toBe(false);
  });
});

describe('haySolapamiento', () => {
  const periodo = { startDate: '2026-12-01', endDate: '2026-12-31' };

  it('detecta solapamientos idénticos, parciales, por límite y por contención', () => {
    expect(haySolapamiento(periodo, { startDate: '2026-12-01', endDate: '2026-12-31' })).toBe(true);
    expect(haySolapamiento(periodo, { startDate: '2026-12-15', endDate: '2027-01-15' })).toBe(true);
    expect(haySolapamiento(periodo, { startDate: '2026-11-15', endDate: '2026-12-01' })).toBe(true);
    expect(haySolapamiento(periodo, { startDate: '2026-11-01', endDate: '2027-01-31' })).toBe(true);
  });

  it('no considera solapados los periodos adyacentes', () => {
    const siguiente = { startDate: '2027-01-01', endDate: '2027-01-31' };
    const anterior = { startDate: '2026-11-01', endDate: '2026-11-30' };

    expect(haySolapamiento(periodo, siguiente)).toBe(false);
    expect(haySolapamiento(siguiente, periodo)).toBe(false);
    expect(haySolapamiento(periodo, anterior)).toBe(false);
    expect(haySolapamiento(anterior, periodo)).toBe(false);
  });

  it('devuelve false si falta algun periodo', () => {
    expect(haySolapamiento(null, periodo)).toBe(false);
    expect(haySolapamiento(periodo, null)).toBe(false);
    expect(haySolapamiento(null, null)).toBe(false);
  });
});

describe('fechaHoyISO', () => {
  it('devuelve la fecha actual en formato AAAA-MM-DD', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-23T12:34:56.000Z'));

    const hoy = fechaHoyISO();
    expect(hoy).toBe('2026-11-23');
    expect(esFechaValida(hoy)).toBe(true);
  });
});
