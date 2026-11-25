import { describe, it, expect, vi } from 'vitest';
import {
  construirModeloExportacion,
  exportarExcel,
  exportarPDF,
  nombreArchivo,
  serializarReporteCsv,
  serializarReporteHtml,
  serializarReportePdf,
  serializarReporteXls,
  validarModeloExportacion
} from '../../../src/contabilidad/exportacion-reportes.js';

function modeloBase() {
  return construirModeloExportacion('libroMayor', '2026-10', {
    cuentas: [{
      codigo: '1010',
      nombre: 'Cuenta, "Especial"',
      saldoInicial: 10000,
      debitos: 0,
      creditos: 5000,
      saldoFinal: 5000
    }],
    totales: { debitos: 0, creditos: 5000 },
    valido: true,
    advertencias: []
  });
}

function fabricarDescarga() {
  const enlaces = [];
  const documento = {
    body: { appendChild: vi.fn() },
    createElement() {
      const enlace = { style: {}, click: vi.fn(), remove: vi.fn() };
      enlaces.push(enlace);
      return enlace;
    }
  };
  const url = {
    createObjectURL: vi.fn((blob) => `blob:${blob.type}`),
    revokeObjectURL: vi.fn()
  };
  return { documento, URL: url, enlaces };
}

describe('exportación de reportes', () => {
  it('construye un modelo único con la empresa y el nombre de archivo contractuales', () => {
    const modelo = modeloBase();
    expect(modelo.empresa).toBe('Comercial Los Andes SpA');
    expect(modelo.reporte).toBe('libroMayor');
    expect(modelo.periodo).toBe('2026-10');
    expect(modelo.valido).toBe(true);
    expect(nombreArchivo(modelo, 'pdf')).toBe('Comercial-Los-Andes-SpA_libroMayor_2026-10.pdf');
    expect(nombreArchivo(modelo, 'xls')).toBe('Comercial-Los-Andes-SpA_libroMayor_2026-10.xls');
  });

  it('serializa CSV con BOM y comillas dobles escapadas', () => {
    const csv = serializarReporteCsv(modeloBase());
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('"Cuenta, ""Especial"""');
    expect(csv).toContain('"Comercial Los Andes SpA"');
  });

  it('serializa XLS con tabla, SpreadsheetML y cifras en CLP', () => {
    const xls = serializarReporteXls(modeloBase());
    expect(xls).toContain('<Workbook');
    expect(xls).toContain('<Table');
    expect(xls).toContain('<table');
    expect(xls).toContain('Comercial Los Andes SpA');
    expect(xls).toContain('$50');
  });

  it('serializa HTML imprimible con window.print', () => {
    const html = serializarReporteHtml(modeloBase());
    expect(html).toContain('<table');
    expect(html).toContain('window.print()');
    expect(html).toContain('Comercial Los Andes SpA');
  });

  it('serializa un PDF mínimo con encabezado y totales', () => {
    const pdf = serializarReportePdf(modeloBase());
    expect(pdf.startsWith('%PDF-1.4')).toBe(true);
    expect(pdf).toContain('Comercial Los Andes SpA');
    expect(pdf).toContain('Totales');
    expect(pdf).toContain('%%EOF');
  });

  it('deriva el resultado de exportación con centavos enteros', () => {
    const modelo = construirModeloExportacion('estadoResultados', '2026-11', {
      ingresos: 150000,
      gastos: 200000,
      valido: true
    });
    expect(modelo.totales.resultado).toBe(-50000);
    expect(() => construirModeloExportacion('estadoResultados', '2026-11', {
      ingresos: 0.1,
      gastos: 0.2
    })).toThrow(/centavos enteros/);
  });

  it('exporta un reporte vacío válido con el texto Sin movimientos', () => {
    const modelo = construirModeloExportacion('estadoResultados', '2026-11', {
      detalle: [],
      ingresos: 0,
      gastos: 0,
      resultado: 0,
      valido: true,
      vacio: true
    });
    expect(modelo.vacio).toBe(true);
    expect(modelo.valido).toBe(true);
    expect(modelo.advertencias).toContain('Sin movimientos');
    expect(serializarReporteCsv(modelo)).toContain('"Sin movimientos"');
  });

  it('bloquea la exportación cuando el reporte no es válido', () => {
    const modelo = {
      ...modeloBase(),
      valido: false,
      advertencias: ['El balance de comprobación no cuadra: los totales deudores y acreedores son diferentes.']
    };
    expect(validarModeloExportacion(modelo).ok).toBe(false);
    expect(exportarPDF(modelo).ok).toBe(false);
  });

  it('descarga el XLS mediante Blob y libera la URL', () => {
    const falsos = fabricarDescarga();
    const resultado = exportarExcel(modeloBase(), {
      documento: falsos.documento,
      URL: falsos.URL,
      revocarInmediatamente: true
    });
    expect(resultado.ok).toBe(true);
    expect(resultado.nombre).toBe('Comercial-Los-Andes-SpA_libroMayor_2026-10.xls');
    expect(falsos.URL.createObjectURL).toHaveBeenCalledOnce();
    expect(falsos.URL.revokeObjectURL).toHaveBeenCalledWith(resultado.url);
    expect(falsos.enlaces[0].download).toContain('.xls');
    expect(falsos.enlaces[0].click).toHaveBeenCalledOnce();
  });
});
