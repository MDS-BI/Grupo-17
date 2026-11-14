const FORMATO_FECHA = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC'
});

export function esFechaValida(valor) {
  if (!valor || typeof valor !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [anio, mes, dia] = valor.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return fecha.getUTCFullYear() === anio
    && fecha.getUTCMonth() === mes - 1
    && fecha.getUTCDate() === dia;
}

export function compararFechas(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function formatearFecha(valor) {
  if (!esFechaValida(valor)) return '';
  const [anio, mes, dia] = valor.split('-').map(Number);
  return FORMATO_FECHA.format(new Date(Date.UTC(anio, mes - 1, dia)));
}

export function periodoContieneFecha(periodo, fecha) {
  if (!periodo || !esFechaValida(fecha)) return false;
  return compararFechas(periodo.startDate, fecha) <= 0
    && compararFechas(fecha, periodo.endDate) <= 0;
}

export function haySolapamiento(periodoA, periodoB) {
  if (!periodoA || !periodoB) return false;
  return compararFechas(periodoA.startDate, periodoB.endDate) <= 0
    && compararFechas(periodoB.startDate, periodoA.endDate) <= 0;
}

export function fechaHoyISO() {
  return new Date().toISOString().slice(0, 10);
}
