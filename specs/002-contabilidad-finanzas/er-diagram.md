# Diagrama Entidad-Relación: Módulo de Contabilidad y Finanzas

Acompaña a [data-model.md](data-model.md). Las entidades base (`Entity`, `Document`, `ModuleConfig`) se muestran con sus campos clave; la definición completa está en [001-erp-base-module/data-model.md](../001-erp-base-module/data-model.md).

## Diagrama

![Diagrama ER de Contabilidad y Finanzas](diagrama.png)

[Ver diagrama en formato Mermaid (.mmd)](diagrama.mmd)

```mermaid
erDiagram
    Entity ||--o{ CuentaContable : "cuenta auxiliar (opcional)"
    Entity ||--o{ AsientoContable : "tercero relacionado (opcional)"
    Entity ||--o{ LineaAsiento : "auxiliar por línea (opcional)"
    Entity ||--|{ Pago : "tercero (obligatorio)"
    Document |o--o{ AsientoContable : "origina (sourceDocumentId)"
    Document |o--o{ Pago : "se liquida (document_id)"
    PeriodoContable ||--|{ AsientoContable : "pertenece"
    CuentaContable |o--o{ CuentaContable : "jerarquía padre/hijo"
    CuentaContable ||--|{ LineaAsiento : "afecta (cuenta hoja y activa)"
    AsientoContable ||--|{ LineaAsiento : "contiene (>= 2, cascada)"
    Pago |o--o| AsientoContable : "genera / corresponde (opcional)"

    Entity {
        string entity_id PK
        string name
        string code
        string taxId
        string category
    }
    Document {
        string id PK
        string entity_id FK
        string series
        number folio
        number totalAmount
        string currency
        string status
    }
    ModuleConfig {
        string moduleName PK
        object labels
        object customFields
        object statusLifecycle
    }
    CuentaContable {
        string id PK
        string code UK
        string name
        string type
        string parent_id FK
        boolean isLeaf
        string entity_id FK
        string normalBalance
        string status
    }
    PeriodoContable {
        string id PK
        string name UK
        string startDate
        string endDate
        string status
    }
    AsientoContable {
        string id PK
        string series
        number folio
        string date
        string period_id FK
        string concept
        string sourceDocumentType
        string sourceDocumentId FK
        string entity_id FK
        number totalDebit
        number totalCredit
        string currency
        string status
    }
    LineaAsiento {
        string id PK
        string asiento_id FK
        string cuenta_id FK
        string concept
        number debit
        number credit
        string entity_id FK
    }
    Pago {
        string id PK
        string numero UK
        string series
        number folio
        string date
        string entity_id FK
        string document_id FK
        string asiento_id FK
        number amount
        string currency
        string method
        string status
    }
```

> `ModuleConfig` no participa en relaciones referenciales: se carga una sola vez al arrancar y aplica etiquetas, campos personalizados y ciclos de vida a las entidades del módulo.

## Leyenda de Cardinalidades

| Símbolo | Significado |
|---|---|
| `\|\|` | Exactamente uno (lado obligatorio) |
| `\|o` | Cero o uno (lado opcional) |
| `\|{` | Uno o más (mínimo 1) |
| `o{` | Cero o más (opcional, sin límite) |

## Relaciones

| Relación | Lectura | FK |
|---|---|---|
| Entity 1 — 0..* CuentaContable | Un tercero puede tener cuentas auxiliares (opcional) | `CuentaContable.entity_id` |
| Entity 1 — 0..* AsientoContable | Un asiento puede involucrar un tercero (opcional) | `AsientoContable.entity_id` |
| Entity 1 — 0..* LineaAsiento | Auxiliar por línea para reportes por tercero (opcional) | `LineaAsiento.entity_id` |
| Entity 1 — * Pago | Todo pago involucra exactamente un tercero (obligatorio) | `Pago.entity_id` |
| Document 0..1 — 0..* AsientoContable | Un documento origina cero o varios asientos | `AsientoContable.sourceDocumentId` |
| Document 0..1 — 0..* Pago | Un documento se liquida en cero o varios pagos | `Pago.document_id` |
| PeriodoContable 1 — * AsientoContable | Todo asiento pertenece a un periodo contable | `AsientoContable.period_id` |
| CuentaContable 0..1 — 0..* CuentaContable | Jerarquía padre/hijo sin ciclos | `CuentaContable.parent_id` |
| CuentaContable 1 — * LineaAsiento | Toda línea afecta una cuenta hoja activa | `LineaAsiento.cuenta_id` |
| AsientoContable 1 — * LineaAsiento | Todo asiento tiene dos o más líneas (eliminación en cascada) | `LineaAsiento.asiento_id` |
| Pago 0..1 — 0..1 AsientoContable | Un pago puede generar/corresponder como mucho a un asiento (opcional) | `Pago.asiento_id` |

## Reglas de Integridad Derivadas

- **Partida doble**: por cada `AsientoContable`, `SUM(LineaAsiento.debit) = SUM(LineaAsiento.credit)`, persistido en `totalDebit = totalCredit`.
- **Cascadas**: eliminar un `AsientoContable` elimina sus `LineaAsiento`; eliminar una `Entity` elimina sus `Document` (regla base) y sus `Pago`.
- **Unicidad**: `code` único en `CuentaContable`; `folio` único por `series` en `AsientoContable` y `Pago` (convención serie+folio del módulo base); `name` único en `PeriodoContable`.
- **Periodos**: un `AsientoContable` solo puede existir en un `PeriodoContable` con `status = abierto`.
