import { describe, it, expect, beforeEach } from 'vitest';
import { instalarAlmacen } from '../../setup/contabilidad.js';
import { inicializarAcceso } from '../../../src/contabilidad/almacenamiento.js';
import { USUARIOS_BASE, listarUsuarios, buscarUsuarioPorRUT, obtenerUsuarioPorRol } from '../../../src/contabilidad/usuarios.js';

describe('usuarios de demostración', () => {
  beforeEach(() => {
    const almacen = instalarAlmacen();
    almacen.clear();
    inicializarAcceso();
  });

  it('lista cuatro usuarios y los busca por RUT normalizado', () => {
    expect(USUARIOS_BASE).toHaveLength(4);
    expect(listarUsuarios()).toHaveLength(4);
    expect(buscarUsuarioPorRUT('11.111.111-1').rol_id).toBe('administrador');
  });

  it('obtiene un usuario por rol', () => {
    expect(obtenerUsuarioPorRol('tesorero').contraseña).toBe('Tesorero2026!');
  });
});
