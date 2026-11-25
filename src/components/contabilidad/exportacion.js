import {
  exportarCSV,
  exportarExcel,
  exportarHTML,
  exportarPDF,
  exportarImprimible,
  validarModeloExportacion
} from '../../contabilidad/exportacion-reportes.js';

export const FORMATOS_EXPORTACION = Object.freeze(['pdf', 'xls', 'csv', 'html']);

const EXPORTADORES = Object.freeze({
  pdf: exportarPDF,
  xls: exportarExcel,
  excel: exportarExcel,
  csv: exportarCSV,
  html: exportarImprimible,
  imprimir: exportarImprimible
});

function opcionesDe(contenedor) {
  return contenedor.__opcionesExportacion || {};
}

function formatoDe(boton) {
  if (boton.dataset.formato) return boton.dataset.formato;
  if (boton.hasAttribute('data-exportar-pdf')) return 'pdf';
  if (boton.hasAttribute('data-exportar-excel')) return 'xls';
  return '';
}

function mensajeFalloExportacion(detalle = 'error inesperado') {
  return `No se pudo exportar el reporte: ${detalle}. Reintente la descarga.`;
}

export function mostrarAdvertenciaExportacion(mensaje, raiz = null) {
  const contenedor = raiz?.querySelector?.('[data-advertencia-exportacion]')
    || document.querySelector('[data-advertencia-exportacion]');
  if (!contenedor) return;
  contenedor.textContent = mensaje || '';
  contenedor.hidden = !mensaje;
}

export function exportarSegunFormato(formato, modelo, opciones = {}) {
  const exportador = EXPORTADORES[formato] || exportarPDF;
  return exportador(modelo, opciones);
}

export function conectarEventosExportacion(contenedor, opciones = {}) {
  if (!contenedor) return () => {};
  contenedor.__opcionesExportacion = { ...opcionesDe(contenedor), ...opciones };
  if (contenedor.__exportacionConectada) return () => {};
  contenedor.__exportacionConectada = true;
  const manejador = (evento) => {
    const boton = evento.target?.closest?.('[data-exportar-pdf], [data-exportar-excel], [data-formato]');
    if (!boton || !contenedor.contains(boton) || boton.disabled) return;
    const actuales = opcionesDe(contenedor);
    const formato = formatoDe(boton);
    const obtenerModelo = actuales.obtenerModelo;
    const modelo = typeof obtenerModelo === 'function' ? obtenerModelo() : null;
    const revision = validarModeloExportacion(modelo);
    if (!revision.ok) {
      mostrarAdvertenciaExportacion(revision.advertencia, actuales.raiz || contenedor);
      actuales.onError?.(revision.advertencia, formato);
      return;
    }
    try {
      const resultado = typeof actuales.onExportar === 'function'
        ? actuales.onExportar(formato, modelo)
        : exportarSegunFormato(formato, modelo, actuales.opcionesExportador);
      if (resultado && resultado.ok === false) {
        const mensaje = mensajeFalloExportacion(resultado.advertencia || 'error inesperado');
        mostrarAdvertenciaExportacion(mensaje, actuales.raiz || contenedor);
        actuales.onError?.(mensaje, formato);
      } else {
        mostrarAdvertenciaExportacion('', actuales.raiz || contenedor);
        actuales.onSuccess?.(resultado, formato);
      }
    } catch (error) {
      const mensaje = mensajeFalloExportacion(error?.message || 'error inesperado');
      mostrarAdvertenciaExportacion(mensaje, actuales.raiz || contenedor);
      actuales.onError?.(mensaje, formato);
    }
  };
  contenedor.addEventListener('click', manejador);
  return () => {
    contenedor.removeEventListener('click', manejador);
    contenedor.__exportacionConectada = false;
  };
}

export const enlazarExportacion = conectarEventosExportacion;
export const conectarExportacionReportes = conectarEventosExportacion;

export function crearBotonExportacion(formato, opciones = {}) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = opciones.clase || 'boton-destacado';
  boton.dataset.formato = formato;
  if (formato === 'pdf') boton.setAttribute('data-exportar-pdf', '');
  if (formato === 'xls') boton.setAttribute('data-exportar-excel', '');
  boton.textContent = opciones.etiqueta || (formato === 'pdf' ? 'Exportar PDF' : 'Exportar Excel');
  boton.disabled = opciones.permitido === false;
  return boton;
}

export function crearBotonesExportacion(opciones = {}) {
  const contenedor = document.createElement('div');
  contenedor.className = 'acciones-exportacion';
  contenedor.setAttribute('data-exportacion', '');
  const aviso = document.createElement('div');
  aviso.className = 'advertencia-exportacion';
  aviso.setAttribute('data-advertencia-exportacion', '');
  aviso.setAttribute('role', 'status');
  aviso.hidden = true;
  contenedor.appendChild(crearBotonExportacion('pdf', opciones));
  contenedor.appendChild(crearBotonExportacion('xls', opciones));
  contenedor.appendChild(aviso);
  conectarEventosExportacion(contenedor, opciones);
  return contenedor;
}

export function renderizarBotonesExportacion(contenedor, opciones = {}) {
  if (!contenedor) return null;
  contenedor.innerHTML = '';
  const permitido = opciones.permitido !== false;
  const aviso = document.createElement('div');
  aviso.className = 'advertencia-exportacion';
  aviso.setAttribute('data-advertencia-exportacion', '');
  aviso.setAttribute('role', 'status');
  aviso.hidden = true;
  contenedor.appendChild(crearBotonExportacion('pdf', { permitido }));
  contenedor.appendChild(crearBotonExportacion('xls', { permitido }));
  contenedor.appendChild(aviso);
  conectarEventosExportacion(contenedor, opciones);
  return contenedor;
}
