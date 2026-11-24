import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { crearDom, bootContabilidad, qs, enviar } from '../setup/contabilidad.js';

let dom;

beforeEach(() => {
  dom = crearDom();
});

afterEach(() => {
  dom.window.close();
});

function credenciales(rut, contraseña){
  qs('acceso-rut').value = rut;
  qs('acceso-contraseña').value = contraseña;
}

describe('acceso, menú por rol y panel de inicio', () => {
  it('muestra el formulario de acceso antes de iniciar sesión', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });
    expect(qs('view-acceso').hidden).toBe(false);
    expect(qs('view-dashboard').hidden).toBe(true);
    expect(qs('nav-pagos').hidden).toBe(true);
  });

  it('rechaza credenciales incorrectas con un mensaje claro', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });
    credenciales('11.111.111-1', 'incorrecta');
    enviar(qs('acceso-formulario'));
    expect(qs('error-acceso').textContent).toContain('RUT o contraseña incorrectos');
    expect(qs('view-acceso').hidden).toBe(false);
  });

  it('muestra errores por campo cuando faltan RUT o contraseña', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });
    credenciales('', '');
    enviar(qs('acceso-formulario'));

    expect(qs('error-acceso-rut').textContent).toContain('obligatorio');
    expect(qs('error-acceso-contraseña').textContent).toContain('obligatoria');
  });

  it('ingresa como administrador y abre el panel integral', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: null });
    credenciales('11.111.111-1', 'Admin2026!');
    enviar(qs('acceso-formulario'));
    expect(qs('view-panel-inicio').hidden).toBe(false);
    expect(qs('view-panel-inicio').dataset.panelRol).toBe('administrador');
    expect(qs('view-panel-inicio').textContent).toContain('Ingresos del periodo');
    expect(qs('nav-resumen').hidden).toBe(false);
    expect(qs('nav-entities').hidden).toBe(true);
    expect(qs('nav-documents').hidden).toBe(true);
    expect(qs('nav-search').hidden).toBe(true);
  });

  it('filtra el menú del tesorero y bloquea secciones no disponibles', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'tesorero' });
    expect(qs('view-panel-inicio').dataset.panelRol).toBe('tesorero');
    expect(qs('nav-pagos').hidden).toBe(false);
    expect(qs('nav-resumen').hidden).toBe(true);
    expect(qs('nav-reportes').hidden).toBe(true);

    qs('nav-reportes').click();
    expect(qs('view-bloqueo').hidden).toBe(false);
    expect(qs('mensaje-bloqueo').textContent).toContain('Acceso no disponible');
  });

  it('cierra la sesión desde el panel', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'contador' });
    qs('view-panel-inicio').querySelector('[data-accion="cerrar-sesion"]').click();
    expect(qs('view-acceso').hidden).toBe(false);
    expect(qs('nav-cuentas').hidden).toBe(true);
  });

  it('mantiene un único control visible por sección en el menú', async () => {
    await bootContabilidad(undefined, { requireAccess: true, sesion: 'administrador' });
    const destinos = [...document.querySelectorAll('.nav-module')]
      .filter((boton) => !boton.hidden)
      .map((boton) => boton.dataset.destino);
    expect(new Set(destinos).size).toBe(destinos.length);
  });
});
