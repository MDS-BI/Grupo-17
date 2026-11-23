import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { vi } from 'vitest';
import { normalizeConfig } from '../../src/module-config.js';

const html = fs.readFileSync(fileURLToPath(new URL('../../index.html', import.meta.url)), 'utf8');

export function instalarAlmacen(){
  const store = new Map();
  const almacen = {
    getItem: (clave) => (store.has(clave) ? store.get(clave) : null),
    setItem: (clave, valor) => store.set(clave, String(valor)),
    removeItem: (clave) => store.delete(clave),
    clear: () => store.clear(),
    key: (indice) => [...store.keys()][indice] ?? null,
    get length(){ return store.size; }
  };
  globalThis.localStorage = almacen;
  return almacen;
}

export function crearDom(){
  const dom = new JSDOM(html, { url: 'http://localhost/' });
  const ventana = dom.window;
  globalThis.window = ventana;
  globalThis.document = ventana.document;
  globalThis.localStorage = ventana.localStorage;
  globalThis.sessionStorage = ventana.sessionStorage;
  globalThis.CustomEvent = ventana.CustomEvent;
  globalThis.alert = vi.fn();
  globalThis.confirm = vi.fn(() => true);
  ventana.confirm = globalThis.confirm;
  ventana.alert = globalThis.alert;
  ventana.scrollTo = vi.fn();
  ventana.localStorage.clear();
  ventana.sessionStorage.clear();
  return dom;
}

export function qs(id){
  return document.getElementById(id);
}

const CREDENCIALES = Object.freeze({
  administrador: ['11.111.111-1', 'Admin2026!'],
  contador: ['22.222.222-2', 'Contador2026!'],
  tesorero: ['33.333.333-3', 'Tesorero2026!'],
  auditor: ['44.444.444-4', 'Auditor2026!']
});

export async function bootContabilidad(config, opciones = {}){
  vi.resetModules();
  const { initApp, iniciarSesionApp } = await import('../../src/app.js');
  initApp(normalizeConfig(config), opciones);
  const rol = opciones.sesion === undefined ? 'administrador' : opciones.sesion;
  if(!opciones.requireAccess || rol === null) return;
  const credenciales = CREDENCIALES[rol];
  if(!credenciales) throw new Error(`Rol de prueba desconocido: ${rol}`);
  const resultado = iniciarSesionApp(...credenciales);
  if(!resultado.ok) throw new Error(`No se pudo iniciar sesión como ${rol}`);
}

export function enviar(formulario){
  formulario.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
}

export function elegir(select, valor){
  select.value = valor;
  select.dispatchEvent(new window.Event('change', { bubbles: true }));
}
