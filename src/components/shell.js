import { getConfig, labelFor } from '../module-config.js';
import { IDENTIDAD_EMPRESA, NOMBRE_EMPRESA, iconoSeccion, obtenerConfigInterfaz } from '../contabilidad/interfaz-config.js';


function escapeHtml(valor){ return String(valor ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }

const CONNECTOR_WORDS = new Set(['y', 'e', 'o', 'u', 'de', 'del', 'la', 'las', 'el', 'los', 'en', 'para', 'por', 'con', 'and', 'of', 'for', 'the', '&']);

const SECCIONES_ENCABEZADO = Object.freeze({
  'dashboard-heading': 'dashboard',
  'resumen-view-heading': 'resumen',
  'cuentas-view-heading': 'cuentas',
  'asientos-view-heading': 'asientos',
  'pagos-view-heading': 'pagos',
  'periodos-view-heading': 'periodos',
  'reportes-view-heading': 'reportes',
  'entities-view-heading': 'entities',
  'documents-view-heading': 'documents',
  'search-view-heading': 'search'
});


export function monogramFor(name){
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  const significant = words.filter(w => !CONNECTOR_WORDS.has(w.toLowerCase()));
  const source = significant.length > 0 ? significant : words;
  const letters = source.length > 0 ? source.map(w => w[0]).slice(0, 2).join('') : 'E';
  return letters.toUpperCase();
}

export function obtenerIdentidadEmpresa(){
  const cfg = typeof obtenerConfigInterfaz === 'function' ? obtenerConfigInterfaz() : {};
  const config = getConfig();
  return {
    nombreEmpresa: String(cfg.nombreEmpresa || config?.theme?.nombreEmpresa || NOMBRE_EMPRESA).trim() || NOMBRE_EMPRESA,
    logoEmpresa: String(cfg.logoEmpresa || config?.theme?.logoEmpresa || '').trim()
  };
}

export function renderizarIconosEncabezados(){
  if(typeof document === 'undefined') return [];
  const actualizados = [];
  Object.entries(SECCIONES_ENCABEZADO).forEach(([id, seccion]) => {
    const encabezado = document.getElementById(id);
    if(!encabezado) return;
    encabezado.setAttribute('data-icono', iconoSeccion(seccion));
    actualizados.push(encabezado);
  });
  return actualizados;
}

export function renderLogo(container){
  if(!container) return;
  const { nombreEmpresa, logoEmpresa } = obtenerIdentidadEmpresa();
  if(logoEmpresa){
    container.innerHTML = `<img src="${escapeHtml(logoEmpresa)}" alt="Logo de ${escapeHtml(nombreEmpresa)}" class="logo-empresa-img" width="34" height="34" />`;
    return;
  }
  const modulo = String(getConfig()?.moduleName || nombreEmpresa);
  const letras = monogramFor(modulo);
  const ariaLabel = nombreEmpresa === NOMBRE_EMPRESA && IDENTIDAD_EMPRESA?.ariaLabel
    ? IDENTIDAD_EMPRESA.ariaLabel
    : `Logo de ${nombreEmpresa}`;
  container.innerHTML = `<svg viewBox="0 0 40 40" width="40" height="40" role="img" aria-label="${escapeHtml(ariaLabel)}" class="logo-mark-svg"><rect x="1" y="1" width="38" height="38" rx="10" fill="currentColor" opacity="0.14"></rect><text x="20" y="25" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">${escapeHtml(letras)}</text></svg>`;
}

export function applyShellLabels(){
  const identidad = obtenerIdentidadEmpresa();
  const brand = document.getElementById('brand-name');
  if(brand) brand.textContent = getConfig()?.moduleName || 'Contabilidad y Finanzas';
  const nombreEmpresa = document.getElementById('empresa-nombre');
  if(nombreEmpresa) nombreEmpresa.textContent = identidad.nombreEmpresa;
  const labels = {
    'nav-dashboard-label': 'Panel',
    'nav-entities-label': labelFor('entities'),
    'nav-documents-label': labelFor('documents'),
    'nav-search-label': 'Búsqueda',
    'nav-resumen-label': labelFor('resumen'),
    'nav-cuentas-label': labelFor('cuentas'),
    'nav-asientos-label': labelFor('asientos'),
    'nav-pagos-label': labelFor('pagos'),
    'nav-periodos-label': labelFor('periodos'),
    'nav-reportes-label': labelFor('reportes')
  };
  Object.entries(labels).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if(el) el.textContent = text;
  });
  renderLogo(document.getElementById('logo-mark'));
  renderizarIconosEncabezados();
}

export function setActiveModule(name){

  document.querySelectorAll('.nav-module').forEach(btn => {
    const active = btn.dataset.module === name;
    btn.classList.toggle('active', active);
    if(active) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
}

export function cerrarDrawerNavegacion(){
  if(typeof document === 'undefined') return;
  document.getElementById('sidebar-nav')?.classList.remove('sidebar-abierta');
  document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');
}

export function inicializarShellAccesible(){
  renderizarIconosEncabezados();
  if(typeof document === 'undefined') return;
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar-nav');
  if(!toggle || !sidebar) return;
  toggle.addEventListener('click', () => {
    const abierta = sidebar.classList.toggle('sidebar-abierta');
    toggle.setAttribute('aria-expanded', abierta ? 'true' : 'false');
  });
  document.addEventListener('click', (event) => {
    if(event.target?.closest?.('.nav-module')){
      cerrarDrawerNavegacion();
      return;
    }
    if(window.innerWidth > 900) return;
    if(sidebar.contains(event.target) || toggle.contains(event.target)) return;
    cerrarDrawerNavegacion();
  });
  window.addEventListener('resize', () => { if(window.innerWidth > 900) cerrarDrawerNavegacion(); });
}

