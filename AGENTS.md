# AGENTS.md

## What this repo is

Single-page ERP (Accounting & Finance module) built with **Vite + vanilla JS**. No framework, no backend,
no network calls — everything is simulated in the browser session.

- **All UI copy, identifiers, and comments are in Spanish** (constitution requirement). Write new code that way.
- Persistence is **`sessionStorage`**, not `localStorage` (README is stale on this). `localStorage` is only read
  once by `migrarAlmacenLegado()` in `src/storage.js` to migrate legacy keys on boot.

## Commands

```bash
npm install
npm run dev          # Vite dev server, http://localhost:5173
npm test             # vitest in WATCH mode in a terminal
npx vitest run       # one-off full run (use this in scripts/agents)
npx vitest run tests/unit/contabilidad/dinero.test.js   # single file
npm run build        # required gate, not optional
```

Definition of done (from `.specify/memory/constitution.md`): `npx vitest run` green **and** `npm run build`
succeeds **and** the affected flow was checked manually in `npm run dev`.
There is **no linter, formatter, typecheck, or CI workflow** — tests are only verified locally, so run them
yourself before claiming something passes.

## Testing quirks (easy to get wrong)

- The default vitest environment is **`node`, not jsdom**. Tests build the DOM manually from `index.html`
  using helpers in `tests/setup/contabilidad.js`: `crearDom()`, `bootContabilidad(config, opciones)`,
  `instalarAlmacen()`, `qs(id)`. Standard pattern:
  `beforeEach(() => { dom = crearDom(); })` / `afterEach(() => { dom.window.close(); })`.
- `vitest.config.mjs` sets `fileParallelism: false` because tests mutate `globalThis.window/document/storage`.
  Do not re-enable parallelism or share state across test files.
- `bootContabilidad()` calls `vi.resetModules()`, boots `src/app.js`'s `initApp`, and by default logs in as
  `administrador`. Demo role credentials live in `tests/setup/contabilidad.js` (contador, tesorero, auditor too).
- Money is **integer cents** everywhere; format only via `src/contabilidad/dinero.js`. Never use floats for amounts.
- Dates: the demo seed is deterministic and anchored to the fixed `FECHA_REFERENCIA_SEMILLA` (2026-10-01);
  it is seeded lazily the first time an accounting view opens. Date-sensitive financial functions accept an
  injectable `fechaActual = fechaHoyISO()` parameter — new logic must do the same instead of calling
  `new Date()` directly; tests freeze time with `vi.setSystemTime`.

## Architecture

- Entry: `index.html` → `src/main.js` → `boot()` in `src/app.js`. `app.js` (~1.5k lines) wires every DOM
  event and is the real integration hub — most cross-cutting changes land here.
- `src/module-config.js` → `userConfig` is the **only** place for tailoring (module name, labels, custom
  fields, status lifecycle, accent color). Prefer editing config over core code.
- Storage is centralized: only `src/storage.js` may touch `sessionStorage`/`localStorage`. Accounting data
  goes through `src/contabilidad/almacenamiento.js` under the `erp_contabilidad:*` prefix; base data under
  `erp_base_module:*`. Components must never access storage directly.
- Boundaries: `src/contabilidad/` = pure domain logic (unit tests), `src/components/` = DOM rendering
  (integration tests), `tests/unit/` vs `tests/integration/`, fixtures in `tests/setup/`.
- Stack is closed: dev deps limited to `vite`, `vitest`, `jsdom`; adding anything needs justification in the
  feature plan. No servers, no new runtime libraries.
- `pyproject.toml` / `uv.lock` / `src/speckit_template/` are only for the Spec Kit CLI — the app itself is pure JS.

## Spec-driven workflow (Spec Kit)

- Every change follows **spec → plan → tasks → implementation** via the OpenCode slash commands in
  `.opencode/commands/` (`/speckit.specify`, `/speckit.clarify`, `/speckit.plan`, `/speckit.tasks`,
  `/speckit.implement`, plus analyze/checklist/converge).
- Feature artifacts live in `specs/NNN-feature/` (`spec.md`, `plan.md`, `tasks.md`, `data-model.md`,
  `contracts/`). `.specify/feature.json` names the current feature
  (`specs/002-contabilidad-finanzas`); root `specs.md` / `tasks.md` / `plan.md` are the working copies for
  the in-progress increment.
- **`.specify/memory/constitution.md` (v2.0.0) is binding**: test-first for all financial logic, Spanish UI,
  storage only through the central layer, and specs/contracts/data-model must be updated whenever data
  shapes or behavior change.
- `.specify/extensions.yml` hooks auto-create a feature branch before `/speckit.specify` and auto-commit
  around each step. Per instructor rules in `feedback.md`: work on **one shared branch** — do not spin up
  ad-hoc branches, and keep user stories/tasks traceable to specs.
