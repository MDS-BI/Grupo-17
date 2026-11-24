import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';
import { loadCuentas, loadAsientos, loadPagos } from '../../../src/contabilidad/almacenamiento.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('base del módulo de contabilidad y finanzas', () => {
  it('agrega las vistas y etiquetas contables sin sembrar datos al iniciar', async () => {
    await bootContabilidad();

    expect(qs('nav-resumen-label').textContent).toBe('Resumen financiero');
    expect(qs('nav-cuentas-label').textContent).toBe('Cuentas contables');
    expect(qs('nav-asientos-label').textContent).toBe('Asientos contables');
    expect(qs('nav-pagos-label').textContent).toBe('Pagos');
    expect(qs('nav-periodos-label').textContent).toBe('Periodos contables');
    expect(qs('nav-reportes-label').textContent).toBe('Reportes financieros');
    expect(qs('view-resumen').hidden).toBe(true);
    expect(loadCuentas()).toHaveLength(0);
  });

  it('siembra la contabilidad de forma perezosa al abrir el primer módulo contable', async () => {
    await bootContabilidad();
    expect(loadAsientos()).toHaveLength(0);

    qs('nav-cuentas').click();

    expect(qs('view-cuentas').hidden).toBe(false);
    expect(qs('view-dashboard').hidden).toBe(true);
    expect(loadCuentas()).toHaveLength(17);
    expect(loadAsientos()).toHaveLength(10);
    expect(loadPagos()).toHaveLength(5);
    expect(document.querySelector('#cuentas-lista .cuenta-arbol')).not.toBeNull();
    expect(document.querySelector('#pago-document')).toBeNull();
    expect(document.querySelector('label[for="pago-entity"]').textContent).toContain('Cliente o proveedor');
    expect(document.querySelector('label[for="asiento-entity"]').textContent).toContain('Cliente o proveedor');
  });

  it('cambia entre las seis vistas contables y mantiene una sola activa', async () => {
    await bootContabilidad();
    const modulos = ['resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes'];
    for(const modulo of modulos){
      qs(`nav-${modulo}`).click();
      for(const otro of modulos){
        expect(qs(`view-${otro}`).hidden).toBe(otro !== modulo);
      }
    }
  });
});
