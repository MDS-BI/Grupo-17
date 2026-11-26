import { asientosAprobadosDelPeriodo, calcularGastosPorCuenta, calcularResumen, periodosDisponibles } from '../contabilidad/reportes.js';
import { formatearCLP, formatearCLPCompacto, sumarCentavos } from '../contabilidad/dinero.js';
import { escapeHtml } from './contabilidad/comun.js';

const PALETA_GASTOS = ['#0f4c5c', '#1b6070', '#287484', '#358896', '#429ca8', '#4fb0bb', '#5cc4cf', '#0b3946'];
const PORCENTAJE = new Intl.NumberFormat('es-CL', { style: 'percent', maximumFractionDigits: 1 });
const numeroCompacto = formatearCLPCompacto;

function calcularEscala(minimo, maximo, pasos = 4){
  let min = Math.min(0, minimo);
  let max = Math.max(0, maximo);
  if(max === min) max = min + 100;

  const pasoBruto = (max - min) / pasos;
  const potencia = Math.pow(10, Math.floor(Math.log10(pasoBruto)));
  const residuo = pasoBruto / potencia;
  let paso = potencia;
  if(residuo > 5) paso = 10 * potencia;
  else if(residuo > 2) paso = 5 * potencia;
  else if(residuo > 1) paso = 2 * potencia;

  min = Math.floor(min / paso) * paso;
  max = Math.ceil(max / paso) * paso;
  if(max === min) max = min + paso;

  const ticks = [];
  for(let valor = min; valor <= max + paso * 0.5; valor += paso) ticks.push(valor);
  return { min, max, ticks };
}

function mostrarVacio(contenedor, mensaje){
  if(!contenedor) return;
  contenedor.innerHTML = `<p class="empty chart-empty" role="status">${escapeHtml(mensaje)}</p>`;
}

function sinMovimientosAprobados(series){
  return series.length > 0 && series.every(({ resumen }) => Number(resumen.movimientos) === 0);
}

function renderGraficoBarras(contenedor, series){
  if(!contenedor) return;
  if(series.length === 0){
    mostrarVacio(contenedor, 'No hay periodos contables registrados.');
    return;
  }
  if(sinMovimientosAprobados(series)){
    mostrarVacio(contenedor, 'No hay movimientos aprobados para las gráficas.');
    return;
  }

  const ancho = 720;
  const alto = 280;
  const margenIzq = 72;
  const margenDer = 16;
  const margenSup = 20;
  const margenInf = 42;
  const areaAncho = ancho - margenIzq - margenDer;
  const areaAlto = alto - margenSup - margenInf;

  const valores = series.flatMap(({ resumen }) => [resumen.ingresos, resumen.gastos]);
  const escala = calcularEscala(Math.min(...valores), Math.max(...valores));
  const y = (valor) => margenSup + ((escala.max - valor) / (escala.max - escala.min)) * areaAlto;
  const ceroY = y(0);
  const grupo = areaAncho / series.length;
  const barra = Math.max(5, Math.min(30, grupo * 0.26));
  const separacion = Math.max(2, barra * 0.2);
  const saltoEtiqueta = Math.ceil(series.length / 8);

  const rejilla = escala.ticks.map((valor) => {
    const posicion = y(valor);
    return `<line class="chart-grid-line" x1="${margenIzq}" y1="${posicion.toFixed(1)}" x2="${ancho - margenDer}" y2="${posicion.toFixed(1)}"></line>
      <text class="chart-axis-label" x="${margenIzq - 10}" y="${(posicion + 3).toFixed(1)}" text-anchor="end">${escapeHtml(numeroCompacto(valor))}</text>`;
  }).join('');

  const barras = series.map(({ periodo, resumen }, indice) => {
    const centro = margenIzq + grupo * (indice + 0.5);
    const xIngresos = centro - barra - separacion / 2;
    const xGastos = centro + separacion / 2;
    const yIngresos = y(resumen.ingresos);
    const yGastos = y(resumen.gastos);
    const etiqueta = indice % saltoEtiqueta === 0
      ? `<text class="chart-axis-label" x="${centro.toFixed(1)}" y="${alto - 16}" text-anchor="middle">${escapeHtml(periodo.name)}</text>`
      : '';
    return `<rect class="chart-bar chart-bar-ingresos" x="${xIngresos.toFixed(1)}" y="${Math.min(yIngresos, ceroY).toFixed(1)}" width="${barra.toFixed(1)}" height="${Math.abs(yIngresos - ceroY).toFixed(1)}" rx="2">
        <title>${escapeHtml(`${periodo.name} — Ingresos: ${formatearCLP(resumen.ingresos)}`)}</title>
      </rect>
      <rect class="chart-bar chart-bar-gastos" x="${xGastos.toFixed(1)}" y="${Math.min(yGastos, ceroY).toFixed(1)}" width="${barra.toFixed(1)}" height="${Math.abs(yGastos - ceroY).toFixed(1)}" rx="2">
        <title>${escapeHtml(`${periodo.name} — Gastos: ${formatearCLP(resumen.gastos)}`)}</title>
      </rect>
      ${etiqueta}`;
  }).join('');

  contenedor.innerHTML = `<svg viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="Comparación de ingresos y gastos por periodo">${rejilla}${barras}</svg>`;
}

function renderGraficoResultado(contenedor, series){
  if(!contenedor) return;
  if(series.length === 0){
    mostrarVacio(contenedor, 'No hay periodos contables registrados.');
    return;
  }
  if(sinMovimientosAprobados(series)){
    mostrarVacio(contenedor, 'No hay movimientos aprobados para las gráficas.');
    return;
  }

  const ancho = 720;
  const alto = 280;
  const margenIzq = 72;
  const margenDer = 16;
  const margenSup = 20;
  const margenInf = 42;
  const areaAncho = ancho - margenIzq - margenDer;
  const areaAlto = alto - margenSup - margenInf;

  const valores = series.map(({ resumen }) => resumen.resultado);
  const escala = calcularEscala(Math.min(...valores), Math.max(...valores));
  const y = (valor) => margenSup + ((escala.max - valor) / (escala.max - escala.min)) * areaAlto;
  const x = (indice) => series.length === 1
    ? margenIzq + areaAncho / 2
    : margenIzq + (areaAncho / (series.length - 1)) * indice;
  const saltoEtiqueta = Math.ceil(series.length / 8);

  const rejilla = escala.ticks.map((valor) => {
    const posicion = y(valor);
    return `<line class="chart-grid-line" x1="${margenIzq}" y1="${posicion.toFixed(1)}" x2="${ancho - margenDer}" y2="${posicion.toFixed(1)}"></line>
      <text class="chart-axis-label" x="${margenIzq - 10}" y="${(posicion + 3).toFixed(1)}" text-anchor="end">${escapeHtml(numeroCompacto(valor))}</text>`;
  }).join('');

  const puntos = series.map(({ resumen }, indice) => ({
    x: x(indice),
    y: y(resumen.resultado)
  }));
  const ruta = puntos.map((punto, indice) => `${indice === 0 ? 'M' : 'L'} ${punto.x.toFixed(1)} ${punto.y.toFixed(1)}`).join(' ');
  const linea = series.length > 1 ? `<path class="chart-line" d="${ruta}"></path>` : '';

  const nodos = series.map(({ periodo, resumen }, indice) => {
    const punto = puntos[indice];
    const negativo = resumen.resultado < 0;
    const etiqueta = indice % saltoEtiqueta === 0
      ? `<text class="chart-axis-label" x="${punto.x.toFixed(1)}" y="${alto - 16}" text-anchor="middle">${escapeHtml(periodo.name)}</text>`
      : '';
    return `<circle class="chart-dot${negativo ? ' chart-dot-negative' : ''}" cx="${punto.x.toFixed(1)}" cy="${punto.y.toFixed(1)}" r="4">
        <title>${escapeHtml(`${periodo.name} — Resultado: ${formatearCLP(resumen.resultado)}`)}</title>
      </circle>
      ${etiqueta}`;
  }).join('');

  contenedor.innerHTML = `<svg viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="Resultado financiero por periodo">${rejilla}${linea}${nodos}</svg>`;
}

function renderGraficoGastos(contenedor, leyenda, cuentas, periodo){
  if(!contenedor) return;
  if(leyenda) leyenda.innerHTML = '';

  if(cuentas.length === 0){
    mostrarVacio(contenedor, periodo
      ? 'Sin gastos registrados en el periodo seleccionado.'
      : 'No hay periodos contables registrados.');
    return;
  }

  const total = sumarCentavos(cuentas.map((cuenta) => cuenta.total));
  const centro = 100;
  const radio = 70;
  const grosor = 26;
  const circunferencia = 2 * Math.PI * radio;
  let acumulado = 0;

  const segmentos = cuentas.map((cuenta, indice) => {
    const fraccion = total > 0 ? cuenta.total / total : 0;
    const longitud = fraccion * circunferencia;
    const desplazamiento = -acumulado;
    acumulado += longitud;
    const color = PALETA_GASTOS[indice % PALETA_GASTOS.length];
    return `<circle class="chart-donut-segment" cx="${centro}" cy="${centro}" r="${radio}" stroke="${color}" stroke-width="${grosor}" stroke-dasharray="${longitud.toFixed(2)} ${(circunferencia - longitud).toFixed(2)}" stroke-dashoffset="${desplazamiento.toFixed(2)}" transform="rotate(-90 ${centro} ${centro})">
      <title>${escapeHtml(`${cuenta.code} — ${cuenta.name}: ${formatearCLP(cuenta.total)} (${PORCENTAJE.format(fraccion)})`)}</title>
    </circle>`;
  }).join('');

  contenedor.innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="Distribución de gastos por cuenta del periodo seleccionado">
    <circle class="chart-donut-track" cx="${centro}" cy="${centro}" r="${radio}" stroke-width="${grosor}"></circle>
    ${segmentos}
    <text class="chart-donut-total" x="${centro}" y="${centro - 2}" text-anchor="middle">${escapeHtml(numeroCompacto(total))}</text>
    <text class="chart-donut-label" x="${centro}" y="${centro + 14}" text-anchor="middle">Total</text>
  </svg>`;

  if(leyenda){
    leyenda.innerHTML = cuentas.map((cuenta, indice) => {
      const color = PALETA_GASTOS[indice % PALETA_GASTOS.length];
      const fraccion = total > 0 ? cuenta.total / total : 0;
      const etiqueta = `${cuenta.code} — ${cuenta.name}`;
      return `<li>
        <i class="chart-swatch" style="background:${color}" aria-hidden="true"></i>
        <span class="chart-legend-text" title="${escapeHtml(etiqueta)}">${escapeHtml(etiqueta)}</span>
        <span class="chart-legend-value">${formatearCLP(cuenta.total)} · ${PORCENTAJE.format(fraccion)}</span>
      </li>`;
    }).join('');
  }
}

export function plantillaAnalisisFinanciero(){
  return `
    <div class="chart-grid">
      <section class="chart-card chart-card-wide" aria-labelledby="chart-ingresos-heading">
        <div class="chart-header">
          <h3 id="chart-ingresos-heading">Ingresos vs gastos por periodo</h3>
          <div class="chart-legend" aria-hidden="true">
            <span><i class="chart-swatch chart-swatch-ingresos"></i>Ingresos</span>
            <span><i class="chart-swatch chart-swatch-gastos"></i>Gastos</span>
          </div>
        </div>
        <div id="chart-ingresos-gastos" class="chart-canvas" data-grafica="ingresos-gastos"></div>
      </section>

      <section class="chart-card" aria-labelledby="chart-gastos-heading">
        <h3 id="chart-gastos-heading">Gastos por cuenta <span id="chart-gastos-periodo" class="muted"></span></h3>
        <div class="chart-donut">
          <div id="chart-gastos-cuenta" class="chart-canvas chart-canvas-donut" data-grafica="gastos-cuenta"></div>
          <ul id="chart-gastos-leyenda" class="chart-legend-list"></ul>
        </div>
      </section>

      <section class="chart-card" aria-labelledby="chart-resultado-heading">
        <div class="chart-header">
          <h3 id="chart-resultado-heading">Resultado financiero por periodo</h3>
          <div class="chart-legend" aria-hidden="true">
            <span><i class="chart-swatch chart-swatch-resultado"></i>Resultado</span>
          </div>
        </div>
        <div id="chart-resultado" class="chart-canvas" data-grafica="resultado"></div>
      </section>
    </div>`;
}

function elegirPeriodo(periodos, preferido = ''){
  if(preferido && periodos.some((periodo) => periodo.id === preferido)) return preferido;
  const asientos = asientosAprobadosDelPeriodo();
  const conMovimientos = [...periodos].reverse().find((periodo) => asientos.some((asiento) => asiento.period_id === periodo.id));
  const elegido = conMovimientos || periodos[0];
  return elegido ? elegido.id : '';
}

export function renderAnalisisFinanciero({ periodoId = '', periodos = [] } = {}){
  const raiz = document.querySelector('[data-panel-seccion="analisis-financiero"]');
  if(!raiz) return;
  const listaPeriodos = periodos.length > 0 ? periodos : periodosDisponibles();
  const id = elegirPeriodo(listaPeriodos, periodoId);
  const series = listaPeriodos.map((periodo) => ({ periodo, resumen: calcularResumen(periodo.id) }));
  const periodoActual = listaPeriodos.find((periodo) => periodo.id === id) || null;
  const gastosPorCuenta = calcularGastosPorCuenta(id).map((fila) => ({
    code: fila.codigo,
    name: fila.nombre,
    total: fila.gastoCentavos
  }));

  const etiqueta = raiz.querySelector('#chart-gastos-periodo');
  if(etiqueta) etiqueta.textContent = periodoActual ? periodoActual.name : '';
  renderGraficoBarras(raiz.querySelector('[data-grafica="ingresos-gastos"]'), series);
  renderGraficoGastos(
    raiz.querySelector('[data-grafica="gastos-cuenta"]'),
    raiz.querySelector('#chart-gastos-leyenda'),
    gastosPorCuenta,
    periodoActual
  );
  renderGraficoResultado(raiz.querySelector('[data-grafica="resultado"]'), series);
}
