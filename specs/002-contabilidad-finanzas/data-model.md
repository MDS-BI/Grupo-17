# Modelo de Datos: Módulo de Contabilidad y Finanzas

**Especificación base**: [001-erp-base-module/data-model.md](../001-erp-base-module/data-model.md) (no se modifica)
**Diagrama ER**: [er-diagram.md](er-diagram.md)

## Resumen

Este módulo añade contabilidad por partida doble sobre el módulo base. Reutiliza `Entity` (terceros: clientes, proveedores, bancos), `Document` (documentos de origen, p. ej., facturas) y `ModuleConfig` (etiquetas y ciclo de vida), y agrega cinco entidades nuevas: `CuentaContable`, `AsientoContable`, `LineaAsiento`, `Pago` y `PeriodoContable`.

Cada movimiento económico se registra como un asiento con dos o más líneas cuyos débitos y créditos deben sumar igual (partida doble). Un documento o un pago pueden generar el asiento correspondiente en el libro mayor.

## Entidades Base Reutilizadas

| Entidad base | Papel en este módulo |
|---|---|
| Entity | Tercero o auxiliar: cliente, proveedor, banco, acreedor. `entity_id` se usa como FK auxiliar en cuentas, líneas y pagos |
| Document | Documento origen que genera asientos y pagos (p. ej., factura de venta o compra). Se referencia mediante `sourceDocumentId` |
| ModuleConfig | Adaptación del módulo: `labels` (p. ej., `document: "Factura"`), `customFields` y `statusLifecycle` de asientos y pagos |

## Entidad: CuentaContable (plan de cuentas)

Catálogo jerárquico de cuentas del libro mayor. Cada cuenta acumula el saldo resultante de las líneas de asiento que la referencian.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único de la cuenta | Obligatorio, generado automáticamente |
| code | string | — | Código contable ordenable (p. ej., `1010`, `1.01.01`) | Obligatorio, no vacío, único en el plan |
| name | string | — | Nombre de la cuenta (p. ej., Caja, Bancos, Ventas) | Obligatorio, no vacío |
| type | string | — | Tipo de cuenta que define el saldo normal: `activo`, `pasivo`, `patrimonio`, `ingreso`, `gasto` | Obligatorio, valor del conjunto cerrado |
| parent_id | string | FK → CuentaContable | Cuenta padre para la jerarquía | Opcional; debe referenciar una cuenta existente; no debe formar ciclos |
| isLeaf | boolean | — | Indica si la cuenta admite líneas de asiento | Obligatorio; solo las cuentas hoja (`true`) reciben líneas |
| entity_id | string | FK → Entity (`entity_id`) | Auxiliar del tercero cuando la cuenta es de detalle (p. ej., cuenta por cobrar de un cliente) | Opcional |
| normalBalance | string | — | Saldo normal derivado de `type`: `debit` para activo/gasto, `credit` para pasivo/patrimonio/ingreso | Obligatorio, derivado, solo lectura |
| status | string | — | Estado de la cuenta: `activa`, `inactiva` | Opcional, texto libre o ciclo de vida por ModuleConfig |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Entidad: AsientoContable (cabecera de asiento)

Cabecera de un registro contable en el diario. Agrupa las líneas, fija fecha y periodo, y almacena los totales para verificación de balance.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único del asiento | Obligatorio, generado automáticamente |
| series | string | — | Serie del asiento (p. ej., `AJ`, `DI`) que agrupa folios consecutivos | Opcional |
| folio | number | — | Folio consecutivo; con la serie forma el número oficial (`DI-1001`) | Obligatorio, entero positivo, único por serie |
| date | string | — | Fecha del asiento en formato YYYY-MM-DD | Obligatorio, fecha de calendario válida, dentro de un periodo abierto |
| period_id | string | FK → PeriodoContable | Periodo contable al que pertenece el asiento | Obligatorio, debe referenciar un periodo existente |
| concept | string | — | Glosa o descripción del asiento | Obligatorio, no vacío |
| sourceDocumentType | string | — | Tipo de documento origen: `document` u otro módulo | Opcional; requerido cuando se usa `sourceDocumentId` |
| sourceDocumentId | string | FK → Document (`id`) | Documento base que origina el asiento | Opcional; debe referenciar un documento existente |
| entity_id | string | FK → Entity (`entity_id`) | Tercero relacionado con el asiento | Opcional |
| totalDebit | number | — | Suma de los débitos de sus líneas | Obligatorio, número no negativo, igual a `totalCredit` |
| totalCredit | number | — | Suma de los créditos de sus líneas | Obligatorio, número no negativo, igual a `totalDebit` |
| currency | string | — | Código de moneda de los importes (p. ej., MXN, USD) | Opcional |
| status | string | — | Estado: `borrador`, `aprobado`, `cancelado` | Opcional; si ModuleConfig define `statusLifecycle`, se aplica ese ciclo |
| notes | string | — | Notas u observaciones libres | Opcional |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Entidad: LineaAsiento (línea de asiento)

Movimiento individual de un asiento contra una cuenta del plan. Implementa la regla de partida doble: cada línea lleva el monto en débito o en crédito, nunca en ambos.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único de la línea | Obligatorio, generado automáticamente |
| asiento_id | string | FK → AsientoContable (`id`) | Asiento al que pertenece la línea | Obligatorio, debe referenciar un asiento existente; se elimina en cascada con su asiento |
| cuenta_id | string | FK → CuentaContable (`id`) | Cuenta afectada por el movimiento | Obligatorio, debe referenciar una cuenta hoja `isLeaf = true` y `status = activa` |
| concept | string | — | Glosa de la línea (hereda la del asiento si está vacía) | Opcional |
| debit | number | — | Importe en débito | Opcional, número no negativo; exactamente uno de `debit` o `credit` debe ser mayor que cero |
| credit | number | — | Importe en crédito | Opcional, número no negativo; exactamente uno de `debit` o `credit` debe ser mayor que cero |
| entity_id | string | FK → Entity (`entity_id`) | Auxiliar del tercero en la línea (p. ej., factura de un cliente) | Opcional |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Entidad: Pago (registro de cobro o desembolso)

Movimiento financiero de dinero contra un tercero: cobro a un cliente o pago a un proveedor. Opcionalmente genera el asiento contable correspondiente.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único del pago | Obligatorio, generado automáticamente |
| numero | string | — | Número oficial del pago derivado de serie y folio | Obligatorio, no vacío, único |
| series | string | — | Serie del pago (p. ej., `COB`, `PAG`) | Opcional |
| folio | number | — | Folio consecutivo del pago | Obligatorio, entero positivo, único por serie |
| date | string | — | Fecha del pago en formato YYYY-MM-DD | Obligatorio, fecha de calendario válida |
| entity_id | string | FK → Entity (`entity_id`) | Tercero pagado o que realiza el cobro | Obligatorio, debe referenciar una entidad existente |
| document_id | string | FK → Document (`id`) | Documento que se liquida con el pago | Opcional; debe referenciar un documento existente |
| asiento_id | string | FK → AsientoContable (`id`) | Asiento generado por el pago | Opcional; debe referenciar un asiento existente |
| amount | number | — | Importe pagado en la moneda configurada | Obligatorio, número mayor que cero |
| currency | string | — | Código de moneda (p. ej., MXN, USD) | Opcional |
| method | string | — | Medio de pago: `efectivo`, `transferencia`, `cheque`, `tarjeta` | Opcional, valor del conjunto cerrado |
| status | string | — | Estado: `pendiente`, `aplicado`, `cancelado` | Opcional; si ModuleConfig define `statusLifecycle`, se aplica ese ciclo |
| notes | string | — | Notas u observaciones libres | Opcional |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Entidad: PeriodoContable (periodo fiscal)

Ventana de tiempo (mes, trimestre o año) en la que se registran asientos. Los asientos no pueden crearse en periodos cerrados.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único del periodo | Obligatorio, generado automáticamente |
| name | string | — | Nombre visible (p. ej., `2026-01`, Enero 2026) | Obligatorio, no vacío, único |
| startDate | string | — | Fecha de inicio en formato YYYY-MM-DD | Obligatorio, fecha de calendario válida |
| endDate | string | — | Fecha de fin en formato YYYY-MM-DD | Obligatorio, válida y igual o posterior a `startDate` |
| status | string | — | Estado: `abierto`, `cerrado` | Obligatorio, valor del conjunto cerrado |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Reglas de Validación

### Cuenta contable

- Un `code` y un `name` no vacíos son obligatorios; el código es único en el plan.
- `type` debe pertenecer al conjunto `activo`, `pasivo`, `patrimonio`, `ingreso`, `gasto`; `normalBalance` se deriva de él.
- `parent_id`, cuando existe, debe apuntar a una cuenta existente y no debe crear ciclos.
- Solo cuentas hoja (`isLeaf = true`) y activas pueden recibir líneas de asiento.

### Asiento contable

- Un asiento debe incluir `folio` entero positivo; con `series` forma el número oficial (p. ej., `DI-1001`).
- Un asiento debe incluir al menos dos líneas.
- La suma de `debit` debe ser exactamente igual a la suma de `credit` en todas sus líneas; los totales se recalculan y se almacenan en `totalDebit` y `totalCredit`.
- Cada línea debe llevar importe en débito o en crédito, nunca ambos ni ninguno (el monto debe ser mayor que cero en uno de los dos).
- La fecha debe caer dentro de un `PeriodoContable` con `status = abierto`; los periodos cerrados rechazan asientos nuevos o modificaciones.
- Un asiento con `sourceDocumentId` debe referenciar un `Document` existente.
- Un asiento `aprobado` no admite cambios en sus líneas; `cancelado` debe conservar su registro para auditoría (anulación lógica, no borrado físico).
- Eliminar un asiento elimina en cascada sus líneas.

### Línea de asiento

- `asiento_id` y `cuenta_id` deben referenciar registros existentes; `cuenta_id` debe ser una cuenta hoja y activa.
- Exactamente uno de `debit` o `credit` debe ser mayor que cero; el otro debe ser cero o ausente.
- Los importes deben ser números no negativos.

### Pago

- `numero`, `date`, `entity_id` y `amount` son obligatorios; `amount` debe ser mayor que cero.
- `entity_id`, `document_id` y `asiento_id`, cuando existen, deben referenciar registros existentes.
- `folio` debe ser un entero positivo único por serie.

### Periodo contable

- `startDate` y `endDate` deben ser fechas válidas con `endDate >= startDate`.
- No se permite que dos periodos abiertos se solapen.

## Relaciones y Cardinalidades

| Relación | Cardinalidad | Notas |
|---|---|---|
| Entity ← AsientoContable | 1 a 0..* | Un tercero puede tener muchos asientos; un asiento referencia como mucho un tercero |
| Entity ← LineaAsiento | 1 a 0..* | Auxiliar por línea para reportes por tercero |
| Entity ← Pago | 1 a * | Un tercero tiene muchos pagos; todo pago obliga a un tercero |
| Entity ← CuentaContable | 1 a 0..* | Cuentas auxiliares vinculadas a un tercero |
| Document ← AsientoContable | 1 a 0..* | Un documento puede generar varios asientos (factura, devolución, ajuste); un asiento como mucho proviene de un documento |
| Document ← Pago | 1 a 0..* | Un documento puede pagarse en varias parcialidades |
| CuentaContable ← CuentaContable | 1 a 0..* | Autorreferencia padre/hijo (`parent_id`); las hojas reciben líneas |
| CuentaContable ← LineaAsiento | 1 a * | Una cuenta acumula muchas líneas; toda línea apunta a una cuenta |
| AsientoContable ← LineaAsiento | 1 a * | Un asiento tiene dos o más líneas; toda línea pertenece a un asiento |
| AsientoContable ← Pago | 1 a 0..* | Un asiento puede corresponder a un pago; un pago genera como mucho un asiento |
| PeriodoContable ← AsientoContable | 1 a * | Todo asiento cae en exactamente un periodo |

## Reglas de Balance (Partida Doble)

- **Balance por asiento**: `SUM(linea.debit) = SUM(linea.credit)` en todo asiento; los totales se persisten en `totalDebit` y `totalCredit` para verificación rápida y se recalculan en cada escritura.
- **Saldo de cuenta**: `balance(cuenta) = SUM(debit de sus líneas) - SUM(credit de sus líneas)`; el saldo se interpreta según `normalBalance` (`debit` o `credit`).
- **Balance general**: en cualquier momento, `SUM(saldos de cuentas con normalBalance = debit) = SUM(saldos de cuentas con normalBalance = credit)`.
- Un asiento no se aprueba si no cumple balance o si su periodo está cerrado.

## Notas de Extensibilidad

- Los campos base de `Entity` y `Document` conservan sus nombres y semántica; este módulo solo añade registros propios y referencias por `entity_id` e `id` de documento.
- `ModuleConfig` puede renombrar términos (`labels`: asiento, cuenta, pago), añadir campos personalizados (`customFields` con `target: "document"` o `"entity"`) y definir el ciclo de vida de `status` para asientos y pagos (`statusLifecycle`).
- La numeración por serie y folio sigue la convención del módulo base; la numeración automática queda como punto de extensión de implementación.
- El cierre de ejercicio, los comprobantes de reportes (balance general, estado de resultados) y el ajuste por tipo de cambio son puntos de extensión posteriores.
