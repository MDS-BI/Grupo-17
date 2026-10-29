# Modelo de Datos: Módulo de Contabilidad y Finanzas

**Especificación base**: [001-erp-base-module/data-model.md](../001-erp-base-module/data-model.md) (no se modifica)
**Diagrama ER**: [er-diagram.md](er-diagram.md)

## Resumen

Este módulo añade contabilidad por partida doble sobre el módulo base. Reutiliza `Entity` (terceros: clientes, proveedores, bancos), `Document` (documentos de origen, p. ej., facturas) y `ModuleConfig` (etiquetas y ciclo de vida), y agrega cinco entidades nuevas: `CuentaContable`, `AsientoContable`, `LineaAsiento`, `Pago` y `PeriodoContable`.

Cada movimiento económico se registra como un asiento con dos o más líneas cuyos débitos y créditos deben sumar igual (partida doble). Un `Document` puede originar un asiento; un `Pago` puede generar y referenciar su asiento en el libro mayor.

## Entidades Base Reutilizadas

| Entidad base | Papel en este módulo |
|---|---|
| Entity | Tercero o auxiliar: cliente, proveedor, banco, acreedor. `entity_id` se usa como FK auxiliar en cuentas, líneas y pagos |
| Document | Documento origen que genera asientos y pagos (p. ej., factura de venta o compra). Se referencia mediante `sourceDocumentId` |
| ModuleConfig | Adaptación del módulo: `labels` (p. ej., `document: "Factura"`), `customFields` y `statusLifecycle` de asientos y pagos |

## Entidad: CuentaContable (plan de cuentas) — MVP

Catálogo jerárquico de cuentas del libro mayor. Cada cuenta acumula el saldo resultante de las líneas de asiento que la referencian.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único de la cuenta | Obligatorio, generado automáticamente |
| code | string | UK | Código contable ordenable (p. ej., `1010`, `1.01.01`) | Obligatorio, no vacío, único en el plan |
| name | string | — | Nombre de la cuenta (p. ej., Caja, Bancos, Ventas) | Obligatorio, no vacío |
| type | string | — | Tipo de cuenta que define el saldo normal: `activo`, `pasivo`, `patrimonio`, `ingreso`, `gasto` | Obligatorio, valor del conjunto cerrado |
| parent_id | string | FK → CuentaContable | Cuenta padre para la jerarquía | Opcional; debe referenciar una cuenta existente; no debe formar ciclos. Al eliminar la cuenta padre se aplica RESTRICT |
| isLeaf | boolean | — | Indica si la cuenta admite líneas de asiento | Obligatorio; solo las cuentas hoja (`true`) reciben líneas |
| entity_id | string | FK → Entity (`entity_id`) | Auxiliar del tercero cuando la cuenta es de detalle (p. ej., cuenta por cobrar de un cliente) | Opcional; al eliminar la entidad se aplica SET NULL y la cuenta se conserva |
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
| period_id | string | FK → PeriodoContable | Periodo contable al que pertenece el asiento | Obligatorio, debe referenciar un periodo existente. Al eliminar el periodo se aplica RESTRICT |
| concept | string | — | Glosa o descripción del asiento | Obligatorio, no vacío |
| sourceDocumentType | string | — | Tipo de documento origen: `document` u otro módulo | Opcional; requerido cuando se usa `sourceDocumentId` |
| sourceDocumentId | string | FK → Document (`id`) | Documento base que origina el asiento | Opcional; debe referenciar un documento existente. `SET NULL` (propuesto) o `RESTRICT` (pendiente de decisión) al eliminar el documento |
| entity_id | string | FK → Entity (`entity_id`) | Tercero relacionado con el asiento | Opcional; al eliminar la entidad se aplica SET NULL |
| totalDebit | integer | — | Suma de los débitos de sus líneas, en centavos | Obligatorio, entero no negativo; exactamente igual a `totalCredit`; se recalcula desde las líneas |
| totalCredit | integer | — | Suma de los créditos de sus líneas, en centavos | Obligatorio, entero no negativo; exactamente igual a `totalDebit`; se recalcula desde las líneas |
| currency | string | — | Código de moneda de los importes (p. ej., MXN, USD) | Opcional |
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
| entity_id | string | FK → Entity (`entity_id`) | Auxiliar del tercero en la línea (p. ej., factura de un cliente) | Opcional; al eliminar la entidad se aplica SET NULL |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

## Entidad: Pago (registro de cobro o desembolso) — Fase futura (conservada, no MVP)

Movimiento financiero de dinero contra un tercero: cobro a un cliente o pago a un proveedor. Opcionalmente genera el asiento contable correspondiente.

| Campo | Tipo | Clave | Descripción | Restricciones |
|---|---|---|---|---|
| id | string | PK | Identificador interno único del pago | Obligatorio, generado automáticamente |
| numero | string | UK | Número oficial del pago derivado de serie y folio | Obligatorio, no vacío, único |
| series | string | — (UK compuesta) | Serie del pago (p. ej., `COB`, `PAG`) | Opcional; forma parte de `UNIQUE(series, folio)`. Si está vacía se normaliza a cadena vacía para la unicidad |
| folio | number | — (UK compuesta) | Folio consecutivo del pago | Obligatorio, entero positivo, único en combinación `(series, folio)` |
| date | string | — | Fecha del pago en formato YYYY-MM-DD | Obligatorio, fecha de calendario válida |
| entity_id | string | FK → Entity (`entity_id`) | Tercero pagado o que realiza el cobro | Obligatorio, debe referenciar una entidad existente; RESTRICT al eliminar la entidad |
| document_id | string | FK → Document (`id`) | Documento que se liquida con el pago | Opcional; debe referenciar un documento existente; SET NULL al eliminar el documento |
| asiento_id | string | FK, UK → AsientoContable (`id`) | Asiento generado por el pago (1:1 opcional) | Opcional, único; debe referenciar un asiento existente; SET NULL al eliminar el asiento |
| amount | integer | — | Importe pagado en la moneda configurada, en centavos | Obligatorio, entero mayor que cero |
| currency | string | — | Código de moneda (p. ej., MXN, USD) | Opcional |
| method | string | — | Medio de pago: `efectivo`, `transferencia`, `cheque`, `tarjeta` | Opcional, valor del conjunto cerrado |
| status | string | — | Estado: `pendiente`, `aplicado`, `cancelado` | Opcional; si ModuleConfig define `statusLifecycle`, se aplica ese ciclo. Un pago aplicado/cancelado no se elimina físicamente: se anula lógicamente |
| notes | string | — | Notas u observaciones libres | Opcional |
| createdAt | string | — | Marca de tiempo de creación | Obligatorio |
| updatedAt | string | — | Marca de última modificación | Obligatorio |

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

### Cuenta contable

- Un `code` y un `name` no vacíos son obligatorios; el código es único en el plan.
- `type` debe pertenecer al conjunto `activo`, `pasivo`, `patrimonio`, `ingreso`, `gasto`; `normalBalance` se deriva de él.
- `parent_id`, cuando existe, debe apuntar a una cuenta existente y no debe crear ciclos.
- Solo cuentas hoja (`isLeaf = true`) y activas pueden recibir líneas de asiento.
- Una cuenta con líneas o con cuentas hijas no se elimina: se marca `inactiva`. El borrado de una cuenta padre está restringido por `parent_id`; el de una cuenta con movimientos está restringido por `LineaAsiento.cuenta_id`.

### Asiento contable

- Un asiento debe incluir `folio` entero positivo; con `series` forma el número oficial (p. ej., `DI-1001`). La unicidad es compuesta: `UNIQUE(series, folio)`; si `series` está vacía se normaliza a cadena vacía para la comparación.
- Un asiento debe incluir al menos dos líneas.
- La suma de `debit` debe ser exactamente igual a la suma de `credit` en todas sus líneas; los totales se recalculan en centavos y se almacenan en `totalDebit` y `totalCredit` con igualdad exacta, sin tolerancia.
- Cada línea debe llevar importe en débito o en crédito, nunca ambos ni ninguno (el monto debe ser mayor que cero en uno de los dos).
- La fecha debe caer dentro de un `PeriodoContable` con `status = abierto`; los periodos cerrados rechazan asientos nuevos o modificaciones.
- Un asiento con `sourceDocumentId` debe referenciar un `Document` existente. Al eliminar el documento, la FK queda pendiente de decisión entre `SET NULL` y `RESTRICT`.
- Un asiento `aprobado` no admite cambios en sus líneas; `cancelado` debe conservar su registro para auditoría (anulación lógica, no borrado físico).
- Solo un asiento en `borrador` puede eliminarse físicamente; al hacerlo se eliminan en cascada sus líneas. Los asientos aprobados o cancelados nunca se borran físicamente.

### Línea de asiento

- `asiento_id` y `cuenta_id` deben referenciar registros existentes; `cuenta_id` debe ser una cuenta hoja y activa.
- Exactamente uno de `debit` o `credit` debe ser mayor que cero; el otro debe ser cero o ausente.
- `debit` y `credit` son enteros no negativos en centavos; no se admiten flotantes.
- `asiento_id` usa `CASCADE` únicamente cuando se borra físicamente un asiento en borrador; `cuenta_id` usa `RESTRICT` para no perder movimientos históricos.

### Pago

- `numero`, `date`, `entity_id` y `amount` son obligatorios; `amount` debe ser un entero mayor que cero en centavos.
- `entity_id`, `document_id` y `asiento_id`, cuando existen, deben referenciar registros existentes.
- `numero` es único; `folio` es un entero positivo único en combinación `(series, folio)`, con `series` vacía normalizada a cadena vacía.
- `asiento_id` es único: un pago genera o referencia como mucho un asiento y un asiento corresponde como mucho a un pago (1:1 opcional).
- Un pago aplicado o cancelado no se elimina físicamente: se anula lógicamente con `status = cancelado`.

### Periodo contable

- `startDate` y `endDate` deben ser fechas válidas con `endDate >= startDate`.
- No se permite que dos periodos abiertos se solapen.
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
- El MVP no realiza conversión de moneda; cada asiento usa una sola moneda.

## Relaciones y Cardinalidades

La cardinalidad se lee como **A ↔ B**: cuántos A puede tener cada B y cuántos B puede tener cada A. Todas las FK del diagrama aparecen aquí y todas las relaciones de aquí aparecen en el diagrama.

| Relación | Cardinalidad | FK | Notas |
|---|---|---|---|
| Entity ← Document | 1 a 0..* | `Document.entity_id` | Relación base; FK obligatoria. Al eliminar Entity, CASCADE sobre Document por regla del módulo 001 |
| Entity ← CuentaContable | 0..1 a 0..* | `CuentaContable.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← AsientoContable | 0..1 a 0..* | `AsientoContable.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← LineaAsiento | 0..1 a 0..* | `LineaAsiento.entity_id` | FK opcional; SET NULL al eliminar la entidad |
| Entity ← Pago | 1 a 0..* | `Pago.entity_id` | FK obligatoria; RESTRICT al eliminar la entidad |
| Document ← AsientoContable | 0..1 a 0..* | `AsientoContable.sourceDocumentId` | FK opcional; SET NULL (propuesto) o RESTRICT (pendiente) |
| Document ← Pago | 0..1 a 0..* | `Pago.document_id` | FK opcional; SET NULL al eliminar el documento |
| PeriodoContable ← AsientoContable | 1 a 0..* | `AsientoContable.period_id` | FK obligatoria; RESTRICT al eliminar el periodo |
| CuentaContable ← CuentaContable | 0..1 a 0..* | `CuentaContable.parent_id` | Autorreferencia padre/hijo; RESTRICT |
| CuentaContable ← LineaAsiento | 1 a 0..* | `LineaAsiento.cuenta_id` | FK obligatoria; RESTRICT |
| AsientoContable ← LineaAsiento | 1 a 2..* | `LineaAsiento.asiento_id` | FK obligatoria; CASCADE. Mermaid solo expresa 1..*; el mínimo 2 se valida en la aplicación |
| AsientoContable ← Pago | 0..1 a 0..1 | `Pago.asiento_id` | FK opcional y única; 1:1 opcional |

## Reglas de Eliminación e Integridad Referencial

Se mantiene la **anulación lógica** (`status = cancelado`) para asientos y pagos históricos. El borrado físico se reserva para asientos en `borrador`; los aprobados o cancelados no se eliminan. `CASCADE` se usa solo donde una fila dependiente no tiene sentido sin su padre.

| FK | Al eliminar el padre | Justificación |
|---|---|---|
| `Document.entity_id → Entity.entity_id` | `CASCADE` (regla base) | Se conserva la regla del módulo 001; no se modifica. Los asientos y pagos se desvinculan con `SET NULL`/`RESTRICT` y no se borran por esta cascada |
| `CuentaContable.parent_id → CuentaContable.id` | `RESTRICT` | Evita cuentas hijas huérfanas y mantiene la jerarquía del plan |
| `CuentaContable.entity_id → Entity.entity_id` | `SET NULL` | La cuenta y su saldo histórico sobreviven; solo se pierde el auxiliar del tercero |
| `AsientoContable.period_id → PeriodoContable.id` | `RESTRICT` | No se borra un periodo con asientos; se cierra |
| `AsientoContable.sourceDocumentId → Document.id` | `SET NULL` (propuesto) o `RESTRICT` (pendiente) | `SET NULL` conserva el asiento pero pierde la trazabilidad al documento; `RESTRICT` conserva el vínculo pero bloquea borrar documentos con asientos y, por la regla base `Document.entity_id CASCADE`, puede bloquear el borrado de una Entity con documentos conciliados. Decisión pendiente |
| `AsientoContable.entity_id → Entity.entity_id` | `SET NULL` | El asiento histórico sobrevive; el tercero es un auxiliar opcional |
| `LineaAsiento.asiento_id → AsientoContable.id` | `CASCADE` | Única cascada contable necesaria: una línea no existe sin su asiento. Solo aplica al borrado físico de asientos en `borrador` |
| `LineaAsiento.cuenta_id → CuentaContable.id` | `RESTRICT` | No se borra una cuenta con movimientos; se marca `inactiva` |
| `LineaAsiento.entity_id → Entity.entity_id` | `SET NULL` | La línea histórica sobrevive; el tercero es un auxiliar opcional |
| `Pago.entity_id → Entity.entity_id` | `RESTRICT` | Un pago siempre requiere un tercero; no se borra una entidad con pagos |
| `Pago.document_id → Document.id` | `SET NULL` | El pago sobrevive al borrar el documento liquidado |
| `Pago.asiento_id → AsientoContable.id` | `SET NULL` | El pago sobrevive si se borra físicamente un asiento en borrador; los asientos aprobados/cancelados no se borran |

- **Cascadas**: la única cascada nueva es `LineaAsiento.asiento_id`; `Document.entity_id` es una cascada heredada del módulo base. `Entity` y `Document` no borran asientos, líneas, cuentas ni pagos.
- **Conservación del historial**: `AsientoContable.entity_id`, `LineaAsiento.entity_id` y `CuentaContable.entity_id` usan `SET NULL`; `Pago.entity_id` usa `RESTRICT`. Así se evita perder registros contables al eliminar una `Entity` o un `Document`.
- **Ciclos de vida**: cuentas con movimientos o hijas se inactivan; periodos con asientos se cierran; asientos y pagos históricos se anulan lógicamente con `status = cancelado`.

## Reglas de Balance (Partida Doble)

- **Balance por asiento**: `SUM(LineaAsiento.debit) = SUM(LineaAsiento.credit)` y `totalDebit = totalCredit`, con igualdad exacta de enteros en centavos y tolerancia `0`. Los totales se recalculan en cada escritura.
- **Saldo de cuenta**: `balance(cuenta) = SUM(debit de sus líneas) - SUM(credit de sus líneas)`; el saldo se interpreta según `normalBalance` (`debit` o `credit`).
- **Balance general**: en cualquier momento, `SUM(saldos de cuentas con normalBalance = debit) = SUM(saldos de cuentas con normalBalance = credit)`.
- Un asiento no se aprueba si no cumple balance exacto o si su periodo está cerrado.

## Alcance MVP

No se elimina ninguna de las cinco entidades; solo se prioriza su implementación.

| Entidad | Alcance | Motivo |
|---|---|---|
| CuentaContable | MVP | Plan de cuentas necesario para clasificar los movimientos |
| AsientoContable | MVP | Cabecera del registro contable |
| LineaAsiento | MVP | Implementa la partida doble |
| PeriodoContable | MVP | `period_id` es obligatorio y controla periodos abiertos/cerrados |
| Pago | Fase futura | Tesorería/cobros/desembolsos; los asientos pueden registrarse sin él. Se conserva en el modelo |

> Si el MVP exige registrar cobros o desembolsos, `Pago` pasa a ser imprescindible. Esa decisión debe confirmarla el grupo.

## Decisiones Pendientes de Validación

1. **`AsientoContable.sourceDocumentId`: `SET NULL` vs `RESTRICT`.** `SET NULL` conserva el asiento histórico pero pierde la trazabilidad al documento; `RESTRICT` conserva el vínculo pero impide borrar un `Document` con asientos y, dado que `Document.entity_id` es `CASCADE` por regla base, también puede impedir borrar una `Entity` con documentos conciliados.
2. **¿El MVP incluye `Pago`?** Se propone dejarlo como fase futura; si el alcance exige cobros/desembolsos, debe pasar a MVP y validarse su ciclo de vida.

## Notas de Extensibilidad

- Los campos base de `Entity` y `Document` conservan sus nombres y semántica; este módulo solo añade registros propios y referencias por `entity_id` e `id` de documento.
- `ModuleConfig` puede renombrar términos (`labels`: asiento, cuenta, pago), añadir campos personalizados (`customFields` con `target: "document"` o `"entity"`) y definir el ciclo de vida de `status` para asientos y pagos (`statusLifecycle`).
- La numeración por serie y folio sigue la convención del módulo base; la numeración automática queda como punto de extensión de implementación.
- El cierre de ejercicio, los comprobantes de reportes (balance general, estado de resultados) y el ajuste por tipo de cambio son puntos de extensión posteriores.
