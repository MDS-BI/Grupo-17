import { compararFechas, haySolapamiento, periodoContieneFecha } from './fechas.js';
import { sumarCentavos } from './dinero.js';
import { calcularEstadoPago } from './resumen-pagos.js';

const MARCA = '2026-10-01T00:00:00.000Z';

export const FECHA_REFERENCIA_SEMILLA = MARCA.slice(0, 10);

const SECCIONES = ['panel', 'resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes', 'entidades', 'documentos', 'busqueda', 'datosDemo'];
const EXCLUIDAS = new Set(['entidades', 'documentos', 'busqueda']);

function fechaRelativa(dias, referencia = FECHA_REFERENCIA_SEMILLA) {
  const fecha = new Date(`${referencia}T00:00:00.000Z`);
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

function permiso(seccion, acceso, acciones = []) {
  const accionesEfectivas = seccion === 'pagos' && acceso !== 'noDisponible' && !acciones.includes('marcarPagado')
    ? [...acciones, 'marcarPagado']
    : acciones;
  return {
    seccion,
    acceso,
    acciones: acceso === 'noDisponible' ? [] : accionesEfectivas,
    visibleEnMenu: acceso !== 'noDisponible' && !EXCLUIDAS.has(seccion)
  };
}

function rol(id, nombre, panelInicio, accesos, accionesPanel = ['cerrarSesion']) {
  return {
    id,
    nombre,
    panelInicio,
    permisos: SECCIONES.map((seccion) => {
      const acceso = accesos[seccion] || 'noDisponible';
      const acciones = acceso === 'gestionar'
        ? ['crear', 'editar', 'eliminar']
        : acceso === 'registrarConsultar'
          ? ['crear']
          : [];
      return permiso(seccion, acceso, acciones);
    }),
    accionesPanel: [...accionesPanel]
  };
}

export function generarRoles() {
  return [
    rol('administrador', 'Administrador financiero', 'integral', {
      panel: 'ver',
      resumen: 'consultar',
      cuentas: 'gestionar',
      asientos: 'gestionar',
      pagos: 'gestionar',
      periodos: 'gestionar',
      reportes: 'consultar',
      datosDemo: 'gestionar'
    }, ['cargarDatos', 'restablecerDatos', 'cerrarSesion']),
    rol('contador', 'Contador', 'contable', {
      panel: 'ver',
      resumen: 'consultar',
      cuentas: 'gestionar',
      asientos: 'gestionar',
      reportes: 'consultar'
    }),
    rol('tesorero', 'Tesorero', 'tesoreria', {
      panel: 'ver',
      pagos: 'registrarConsultar'
    }),
    rol('auditor', 'Auditor', 'auditoria', {
      panel: 'ver',
      reportes: 'consultar'
    })
  ];
}

export function generarUsuarios() {
  return [
    { rut: '11.111.111-1', rutNormalizado: '111111111', nombre: 'Administrador financiero', contraseña: 'Admin2026!', rol_id: 'administrador' },
    { rut: '22.222.222-2', rutNormalizado: '222222222', nombre: 'Contador', contraseña: 'Contador2026!', rol_id: 'contador' },
    { rut: '33.333.333-3', rutNormalizado: '333333333', nombre: 'Tesorero', contraseña: 'Tesorero2026!', rol_id: 'tesorero' },
    { rut: '44.444.444-4', rutNormalizado: '444444444', nombre: 'Auditor', contraseña: 'Auditor2026!', rol_id: 'auditor' }
  ];
}

export function generarSemillaBase() {
  const entidades = [
    {
      id: 'ent-cliente-demo',
      entity_id: 'ent-cliente-demo',
      name: 'Distribuidora del Norte',
      code: 'CLI-001',
      taxId: 'DNO800101AB1',
      email: 'contacto@delnorte.mx',
      phone: '555-100-2000',
      address: 'Av. Constitución 100',
      category: 'Cliente',
      description: 'Cliente mayorista de la zona norte',
      creditLimit: 50000,
      paymentTerms: 'neto 30',
      createdAt: MARCA,
      updatedAt: MARCA
    },
    {
      id: 'ent-proveedor-demo',
      entity_id: 'ent-proveedor-demo',
      name: 'Insumos del Centro',
      code: 'PROV-001',
      taxId: 'ICE990202CD3',
      email: 'ventas@insumoscentro.mx',
      phone: '555-300-4000',
      address: 'Calle Hidalgo 250',
      category: 'Proveedor',
      description: 'Proveedor de insumos y papelería',
      paymentTerms: 'contado',
      createdAt: MARCA,
      updatedAt: MARCA
    }
  ];
  const documentos = [
    {
      id: 'doc-venta-demo',
      entity_id: 'ent-cliente-demo',
      series: 'FAC',
      folio: 1001,
      startDate: '2026-10-03',
      endDate: '2026-10-31',
      quantity: 10,
      subtotal: 1000,
      discount: 0,
      taxAmount: 160,
      totalAmount: 1160,
      currency: 'CLP',
      paymentTerms: 'neto 30',
      notes: 'Venta de mercancía',
      status: 'aprobado',
      createdAt: MARCA,
      updatedAt: MARCA
    },
    {
      id: 'doc-compra-demo',
      entity_id: 'ent-proveedor-demo',
      series: 'COM',
      folio: 2001,
      startDate: '2026-10-08',
      endDate: '2026-10-31',
      quantity: 1,
      subtotal: 2500,
      discount: 0,
      taxAmount: 0,
      totalAmount: 2500,
      currency: 'CLP',
      paymentTerms: 'contado',
      notes: 'Renta de oficina',
      status: 'aprobado',
      createdAt: MARCA,
      updatedAt: MARCA
    }
  ];
  return { entidades, documentos };
}

function cuenta(id, code, name, type, parent_id, extra = {}) {
  const normalBalance = ['activo', 'gasto'].includes(type) ? 'debit' : 'credit';
  return {
    id,
    code,
    name,
    type,
    parent_id: parent_id || null,
    isLeaf: Boolean(extra.isLeaf),
    entity_id: extra.entity_id || null,
    normalBalance,
    status: extra.status || 'activa',
    createdAt: MARCA,
    updatedAt: MARCA
  };
}

function periodo(id, name, startDate, endDate, status) {
  return { id, name, startDate, endDate, status, createdAt: MARCA, updatedAt: MARCA };
}

function asiento(id, series, folio, date, period_id, concept, status, entity_id) {
  return {
    id,
    series,
    folio,
    date,
    period_id,
    concept,
    sourceDocumentType: null,
    sourceDocumentId: null,
    entity_id: entity_id || null,
    totalDebit: 0,
    totalCredit: 0,
    currency: 'CLP',
    status,
    notes: '',
    createdAt: MARCA,
    updatedAt: MARCA
  };
}

function linea(id, asiento_id, cuenta_id, concept, debit, credit, entity_id) {
  return {
    id,
    asiento_id,
    cuenta_id,
    concept,
    debit: debit || 0,
    credit: credit || 0,
    entity_id: entity_id || null,
    createdAt: MARCA,
    updatedAt: MARCA
  };
}

function marcaAuditoria(segundo) {
  return `2026-10-01T00:00:${String(segundo).padStart(2, '0')}.000Z`;
}

function eventoAuditoria({ numero, accion, entidad, movimiento, segundo, descripcion, cambios = [] }) {
  const timestamp = marcaAuditoria(segundo);
  return {
    id: `aud-${String(segundo).padStart(4, '0')}`,
    timestamp,
    fechaHora: timestamp,
    usuario: 'Administrador financiero',
    usuarioRut: '11.111.111-1',
    usuarioNombre: 'Administrador financiero',
    rol: 'Administrador financiero',
    rolId: 'administrador',
    rolNombre: 'Administrador financiero',
    accion,
    modulo: entidad === 'asiento' ? 'asientos' : 'pagos',
    entidad,
    tipoMovimiento: entidad,
    entidadId: movimiento.id,
    movimientoId: movimiento.id,
    numero,
    descripcion,
    cambios,
    camposModificados: cambios
  };
}

function construirAuditoriaSemilla(asientos = [], pagos = []) {
  const eventos = [];
  let segundo = 1;
  for (const asiento of asientos) {
    eventos.push(eventoAuditoria({
      numero: `${asiento.series}-${asiento.folio}`,
      accion: 'crear',
      entidad: 'asiento',
      movimiento: asiento,
      segundo,
      descripcion: `Creó el asiento contable ${asiento.series}-${asiento.folio}`
    }));
    segundo += 1;
  }
  for (const pago of pagos) {
    eventos.push(eventoAuditoria({
      numero: pago.numero,
      accion: 'crear',
      entidad: 'pago',
      movimiento: pago,
      segundo,
      descripcion: `Creó el ${pago.tipo} ${pago.numero}`
    }));
    segundo += 1;
  }
  const borrador = asientos.find((asiento) => asiento.id === 'asi-0003');
  if (borrador) {
    eventos.push(eventoAuditoria({
      numero: `${borrador.series}-${borrador.folio}`,
      accion: 'editar',
      entidad: 'asiento',
      movimiento: borrador,
      segundo,
      descripcion: `Editó el asiento contable ${borrador.series}-${borrador.folio}`,
      cambios: [{ campo: 'concepto', valorAnterior: 'Compra de papelería pendiente', valorNuevo: borrador.concept }]
    }));
    segundo += 1;
  }
  const asientoAnulado = asientos.find((asiento) => asiento.status === 'cancelado');
  if (asientoAnulado) {
    eventos.push(eventoAuditoria({
      numero: `${asientoAnulado.series}-${asientoAnulado.folio}`,
      accion: 'anular',
      entidad: 'asiento',
      movimiento: asientoAnulado,
      segundo,
      descripcion: `Anuló el asiento contable ${asientoAnulado.series}-${asientoAnulado.folio}`,
      cambios: [{ campo: 'estado', valorAnterior: 'aprobado', valorNuevo: 'cancelado' }]
    }));
    segundo += 1;
  }
  const pagoAnulado = pagos.find((pago) => pago.anulado);
  if (pagoAnulado) {
    eventos.push(eventoAuditoria({
      numero: pagoAnulado.numero,
      accion: 'anular',
      entidad: 'pago',
      movimiento: pagoAnulado,
      segundo,
      descripcion: `Anuló el ${pagoAnulado.tipo} ${pagoAnulado.numero}`,
      cambios: [{ campo: 'estado', valorAnterior: 'pendiente', valorNuevo: 'anulado' }]
    }));
  }
  return eventos;
}

export function validarSemilla(datos = {}, { fechaReferencia = FECHA_REFERENCIA_SEMILLA } = {}) {
  const { periodos = [], asientos = [], pagos = [], cuentas = [] } = datos;
  const errores = [];
  const idsCuentas = new Set(cuentas.map((cuenta) => cuenta.id));
  const idsAsientos = new Set(asientos.map((asiento) => asiento.id));
  const periodosPorId = new Map(periodos.map((periodo) => [periodo.id, periodo]));

  for (let i = 0; i < periodos.length; i += 1) {
    for (let j = i + 1; j < periodos.length; j += 1) {
      if (haySolapamiento(periodos[i], periodos[j])) {
        errores.push(`Los periodos ${periodos[i].name} y ${periodos[j].name} se traslapan`);
      }
    }
  }

  for (const asiento of asientos) {
    const periodo = periodosPorId.get(asiento.period_id);
    if (!periodo) {
      errores.push(`El asiento ${asiento.id} no pertenece a un periodo`);
    } else if (periodo.status === 'cerrado') {
      errores.push(`El asiento ${asiento.id} está en el periodo cerrado ${periodo.name}`);
    }
    const lineas = (datos.lineas || []).filter((linea) => linea.asiento_id === asiento.id);
    if (lineas.some((linea) => !idsCuentas.has(linea.cuenta_id))) {
      errores.push(`El asiento ${asiento.id} tiene líneas con cuentas desconocidas`);
    }
  }

  for (const pago of pagos) {
    const periodo = periodos.find((item) => periodoContieneFecha(item, pago.date));
    if (!periodo) {
      errores.push(`El pago ${pago.numero} no pertenece a un periodo`);
    } else if (periodo.status === 'cerrado') {
      errores.push(`El pago ${pago.numero} está en el periodo cerrado ${periodo.name}`);
    }
    if (pago.asiento_id && !idsAsientos.has(pago.asiento_id)) {
      errores.push(`El pago ${pago.numero} referencia un asiento inexistente`);
    }
  }

  for (const periodo of periodos) {
    if (periodo.status === 'cerrado') continue;
    const tieneAsiento = asientos.some((asiento) => asiento.period_id === periodo.id);
    const tienePago = pagos.some((pago) => periodoContieneFecha(periodo, pago.date));
    if (!tieneAsiento) errores.push(`El periodo ${periodo.name} no tiene asientos`);
    if (!tienePago) errores.push(`El periodo ${periodo.name} no tiene pagos`);
  }

  if (!periodos.some((periodo) => periodo.status === 'cerrado')) {
    errores.push('La semilla debe incluir al menos un periodo cerrado');
  }
  if (!periodos.some((periodo) => periodo.status === 'cerrado'
    && !asientos.some((asiento) => asiento.period_id === periodo.id)
    && !pagos.some((pago) => periodoContieneFecha(periodo, pago.date)))) {
    errores.push('La semilla debe incluir al menos un periodo cerrado sin movimientos');
  }

  const estados = new Set(pagos.map((pago) => calcularEstadoPago(pago, fechaReferencia)));
  for (const estado of ['pendiente', 'pagado', 'vencido']) {
    if (!estados.has(estado)) errores.push(`La semilla no incluye pagos en estado ${estado}`);
  }

  if (periodos.length < 4) errores.push('La semilla debe incluir al menos cuatro periodos');

  return { valido: errores.length === 0, errores };
}

export function generarSemilla({ entidades = [], documentos = [], fechaReferencia = FECHA_REFERENCIA_SEMILLA } = {}) {
  const cliente = entidades.find((e) => e.category === 'Cliente') || entidades[0] || null;
  const proveedor = entidades.find((e) => e.category === 'Proveedor') || entidades[1] || entidades[0] || null;
  const clienteId = cliente ? cliente.entity_id : null;
  const proveedorId = proveedor ? proveedor.entity_id : null;
  const documentoVenta = documentos[0] || null;
  const documentoCompra = documentos[1] || documentos[0] || null;

  const cuentas = [
    cuenta('cta-1', '1', 'Activo', 'activo', null),
    cuenta('cta-1010', '1010', 'Caja', 'activo', 'cta-1', { isLeaf: true }),
    cuenta('cta-1020', '1020', 'Bancos', 'activo', 'cta-1', { isLeaf: true }),
    cuenta('cta-1100', '1100', 'Clientes', 'activo', 'cta-1', { isLeaf: true, entity_id: clienteId }),
    cuenta('cta-1200', '1200', 'IVA Crédito Fiscal', 'activo', 'cta-1', { isLeaf: true }),
    cuenta('cta-2', '2', 'Pasivo', 'pasivo', null),
    cuenta('cta-2010', '2010', 'Proveedores', 'pasivo', 'cta-2', { isLeaf: true, entity_id: proveedorId }),
    cuenta('cta-2100', '2100', 'IVA Débito Fiscal', 'pasivo', 'cta-2', { isLeaf: true }),
    cuenta('cta-3', '3', 'Patrimonio', 'patrimonio', null),
    cuenta('cta-3010', '3010', 'Capital social', 'patrimonio', 'cta-3', { isLeaf: true }),
    cuenta('cta-4', '4', 'Ingresos', 'ingreso', null),
    cuenta('cta-4010', '4010', 'Ventas', 'ingreso', 'cta-4', { isLeaf: true }),
    cuenta('cta-4020', '4020', 'Servicios', 'ingreso', 'cta-4', { isLeaf: true }),
    cuenta('cta-5', '5', 'Gastos', 'gasto', null),
    cuenta('cta-5010', '5010', 'Gastos de operación', 'gasto', 'cta-5', { isLeaf: true }),
    cuenta('cta-5020', '5020', 'Renta', 'gasto', 'cta-5', { isLeaf: true }),
    cuenta('cta-5030', '5030', 'Sueldos', 'gasto', 'cta-5', { isLeaf: true })
  ];

  const periodos = [
    periodo('per-2026-07', '2026-07', '2026-07-01', '2026-07-31', 'cerrado'),
    periodo('per-2026-08', '2026-08', '2026-08-01', '2026-08-31', 'abierto'),
    periodo('per-2026-09', '2026-09', '2026-09-01', '2026-09-30', 'cerrado'),
    periodo('per-2026-10', '2026-10', '2026-10-01', '2026-10-31', 'abierto'),
    periodo('per-2026-11', '2026-11', '2026-11-01', '2026-11-30', 'abierto')
  ];

  const asientos = [
    asiento('asi-0001', 'DI', 1001, '2026-10-03', 'per-2026-10', 'Venta de mercancía a crédito', 'aprobado', clienteId),
    asiento('asi-0002', 'DI', 1002, '2026-10-08', 'per-2026-10', 'Pago de renta del mes', 'aprobado', proveedorId),
    asiento('asi-0003', 'DI', 1003, '2026-10-15', 'per-2026-10', 'Compra de papelería', 'borrador', proveedorId),
    asiento('asi-0004', 'DI', 1004, '2026-08-06', 'per-2026-08', 'Venta de servicios profesionales', 'aprobado', clienteId),
    asiento('asi-0005', 'DI', 1005, '2026-08-21', 'per-2026-08', 'Pago de sueldos de agosto', 'cancelado', null),
    asiento('asi-0006', 'DI', 1006, '2026-08-10', 'per-2026-08', 'Aportación de capital inicial', 'aprobado', null),
    asiento('asi-0007', 'DI', 1007, '2026-08-12', 'per-2026-08', 'Cobro de clientes de agosto', 'aprobado', clienteId),
    asiento('asi-0008', 'DI', 1008, '2026-08-18', 'per-2026-08', 'Pago de servicios de agosto', 'aprobado', proveedorId),
    asiento('asi-0009', 'DI', 1009, '2026-08-22', 'per-2026-08', 'Venta de servicios de agosto', 'aprobado', clienteId),
    asiento('asi-0010', 'DI', 1010, '2026-11-05', 'per-2026-11', 'Pago de renta de noviembre', 'aprobado', proveedorId)
  ];

  const lineas = [
    linea('lin-0001-1', 'asi-0001', 'cta-1100', 'Venta a crédito', 116000, 0, clienteId),
    linea('lin-0001-2', 'asi-0001', 'cta-4010', 'Ingreso por venta', 0, 100000),
    linea('lin-0001-3', 'asi-0001', 'cta-2100', 'IVA Débito Fiscal', 0, 16000),
    linea('lin-0002-1', 'asi-0002', 'cta-5020', 'Renta de oficina', 250000, 0),
    linea('lin-0002-2', 'asi-0002', 'cta-1020', 'Pago con transferencia', 0, 250000),
    linea('lin-0003-1', 'asi-0003', 'cta-5010', 'Papelería', 58000, 0),
    linea('lin-0003-2', 'asi-0003', 'cta-1010', 'Pago en efectivo', 0, 58000),
    linea('lin-0004-1', 'asi-0004', 'cta-1100', 'Servicios a crédito', 58000, 0, clienteId),
    linea('lin-0004-2', 'asi-0004', 'cta-4020', 'Ingreso por servicios', 0, 50000),
    linea('lin-0004-3', 'asi-0004', 'cta-2100', 'IVA Débito Fiscal', 0, 8000),
    linea('lin-0005-1', 'asi-0005', 'cta-5030', 'Sueldos', 300000, 0),
    linea('lin-0005-2', 'asi-0005', 'cta-1020', 'Pago de nómina', 0, 300000),
    linea('lin-0006-1', 'asi-0006', 'cta-1020', 'Aportación bancaria', 500000, 0),
    linea('lin-0006-2', 'asi-0006', 'cta-3010', 'Capital social', 0, 500000),
    linea('lin-0007-1', 'asi-0007', 'cta-1100', 'Cobro a crédito', 120000, 0, clienteId),
    linea('lin-0007-2', 'asi-0007', 'cta-4010', 'Ingreso por venta', 0, 120000),
    linea('lin-0008-1', 'asi-0008', 'cta-5010', 'Servicios de agosto', 90000, 0),
    linea('lin-0008-2', 'asi-0008', 'cta-1020', 'Pago con transferencia', 0, 90000),
    linea('lin-0009-1', 'asi-0009', 'cta-1100', 'Servicios a crédito', 70000, 0, clienteId),
    linea('lin-0009-2', 'asi-0009', 'cta-4020', 'Ingreso por servicios', 0, 70000),
    linea('lin-0010-1', 'asi-0010', 'cta-5020', 'Renta de noviembre', 60000, 0),
    linea('lin-0010-2', 'asi-0010', 'cta-1020', 'Pago con transferencia', 0, 60000)
  ];

  const porAsiento = new Map();
  for (const item of lineas) {
    if (!porAsiento.has(item.asiento_id)) porAsiento.set(item.asiento_id, []);
    porAsiento.get(item.asiento_id).push(item);
  }
  for (const item of asientos) {
    const propias = porAsiento.get(item.id) || [];
    item.totalDebit = sumarCentavos(propias.map((l) => l.debit));
    item.totalCredit = sumarCentavos(propias.map((l) => l.credit));
  }
  asientos[0].sourceDocumentType = documentoVenta ? 'document' : null;
  asientos[0].sourceDocumentId = documentoVenta ? documentoVenta.id : null;
  asientos[1].sourceDocumentType = documentoCompra ? 'document' : null;
  asientos[1].sourceDocumentId = documentoCompra ? documentoCompra.id : null;

  const pagos = [
    {
      id: 'pag-0001',
      numero: 'COB-1001',
      series: 'COB',
      folio: 1001,
      tipo: 'cobro',
      date: '2026-10-05',
      fechaVencimiento: '2026-12-05',
      entity_id: clienteId,
      asiento_id: 'asi-0001',
      amount: 116000,
      currency: 'CLP',
      method: 'transferencia',
      status: 'pagado',
      notes: 'Cobro de la factura FAC-1001',
      createdAt: MARCA,
      updatedAt: MARCA
    },
    {
      id: 'pag-0002',
      numero: 'PAG-1001',
      series: 'PAG',
      folio: 1001,
      tipo: 'pago',
      date: '2026-08-08',
      fechaVencimiento: '2026-12-08',
      entity_id: proveedorId,
      asiento_id: null,
      amount: 250000,
      currency: 'CLP',
      method: 'transferencia',
      status: 'pendiente',
      notes: 'Pago de renta',
      createdAt: MARCA,
      updatedAt: MARCA
    },
    {
      id: 'pag-0003',
      numero: 'COB-1002',
      series: 'COB',
      folio: 1002,
      tipo: 'cobro',
      date: '2026-10-25',
      fechaVencimiento: fechaRelativa(-20, fechaReferencia),
      entity_id: clienteId,
      asiento_id: null,
      amount: 58000,
      currency: 'CLP',
      method: 'efectivo',
      status: 'pendiente',
      notes: 'Cobro pendiente de aplicar',
      createdAt: MARCA,
      updatedAt: MARCA
    },
    {
      id: 'pag-0004',
      numero: 'PAG-1002',
      series: 'PAG',
      folio: 1002,
      tipo: 'pago',
      date: '2026-08-12',
      fechaVencimiento: fechaRelativa(60, fechaReferencia),
      entity_id: proveedorId,
      asiento_id: null,
      amount: 45000,
      currency: 'CLP',
      method: 'cheque',
      status: 'pendiente',
      anulado: true,
      anuladoEn: MARCA,
      notes: 'Pago anulado conservado para auditoría',
      createdAt: MARCA,
      updatedAt: MARCA
    },
    {
      id: 'pag-0005',
      numero: 'PAG-1003',
      series: 'PAG',
      folio: 1003,
      tipo: 'pago',
      date: '2026-11-20',
      fechaVencimiento: fechaRelativa(5, fechaReferencia),
      entity_id: proveedorId,
      asiento_id: null,
      amount: 33000,
      currency: 'CLP',
      method: 'transferencia',
      status: 'pendiente',
      notes: 'Pago con vencimiento próximo',
      createdAt: MARCA,
      updatedAt: MARCA
    }
  ];

  const auditoria = construirAuditoriaSemilla(asientos, pagos);
  const datos = { cuentas, periodos, asientos, lineas, pagos, auditoria };
  const revision = validarSemilla(datos, { fechaReferencia });
  if (!revision.valido) throw new Error(`Semilla inválida: ${revision.errores.join('; ')}`);
  return datos;
}
