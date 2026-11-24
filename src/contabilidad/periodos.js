import { loadPeriodos, savePeriodos, loadAsientos, loadLineas, loadPagos, loadSesion } from './almacenamiento.js';
import { validarPeriodo, validarCierrePeriodo, validarEscrituraPeriodo, MENSAJE_PERIODO_CERRADO } from './validaciones-periodos.js';
import { periodoContieneFecha } from './fechas.js';
import { registrarEvento, calcularCambios } from './auditoria.js';

function generarId() {
  return `per-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ahora() {
  return new Date().toISOString();
}

function sesionDe(sesion) {
  if (sesion !== undefined) return sesion;
  const actual = loadSesion();
  return actual && (!actual.estado || actual.estado === 'autenticada') ? actual : null;
}

function asegurarAdministrador(sesion) {
  if (sesion && sesion.rolId !== 'administrador') throw new Error('Acceso no disponible');
}

function datosCierre() {
  return {
    periodos: loadPeriodos(),
    asientos: loadAsientos(),
    lineas: loadLineas(),
    pagos: loadPagos()
  };
}

export function listarPeriodos() {
  return [...loadPeriodos()].sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
}

export function obtenerPeriodo(id) {
  return loadPeriodos().find((p) => p.id === id) || null;
}

function auditarPeriodo(antes, despues, sesion, accionForzada) {
  const cambios = calcularCambios(antes, despues, ['name', 'startDate', 'endDate', 'status']);
  const accion = accionForzada || (despues.status === 'cerrado' ? 'cerrar' : despues.status === 'abierto' ? 'abrir' : 'editar');
  registrarEvento({
    accion,
    tipoMovimiento: 'periodo',
    modulo: 'periodos',
    entidad: 'periodo',
    entidadId: despues.id,
    numero: despues.name,
    sesion,
    cambios: accion === 'editar' ? cambios : [],
    descripcion: accion === 'cerrar'
      ? `Cerró el periodo contable ${despues.name}`
      : accion === 'abrir'
        ? `Reabrió el periodo contable ${despues.name}`
        : `Actualizó el periodo contable ${despues.name}`,
    periodo: despues.id
  });
}

export function crearPeriodo(payload = {}, opciones = {}) {
  const periodos = loadPeriodos();
  const revision = validarPeriodo(payload, { periodos });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const marca = ahora();
  const periodo = {
    id: generarId(),
    name: String(payload.name).trim(),
    startDate: payload.startDate,
    endDate: payload.endDate,
    status: payload.status || 'abierto',
    createdAt: marca,
    updatedAt: marca
  };
  savePeriodos([...periodos, periodo]);
  const sesion = sesionDe(opciones.sesion);
  registrarEvento({
    accion: 'crear',
    tipoMovimiento: 'periodo',
    modulo: 'periodos',
    entidad: 'periodo',
    entidadId: periodo.id,
    numero: periodo.name,
    sesion,
    descripcion: `Creó el periodo contable ${periodo.name}`,
    periodo: periodo.id
  });
  return periodo;
}

export function actualizarPeriodo(id, cambios = {}, opciones = {}) {
  const periodos = loadPeriodos();
  const indice = periodos.findIndex((p) => p.id === id);
  if (indice === -1) throw new Error('Periodo contable no encontrado');
  const actual = periodos[indice];
  const fusionado = { ...actual, ...cambios };
  const revision = validarPeriodo(fusionado, { periodos, id });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const sesion = sesionDe(opciones.sesion);
  if (fusionado.status === 'cerrado' && actual.status === 'abierto') {
    asegurarAdministrador(sesion);
    if (opciones.integral !== false) {
      const cierre = validarCierrePeriodo(id, datosCierre());
      if (!cierre.valido) throw new Error(Object.values(cierre.errores)[0]);
    }
  }
  if (fusionado.status === 'abierto' && actual.status === 'cerrado') {
    asegurarAdministrador(sesion);
  }
  const actualizado = {
    ...actual,
    name: String(fusionado.name).trim(),
    startDate: fusionado.startDate,
    endDate: fusionado.endDate,
    status: fusionado.status || 'abierto',
    updatedAt: ahora()
  };
  const lista = [...periodos];
  lista[indice] = actualizado;
  savePeriodos(lista);
  auditarPeriodo(actual, actualizado, sesion, opciones.accionAuditoria);
  return actualizado;
}

export function cerrarPeriodo(id, sesion, opciones = {}) {
  if (!id) throw new Error('Selecciona un periodo contable para cerrar');
  const sesionEfectiva = sesionDe(sesion);
  asegurarAdministrador(sesionEfectiva);
  const periodos = loadPeriodos();
  const periodo = periodos.find((p) => p.id === id);
  if (!periodo) throw new Error('Periodo contable no encontrado');
  if (periodo.status === 'cerrado') throw new Error('El periodo ya está cerrado');
  const cierre = validarCierrePeriodo(id, {
    periodos,
    asientos: loadAsientos(),
    lineas: loadLineas(),
    pagos: loadPagos()
  });
  if (!cierre.valido) throw new Error(Object.values(cierre.errores)[0]);
  return actualizarPeriodo(id, { status: 'cerrado' }, {
    sesion: sesionEfectiva,
    integral: false
  });
}

export function cambiarEstadoPeriodo(id, status, opciones = {}) {
  if (status === 'cerrado') {
    return cerrarPeriodo(id, sesionDe(opciones.sesion), opciones);
  }
  throw new Error('Los periodos cerrados no pueden reabrirse.');
}

export function eliminarPeriodo(id, opciones = {}) {
  const periodos = loadPeriodos();
  const periodo = periodos.find((p) => p.id === id);
  if (!periodo) throw new Error('Periodo contable no encontrado');
  const sesion = sesionDe(opciones.sesion);
  if (loadAsientos().some((a) => a.period_id === id)) {
    const actualizado = actualizarPeriodo(id, { status: 'cerrado' }, { sesion });
    return { eliminado: false, cerrado: true, periodo: actualizado };
  }
  savePeriodos(periodos.filter((p) => p.id !== id));
  registrarEvento({
    accion: 'anular',
    modulo: 'periodos',
    entidad: 'periodo',
    entidadId: id,
    numero: periodo.name,
    sesion,
    descripcion: `Eliminó el periodo contable ${periodo.name}`,
    periodo: id
  });
  return { eliminado: true, cerrado: false };
}

export function periodoPorFecha(fecha, periodos = loadPeriodos()) {
  return periodos.find((p) => periodoContieneFecha(p, fecha)) || null;
}

export function periodoAbiertoPorFecha(fecha, periodos = loadPeriodos()) {
  const periodo = periodoPorFecha(fecha, periodos);
  return periodo && periodo.status === 'abierto' ? periodo : null;
}

export function validarFechasDeEscritura(fechaOriginal, fechaNueva, periodos = loadPeriodos()) {
  return validarEscrituraPeriodo(fechaOriginal, fechaNueva, periodos);
}

export { MENSAJE_PERIODO_CERRADO, validarEscrituraPeriodo };
