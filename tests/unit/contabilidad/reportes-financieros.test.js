import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarContabilidad } from '../../../src/contabilidad/almacenamiento.js';
import {
  asientosAprobadosDelPeriodo,
  balanceComprobacion,
  balanceGeneral,
  calcularSaldosCuentas,
  estadoResultados,
  generarBalanceGeneral,
  generarEstadoResultados,
  libroMayor,
  revisionBalanceCuadrado,
  validarBalanceCuadrado
} from '../../../src/contabilidad/reportes.js';

const PERIODO = {
  id: 'p-oct',
  name: '2026-10',
  startDate: '2026-10-01',
  endDate: '2026-10-31'
};

function datosPrueba() {
  const cuentas = [
    { id: 'caja', code: '1010', name: 'Caja', type: 'activo' },
    { id: 'clientes', code: '1100', name: 'Clientes', type: 'activo' },
    { id: 'iva', code: '2100', name: 'IVA Débito Fiscal', type: 'pasivo' },
    { id: 'capital', code: '3010', name: 'Capital social', type: 'patrimonio' },
    { id: 'ventas', code: '4010', name: 'Ventas', type: 'ingreso' },
    { id: 'renta', code: '5020', name: 'Renta', type: 'gasto' }
  ];
  const asientos = [
    {
      id: 'a-capital',
      period_id: 'p-ago',
      date: '2026-08-01',
      status: 'aprobado',
      lines: [
        { cuenta_id: 'caja', debit: 300000, credit: 0 },
        { cuenta_id: 'capital', debit: 0, credit: 300000 }
      ]
    },
    {
      id: 'a-venta',
      period_id: 'p-oct',
      date: '2026-10-03',
      status: 'aprobado',
      lines: [
        { cuenta_id: 'clientes', debit: 116000, credit: 0 },
        { cuenta_id: 'ventas', debit: 0, credit: 100000 },
        { cuenta_id: 'iva', debit: 0, credit: 16000 }
      ]
    },
    {
      id: 'a-renta',
      period_id: 'p-oct',
      date: '2026-10-08',
      status: 'aprobado',
      lines: [
        { cuenta_id: 'renta', debit: 250000, credit: 0 },
        { cuenta_id: 'caja', debit: 0, credit: 250000 }
      ]
    },
    {
      id: 'a-borrador',
      period_id: 'p-oct',
      date: '2026-10-15',
      status: 'borrador',
      lines: [{ cuenta_id: 'renta', debit: 5000, credit: 0 }]
    },
    {
      id: 'a-cancelado',
      period_id: 'p-oct',
      date: '2026-10-16',
      status: 'cancelado',
      lines: [{ cuenta_id: 'renta', debit: 7000, credit: 0 }]
    }
  ];
  return { cuentas, asientos };
}

beforeEach(() => {
  const almacen = instalarAlmacen();
  almacen.clear();
  inicializarContabilidad();
});

describe('estados financieros por periodo', () => {
  it('genera el libro mayor con saldos iniciales y totales cuadrados', () => {
    const { cuentas, asientos } = datosPrueba();
    const reporte = libroMayor(PERIODO, cuentas, asientos);
    expect(reporte.totales).toEqual({ debitos: 366000, creditos: 366000 });
    expect(reporte.valido).toBe(true);
    const caja = reporte.cuentas.find((cuenta) => cuenta.codigo === '1010');
    expect(caja.saldoInicial).toBe(300000);
    expect(caja.creditos).toBe(250000);
    expect(caja.saldoFinal).toBe(50000);
    const clientes = reporte.cuentas.find((cuenta) => cuenta.codigo === '1100');
    expect(clientes.saldoInicial).toBe(0);
    expect(clientes.debitos).toBe(116000);
    expect(clientes.saldoFinal).toBe(116000);
  });

  it('excluye saldos cero y verifica el balance de comprobación', () => {
    const { cuentas, asientos } = datosPrueba();
    const reporte = balanceComprobacion(PERIODO, cuentas, asientos);
    expect(reporte.totalDeudor).toBe(416000);
    expect(reporte.totalAcreedor).toBe(416000);
    expect(reporte.valido).toBe(true);
    expect(reporte.saldos.every((saldo) => saldo.saldoDeudor !== 0 || saldo.saldoAcreedor !== 0)).toBe(true);
    expect(reporte.saldos.find((saldo) => saldo.codigo === '3010').saldoAcreedor).toBe(300000);
  });

  it('calcula ingresos, gastos y resultado del estado de resultados', () => {
    const { cuentas, asientos } = datosPrueba();
    const reporte = estadoResultados(PERIODO, cuentas, asientos);
    expect(reporte.ingresos).toBe(100000);
    expect(reporte.gastos).toBe(250000);
    expect(reporte.resultado).toBe(-150000);
    expect(generarEstadoResultados(PERIODO, cuentas, asientos)).toEqual(reporte);
  });

  it('incluye el resultado acumulado hasta el cierre en el balance general', () => {
    const { cuentas, asientos } = datosPrueba();
    const reporte = balanceGeneral(PERIODO, cuentas, asientos);
    expect(reporte.activos).toBe(166000);
    expect(reporte.pasivos).toBe(16000);
    expect(reporte.resultadoAcumulado).toBe(-150000);
    expect(reporte.patrimonio).toBe(150000);
    expect(reporte.valido).toBe(true);
    expect(generarBalanceGeneral(PERIODO, cuentas, asientos)).toEqual(reporte);
  });

  it('identifica cuentas sin tipo válido y bloquea el reporte', () => {
    const cuentas = [{ id: 'c-1', code: '9999', name: 'Cuenta rara', type: 'desconocido' }];
    const asientos = [{
      id: 'a-1',
      period_id: 'p-1',
      date: '2026-10-01',
      status: 'aprobado',
      lines: [{ cuenta_id: 'c-1', debit: 5000, credit: 0 }]
    }];
    const resultado = estadoResultados(PERIODO, cuentas, asientos);
    expect(resultado.valido).toBe(false);
    expect(resultado.advertencias[0]).toContain('9999');
    expect(resultado.advertencias[0]).toContain('no tiene un tipo válido');
  });

  it('admite arreglos planos y la fecha límite inclusive', () => {
    const cuentas = [{ id: 'caja', code: '1010', name: 'Caja', type: 'activo' }];
    const asientos = [
      {
        id: 'a-1',
        date: '2026-10-01',
        status: 'aprobado',
        lines: [{ cuenta_id: 'caja', debit: 10000, credit: 0 }]
      },
      {
        id: 'a-2',
        date: '2026-10-02',
        status: 'borrador',
        lines: [{ cuenta_id: 'caja', debit: 7000, credit: 0 }]
      }
    ];
    expect(asientosAprobadosDelPeriodo(null, asientos)).toHaveLength(1);
    const saldos = calcularSaldosCuentas(cuentas, asientos, '2026-10-31');
    expect(saldos[0].saldo).toBe(10000);
  });

  it('mantiene el cuadre con los datos iniciales de la aplicación', () => {
    const mayor = libroMayor('per-2026-10');
    expect(mayor.totales.debitos).toBe(mayor.totales.creditos);
    expect(balanceComprobacion('per-2026-10').valido).toBe(true);
    expect(balanceGeneral('per-2026-10').valido).toBe(true);
  });

  it('expone validaciones de cuadre exactas', () => {
    expect(validarBalanceCuadrado(100, 100)).toBe(true);
    expect(validarBalanceCuadrado(100, 101)).toBe(false);
    expect(revisionBalanceCuadrado(100, 101)).toEqual({ valido: false, diferencia: -1 });
    expect(revisionBalanceCuadrado(100, 250)).toEqual({ valido: false, diferencia: -150 });
    expect(() => revisionBalanceCuadrado(0.1, 0.2)).toThrow(/centavos enteros/);
  });
});
