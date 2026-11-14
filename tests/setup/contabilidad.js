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
  globalThis.alert = vi.fn();
  globalThis.confirm = vi.fn(() => true);
  ventana.confirm = globalThis.confirm;
  ventana.alert = globalThis.alert;
  ventana.scrollTo = vi.fn();
  ventana.localStorage.clear();
  return dom;
}

export function qs(id){
  return document.getElementById(id);
}

export async function bootContabilidad(config){
  vi.resetModules();
  const { initApp } = await import('../../src/app.js');
  initApp(normalizeConfig(config));
}

export function enviar(formulario){
  formulario.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
}

export function elegir(select, valor){
  select.value = valor;
  select.dispatchEvent(new window.Event('change', { bubbles: true }));
}
