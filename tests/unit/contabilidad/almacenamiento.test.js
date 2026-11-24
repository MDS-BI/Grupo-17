import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import {
  CLAVES,
  inicializarContabilidad,
  reiniciarDatosEjemplo,
  limpiarContabilidad,
  hayDatosContables,
  loadCuentas,
  loadPeriodos,
  loadAsientos,
  loadLineas,
  loadPagos,
  loadRegistrosActividad
} from '../../../src/contabilidad/almacenamiento.js';
import { loadEntities, loadDocuments } from '../../../src/storage.js';

let almacen;

beforeEach(() => {
  almacen = instalarAlmacen();
  almacen.clear();
});

describe('almacenamiento contable', () => {
  it('inicializa la semilla de forma determinista y ligada a entidades y documentos base', () => {
    expect(hayDatosContables()).toBe(false);
    expect(inicializarContabilidad()).toBe(true);

    const cuentas = loadCuentas();
    const periodos = loadPeriodos();
    const asientos = loadAsientos();
    const lineas = loadLineas();
    const pagos = loadPagos();

    expect(cuentas).toHaveLength(17);
    expect(periodos).toHaveLength(5);
    expect(asientos).toHaveLength(10);
    expect(lineas).toHaveLength(22);
    expect(pagos).toHaveLength(5);
    expect(loadRegistrosActividad().length).toBeGreaterThanOrEqual(8);
    expect(asientos[0].id).toBe('asi-0001');
    expect(asientos[0].totalDebit).toBe(116000);
    expect(asientos[0].totalCredit).toBe(116000);
    expect(lineas.find((l) => l.id === 'lin-0001-1').debit).toBe(116000);

    const entidades = loadEntities();
    const documentos = loadDocuments();
    expect(entidades.map((e) => e.entity_id)).toEqual(['ent-cliente-demo', 'ent-proveedor-demo']);
    expect(documentos.map((d) => d.id)).toEqual(['doc-venta-demo', 'doc-compra-demo']);
    expect(asientos[0].sourceDocumentId).toBe('doc-venta-demo');
    expect(pagos[0]).not.toHaveProperty('document_id');
  });

  it('no vuelve a sembrar cuando ya existen datos contables', () => {
    inicializarContabilidad();
    const antes = loadCuentas();
    expect(inicializarContabilidad()).toBe(false);
    expect(loadCuentas()).toEqual(antes);
  });

  it('reinicia la semilla reemplazando los datos contables previos', () => {
    inicializarContabilidad();
    const cuentas = loadCuentas();
    cuentas[0].name = 'Cuenta modificada';
    almacen.setItem(CLAVES.cuentas, JSON.stringify(cuentas));

    expect(reiniciarDatosEjemplo()).toBe(true);
    expect(loadCuentas()[0].name).toBe('Activo');
    expect(loadAsientos()).toHaveLength(10);
  });

  it('limpia todas las claves contables sin tocar entidades ni documentos base', () => {
    inicializarContabilidad();
    limpiarContabilidad();
    expect(hayDatosContables()).toBe(false);
    expect(loadRegistrosActividad()).toHaveLength(0);
    expect(loadEntities()).toHaveLength(2);
    expect(loadDocuments()).toHaveLength(2);
  });
});
