import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad, loadAsientos, saveAsientos, loadLineas, saveLineas } from '../../../src/contabilidad/almacenamiento.js';
import { calcularGastosPorCuenta } from '../../../src/contabilidad/reportes.js';

function vaciarMovimientos(periodoId) {
  const asientos = loadAsientos().filter((asiento) => asiento.period_id !== periodoId);
  const ids = new Set(asientos.map((asiento) => asiento.id));
  saveAsientos(asientos);
  saveLineas(loadLineas().filter((linea) => ids.has(linea.asiento_id)));
}

beforeEach(() => {
  const almacen = instalarAlmacen();
  almacen.clear();
  inicializarContabilidad();
});

describe('gastos por cuenta', () => {
  it('calcula la distribución aprobada del periodo seleccionado en centavos', () => {
    const filas = calcularGastosPorCuenta('per-2026-11');
    expect(filas).toEqual([
      {
        cuentaId: 'cta-5020',
        codigo: '5020',
        nombre: 'Renta',
        gastoCentavos: 60000,
        porcentaje: 100
      }
    ]);
  });

  it('excluye borradores de la distribución del periodo', () => {
    const filas = calcularGastosPorCuenta('per-2026-10');
    expect(filas).toHaveLength(1);
    expect(filas[0].codigo).toBe('5020');
    expect(filas[0].gastoCentavos).toBe(250000);
    expect(filas.every((fila) => fila.codigo !== '5010')).toBe(true);
  });

  it('excluye asientos cancelados y ordena por gasto descendente', () => {
    const filas = calcularGastosPorCuenta('per-2026-08');
    expect(filas).toHaveLength(1);
    expect(filas[0].codigo).toBe('5010');
    expect(filas[0].gastoCentavos).toBe(90000);
    expect(filas.every((fila) => fila.codigo !== '5030')).toBe(true);
  });

  it('devuelve una lista vacía cuando el periodo no tiene gastos aprobados', () => {
    vaciarMovimientos('per-2026-11');
    expect(calcularGastosPorCuenta('per-2026-11')).toEqual([]);
  });
});
