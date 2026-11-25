import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, elegir } from '../../setup/contabilidad.js';

const css = fs.readFileSync(fileURLToPath(new URL('../../../src/styles.css', import.meta.url)), 'utf8');

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('filtros sin superposición', () => {
  it('permite usar la × de limpieza sin tapar la flecha del selector', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    qs('nav-asientos').click();

    const select = qs('filtro-asiento-cuenta');
    const limpiar = document.querySelector('[data-limpiar-campo="filtro-asiento-cuenta"]');

    expect(limpiar).not.toBeNull();
    expect([...select.options].some((opcion) => opcion.textContent.length > 12)).toBe(true);
    expect(css).toMatch(/\.campo-con-limpieza\s+input,\.campo-con-limpieza\s+select\s*\{[^}]*padding-right:\s*64px/s);
    expect(css).toMatch(/\.campo-con-limpieza\s+\.limpiar-campo\s*\{[^}]*right:\s*30px/s);

    elegir(select, select.options[1].value);
    expect(select.value).not.toBe('');

    limpiar.click();
    expect(select.value).toBe('');
  });
});
