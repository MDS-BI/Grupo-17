import { describe, it, expect, beforeEach } from 'vitest';
import { obtenerConfigInterfaz, guardarConfigInterfaz, restablecerConfigInterfaz, CLAVE_CONFIG_INTERFAZ, NOMBRE_EMPRESA } from '../../../src/contabilidad/interfaz-config.js';

describe('interfaz-config', () => {
  beforeEach(() => {
    const store = new Map();
    globalThis.sessionStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear()
    };
    sessionStorage.clear();
  });

  it('devuelve defaults cuando no hay configuración', () => {
    const cfg = obtenerConfigInterfaz();
    expect(cfg.nombreEmpresa).toBe(NOMBRE_EMPRESA);
    expect(cfg.logoEmpresa).toBe('');
  });

  it('guarda y recupera configuración en sessionStorage', () => {
    const guardada = guardarConfigInterfaz({ nombreEmpresa: 'Empresa Test', logoEmpresa: 'data:image/png;base64,abc' });
    expect(guardada.nombreEmpresa).toBe('Empresa Test');
    const cfg = obtenerConfigInterfaz();
    expect(cfg.logoEmpresa).toContain('data:image/png');
    expect(sessionStorage.getItem(CLAVE_CONFIG_INTERFAZ)).toBeTruthy();
  });

  it('restablece defaults', () => {
    guardarConfigInterfaz({ nombreEmpresa: 'Otra', logoEmpresa: 'x' });
    const cfg = restablecerConfigInterfaz();
    expect(cfg.nombreEmpresa).toBe(NOMBRE_EMPRESA);
    expect(cfg.logoEmpresa).toBe('');
  });
});
