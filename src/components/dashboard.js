import { listarPeriodos } from '../contabilidad/periodos.js';
import { calcularResumen, calcularSaldosCuentas, asientosAprobadosDelPeriodo } from '../contabilidad/reportes.js';
import { formatearMXN } from '../contabilidad/dinero.js';
import { escapeHtml } from './contabilidad/comun.js';

const PALETA_GASTOS = ['#0f766e', '#b45309', '#2563eb', '#7c3aed', '#be123c', '#0e7490', '#4d7c0f', '#a16207'];
const PORCENTAJE = new Intl.NumberFormat('es-MX', { style: 'percent', maximumFractionDigits: 1 });

function setText(id, text){
  const elemento = document.getElementById(id);
  if(elemento) elemento.textContent = text;
}

function elegirPeriodoDashboard(periodos, preferido = ''){
  if(preferido && periodos.some(p => p.id === preferido)) return preferido;
  const asientos = asientosAprobadosDelPeriodo();
  const conMovimientos = [...periodos].reverse().find(p => asientos.some(a => a.period_id === p.id));
  const elegido = conMovimientos || periodos[0];
  return elegido ? elegido.id : '';
}

function renderPeriodos(periodos, periodoId){
  const selector = document.getElementById('dashboard-periodo');
  if(!selector) return;

  const anterior = periodoId || selector.value;
  selector.innerHTML = '';

  if(periodos.length === 0){
    const opcion = document.createElement('option');
    opcion.value = '';
    opcion.textContent = 'Sin periodos contables';
    selector.appendChild(opcion);
    selector.disabled = true;
    return;
  }

  selector.disabled = false;
  periodos.forEach(p => {
    const opcion = document.createElement('option');
    opcion.value = p.id;
    opcion.textContent = `${p.name} (${p.status})`;
    selector.appendChild(opcion);
  });

  if(anterior && periodos.some(p => p.id === anterior)) selector.value = anterior;
  else if(periodoId) selector.value = periodoId;
}

function numeroCompacto(centavos){
  const valor = (Number(centavos) || 0) / 100;
  const absoluto = Math.abs(valor);
  if(absoluto >= 1000000) return `$${(valor / 1000000).toLocaleString('es-MX', { maximumFractionDigits: 1 })}M`;
  if(absoluto >= 1000) return `$${(valor / 1000).toLocaleString('es-MX', { maximumFractionDigits: 1 })}k`;
  return `$${valor.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`;
}

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
  contenedor.innerHTML = `<p class="empty chart-empty">${escapeHtml(mensaje)}</p>`;
}

function renderGraficoBarras(contenedor, series){
  if(!contenedor) return;
  if(series.length === 0){
    mostrarVacio(contenedor, 'No hay periodos contables registrados.');
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
        <title>${escapeHtml(`${periodo.name} · Ingresos: ${formatearMXN(resumen.ingresos)}`)}</title>
      </rect>
      <rect class="chart-bar chart-bar-gastos" x="${xGastos.toFixed(1)}" y="${Math.min(yGastos, ceroY).toFixed(1)}" width="${barra.toFixed(1)}" height="${Math.abs(yGastos - ceroY).toFixed(1)}" rx="2">
        <title>${escapeHtml(`${periodo.name} · Gastos: ${formatearMXN(resumen.gastos)}`)}</title>
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
        <title>${escapeHtml(`${periodo.name} · Resultado: ${formatearMXN(resumen.resultado)}`)}</title>
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

  const total = cuentas.reduce((suma, cuenta) => suma + cuenta.total, 0);
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
      <title>${escapeHtml(`${cuenta.code} · ${cuenta.name}: ${formatearMXN(cuenta.total)} (${PORCENTAJE.format(fraccion)})`)}</title>
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
      const etiqueta = `${cuenta.code} · ${cuenta.name}`;
      return `<li>
        <i class="chart-swatch" style="background:${color}" aria-hidden="true"></i>
        <span class="chart-legend-text" title="${escapeHtml(etiqueta)}">${escapeHtml(etiqueta)}</span>
        <span class="chart-legend-value">${formatearMXN(cuenta.total)} · ${PORCENTAJE.format(fraccion)}</span>
      </li>`;
    }).join('');
  }
}

export function renderDashboard(){
  const periodos = listarPeriodos();
  const selector = document.getElementById('dashboard-periodo');
  const periodoId = elegirPeriodoDashboard(periodos, selector ? selector.value : '');
  renderPeriodos(periodos, periodoId);

  const resumen = periodoId
    ? calcularResumen(periodoId)
    : { ingresos: 0, gastos: 0, resultado: 0, movimientos: 0, hayMovimientos: false };

  setText('stat-ingresos', formatearMXN(resumen.ingresos));
  setText('stat-gastos', formatearMXN(resumen.gastos));
  setText('stat-resultado', formatearMXN(resumen.resultado));
  setText('stat-asientos', String(resumen.movimientos));

  const resultado = document.getElementById('stat-resultado');
  if(resultado) resultado.classList.toggle('negative', resumen.resultado < 0);

  const vacio = document.getElementById('dashboard-empty');
  if(vacio){
    if(periodos.length === 0){
      vacio.textContent = 'No hay periodos contables registrados.';
      vacio.hidden = false;
    }else if(!resumen.hayMovimientos){
      vacio.textContent = 'No hay información financiera disponible para el periodo seleccionado.';
      vacio.hidden = false;
    }else{
      vacio.textContent = '';
      vacio.hidden = true;
    }
  }

  const series = periodos.map(p => ({ periodo: p, resumen: calcularResumen(p.id) }));
  const periodoActual = periodos.find(p => p.id === periodoId) || null;
  const gastosPorCuenta = periodoId
    ? calcularSaldosCuentas(periodoId)
      .filter(cuenta => cuenta.type === 'gasto' && Number(cuenta.saldo) > 0)
      .map(cuenta => ({ code: cuenta.code, name: cuenta.name, total: Number(cuenta.saldo) }))
    : [];

  setText('chart-gastos-periodo', periodoActual ? periodoActual.name : '');
  renderGraficoBarras(document.getElementById('chart-ingresos-gastos'), series);
  renderGraficoGastos(
    document.getElementById('chart-gastos-cuenta'),
    document.getElementById('chart-gastos-leyenda'),
    gastosPorCuenta,
    periodoActual
  );
  renderGraficoResultado(document.getElementById('chart-resultado'), series);
}
