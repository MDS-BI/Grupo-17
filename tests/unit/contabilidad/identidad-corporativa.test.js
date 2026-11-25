import { describe, it, expect } from 'vitest';
import {
  IDENTIDAD_EMPRESA,
  NOMBRE_EMPRESA
} from '../../../src/contabilidad/interfaz-config.js';

describe('identidad corporativa', () => {
  it('expone una constante inmutable con nombre, logotipo y descripción', () => {
    expect(Object.isFrozen(IDENTIDAD_EMPRESA)).toBe(true);
    expect(IDENTIDAD_EMPRESA.nombre).toBe(NOMBRE_EMPRESA);
    expect(IDENTIDAD_EMPRESA.nombre).toBe('Comercial Los Andes SpA');
    expect(IDENTIDAD_EMPRESA.logotipo).toBe('svg-en-linea');
    expect(IDENTIDAD_EMPRESA.ariaLabel).toBe('Logo de Comercial Los Andes SpA');
  });

  it('no admite modificaciones posteriores', () => {
    expect(() => {
      'use strict';
      IDENTIDAD_EMPRESA.nombre = 'Otra empresa';
    }).toThrow(TypeError);
    expect(IDENTIDAD_EMPRESA.nombre).toBe('Comercial Los Andes SpA');
  });
});
