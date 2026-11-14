import { loadPeriodos, savePeriodos, loadAsientos } from './almacenamiento.js';
import { validarPeriodo } from './validaciones-periodos.js';
import { periodoContieneFecha } from './fechas.js';

function generarId() {
  return `per-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ahora() {
  return new Date().toISOString();
}

export function listarPeriodos() {
  return [...loadPeriodos()].sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
}

export function obtenerPeriodo(id) {
  return loadPeriodos().find((p) => p.id === id) || null;
}

export function crearPeriodo(payload = {}) {
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
  return periodo;
}

export function actualizarPeriodo(id, cambios = {}) {
  const periodos = loadPeriodos();
  const indice = periodos.findIndex((p) => p.id === id);
  if (indice === -1) throw new Error('Periodo contable no encontrado');
  const actual = periodos[indice];
  const fusionado = { ...actual, ...cambios };
  const revision = validarPeriodo(fusionado, { periodos, id });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
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
  return actualizado;
}

export function cambiarEstadoPeriodo(id, status) {
  return actualizarPeriodo(id, { status });
}

export function eliminarPeriodo(id) {
  const periodos = loadPeriodos();
  const periodo = periodos.find((p) => p.id === id);
  if (!periodo) throw new Error('Periodo contable no encontrado');
  if (loadAsientos().some((a) => a.period_id === id)) {
    const actualizado = actualizarPeriodo(id, { status: 'cerrado' });
    return { eliminado: false, cerrado: true, periodo: actualizado };
  }
  savePeriodos(periodos.filter((p) => p.id !== id));
  return { eliminado: true, cerrado: false };
}

export function periodoPorFecha(fecha) {
  return loadPeriodos().find((p) => periodoContieneFecha(p, fecha)) || null;
}

export function periodoAbiertoPorFecha(fecha) {
  const periodo = periodoPorFecha(fecha);
  return periodo && periodo.status === 'abierto' ? periodo : null;
}
