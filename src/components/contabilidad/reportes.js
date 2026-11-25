import * as Comun from './comun.js';
import { formatearCLP, sumarCentavos } from '../../contabilidad/dinero.js';
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

const UNIDAD_MONETARIA = 'CLP';
const SIN_DETALLE = 'No hay movimientos que compongan este total.';

const COLUMNAS = Object.freeze({
  libroMayor: [
    { etiqueta: 'Código', tipo: 'texto' },
    { etiqueta: 'Cuenta', tipo: 'texto' },
    { etiqueta: `Saldo inicial (${UNIDAD_MONETARIA})`, tipo: 'monto' },
    { etiqueta: `Débitos (${UNIDAD_MONETARIA})`, tipo: 'monto' },
    { etiqueta: `Créditos (${UNIDAD_MONETARIA})`, tipo: 'monto' },
    { etiqueta: `Saldo final (${UNIDAD_MONETARIA})`, tipo: 'monto' }
  ],
  balanceComprobacion: [
    { etiqueta: 'Código', tipo: 'texto' },
    { etiqueta: 'Cuenta', tipo: 'texto' },
    { etiqueta: `Saldo deudor (${UNIDAD_MONETARIA})`, tipo: 'monto' },
    { etiqueta: `Saldo acreedor (${UNIDAD_MONETARIA})`, tipo: 'monto' }
  ],
  estadoResultados: [
    { etiqueta: 'Código', tipo: 'texto' },
    { etiqueta: 'Cuenta', tipo: 'texto' },
    { etiqueta: 'Tipo', tipo: 'texto' },
    { etiqueta: `Ingresos (${UNIDAD_MONETARIA})`, tipo: 'monto' },
    { etiqueta: `Gastos (${UNIDAD_MONETARIA})`, tipo: 'monto' },
    { etiqueta: `Resultado (${UNIDAD_MONETARIA})`, tipo: 'monto' }
  ],
  balanceGeneral: [
    { etiqueta: 'Concepto', tipo: 'texto' },
    { etiqueta: `Importe (${UNIDAD_MONETARIA})`, tipo: 'monto' }
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
  return formatearCLP(centavos);
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

function asegurarPanelDetalle() {
  const vista = document.getElementById('view-reportes');
  if (!vista) return null;
  let panel = vista.querySelector('[data-detalle-totales]');
  if (!panel) {
    panel = document.createElement('section');
    panel.className = 'card card-wide detalle-totales';
    panel.id = 'detalle-totales';
    panel.setAttribute('data-detalle-totales', '');
    panel.setAttribute('aria-live', 'polite');
    panel.hidden = true;
    panel.innerHTML = `
      <div class="detalle-totales-cabecera">
        <h3 data-detalle-titulo></h3>
        <button type="button" class="secondary" data-cerrar-detalle>Cerrar detalle</button>
      </div>
      <p data-detalle-resumen></p>
      <div class="tabla-detalle-contenedor">
        <table class="tabla-financiera tabla-detalle-totales">
          <thead>
            <tr>
              <th scope="col">Origen</th>
              <th scope="col">Referencia</th>
              <th scope="col" class="num">Importe (${UNIDAD_MONETARIA})</th>
            </tr>
          </thead>
          <tbody data-detalle-filas></tbody>
        </table>
      </div>`;
    vista.appendChild(panel);
  }
  if (!panel.__detalleConectado) {
    panel.__detalleConectado = true;
    panel.querySelector('[data-cerrar-detalle]')?.addEventListener('click', () => ocultarDetalleTotales(panel));
  }
  return panel;
}

function ocultarDetalleTotales(panel) {
  if (!panel) return;
  panel.hidden = true;
  const documento = panel.ownerDocument || document;
  for (const boton of documento.querySelectorAll('[data-detalle-total][aria-expanded="true"]')) {
    boton.setAttribute('aria-expanded', 'false');
  }
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
    const cuentas = Array.isArray(estado.cuentas) ? estado.cuentas : [];
    const saldoInicial = sumarCentavos(cuentas.map((cuenta) => centr(cuenta.saldoInicial)));
    const saldoFinal = sumarCentavos(cuentas.map((cuenta) => centr(cuenta.saldoFinal)));
    return ['Totales del periodo', '', saldoInicial, centr(estado.totales?.debitos), centr(estado.totales?.creditos), saldoFinal];
  }
  if (clave === 'balanceComprobacion') {
    return ['Totales del periodo', '', estado.totalDeudor, estado.totalAcreedor];
  }
  if (clave === 'estadoResultados') {
    return ['Totales del periodo', '', '', centr(estado.ingresos), centr(estado.gastos), centr(estado.resultado)];
  }
  return ['Totales del periodo', centr(estado.activos)];
}

function unirDetalle(...partes) {
  return partes.map((parte) => texto(parte).trim()).filter(Boolean).join(' · ');
}

function filaDetalle(etiqueta, referencia, valor) {
  return { etiqueta: texto(etiqueta), referencia: texto(referencia), valor: centr(valor) };
}

function cerrarDetalle(titulo, filas, tipoRegistro) {
  const visibles = filas.filter((fila) => fila.valor !== 0);
  return {
    titulo: `${titulo} (${UNIDAD_MONETARIA})`,
    resumen: `${visibles.length} ${tipoRegistro} que componen el total en ${UNIDAD_MONETARIA}.`,
    filas: visibles.length ? visibles : [filaDetalle('Sin registros', SIN_DETALLE, 0)]
  };
}

function detalleMovimientos(movimientos, campo, etiqueta) {
  const filas = (Array.isArray(movimientos) ? movimientos : [])
    .filter((movimiento) => centr(movimiento?.[campo]) !== 0)
    .map((movimiento) => filaDetalle(
      unirDetalle(movimiento.accountCode, movimiento.accountName || 'Cuenta desconocida'),
      unirDetalle(formatoFecha(movimiento.date), `${texto(movimiento.series)}-${texto(movimiento.folio)}`, movimiento.concept || movimiento.lineConcept),
      movimiento[campo]
    ));
  return cerrarDetalle(`Desglose de ${etiqueta}`, filas, 'movimientos');
}

function detalleReporte(clave, indiceColumna, estado, movimientos, columnas) {
  const etiquetaCompleta = texto(columnas[indiceColumna]?.etiqueta);
  const etiqueta = etiquetaCompleta.replace(/\s*\(CLP\)\s*$/i, '') || 'Total';

  if (clave === 'libroMayor' && indiceColumna === 3) {
    return detalleMovimientos(movimientos, 'debit', 'Débitos');
  }
  if (clave === 'libroMayor' && indiceColumna === 4) {
    return detalleMovimientos(movimientos, 'credit', 'Créditos');
  }

  let filas = [];
  if (clave === 'libroMayor') {
    const campo = indiceColumna === 2 ? 'saldoInicial' : 'saldoFinal';
    const referencia = campo === 'saldoInicial'
      ? 'Saldo inicial de la cuenta'
      : 'Saldo final = saldo inicial + débitos - créditos';
    filas = (Array.isArray(estado?.cuentas) ? estado.cuentas : [])
      .filter((cuenta) => centr(cuenta[campo]) !== 0)
      .map((cuenta) => filaDetalle(unirDetalle(cuenta.codigo, cuenta.nombre), referencia, cuenta[campo]));
  } else if (clave === 'balanceComprobacion') {
    const campo = indiceColumna === 2 ? 'saldoDeudor' : 'saldoAcreedor';
    const referencia = campo === 'saldoDeudor' ? 'Saldo deudor de la cuenta' : 'Saldo acreedor de la cuenta';
    filas = (Array.isArray(estado?.saldos) ? estado.saldos : [])
      .filter((saldo) => centr(saldo[campo]) !== 0)
      .map((saldo) => filaDetalle(unirDetalle(saldo.codigo, saldo.nombre), referencia, saldo[campo]));
  } else if (clave === 'estadoResultados') {
    filas = filasPara('estadoResultados', estado || {})
      .filter((fila) => centr(fila[indiceColumna]) !== 0)
      .map((fila) => filaDetalle(unirDetalle(fila[0], fila[1]), texto(fila[2]), fila[indiceColumna]));
  } else {
    filas = filasPara('balanceGeneral', estado || {})
      .filter((fila) => texto(fila[0]) === 'Activos' && centr(fila[1]) !== 0)
      .map((fila) => filaDetalle(texto(fila[0]), 'Total de activos del periodo', fila[1]));
  }

  return cerrarDetalle(`Desglose de ${etiqueta}`, filas, 'registros');
}

function mostrarDetalleTotales(panel, boton, detalle) {
  if (!panel || !detalle) return;
  mensajeEn(panel.querySelector('[data-detalle-titulo]'), detalle.titulo);
  mensajeEn(panel.querySelector('[data-detalle-resumen]'), detalle.resumen);
  const cuerpo = panel.querySelector('[data-detalle-filas]');
  if (cuerpo) {
    cuerpo.innerHTML = '';
    for (const fila of detalle.filas) {
      const filaNodo = document.createElement('tr');
      for (const [indice, valor] of [fila.etiqueta, fila.referencia, formatoMoneda(fila.valor)].entries()) {
        const celda = document.createElement('td');
        if (indice === 2) celda.className = 'num';
        celda.textContent = valor;
        filaNodo.appendChild(celda);
      }
      cuerpo.appendChild(filaNodo);
    }
  }
  panel.hidden = false;
  const documento = panel.ownerDocument || document;
  for (const control of documento.querySelectorAll('[data-detalle-total]')) {
    control.setAttribute('aria-expanded', String(control === boton));
  }
}

function conectarTotales(tabla, panel) {
  if (!tabla || !panel || tabla.__detallesConectados) return;
  tabla.__detallesConectados = true;
  tabla.addEventListener('click', (evento) => {
    const boton = evento.target.closest?.('[data-detalle-total]');
    if (!boton || !tabla.contains(boton)) return;
    const contexto = tabla.__detalleContexto || {};
    const detalle = boton.dataset.detalleTotal === 'movimientos'
      ? detalleMovimientos(contexto.movimientos, boton.dataset.campo, boton.dataset.etiqueta)
      : detalleReporte(
        contexto.clave,
        Number(boton.dataset.columna),
        contexto.estado,
        contexto.movimientos,
        COLUMNAS[contexto.clave] || []
      );
    mostrarDetalleTotales(panel, boton, detalle);
  });
}

function claveOrdenReporte(clave, columna, indice = 0) {
  const etiqueta = texto(columna.etiqueta).toLowerCase();
  if (etiqueta.includes('fecha')) return 'date';
  if (etiqueta.includes('débito') || etiqueta.includes('debitos')) return 'debit';
  if (etiqueta.includes('crédito') || etiqueta.includes('creditos')) return 'credit';
  if (etiqueta.includes('estado')) return 'status';
  if (etiqueta === 'tipo') return 'tipo';
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
      const tipo = colOrden === 'date'
        ? 'date'
        : (colOrden === 'status' ? 'status' : (colOrden === 'tipo' ? 'text' : 'amount'));
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
    const etiqueta = texto(columnas[indice]?.etiqueta).replace(/\s*\(CLP\)\s*$/i, '') || 'Total';
    return `<td class="num"><button type="button" class="boton-total" data-detalle-total="reporte" data-reporte="${escapeHtml(clave)}" data-columna="${indice}" aria-expanded="false" aria-controls="detalle-totales" aria-label="Ver desglose de ${escapeHtml(etiqueta)}">${escapeHtml(formatoMoneda(valor))}</button></td>`;
  }).join('');
  const relleno = Math.max(0, columnas.length - totalesAlineados.length);
  pie.innerHTML = `<tr class="fila-totales">${celdas}${'<td></td>'.repeat(relleno)}</tr>`;
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
  if (totalDebe) {
    totalDebe.innerHTML = `<button type="button" class="boton-total" data-detalle-total="movimientos" data-campo="debit" data-etiqueta="Débito (${UNIDAD_MONETARIA})" aria-expanded="false" aria-controls="detalle-totales" aria-label="Ver desglose de Débito">${escapeHtml(formatoMoneda(datosMovimientos.totalDebit))}</button>`;
  }
  if (totalHaber) {
    totalHaber.innerHTML = `<button type="button" class="boton-total" data-detalle-total="movimientos" data-campo="credit" data-etiqueta="Crédito (${UNIDAD_MONETARIA})" aria-expanded="false" aria-controls="detalle-totales" aria-label="Ver desglose de Crédito">${escapeHtml(formatoMoneda(datosMovimientos.totalCredit))}</button>`;
  }
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
  const panelDetalle = asegurarPanelDetalle();
  ocultarDetalleTotales(panelDetalle);
  const tablaMovimientos = document.getElementById('reportes-tabla');
  if (tablaMovimientos) {
    tablaMovimientos.__detalleContexto = { movimientos: datosMovimientos.movimientos };
    conectarTotales(tablaMovimientos, panelDetalle);
  }
  const tablaReporte = contenedor.querySelector('[data-tabla-reporte]');
  if (tablaReporte) {
    tablaReporte.__detalleContexto = { clave: activa, estado, movimientos: datosMovimientos.movimientos };
    conectarTotales(tablaReporte, panelDetalle);
  }
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
