const ICONOS = Object.freeze({
  dashboard: Object.freeze({
    nombre: 'layout-dashboard',
    trazo: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>'
  }),
  entities: Object.freeze({
    nombre: 'building-2',
    trazo: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path>'
  }),
  documents: Object.freeze({
    nombre: 'file-text',
    trazo: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v5h5"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path>'
  }),
  search: Object.freeze({
    nombre: 'search',
    trazo: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>'
  }),
  resumen: Object.freeze({
    nombre: 'chart-column',
    trazo: '<path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>'
  }),
  cuentas: Object.freeze({
    nombre: 'list-tree',
    trazo: '<path d="M21 12h-8"></path><path d="M21 6H8"></path><path d="M21 18h-8"></path><path d="M3 4v16"></path><path d="M6 8h.01"></path><path d="M6 12h.01"></path><path d="M6 16h.01"></path>'
  }),
  asientos: Object.freeze({
    nombre: 'receipt-text',
    trazo: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6"></path><path d="M16 12h-6"></path><path d="M16 16h-6"></path>'
  }),
  pagos: Object.freeze({
    nombre: 'credit-card',
    trazo: '<rect width="20" height="14" x="2" y="5" rx="2"></rect><path d="M2 10h20"></path><path d="M6 15h4"></path>'
  }),
  periodos: Object.freeze({
    nombre: 'calendar-days',
    trazo: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>'
  }),
  reportes: Object.freeze({
    nombre: 'chart-no-axes-column-increasing',
    trazo: '<path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>'
  }),
  auditoria: Object.freeze({
    nombre: 'scan-eye',
    trazo: '<path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><circle cx="12" cy="12" r="3"></circle><path d="M3 12h2"></path><path d="M19 12h2"></path><path d="M12 3v2"></path><path d="M12 19v2"></path>'
  }),
  alertas: Object.freeze({
    nombre: 'bell-ring',
    trazo: '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path><path d="M19 13a2 2 0 0 1-2-2V8a5 5 0 0 0-10 0v3a2 2 0 0 1-2 2"></path><path d="M5 13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"></path><path d="M2 2 4 4"></path><path d="m20 2-2 2"></path>'
  }),
  configInterfaz: Object.freeze({
    nombre: 'settings-2',
    trazo: '<path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle>'
  }),
  menu: Object.freeze({
    nombre: 'menu',
    trazo: '<path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>'
  })
});

function escapeHtml(valor) {
  return String(valor ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function iconoSvgLucide(seccion, { clase = 'nav-icono-svg', tamano = 18 } = {}) {
  const clave = String(seccion === 'panel' || seccion === 'dashboard' ? 'dashboard' : seccion || '');
  const icono = ICONOS[clave] || ICONOS.documents;
  return `<svg class="${escapeHtml(clase)}" viewBox="0 0 24 24" width="${Number(tamano) || 18}" height="${Number(tamano) || 18}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-lucide="${escapeHtml(icono.nombre)}" aria-hidden="true" focusable="false">${icono.trazo}</svg>`;
}

export function nombreIconoLucide(seccion) {
  const clave = String(seccion === 'panel' || seccion === 'dashboard' ? 'dashboard' : seccion || '');
  return (ICONOS[clave] || ICONOS.documents).nombre;
}
