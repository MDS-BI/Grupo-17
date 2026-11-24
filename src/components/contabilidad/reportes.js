import * as Comun from './comun.js';
import { formatearMXN, sumarCentavos } from '../../contabilidad/dinero.js';
import { obtenerReportesFinancieros } from '../../contabilidad/reportes.js';
import { construirModeloExportacion } from '../../contabilidad/exportacion-reportes.js';
import { renderizarBotonesExportacion } from './exportacion.js';
import { renderizarRegistroActividad } from './registro-actividad.js';
import { ordenarRegistros } from '../../contabilidad/interfaz-config.js';

const REPORTES = Object.freeze([
  { clave: 'libroMayor', etiqueta: 'Libro Mayor' },
  { clave: 'balanceComprobacion', etiqueta: 'Balance de Comprobación' },
  { clave: 'estadoResultados', etiqueta: 'Estado de Resultados' },
  { clave: 'balanceGeneral', etiqueta: 'Balance General' }
]);

const COLUMNAS = Object.freeze({
  libroMayor: [
    { etiqueta: 'Código', tipo: 'texto' },
    { etiqueta: 'Cuenta', tipo: 'texto' },
    { etiqueta: 'Saldo inicial', tipo: 'monto' },
    { etiqueta: 'Débitos', tipo: 'monto' },
    { etiqueta: 'Créditos', tipo: 'monto' },
    { etiqueta: 'Saldo final', tipo: 'monto' }
  ],
  balanceComprobacion: [
    { etiqueta: 'Código', tipo: 'texto' },
    { etiqueta: 'Cuenta', tipo: 'texto' },
    { etiqueta: 'Saldo deudor', tipo: 'monto' },
    { etiqueta: 'Saldo acreedor', tipo: 'monto' }
  ],
  estadoResultados: [
    { etiqueta: 'Código', tipo: 'texto' },
    { etiqueta: 'Cuenta', tipo: 'texto' },
    { etiqueta: 'Tipo', tipo: 'texto' },
    { etiqueta: 'Ingresos', tipo: 'monto' },
    { etiqueta: 'Gastos', tipo: 'monto' },
    { etiqueta: 'Resultado', tipo: 'monto' }
  ],
  balanceGeneral: [
    { etiqueta: 'Concepto', tipo: 'texto' },
    { etiqueta: 'Importe', tipo: 'monto' }
  ]
});

function escapeHtml(valor) {
  if (typeof Comun.escapeHtml === 'function') return Comun.escapeHtml(valor);
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatoMoneda(centavos) {
  return formatearMXN(centavos);
}

function formatoFecha(valor) {
  const formatear = Comun.formatearFecha || Comun.formatoFecha;
  return (typeof formatear === 'function' ? formatear(valor) : '') || texto(valor);
}

function poblarSelect(select, opciones, { valor = '' } = {}) {
  if (!select) return;
  select.innerHTML = '';
  for (const opcion of opciones) {
    const nodo = document.createElement('option');
    nodo.value = opcion.value;
    nodo.textContent = opcion.label;
    select.appendChild(nodo);
  }
  if (valor && opciones.some((opcion) => opcion.value === valor)) select.value = valor;
}

function mostrarMensaje(id, mensaje) {
  const elemento = document.getElementById(id);
  if (!elemento) return;
  elemento.textContent = mensaje || '';
  elemento.hidden = !mensaje;
}

function centr(valor) {
  return Number(valor) || 0;
}

function texto(valor) {
  return String(valor ?? '');
}

function mensajeEn(elemento, mensaje) {
  if (!elemento) return;
  elemento.textContent = mensaje || '';
  elemento.hidden = !mensaje;
}

function asegurarContenedor() {
  const vista = document.getElementById('view-reportes');
  if (!vista) return null;
  let contenedor = vista.querySelector('[data-reportes-financieros]');
  if (contenedor) return contenedor;
  contenedor = document.createElement('section');
  contenedor.className = 'card card-wide reportes-financieros';
  contenedor.setAttribute('data-reportes-financieros', '');
  contenedor.innerHTML = `
    <h2>Estados financieros</h2>
    <div class="reportes-tabs" data-reportes-tabs role="tablist" aria-label="Estados financieros"></div>
    <div class="advertencia-reporte" data-advertencia-reporte role="status" hidden></div>
    <div class="estado-vacio-reporte" data-estado-vacio-reporte hidden></div>
    <div class="reporte-detalle">
      <table class="tabla-financiera" data-tabla-reporte>
        <thead></thead>
        <tbody></tbody>
        <tfoot></tfoot>
      </table>
      <div class="controles-exportacion" data-controles-exportacion></div>
    </div>
    <section class="card registro-actividad" data-registro-actividad aria-labelledby="auditoria-heading" hidden></section>`;
  vista.appendChild(contenedor);
  return contenedor;
}

function renderizarPestanas(contenedor, activa) {
  const barra = contenedor.querySelector('[data-reportes-tabs]');
  if (!barra) return;
  barra.innerHTML = '';
  for (const reporte of REPORTES) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'pestana-reporte';
    boton.dataset.reporte = reporte.clave;
    boton.textContent = reporte.etiqueta;
    boton.setAttribute('role', 'tab');
    boton.setAttribute('aria-selected', String(reporte.clave === activa));
    barra.appendChild(boton);
  }
  if (barra.__reportesConectado) return;
  barra.__reportesConectado = true;
  barra.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-reporte]');
    if (!boton || !barra.contains(boton)) return;
    barra.__cambiarReporte?.(boton.dataset.reporte);
  });
}

function filasPara(clave, estado) {
  if (clave === 'libroMayor') {
    return (estado.cuentas || []).map((cuenta) => [
      texto(cuenta.codigo),
      texto(cuenta.nombre),
      centr(cuenta.saldoInicial),
      centr(cuenta.debitos),
      centr(cuenta.creditos),
      centr(cuenta.saldoFinal)
    ]);
  }
  if (clave === 'balanceComprobacion') {
    return (estado.saldos || []).map((saldo) => [
      texto(saldo.codigo),
      texto(saldo.nombre),
      centr(saldo.saldoDeudor),
      centr(saldo.saldoAcreedor)
    ]);
  }
  if (clave === 'estadoResultados') {
    return (estado.detalle || []).map((detalle) => [
      texto(detalle.codigo),
      texto(detalle.nombre),
      texto(detalle.tipo),
      centr(detalle.ingresos),
      centr(detalle.gastos),
      sumarCentavos([centr(detalle.ingresos), -centr(detalle.gastos)])
    ]);
  }
  return [
    ['Activos', centr(estado.activos)],
    ['Pasivos', centr(estado.pasivos)],
    ['Patrimonio', centr(estado.patrimonio)],
    ['Resultado acumulado', centr(estado.resultadoAcumulado)]
  ];
}

function totalesPara(clave, estado) {
  if (clave === 'libroMayor') {
    return ['Totales del periodo', '', null, centr(estado.totales?.debitos), centr(estado.totales?.creditos), null];
  }
  if (clave === 'balanceComprobacion') {
    return ['Totales del periodo', '', estado.totalDeudor, estado.totalAcreedor];
  }
  if (clave === 'estadoResultados') {
    return ['Totales del periodo', '', '', centr(estado.ingresos), centr(estado.gastos), centr(estado.resultado)];
  }
  return ['Totales del periodo', centr(estado.activos)];
}

function claveOrdenReporte(clave, columna, indice = 0) {
  const etiqueta = texto(columna.etiqueta).toLowerCase();
  if (etiqueta.includes('fecha')) return 'date';
  if (etiqueta.includes('débito') || etiqueta.includes('debitos')) return 'debit';
  if (etiqueta.includes('crédito') || etiqueta.includes('creditos')) return 'credit';
  if (etiqueta.includes('estado')) return 'status';
  if (columna.tipo === 'monto') return `monto-${indice}`;
  return null;
}

function renderizarTabla(contenedor, clave, estado, orden) {
  const columnas = COLUMNAS[clave] || [];
  const filasOriginales = filasPara(clave, estado);
  let filas = filasOriginales;
  const tablaOrden = `reporte-${clave}`;
  if (orden?.tabla === tablaOrden) {
    const indice = columnas.findIndex((columna, indiceColumna) => claveOrdenReporte(clave, columna, indiceColumna) === orden.columna);
    if (indice >= 0) {
      const claveColumna = claveOrdenReporte(clave, columnas[indice], indice);
      const tipo = columnas[indice].tipo === 'monto' || claveColumna.startsWith('monto-')
        ? 'numero'
        : (claveColumna === 'date' ? 'fecha' : (claveColumna === 'status' ? 'estado' : 'texto'));
      const registros = filasOriginales.map((fila, indiceFila) => ({ indiceFila, valor: fila[indice] }));
      filas = ordenarRegistros(registros, 'valor', orden.direccion, tipo).map((registro) => filasOriginales[registro.indiceFila]);
    }
  }
  const totales = totalesPara(clave, estado);
  const tabla = contenedor.querySelector('[data-tabla-reporte]');
  if (!tabla) return filas;
  const thead = tabla.tHead || tabla.createTHead();
  thead.innerHTML = `<tr>${columnas.map((columna, indiceColumna) => {
    const colOrden = claveOrdenReporte(clave, columna, indiceColumna);
    if (colOrden && typeof Comun.encabezadoOrdenable === 'function') {
      const tipo = colOrden === 'date' ? 'date' : (colOrden === 'status' ? 'status' : 'amount');
      return Comun.encabezadoOrdenable(`reporte-${clave}`, colOrden, columna.etiqueta, tipo, orden, columna.tipo === 'monto' ? 'num' : '');
    }
    return `<th scope="col" class="${columna.tipo === 'monto' ? 'num' : ''}">${escapeHtml(columna.etiqueta)}</th>`;
  }).join('')}</tr>`;
  const cuerpo = tabla.tBodies[0] || tabla.createTBody();
  cuerpo.innerHTML = '';
  for (const valores of filas) {
    const fila = documentoFila();
    valores.forEach((valor, indice) => {
      const celda = document.createElement('td');
      if (columnas[indice]?.tipo === 'monto') celda.className = 'num';
      celda.textContent = columnas[indice]?.tipo === 'monto' ? formatoMoneda(valor) : texto(valor);
      fila.appendChild(celda);
    });
    cuerpo.appendChild(fila);
  }
  const pie = tabla.tFoot || tabla.createTFoot();
  const totalesAlineados = totales.slice(0, columnas.length);
  const celdas = totalesAlineados.map((valor, indice) => {
    if (indice === 0 && typeof valor === 'string') {
      return `<th scope="row">${escapeHtml(valor)}</th>`;
    }
    if (valor === null || valor === '' || valor === undefined) return '<td></td>';
    return `<td class="num">${escapeHtml(formatoMoneda(valor))}</td>`;
  }).join('');
  const relleno = Math.max(0, columnas.length - totalesAlineados.length);
  pie.innerHTML = `<tr>${celdas}${'<td></td>'.repeat(relleno)}</tr>`;
  return filas;
}

function documentoFila() {
  return document.createElement('tr');
}

function renderizarExportacion(contenedor, { clave, estado, periodoId, puedeExportar, onExportar, opcionesExportador }) {
  const controles = contenedor.querySelector('[data-controles-exportacion]');
  if (!controles) return;
  if (puedeExportar === false) {
    controles.innerHTML = '';
    controles.hidden = true;
    return;
  }
  controles.hidden = false;
  renderizarBotonesExportacion(controles, {
    raiz: contenedor,
    permitido: true,
    onExportar,
    opcionesExportador,
    obtenerModelo: () => construirModeloExportacion(clave, estado.periodo || periodoId, estado)
  });
}

export function renderReporte({
  periodos = [],
  periodoId = '',
  resultado,
  estados,
  puedeExportar = true,
  onExportar = null,
  opcionesExportador = {},
  reporte = null,
  puedeVerAuditoria = false,
  eventosAuditoria = [],
  filtrosAuditoria = {},
  onFiltrosAuditoria = null,
  orden = undefined,
  ordenes = {}
} = {}) {
  const selector = document.getElementById('reportes-periodo');
  poblarSelect(selector, periodos.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.status})`
  })), { valor: periodoId });
  if (selector && periodoId) selector.value = periodoId;

  const datosMovimientos = resultado || { movimientos: [], totalDebit: 0, totalCredit: 0, vacio: true };
  const cuerpo = document.getElementById('reportes-movimientos');
  const totalDebe = document.getElementById('reportes-total-debitos');
  const totalHaber = document.getElementById('reportes-total-creditos');
  if (cuerpo) {
    cuerpo.innerHTML = '';
    for (const movimiento of datosMovimientos.movimientos) {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${formatoFecha(movimiento.date)}</td>
        <td>${escapeHtml(movimiento.concept)}</td>
        <td>${escapeHtml(`${movimiento.accountCode} · ${movimiento.accountName}`)}</td>
        <td class="num">${formatoMoneda(movimiento.debit)}</td>
        <td class="num">${formatoMoneda(movimiento.credit)}</td>`;
      cuerpo.appendChild(fila);
    }
  }
  if (totalDebe) totalDebe.textContent = formatoMoneda(datosMovimientos.totalDebit);
  if (totalHaber) totalHaber.textContent = formatoMoneda(datosMovimientos.totalCredit);
  mostrarMensaje('reportes-empty', datosMovimientos.vacio ? 'No existen movimientos registrados para el periodo seleccionado.' : '');

  const contenedor = asegurarContenedor();
  if (!contenedor) return null;
  const calculados = estados || obtenerReportesFinancieros(periodoId, { resultado: datosMovimientos });
  const estadosPorClave = calculados.estados || calculados;
  const activa = REPORTES.some((item) => item.clave === reporte)
    ? reporte
    : (contenedor.__reporteActivo && REPORTES.some((item) => item.clave === contenedor.__reporteActivo)
      ? contenedor.__reporteActivo
      : 'libroMayor');
  contenedor.__reporteActivo = activa;
  contenedor.__estadosReportes = estadosPorClave;
  contenedor.__periodoReportes = periodoId;

  renderizarPestanas(contenedor, activa);
  const barra = contenedor.querySelector('[data-reportes-tabs]');
  if (barra) barra.__cambiarReporte = (clave) => renderReporte({
    periodos,
    periodoId,
    resultado: datosMovimientos,
    estados: estadosPorClave,
    puedeExportar,
    onExportar,
    opcionesExportador,
    reporte: clave,
    puedeVerAuditoria,
    eventosAuditoria,
    filtrosAuditoria,
    onFiltrosAuditoria,
    orden,
    ordenes
  });

  const estado = estadosPorClave[activa] || { cuentas: [], saldos: [], detalle: [], totales: {}, vacio: true };
  const ordenReporte = ordenes[activa] || (orden?.tabla === `reporte-${activa}` ? orden : undefined);
  const filas = renderizarTabla(contenedor, activa, estado, ordenReporte);
  const advertencias = estado.advertencias || estado.errores || [];
  mensajeEn(contenedor.querySelector('[data-advertencia-reporte]'), advertencias.join(' '));
  mensajeEn(
    contenedor.querySelector('[data-estado-vacio-reporte]'),
    estado.vacio && filas.length === 0 ? 'No existen movimientos ni saldos para el periodo seleccionado.' : ''
  );
  renderizarExportacion(contenedor, {
    clave: activa,
    estado,
    periodoId,
    puedeExportar,
    onExportar,
    opcionesExportador
  });
  renderizarRegistroActividad(contenedor.querySelector('[data-registro-actividad]'), eventosAuditoria, {
    visible: Boolean(puedeVerAuditoria),
    filtros: filtrosAuditoria,
    onFiltros: onFiltrosAuditoria,
    orden
  });

  return {
    periodoId,
    reporte: activa,
    estado,
    estados: estadosPorClave,
    obtenerModelo: () => construirModeloExportacion(activa, estado.periodo || periodoId, estado)
  };
}

export const REPORTE_FINANCIERO_PESTANAS = REPORTES;
