import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs } from '../../setup/contabilidad.js';

const SECCIONES = {
  administrador: 'nav-periodos',
  contador: 'nav-cuentas',
  tesorero: 'nav-pagos',
  auditor: 'nav-reportes'
};

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

describe('encabezado corporativo', () => {
  it.each(['administrador', 'contador', 'tesorero', 'auditor'])(
    'mantiene nombre y logotipo para %s en todas las pantallas',
    async (rol) => {
      await bootContabilidad(undefined, { requireAccess: true, sesion: rol });

      const comprobar = () => {
        expect(qs('empresa-nombre').textContent).toBe('Comercial Los Andes SpA');
        const svg = qs('logo-mark').querySelector('svg[data-lucide], svg.logo-mark-svg');
        expect(svg).not.toBeNull();
        expect(svg.getAttribute('aria-label')).toContain('Comercial Los Andes SpA');
        expect(document.querySelector('[data-config-interfaz]')).toBeNull();
      };

      comprobar();
      qs(SECCIONES[rol]).click();
      comprobar();
    }
  );
});
