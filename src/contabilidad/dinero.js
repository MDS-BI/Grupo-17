const FORMATO_MXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

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

export function formatearMXN(centavos) {
  return FORMATO_MXN.format((Number(centavos) || 0) / 100);
}

export function sumarCentavos(importes) {
  return importes.reduce((total, valor) => total + (Number(valor) || 0), 0);
}
