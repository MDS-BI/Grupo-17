import { loadEntities, saveEntities, loadDocuments, saveDocuments, leerValor, escribirValor, eliminarValor } from '../storage.js';
import { FECHA_REFERENCIA_SEMILLA, generarSemilla, generarSemillaBase, generarRoles, generarUsuarios } from './semilla.js';

const PREFIJO = 'erp_contabilidad:';

export const CLAVES = Object.freeze({
  cuentas: `${PREFIJO}cuentas`,
  asientos: `${PREFIJO}asientos`,
  lineas: `${PREFIJO}lineas`,
  pagos: `${PREFIJO}pagos`,
  periodos: `${PREFIJO}periodos`,
  usuarios: `${PREFIJO}usuarios`,
  roles: `${PREFIJO}roles`,
  sesion: `${PREFIJO}sesion`,
  auditoria: `${PREFIJO}auditoria`
});

function leerLista(clave) {
  try {
    const crudo = leerValor(clave);
    if (!crudo) return [];
    const valor = JSON.parse(crudo);
    return Array.isArray(valor) ? valor : [];
  } catch (error) {
    console.error(`No se pudo leer ${clave} del almacenamiento`, error);
    return [];
  }
}

function escribirLista(clave, lista) {
  escribirValor(clave, JSON.stringify(Array.isArray(lista) ? lista : []));
}

export function loadCuentas() { return leerLista(CLAVES.cuentas); }
export function saveCuentas(lista) { escribirLista(CLAVES.cuentas, lista); }
export function loadAsientos() { return leerLista(CLAVES.asientos); }
export function saveAsientos(lista) { escribirLista(CLAVES.asientos, lista); }
export function loadLineas() { return leerLista(CLAVES.lineas); }
export function saveLineas(lista) { escribirLista(CLAVES.lineas, lista); }
export function loadPagos() { return leerLista(CLAVES.pagos); }
export function savePagos(lista) { escribirLista(CLAVES.pagos, lista); }
export function loadPeriodos() { return leerLista(CLAVES.periodos); }
export function savePeriodos(lista) { escribirLista(CLAVES.periodos, lista); }
export function loadUsuarios() { return leerLista(CLAVES.usuarios); }
export function saveUsuarios(lista) { escribirLista(CLAVES.usuarios, lista); }
export function loadRoles() { return leerLista(CLAVES.roles); }
export function saveRoles(lista) { escribirLista(CLAVES.roles, lista); }
export function loadRegistrosActividad() { return leerLista(CLAVES.auditoria); }
export function saveRegistrosActividad(lista) { escribirLista(CLAVES.auditoria, lista); }
export const loadAuditoria = loadRegistrosActividad;
export const saveAuditoria = saveRegistrosActividad;

export function loadSesion() {
  try {
    const crudo = leerValor(CLAVES.sesion);
    return crudo ? JSON.parse(crudo) : null;
  } catch (error) {
    console.error('No se pudo leer la sesión del almacenamiento', error);
    return null;
  }
}

export function saveSesion(sesion) {
  if (!sesion) {
    eliminarValor(CLAVES.sesion);
    return;
  }
  escribirValor(CLAVES.sesion, JSON.stringify(sesion));
}

export function limpiarContabilidad() {
  Object.values(CLAVES).filter((clave) => clave !== CLAVES.usuarios && clave !== CLAVES.roles).forEach((clave) => eliminarValor(clave));
}

export function inicializarAcceso() {
  asegurarAcceso();
}

export function hayDatosContables() {
  return loadCuentas().length > 0
    || loadAsientos().length > 0
    || loadPagos().length > 0
    || loadPeriodos().length > 0;
}

function asegurarAcceso() {
  if (loadRoles().length === 0) saveRoles(generarRoles());
  if (loadUsuarios().length === 0) saveUsuarios(generarUsuarios());
}

function asegurarDatosBase() {
  let entidades = loadEntities();
  let documentos = loadDocuments();
  if (entidades.length === 0) {
    const base = generarSemillaBase();
    entidades = base.entidades;
    documentos = base.documentos;
    saveEntities(entidades);
    saveDocuments(documentos);
  }
  return { entidades, documentos };
}

function construirSemillaFinanciera(entidades, documentos) {
  return generarSemilla({ entidades, documentos, fechaReferencia: FECHA_REFERENCIA_SEMILLA });
}

function persistirSemilla(datos) {
  saveCuentas(datos.cuentas);
  savePeriodos(datos.periodos);
  saveAsientos(datos.asientos);
  saveLineas(datos.lineas);
  savePagos(datos.pagos);
  saveRegistrosActividad(datos.auditoria || []);
}

export function inicializarContabilidad({ forzar = false } = {}) {
  asegurarAcceso();
  if (!forzar && hayDatosContables()) return false;
  const { entidades, documentos } = asegurarDatosBase();
  persistirSemilla(construirSemillaFinanciera(entidades, documentos));
  return true;
}

export function cargarDatosEjemplo() {
  asegurarAcceso();
  const { entidades, documentos } = asegurarDatosBase();
  persistirSemilla(construirSemillaFinanciera(entidades, documentos));
  return true;
}

export function restablecerEstadoInicial() {
  limpiarContabilidad();
  saveEntities([]);
  saveDocuments([]);
  return true;
}

export function reiniciarDatosEjemplo() {
  limpiarContabilidad();
  const { entidades, documentos } = asegurarDatosBase();
  persistirSemilla(construirSemillaFinanciera(entidades, documentos));
  return true;
}
