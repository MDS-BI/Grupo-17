import { describe, it, expect } from 'vitest';
import { aCentavos, formatearCLP, sumarCentavos } from '../../../src/contabilidad/dinero.js';
import { formatearMonto } from '../../../src/components/contabilidad/comun.js';

describe('formato monetario chileno', () => {
  it('muestra tres cifras, cero y miles con punto de miles y sin decimales', () => {
    expect(formatearCLP(12345)).toBe('$123');
    expect(formatearCLP(0)).toBe('$0');
    expect(formatearCLP(500000)).toBe('$5.000');
    expect(formatearMonto(500000)).toBe('$5.000');
  });

  it('conserva los cálculos en centavos', () => {
    expect(aCentavos('10.50')).toBe(1050);
    expect(sumarCentavos([1050, 250, -300])).toBe(1000);
    expect(formatearCLP(1000)).toBe('$10');
  });
});
