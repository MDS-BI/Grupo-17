import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, enviar } from '../../setup/contabilidad.js';
import { inicializarContabilidad, loadAsientos, loadLineas, loadPeriodos, savePeriodos } from '../../../src/contabilidad/almacenamiento.js';
import { formatearMXN } from '../../../src/contabilidad/dinero.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

async function abrirAsientos(){
  await bootContabilidad();
  qs('nav-asientos').click();
}

function llenarLinea(indice, cuenta, debito, credito){
  qs(`linea-cuenta-${indice}`).value = cuenta;
  qs(`linea-debit-${indice}`).value = debito;
  qs(`linea-credit-${indice}`).value = credito;
}

function llenarCabecera({ date = '2026-10-20', concept = 'Asiento de prueba', periodo = 'per-2026-10' } = {}){
  qs('asiento-date').value = date;
  qs('asiento-concept').value = concept;
  qs('asiento-periodo').value = periodo;
}

describe('registro de asientos contables', () => {
  it('lista los asientos de la semilla con sus totales y estados', async () => {
    await abrirAsientos();
    expect(qs('view-asientos').hidden).toBe(false);
    expect(qs('asientos-lista').textContent).toContain('Venta de mercancía a crédito');
    expect(qs('asientos-lista').textContent).toContain(formatearMXN(116000));
    expect(qs('asientos-empty').hidden).toBe(true);
  });

  it('muestra el historial de auditoría dentro del detalle del asiento', async () => {
    await abrirAsientos();
    const asiento = loadAsientos()[0];

    document.querySelector(`[data-action="ver-historial-asiento"][data-id="${asiento.id}"]`).click();

    const detalle = qs('asiento-detalle');
    expect(detalle.hidden).toBe(false);
    expect(detalle.textContent).toContain('Historial de auditoría');
    expect(detalle.querySelector('[data-historial-detalle="asiento"] #historial-movimiento-empty')).not.toBeNull();
  });

  it('registra un asiento cuadrado y lo aprueba y cancela desde el listado', async () => {
    await abrirAsientos();
    llenarCabecera();
    llenarLinea(0, 'cta-1010', '100', '');
    llenarLinea(1, 'cta-4010', '', '100');
    enviar(qs('asiento-form'));

    const creado = loadAsientos().find((a) => a.concept === 'Asiento de prueba');
    expect(creado).toBeDefined();
    expect(creado.totalDebit).toBe(10000);
    expect(creado.totalCredit).toBe(10000);
    expect(loadLineas().filter((l) => l.asiento_id === creado.id)).toHaveLength(2);
    expect(qs('asientos-lista').textContent).toContain('Asiento de prueba');

    document.querySelector(`[data-action="aprobar-asiento"][data-id="${creado.id}"]`).click();
    expect(loadAsientos().find((a) => a.id === creado.id).status).toBe('aprobado');

    document.querySelector(`[data-action="cancelar-asiento"][data-id="${creado.id}"]`).click();
    expect(loadAsientos().find((a) => a.id === creado.id).status).toBe('cancelado');
  });

  it('bloquea asientos desbalanceados con un mensaje claro', async () => {
    await abrirAsientos();
    const antes = loadAsientos().length;
    llenarCabecera({ concept: 'Asiento desbalanceado' });
    llenarLinea(0, 'cta-1010', '100', '');
    llenarLinea(1, 'cta-4010', '', '90');
    enviar(qs('asiento-form'));

    expect(qs('error-asiento-lineas').textContent).toContain('cuadrado');
    expect(loadAsientos()).toHaveLength(antes);
  });

  it('no permite registrar asientos en un periodo cerrado', async () => {
    await bootContabilidad();
    inicializarContabilidad();
    savePeriodos(loadPeriodos().map((periodo) => (
      periodo.id === 'per-2026-09' ? { ...periodo, status: 'cerrado' } : periodo
    )));
    qs('nav-asientos').click();
    const antes = loadAsientos().length;
    llenarCabecera({ date: '2026-09-15', concept: 'Asiento en periodo cerrado', periodo: 'per-2026-09' });
    llenarLinea(0, 'cta-1010', '100', '');
    llenarLinea(1, 'cta-4010', '', '100');
    enviar(qs('asiento-form'));

    expect(qs('error-asiento-periodo').textContent).toContain('cerrado');
    expect(loadAsientos()).toHaveLength(antes);
  });
});
