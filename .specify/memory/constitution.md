<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0 (MAJOR: redefinición total de los principios y cambio de alcance
  de proyecto genérico al módulo Contabilidad y Finanzas).
- Modified principles:
  - "I. Code Quality & Maintainability" → "I. Integridad Financiera (NO NEGOCIABLE)"
  - "II. Test-First & Verification" → "IV. Verificación con Tests (Test-First)"
  - "III. User Experience Consistency" → "V. Claridad y Consistencia Financiera"
  - "IV. Performance & Reliability" → absorbido por "Restricciones Técnicas" y "Flujo de Desarrollo"
- Added sections: "Restricciones Técnicas", "Flujo de Desarrollo", principios II (datos en sesión)
  y III (código en español / vanilla).
- Removed sections: "Quality Standards" (integrada en Restricciones Técnicas).
- Renamed sections: "Development Workflow" → "Flujo de Desarrollo".
- Templates requiring updates: ✅ leídos en tiempo de ejecución por cada comando; sin cambios pendientes.
- Follow-up TODOs: Ninguno.
-->

# Módulo Contabilidad y Finanzas Constitution

## Core Principles

### I. Integridad Financiera (NO NEGOCIABLE)
Toda cifra monetaria producida por el módulo debe ser exacta, determinista y auditable.
- Los cálculos monetarios MUST usar una única utilidad centralizada de cálculo (redondeo explícito a
  2 decimales; prohibido sumar/restar montos crudos con aritmética de punto flotante en la UI).
- Todo asiento o movimiento financiero MUST cuadrar: la suma de débitos MUST ser igual a la suma de
  créditos; el sistema MUST impedir persistir operaciones desbalanceadas.
- Totales, subtotales e impuestos MUST derivarse de los componentes, nunca capturarse duplicados.
- Las reglas de cálculo del dominio (impuestos, intereses, saldos, amortizaciones) MUST vivir en
  módulos de lógica pura, testeables y sin dependencia del DOM.
- Corregir un error de cálculo invalida datos previos: toda recalculación MUST actualizarse en la
  capa de almacenamiento y reflejarse en los reportes.

### II. Simulación Completa de Datos en Sesión (Sin Backend)
El módulo es estrictamente frontend: no existe servidor, API ni llamadas de red.
- Prohibido el uso de `fetch`, XHR, WebSockets o cualquier I/O de red para datos del módulo.
- Toda persistencia MUST realizarse en la sesión local del navegador (`sessionStorage` por defecto;
  `localStorage` solo cuando la especificación lo exija explícitamente, nunca ambas para la misma
  colección), a través de una única capa de acceso a datos que cumpla el contrato de almacenamiento
  del módulo base.
- Los datos de demostración MUST ser semilla determinista y reseteables, de modo que pruebas y
  demos comiencen siempre desde el mismo estado.
- Cada operación CRUD MUST reflejarse de inmediato en la capa de almacenamiento; la memoria en vivo
  nunca puede divergir de lo persistido en la sesión.
- La limpieza de la sesión MUST dejar el módulo en un estado inicial válido (sin referencias rotas
  entre movimientos, documentos y entidades).

### III. Código en Español, Vanilla y Modular
- Identificadores de código, cadenas visibles al usuario, mensajes de validación y comentarios
  MUST escribirse en español.
- El código MUST usar ES modules nativos, sin frameworks ni librerías en tiempo de ejecución; solo
  HTML semántico, CSS (con variables) y JavaScript Vanilla compilado por Vite.
- Cada archivo MUST tener una sola responsabilidad y funciones pequeñas y nombradas de forma
  autoexplicativa; las piezas compartidas (formateo de moneda, fechas, validaciones, almacenamiento)
  MUST centralizarse en módulos reutilizables, no duplicarse por pantalla.
- Prohibido introducir dependencias nuevas sin justificación documentada en el plan de la feature.

### IV. Verificación con Tests (Test-First)
- Toda lógica financiera del módulo (cálculos, validaciones, reglas de negocio) MUST tener tests
  unitarios en Vitest antes o junto con su implementación (ciclo Rojo-Verde-Refactor).
- Todo flujo visible para el usuario (registrar un asiento, consultar un reporte, conciliar saldos)
  MUST tener pruebas de integración con `jsdom` que ejerciten la pantalla completa.
- Una feature NO se considera terminada hasta que `npm test` pase sin regresiones y `npm run build`
  complete correctamente.
- Los datos de prueba MUST reutilizar la semilla determinista del módulo; prohibido dependeer del
  estado de la sesión real del navegador en las pruebas.

### V. Claridad y Consistencia Financiera
- Moneda, fechas y números MUST mostrarse con formato localizado y consistente en todas las
  pantallas, usando funciones compartidas de formateo.
- Las tablas y reportes financieros MUST alinear cifras numéricamente, indicar unidades y permitir
  que cada total sea rastreable hasta sus movimientos de origen (drill-down).
- Toda pantalla MUST contemplar estados vacíos, de carga y de error con mensajes en español que
  indiquen cómo recuperarse.
- La validación de formularios MUST ser inline, específica y mostrar qué campo falla y por qué;
  los montos negativos o imposibles MUST bloquearse con explicación antes de persistir.

## Restricciones Técnicas

- Stack cerrado: Vite (build y dev server), HTML, CSS y JavaScript Vanilla. Sin frameworks
  (React/Vue/Angular), sin jQuery, sin librerías de componentes ni de utilidades en runtime.
- Dependencias de desarrollo permitidas como punto de partida: `vite`, `vitest`, `jsdom`. Cualquier
  adición MUST justificarse en el plan de implementación.
- Cero backend: prohibido crear servidores, funciones serverless, proxies o esquemas de
  autenticación de red; la autenticación y los datos se simulan en la sesión del navegador.
- Acceso al almacenamiento exclusivamente mediante la capa centralizada del módulo base
  (contrato de almacenamiento de entidades/documentos); ningún componente MUST tocar
  `sessionStorage`/`localStorage` directamente.
- Calidad: JavaScript sin errores de sintaxis ni warnings que afecten corrección; la documentación
  (specs, contratos, data-model) MUST actualizarse cuando cambien formas de datos o comportamiento.
- Presupuesto de rendimiento: las pantallas con listas extensas MUST paginar o filtrar en el
  cliente; los reportes MUST calcularse de forma incremental, sin recalcular toda la sesión en
  cada interacción.

## Flujo de Desarrollo

- Todo cambio MUST seguir el flujo Spec Driven Development del repositorio: especificación →
  plan → tareas → implementación, usando los templates de `.specify/templates/`.
- Cada incremento MUST ser pequeño, revisable y con criterios de aceptación trazables a la
  especificación; prohibido mezclar reglas de negocio de distintas features en un mismo cambio.
- Antes de considerar terminada una tarea: `npm test` en verde, `npm run build` sin errores y
  verificación manual del flujo afectado en el navegador (`npm run dev`).
- Los cambios que alteren la forma de los datos MUST actualizar el contrato de almacenamiento y el
  modelo de datos, e incluir migración simple del estado de la sesión cuando sea viable.
- La deuda técnica o las excepciones temporales MUST documentarse en el plan con su justificación
  y condición de eliminación.

## Governance

Esta constitución supersedes las expectativas de calidad ad-hoc del módulo Contabilidad y Finanzas.
- Las enmiendas MUST incluir justificación, incremento de versión según semver
  (MAJOR: redefinición/eliminación de principios; MINOR: principios o secciones nuevas;
  PATCH: clarificaciones) y actualización del Sync Impact Report en el encabezado.
- El cumplimiento se revisa en la planificación, la revisión de implementación y la preparación
  de release; las desviaciones MUST justificarse explícitamente y registrarse como deuda.
- Los comandos y templates de Spec Kit leen esta constitución en tiempo de ejecución; cualquier
  cambio aquí recae automáticamente en planes y tareas futuros.

**Version**: 2.0.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-10-20
