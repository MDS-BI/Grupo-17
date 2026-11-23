const MARCA = '2026-10-01T00:00:00.000Z';

const SECCIONES = ['panel', 'resumen', 'cuentas', 'asientos', 'pagos', 'periodos', 'reportes', 'entidades', 'documentos', 'busqueda', 'datosDemo'];
const EXCLUIDAS = new Set(['entidades', 'documentos', 'busqueda']);

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
      currency: 'MXN',
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
      currency: 'MXN',
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
    currency: 'MXN',
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

export function generarSemilla({ entidades = [], documentos = [] } = {}) {
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
    cuenta('cta-1200', '1200', 'IVA acreditable', 'activo', 'cta-1', { isLeaf: true }),
    cuenta('cta-2', '2', 'Pasivo', 'pasivo', null),
    cuenta('cta-2010', '2010', 'Proveedores', 'pasivo', 'cta-2', { isLeaf: true, entity_id: proveedorId }),
    cuenta('cta-2100', '2100', 'IVA trasladado', 'pasivo', 'cta-2', { isLeaf: true }),
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
    periodo('per-2026-08', '2026-08', '2026-08-01', '2026-08-31', 'cerrado'),
    periodo('per-2026-09', '2026-09', '2026-09-01', '2026-09-30', 'cerrado'),
    periodo('per-2026-10', '2026-10', '2026-10-01', '2026-10-31', 'abierto'),
    periodo('per-2026-11', '2026-11', '2026-11-01', '2026-11-30', 'abierto')
  ];

  const asientos = [
    asiento('asi-0001', 'DI', 1001, '2026-10-03', 'per-2026-10', 'Venta de mercancía a crédito', 'aprobado', clienteId),
    asiento('asi-0002', 'DI', 1002, '2026-10-08', 'per-2026-10', 'Pago de renta del mes', 'aprobado', proveedorId),
    asiento('asi-0003', 'DI', 1003, '2026-10-15', 'per-2026-10', 'Compra de papelería', 'borrador', proveedorId),
    asiento('asi-0004', 'DI', 1001, '2026-09-05', 'per-2026-09', 'Venta de servicios profesionales', 'aprobado', clienteId),
    asiento('asi-0005', 'DI', 1002, '2026-09-20', 'per-2026-09', 'Pago de sueldos de septiembre', 'cancelado', null),
    asiento('asi-0006', 'DI', 1001, '2026-08-10', 'per-2026-08', 'Aportación de capital inicial', 'aprobado', null)
  ];

  const lineas = [
    linea('lin-0001-1', 'asi-0001', 'cta-1100', 'Venta a crédito', 116000, 0, clienteId),
    linea('lin-0001-2', 'asi-0001', 'cta-4010', 'Ingreso por venta', 0, 100000),
    linea('lin-0001-3', 'asi-0001', 'cta-2100', 'IVA trasladado', 0, 16000),
    linea('lin-0002-1', 'asi-0002', 'cta-5020', 'Renta de oficina', 250000, 0),
    linea('lin-0002-2', 'asi-0002', 'cta-1020', 'Pago con transferencia', 0, 250000),
    linea('lin-0003-1', 'asi-0003', 'cta-5010', 'Papelería', 58000, 0),
    linea('lin-0003-2', 'asi-0003', 'cta-1010', 'Pago en efectivo', 0, 58000),
    linea('lin-0004-1', 'asi-0004', 'cta-1100', 'Servicios a crédito', 58000, 0, clienteId),
    linea('lin-0004-2', 'asi-0004', 'cta-4020', 'Ingreso por servicios', 0, 50000),
    linea('lin-0004-3', 'asi-0004', 'cta-2100', 'IVA trasladado', 0, 8000),
    linea('lin-0005-1', 'asi-0005', 'cta-5030', 'Sueldos', 300000, 0),
    linea('lin-0005-2', 'asi-0005', 'cta-1020', 'Pago de nómina', 0, 300000),
    linea('lin-0006-1', 'asi-0006', 'cta-1020', 'Aportación bancaria', 500000, 0),
    linea('lin-0006-2', 'asi-0006', 'cta-3010', 'Capital social', 0, 500000)
  ];

  const porAsiento = new Map();
  for (const item of lineas) {
    if (!porAsiento.has(item.asiento_id)) porAsiento.set(item.asiento_id, []);
    porAsiento.get(item.asiento_id).push(item);
  }
  for (const item of asientos) {
    const propias = porAsiento.get(item.id) || [];
    item.totalDebit = propias.reduce((total, l) => total + l.debit, 0);
    item.totalCredit = propias.reduce((total, l) => total + l.credit, 0);
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
      document_id: documentoVenta ? documentoVenta.id : null,
      asiento_id: 'asi-0001',
      amount: 116000,
      currency: 'MXN',
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
      date: '2026-10-08',
      fechaVencimiento: '2026-12-08',
      entity_id: proveedorId,
      document_id: documentoCompra ? documentoCompra.id : null,
      asiento_id: 'asi-0002',
      amount: 250000,
      currency: 'MXN',
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
      date: '2026-09-25',
      fechaVencimiento: '2026-10-15',
      entity_id: clienteId,
      document_id: null,
      asiento_id: null,
      amount: 58000,
      currency: 'MXN',
      method: 'efectivo',
      status: 'pendiente',
      notes: 'Cobro pendiente de aplicar',
      createdAt: MARCA,
      updatedAt: MARCA
    }
  ];

  return { cuentas, periodos, asientos, lineas, pagos };
}
