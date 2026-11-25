const FORMATO_CLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

export function normalizarImporte(valor) {
  if (valor === null || valor === undefined) {
    return { valido: false, error: 'El importe es obligatorio' };
  }
  const texto = String(valor).trim().replace(',', '.');
  if (texto === '') {
    return { valido: false, error: 'El importe es obligatorio' };
  }
  if (!/^-?\d+(\.\d{1,2})?$/.test(texto)) {
    return { valido: false, error: 'El importe debe ser un número con hasta 2 decimales' };
  }
  const negativo = texto.startsWith('-');
  const sinSigno = negativo ? texto.slice(1) : texto;
  const [entero, decimales = ''] = sinSigno.split('.');
  const centavos = Number(entero) * 100 + Number((decimales + '00').slice(0, 2));
  if (!Number.isSafeInteger(centavos)) {
    return { valido: false, error: 'El importe excede el rango permitido' };
  }
  return { valido: true, centavos: negativo ? -centavos : centavos };
}

export function aCentavos(valor) {
  const resultado = normalizarImporte(valor);
  return resultado.valido ? resultado.centavos : 0;
}

export function desdeCentavos(centavos) {
  return (Number(centavos) || 0) / 100;
}

export function formatearCLP(centavos) {
  const valor = desdeCentavos(centavos);
  const signo = valor < 0 ? '-' : '';
  return `${signo}$${FORMATO_CLP.format(Math.abs(valor))}`;
}

export function formatearCLPCompacto(centavos) {
  const valor = desdeCentavos(centavos);
  const absoluto = Math.abs(valor);
  if (absoluto >= 1000000) return `$${(valor / 1000000).toLocaleString('es-CL', { maximumFractionDigits: 0 })}M`;
  if (absoluto >= 1000) return `$${(valor / 1000).toLocaleString('es-CL', { maximumFractionDigits: 0 })}k`;
  return `$${valor.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
}

export function sumarCentavos(importes) {
  if (!Array.isArray(importes)) throw new TypeError('La lista de importes debe ser un arreglo');
  const total = importes.reduce((acumulado, valor) => {
    const centavos = typeof valor === 'string' && /^-?\d+$/.test(valor.trim())
      ? Number(valor.trim())
      : valor;
    if (!Number.isSafeInteger(centavos)) {
      throw new TypeError('Todos los importes deben ser centavos enteros');
    }
    return acumulado + centavos;
  }, 0);
  if (!Number.isSafeInteger(total)) throw new RangeError('La suma excede el rango permitido');
  return total;
}
