import { loadCuentas, saveCuentas, loadLineas } from './almacenamiento.js';
import { validarCuenta, saldoNormalPara, normalizarDescripcionCuenta } from './validaciones-cuentas.js';

function generarId() {
  return `cta-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ahora() {
  return new Date().toISOString();
}

function recalcularHojas(cuentas) {
  const padres = new Set(cuentas.map((c) => c.parent_id).filter(Boolean));
  return cuentas.map((c) => ({ ...c, isLeaf: !padres.has(c.id) }));
}

export function listarCuentas() {
  return [...loadCuentas()].sort((a, b) => String(a.code).localeCompare(String(b.code), 'es', { numeric: true }));
}

export function obtenerCuenta(id) {
  return loadCuentas().find((c) => c.id === id) || null;
}

export function obtenerDetalleCuenta(id) {
  const cuenta = obtenerCuenta(id);
  if (!cuenta) return null;
  const cuentas = loadCuentas();
  const padre = cuentas.find((c) => c.id === cuenta.parent_id) || null;
  return {
    ...cuenta,
    parentCode: padre ? padre.code : null,
    parentName: padre ? padre.name : null
  };
}

export function crearCuenta(payload = {}) {
  const cuentas = loadCuentas();
  const revision = validarCuenta(payload, { cuentas });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const marca = ahora();
  const cuenta = {
    id: generarId(),
    code: String(payload.code).trim(),
    name: String(payload.name).trim(),
    type: payload.type,
    description: normalizarDescripcionCuenta(payload.description),
    parent_id: payload.parent_id || null,
    isLeaf: true,
    entity_id: payload.entity_id || null,
    normalBalance: saldoNormalPara(payload.type),
    status: payload.status || 'activa',
    createdAt: marca,
    updatedAt: marca
  };
  saveCuentas(recalcularHojas([...cuentas, cuenta]));
  return cuenta;
}

export function actualizarCuenta(id, cambios = {}) {
  const cuentas = loadCuentas();
  const indice = cuentas.findIndex((c) => c.id === id);
  if (indice === -1) throw new Error('Cuenta contable no encontrada');
  const actual = cuentas[indice];
  const fusionada = { ...actual, ...cambios };
  const revision = validarCuenta(fusionada, { cuentas, id });
  if (!revision.valido) throw new Error(Object.values(revision.errores)[0]);
  const actualizada = {
    ...actual,
    code: String(fusionada.code).trim(),
    name: String(fusionada.name).trim(),
    type: fusionada.type,
    description: normalizarDescripcionCuenta(fusionada.description),
    parent_id: fusionada.parent_id || null,
    entity_id: fusionada.entity_id || null,
    normalBalance: saldoNormalPara(fusionada.type),
    status: fusionada.status || 'activa',
    updatedAt: ahora()
  };
  const lista = [...cuentas];
  lista[indice] = actualizada;
  saveCuentas(recalcularHojas(lista));
  return actualizada;
}

export function eliminarCuenta(id) {
  const cuentas = loadCuentas();
  const cuenta = cuentas.find((c) => c.id === id);
  if (!cuenta) throw new Error('Cuenta contable no encontrada');
  const tieneHijas = cuentas.some((c) => c.parent_id === id);
  const tieneMovimientos = loadLineas().some((l) => l.cuenta_id === id);
  if (tieneHijas || tieneMovimientos) {
    const actualizada = actualizarCuenta(id, { status: 'inactiva' });
    return { eliminada: false, inactivada: true, cuenta: actualizada };
  }
  saveCuentas(recalcularHojas(cuentas.filter((c) => c.id !== id)));
  return { eliminada: true, inactivada: false };
}

export function construirArbol(cuentas = listarCuentas()) {
  const porId = new Map(cuentas.map((c) => [c.id, { ...c, children: [] }]));
  const raices = [];
  for (const cuenta of porId.values()) {
    if (cuenta.parent_id && porId.has(cuenta.parent_id)) {
      porId.get(cuenta.parent_id).children.push(cuenta);
    } else {
      raices.push(cuenta);
    }
  }
  const ordenar = (lista) => {
    lista.sort((a, b) => String(a.code).localeCompare(String(b.code), 'es', { numeric: true }));
    lista.forEach((c) => ordenar(c.children));
  };
  ordenar(raices);
  return raices;
}
