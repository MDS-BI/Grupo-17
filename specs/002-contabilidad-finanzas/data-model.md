# Modelo de Datos: Módulo de Contabilidad y Finanzas

**Especificación base**: [001-erp-base-module/data-model.md](../001-erp-base-module/data-model.md) (no se modifica)
**Diagrama ER**: [er-diagram.md](er-diagram.md)

## Resumen

Este módulo añade contabilidad por partida doble sobre el módulo base. Reutiliza `Entity` (terceros: clientes, proveedores, bancos), `Document` (documentos de origen, p. ej., facturas) y `ModuleConfig` (etiquetas y ciclo de vida), y agrega siete entidades persistentes: `CuentaContable`, `AsientoContable`, `LineaAsiento`, `Pago`, `PeriodoContable`, `Usuario` y `Rol`, además de una `Sesion` activa como máximo.

`Usuario` identifica a los cuatro usuarios de prueba mediante RUT, contraseña y rol. `Rol` define el panel de inicio, la matriz de `permisos` y las acciones globales disponibles. Las Historias de Usuario 8 a 12 también introducen conceptos derivados que no se persisten como colecciones independientes: `PermisoRol`, `OpcionMenu`, `PanelInicio`, `DatosEjemplo`, `EstadoInicial`, `DestinoNavegacion`, `ControlAccion`, `EstadoPago` y `ResumenPagos`.

Cada movimiento económico se registra como un asiento con dos o más líneas cuyos débitos y créditos deben sumar igual (partida doble). Un `Document` puede originar un asiento; un `Pago` puede generar y referenciar su asiento en el libro mayor. Todo importe se almacena como entero en centavos y se formatea en MXN solo en la capa de presentación.

## Entidades Base Reutilizadas

| Entidad base | Papel en este módulo |
|---|---|
| Entity | Tercero o auxiliar: cliente, proveedor, banco, acreedor. `entity_id` se usa como FK auxiliar en cuentas, líneas y pagos; se selecciona de forma contextual dentro de los formularios permitidos, sin sección navegable propia |
| Document | Documento origen que genera asientos y pagos (p. ej., factura de venta o compra). Se referencia mediante `sourceDocumentId` o `document_id`; se selecciona de forma contextual, sin sección navegable propia |
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
| document_id | string | FK → Document (`id`) | Documento que se liquida con el pago | Opcional; debe referenciar un documento existente; SET NULL al eliminar el documento |
| asiento_id | string | FK, UK → AsientoContable (`id`) | Asiento generado por el pago (1:1 opcional) | Opcional, único; debe referenciar un asiento existente; SET NULL al eliminar el asiento |
| amount | integer | — | Importe pagado en la moneda configurada, en centavos | Obligatorio, entero mayor que cero |
| currency | string | — | Código de moneda; en el MVP siempre `MXN` | Obligatorio en el MVP; valor fijo `MXN` |
| method | string | — | Medio de pago: `efectivo`, `transferencia`, `cheque`, `tarjeta` | Opcional, valor del conjunto cerrado |
| status | string | — | Estado operativo: `pendiente`, `pagado` | Obligatorio en el MVP. `vencido` no se captura: se deriva en `EstadoPago` cuando un pendiente supera `fechaVencimiento` |
| notes | string | — | Notas u observaciones libres | Opcional |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

> Migración de estados: los valores heredados `aplicado` se normalizan a `pagado`. No se conserva `cancelado` en el MVP porque FR-092 exige clasificar cada pago/cobro como `pendiente`, `pagado` o `vencido`; un movimiento que ya no deba ejecutarse se mantiene como `pendiente` y se muestra como `vencido` cuando corresponda, o se elimina solo antes de la confirmación.

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
- `entity_id`, `document_id` y `asiento_id`, cuando existen, deben referenciar registros existentes.
- `numero` es único; `folio` es un entero positivo único en combinación `(series, folio)`, con `series` vacía normalizada a cadena vacía.
- `asiento_id` es único: un pago genera o referencia como mucho un asiento y un asiento corresponde como mucho a un pago (1:1 opcional).
- `status` solo admite `pendiente` o `pagado`. El estado visible `vencido` se calcula; nunca se almacena como valor independiente para evitar desincronización con la fecha actual.
- Marcar un pago como pagado cambia `status` a `pagado` y conserva el registro en el resumen y en el listado.
- Un pago no se elimina físicamente una vez confirmado; las operaciones de restablecimiento limpian la colección completa de forma atómica.

### Periodo contable

- `startDate` y `endDate` deben ser fechas válidas con `endDate >= startDate`.
- No se permite que dos periodos se solapen, independientemente de su estado (abierto o cerrado).
- Un periodo con asientos no se elimina: se cierra (`status = cerrado`). El borrado está restringido por `AsientoContable.period_id`.

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

- La semilla usa identificadores derivados de índices fijos y fechas literales; no incluye marcas de tiempo aleatorias.
- Cargar la semilla dos veces reemplaza periodos, cuentas, asientos y pagos por copias idénticas.
- Después de cargar, paneles, listados, reportes y gráficas leen el mismo estado sin recálculos divergentes.

### EstadoInicial (restablecimiento)

- Colecciones financieras vacías: `cuentas`, `asientos`, `lineas`, `pagos`, `periodos`, `entidades` y `documentos` creados por el usuario.
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
| Entity ← Document | 1 a 0..* | `Document.entity_id` | Relación base; FK obligatoria. Al eliminar Entity, CASCADE sobre Document por regla del módulo 001 |
| Entity ← CuentaContable | 0..1 a 0..* | `CuentaContable.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← AsientoContable | 0..1 a 0..* | `AsientoContable.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← LineaAsiento | 0..1 a 0..* | `LineaAsiento.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← Pago | 1 a 0..* | `Pago.entity_id` | FK obligatoria; `RESTRICT` al eliminar la entidad |
| Document ← AsientoContable | 0..1 a 0..* | `AsientoContable.sourceDocumentId` | FK opcional; `RESTRICT` al eliminar el documento |
| Document ← Pago | 0..1 a 0..* | `Pago.document_id` | FK opcional; SET NULL al eliminar el documento |
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
| `Pago.document_id → Document.id` | `SET NULL` | El pago sobrevive al borrar el documento liquidado |
| `Pago.asiento_id → AsientoContable.id` | `SET NULL` | El pago sobrevive si se borra físicamente un asiento en borrador; los asientos aprobados/cancelados no se borran |

- **Cascadas**: la única cascada contable nueva es `LineaAsiento.asiento_id`; `Document.entity_id` es una cascada heredada del módulo base. `Entity` y `Document` no borran asientos, líneas, cuentas ni pagos.
- **Conservación del historial**: las referencias opcionales usan `SET NULL`; las obligatorias usan `RESTRICT`. Así se evita perder registros contables al eliminar una `Entity` o un `Document`.
- **Ciclos de vida**: cuentas con movimientos o hijas se inactivan; periodos con asientos se cierran; asientos cancelados se conservan. Los pagos pasan de `pendiente` a `pagado` y pueden derivarse como `vencido` sin borrarse.
- **Restablecimiento**: es la única operación que vacía colecciones financieras completas; lo ejecuta solo el Administrador financiero y conserva `Usuario` y `Rol`.

## Reglas de Balance (Partida Doble)

- **Balance por asiento**: `SUM(LineaAsiento.debit) = SUM(LineaAsiento.credit)` y `totalDebit = totalCredit`, con igualdad exacta de enteros en centavos y tolerancia `0`. Los totales se recalculan en cada escritura.
- **Saldo de cuenta**: `balance(cuenta) = SUM(debit de sus líneas) - SUM(credit de sus líneas)`; el saldo se interpreta según `normalBalance` (`debit` o `credit`).
- **Balance general**: en cualquier momento, `SUM(saldos de cuentas con normalBalance = debit) = SUM(saldos de cuentas con normalBalance = credit)`.
- Un asiento no se aprueba si no cumple balance exacto o si su periodo está cerrado.
- La semilla solo genera asientos que cumplen estas reglas antes de persistirse.

## Alcance MVP

No se elimina ninguna de las cinco entidades contables originales; se añaden `Usuario`, `Rol` y `Sesion` para el acceso simulado.

| Entidad | Alcance | Motivo |
|---|---|---|
| Usuario | MVP | HU8: credenciales ficticias y panel por rol |
| Rol | MVP | HU8 y HU9: permisos y panel de inicio |
| Sesion | MVP | HU8: autenticación local y cierre de sesión |
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

## Notas de Extensibilidad

- Los campos base de `Entity` y `Document` conservan sus nombres y semántica; este módulo solo añade registros propios y referencias por `entity_id` e `id` de documento.
- `ModuleConfig` puede renombrar términos (`labels`: asiento, cuenta, pago), añadir campos personalizados (`customFields` con `target: "document"` o `"entity"`) y definir el ciclo de vida de `status` para asientos y pagos (`statusLifecycle`).
- La numeración por serie y folio sigue la convención del módulo base; la numeración automática queda como punto de extensión de implementación.
- El cierre de ejercicio, los comprobantes de reportes (balance general, estado de resultados) y el ajuste por tipo de cambio son puntos de extensión posteriores.
- `Rol.permisos` puede incorporar nuevas secciones sin cambiar la forma de `Usuario` ni de `Sesion`.
- Si el alcance deja de ser una demostración, `Usuario`/`Sesion` deben sustituirse por un proveedor de identidad real; el resto del modelo contable no depende de ese cambio.

## Vistas Derivadas (Historias de Usuario 7 a 12)

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

## Decisiones de Persistencia Actualizadas

- El mecanismo por defecto es `sessionStorage` para todas las colecciones del módulo, incluidas `Usuario`, `Rol`, `Sesion` y las estructuras base `Entity`/`Document` que utilice el módulo.
- No se persisten agregaciones, gráficas, permisos derivados ni estados de pago calculados; se recomputan desde el estado de la sesión.
- La migración desde `localStorage` y las garantías de integridad referencial quedan trazadas en `tasks.md` como T063 y T064.
