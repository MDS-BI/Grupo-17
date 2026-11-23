export const TIPOS_CUENTA = Object.freeze(['activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto']);
export const ESTADOS_CUENTA = Object.freeze(['activa', 'inactiva']);

export function saldoNormalPara(tipo) {
  return tipo === 'activo' || tipo === 'gasto' ? 'debit' : 'credit';
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

export function normalizarDescripcionCuenta(valor) {
  return texto(valor);
}

export function validarCuenta(payload = {}, { cuentas = [], id = null } = {}) {
  const errores = {};
  const code = texto(payload.code);
  const name = texto(payload.name);
  const type = texto(payload.type);
  const parentId = texto(payload.parent_id) || null;
  const status = texto(payload.status) || 'activa';

  if (!code) errores.code = 'El código es obligatorio';
  else if (cuentas.some((c) => c.id !== id && texto(c.code) === code)) {
    errores.code = 'Ya existe una cuenta con ese código';
  }

  if (!name) errores.name = 'El nombre es obligatorio';

  if (!TIPOS_CUENTA.includes(type)) {
    errores.type = `El tipo debe ser uno de: ${TIPOS_CUENTA.join(', ')}`;
  }

  if (!ESTADOS_CUENTA.includes(status)) {
    errores.status = `El estado debe ser uno de: ${ESTADOS_CUENTA.join(', ')}`;
  }

  if (normalizarDescripcionCuenta(payload.description).length > 500) {
    errores.description = 'La descripción no puede superar 500 caracteres';
  }

  if (parentId) {
    if (parentId === id) {
      errores.parent_id = 'Una cuenta no puede ser su propia cuenta padre';
    } else {
      const porId = new Map(cuentas.map((c) => [c.id, c]));
      const padre = porId.get(parentId);
      if (!padre) {
        errores.parent_id = 'La cuenta padre seleccionada no existe';
      } else {
        const visitadas = new Set();
        let actual = padre;
        while (actual && actual.parent_id) {
          if (actual.id === id || visitadas.has(actual.id)) {
            errores.parent_id = 'La relación jerárquica no puede formar ciclos';
            break;
          }
          visitadas.add(actual.id);
          actual = porId.get(actual.parent_id);
        }
        if (!errores.parent_id && actual && actual.id === id) {
          errores.parent_id = 'La relación jerárquica no puede formar ciclos';
        }
      }
    }
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
