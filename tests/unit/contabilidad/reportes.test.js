import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad, loadAsientos, saveAsientos, loadLineas, saveLineas } from '../../../src/contabilidad/almacenamiento.js';
import { obtenerMovimientos, calcularSaldosCuentas, periodosDisponibles } from '../../../src/contabilidad/reportes.js';

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

describe('reportes financieros por periodo', () => {
  it('genera movimientos con totales cuadrados para el periodo', () => {
    const reporte = obtenerMovimientos('per-2026-10');
    expect(reporte.vacio).toBe(false);
    expect(reporte.movimientos).toHaveLength(5);
    expect(reporte.totalDebit).toBe(366000);
    expect(reporte.totalCredit).toBe(366000);
    expect(reporte.movimientos[0].accountCode).toBeDefined();
    expect(reporte.movimientos[0].concept).toBeTruthy();
  });

  it('filtra por periodo y marca como vacío un periodo sin movimientos', () => {
    const septiembre = obtenerMovimientos('per-2026-09');
    expect(septiembre.vacio).toBe(true);
    expect(septiembre.movimientos).toHaveLength(0);
    expect(septiembre.totalDebit).toBe(0);

    const noviembreInicial = obtenerMovimientos('per-2026-11');
    expect(noviembreInicial.vacio).toBe(false);

    vaciarMovimientos('per-2026-11');
    const noviembre = obtenerMovimientos('per-2026-11');
    expect(noviembre.vacio).toBe(true);
    expect(noviembre.movimientos).toHaveLength(0);
    expect(noviembre.totalDebit).toBe(0);
  });

  it('procesa 500 asientos de forma consistente', () => {
    const asientos = [];
    const lineas = [];
    for(let i = 0; i < 500; i += 1){
      const id = `asi-masivo-${i}`;
      asientos.push({
        id, series: 'PR', folio: 2000 + i, date: '2026-10-20', period_id: 'per-2026-10',
        concept: `Asiento masivo ${i}`, status: 'aprobado', entity_id: null,
        totalDebit: 100, totalCredit: 100, currency: 'MXN'
      });
      lineas.push(
        { id: `${id}-1`, asiento_id: id, cuenta_id: 'cta-1010', debit: 100, credit: 0 },
        { id: `${id}-2`, asiento_id: id, cuenta_id: 'cta-4010', debit: 0, credit: 100 }
      );
    }
    saveAsientos([...loadAsientos(), ...asientos]);
    saveLineas([...loadLineas(), ...lineas]);

    const reporte = obtenerMovimientos('per-2026-10');
    expect(reporte.movimientos).toHaveLength(5 + 1000);
    expect(reporte.totalDebit).toBe(366000 + 50000);
    expect(reporte.totalCredit).toBe(366000 + 50000);
  });

  it('calcula saldos de cuentas y lista los periodos disponibles', () => {
    const saldos = calcularSaldosCuentas('per-2026-10');
    const caja = saldos.find((c) => c.code === '1010');
    const bancos = saldos.find((c) => c.code === '1020');
    expect(caja.saldo).toBe(0);
    expect(bancos.saldo).toBe(-250000);

    const periodos = periodosDisponibles();
    expect(periodos.map((p) => p.name)).toEqual(['2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
  });
});
