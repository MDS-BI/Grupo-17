import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { normalizeConfig } from '../../src/module-config.js';
import { formatearMXN } from '../../src/contabilidad/dinero.js';

const html = fs.readFileSync(fileURLToPath(new URL('../../index.html', import.meta.url)), 'utf8');

let dom;

function qs(id){ return document.getElementById(id); }

beforeEach(async () => {
  dom = new JSDOM(html, { url: 'http://localhost/' });
  const w = dom.window;
  globalThis.window = w;
  globalThis.document = w.document;
  globalThis.localStorage = w.localStorage;
  globalThis.alert = vi.fn();
  globalThis.confirm = vi.fn(() => true);
  w.scrollTo = vi.fn();
  w.localStorage.clear();
});

afterEach(() => {
  dom.window.close();
});

async function bootWith(configOverride){
  vi.resetModules();
  const { initApp } = await import('../../src/app.js');
  await initApp(normalizeConfig(configOverride));
}

describe('User Story 3 - panel de inicio de Contabilidad y Finanzas', () => {
  it('opens on the dashboard with all other views hidden', async () => {
    await bootWith(undefined);
    expect(qs('view-dashboard').hidden).toBe(false);
    expect(qs('view-entities').hidden).toBe(true);
    expect(qs('view-documents').hidden).toBe(true);
    expect(qs('view-search').hidden).toBe(true);
  });

  it('shows financial indicators instead of generic entity and document counters', async () => {
    await bootWith(undefined);

    const labels = [...document.querySelectorAll('#view-dashboard .stat-card .stat-label')].map((el) => el.textContent);
    expect(labels).toEqual(['Ingresos', 'Gastos', 'Resultado financiero', 'Asientos contables']);
    expect(qs('stat-ingresos').textContent).toBe(formatearMXN(0));
    expect(qs('stat-gastos').textContent).toBe(formatearMXN(0));
    expect(qs('stat-resultado').textContent).toBe(formatearMXN(0));
    expect(qs('stat-asientos').textContent).toBe('0');
  });

  it('shows the accounting quick actions on the dashboard', async () => {
    await bootWith(undefined);

    const actions = [...document.querySelectorAll('#view-dashboard .action-card strong')].map((el) => el.textContent);
    expect(actions).toEqual(['Nuevo asiento contable', 'Cuentas contables', 'Registrar pago', 'Ver reportes']);
  });

  it('keeps entity and document management reachable from the sidebar', async () => {
    await bootWith(undefined);

    qs('nav-entities').click();
    expect(qs('view-entities').hidden).toBe(false);

    qs('nav-documents').click();
    expect(qs('view-documents').hidden).toBe(false);
  });
});
