# Tareas: Registrar y consultar pagos

**Entrada**: Historia de usuario en `specs.md` y modelo de datos en `specs/002-contabilidad-finanzas/data-model.md`  
**Prerrequisitos**: `specs.md` (obligatorio), `specs/002-contabilidad-finanzas/data-model.md`, `specs/001-erp-base-module/plan.md` (arquitectura base), `README.md` y `.specify/memory/constitution.md`  
**Rama**: `002-contabilidad-finanzas-pagos`  
**Pruebas**: Incluidas. La constitución del proyecto exige pruebas unitarias para lógica financiera y pruebas de integración para flujos visibles.

> No existe un `plan.md` específico para esta feature; las tareas se derivan de `specs.md`, del modelo de datos de Contabilidad y Finanzas y de la arquitectura Vite/Vanilla JS existente.

> **Nota de entorno**: el checkout consultado no contiene `index.html` ni `src/`, aunque las pruebas y el plan base los referencian. Antes de ejecutar T002 y T007 debe verificarse o restaurarse la base del módulo 001 (`index.html`, `src/`, `tests/`).

## Formato: `[ID] [P?] [Historia] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias directas).
- **[Historia]**: Historia de usuario a la que pertenece la tarea (`US1`, `US2`).
- Todas las tareas incluyen rutas de archivo exactas.

## Convenciones de Rutas

- Aplicación única: `src/` y `tests/` en la raíz del repositorio.
- Componentes de interfaz: `src/components/`.
- Pruebas unitarias: `tests/unit/`; pruebas de integración: `tests/integration/`; fixtures: `tests/setup/`.
- Persistencia exclusivamente a través de `src/storage.js`; ningún componente accede directamente a `localStorage`.
- Sin backend, sin llamadas de red y sin dependencias nuevas de runtime.

---

## Fase 1: Configuración (Infraestructura Compartida)

**Propósito**: Crear la estructura de archivos del módulo de pagos y su punto de entrada en la interfaz.

- [ ] T001 Crear la estructura de archivos del módulo de pagos en `src/payments.js`, `src/components/payment-form.js`, `src/components/payment-list.js`, `src/components/payment-detail.js`, `tests/unit/payment-validation.test.js`, `tests/unit/payment-query.test.js`, `tests/integration/manage-payments.test.js` y `tests/integration/consult-payments.test.js`.
- [ ] T002 [P] Añadir el botón de navegación "Pagos" y el contenedor `view-payments` en `index.html`.
- [ ] T003 [P] Añadir estilos base para la vista de pagos (formulario, tabla, filtros, detalle y estados vacíos) en `src/styles.css`.

---

## Fase 2: Fundacional (Prerrequisitos Bloqueantes)

**Propósito**: Definir el modelo, la persistencia y las utilidades compartidas de pagos que necesitan ambas historias.

**⚠️ CRÍTICO**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [ ] T004 [P] Definir en `src/payments.js` las constantes y funciones puras compartidas: estados `pendiente`, `aplicado`, `cancelado`; medios `efectivo`, `transferencia`, `cheque`, `tarjeta`; normalización de serie y formateo de importes almacenados en centavos.
- [ ] T005 [P] Extender `src/storage.js` con la clave `erp_contabilidad_finanzas:payments`, las funciones `loadPayments` y `savePayments`, y la limpieza de pagos en `clearAll`, manteniendo el acceso centralizado a `localStorage`.
- [ ] T006 Añadir en `src/payments.js` la forma canónica del pago y la fábrica `crearPago` con `id`, `createdAt` y `updatedAt`, sin persistencia (depende de T004).
- [ ] T007 Integrar la vista de pagos en el enrutamiento de módulos de `src/app.js` para que el botón "Pagos" muestre `view-payments`.
- [ ] T008 [P] Crear un fixture determinista de pagos para pruebas en `tests/setup/payments-fixture.js`.

**Punto de control**: La vista existe, la capa de almacenamiento de pagos está disponible y las utilidades compartidas están listas; las historias pueden comenzar.

---

## Fase 3: Historia de Usuario 1 - Registrar un pago (Prioridad: P1) 🎯 MVP

**Objetivo**: Permitir al tesorero registrar un cobro o desembolso con validaciones, número oficial, estado inicial y vínculos opcionales, y verlo en la lista.

**Prueba Independiente**: Un tesorero puede abrir Pagos, completar los datos obligatorios, guardar el pago y verlo aparecer en la lista con su número y estado.

### Pruebas para la Historia de Usuario 1

> **NOTA: Escribir estas pruebas primero y verificar que fallen antes de implementar.**

- [ ] T009 [P] [US1] Añadir pruebas unitarias de validación, normalización de serie, numeración y conversión de importes en `tests/unit/payment-validation.test.js`.
- [ ] T010 [P] [US1] Añadir prueba de integración para registrar un pago y verlo en la lista en `tests/integration/manage-payments.test.js`.

### Implementación para la Historia de Usuario 1

- [ ] T011 [P] [US1] Implementar `validarPago` y `generarNumeroPago` en `src/payments.js`, incluyendo fecha válida, tercero existente, folio entero positivo, importe mayor que cero, máximo dos decimales, serie normalizada, medio de pago permitido y referencias existentes.
- [ ] T012 [P] [US1] Implementar `addPayment` en `src/storage.js` con estado inicial `pendiente`, validación de unicidad de `numero` y `(series, folio)`, y vínculo 1:1 opcional con asiento.
- [ ] T013 [P] [US1] Crear el formulario de pago en `src/components/payment-form.js` con fecha, tercero, serie, folio, importe, moneda, medio de pago, documento, asiento y notas.
- [ ] T014 [P] [US1] Crear la lista básica de pagos en `src/components/payment-list.js` mostrando número, fecha, tercero, importe, moneda, medio de pago y estado.
- [ ] T015 [US1] Conectar el envío del formulario, la validación inline y la persistencia en `src/app.js`.
- [ ] T016 [US1] Poblar los selectores de tercero y documento desde `src/storage.js` en `src/app.js`; para el asiento, cargar asientos si el módulo contable los expone o dejar el selector deshabilitado con "Sin asientos disponibles".
- [ ] T017 [US1] Mostrar los errores de validación y refrescar la lista con el pago recién creado en `src/app.js` y `src/components/payment-list.js`.
- [ ] T018 [P] [US1] Añadir estilos específicos del formulario y la lista de pagos en `src/styles.css`.

**Punto de control**: La Historia de Usuario 1 debe estar completamente funcional y ser comprobable de forma independiente.

---

## Fase 4: Historia de Usuario 2 - Consultar y encontrar pagos (Prioridad: P2)

**Objetivo**: Permitir al tesorero listar, filtrar, buscar y abrir el detalle de los pagos, incluyendo los estados `aplicado` y `cancelado`.

**Prueba Independiente**: Un tesorero puede abrir la lista, aplicar filtros, seleccionar un pago y ver su detalle completo; con datos fixture puede probarse sin depender de la interfaz de registro.

### Pruebas para la Historia de Usuario 2

> **NOTA: Escribir estas pruebas primero y verificar que fallen antes de implementar.**

- [ ] T019 [P] [US2] Añadir pruebas unitarias de filtrado y búsqueda por rango de fechas, tercero, estado, medio de pago, número y serie/folio en `tests/unit/payment-query.test.js`.
- [ ] T020 [P] [US2] Añadir prueba de integración para listar, filtrar, limpiar filtros, ver detalle y estado vacío en `tests/integration/consult-payments.test.js`.

### Implementación para la Historia de Usuario 2

- [ ] T021 [P] [US2] Implementar `filtrarPagos` y `buscarPagos` en `src/payments.js` con los criterios de la especificación: rango de fechas, tercero, estado, medio de pago, número y serie/folio.
- [ ] T022 [P] [US2] Ampliar `src/components/payment-list.js` con la tabla de resultados, filtros y estado vacío.
- [ ] T023 [P] [US2] Crear `src/components/payment-detail.js` con el detalle completo, notas, documento y asiento vinculados.
- [ ] T024 [US2] Conectar filtros, limpieza de filtros, selección de pago y detalle en `src/app.js`.
- [ ] T025 [US2] Mantener visibles los pagos `aplicado` y `cancelado` sin acciones de borrado físico en `src/components/payment-list.js` y `src/app.js`.
- [ ] T026 [P] [US2] Añadir estilos para filtros, tabla, detalle y estado vacío en `src/styles.css`.
- [ ] T027 [US2] Añadir una prueba de rendimiento con al menos 500 pagos para verificar que la lista y los filtros responden sin degradación en `tests/integration/consult-payments.test.js`.

**Punto de control**: Las Historias de Usuario 1 y 2 deben funcionar de forma independiente y en conjunto.

---

## Fase 5: Pulido y Preocupaciones Transversales

**Propósito**: Unificar accesibilidad, mensajes, documentación y verificación final.

- [ ] T028 [P] Revisar accesibilidad de etiquetas, foco de teclado y estructura semántica en `src/components/payment-form.js`, `src/components/payment-list.js` y `src/components/payment-detail.js`.
- [ ] T029 Revisar estados vacíos, mensajes de error y textos en español en `src/components/payment-list.js` y `src/app.js` (coordinar con T028 por el archivo compartido).
- [ ] T030 [P] Actualizar `README.md` con la funcionalidad de pagos y la clave de almacenamiento utilizada.
- [ ] T031 Ejecutar `npm test` y `npm run build`; corregir cualquier regresión.
- [ ] T032 Verificar manualmente el flujo completo en `npm run dev`: registrar un pago, recargar, consultarlo, filtrarlo y abrir su detalle.

---

## Dependencias y Orden de Ejecución

### Dependencias entre Fases

- **Configuración (Fase 1)**: Sin dependencias; puede comenzar de inmediato.
- **Fundacional (Fase 2)**: Depende de la Fase 1 y bloquea todas las historias.
- **Historia de Usuario 1 (Fase 3)**: Depende de la Fase 2; no depende de US2.
- **Historia de Usuario 2 (Fase 4)**: Depende de la Fase 2; puede probarse con fixture y, para la integración final, se apoya en la lista y el almacenamiento de US1.
- **Pulido (Fase 5)**: Depende de que US1 y US2 estén completas.

### Dependencias entre Historias

- **US1 (P1)**: Puede comenzar después de la Fase 2; entrega el MVP de registro.
- **US2 (P2)**: Puede comenzar después de la Fase 2 con datos fixture; la integración con la lista de US1 se completa al final de la fase.
- Ninguna historia requiere backend ni cambios en `Entity`, `Document` o `ModuleConfig`.

### Dentro de Cada Historia

- Las pruebas deben escribirse y fallar antes de la implementación.
- La lógica pura de `src/payments.js` va antes de los componentes.
- La persistencia en `src/storage.js` va antes del cableado en `src/app.js`.
- Los componentes van antes de la integración final en `src/app.js`.
- Una historia debe completarse y validarse antes de pasar a la siguiente prioridad.

---

## Oportunidades Paralelas

- T002 y T003 pueden ejecutarse en paralelo con T001 porque tocan archivos distintos.
- T004, T005 y T008 pueden ejecutarse en paralelo; T006 depende de T004 y T007 depende de T002 y de la estructura de T001.
- T009 y T010 pueden ejecutarse en paralelo (archivos distintos).
- T011, T012, T013 y T014 pueden ejecutarse en paralelo; T015 depende de T011-T014.
- T019 y T020 pueden ejecutarse en paralelo.
- T021, T022, T023 y T026 pueden ejecutarse en paralelo; T024 depende de T021-T023.
- T028 y T030 pueden ejecutarse en paralelo; T029 se coordina con T028 por `src/components/payment-list.js` antes de T031-T032.
- US1 y US2 pueden avanzar en paralelo después de la Fase 2 si se usan fixtures para US2; la integración final requiere coordinar `src/components/payment-list.js` y `src/app.js`.

---

## Ejemplo Paralelo: Historia de Usuario 1

```bash
# Pruebas de US1 en paralelo:
Tarea: "Pruebas unitarias de validación y numeración en tests/unit/payment-validation.test.js"
Tarea: "Prueba de integración de registro en tests/integration/manage-payments.test.js"

# Implementación base de US1 en paralelo:
Tarea: "Implementar validarPago y generarNumeroPago en src/payments.js"
Tarea: "Implementar addPayment en src/storage.js"
Tarea: "Crear el formulario de pago en src/components/payment-form.js"
Tarea: "Crear la lista básica de pagos en src/components/payment-list.js"
```

---

## Estrategia de Implementación

### MVP Primero (Solo Historia de Usuario 1)

1. Completar la Fase 1: Configuración.
2. Completar la Fase 2: Fundacional.
3. Completar la Fase 3: Registrar un pago.
4. **DETENERSE y VALIDAR**: probar el registro de forma independiente.
5. Demostrar el MVP si está listo.

### Entrega Incremental

1. Completar Configuración + Fundacional.
2. Añadir US1 → probar de forma independiente → demostrar el registro de pagos.
3. Añadir US2 → probar de forma independiente → demostrar la consulta y el detalle.
4. Completar el pulido y la verificación final.

### Estrategia con Varios Desarrolladores

1. El equipo completa Configuración + Fundacional.
2. Después de la Fase 2:
   - Desarrollador A: US1 (registro).
   - Desarrollador B: US2 (consulta) usando el fixture determinista.
3. Coordinar al final los cambios compartidos en `src/components/payment-list.js` y `src/app.js`.
4. Completar juntos el pulido y la verificación.

---

## Notas

- `[P]` indica tareas en archivos distintos y sin dependencias directas.
- `[US1]` y `[US2]` trazan cada tarea a la historia correspondiente de `specs.md`.
- Las pruebas son obligatorias por la constitución del proyecto, aunque la especificación no las pida explícitamente.
- Los importes se almacenan como enteros en centavos; no se usa aritmética de punto flotante para persistir.
- El acceso a `localStorage` se realiza únicamente a través de `src/storage.js`.
- La generación automática de asientos contables queda fuera de alcance; solo se permite vincular un asiento existente.
- No se implementa backend, autenticación multiusuario ni llamadas de red.
- No se incluyen tareas de commit ni push; no fueron solicitados.
