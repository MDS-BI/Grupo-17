import { loadRegistrosActividad, saveRegistrosActividad, loadUsuarios, loadRoles, loadPeriodos, loadSesion } from './almacenamiento.js';
import { periodoContieneFecha } from './fechas.js';

export const MENSAJE_ACCESO_AUDITORIA = 'Acceso no disponible';

const ACCIONES_VALIDAS = Object.freeze(['crear', 'editar', 'anular']);

const TIPOS_VALIDOS = Object.freeze(['asiento', 'pago']);

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function copiar(valor) {
  return valor === undefined ? undefined : JSON.parse(JSON.stringify(valor));
}

function normalizarRUT(valor) {
  return texto(valor).replace(/[.\-]/g, '');
}

function valorTextual(valor) {
  if (valor === undefined || valor === null || valor === '') return '';
  if (typeof valor === 'string') return valor;
  try {
    return JSON.stringify(valor);
  } catch (error) {
    return String(valor);
  }
}

function bytesDiferentes(anterior, nuevo) {
  return valorTextual(anterior) !== valorTextual(nuevo);
}

export function calcularCambios(antes = {}, despues = {}, campos = []) {
  const nombres = campos.length > 0
    ? campos
    : [...new Set([...Object.keys(antes || {}), ...Object.keys(despues || {})])];
  const cambios = [];
  for (const campo of nombres) {
    const valorAnterior = antes ? antes[campo] : undefined;
    const valorNuevo = despues ? despues[campo] : undefined;
    if (!bytesDiferentes(valorAnterior, valorNuevo)) continue;
    cambios.push({ campo, valorAnterior: copiar(valorAnterior), valorNuevo: copiar(valorNuevo) });
  }
  return cambios;
}

export function normalizarCambios(cambios = []) {
  const lista = Array.isArray(cambios)
    ? cambios
    : Object.entries(cambios || {}).map(([campo, valores]) => ({
      campo,
      valorAnterior: valores && typeof valores === 'object' ? valores.valorAnterior : undefined,
      valorNuevo: valores && typeof valores === 'object' ? valores.valorNuevo : valores
    }));
  const normalizados = [];
  for (const cambio of lista) {
    const campo = texto(cambio && cambio.campo);
    if (!campo) continue;
    const valorAnterior = cambio.valorAnterior;
    const valorNuevo = cambio.valorNuevo;
    if (!bytesDiferentes(valorAnterior, valorNuevo)) continue;
    normalizados.push({ campo, valorAnterior: copiar(valorAnterior), valorNuevo: copiar(valorNuevo) });
  }
  return normalizados;
}

function actorDe(sesion = {}) {
  const rut = texto(sesion && sesion.usuarioRut);
  const normalizado = normalizarRUT(rut);
  const usuario = loadUsuarios().find((item) => (
    normalizarRUT(item.rut) === normalizado
    || normalizarRUT(item.rutNormalizado) === normalizado
  ));
  const rolId = texto(sesion && sesion.rolId) || texto(usuario && usuario.rol_id);
  const rol = loadRoles().find((item) => item.id === rolId);
  const usuarioNombre = texto(sesion && sesion.usuarioNombre)
    || texto(usuario && usuario.nombre)
    || rut
    || 'sistema';
  const rolNombre = texto(sesion && sesion.rolNombre) || texto(rol && rol.nombre) || 'sistema';
  return {
    usuario: texto(sesion && sesion.usuario) || usuarioNombre,
    usuarioRut: rut || 'sistema',
    usuarioNombre,
    rol: texto(sesion && sesion.rol) || rolNombre,
    rolId: rolId || 'sistema',
    rolNombre
  };
}

function generarId() {
  return `aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function obtenerSesion(sesion) {
  if (sesion) return sesion;
  const actual = loadSesion();
  return actual && (!actual.estado || actual.estado === 'autenticada') ? actual : null;
}

export function registrarEvento({
  id,
  fechaHora,
  timestamp,
  accion,
  tipoMovimiento,
  movimiento = {},
  entidad,
  entidadId,
  numero,
  usuario,
  rol,
  sesion,
  modulo = 'contabilidad',
  descripcion,
  cambios = [],
  camposModificados,
  periodo
} = {}) {
  const accionNormalizada = texto(accion).toLowerCase();
  if (!ACCIONES_VALIDAS.includes(accionNormalizada)) return null;
  const tipo = (texto(tipoMovimiento) || texto(entidad)).toLowerCase();
  if (!TIPOS_VALIDOS.includes(tipo)) return null;
  const entidadNormalizada = tipo;
  const idEntidad = texto(entidadId) || texto(movimiento && movimiento.id) || null;
  const cambiosNormalizados = normalizarCambios(
    camposModificados === undefined ? cambios : camposModificados
  );
  if (accionNormalizada === 'editar' && cambiosNormalizados.length === 0) return null;
  const eventos = loadRegistrosActividad();
  if (accionNormalizada === 'anular' && eventos.some((evento) => (
    evento.accion === 'anular'
    && evento.entidadId === idEntidad
    && evento.tipoMovimiento === tipo
  ))) {
    return null;
  }
  const actor = actorDe(obtenerSesion(sesion));
  const marca = texto(timestamp) || texto(fechaHora) || new Date().toISOString();
  const evento = {
    id: texto(id) || generarId(),
    timestamp: marca,
    fechaHora: marca,
    ...actor,
    usuario: texto(usuario) || actor.usuario,
    rol: texto(rol) || actor.rol,
    accion: accionNormalizada,
    modulo: texto(modulo) || 'contabilidad',
    entidad: entidadNormalizada,
    tipoMovimiento: tipo,
    entidadId: idEntidad,
    movimientoId: idEntidad,
    numero: texto(numero) || texto(movimiento && movimiento.numero) || texto(movimiento && movimiento.folio),
    descripcion: texto(descripcion) || `${accionNormalizada} ${entidadNormalizada}${idEntidad ? ` ${idEntidad}` : ''}`,
    cambios: cambiosNormalizados,
    camposModificados: cambiosNormalizados
  };
  if (texto(periodo)) evento.periodo = texto(periodo);
  saveRegistrosActividad([...eventos, evento]);
  return copiar(evento);
}

function textoFiltro(valor) {
  return texto(valor).toLowerCase();
}

export function listarEventos(filtros = {}) {
  const eventos = loadRegistrosActividad();
  const periodoFiltro = filtros.periodo;
  const periodos = loadPeriodos();
  const periodo = periodoFiltro
    ? periodos.find((item) => item.id === periodoFiltro || item.name === periodoFiltro)
    : null;
  const filtrados = eventos.filter((evento) => {
    const tipo = textoFiltro(filtros.tipoMovimiento || filtros.entidad);
    if (tipo && textoFiltro(evento.tipoMovimiento) !== tipo && textoFiltro(evento.entidad) !== tipo) return false;
    if (filtros.accion && textoFiltro(evento.accion) !== textoFiltro(filtros.accion)) return false;
    const usuarioFiltro = textoFiltro(filtros.usuario || filtros.usuarioRut);
    if (usuarioFiltro && (
      textoFiltro(evento.usuario) !== usuarioFiltro
      && textoFiltro(evento.usuarioRut) !== usuarioFiltro
      && textoFiltro(evento.usuarioNombre) !== usuarioFiltro
    )) return false;
    const idFiltro = texto(filtros.entidadId || filtros.movimientoId);
    if (idFiltro && texto(evento.entidadId) !== idFiltro) return false;
    if (filtros.modulo && textoFiltro(evento.modulo) !== textoFiltro(filtros.modulo)) return false;
    if (textoFiltro(filtros.rol || filtros.rolId)
      && textoFiltro(evento.rol) !== textoFiltro(filtros.rol || filtros.rolId)
      && textoFiltro(evento.rolId) !== textoFiltro(filtros.rol || filtros.rolId)) return false;
    if (filtros.fechaDesde && texto(evento.timestamp).slice(0, 10) < texto(filtros.fechaDesde)) return false;
    if (filtros.fechaHasta && texto(evento.timestamp).slice(0, 10) > texto(filtros.fechaHasta)) return false;
    if (periodo) {
      if (!periodoContieneFecha(periodo, texto(evento.timestamp).slice(0, 10))) return false;
    } else if (periodoFiltro && texto(evento.periodo) !== texto(periodoFiltro)) {
      return false;
    }
    return true;
  });
  return filtrados
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)) || String(b.id).localeCompare(String(a.id)))
    .map((evento) => copiar(evento));
}

export const consultarEventos = listarEventos;

export function historialPorMovimiento(tipoMovimiento, movimientoId) {
  return listarEventos({ tipoMovimiento, entidadId: movimientoId });
}

export function puedeConsultarAuditoria(sesion = {}) {
  return Boolean(sesion && (sesion.rolId === 'auditor' || sesion.rol?.id === 'auditor'));
}
