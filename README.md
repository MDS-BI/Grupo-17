# ERP Software Base Module (Vite + Vanilla JS)

A single-page ERP application focused on the Accounting and Finance module. It provides tools for managing chart of accounts, accounting journal entries, payments and receipts, and accounting periods. It also includes a financial dashboard with key indicators and financial reports to monitor income, expenses, and financial results. The module incorporates accounting validations, data consistency rules, and browser localStorage persistence, using Vite and vanilla HTML, CSS, and JavaScript.

Entities carry standard ERP master-data fields (name, code, tax ID, email, phone, address, category, target date, credit limit, payment terms). Documents use series + folio numbering and carry a monetary breakdown (subtotal, discount, tax, total), currency, payment terms, notes, quantity, dates, and status.

The app presents itself as a coherent ERP workspace:

- **Workspace shell** — every screen lives inside a branded chrome: a top bar with a logo (an SVG monogram derived from the module name) and module name, plus a persistent sidebar of module buttons (Panel, Entidades, Documentos, Búsqueda, Resumen financiero, Cuentas contables, Asientos contables, Pagos, Periodos contables, Reportes financieros). The active module is highlighted (`aria-current="page"`), and the sidebar collapses to an icon rail on narrow viewports.
- **Home dashboard** — the entry screen shows period-filtered financial indicators (income, expenses, net result, and registered journal entries) plus quick actions for creating journal entries, opening the chart of accounts, recording payments, and viewing reports. Entity and document management remain available from the sidebar.
- **Accounting and finance module** — double-entry ledger with hierarchical chart of accounts, journal entries (draft → approved → cancelled), payments and collections, accounting periods, and period-based financial reports.
- **Design tokens** — styling is driven by CSS custom properties in `src/styles.css`, so branding changes apply globally.

## Setup

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the URL Vite prints).

## Tests

Run the full test suite (unit + integration) with:

```bash
npm test
```

Or a one-off run without watch mode:

```bash
npx vitest run
```

## Accounting and Finance Module

The `002-contabilidad-finanzas` feature extends the base app with:

- **Resumen financiero** — income, expenses, and net result for the selected period, with a clear empty state.
- **Cuentas contables** — hierarchical chart of accounts (asset, liability, equity, income, expense) with leaf-account rules and safe deletion/inactivation.
- **Asientos contables** — balanced journal entries with dynamic debit/credit lines, exact integer-cent validation, and draft → approved → cancelled lifecycle. Closed periods reject new entries.
- **Pagos y cobros** — payments and collections linked to an entity and optionally to a document and journal entry, with type/entity filters and detail view.
- **Periodos contables** — non-overlapping periods that can be opened or closed; periods with entries are closed instead of deleted.
- **Reportes financieros** — period-filtered movements with debit/credit totals and empty states.

All amounts are stored as integer cents and formatted as CLP. The first time an accounting view opens, deterministic example data is seeded (chart of accounts, four periods, journal entries, payments, and two demo entities/documents). Use **Restaurar datos de ejemplo** on the summary screen to reset the accounting data to that seed at any time.

Accounting data is stored under the `erp_contabilidad:` prefix (`cuentas`, `asientos`, `lineas`, `pagos`, `periodos`); base entities and documents remain under `erp_base_module:`.

## Building Custom Modules

Custom ERP modules built on this base define:

- What an **Entity** represents (e.g., customer, product, asset) plus domain-specific fields.
- What a **Document** represents (e.g., order, invoice, contract).
- Module-specific labels and validation rules.

The base module handles identity generation, timestamps, referential integrity between entities and documents, cascade deletion, navigation, and search. See `specs/001-erp-base-module/` for the full specification.

## Tailoring via Configuration

All tailoring lives in one place: the `userConfig` object at the top of `src/module-config.js`. Developers edit this single export; no core code changes are required. Available knobs:

- `moduleName` — display name shown in the top bar, dashboard, and document title; also derives the logo monogram.
- `labels` — rename Entity/Document terms across every screen, including sidebar buttons, quick actions, forms, and messages. Spanish articles and agreements (el/la, seleccionado/a) are derived from the first word of each configured term.
- `customFields` — declare extra fields per record type with `target` (`entity` or `document`), `key`, `label`, `type` (`text`, `number`, `date`, or `select`), optional `required`, and `options` for selects. Keys must not collide with base field names (see `specs/001-erp-base-module/data-model.md`). Values persist alongside records and appear in search results.
- `statusLifecycle` — restrict document statuses to a configured list of `statuses` with permitted `transitions` between them. Without it, status stays a free-form field.
- `theme.accentColor` — a hex color (e.g., `"#0f62fe"`) applied across the shell as highlights and primary controls. Invalid values fall back to the default.

If the configuration is invalid (unknown types, bad keys, transitions referencing unknown statuses, non-hex accent colors), the app shows the problems in a banner and falls back to defaults instead of breaking.

## Notes

- Data is persisted to `localStorage` under the keys `erp_base_module:entities` and `erp_base_module:documents`, plus the accounting keys prefixed `erp_contabilidad:`.
- Deleting an entity also deletes its documents (cascade).
- Accounting entries in approved or cancelled states are voided logically; only draft entries can be deleted physically.
- This project intentionally uses vanilla HTML, CSS, and JavaScript for simplicity.
