# Tareas: Módulo de Contabilidad y Finanzas

**Entrada**: Documentos de diseño desde `/specs/002-contabilidad-finanzas/`
**Prerrequisitos**: plan.md, spec.md, data-model.md, er-diagram.md
**Pruebas**: Incluidas porque la constitución exige Vitest para la lógica financiera y pruebas de integración con jsdom para los flujos de usuario.

**Organización**: Las tareas se agrupan por historia de usuario para permitir implementar y probar cada historia de forma independiente.

## Formato: `[ID] [P?] [Historia] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias de tareas incompletas)
- **[Historia]**: Historia de usuario a la que pertenece la tarea (US1, US2, US3...)
- Todas las tareas incluyen la ruta de archivo exacta.

## Convenciones de Rutas

- Aplicación existente: `src/` y `tests/` en la raíz del repositorio.
- Lógica de dominio contable: `src/contabilidad/`.
- Componentes de interfaz contable: `src/components/contabilidad/`.
- Pruebas unitarias: `tests/unit/contabilidad/`.
- Pruebas de integración: `tests/integration/contabilidad/`.

---

## Fase 1: Configuración (Infraestructura Compartida)

**Propósito**: Preparar la estructura, navegación y estilos base del módulo contable dentro de la aplicación Vite existente.

- [ ] T001 Crear la estructura de carpetas del módulo contable en `src/contabilidad/`, `src/components/contabilidad/`, `tests/unit/contabilidad/` y `tests/integration/contabilidad/`
- [ ] T002 [P] Agregar los botones de navegación y contenedores de vista de Resumen, Cuentas, Asientos, Pagos, Periodos y Reportes en `index.html`
- [ ] T003 [P] Extender las etiquetas y el nombre del módulo contable en `src/module-config.js` y `src/components/shell.js`
- [ ] T004 [P] Agregar tokens de diseño, estilos de tablas financieras, formularios y estados vacíos contables en `src/styles.css`
- [ ] T005 [P] Crear ayudantes de prueba y utilidades de reinicio del almacenamiento contable en `tests/setup/contabilidad.js`

---

## Fase 2: Fundacional (Prerrequisitos Bloqueantes)

**Propósito**: Implementar la infraestructura compartida de dinero, fechas, almacenamiento, semilla, validaciones y reportes que necesitan todas las historias.

**CRÍTICO**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [ ] T006 [P] Implementar la utilidad monetaria exacta en centavos y el formateo MXN en `src/contabilidad/dinero.js`
- [ ] T007 [P] Implementar la validación, comparación y formateo de fechas y periodos en `src/contabilidad/fechas.js`
- [ ] T008 [P] Implementar ayudantes compartidos de interfaz contable (errores de formulario, formato de moneda/fecha y renderizado de tablas) en `src/components/contabilidad/comun.js`
- [ ] T009 Implementar la capa central de almacenamiento contable con claves, lectura/escritura, reinicio y orquestación de semilla en `src/contabilidad/almacenamiento.js`
- [ ] T010 Implementar la semilla determinista de cuentas, periodos, asientos y pagos vinculados a Entity y Document en `src/contabilidad/semilla.js`
- [ ] T011 Implementar las validaciones compartidas de cuentas, asientos, líneas, pagos y periodos en `src/contabilidad/validaciones-cuentas.js`, `src/contabilidad/validaciones-asientos.js`, `src/contabilidad/validaciones-pagos.js` y `src/contabilidad/validaciones-periodos.js`
- [ ] T012 Implementar los cálculos de resumen, movimientos y totales de reportes en `src/contabilidad/reportes.js`
- [ ] T013 Extender `src/app.js` con el registro de módulos contables, el cambio de vista y la inicialización de la semilla contable
- [ ] T014 Extender `src/components/shell.js` y `src/app.js` para aplicar las etiquetas contables y el estado activo de la navegación
- [ ] T015 Agregar pruebas fundacionales de almacenamiento, semilla determinista y utilidades de dinero/fechas en `tests/unit/contabilidad/almacenamiento.test.js` y `tests/integration/contabilidad/base.test.js`

**Punto de control**: La infraestructura contable está lista y las historias de usuario pueden comenzar.

---

## Fase 3: Historia de Usuario 1 - Consultar el resumen financiero (Prioridad: P1) - MVP

**Objetivo**: Mostrar un panel con ingresos, gastos y resultado financiero, filtrable por periodo y con estado vacío.

**Prueba Independiente**: Un usuario abre el módulo, ve los indicadores financieros del periodo seleccionado y recibe un mensaje cuando no hay movimientos.

### Pruebas para la Historia de Usuario 1

- [ ] T016 [P] [US1] Agregar pruebas unitarias de cálculo del resumen financiero en `tests/unit/contabilidad/reportes-resumen.test.js`
- [ ] T017 [P] [US1] Agregar pruebas de integración del panel de resumen, filtro por periodo y estado vacío en `tests/integration/contabilidad/resumen.test.js`

### Implementación para la Historia de Usuario 1

- [ ] T018 [P] [US1] Crear el componente del panel de resumen con indicadores, selector de periodo y estado vacío en `src/components/contabilidad/resumen.js`
- [ ] T019 [US1] Conectar el panel de resumen con `src/contabilidad/reportes.js` y el selector de periodo en `src/app.js`
- [ ] T020 [US1] Agregar estilos de tarjetas e indicadores del resumen financiero en `src/styles.css`

**Punto de control**: El resumen financiero funciona de forma independiente con datos de ejemplo.

---

## Fase 4: Historia de Usuario 2 - Gestionar cuentas contables (Prioridad: P1)

**Objetivo**: Permitir crear, consultar, editar y organizar jerárquicamente las cuentas del plan contable.

**Prueba Independiente**: Un usuario crea una cuenta, la ve en el listado, la edita y verifica que un código duplicado o un campo obligatorio vacío se rechacen.

### Pruebas para la Historia de Usuario 2

- [ ] T021 [P] [US2] Agregar pruebas unitarias de validación de cuentas, jerarquía y código duplicado en `tests/unit/contabilidad/validaciones-cuentas.test.js`
- [ ] T022 [P] [US2] Agregar pruebas de integración de alta, edición, listado y jerarquía de cuentas en `tests/integration/contabilidad/cuentas.test.js`

### Implementación para la Historia de Usuario 2

- [ ] T023 [P] [US2] Crear el formulario de cuentas contables con código, nombre, tipo, cuenta padre y estado en `src/components/contabilidad/cuenta-form.js`
- [ ] T024 [P] [US2] Crear el listado jerárquico de cuentas con identificación de cuentas principales y subcuentas en `src/components/contabilidad/cuenta-list.js`
- [ ] T025 [US2] Implementar el CRUD y la persistencia de la jerarquía de cuentas en `src/contabilidad/cuentas.js`
- [ ] T026 [US2] Conectar el formulario y listado de cuentas con la validación y el almacenamiento en `src/app.js`
- [ ] T027 [US2] Agregar estilos de formulario, árbol y estados de cuenta en `src/styles.css`

**Punto de control**: El plan de cuentas es completamente funcional y verificable de forma independiente.

---

## Fase 5: Historia de Usuario 3 - Registrar asientos contables (Prioridad: P1)

**Objetivo**: Permitir registrar asientos con fecha, concepto, periodo y líneas de débito/crédito, aplicando partida doble y el ciclo borrador → aprobado → cancelado.

**Prueba Independiente**: Un usuario crea un asiento, agrega líneas, guarda solo cuando débitos y créditos coinciden, y no puede editar un asiento aprobado ni registrar en un periodo cerrado.

### Pruebas para la Historia de Usuario 3

- [ ] T028 [P] [US3] Agregar pruebas unitarias de partida doble, líneas mínimas, monto en un solo lado y bloqueo por periodo cerrado en `tests/unit/contabilidad/validaciones-asientos.test.js`
- [ ] T029 [P] [US3] Agregar pruebas de integración de alta de asiento, líneas, desbalance, aprobación, cancelación y periodo cerrado en `tests/integration/contabilidad/asientos.test.js`

### Implementación para la Historia de Usuario 3

- [ ] T030 [P] [US3] Crear el formulario de asiento con cabecera y líneas dinámicas de cuenta, débito y crédito en `src/components/contabilidad/asiento-form.js`
- [ ] T031 [P] [US3] Crear el listado y detalle de asientos con totales, estado y acciones de aprobar/cancelar en `src/components/contabilidad/asiento-list.js`
- [ ] T032 [US3] Implementar el CRUD de asientos y líneas, el recálculo de totales y el ciclo de estados en `src/contabilidad/asientos.js`
- [ ] T033 [US3] Implementar las validaciones de asiento y línea, incluyendo periodo abierto y bloqueo tras aprobación, en `src/contabilidad/validaciones-asientos.js`
- [ ] T034 [US3] Conectar las vistas de asientos, el alta/eliminación de líneas y las acciones de guardar, aprobar y cancelar en `src/app.js`
- [ ] T035 [US3] Agregar estilos de formulario, tabla de líneas, totales y estados de asiento en `src/styles.css`

**Punto de control**: Los asientos contables funcionan de forma independiente con cuentas y periodos de la semilla.

---

## Fase 6: Historia de Usuario 4 - Registrar y consultar pagos (Prioridad: P1)

**Objetivo**: Permitir registrar, listar y consultar pagos y cobros vinculados a una entidad y, opcionalmente, a un documento y a un asiento.

**Prueba Independiente**: Un usuario registra un pago o cobro con fecha, monto, tipo y entidad, lo ve en el listado y consulta su detalle; los campos obligatorios y las referencias inexistentes se rechazan.

### Pruebas para la Historia de Usuario 4

- [ ] T036 [P] [US4] Agregar pruebas unitarias de validación de pagos, monto positivo y vínculos a entidad/documento/asiento en `tests/unit/contabilidad/validaciones-pagos.test.js`
- [ ] T037 [P] [US4] Agregar pruebas de integración de registro, listado, detalle y validación de pagos en `tests/integration/contabilidad/pagos.test.js`

### Implementación para la Historia de Usuario 4

- [ ] T038 [P] [US4] Crear el formulario de pagos y cobros con fecha, monto, tipo, método, entidad, documento y asiento opcional en `src/components/contabilidad/pago-form.js`
- [ ] T039 [P] [US4] Crear el listado y detalle de pagos y cobros con filtros por tipo y entidad en `src/components/contabilidad/pago-list.js`
- [ ] T040 [US4] Implementar el CRUD de pagos y los vínculos con Entity, Document y AsientoContable en `src/contabilidad/pagos.js`
- [ ] T041 [US4] Conectar las vistas de pagos y los selectores de entidad, documento y asiento en `src/app.js`
- [ ] T042 [US4] Agregar estilos de formulario, listado, detalle e insignias de tipo de pago en `src/styles.css`

**Punto de control**: Los pagos y cobros funcionan de forma independiente con las entidades y documentos base.

---

## Fase 7: Historia de Usuario 5 - Gestionar periodos contables (Prioridad: P1)

**Objetivo**: Permitir crear, consultar y cambiar el estado de los periodos contables, impidiendo solapamientos y bloqueando asientos en periodos cerrados.

**Prueba Independiente**: Un usuario crea un periodo, lo ve en el listado, lo cierra y comprueba que no puede registrar un asiento dentro de él; un periodo solapado o con fechas inválidas se rechaza.

### Pruebas para la Historia de Usuario 5

- [ ] T043 [P] [US5] Agregar pruebas unitarias de validación de fechas, solapamiento y bloqueo de periodos cerrados en `tests/unit/contabilidad/validaciones-periodos.test.js`
- [ ] T044 [P] [US5] Agregar pruebas de integración de alta, listado, cierre y bloqueo de asientos por periodo en `tests/integration/contabilidad/periodos.test.js`

### Implementación para la Historia de Usuario 5

- [ ] T045 [P] [US5] Crear el formulario de periodos contables con nombre, fecha de inicio, fecha de término y estado en `src/components/contabilidad/periodo-form.js`
- [ ] T046 [P] [US5] Crear el listado de periodos con identificación visual de abiertos y cerrados en `src/components/contabilidad/periodo-list.js`
- [ ] T047 [US5] Implementar el CRUD de periodos, la validación de solapamiento y el cambio de estado abierto/cerrado en `src/contabilidad/periodos.js`
- [ ] T048 [US5] Conectar las vistas de periodos y la validación de fechas en `src/app.js`
- [ ] T049 [US5] Agregar estilos de formulario, listado e insignias de estado de periodo en `src/styles.css`

**Punto de control**: La gestión de periodos funciona de forma independiente y bloquea asientos cuando corresponde.

---

## Fase 8: Historia de Usuario 6 - Generar y consultar reportes financieros (Prioridad: P2)

**Objetivo**: Generar reportes de movimientos por periodo con fecha, concepto, cuentas, débitos, créditos y totales, incluyendo estado vacío.

**Prueba Independiente**: Un usuario selecciona un periodo, ve los movimientos y totales correspondientes, cambia de periodo y obtiene la información actualizada; un periodo sin movimientos muestra un mensaje.

### Pruebas para la Historia de Usuario 6

- [ ] T050 [P] [US6] Agregar pruebas unitarias de totales, filtrado por periodo y periodo vacío en `tests/unit/contabilidad/reportes.test.js`
- [ ] T051 [P] [US6] Agregar pruebas de integración de selección de periodo, movimientos, totales y estado vacío en `tests/integration/contabilidad/reportes.test.js`

### Implementación para la Historia de Usuario 6

- [ ] T052 [P] [US6] Crear la vista de reportes con selector de periodo, tabla de movimientos, totales y estado vacío en `src/components/contabilidad/reportes.js`
- [ ] T053 [US6] Conectar la vista de reportes con los cálculos de `src/contabilidad/reportes.js` y el cambio de periodo en `src/app.js`
- [ ] T054 [US6] Agregar estilos de tabla financiera, alineación numérica y totales en `src/styles.css`

**Punto de control**: Los reportes financieros funcionan de forma independiente con los asientos de la semilla.

---

## Fase 9: Pulido y Preocupaciones Transversales

**Propósito**: Mejorar accesibilidad, rendimiento, documentación y verificación final de todas las historias.

- [ ] T055 [P] Agregar una acción de reinicio de datos de ejemplo y restauración de la semilla en `src/components/contabilidad/resumen.js` y `src/contabilidad/almacenamiento.js`
- [ ] T056 [P] Agregar etiquetas accesibles, foco de teclado, `aria-live` y estructura semántica a las vistas contables en `index.html` y `src/components/contabilidad/`
- [ ] T057 Verificar y optimizar el renderizado de listas y reportes con 500 registros en `src/contabilidad/almacenamiento.js` y los componentes contables
- [ ] T058 Ejecutar `npm test` y corregir las pruebas contables que fallen
- [ ] T059 Ejecutar `npm run build` y corregir los errores de compilación
- [ ] T060 Actualizar `README.md` con el uso del módulo contable, los datos de ejemplo y las instrucciones de reinicio
- [ ] T061 [P] Actualizar `specs/002-contabilidad-finanzas/data-model.md` y `er-diagram.md` si la implementación revela cambios en formas de datos o reglas
- [ ] T062 Validar manualmente las seis historias de usuario con `npm run dev`

---

## Dependencias y Orden de Ejecución

### Dependencias entre Fases

- **Configuración (Fase 1)**: Sin dependencias; puede comenzar de inmediato.
- **Fundacional (Fase 2)**: Depende de completar la Fase 1; bloquea todas las historias.
- **Historias de Usuario (Fases 3-8)**: Dependen de completar la Fase 2. Pueden ejecutarse en paralelo si se respetan los archivos compartidos.
- **Pulido (Fase 9)**: Depende de completar todas las historias deseadas.

### Dependencias entre Historias

- **US1 (P1)**: Depende de la semilla y de `src/contabilidad/reportes.js`; no depende de otras historias.
- **US2 (P1)**: Depende de la capa de almacenamiento y validaciones de cuentas; no depende de otras historias.
- **US3 (P1)**: Depende de la semilla de cuentas y periodos; se recomienda después de US2 y US5 para aprovechar cuentas y periodos creados por el usuario, pero puede probarse con la semilla.
- **US4 (P1)**: Depende de las entidades y documentos base; el vínculo con asientos es opcional y se integra mejor después de US3.
- **US5 (P1)**: Depende de la capa de almacenamiento y validaciones de periodos; US3 consume su regla de periodo cerrado.
- **US6 (P2)**: Depende de los asientos y de `src/contabilidad/reportes.js`; se recomienda después de US3, pero puede probarse con la semilla.

### Dentro de Cada Historia

- Las pruebas se escriben primero y deben fallar antes de la implementación.
- Los modelos y validaciones van antes de los servicios de dominio.
- Los servicios de dominio van antes de los controladores de vista.
- La implementación central va antes de la integración con `src/app.js`.

### Archivos Compartidos

- `src/app.js`, `src/styles.css` e `index.html` son compartidos por varias historias; los cambios deben integrarse de forma secuencial para evitar conflictos.
- `src/contabilidad/almacenamiento.js` es la base común; las historias agregan módulos de dominio separados (`cuentas.js`, `asientos.js`, `pagos.js`, `periodos.js`) para reducir conflictos.

---

## Oportunidades Paralelas

- **Fase 1**: T002, T003, T004 y T005 pueden ejecutarse en paralelo.
- **Fase 2**: T006, T007 y T008 pueden ejecutarse en paralelo; T009, T010, T011 y T012 dependen de las utilidades base.
- **US1**: T016, T017 y T018 pueden ejecutarse en paralelo; T020 es independiente.
- **US2**: T021, T022, T023 y T024 pueden ejecutarse en paralelo; T025 integra el dominio y T027 es independiente.
- **US3**: T028, T029, T030 y T031 pueden ejecutarse en paralelo; T032 y T033 integran el dominio; T035 es independiente.
- **US4**: T036, T037, T038 y T039 pueden ejecutarse en paralelo; T040 integra el dominio; T042 es independiente.
- **US5**: T043, T044, T045 y T046 pueden ejecutarse en paralelo; T047 integra el dominio; T049 es independiente.
- **US6**: T050, T051 y T052 pueden ejecutarse en paralelo; T054 es independiente.
- **Fase 9**: T055, T056, T061 y T060 pueden ejecutarse en paralelo; T058, T059 y T062 son la verificación final.

---

## Ejemplo Paralelo: Historia de Usuario 3

```text
# Lanzar juntas las pruebas y componentes de US3:
T028 [US3] Pruebas unitarias de validaciones de asientos
T029 [US3] Pruebas de integración de asientos
T030 [US3] Formulario de asiento
T031 [US3] Listado y detalle de asientos
```

---

## Estrategia de Implementación

### MVP Mínimo (Historia de Usuario 1)

1. Completar Fase 1: Configuración.
2. Completar Fase 2: Fundacional (bloquea todas las historias).
3. Completar Fase 3: US1 - Resumen financiero.
4. **DETENER Y VALIDAR**: Probar US1 de forma independiente.
5. Demostrar el resumen con datos de ejemplo.

### MVP Funcional Recomendado (US1 a US5)

1. Completar Configuración + Fundacional.
2. Implementar US2 (cuentas), US5 (periodos), US3 (asientos), US4 (pagos) y US1 (resumen) en el orden que mejor convenga al equipo.
3. Validar cada historia de forma independiente antes de avanzar.
4. Dejar US6 (reportes, P2) para el siguiente incremento.

### Entrega Incremental

1. Configuración + Fundacional → base lista.
2. US1 → resumen demostrable.
3. US2 → plan de cuentas.
4. US5 → periodos.
5. US3 → asientos con partida doble.
6. US4 → pagos y cobros.
7. US6 → reportes financieros.
8. Pulido → accesibilidad, rendimiento, documentación y verificación final.

---

## Notas

- [P] significa archivos distintos y sin dependencias de tareas incompletas.
- La etiqueta [Historia] permite trazar cada tarea a su historia de usuario.
- Cada historia debe poder completarse y probarse de forma independiente con la semilla determinista.
- La semilla debe ser reiniciable para que pruebas y demostraciones comiencen desde el mismo estado.
- Los montos se manejan como enteros en centavos; la interfaz usa la utilidad de `src/contabilidad/dinero.js`.
- La moneda del MVP es MXN y no se realizan conversiones.
- Los periodos no pueden solaparse, sin importar su estado.
- `AsientoContable.sourceDocumentId` usa `RESTRICT`: no se borra un documento con asientos asociados.
- El plan.md actual conserva referencias al módulo 001 en su sección de estructura; estas tareas usan la estructura real del repositorio y extienden la aplicación existente.
