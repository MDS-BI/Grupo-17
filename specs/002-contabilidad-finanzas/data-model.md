# Modelo de Datos: Módulo de Contabilidad y Finanzas

**Especificación base**: [001-erp-base-module/data-model.md](../001-erp-base-module/data-model.md) (no se modifica)
**Diagrama ER**: [er-diagram.md](er-diagram.md)

## Resumen

Este módulo añade contabilidad por partida doble sobre el módulo base. Reutiliza `Entity` (terceros: clientes, proveedores, bancos), `Document` (documentos de origen, p. ej., facturas) y `ModuleConfig` (etiquetas y ciclo de vida), y agrega ocho entidades persistentes: `CuentaContable`, `AsientoContable`, `LineaAsiento`, `Pago`, `PeriodoContable`, `Usuario`, `Rol` y `RegistroActividad`, además de una `Sesion` activa como máximo.

`Usuario` identifica a los cuatro usuarios de prueba mediante RUT, contraseña y rol. `Rol` define el panel de inicio, la matriz de `permisos` y las acciones globales disponibles. `RegistroActividad` conserva la trazabilidad inmutable de creación, edición y anulación de asientos y pagos, con usuario, rol, fecha, hora y campos modificados. Las Historias de Usuario 7 a 21 también introducen conceptos derivados que no se persisten como colecciones independientes: `PermisoRol`, `OpcionMenu`, `PanelInicio`, `DatosEjemplo`, `EstadoInicial`, `DestinoNavegacion`, `ControlAccion`, `EstadoPago`, `ResumenPagos`, `ReporteFinanciero`, `SaldoContable`, `CierrePeriodo`, `AlertaPago`, `ResumenAlerta`, `ArchivoReporte`, `ListadoFiltrado`, `TablaOrdenable` e `IdentidadCorporativa`.

Cada movimiento económico se registra como un asiento con dos o más líneas cuyos débitos y créditos deben sumar igual (partida doble). Un `Document` puede originar un asiento; un `Pago` puede generar y referenciar su asiento en el libro mayor. Todo importe se almacena como entero en centavos y se formatea en MXN solo en la capa de presentación.

## Entidades Base Reutilizadas

| Entidad base | Papel en este módulo |
|---|---|
| Entity | Tercero o auxiliar: cliente, proveedor, banco, acreedor. `entity_id` se usa como FK auxiliar en cuentas, líneas y pagos; se selecciona de forma contextual dentro de los formularios permitidos, sin sección navegable propia |
| Document | Documento origen que genera asientos (p. ej., factura de venta o compra). Se referencia mediante `sourceDocumentId`; no se asocia a pagos o cobros en el MVP y no tiene sección navegable propia |
| ModuleConfig | Adaptación del módulo: `labels` (p. ej., `document: "Factura"`), `customFields` y `statusLifecycle` de asientos y pagos |

## Entidad: Usuario (acceso de demostración) — MVP

Usuario ficticio y determinista que representa a una persona del área financiera. Sustituye el nombre genérico `UsuarioDemo` usado en la especificación; la semilla crea exactamente cuatro registros, uno por rol.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| rut | string | PK | RUT canónico con formato chileno puntuado (p. ej., `11.111.111-1`) | Obligatorio, único. La autenticación acepta también el RUT sin puntos ni guion |
| rutNormalizado | string | UK | RUT sin puntos ni guion, con `k` minúscula cuando corresponda | Obligatorio, derivado de `rut`, único. Es la forma usada para comparar credenciales |
| nombre | string | — | Nombre visible del usuario de prueba | Obligatorio, no vacío |
| contraseña | string | — | Credencial fija de demostración | Obligatorio, sensible a mayúsculas. Solo se compara localmente; no se muestra en la interfaz ni se registra en consolas |
| rol_id | string | FK → Rol (`id`) | Rol asignado al usuario | Obligatorio. Al eliminar el rol se aplica `RESTRICT`; los roles de la semilla no se eliminan |

**Usuarios de la semilla**:

| Rol | RUT | Contraseña | Panel de inicio esperado |
|---|---|---|---|
| Administrador financiero | `11.111.111-1` | `Admin2026!` | Resumen integral, periodos y asuntos prioritarios |
| Contador | `22.222.222-2` | `Contador2026!` | Cuentas, asientos y reportes contables |
| Tesorero | `33.333.333-3` | `Tesorero2026!` | Pagos, cobros y flujo de efectivo |
| Auditor | `44.444.444-4` | `Auditor2026!` | Trazabilidad, reportes e historial |

> Las credenciales son ficticias y existen únicamente para la demostración frontend. No constituyen un mecanismo de seguridad real.

## Entidad: Rol (perfil de acceso) — MVP

Categoría de acceso que determina el panel inicial, las opciones visibles del menú y las acciones permitidas. La semilla crea los roles `administrador`, `contador`, `tesorero` y `auditor`.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador estable del rol | Obligatorio, único: `administrador`, `contador`, `tesorero`, `auditor` |
| nombre | string | — | Etiqueta visible del rol | Obligatorio: `Administrador financiero`, `Contador`, `Tesorero`, `Auditor` |
| panelInicio | string | — | Clave del panel presentado tras autenticarse | Obligatorio: `integral`, `contable`, `tesoreria`, `auditoria` |
| permisos | PermisoRol[] | — | Matriz de acceso por sección | Obligatoria, una entrada por sección del dominio. Define `OpcionMenu` y bloquea secciones no permitidas |
| accionesPanel | string[] | — | Acciones globales disponibles en el panel | Obligatorio. `cerrarSesion` para los cuatro roles; `cargarDatos` y `restablecerDatos` solo para `administrador` |

### Objeto de Valor: PermisoRol

`PermisoRol` se embebe dentro de `Rol.permisos`; no se persiste como colección independiente. Se copia a `Sesion.permisos` al iniciar sesión para que un cambio de rol no altere permisos en una sesión abierta.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| seccion | string | — | Sección gobernada | Obligatoria: `panel`, `cuentas`, `asientos`, `pagos`, `periodos`, `reportes`, `entidades`, `documentos`, `busqueda`, `datosDemo` |
| acceso | string | — | Nivel de acceso | Obligatorio: `gestionar`, `registrarConsultar`, `consultar`, `ver`, `noDisponible` |
| acciones | string[] | — | Acciones habilitadas | Derivado de `acceso`: `crear`, `editar`, `eliminar`, `cambiarEstado`, `abrirCerrarPeriodo`. Vacío para `noDisponible`, `ver` y `consultar` |
| visibleEnMenu | boolean | — | Indica si genera una `OpcionMenu` | Derivado: `false` para `noDisponible` y para las secciones excluidas `entidades`, `documentos`, `busqueda` |

**Matriz resultante**:

| Sección | Administrador financiero | Contador | Tesorero | Auditor |
|---|---|---|---|---|
| Panel de inicio del rol | Ver | Ver | Ver | Ver |
| Cuentas contables | Gestionar | Gestionar | No disponible | No disponible |
| Asientos contables | Gestionar | Gestionar | No disponible | No disponible |
| Pagos y cobros | Gestionar | No disponible | Registrar y consultar | No disponible |
| Periodos contables | Gestionar y abrir/cerrar | No disponible | No disponible | No disponible |
| Reportes financieros | Consultar | Consultar | No disponible | Consultar |
| Entidades | No disponible | No disponible | No disponible | No disponible |
| Documentos | No disponible | No disponible | No disponible | No disponible |
| Búsqueda | No disponible | No disponible | No disponible | No disponible |
| Acciones de datos de ejemplo | Cargar y restablecer | No disponible | No disponible | No disponible |
| Cerrar sesión | Disponible | Disponible | Disponible | Disponible |

## Entidad: RegistroActividad (trazabilidad de movimientos) — MVP

Colección append-only que documenta quién creó, editó o anuló un asiento o pago. Cada evento se escribe solo después de una operación exitosa y con cambios reales; no se actualiza ni se elimina desde la interfaz. La semilla genera eventos deterministas y el restablecimiento devuelve la colección a ese estado inicial sin huérfanos.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador único del evento | Obligatorio, generado de forma determinista en la semilla |
| fechaHora | string | — | Marca ISO de cuando ocurrió la acción | Obligatoria; en la semilla deriva de la marca fija `MARCA` |
| accion | string | — | Tipo de acción registrada | Obligatoria: `crear`, `editar`, `anular` |
| tipoMovimiento | string | — | Dominio del movimiento afectado | Obligatorio: `asiento`, `pago` |
| movimientoId | string | — | Identificador del asiento o pago | Obligatorio; se resuelve junto con `tipoMovimiento` |
| numero | string | — | Número visible del movimiento al ocurrir el evento | Obligatorio para presentación; copia del folio/número vigente |
| usuarioRut | string | FK → Usuario (`rut`) | Usuario responsable | Obligatorio; `RESTRICT` |
| usuarioNombre | string | — | Nombre copiado del usuario en el momento del evento | Obligatorio; conserva la identidad histórica |
| rolId | string | FK → Rol (`id`) | Rol vigente al ejecutar la acción | Obligatorio; `RESTRICT` |
| rolNombre | string | — | Nombre del rol copiado en el evento | Obligatorio; conserva el contexto histórico |
| camposModificados | CampoModificado[] | — | Descripción de los cambios reales | Obligatorio; debe contener al menos un elemento cuando `accion = editar`; vacío para `crear` y `anular` |

### Objeto de Valor: CampoModificado

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| campo | string | Nombre del campo modificado | Obligatorio, visible en español en la interfaz |
| valorAnterior | any | Valor antes del cambio | Obligatorio para `editar`; se normaliza para presentación |
| valorNuevo | any | Valor después del cambio | Obligatorio para `editar`; distinto de `valorAnterior` |

**Reglas de auditoría**:

- Los eventos se ordenan por `fechaHora` descendente y se filtran por `tipoMovimiento`, `accion` y `usuarioRut`.
- La consulta consolidada y el historial por movimiento son de solo lectura y solo para el Auditor, dentro de "Reportes financieros".
- No se genera evento en operaciones rechazadas, no-op, segunda anulación ni exportaciones.
- Un movimiento anulado conserva sus eventos; no se sobrescribe el historial al editarlo nuevamente.
- La eliminación física de un borrador con eventos asociados se bloquea; se ofrece anulación lógica para conservar la trazabilidad.
- El restablecimiento limpia y vuelve a sembrar `RegistroActividad` de forma atómica con el resto del módulo.

## Entidad: Sesion (estado de autenticación) — MVP

Representa el acceso vigente en la sesión del navegador. Existe como máximo un registro de sesión activa y se elimina al cerrar sesión.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador del registro de sesión | Obligatorio, generado al iniciar sesión |
| usuarioRut | string | FK → Usuario (`rut`) | Usuario autenticado | Obligatorio. `RESTRICT`: los usuarios de prueba no se eliminan durante la sesión |
| rolId | string | FK → Rol (`id`) | Rol vigente | Obligatorio. Se copia al autenticar; un cambio de rol exige cerrar sesión |
| permisos | PermisoRol[] | — | Copia inmutable de `Rol.permisos` | Obligatoria; define el menú y las acciones hasta el cierre de sesión |
| panelInicio | string | — | Copia de `Rol.panelInicio` | Obligatoria; evita consultar el catálogo de roles en cada render |
| estado | string | — | `autenticada` o `cerrada` | Obligatorio. `cerrada` equivale a ausencia de sesión y no habilita ningún panel |
| iniciadaEn | string | — | Marca de tiempo ISO de inicio de sesión | Obligatorio |

## Entidad: CuentaContable (plan de cuentas) — MVP

Catálogo jerárquico de cuentas del libro mayor. Cada cuenta acumula el saldo resultante de las líneas de asiento que la referencian.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único de la cuenta | Obligatorio, generado automáticamente |
| code | string | UK | Código contable ordenable (p. ej., `1010`, `1.01.01`) | Obligatorio, no vacío, único en el plan |
| name | string | — | Nombre de la cuenta (p. ej., Caja, Bancos, Ventas) | Obligatorio, no vacío |
| description | string | — | Descripción libre de la cuenta para el detalle del plan | Opcional; se normaliza sin espacios laterales y no supera 500 caracteres |
| type | string | — | Tipo de cuenta que define el saldo normal: `activo`, `pasivo`, `patrimonio`, `ingreso`, `gasto` | Obligatorio, valor del conjunto cerrado |
| parent_id | string | FK → CuentaContable | Cuenta padre para la jerarquía | Opcional; debe referenciar una cuenta existente; no debe formar ciclos. Al eliminar la cuenta padre se aplica `RESTRICT` |
| isLeaf | boolean | — | Indica si la cuenta admite líneas de asiento | Obligatorio; solo las cuentas hoja (`true`) reciben líneas |
| entity_id | string | FK → Entity (`entity_id`) | Auxiliar del tercero cuando la cuenta es de detalle (p. ej., cuenta por cobrar de un cliente) | Opcional; al eliminar la entidad se aplica `SET NULL` y la cuenta se conserva |
| normalBalance | string | — | Saldo normal derivado de `type`: `debit` para activo/gasto, `credit` para pasivo/patrimonio/ingreso | Obligatorio, derivado, solo lectura |
| status | string | — | Estado de la cuenta: `activa`, `inactiva` | Opcional, texto libre o ciclo de vida por ModuleConfig. Una cuenta con líneas o hijas no se elimina: se marca `inactiva` |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Entidad: AsientoContable (cabecera de asiento) — MVP

Cabecera de un registro contable en el diario. Agrupa las líneas, fija fecha y periodo, y almacena los totales para verificación de balance.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único del asiento | Obligatorio, generado automáticamente |
| series | string | — (UK compuesta) | Serie del asiento (p. ej., `AJ`, `DI`) que agrupa folios consecutivos | Opcional; forma parte de `UNIQUE(series, folio)`. Si está vacía se normaliza a cadena vacía para la unicidad |
| folio | number | — (UK compuesta) | Folio consecutivo; con la serie forma el número oficial (`DI-1001`) | Obligatorio, entero positivo, único en combinación `(series, folio)` |
| date | string | — | Fecha del asiento en formato YYYY-MM-DD | Obligatorio, fecha de calendario válida, dentro de un periodo abierto |
| period_id | string | FK → PeriodoContable | Periodo contable al que pertenece el asiento | Obligatorio, debe referenciar un periodo existente. Al eliminar el periodo se aplica `RESTRICT` |
| concept | string | — | Glosa o descripción del asiento | Obligatorio, no vacío |
| sourceDocumentType | string | — | Tipo de documento origen: `document` u otro módulo | Opcional; requerido cuando se usa `sourceDocumentId` |
| sourceDocumentId | string | FK → Document (`id`) | Documento base que origina el asiento | Opcional; debe referenciar un documento existente. `RESTRICT` al eliminar el documento |
| entity_id | string | FK → Entity (`entity_id`) | Tercero relacionado con el asiento | Opcional; al eliminar la entidad se aplica `SET NULL` |
| totalDebit | integer | — | Suma de los débitos de sus líneas, en centavos | Obligatorio, entero no negativo; exactamente igual a `totalCredit`; se recalcula desde las líneas |
| totalCredit | integer | — | Suma de los créditos de sus líneas, en centavos | Obligatorio, entero no negativo; exactamente igual a `totalDebit`; se recalcula desde las líneas |
| currency | string | — | Código de moneda de los importes; en el MVP siempre `MXN` | Obligatorio en el MVP; valor fijo `MXN` |
| status | string | — | Estado: `borrador`, `aprobado`, `cancelado` | Opcional; si ModuleConfig define `statusLifecycle`, se aplica ese ciclo. Solo `borrador` admite borrado físico; aprobados/cancelados se anulan lógicamente |
| notes | string | — | Notas u observaciones libres | Opcional |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Entidad: LineaAsiento (línea de asiento) — MVP

Movimiento individual de un asiento contra una cuenta del plan. Implementa la regla de partida doble: cada línea lleva el monto en débito o en crédito, nunca en ambos.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único de la línea | Obligatorio, generado automáticamente |
| asiento_id | string | FK → AsientoContable (`id`) | Asiento al que pertenece la línea | Obligatorio, debe referenciar un asiento existente; CASCADE al borrar físicamente un asiento en borrador |
| cuenta_id | string | FK → CuentaContable (`id`) | Cuenta afectada por el movimiento | Obligatorio, debe referenciar una cuenta hoja `isLeaf = true` y `status = activa`; RESTRICT al eliminar la cuenta |
| concept | string | — | Glosa de la línea (hereda la del asiento si está vacía) | Opcional |
| debit | integer | — | Importe en débito, en centavos | Opcional, entero no negativo; exactamente uno de `debit` o `credit` debe ser mayor que cero |
| credit | integer | — | Importe en crédito, en centavos | Opcional, entero no negativo; exactamente uno de `debit` o `credit` debe ser mayor que cero |
| entity_id | string | FK → Entity (`entity_id`) | Auxiliar del tercero en la línea (p. ej., factura de un cliente) | Opcional; al eliminar la entidad se aplica `SET NULL` |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Entidad: Pago (registro de cobro o desembolso) — MVP

Movimiento financiero de dinero contra un tercero: cobro a un cliente o pago a un proveedor. Opcionalmente genera el asiento contable correspondiente. La Historia de Usuario 12 incorpora la fecha de vencimiento y el estado operativo `pendiente`/`pagado`, del que se deriva `vencido`.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único del pago | Obligatorio, generado automáticamente |
| numero | string | UK | Número oficial del pago derivado de serie y folio | Obligatorio, no vacío, único |
| series | string | — (UK compuesta) | Serie del pago (p. ej., `COB`, `PAG`) | Opcional; forma parte de `UNIQUE(series, folio)`. Si está vacía se normaliza a cadena vacía para la unicidad |
| folio | number | — (UK compuesta) | Folio consecutivo del pago | Obligatorio, entero positivo, único en combinación `(series, folio)` |
| tipo | string | — | Tipo de operación: `cobro` (entrada de dinero) o `pago` (salida de dinero) | Obligatorio, valor del conjunto cerrado; por defecto `pago` |
| date | string | — | Fecha del pago en formato YYYY-MM-DD | Obligatorio, fecha de calendario válida |
| fechaVencimiento | string | — | Fecha límite para considerar el movimiento como pagado | Obligatoria, fecha válida YYYY-MM-DD. Puede ser anterior, igual o posterior a `date`; es la base para derivar `vencido` |
| entity_id | string | FK → Entity (`entity_id`) | Tercero pagado o que realiza el cobro | Obligatorio, debe referenciar una entidad existente; `RESTRICT` al eliminar la entidad |
| ~~document_id~~ | — | — | No disponible en el MVP; los pagos no conservan documento asociado | Excluido por FR-015; no debe generarse ni validarse |
| asiento_id | string | FK, UK → AsientoContable (`id`) | Asiento generado por el pago (1:1 opcional) | Opcional, único; debe referenciar un asiento existente; SET NULL al eliminar el asiento |
| amount | integer | — | Importe pagado en la moneda configurada, en centavos | Obligatorio, entero mayor que cero |
| currency | string | — | Código de moneda; en el MVP siempre `MXN` | Obligatorio en el MVP; valor fijo `MXN` |
| method | string | — | Medio de pago: `efectivo`, `transferencia`, `cheque`, `tarjeta` | Opcional, valor del conjunto cerrado |
| status | string | — | Estado operativo: `pendiente`, `pagado` | Obligatorio en el MVP. `vencido` no se captura: se deriva en `EstadoPago` cuando un pendiente supera `fechaVencimiento` |
| anulado | boolean | — | Indica anulación lógica conservando el registro | Obligatorio por defecto `false`. Un pago anulado se excluye de totales vigentes, resumen, alertas y reportes |
| anuladoEn | string | — | Marca ISO de la anulación | Obligatoria cuando `anulado = true`; en caso contrario ausente |
| notes | string | — | Notas u observaciones libres | Opcional |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

> Migración de estados: los valores heredados `aplicado` se normalizan a `pagado` y los heredados `cancelado` se normalizan a `anulado: true` con `status` conservado. `vencido` nunca se persiste; se deriva para pagos pendientes no anulados. Un pago anulado permanece consultable pero se excluye de totales vigentes, resumen, alertas y filtros de estado operativo.

## Entidad: PeriodoContable (periodo fiscal) — MVP

Ventana de tiempo (mes, trimestre o año) en la que se registran asientos. Los asientos no pueden crearse en periodos cerrados.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único del periodo | Obligatorio, generado automáticamente |
| name | string | UK | Nombre visible (p. ej., `2026-01`, Enero 2026) | Obligatorio, no vacío, único |
| startDate | string | — | Fecha de inicio en formato YYYY-MM-DD | Obligatorio, fecha de calendario válida |
| endDate | string | — | Fecha de fin en formato YYYY-MM-DD | Obligatorio, válida y igual o posterior a `startDate` |
| status | string | — | Estado: `abierto`, `cerrado` | Obligatorio, valor del conjunto cerrado. Un periodo con asientos no se elimina: se cierra |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Reglas de Validación

### Usuario

- `rut`, `rutNormalizado`, `nombre`, `contraseña` y `rol_id` son obligatorios.
- `rut` se almacena en formato puntuado y su forma normalizada sin puntos ni guion es única.
- Se aceptan RUT con 7 u 8 dígitos y dígito verificador numérico o `K`/`k`; no se valida autenticidad fuera del listado de usuarios de prueba.
- La comparación de contraseñas distingue mayúsculas y minúsculas; un RUT inexistente y una contraseña incorrecta producen el mismo mensaje: "RUT o contraseña incorrectos".
- Si falta RUT o contraseña, se indica qué dato falta y no se abre ningún panel.
- Los cuatro usuarios de la semilla no se eliminan ni se editan durante la demostración.

### Rol y PermisoRol

- `id`, `nombre`, `panelInicio`, `permisos` y `accionesPanel` son obligatorios.
- Debe existir exactamente una entrada de `PermisoRol` por sección del dominio.
- `cerrarSesion` está disponible para los cuatro roles; `cargarDatos` y `restablecerDatos` solo para `administrador`.
- Las secciones `entidades`, `documentos` y `busqueda` siempre tienen `acceso = noDisponible` y `visibleEnMenu = false`.
- El Auditor solo obtiene `consultar` en `reportes` y `ver` en `panel`; su matriz no contiene acciones de modificación.
- Un cambio de rol requiere cerrar sesión y autenticarse nuevamente.

### Sesión

- Solo puede existir una sesión con `estado = autenticada` por navegador.
- La autenticación copia `rolId`, `panelInicio` y `permisos` desde `Rol` para que los permisos queden fijos durante la sesión.
- Cerrar sesión elimina el registro de sesión y bloquea cualquier panel posterior sin nueva autenticación.
- La sesión se persiste únicamente en `sessionStorage` a través de la capa centralizada.

### Cuenta contable

- Un `code` y un `name` no vacíos son obligatorios; el código es único en el plan.
- `type` debe pertenecer al conjunto `activo`, `pasivo`, `patrimonio`, `ingreso`, `gasto`; `normalBalance` se deriva de él.
- `parent_id`, cuando existe, debe apuntar a una cuenta existente y no debe crear ciclos.
- Solo cuentas hoja (`isLeaf = true`) y activas pueden recibir líneas de asiento.
- Una cuenta con líneas o con cuentas hijas no se elimina: se marca `inactiva`.

### Asiento contable

- Un asiento debe incluir `folio` entero positivo; con `series` forma el número oficial (p. ej., `DI-1001`). La unicidad es compuesta: `UNIQUE(series, folio)`; si `series` está vacía se normaliza a cadena vacía para la comparación.
- Un asiento debe incluir al menos dos líneas.
- La suma de `debit` debe ser exactamente igual a la suma de `credit` en todas sus líneas; los totales se recalculan en centavos y se almacenan en `totalDebit` y `totalCredit` con igualdad exacta, sin tolerancia.
- Cada línea debe llevar importe en débito o en crédito, nunca ambos ni ninguno (el monto debe ser mayor que cero en uno de los dos).
- La fecha debe caer dentro de un `PeriodoContable` con `status = abierto`; los periodos cerrados rechazan asientos nuevos o modificaciones.
- Un asiento con `sourceDocumentId` debe referenciar un `Document` existente. Al eliminar el documento se aplica `RESTRICT`: no se borra un documento con asientos asociados.
- Un asiento `aprobado` no admite cambios en sus líneas; `cancelado` debe conservar su registro para auditoría (anulación lógica, no borrado físico).
- Solo un asiento en `borrador` puede eliminarse físicamente; al hacerlo se eliminan en cascada sus líneas.

### Línea de asiento

- `asiento_id` y `cuenta_id` deben referenciar registros existentes; `cuenta_id` debe ser una cuenta hoja y activa.
- Exactamente uno de `debit` o `credit` debe ser mayor que cero; el otro debe ser cero o ausente.
- `debit` y `credit` son enteros no negativos en centavos; no se admiten flotantes.
- `asiento_id` usa `CASCADE` únicamente cuando se borra físicamente un asiento en borrador; `cuenta_id` usa `RESTRICT` para no perder movimientos históricos.

### Pago

- `numero`, `date`, `fechaVencimiento`, `entity_id`, `amount` y `status` son obligatorios; `amount` debe ser un entero mayor que cero en centavos.
- `tipo` distingue cobros de pagos y debe pertenecer al conjunto `cobro`, `pago`; si no se envía, se asume `pago`.
- Si no se envían `series` y `folio`, se generan automáticamente con la serie `COB` o `PAG` según `tipo` y el siguiente folio disponible.
- `entity_id` y `asiento_id`, cuando existen, deben referenciar registros existentes; `document_id` no forma parte del pago en el MVP.
- `numero` es único; `folio` es un entero positivo único en combinación `(series, folio)`, con `series` vacía normalizada a cadena vacía.
- `asiento_id` es único: un pago genera o referencia como mucho un asiento y un asiento corresponde como mucho a un pago (1:1 opcional).
- `status` solo admite `pendiente` o `pagado`. El estado visible `vencido` se calcula; nunca se almacena como valor independiente para evitar desincronización con la fecha actual.
- Marcar un pago como pagado cambia `status` a `pagado` y conserva el registro en el resumen y en el listado.
- Un pago no se elimina físicamente una vez confirmado; las operaciones de restablecimiento limpian la colección completa de forma atómica.

### Periodo contable

- `startDate` y `endDate` deben ser fechas válidas con `endDate >= startDate`.
- No se permite que dos periodos se solapen, independientemente de su estado (abierto o cerrado).
- Un periodo con asientos no se elimina: se cierra (`status = cerrado`). El borrado está restringido por `AsientoContable.period_id`.
- Solo el Administrador financiero puede ejecutar `cerrarPeriodo(id)`, previa confirmación; un periodo ya cerrado no puede cerrarse dos veces y la cancelación no modifica el registro.
- El cierre solo cambia `status` y `updatedAt`; no altera asientos, pagos, saldos ni reportes históricos.
- Toda escritura de asiento o pago valida que la fecha original y la nueva fecha pertenezcan a un periodo abierto, incluidos cambios de estado, anulación y borrado permitido.
- Un periodo cerrado puede consultarse en listados y reportes, pero no ofrece acciones de creación, edición, eliminación ni cambio de estado.

### Registro de actividad

- `fechaHora`, `accion`, `tipoMovimiento`, `movimientoId`, `numero`, `usuarioRut`, `usuarioNombre`, `rolId`, `rolNombre` y `camposModificados` son obligatorios.
- `accion` solo admite `crear`, `editar` o `anular`; `tipoMovimiento` solo admite `asiento` o `pago`.
- Un evento `editar` debe identificar al menos un campo modificado con valores anterior y nuevo distintos.
- No se genera evento cuando la operación falla, no produce cambios o intenta anular dos veces el mismo movimiento.
- Los eventos son inmutables: no existe operación de alta manual, edición ni eliminación desde la interfaz.
- La consulta consolidada y el historial por movimiento solo están disponibles para el Auditor.
- La semilla y el restablecimiento producen el mismo conjunto de eventos, sin referencias a movimientos inexistentes.

### Reportes financieros por periodo

- Los reportes se calculan solo desde asientos con `status = aprobado`; se excluyen borradores y cancelados.
- El saldo inicial de cada cuenta se deriva de movimientos aprobados anteriores al rango del periodo; si no existen, es cero.
- El Balance de Comprobación excluye cuentas con saldo cero al cierre y advierte si los totales deudores y acreedores no coinciden.
- El Estado de Resultados calcula `resultado = ingresos - gastos` y el Balance General incluye el resultado acumulado dentro del patrimonio.
- Una cuenta sin `type` válido impide completar el Estado de Resultados o el Balance General y genera una advertencia identificando la cuenta.
- Un periodo sin movimientos ni saldos muestra estado vacío en los cuatro reportes; un periodo cerrado se consulta sin modificar su estado.

### Alertas de vencimientos

- Solo se consideran pagos con `status = pendiente` y `anulado = false`.
- `vencido`: `fechaVencimiento < fechaReferencia`. `venceEstaSemana`: `fechaReferencia <= fechaVencimiento <= domingo` de la semana `lunes a domingo`.
- Las categorías son mutuamente excluyentes: un pago vencido dentro de la semana actual solo cuenta en `vencidos`.
- Cada alerta expone cantidad, total en centavos y hasta tres detalles con entidad, monto y fecha de vencimiento; si hay más, se indica el número adicional.
- Las alertas solo se muestran en el panel del Tesorero, se recalculan al actualizar el panel y no crean navegación adicional.

### Filtros y ordenación

- Los filtros de asientos aplican a `date`, líneas (`cuenta_id`), totales y `status`; los de pagos aplican a `date`, asiento relacionado, `amount` y estado visible.
- Los rangos de fecha y monto son inclusivos; una entrada inválida muestra mensaje claro y no altera el listado.
- Los filtros se combinan con AND, se pueden limpiar y no persisten entre sesiones ni modifican registros.
- Ordenar tablas no muta entidades: se comparan fechas ISO como cronología, importes como enteros y estados según su orden definido.

## Precisión Monetaria y Validación de Totales

- `debit`, `credit`, `amount`, `totalDebit` y `totalCredit` se representan como **enteros en centavos** (`integer`), nunca como flotantes.
- La captura admite hasta 2 decimales y se convierte a centavos con aritmética decimal; se rechaza cualquier importe con más de 2 decimales. No se redondea silenciosamente.
- La validación de balance es por **igualdad exacta de enteros**:
  - `SUM(LineaAsiento.debit) = totalDebit`
  - `SUM(LineaAsiento.credit) = totalCredit`
  - `totalDebit = totalCredit`
- La tolerancia es `0`; no se aceptan diferencias por redondeo.
- Los totales se recalculan desde las líneas en cada alta o edición y se sobrescriben; no se confía en los valores enviados por el cliente.
- Los totales del `ResumenPagos` también se calculan sumando `Pago.amount` en centavos; la conversión a MXN ocurre solo al formatear.
- El MVP opera en una sola moneda (`MXN`) y no realiza conversión de moneda.

## Datos de Ejemplo y Estado Inicial

`DatosEjemplo` y `EstadoInicial` son contratos de configuración para las acciones del panel del Administrador financiero; no se persisten como entidades propias.

### DatosEjemplo (semilla determinista)

| Colección | Regla mínima | Condiciones adicionales |
|---|---|---|
| `periodos` | 4 | Consecutivos, sin solapamiento, al menos uno abierto |
| `cuentas` | 8 | Incluye cuentas hoja activas de ingreso y gasto |
| `asientos` | 8 | Todos en `aprobado`, balanceados, al menos uno por periodo |
| `pagos` | 4 | Al menos uno por periodo y al menos uno en cada estado visible `pendiente`, `pagado`, `vencido` |
| `entidades` y `documentos` | Los necesarios | Solo como apoyo contextual de asientos y pagos; IDs derivados de índices fijos |
| `usuarios` y `roles` | 4 / 4 | Se conservan de la semilla base de acceso; la carga no los duplica |
| `auditoria` | Los necesarios | Eventos deterministas de creación, edición y anulación sobre los movimientos sembrados; sin huérfanos ni marcas aleatorias |

- La semilla usa identificadores derivados de índices fijos y fechas literales; no incluye marcas de tiempo aleatorias.
- Cargar la semilla dos veces reemplaza periodos, cuentas, asientos, pagos y auditoría por copias idénticas.
- Los periodos cerrados de la semilla solo conservan movimientos históricos; la semilla no crea movimientos nuevos dentro de ellos.
- Después de cargar, paneles, listados, reportes y gráficas leen el mismo estado sin recálculos divergentes.

### EstadoInicial (restablecimiento)

- Colecciones financieras vacías: `cuentas`, `asientos`, `lineas`, `pagos`, `periodos`, `entidades` y `documentos` creados por el usuario.
- `auditoria` vuelve a su estado inicial determinista: sin eventos huérfanos y con eventos de ejemplo cuando la semilla los defina.
- Se conservan `usuarios` y `roles` exactamente como en la semilla de acceso.
- La sesión autenticada del Administrador financiero permanece válida; el restablecimiento no cierra sesión.
- No quedan referencias rotas ni totales incoherentes; los paneles muestran estados vacíos en español.

## Relaciones y Cardinalidades

La cardinalidad se lee como **A ↔ B**: cuántos A puede tener cada B y cuántos B puede tener cada A. Todas las FK del diagrama aparecen aquí y todas las relaciones de aquí aparecen en el diagrama.

| Relación | Cardinalidad | FK | Notas |
|---|---|---|---|
| Rol ← Usuario | 1 a 1..* | `Usuario.rol_id` | FK obligatoria; `RESTRICT` al eliminar el rol |
| Usuario ← Sesion | 1 a 0..1 | `Sesion.usuarioRut` | Como máximo una sesión activa por usuario en la demo; `RESTRICT` |
| Rol ← Sesion | 1 a 0..1 | `Sesion.rolId` | Copia del rol vigente; `RESTRICT` |
| Usuario ← RegistroActividad | 1 a 0..* | `RegistroActividad.usuarioRut` | FK obligatoria; `RESTRICT`; conserva nombre e identidad histórica |
| Rol ← RegistroActividad | 1 a 0..* | `RegistroActividad.rolId` | FK obligatoria; `RESTRICT`; conserva rol histórico |
| AsientoContable ↔ RegistroActividad | 0..1 a 0..* | `tipoMovimiento='asiento'` + `movimientoId` | Referencia lógica polimórfica; integridad resuelta en la capa central |
| Pago ↔ RegistroActividad | 0..1 a 0..* | `tipoMovimiento='pago'` + `movimientoId` | Referencia lógica polimórfica; integridad resuelta en la capa central |
| Entity ← Document | 1 a 0..* | `Document.entity_id` | Relación base; FK obligatoria. Al eliminar Entity, CASCADE sobre Document por regla del módulo 001 |
| Entity ← CuentaContable | 0..1 a 0..* | `CuentaContable.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← AsientoContable | 0..1 a 0..* | `AsientoContable.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← LineaAsiento | 0..1 a 0..* | `LineaAsiento.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← Pago | 1 a 0..* | `Pago.entity_id` | FK obligatoria; `RESTRICT` al eliminar la entidad |
| Document ← AsientoContable | 0..1 a 0..* | `AsientoContable.sourceDocumentId` | FK opcional; `RESTRICT` al eliminar el documento |
| Document ← Pago | — | — | Relación excluida del MVP por FR-015 |
| PeriodoContable ← AsientoContable | 1 a 0..* | `AsientoContable.period_id` | FK obligatoria; `RESTRICT` al eliminar el periodo |
| CuentaContable ← CuentaContable | 0..1 a 0..* | `CuentaContable.parent_id` | Autorreferencia padre/hijo; `RESTRICT` |
| CuentaContable ← LineaAsiento | 1 a 0..* | `LineaAsiento.cuenta_id` | FK obligatoria; `RESTRICT` |
| AsientoContable ← LineaAsiento | 1 a 2..* | `LineaAsiento.asiento_id` | FK obligatoria; CASCADE. Mermaid solo expresa 1..*; el mínimo 2 se valida en la aplicación |
| AsientoContable ← Pago | 0..1 a 0..1 | `Pago.asiento_id` | FK opcional y única; 1:1 opcional |

## Reglas de Eliminación e Integridad Referencial

Se mantiene la **anulación lógica** (`status = cancelado`) para asientos históricos. Los pagos no se eliminan físicamente después de confirmarse: cambian a `pagado` o se derivan como `vencido`. El borrado físico se reserva para asientos en `borrador`.

| FK | Al eliminar el padre | Justificación |
|---|---|---|
| `Usuario.rol_id → Rol.id` | `RESTRICT` | No se elimina un rol con usuarios asignados; los roles de la semilla son fijos |
| `Sesion.usuarioRut → Usuario.rut` | `RESTRICT` | Los usuarios de prueba se conservan; cerrar sesión elimina la sesión, no al usuario |
| `Sesion.rolId → Rol.id` | `RESTRICT` | La sesión necesita su copia de permisos; el rol no se elimina durante la demo |
| `RegistroActividad.usuarioRut → Usuario.rut` | `RESTRICT` | La auditoría debe conservar al responsable; los usuarios de prueba no se eliminan |
| `RegistroActividad.rolId → Rol.id` | `RESTRICT` | La auditoría debe conservar el rol vigente; los roles de la semilla no se eliminan |
| `RegistroActividad` ↔ asiento/pago | `RESTRICT` lógico | No se elimina físicamente un movimiento con eventos; se aplica anulación lógica para conservar la trazabilidad |
| `Document.entity_id → Entity.entity_id` | `CASCADE` (regla base) | Se conserva la regla del módulo 001; no se modifica. Los asientos y pagos se desvinculan con `SET NULL`/`RESTRICT` y no se borran por esta cascada |
| `CuentaContable.parent_id → CuentaContable.id` | `RESTRICT` | Evita cuentas hijas huérfanas y mantiene la jerarquía del plan |
| `CuentaContable.entity_id → Entity.entity_id` | `SET NULL` | La cuenta y su saldo histórico sobreviven; solo se pierde el auxiliar del tercero |
| `AsientoContable.period_id → PeriodoContable.id` | `RESTRICT` | No se borra un periodo con asientos; se cierra |
| `AsientoContable.sourceDocumentId → Document.id` | `RESTRICT` | Conserva la trazabilidad del asiento a su documento de origen; no se borra un documento con asientos asociados |
| `AsientoContable.entity_id → Entity.entity_id` | `SET NULL` | El asiento histórico sobrevive; el tercero es un auxiliar opcional |
| `LineaAsiento.asiento_id → AsientoContable.id` | `CASCADE` | Única cascada contable necesaria: una línea no existe sin su asiento. Solo aplica al borrado físico de asientos en `borrador` |
| `LineaAsiento.cuenta_id → CuentaContable.id` | `RESTRICT` | No se borra una cuenta con movimientos; se marca `inactiva` |
| `LineaAsiento.entity_id → Entity.entity_id` | `SET NULL` | La línea histórica sobrevive; el tercero es un auxiliar opcional |
| `Pago.entity_id → Entity.entity_id` | `RESTRICT` | Un pago siempre requiere un tercero; no se borra una entidad con pagos |
| ~~`Pago.document_id → Document.id`~~ | — | No aplica en el MVP; FR-015 excluye la asociación documento-pago |
| `Pago.asiento_id → AsientoContable.id` | `SET NULL` | El pago sobrevive si se borra físicamente un asiento en borrador; los asientos aprobados/cancelados no se borran |

- **Cascadas**: la única cascada contable nueva es `LineaAsiento.asiento_id`; `Document.entity_id` es una cascada heredada del módulo base. `Entity` y `Document` no borran asientos, líneas, cuentas ni pagos.
- **Conservación del historial**: las referencias opcionales usan `SET NULL`; las obligatorias usan `RESTRICT`. Así se evita perder registros contables al eliminar una `Entity` o un `Document`.
- **Ciclos de vida**: cuentas con movimientos o hijas se inactivan; periodos con asientos se cierran; asientos cancelados y pagos anulados se conservan. Los pagos pasan de `pendiente` a `pagado` y pueden derivarse como `vencido` sin borrarse.
- **Trazabilidad**: `RegistroActividad` es append-only; cualquier movimiento con eventos se anula lógicamente en lugar de borrarse físicamente.
- **Restablecimiento**: es la única operación que vacía colecciones financieras completas y reinicia la auditoría; lo ejecuta solo el Administrador financiero y conserva `Usuario` y `Rol`.

## Reglas de Balance (Partida Doble)

- **Balance por asiento**: `SUM(LineaAsiento.debit) = SUM(LineaAsiento.credit)` y `totalDebit = totalCredit`, con igualdad exacta de enteros en centavos y tolerancia `0`. Los totales se recalculan en cada escritura.
- **Saldo de cuenta**: `balance(cuenta) = SUM(debit de sus líneas) - SUM(credit de sus líneas)`; el saldo se interpreta según `normalBalance` (`debit` o `credit`).
- **Balance general**: en cualquier momento, `SUM(saldos de cuentas con normalBalance = debit) = SUM(saldos de cuentas con normalBalance = credit)`.
- Un asiento no se aprueba si no cumple balance exacto o si su periodo está cerrado.
- La semilla solo genera asientos que cumplen estas reglas antes de persistirse.

## Alcance MVP

No se elimina ninguna de las cinco entidades contables originales; se añaden `Usuario`, `Rol`, `Sesion` para el acceso simulado y `RegistroActividad` para la trazabilidad exigida por la HU16.

| Entidad | Alcance | Motivo |
|---|---|---|
| Usuario | MVP | HU8: credenciales ficticias y panel por rol |
| Rol | MVP | HU8 y HU9: permisos y panel de inicio |
| Sesion | MVP | HU8: autenticación local y cierre de sesión |
| RegistroActividad | MVP | HU16: trazabilidad inmutable de creación, edición y anulación |
| CuentaContable | MVP | Plan de cuentas necesario para clasificar los movimientos |
| AsientoContable | MVP | Cabecera del registro contable |
| LineaAsiento | MVP | Implementa la partida doble |
| PeriodoContable | MVP | `period_id` es obligatorio y controla periodos abiertos/cerrados |
| Pago | MVP | Tesorería/cobros/desembolsos y resumen por estado (HU4 y HU12) |

> Decisión confirmada: `Pago` forma parte del MVP (clarificación 2026-11-02).

## Decisiones Resueltas

- `AsientoContable.sourceDocumentId`: se adopta `RESTRICT` para conservar la trazabilidad (clarificación 2026-11-02).
- `Pago` forma parte del MVP (clarificación 2026-11-02).
- Moneda única `MXN` sin conversión (clarificación 2026-11-02).
- Sin solapamiento de periodos, abiertos o cerrados (clarificación 2026-11-02).
- La autenticación se simula con `Usuario`, `Rol` y `Sesion` en `sessionStorage`; no existe servicio externo (HU8).
- El RUT se normaliza para comparar; el mensaje de error es idéntico para RUT desconocido y contraseña incorrecta (HU8).
- Los permisos se ocultan en el menú en lugar de deshabilitarse; las secciones excluidas no tienen control de navegación (HU9 y HU11).
- La carga de semilla reemplaza el conjunto previo y el restablecimiento conserva usuarios y roles (HU10).
- `fechaVencimiento` es obligatoria y `vencido` es un estado derivado en lectura; no se almacena como valor independiente (HU12).
- Los cuatro estados financieros se calculan solo desde asientos aprobados; los saldos iniciales se derivan de periodos anteriores y no se persisten como snapshots (HU13).
- El cierre de periodos usa confirmación, permiso de Administrador financiero y bloqueo en la capa de escritura para todos los roles, sin reapertura en este alcance (HU14 y HU15).
- `RegistroActividad` es la entidad persistente de auditoría; no se persisten eventos en asientos/pagos ni se crea una sección nueva de menú (HU16).
- La anulación de pagos se modela con `anulado = true` y conserva el registro; no se usa `status = cancelado` (HU16).
- Las alertas de vencimientos son vistas derivadas del panel del Tesorero, con semanas de lunes a domingo y categorías mutuamente excluyentes (HU17).
- La identidad corporativa usa la constante `Comercial Los Andes SpA` y un logotipo ficticio en línea, sin configuración editable (HU18).
- La exportación comparte el modelo generado para la pantalla, es de solo lectura y no produce eventos de auditoría (HU19).
- Los filtros son estado local de cada listado, no una entidad ni una búsqueda global; el estado de pagos sustituye al control previo para evitar duplicidad (HU20).
- Paleta, íconos, ordenación, confirmaciones y menú móvil se derivan de configuración compartida y no alteran reglas financieras (HU21).

## Notas de Extensibilidad

- Los campos base de `Entity` y `Document` conservan sus nombres y semántica; este módulo solo añade registros propios y referencias por `entity_id` e `id` de documento.
- `ModuleConfig` puede renombrar términos (`labels`: asiento, cuenta, pago), añadir campos personalizados (`customFields` con `target: "document"` o `"entity"`) y definir el ciclo de vida de `status` para asientos y pagos (`statusLifecycle`).
- La numeración por serie y folio sigue la convención del módulo base; la numeración automática queda como punto de extensión de implementación.
- El cierre de ejercicio con reapertura, los comprobantes descargables en formatos adicionales y el ajuste por tipo de cambio son puntos de extensión posteriores; el cierre simple y los cuatro reportes financieros ya están en el MVP.
- `Rol.permisos` puede incorporar nuevas secciones sin cambiar la forma de `Usuario` ni de `Sesion`.
- Si el alcance deja de ser una demostración, `Usuario`/`Sesion` deben sustituirse por un proveedor de identidad real; el resto del modelo contable no depende de ese cambio.

## Vistas Derivadas (Historias de Usuario 7 a 21)

Estas vistas no introducen colecciones persistentes nuevas. Se calculan en memoria desde entidades persistidas o desde la configuración de la sesión.

### Panel y Gráficas (HU7)

| Vista derivada | Origen | Campos calculados | Regla de presentación |
|---|---|---|---|
| `SerieIngresosGastos` | `calcularResumen` agrupado por `period_id` | `periodo`, `ingresosCentavos`, `gastosCentavos` | Barras agrupadas; una barra por periodo y tipo |
| `SerieResultado` | `calcularResumen` agrupado por `period_id` | `periodo`, `resultadoCentavos` | Línea continua; punto por periodo |
| `DistribucionGastos` | `calcularSaldosCuentas` filtrado por el periodo seleccionado | `cuentaId`, `codigo`, `nombre`, `gastoCentavos`, `porcentaje` | Dona; segmentos ordenados de mayor a menor gasto |
| `EstadoVacioGraficas` | Ausencia de periodos, movimientos aprobados o gastos | `mensaje` | Texto en español en lugar de SVG vacío |

- Toda serie se deriva de importes en centavos y se convierte a MXN solo en la capa de formato compartida.
- `SerieResultado` debe cuadrar con `ingresosCentavos - gastosCentavos` del mismo periodo y con el total del reporte.
- `DistribucionGastos` excluye cuentas con saldo cero y solo considera asientos en estado `aprobado`.
- Cambiar el periodo recalcula las vistas derivadas sin mutar las entidades base.

### Paneles por Rol y Navegación (HU8, HU9, HU10, HU11)

| Vista derivada | Origen | Regla de presentación |
|---|---|---|
| `PanelInicio` | `Sesion.panelInicio` y `Sesion.permisos` | Administrador: resumen integral, periodos y asuntos prioritarios. Contador: cuentas, asientos y reportes. Tesorero: pagos, cobros y flujo de efectivo. Auditor: trazabilidad, reportes e historial |
| `OpcionMenu` | `Sesion.permisos[].visibleEnMenu` | Solo se renderizan las secciones permitidas; las no permitidas se ocultan |
| `DestinoNavegacion` | Mapa fijo pantalla → control | Cada pantalla tiene un único control visible: el del menú, salvo el panel inicial que se abre con el login |
| `ControlAccion` | `Sesion.permisos.datosDemo` y `cerrarSesion` | Cargar datos, restablecer datos y cerrar sesión son acciones del panel, no entradas de menú |
| `MensajeBloqueo` | Intento de abrir sección no permitida o eliminada | Muestra "Acceso no disponible" o "Sección no disponible" sin presentar contenido |

**Mapa de navegación única**:

| Pantalla | Único control que la abre | Roles con acceso |
|---|---|---|
| Panel de inicio del rol | Inicio de sesión correcto | Administrador financiero, Contador, Tesorero, Auditor |
| Cuentas contables | "Cuentas contables" en el menú | Administrador financiero, Contador |
| Asientos contables | "Asientos contables" en el menú | Administrador financiero, Contador |
| Pagos y cobros | "Pagos y cobros" en el menú | Administrador financiero, Tesorero |
| Periodos contables | "Periodos contables" en el menú | Administrador financiero |
| Reportes financieros | "Reportes financieros" en el menú | Administrador financiero, Contador, Auditor |
| Entidades | Sin control de navegación | Ninguno |
| Documentos | Sin control de navegación | Ninguno |
| Búsqueda | Sin control de navegación | Ninguno |

### Resumen de Pagos (HU12)

| Vista derivada | Origen | Campos calculados | Regla de presentación |
|---|---|---|---|
| `EstadoPago` | `Pago.status`, `Pago.fechaVencimiento` y fecha actual | `pagado` si `status = pagado`; `vencido` si `status = pendiente` y `fechaVencimiento < hoy`; `pendiente` en caso contrario | Clasificación derivada en lectura; el resumen y el filtro usan siempre esta misma función |
| `ResumenPagos` | Agrupación de `Pago` por `EstadoPago` | `estado`, `cantidad`, `totalCentavos` | Muestra simultáneamente pendiente, pagado y vencido, con ceros y mensaje de estado vacío cuando no hay pagos |
| `FiltroEstadoPago` | Selección del usuario | `todos`, `pendiente`, `pagado`, `vencido` | Actualiza el listado de inmediato; resalta el estado elegido sin ocultar los otros totales |
| `ListadoPagosFiltrado` | `Pago[]` filtrado por `FiltroEstadoPago` | Registros visibles | Mensaje específico cuando el filtro no produzca resultados |

- El resumen y el filtro viven dentro de "Pagos y cobros"; no crean menú ni botón de navegación adicional.
- Solo Administrador financiero y Tesorero ven el resumen y el filtro, porque son los roles con acceso a pagos.
- Las cantidades y totales del resumen deben coincidir exactamente con el listado filtrado.
- Los importes se suman en centavos y se formatean en MXN con la utilidad compartida.

### Estados Financieros (HU13)

| Vista derivada | Origen | Campos calculados | Regla de presentación |
|---|---|---|---|
| `SaldoContable` | `LineaAsiento` de asientos aprobados hasta una fecha límite | `cuentaId`, `debitCentavos`, `creditCentavos`, `saldoCentavos` | Saldo inicial usa movimientos anteriores al periodo; saldo final incluye el periodo |
| `LibroMayor` | `SaldoContable` y movimientos del periodo | `codigo`, `nombre`, `saldoInicial`, `debitos`, `creditos`, `saldoFinal` | Solo cuentas con movimientos o saldo;MXN y orden por código |
| `BalanceComprobacion` | `SaldoContable` al cierre | `cuenta`, `saldoDeudor`, `saldoAcreedor`, `totalDeudor`, `totalAcreedor` | Excluye saldo cero; advierte si los totales no coinciden |
| `EstadoResultados` | `SaldoContable` de cuentas `ingreso` y `gasto` | `ingresos`, `gastos`, `resultado` | `resultado = ingresos - gastos`; advierte si una cuenta no tiene tipo válido |
| `BalanceGeneral` | `SaldoContable` de `activo`, `pasivo` y `patrimonio` | `activos`, `pasivos`, `patrimonio`, `resultadoAcumulado` | Incluye el resultado acumulado en patrimonio; advierte si no cuadra |

- Los reportes son de solo lectura y no permiten capturar cifras manualmente ni modificar movimientos.
- Los periodos cerrados se consultan sin cambiar su estado; la selección de otro periodo recalcula las cinco vistas.
- Las advertencias son mensajes en español y bloquean la exportación cuando una igualdad contable no se cumple.

### Cierre de Periodo (HU14 y HU15)

| Vista derivada | Origen | Regla de presentación |
|---|---|---|
| `CierrePeriodo` | Acción confirmada sobre `PeriodoContable` | Solo Administrador financiero; cambia `status` a `cerrado` y `updatedAt` |
| `MensajePeriodoCerrado` | Intento de escribir en un periodo cerrado | Mensaje claro en español; bloquea guardado original y destino |
| `ListadoPeriodoCerrado` | `PeriodoContable.status = cerrado` | Muestra el estado y oculta acciones de modificación para todos los roles |

- El bloqueo se aplica a crear, editar, eliminar, anular y cambiar fecha de asientos y pagos, incluido el Administrador financiero.
- La validación se ejecuta contra el estado vigente al guardar, por lo que un formulario abierto antes del cierre no puede escribir después.
- Los reportes y listados de periodos cerrados siguen disponibles para los roles autorizados.

### Trazabilidad (HU16)

| Vista derivada | Origen | Regla de presentación |
|---|---|---|
| `HistorialAuditoria` | `RegistroActividad` filtrado por `tipoMovimiento` y `movimientoId` | Eventos en orden cronológico descendente |
| `RegistroConsolidado` | `RegistroActividad` de asientos y pagos | Consulta de solo lectura dentro de "Reportes financieros", solo para Auditor |
| `FiltroAuditoria` | Selección del Auditor | Filtra por tipo de movimiento, acción y usuario; sin búsqueda global |
| `EstadoVacioAuditoria` | Ausencia de eventos o sin coincidencias | Mensaje en español; nunca inventa eventos |

- El detalle de cada movimiento ofrece su historial sin duplicar la consulta consolidada como opción de menú.
- Los roles distintos del Auditor reciben "Acceso no disponible" y no ven eventos.

### Alertas de Vencimientos (HU17)

| Vista derivada | Origen | Campos calculados | Regla de presentación |
|---|---|---|---|
| `SemanaReferencia` | Fecha de referencia del panel | `inicioLunes`, `finDomingo` | Define el rango de la alerta semanal |
| `AlertaPago` | `Pago` pendiente no anulado y `fechaVencimiento` | `categoria`, `cantidad`, `totalCentavos`, `detalles[]` | `vencido` o `venceEstaSemana`, sin duplicar pagos |
| `ResumenAlerta` | `AlertaPago` | `cantidad`, `totalMXN`, `adicionales` | Hasta tres detalles y contador de pagos restantes |
| `PanelTesorero` | `Sesion.rolId = tesorero` y alertas | Bloques informativos | Sin `data-action`, sin enlaces y sin nueva opción de menú |

- Las alertas se recalculan al iniciar sesión, al volver al panel y al actualizar pagos.
- Los importes y fechas usan los formateadores compartidos y coinciden con "Pagos y cobros".

### Identidad Corporativa y Exportación (HU18 y HU19)

| Vista derivada | Origen | Regla de presentación |
|---|---|---|
| `IdentidadCorporativa` | Constante `NOMBRE_EMPRESA = "Comercial Los Andes SpA"` y logotipo ficticio en línea | Presente en el encabezado de todas las pantallas posteriores al acceso |
| `ModeloExportacion` | Reporte activo, periodo y utilidades compartidas | Único origen para pantalla, PDF y Excel: empresa, periodo, fecha de generación, filas, totales y estado vacío |
| `ArchivoReporte` | `ModeloExportacion` y generador vanilla | Descarga con `Blob`/`URL.createObjectURL`; nombre `Comercial-Los-Andes-SpA_<reporte>_<periodo>.{pdf,xls}` |
| `TotalesReporte` | Cálculo del reporte | Deben coincidir exactamente entre pantalla y archivo; exportación bloqueada si el reporte no cuadra |

- La identidad corporativa no sustituye el título de la pantalla ni aparece como opción de menú.
- Si falta el logotipo, se conserva el nombre y una referencia visual clara.
- Exportar no muta filtros, periodos, datos ni auditoría.

### Filtros, Interfaz y Accesibilidad (HU20 y HU21)

| Vista derivada | Origen | Regla de presentación |
|---|---|---|
| `FiltroMovimientos` | Entrada local del usuario | `fechaDesde`, `fechaHasta`, `cuentaId`, `montoDesde`, `montoHasta`, `estado`; combinación AND y límites inclusivos |
| `ListadoFiltrado` | Entidades del listado y `FiltroMovimientos` | Solo registros visibles para el rol; mensaje específico cuando no hay resultados |
| `OrdenTabla` | Columna seleccionada y sentido | Comparadores por fecha ISO, centavos y estado; no muta entidades |
| `PaletaColores` e `IconoSeccion` | `src/contabilidad/interfaz-config.js` | Mismos tokens e íconos en menú, encabezados, mensajes y tablas |
| `MensajeConfirmacion` | Guardado o eliminación permitida | Confirmación antes de borrar, mensaje de éxito después de guardar/borrar y ningún mensaje de éxito en fallos |
| `MenuAdaptable` | `OpcionMenu` y CSS responsive | Mismas secciones por rol en escritorio y celular; se cierra al navegar |

- Los filtros y la ordenación son estado de vista; no se persisten y no sustituyen los permisos.
- La interfaz no crea nuevas opciones de menú, no modifica reglas financieras y mantiene el texto visible junto al ícono.

## Decisiones de Persistencia Actualizadas

- El mecanismo por defecto es `sessionStorage` para todas las colecciones del módulo, incluidas `Usuario`, `Rol`, `Sesion`, `RegistroActividad` y las estructuras base `Entity`/`Document` que utilice el módulo.
- No se persisten agregaciones, gráficas, alertas, filtros, ordenación de tablas, modelos de exportación, permisos derivados ni estados de pago calculados; se recomputan desde el estado de la sesión.
- `RegistroActividad` se persiste como colección append-only con `CLAVES.auditoria` y se reinicia de forma determinista con la semilla.
- La migración desde `localStorage` y las garantías de integridad referencial quedan trazadas en `tasks.md` como T117.
