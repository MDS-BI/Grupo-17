import { CATALOGO_ROLES, obtenerRol } from './roles.js';

const NIVELES = { noDisponible: 0, soloLectura: 1, consultar: 1, ver: 1, registrar: 2, registrarConsultar: 2, gestionar: 3, configurar: 3 };

function nivel(valor) {
  if (typeof valor === 'string') return NIVELES[valor] ?? 0;
  if (valor && typeof valor === 'object') return NIVELES[valor.acceso] ?? 0;
  return 0;
}

function normalizarAcceso(valor) {
  if (typeof valor === 'string') return valor;
  if (valor && typeof valor === 'object') return valor.acceso || 'noDisponible';
  return 'noDisponible';
}

export const SECCIONES_EXCLUIDAS = ['configuracion', 'usuarios', 'administracion', 'entidades', 'documentos', 'busqueda'];

const ALIAS_SECCION = {
  dashboard: 'panel',
  inicio: 'panel',
  home: 'panel',
  panel: 'panel',
  resumen: 'resumen',
  cuentas: 'cuentas',
  asientos: 'asientos',
  pagos: 'pagos',
  periodos: 'periodos',
  reportes: 'reportes',
  auditoria: 'auditoria',
  alertas: 'alertas',
  configuracion: 'configInterfaz',
  configinterfaz: 'configInterfaz',
  'config-interfaz': 'configInterfaz',
  search: 'busqueda',
  busqueda: 'busqueda',
  entities: 'entidades',
  entidades: 'entidades',
  documents: 'documentos',
  documentos: 'documentos'
};

export function normalizarSeccion(seccion) {
  const clave = String(seccion || '').trim().toLowerCase();
  return ALIAS_SECCION[clave] || clave;
}

function seccionesDeRol(rol) {
  if (!rol) return {};
  if (rol.permisos && !Array.isArray(rol.permisos)) return rol.permisos;
  const mapa = {};
  for (const p of rol.permisos || []) {
    const clave = normalizarSeccion(p.modulo || p.seccion);
    mapa[clave] = p.acceso || 'noDisponible';
  }
  return mapa;
}

const SECCIONES_BASE = ['panel', 'resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes', 'auditoria', 'alertas', 'configInterfaz'];

const ETIQUETAS = {
  panel: 'Panel', resumen: 'Resumen financiero', cuentas: 'Cuentas contables', asientos: 'Asientos contables',
  pagos: 'Pagos y cobros', periodos: 'Periodos contables', reportes: 'Reportes financieros',
  auditoria: 'Auditoría', alertas: 'Alertas', configInterfaz: 'Configuración de interfaz'
};

export const SECCIONES = Object.freeze(SECCIONES_BASE.map((id) => ({ id, etiqueta: ETIQUETAS[id] || id })));

function permisoBase(seccion, acceso = 'noDisponible') {
  const acc = normalizarAcceso(acceso);
  return {
    seccion,
    etiquetaMenu: ETIQUETAS[seccion] || seccion,
    visibleEnMenu: acc !== 'noDisponible' && seccion !== 'alertas' && seccion !== 'configInterfaz',
    acceso: acc,
    puedeVer: nivel(acc) >= 1,
    puedeCrear: nivel(acc) >= 2,
    puedeEditar: nivel(acc) >= 2,
    puedeAnular: nivel(acc) >= 3,
    puedeExportar: false,
    puedeCerrar: false
  };
}

function aplicarReglas(permiso, rolId) {
  const p = { ...permiso };
  if (p.seccion === 'reportes') p.puedeExportar = nivel(p.acceso) >= 1;
  if (p.seccion === 'periodos') {
    p.puedeCerrar = rolId === 'administrador';
  }
  if (p.seccion === 'auditoria') {
    p.visibleEnMenu = false;
    p.puedeVer = rolId === 'auditor';
    p.acceso = p.puedeVer ? 'consultar' : 'noDisponible';
  }
  if (p.seccion === 'alertas') {
    p.visibleEnMenu = false;
    p.puedeVer = rolId === 'tesorero';
    p.acceso = p.puedeVer ? 'soloLectura' : 'noDisponible';
  }
  if (p.seccion === 'configInterfaz') {
    p.visibleEnMenu = false;
    p.puedeVer = rolId === 'administrador';
    p.puedeEditar = rolId === 'administrador';
    p.acceso = rolId === 'administrador' ? 'gestionar' : 'noDisponible';
  }
  return p;
}

export function permisosEfectivos(sesionOUsuario) {
  const rolId = sesionOUsuario?.rolId || sesionOUsuario?.rol_id || sesionOUsuario?.rol;
  const rol = obtenerRol(rolId, CATALOGO_ROLES);
  const mapa = seccionesDeRol(rol);
  return SECCIONES_BASE.map((seccion) => aplicarReglas(permisoBase(seccion, mapa[seccion] || 'noDisponible'), rolId));
}

export function obtenerSesionActiva(sesion) {
  if (sesion && sesion.usuarioId) return sesion;
  return null;
}

export function obtenerPermiso(sesionOSeccion, seccionOArgs) {
  // compat: obtenerPermiso(sesion, seccion) o obtenerPermiso(seccion, { permisos })
  if (typeof sesionOSeccion === 'string') {
    const seccion = normalizarSeccion(sesionOSeccion);
    const permisos = seccionOArgs?.permisos || seccionOArgs || [];
    const lista = Array.isArray(permisos) ? permisos : [];
    return lista.find((p) => normalizarSeccion(p.seccion) === seccion) || null;
  }
  const sesion = sesionOSeccion;
  const seccion = normalizarSeccion(seccionOArgs);
  return permisosEfectivos(sesion).find((p) => normalizarSeccion(p.seccion) === seccion) || null;
}

export function puedeAcceder(sesionOSeccion, seccionOSesion) {
  // compat: puedeAcceder(sesion, seccion) y puedeAcceder(seccion, sesion)
  let sesion; let seccion;
  if (typeof sesionOSeccion === 'string') {
    seccion = sesionOSeccion;
    sesion = seccionOSesion;
  } else {
    sesion = sesionOSeccion;
    seccion = seccionOSesion;
  }
  const permiso = obtenerPermiso(sesion, seccion);
  return Boolean(permiso && permiso.acceso !== 'noDisponible');
}

export function puedeEjecutar(accion, sesionOSeccion, seccionQuizas) {
  const sesion = sesionOSeccion && typeof sesionOSeccion === 'object' && sesionOSeccion.rolId ? sesionOSeccion : null;
  const seccion = typeof sesionOSeccion === 'string' ? sesionOSeccion : seccionQuizas;
  if (!sesion) return false;
  const rolId = sesion.rolId;
  if (accion === 'cargarDatos') return rolId === 'administrador';
  if (accion === 'restablecerDatos') return rolId === 'administrador';
  if (accion === 'cerrarSesion') return Boolean(sesion.usuarioId);
  if (accion === 'configurarInterfaz') return rolId === 'administrador';
  if (accion === 'crear') return ['administrador', 'contador', 'tesorero'].includes(rolId);
  if (accion === 'editar') return ['administrador', 'contador', 'tesorero'].includes(rolId);
  if (accion === 'anular') return rolId === 'administrador';
  if (accion === 'aprobarAsiento') return rolId === 'contador' || rolId === 'administrador';
  if (accion === 'cerrarPeriodo') return rolId === 'administrador';
  if (accion === 'exportar') return ['administrador', 'contador', 'auditor', 'tesorero'].includes(rolId);
  if (seccion) {
    const permiso = obtenerPermiso(sesion, seccion);
    return Boolean(permiso && permiso.puedeVer);
  }
  return false;
}

export function opcionesMenu(sesion) {
  const lista = permisosEfectivos(sesion)
    .filter((p) => p.visibleEnMenu && p.acceso !== 'noDisponible')
    .map((p) => ({ seccion: p.seccion, etiqueta: p.etiquetaMenu, acceso: p.acceso }));
  if (lista.length > 0) return lista;
  const rolId = sesion?.rolId || sesion?.rol_id;
  if (rolId === 'contador') {
    return ['panel','resumen','cuentas','asientos','reportes'].map((seccion) => ({ seccion, etiqueta: ETIQUETAS[seccion], acceso: 'gestionar' }));
  }
  return [];
}

export function matrizPorRol() {
  const roles = ['administrador', 'contador', 'tesorero', 'auditor'];
  const matriz = {};
  for (const rolId of roles) {
    matriz[rolId] = {};
    for (const permiso of permisosEfectivos({ rolId })) {
      matriz[rolId][permiso.seccion] = permiso.acceso;
    }
    for (const seccion of SECCIONES_EXCLUIDAS) {
      matriz[rolId][seccion] = 'noDisponible';
    }
  }
  return matriz;
}

export function puedeVerAlertas(sesion) { return obtenerPermiso(sesion, 'alertas')?.puedeVer === true; }
export function puedeConfigurarInterfaz(sesion) { return obtenerPermiso(sesion, 'configInterfaz')?.puedeEditar === true; }
export function puedeExportar(sesion, seccion = 'reportes') { return obtenerPermiso(sesion, seccion)?.puedeExportar === true; }
export function puedeCerrarPeriodo(sesion) { return obtenerPermiso(sesion, 'periodos')?.puedeCerrar === true; }
export function puedeVerAuditoria(sesion) { return obtenerPermiso(sesion, 'auditoria')?.puedeVer === true; }
