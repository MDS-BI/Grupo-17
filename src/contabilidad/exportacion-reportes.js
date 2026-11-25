import { formatearCLP, sumarCentavos } from './dinero.js';
import { formatearFecha } from './fechas.js';
import { IDENTIDAD_EMPRESA } from './interfaz-config.js';

export const NOMBRE_EMPRESA = IDENTIDAD_EMPRESA.nombre;

export const REPORTES_EXPORTABLES = Object.freeze([
  'libroMayor',
  'balanceComprobacion',
  'estadoResultados',
  'balanceGeneral',
  'movimientos'
]);

const ETIQUETAS = Object.freeze({
  libroMayor: 'Libro Mayor',
  balanceComprobacion: 'Balance de Comprobación',
  estadoResultados: 'Estado de Resultados',
  balanceGeneral: 'Balance General',
  movimientos: 'Movimientos por Periodo'
});

const COLUMNAS = Object.freeze({
  libroMayor: [
    { clave: 'codigo', etiqueta: 'Código', tipo: 'texto' },
    { clave: 'nombre', etiqueta: 'Cuenta', tipo: 'texto' },
    { clave: 'saldoInicial', etiqueta: 'Saldo inicial', tipo: 'monto' },
    { clave: 'debitos', etiqueta: 'Débitos', tipo: 'monto' },
    { clave: 'creditos', etiqueta: 'Créditos', tipo: 'monto' },
    { clave: 'saldoFinal', etiqueta: 'Saldo final', tipo: 'monto' }
  ],
  balanceComprobacion: [
    { clave: 'codigo', etiqueta: 'Código', tipo: 'texto' },
    { clave: 'nombre', etiqueta: 'Cuenta', tipo: 'texto' },
    { clave: 'saldoDeudor', etiqueta: 'Saldo deudor', tipo: 'monto' },
    { clave: 'saldoAcreedor', etiqueta: 'Saldo acreedor', tipo: 'monto' }
  ],
  estadoResultados: [
    { clave: 'codigo', etiqueta: 'Código', tipo: 'texto' },
    { clave: 'nombre', etiqueta: 'Cuenta', tipo: 'texto' },
    { clave: 'tipo', etiqueta: 'Tipo', tipo: 'texto' },
    { clave: 'ingresos', etiqueta: 'Ingresos', tipo: 'monto' },
    { clave: 'gastos', etiqueta: 'Gastos', tipo: 'monto' },
    { clave: 'resultado', etiqueta: 'Resultado', tipo: 'monto' }
  ],
  balanceGeneral: [
    { clave: 'concepto', etiqueta: 'Concepto', tipo: 'texto' },
    { clave: 'importe', etiqueta: 'Importe', tipo: 'monto' }
  ],
  movimientos: [
    { clave: 'fecha', etiqueta: 'Fecha', tipo: 'texto' },
    { clave: 'concepto', etiqueta: 'Concepto', tipo: 'texto' },
    { clave: 'cuenta', etiqueta: 'Cuenta', tipo: 'texto' },
    { clave: 'debito', etiqueta: 'Débito', tipo: 'monto' },
    { clave: 'credito', etiqueta: 'Crédito', tipo: 'monto' }
  ]
});

export const ETIQUETAS_REPORTES = ETIQUETAS;
export const COLUMNAS_REPORTES = COLUMNAS;

function num(valor) {
  return Number(valor) || 0;
}

function texto(valor) {
  return String(valor ?? '');
}

function ascii(valor) {
  return texto(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '?');
}

function escaparHtml(valor) {
  return texto(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escaparXml(valor) {
  return escaparHtml(valor);
}

function escaparPdf(valor) {
  return ascii(valor).replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
}

function slug(valor) {
  return ascii(valor)
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'periodo';
}

function normalizarReporte(reporte) {
  const clave = typeof reporte === 'string' ? reporte : reporte?.reporte;
  return REPORTES_EXPORTABLES.includes(clave) ? clave : 'libroMayor';
}

function textoPeriodo(periodo) {
  if (!periodo) return '';
  if (typeof periodo === 'string') return periodo;
  return texto(periodo.periodo ?? periodo.name ?? periodo.etiqueta ?? periodo.id);
}

function idPeriodo(periodo) {
  if (!periodo) return null;
  if (typeof periodo === 'string') return periodo;
  return periodo.id ?? null;
}

function fechaLegible(valor) {
  const fecha = formatearFecha(valor);
  return fecha || texto(valor);
}

function ahora() {
  return new Date().toISOString();
}

function fila(columnas, valores, datos = {}) {
  return { ...datos, valores, celdas: columnas.map((columna, indice) => ({
    clave: columna.clave,
    etiqueta: columna.etiqueta,
    tipo: columna.tipo,
    valor: valores[indice]
  })) };
}

function filasDeReporte(clave, datos) {
  if (clave === 'libroMayor') {
    return (datos.cuentas || []).map((cuenta) => fila(COLUMNAS[clave], [
      cuenta.codigo ?? cuenta.code ?? '',
      cuenta.nombre ?? cuenta.name ?? '',
      num(cuenta.saldoInicial),
      num(cuenta.debitos),
      num(cuenta.creditos),
      num(cuenta.saldoFinal)
    ], { cuentaId: cuenta.cuentaId ?? cuenta.id, ...cuenta }));
  }
  if (clave === 'balanceComprobacion') {
    return (datos.saldos || []).map((saldo) => fila(COLUMNAS[clave], [
      saldo.codigo ?? saldo.code ?? '',
      saldo.nombre ?? saldo.name ?? '',
      num(saldo.saldoDeudor),
      num(saldo.saldoAcreedor)
    ], { cuentaId: saldo.cuentaId ?? saldo.id, ...saldo }));
  }
  if (clave === 'estadoResultados') {
    return (datos.detalle || []).map((detalle) => fila(COLUMNAS[clave], [
      detalle.codigo ?? detalle.code ?? '',
      detalle.nombre ?? detalle.name ?? '',
      detalle.tipo ?? '',
      num(detalle.ingresos),
      num(detalle.gastos),
      sumarCentavos([num(detalle.ingresos), -num(detalle.gastos)])
    ], { cuentaId: detalle.cuentaId ?? detalle.id, ...detalle, resultado: sumarCentavos([num(detalle.ingresos), -num(detalle.gastos)]) }));
  }
  if (clave === 'balanceGeneral') {
    return [
      fila(COLUMNAS[clave], ['Activos', num(datos.activos)], { concepto: 'Activos', importe: num(datos.activos) }),
      fila(COLUMNAS[clave], ['Pasivos', num(datos.pasivos)], { concepto: 'Pasivos', importe: num(datos.pasivos) }),
      fila(COLUMNAS[clave], ['Patrimonio', num(datos.patrimonio)], { concepto: 'Patrimonio', importe: num(datos.patrimonio) }),
      fila(COLUMNAS[clave], ['Resultado acumulado', num(datos.resultadoAcumulado)], { concepto: 'Resultado acumulado', importe: num(datos.resultadoAcumulado) })
    ];
  }
  const movimientos = datos.movimientos || [];
  return movimientos.map((movimiento) => fila(COLUMNAS[clave], [
    fechaLegible(movimiento.date),
    movimiento.lineConcept ?? movimiento.concept ?? movimiento.concepto ?? '',
    `${texto(movimiento.accountCode ?? movimiento.codigo)} ${texto(movimiento.accountName ?? movimiento.nombre)}`.trim(),
    num(movimiento.debit ?? movimiento.debito),
    num(movimiento.credit ?? movimiento.credito)
  ], { ...movimiento }));
}

function totalesDeReporte(clave, datos) {
  if (clave === 'libroMayor') return { debitos: num(datos.totales?.debitos), creditos: num(datos.totales?.creditos) };
  if (clave === 'balanceComprobacion') return { totalDeudor: num(datos.totalDeudor), totalAcreedor: num(datos.totalAcreedor) };
  if (clave === 'estadoResultados') return {
    ingresos: num(datos.ingresos),
    gastos: num(datos.gastos),
    resultado: datos.resultado == null
      ? sumarCentavos([num(datos.ingresos), -num(datos.gastos)])
      : num(datos.resultado)
  };
  if (clave === 'balanceGeneral') return {
    activos: num(datos.activos),
    pasivos: num(datos.pasivos),
    patrimonio: num(datos.patrimonio),
    resultadoAcumulado: num(datos.resultadoAcumulado)
  };
  return { totalDebit: num(datos.totalDebit), totalCredit: num(datos.totalCredit) };
}

function advertenciasDe(datos, clave) {
  const advertencias = [
    ...(Array.isArray(datos.advertencias) ? datos.advertencias : []),
    ...(Array.isArray(datos.errores) ? datos.errores : [])
  ].map(texto).filter(Boolean);
  if (datos.valido === false && advertencias.length === 0) {
    advertencias.push(`El reporte ${ETIQUETAS[clave]} no es válido para exportación.`);
  }
  return [...new Set(advertencias)];
}

export function construirModeloExportacion(reporte, periodo, datos = {}) {
  const clave = normalizarReporte(reporte);
  const columnas = COLUMNAS[clave];
  let filas = filasDeReporte(clave, datos);
  const vacio = Boolean(datos.vacio ?? filas.length === 0);
  const advertencias = advertenciasDe(datos, clave);
  const valido = datos.valido !== false && advertencias.length === 0;
  if (vacio) filas = [fila(columnas, columnas.map((columna, indice) => indice === 0 ? 'Sin movimientos' : ''), { vacio: true })];
  return {
    empresa: NOMBRE_EMPRESA,
    reporte: clave,
    etiqueta: ETIQUETAS[clave],
    periodo: textoPeriodo(datos.periodo ?? periodo),
    periodoId: idPeriodo(datos.periodo ?? periodo),
    fechaGeneracion: datos.fechaGeneracion || ahora(),
    columnas: columnas.map((columna) => ({ ...columna })),
    filas,
    totales: totalesDeReporte(clave, datos),
    vacio,
    valido,
    advertencias: vacio && valido ? [...advertencias, 'Sin movimientos'] : advertencias
  };
}

export const modeloDesdeReporte = construirModeloExportacion;
export const construirModelo = construirModeloExportacion;

export function nombreArchivo(modelo, extension = 'pdf') {
  const ext = ['pdf', 'xls', 'csv', 'html'].includes(String(extension).toLowerCase()) ? String(extension).toLowerCase() : 'pdf';
  return `Comercial-Los-Andes-SpA_${slug(modelo?.reporte ?? 'reporte')}_${slug(modelo?.periodo ?? modelo?.periodoId ?? 'periodo')}.${ext}`;
}

export function validarModeloExportacion(modelo) {
  if (!modelo) return { ok: false, advertencia: 'No hay un reporte listo para exportar.' };
  if (modelo.valido === false) {
    return { ok: false, advertencia: (modelo.advertencias || []).find((mensaje) => mensaje !== 'Sin movimientos') || 'El reporte no es válido para exportación.' };
  }
  return { ok: true, advertencia: '' };
}

function presentar(valor, columna) {
  if (columna?.tipo === 'monto') return formatearCLP(valor);
  return texto(valor);
}

function csvCelda(valor) {
  return `"${texto(valor).replaceAll('"', '""')}"`;
}

function filaCsv(celdas) {
  return celdas.map(csvCelda).join(',');
}

export function serializarReporteCsv(modelo) {
  const columnas = modelo.columnas || [];
  const filas = Array.isArray(modelo.filas) ? modelo.filas : [];
  const encabezados = columnas.map((columna) => columna.etiqueta);
  const lineas = [
    ['Empresa', modelo.empresa || NOMBRE_EMPRESA],
    ['Reporte', modelo.etiqueta || modelo.reporte],
    ['Periodo', modelo.periodo],
    ['Fecha de generación', fechaLegible(modelo.fechaGeneracion)],
    [],
    encabezados,
    ...filas.map((fila) => (fila.valores || []).map((valor, indice) => presentar(valor, columnas[indice]))),
    [],
    ['Totales']
  ];
  for (const [clave, valor] of Object.entries(modelo.totales || {})) {
    lineas.push([clave, formatearCLP(valor)]);
  }
  if (!modelo.totales || Object.keys(modelo.totales).length === 0) lineas.push(['Sin totales', '']);
  return '\uFEFF' + lineas.map(filaCsv).join('\r\n');
}

function construirTablaHtml(modelo) {
  const columnas = modelo.columnas || [];
  const filas = Array.isArray(modelo.filas) ? modelo.filas : [];
  const encabezados = columnas.map((columna) => `<th scope="col">${escaparHtml(columna.etiqueta)}</th>`).join('');
  const cuerpo = filas.map((fila) => {
    const celdas = (fila.valores || []).map((valor, indice) => {
      const clase = columnas[indice]?.tipo === 'monto' ? ' class="num"' : '';
      return `<td${clase}>${escaparHtml(presentar(valor, columnas[indice]))}</td>`;
    }).join('');
    return `<tr>${celdas}</tr>`;
  }).join('');
  const totales = Object.entries(modelo.totales || {}).map(([clave, valor]) => (
    `<span class="total"><strong>${escaparHtml(clave)}:</strong> ${escaparHtml(formatearCLP(valor))}</span>`
  )).join('');
  return `<table class="tabla-exportacion"><thead><tr>${encabezados}</tr></thead><tbody>${cuerpo}</tbody></table><div class="totales">${totales}</div>`;
}

function encabezadoHtml(modelo) {
  return `<header><h1>${escaparHtml(modelo.empresa || NOMBRE_EMPRESA)}</h1><h2>${escaparHtml(modelo.etiqueta || modelo.reporte)}</h2><p>Periodo: ${escaparHtml(modelo.periodo)}</p><p>Fecha de generación: ${escaparHtml(fechaLegible(modelo.fechaGeneracion))}</p></header>`;
}

function advertenciasHtml(modelo) {
  const mensajes = Array.isArray(modelo.advertencias) ? modelo.advertencias : [];
  if (mensajes.length === 0) return '';
  return `<div class="advertencias">${mensajes.map((mensaje) => `<p>${escaparHtml(mensaje)}</p>`).join('')}</div>`;
}

export function serializarReporteHtml(modelo) {
  const seript = '<script>window.addEventListener("load", function () { window.print(); });<\/script>';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escaparHtml(modelo.empresa || NOMBRE_EMPRESA)} - ${escaparHtml(modelo.etiqueta || modelo.reporte)}</title><style>body{font-family:Arial,sans-serif;margin:2rem;color:#0b3946}table{width:100%;border-collapse:collapse;margin-top:1rem}th,td{border:1px solid rgba(15,76,92,.2);padding:.45rem;text-align:left}.num{text-align:right}thead{background:#f7fafb}.totales{margin-top:1rem;display:flex;gap:1.5rem;flex-wrap:wrap}.advertencias{color:#b42318;margin-top:1rem}@media print{body{margin:1cm}}</style></head><body>${encabezadoHtml(modelo)}${construirTablaHtml(modelo)}${advertenciasHtml(modelo)}${seript}</body></html>`;
}

export function serializarReporteXlsHtml(modelo) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="ProgId" content="Excel.Sheet"><title>${escaparHtml(modelo.etiqueta || modelo.reporte)}</title></head><body>${encabezadoHtml(modelo)}${construirTablaHtml(modelo)}${advertenciasHtml(modelo)}</body></html>`;
}

function filaXml(fila, columnas) {
  const celdas = (fila.valores || []).map((valor, indice) => {
    const presentado = presentar(valor, columnas[indice]);
    return `<Cell><Data ss:Type="String">${escaparXml(presentado)}</Data></Cell>`;
  }).join('');
  return `<Row>${celdas}</Row>`;
}

export function serializarReporteSpreadsheetMl(modelo) {
  const columnas = modelo.columnas || [];
  const filas = Array.isArray(modelo.filas) ? modelo.filas : [];
  const encabezado = `<Row>${columnas.map((columna) => `<Cell ss:StyleID="sHead"><Data ss:Type="String">${escaparXml(columna.etiqueta)}</Data></Cell>`).join('')}</Row>`;
  const cuerpo = filas.map((fila) => filaXml(fila, columnas)).join('');
  const totales = Object.entries(modelo.totales || {}).map(([clave, valor]) => (
    `<Row><Cell><Data ss:Type="String">${escaparXml(clave)}</Data></Cell><Cell><Data ss:Type="String">${escaparXml(formatearCLP(valor))}</Data></Cell></Row>`
  )).join('');
  const meta = [
    modelo.empresa || NOMBRE_EMPRESA,
    modelo.etiqueta || modelo.reporte,
    `Periodo: ${modelo.periodo}`,
    `Fecha de generación: ${fechaLegible(modelo.fechaGeneracion)}`
  ].map((valor) => `<Row><Cell><Data ss:Type="String">${escaparXml(valor)}</Data></Cell></Row>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="sHead"><Font ss:Bold="1"/></Style></Styles><Worksheet ss:Name="Reporte"><Table>${meta}${encabezado}${cuerpo}${totales}</Table></Worksheet></Workbook>`;
}

export function serializarReporteXls(modelo, opciones = {}) {
  if (opciones.formato === 'html') return serializarReporteXlsHtml(modelo);
  const tablaHtml = construirTablaHtml(modelo).replaceAll(']]>', ']]]]><![CDATA[>');
  const vista = `<Worksheet ss:Name="Vista HTML"><Table><Row><Cell><Data ss:Type="String"><![CDATA[${tablaHtml}]]></Data></Cell></Row></Table></Worksheet>`;
  return serializarReporteSpreadsheetMl(modelo).replace('</Workbook>', `${vista}</Workbook>`);
}

function lineasPdf(modelo) {
  const columnas = modelo.columnas || [];
  const filas = Array.isArray(modelo.filas) ? modelo.filas : [];
  const lineas = [
    modelo.empresa || NOMBRE_EMPRESA,
    modelo.etiqueta || modelo.reporte,
    `Periodo: ${modelo.periodo}`,
    `Fecha de generacion: ${fechaLegible(modelo.fechaGeneracion)}`,
    '',
    columnas.map((columna) => columna.etiqueta).join(' | '),
    ...filas.map((fila) => (fila.valores || []).map((valor, indice) => presentar(valor, columnas[indice])).join(' | ')),
    '',
    'Totales',
    ...Object.entries(modelo.totales || {}).map(([clave, valor]) => `${clave}: ${formatearCLP(valor)}`),
    ...(modelo.advertencias || []).map(texto)
  ];
  return lineas.map(ascii);
}

export function serializarReportePdf(modelo) {
  const contenido = [
    'BT',
    '/F1 9 Tf',
    '11 TL',
    '48 758 Td',
    ...lineasPdf(modelo).map((linea) => `(${escaparPdf(linea)}) Tj T*`),
    'ET'
  ].join('\n');
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    `<< /Length ${contenido.length} >>\nstream\n${contenido}\nendstream`
  ];
  let pdf = '%PDF-1.4\n';
  const desplazamientos = [];
  objetos.forEach((objeto, indice) => {
    desplazamientos.push(pdf.length);
    pdf += `${indice + 1} 0 obj\n${objeto}\nendobj\n`;
  });
  const inicioXref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  for (const desplazamiento of desplazamientos) {
    pdf += `${String(desplazamiento).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`;
  return pdf;
}

function crearDescarga(contenido, nombre, tipo, opciones = {}) {
  const documento = opciones.documento || globalThis.document;
  const apiUrl = opciones.URL || globalThis.URL;
  const crear = opciones.crearObjectURL || apiUrl?.createObjectURL?.bind(apiUrl);
  const revocar = opciones.revocarObjectURL || apiUrl?.revokeObjectURL?.bind(apiUrl);
  const blob = new Blob([contenido], { type: tipo });
  const url = crear ? crear(blob) : '';
  if (documento?.createElement) {
    const enlace = documento.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    enlace.style.display = 'none';
    documento.body?.appendChild(enlace);
    enlace.click();
    enlace.remove?.();
  }
  if (url && revocar) {
    if (opciones.revocarInmediatamente) revocar(url);
    else setTimeout(() => revocar(url), opciones.retrasoRevocacion ?? 30000);
  }
  return { blob, url, nombre };
}

export function exportarCSV(modelo, opciones = {}) {
  const revision = validarModeloExportacion(modelo);
  if (!revision.ok) return revision;
  const nombre = nombreArchivo(modelo, 'csv');
  const descarga = crearDescarga(serializarReporteCsv(modelo), nombre, 'text/csv;charset=utf-8', opciones);
  return { ok: true, formato: 'csv', nombre, ...descarga };
}

export function exportarExcel(modelo, opciones = {}) {
  const revision = validarModeloExportacion(modelo);
  if (!revision.ok) return revision;
  const nombre = nombreArchivo(modelo, 'xls');
  const contenido = serializarReporteXls(modelo, opciones);
  const tipo = opciones.formato === 'html' ? 'text/html;charset=utf-8' : 'application/vnd.ms-excel;charset=utf-8';
  const descarga = crearDescarga(contenido, nombre, tipo, opciones);
  return { ok: true, formato: 'xls', nombre, ...descarga };
}

export function exportarPDF(modelo, opciones = {}) {
  const revision = validarModeloExportacion(modelo);
  if (!revision.ok) return revision;
  const nombre = nombreArchivo(modelo, 'pdf');
  const descarga = crearDescarga(serializarReportePdf(modelo), nombre, 'application/pdf', opciones);
  return { ok: true, formato: 'pdf', nombre, ...descarga };
}

export function exportarHTML(modelo, opciones = {}) {
  const revision = validarModeloExportacion(modelo);
  if (!revision.ok) return revision;
  const nombre = nombreArchivo(modelo, 'html');
  const descarga = crearDescarga(serializarReporteHtml(modelo), nombre, 'text/html;charset=utf-8', opciones);
  return { ok: true, formato: 'html', nombre, ...descarga };
}

export function exportarImprimible(modelo, opciones = {}) {
  const revision = validarModeloExportacion(modelo);
  if (!revision.ok) return revision;
  const contenido = serializarReporteHtml(modelo);
  const ventanaApi = opciones.window || globalThis.window;
  const apiUrl = opciones.URL || globalThis.URL;
  const crear = opciones.crearObjectURL || apiUrl?.createObjectURL?.bind(apiUrl);
  const revocar = opciones.revocarObjectURL || apiUrl?.revokeObjectURL?.bind(apiUrl);
  const url = crear ? crear(new Blob([contenido], { type: 'text/html;charset=utf-8' })) : '';
  let abierta = false;
  if (url && ventanaApi?.open) {
    abierta = Boolean(ventanaApi.open(url, '_blank'));
  }
  if (!abierta) ventanaApi?.print?.();
  if (url && revocar) setTimeout(() => revocar(url), opciones.retrasoRevocacion ?? 30000);
  return { ok: true, formato: 'html', abierta, impresa: !abierta && Boolean(ventanaApi?.print), url };
}

export const exportarPDFImprimible = exportarImprimible;
