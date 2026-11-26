
---

description: "Task list for feature implementation"

---

# Tareas: Módulo de Contabilidad y Finanzas

**Entrada**: Documentos de diseño desde `/specs/002-contabilidad-finanzas/` (Historias de Usuario 1 a 31).
**Prerrequisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` y `.specify/memory/constitution.md`.
**Pruebas**: Incluidas porque la constitución exige Vitest para lógica financiera y pruebas de integración con jsdom para flujos de usuario.
**Organización**: Fase 1 de configuración, Fase 2 fundacional, una fase por historia en orden P1 → P2 y cierre con pulido, verificación y convergencia.
**Formato**: `- [X] [TaskID] [P?] [Story?] Descripción con ruta de archivo exacta`.

## Formato de Tareas

- Todo checkbox usa `- [ ]`; se marca `[X]` solo al completar la tarea.
- `[P]` se usa únicamente cuando la tarea no comparte archivo con otra tarea de la misma fase.
- `[USn]` aparece solo en tareas dentro de fases de historia de usuario.
- Cada descripción incluye al menos una ruta de archivo entre comillas invertidas.
- Los ID son secuenciales y únicos en todo el documento.

## Convenciones de Rutas

- Aplicación existente: `src/` y `tests/` en la raíz del repositorio.
- Lógica pura de dominio: `src/contabilidad/`.
- Componentes de interfaz: `src/components/` y `src/components/contabilidad/`.
- Pruebas unitarias: `tests/unit/contabilidad/`.
- Pruebas de integración: `tests/integration/contabilidad/`.
- Documentación de la funcionalidad: `specs/002-contabilidad-finanzas/`.

---

## Fase 1: Configuración (Infraestructura Compartida)

**Propósito**: Verificar estructura, dependencias, contenedores y ayudantes de prueba del módulo.

- [X] T001 Verificar la estructura de módulos y pruebas en `src/contabilidad/`, `src/components/`, `src/components/contabilidad/`, `tests/unit/contabilidad/` y `tests/integration/contabilidad/`
- [X] T002 Verificar dependencias de Vite, Vitest y jsdom en `package.json`
- [X] T003 Verificar los scripts `dev`, `build`, `test` y `preview` en `package.json`
- [X] T004 Verificar los contenedores de acceso, menú, panel por rol, reportes y vistas financieras en `index.html`
- [X] T005 Verificar los tokens base de paleta, tipografía, tablas y estados vacíos en `src/styles.css`
- [X] T006 Verificar los ayudantes de reinicio de sesión y semilla determinista en `tests/setup/contabilidad.js`

---

## Fase 2: Fundacional (Prerrequisitos Bloqueantes)

**Propósito**: Implementar la infraestructura compartida que bloquea todas las historias de usuario.

**CRÍTICO**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [X] T007 [P] Implementar conversión a centavos, suma centralizada `sumarCentavos` y formato CLP en `src/contabilidad/dinero.js`
- [X] T008 [P] Implementar validación, comparación y formateo de fechas en `src/contabilidad/fechas.js`
- [X] T009 [P] Implementar ayudantes compartidos de errores, mensajes, formato de tablas y paginación en `src/components/contabilidad/comun.js`
- [X] T010 Implementar la capa central de almacenamiento en `sessionStorage`, claves de contabilidad/acceso/auditoría, migración desde `localStorage` y reinicio en `src/contabilidad/almacenamiento.js`
- [X] T011 [P] Implementar el catálogo de roles con panel de inicio, permisos y acciones de panel en `src/contabilidad/roles.js`
- [X] T012 [P] Implementar los cuatro usuarios de prueba con normalización de RUT en `src/contabilidad/usuarios.js`
- [X] T013 [P] Implementar la matriz de permisos y derivación de opciones de menú en `src/contabilidad/permisos.js`
- [X] T014 Implementar creación, lectura, copia de permisos y cierre de sesión en `src/contabilidad/sesion.js`
- [X] T015 [P] Implementar validación de RUT, credenciales y mensajes de acceso en `src/contabilidad/validaciones-acceso.js`
- [X] T016 Implementar la semilla determinista de cuentas, periodos, asientos aprobados, pagos, entidades, documentos, usuarios, roles y eventos de auditoría en `src/contabilidad/semilla.js`
- [X] T017 [P] Implementar validaciones compartidas de cuentas, asientos, pagos y periodos en `src/contabilidad/validaciones-cuentas.js`, `src/contabilidad/validaciones-asientos.js`, `src/contabilidad/validaciones-pagos.js` y `src/contabilidad/validaciones-periodos.js`
- [X] T018 Implementar cálculos base de resumen, saldos, movimientos y totales en `src/contabilidad/reportes.js`
- [X] T019 Extender `src/app.js` con registro de módulos, cambio de vista, sesión activa, inicialización de semilla y guardas de permisos
- [X] T020 [P] Agregar pruebas unitarias de dinero y fechas en `tests/unit/contabilidad/dinero.test.js` y `tests/unit/contabilidad/fechas.test.js`
- [X] T021 [P] Agregar pruebas unitarias de almacenamiento y semilla en `tests/unit/contabilidad/almacenamiento.test.js` y `tests/unit/contabilidad/semilla.test.js`
- [X] T022 [P] Agregar pruebas unitarias de usuarios, roles, permisos y sesión en `tests/unit/contabilidad/usuarios.test.js`, `tests/unit/contabilidad/roles.test.js`, `tests/unit/contabilidad/permisos.test.js` y `tests/unit/contabilidad/sesion.test.js`
- [X] T023 Agregar prueba de integración base de arranque, persistencia y semilla en `tests/integration/contabilidad/base.test.js`
- [X] T024 [P] Agregar prueba de integración que verifique ausencia de peticiones de red y uso exclusivo de `sessionStorage` en `tests/integration/contabilidad/almacenamiento-sesion.test.js`
- [X] T025 Sustituir sumas directas por `sumarCentavos` en `src/contabilidad/reportes.js` y `src/contabilidad/resumen-pagos.js`
- [X] T026 Implementar agregaciones incrementales reutilizables en `src/contabilidad/reportes.js` y `src/contabilidad/resumen-pagos.js`

**Punto de control**: La infraestructura contable, de acceso, almacenamiento, semilla y cálculo está lista; las historias pueden comenzar.

---

## Fase 3: Historia de Usuario 1 - Consultar el resumen financiero (Prioridad: P1) - MVP

**Objetivo**: Mostrar ingresos, gastos y resultado filtrables por periodo, con tabla de gastos por cuenta y estado vacío (FR-001–FR-002, FR-038, FR-044).

**Prueba independiente**: Abrir "Resumen financiero" con semilla cargada, ver indicadores y la tabla "Gastos por cuenta" debajo de las tarjetas, cambiar el periodo y comprobar el mensaje de estado vacío sin movimientos.

### Pruebas para US1

- [X] T027 [P] [US1] Crear `tests/unit/contabilidad/gastos-por-cuenta.test.js` con casos de jerarquía, acumulación, ceros y importes en centavos per `specs/002-contabilidad-finanzas/data-model.md`, `spec.md` FR-002
- [X] T028 [P] [US1] Extender `tests/integration/contabilidad/resumen.test.js` para exigir la tabla "Gastos por cuenta" con columnas Cuenta, Monto y Porcentaje, solo cuentas de gasto con movimientos aprobados del periodo y estado vacío per `spec.md` HU1, FR-002, SC-004
- [X] T029 [P] [US1] Agregar pruebas unitarias del resumen financiero en `tests/unit/contabilidad/reportes-resumen.test.js`
- [X] T030 [P] [US1] Agregar pruebas de integración del panel, filtro por periodo y estado vacío en `tests/integration/contabilidad/resumen.test.js`

### Implementación para US1

- [X] T031 [US1] Implementar `calcularGastosPorCuenta()` en `src/contabilidad/reportes.js` reutilizando movimientos aprobados, jerarquía de cuentas y `sumarCentavos` de `src/contabilidad/dinero.js` per `specs/002-contabilidad-finanzas/data-model.md`, `specs/002-contabilidad-finanzas/contracts/dashboard-charts.md`
- [X] T032 [P] [US1] Crear el componente de tabla "Gastos por cuenta" en `src/components/contabilidad/resumen.js` con columnas Cuenta, Monto y Porcentaje per `spec.md` HU1, FR-002
- [X] T033 [US1] Ubicar la tabla "Gastos por cuenta" inmediatamente debajo de las tarjetas de indicadores en `src/components/contabilidad/resumen.js` e `index.html`, conservando el selector de periodo per `spec.md` HU1
- [X] T034 [US1] Conectar la tabla con el evento de periodo y el cálculo de reportes en `src/app.js` y `src/components/contabilidad/resumen.js`, aplicando `formatearCLP` de `src/contabilidad/dinero.js`
- [X] T035 [US1] Agregar estilos de tabla, alineación monetaria y estado vacío en `src/styles.css` per `spec.md` HU1, FR-002, FR-044
- [X] T036 [P] [US1] Crear el componente de resumen con indicadores y selector de periodo en `src/components/contabilidad/resumen.js`
- [X] T037 [US1] Conectar el resumen con `src/contabilidad/reportes.js` y el evento de periodo en `src/app.js`
- [X] T038 [US1] Agregar estilos de tarjetas e indicadores en `src/styles.css`
- [X] T039 [US1] Agregar mensajes de estado vacío accesibles en `src/components/contabilidad/resumen.js`

**Punto de control**: US1 es funcional y verificable de forma independiente.

---

## Fase 4: Historia de Usuario 2 - Gestionar cuentas contables (Prioridad: P1)

**Objetivo**: Crear, consultar, editar y organizar jerárquicamente las cuentas del plan contable (FR-003–FR-006).

**Prueba independiente**: Crear una cuenta raíz y una subcuenta, editarlas y rechazar código duplicado o campos obligatorios vacíos.

### Pruebas para US2

- [X] T040 [P] [US2] Agregar pruebas unitarias de jerarquía, tipo y código duplicado en `tests/unit/contabilidad/validaciones-cuentas.test.js`
- [X] T041 [P] [US2] Agregar pruebas de integración de alta, edición y listado jerárquico en `tests/integration/contabilidad/cuentas.test.js`

### Implementación para US2

- [X] T042 [P] [US2] Crear el formulario de cuentas en `src/components/contabilidad/cuenta-form.js`
- [X] T043 [P] [US2] Crear el listado jerárquico de cuentas en `src/components/contabilidad/cuenta-list.js`
- [X] T044 [US2] Implementar CRUD y persistencia de la jerarquía en `src/contabilidad/cuentas.js`
- [X] T045 [US2] Implementar validaciones de cuenta, ciclo y baja protegida en `src/contabilidad/validaciones-cuentas.js`
- [X] T046 [US2] Conectar vistas y validaciones en `src/app.js`
- [X] T047 [US2] Agregar estilos de formulario, listado jerárquico y estados vacíos en `src/styles.css`

**Punto de control**: US2 es funcional y verificable de forma independiente.

---

## Fase 5: Historia de Usuario 3 - Registrar asientos contables (Prioridad: P1)

**Objetivo**: Registrar asientos con líneas de débito/crédito, partida doble y ciclo borrador → aprobado → cancelado (FR-007–FR-012, FR-031).

**Prueba independiente**: Crear un asiento, guardar solo cuando cuadre, rechazar menos de dos líneas, conservar cancelados y bloquear edición de aprobados.

### Pruebas para US3

- [X] T048 [P] [US3] Agregar pruebas unitarias de partida doble, líneas mínimas y estados de asiento en `tests/unit/contabilidad/validaciones-asientos.test.js`
- [X] T049 [P] [US3] Agregar pruebas de integración de alta, desbalance, aprobación, cancelación y conservación en `tests/integration/contabilidad/asientos.test.js`

### Implementación para US3

- [X] T050 [P] [US3] Crear el formulario de asiento con líneas dinámicas en `src/components/contabilidad/asiento-form.js`
- [X] T051 [P] [US3] Crear el listado y detalle de asientos en `src/components/contabilidad/asiento-list.js`
- [X] T052 [US3] Implementar CRUD de asientos, recálculo de totales y ciclo de estados en `src/contabilidad/asientos.js`
- [X] T053 [US3] Implementar validaciones de asiento y línea en `src/contabilidad/validaciones-asientos.js`
- [X] T054 [US3] Conectar formulario, listado y acciones en `src/app.js`
- [X] T055 [US3] Agregar estilos de líneas, totales y estados en `src/styles.css`

**Punto de control**: US3 es funcional y verificable de forma independiente.

---

## Fase 6: Historia de Usuario 4 - Registrar y consultar pagos (Prioridad: P1)

**Objetivo**: Registrar pagos y cobros con fecha de vencimiento, entidad, documento opcional y detalle consultable (FR-013–FR-016).

**Prueba independiente**: Guardar un pago con campos obligatorios, asociarlo a una entidad/documento y consultarlo en el listado sin abandonar la pantalla permitida.

### Pruebas para US4

- [X] T056 [P] [US4] Agregar pruebas unitarias de pagos, fecha de vencimiento y relaciones en `tests/unit/contabilidad/validaciones-pagos.test.js`
- [X] T057 [P] [US4] Agregar pruebas de integración de alta, listado y detalle de pagos en `tests/integration/contabilidad/pagos.test.js`

### Implementación para US4

- [X] T058 [P] [US4] Crear el formulario de pagos con selección contextual de entidad y documento en `src/components/contabilidad/pago-form.js`
- [X] T059 [P] [US4] Crear el listado y detalle de pagos en `src/components/contabilidad/pago-list.js`
- [X] T060 [US4] Implementar CRUD de pagos y vínculo opcional con asiento en `src/contabilidad/pagos.js`
- [X] T061 [US4] Implementar validaciones de pago, serie/folio y vencimiento en `src/contabilidad/validaciones-pagos.js`
- [X] T062 [US4] Conectar vistas, validaciones y almacenamiento en `src/app.js`
- [X] T063 [US4] Agregar estilos de formulario, tabla y detalle de pagos en `src/styles.css`

**Punto de control**: US4 es funcional y verificable de forma independiente.

---

## Fase 7: Historia de Usuario 5 - Gestionar periodos contables (Prioridad: P1)

**Objetivo**: Crear periodos no superpuestos, listar su estado y abrirlos o cerrarlos en el flujo básico (FR-017–FR-021, FR-033).

**Prueba independiente**: Crear un periodo válido, rechazar rango invertido o solapado y verificar que el cierre básico impida nuevos asientos.

### Pruebas para US5

- [X] T064 [P] [US5] Agregar pruebas unitarias de fechas, solapamiento y cierre en `tests/unit/contabilidad/validaciones-periodos.test.js`
- [X] T065 [P] [US5] Agregar pruebas de integración de alta, listado y cambio de estado en `tests/integration/contabilidad/periodos.test.js`

### Implementación para US5

- [X] T066 [P] [US5] Crear el formulario de periodos en `src/components/contabilidad/periodo-form.js`
- [X] T067 [P] [US5] Crear el listado de periodos con estado visible en `src/components/contabilidad/periodo-list.js`
- [X] T068 [US5] Implementar CRUD y apertura/cierre básico de periodos en `src/contabilidad/periodos.js`
- [X] T069 [US5] Implementar validaciones de rango y solapamiento en `src/contabilidad/validaciones-periodos.js`
- [X] T070 [US5] Conectar vistas y validaciones en `src/app.js`
- [X] T071 [US5] Agregar estilos de estado abierto/cerrado en `src/styles.css`

**Punto de control**: US5 es funcional y verificable de forma independiente.

---

## Fase 8: Historia de Usuario 8 - Iniciar sesión con RUT y contraseña (Prioridad: P1)

**Objetivo**: Autenticar cuatro usuarios de prueba con RUT/contraseña, mostrar panel por rol, error genérico y cierre de sesión (FR-040–FR-052).

**Prueba independiente**: Los cuatro usuarios inician sesión, ven su panel, cierran sesión y requieren nueva autenticación para volver.

### Pruebas para US8

- [X] T072 [P] [US8] Agregar pruebas unitarias de normalización de RUT y autenticación en `tests/unit/contabilidad/acceso-roles.test.js`
- [X] T073 [P] [US8] Agregar pruebas de integración de cuatro roles, errores y cierre de sesión en `tests/integration/contabilidad/acceso-roles.test.js`

### Implementación para US8

- [X] T074 [P] [US8] Crear la pantalla de acceso con RUT y contraseña en `src/components/acceso.js`
- [X] T075 [US8] Implementar el flujo iniciarSesion/cerrarSesion en `src/contabilidad/sesion.js`
- [X] T076 [P] [US8] Crear los cuatro paneles iniciales por rol en `src/components/panel-por-rol.js`
- [X] T077 [US8] Conectar acceso, sesión y panel en `src/app.js`
- [X] T078 [US8] Agregar mensaje "RUT o contraseña incorrectos" y campos obligatorios en `src/contabilidad/validaciones-acceso.js`
- [X] T079 [US8] Agregar estilos de acceso y paneles por rol en `src/styles.css`

**Punto de control**: US8 es funcional y verificable de forma independiente.

---

## Fase 9: Historia de Usuario 9 - Aplicar permisos por rol en el menú (Prioridad: P1)

**Objetivo**: Mostrar solo secciones permitidas y bloquear intentos de acceso ajenos al rol (FR-053–FR-065).

**Prueba independiente**: Cada rol ve exactamente su menú; un intento directo a otra sección muestra acceso no disponible sin revelar información.

### Pruebas para US9

- [X] T080 [P] [US9] Agregar pruebas unitarias de matriz por rol en `tests/unit/contabilidad/permisos.test.js`
- [X] T081 [P] [US9] Agregar pruebas de integración de menú filtrado y bloqueo en `tests/integration/contabilidad/permisos.test.js`

### Implementación para US9

- [X] T082 [US9] Ajustar matriz y acciones por rol en `src/contabilidad/permisos.js`
- [X] T083 [P] [US9] Crear el menú filtrado por permisos en `src/components/menu.js`
- [X] T084 [US9] Aplicar permisos y acciones al panel por rol en `src/components/panel-por-rol.js`
- [X] T085 [US9] Implementar guarda de rutas internas en `src/app.js`
- [X] T086 [US9] Ocultar opciones no permitidas en `src/components/shell.js`
- [X] T087 [US9] Agregar estilos de menú filtrado y mensajes de bloqueo en `src/styles.css`

**Punto de control**: US9 es funcional y verificable de forma independiente.

---

## Fase 10: Historia de Usuario 10 - Cargar y restablecer datos de ejemplo (Prioridad: P1)

**Objetivo**: Permitir al Administrador cargar semilla determinista y restablecer estado inicial con confirmación (FR-066–FR-078).

**Prueba independiente**: El Administrador carga dos veces la semilla sin duplicados, restablece conservando usuarios y cancels una confirmación sin cambios.

### Pruebas para US10

- [X] T088 [P] [US10] Agregar pruebas unitarias de requisitos mínimos, ocho asientos aprobados y determinismo en `tests/unit/contabilidad/semilla-datos-ejemplo.test.js`
- [X] T089 [P] [US10] Agregar pruebas de integración de carga, reemplazo, restablecimiento y visibilidad por rol en `tests/integration/contabilidad/semilla-datos-ejemplo.test.js`

### Implementación para US10

- [X] T090 [US10] Ampliar la semilla con al menos cuatro periodos, ocho cuentas, ocho asientos aprobados, pagos en tres estados y eventos de auditoría en `src/contabilidad/semilla.js`
- [X] T091 [US10] Implementar reemplazo atómico y restablecimiento que conserva usuarios/roles en `src/contabilidad/almacenamiento.js`
- [X] T092 [P] [US10] Agregar botones "Cargar datos de ejemplo" y "Restablecer datos" al panel del Administrador en `src/components/panel-por-rol.js`
- [X] T093 [P] [US10] Agregar confirmaciones y mensajes de resultado en `src/components/contabilidad/comun.js`
- [X] T094 [US10] Conectar acciones de semilla y restauración en `src/app.js`
- [X] T095 [US10] Agregar estilos de botones y confirmaciones en `src/styles.css`

**Punto de control**: US10 es funcional y verificable de forma independiente.

---

## Fase 11: Historia de Usuario 11 - Simplificar el menú y eliminar navegación duplicada (Prioridad: P1)

**Objetivo**: Quitar Entidades, Documentos y Búsqueda y garantizar un único control visible por pantalla (FR-079–FR-087).

**Prueba independiente**: Ningún rol ve esas secciones, cada pantalla tiene un solo acceso y los intentos directos muestran "Sección no disponible".

### Pruebas para US11

- [X] T096 [P] [US11] Agregar pruebas unitarias del mapa navegación-control en `tests/unit/contabilidad/navegacion.test.js`
- [X] T097 [P] [US11] Agregar pruebas de integración de menú sin secciones eliminadas y sin duplicados en `tests/integration/contabilidad/navegacion.test.js`

### Implementación para US11

- [X] T098 [US11] Aplicar mapa de navegación única en `src/components/menu.js`
- [X] T099 [P] [US11] Eliminar entradas de Entidades, Documentos y Búsqueda en `index.html` y `src/components/shell.js`
- [X] T100 [US11] Quitar accesos directos duplicados del panel en `src/components/panel-por-rol.js`
- [X] T101 [US11] Implementar mensaje "Sección no disponible" para destinos eliminados en `src/app.js`
- [X] T102 [US11] Mantener selección contextual de entidades y documentos en `src/components/contabilidad/pago-form.js`
- [X] T103 [US11] Ajustar estilos de menú, panel y acciones en `src/styles.css`

**Punto de control**: US11 es funcional y verificable de forma independiente.

---

## Fase 12: Historia de Usuario 12 - Resumir pagos por estado (Prioridad: P1)

**Objetivo**: Mostrar cantidad y total CLP por pendiente, pagado y vencido, con filtro dentro de Pagos y cobros (FR-088–FR-101).

**Prueba independiente**: Con semilla cargada, los totales coinciden con el listado filtrado; un pago vencido deja de contarse como pendiente y el cambio a pagado es inmediato.

### Pruebas para US12

- [X] T104 [P] [US12] Agregar pruebas unitarias de EstadoPago y ResumenPagos en `tests/unit/contabilidad/resumen-pagos.test.js`
- [X] T105 [P] [US12] Agregar pruebas de integración de resumen, filtros y marcar pagado en `tests/integration/contabilidad/resumen-pagos.test.js`

### Implementación para US12

- [X] T106 [P] [US12] Implementar clasificación y agregación en centavos en `src/contabilidad/resumen-pagos.js`
- [X] T107 [P] [US12] Crear el componente de resumen y filtro en `src/components/contabilidad/pago-resumen.js`
- [X] T108 [US12] Integrar resumen y filtro en `src/components/contabilidad/pago-list.js`
- [X] T109 [US12] Agregar marcarPagado y normalización de estados heredados en `src/contabilidad/pagos.js`
- [X] T110 [US12] Conectar eventos de filtro y cambio de estado en `src/app.js`
- [X] T111 [US12] Agregar estados vacíos y estilos del resumen en `src/styles.css`
- [X] T112 [US12] Restringir resumen y filtro a los roles con acceso a pagos en `src/contabilidad/permisos.js`

**Punto de control**: US12 es funcional y verificable de forma independiente.

---

## Fase 13: Historia de Usuario 13 - Generar estados financieros por periodo (Prioridad: P1)

**Objetivo**: Generar Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General desde asientos aprobados (FR-105–FR-126).

**Prueba independiente**: El Contador selecciona un periodo con asientos aprobados, genera los cuatro reportes desde "Reportes financieros" y verifica saldos, totales, advertencias y mensajes vacíos.

### Pruebas para US13

- [X] T113 [P] [US13] Agregar pruebas unitarias de los cuatro reportes, saldos iniciales y exclusiones en `tests/unit/contabilidad/estados-financieros.test.js`
- [X] T114 [P] [US13] Agregar pruebas de integración de pestañas, periodo, permisos y estados vacíos en `tests/integration/contabilidad/estados-financieros.test.js`

### Implementación para US13

- [X] T115 [P] [US13] Implementar `libroMayor` con saldo inicial derivado de aprobados anteriores en `src/contabilidad/reportes.js`
- [X] T116 [P] [US13] Implementar `balanceComprobacion` con saldos deudores/acreedores y validación de igualdad en `src/contabilidad/reportes.js`
- [X] T117 [P] [US13] Implementar `estadoResultados` con ingresos, gastos y resultado en `src/contabilidad/reportes.js`
- [X] T118 [P] [US13] Implementar `balanceGeneral` con activos, pasivos, patrimonio y resultado acumulado en `src/contabilidad/reportes.js`
- [X] T119 [US13] Agregar helper de cuentas no clasificables y advertencias en `src/contabilidad/reportes.js`
- [X] T120 [US13] Crear las cuatro pestañas de reportes financieros en `src/components/contabilidad/reportes.js`
- [X] T121 [US13] Conectar selector de periodo y regeneración de reportes en `src/app.js`
- [X] T122 [US13] Aplicar formato CLP, estados vacíos y advertencias accesibles en `src/components/contabilidad/reportes.js`
- [X] T123 [US13] Bloquear captura manual de cifras y acciones de modificación en `src/components/contabilidad/reportes.js`
- [X] T124 [US13] Agregar estilos de pestañas, totales y advertencias en `src/styles.css`

**Punto de control**: US13 es funcional y verificable de forma independiente sin nueva opción de menú.

---

## Fase 14: Historia de Usuario 14 - Cerrar un periodo contable (Prioridad: P1)

**Objetivo**: Cerrar periodos con confirmación y conservar registros sin modificarlos (FR-127–FR-147).

**Prueba independiente**: El Administrador cierra un periodo abierto, confirma la acción y verifica que no sea posible registrar, editar, eliminar ni cambiar el estado de asientos o pagos de ese periodo.

### Pruebas para US14

- [X] T125 [P] [US14] Agregar pruebas unitarias de cierre, confirmación cancelada y bloqueo por periodo en `tests/unit/contabilidad/periodos.test.js`
- [X] T126 [P] [US14] Agregar pruebas de integración de cierre exitoso, cancelado y repetido en `tests/integration/contabilidad/cierre-periodo.test.js`

### Implementación para US14

- [X] T127 [US14] Implementar `cerrarPeriodo(id)` con validación de periodo seleccionado, ya cerrado y conservación de registros en `src/contabilidad/periodos.js`
- [X] T128 [US14] Implementar `periodoAbiertoPorFecha(fecha)` para reutilizar en escrituras en `src/contabilidad/validaciones-periodos.js`
- [X] T129 [US14] Bloquear registro, edición, eliminación y cambio de estado de asientos en `src/contabilidad/asientos.js`
- [X] T130 [US14] Bloquear registro, edición, marcar pagado y eliminación de pagos en `src/contabilidad/pagos.js`
- [X] T131 [US14] Bloquear cambios de fecha desde o hacia periodos cerrados en `src/contabilidad/validaciones-asientos.js` y `src/contabilidad/validaciones-pagos.js`
- [X] T132 [US14] Rechazar guardados de formularios abiertos cuando el periodo se cerró antes del guardado en `src/app.js`
- [X] T133 [US14] Agregar acción de cierre solo para Administrador en `src/components/contabilidad/periodo-list.js`
- [X] T134 [US14] Mostrar mensaje claro de periodo cerrado en `src/components/contabilidad/comun.js`
- [X] T135 [US14] Ajustar visibilidad de acciones de modificación en periodos cerrados en `src/components/contabilidad/asiento-list.js` y `src/components/contabilidad/pago-list.js`
- [X] T136 [US14] Agregar estilos de periodos cerrados y mensajes de bloqueo en `src/styles.css`

**Punto de control**: US14 es funcional y verificable de forma independiente.

---

## Fase 15: Historia de Usuario 15 - Cerrar un periodo contable para bloquear movimientos (Prioridad: P1)

**Objetivo**: Reforzar el cierre con bloqueo integral para todos los roles,alta de datos coherente y consulta de solo lectura (FR-148–FR-163).

**Prueba independiente**: El Administrador cierra un periodo y se comprueba que ningún rol pueda alterar movimientos, que la semilla no registre datos en cerrados y que los reportes sigan disponibles.

### Pruebas para US15

- [X] T137 [P] [US15] Agregar pruebas unitarias de bloqueo para todos los roles y semilla en periodos cerrados en `tests/unit/contabilidad/cierre-periodo-integral.test.js`
- [X] T138 [P] [US15] Agregar pruebas de integración de acceso directo, consulta de cerrados y ausencia de acciones en `tests/integration/contabilidad/cierre-periodo-integral.test.js`

### Implementación para US15

- [X] T139 [US15] Aplicar el bloqueo de periodo cerrado también al Administrador en `src/contabilidad/validaciones-periodos.js`
- [X] T140 [US15] Impedir que la carga de semilla cree asientos o pagos en periodos cerrados en `src/contabilidad/semilla.js`
- [X] T141 [US15] Bloquear ejecución directa de cierre para roles no autorizados en `src/contabilidad/permisos.js`
- [X] T142 [US15] Mostrar mensaje "acceso no disponible" para cierre directo no autorizado en `src/components/contabilidad/comun.js`
- [X] T143 [US15] Conservar listados y reportes de periodos cerrados sin acciones de modificación en `src/components/contabilidad/reportes.js`
- [X] T144 [US15] Verificar que cerrar un periodo no altere otros periodos en `src/contabilidad/periodos.js`
- [X] T145 [US15] Conectar revalidación de cierre en eventos de guardado de `src/app.js`
- [X] T146 [US15] Agregar estilos de solo lectura para movimientos de periodos cerrados en `src/styles.css`

**Punto de control**: US15 cierra la capacidad de cierre sin duplicar una segunda opción de menú.

---

## Fase 16: Historia de Usuario 16 - Registrar trazabilidad de creación, edición y anulación (Prioridad: P1)

**Objetivo**: Persistir eventos inmutables de auditoría y permitir consulta solo al Auditor (FR-164–FR-189).

**Prueba independiente**: El Auditor consulta el historial consolidado y por movimiento, filtra eventos, comprueba que no se puedan modificar y verifica semilla/restablecimiento deterministas.

### Pruebas para US16

- [X] T147 [P] [US16] Agregar pruebas unitarias de generación de eventos, diff y anulación duplicada en `tests/unit/contabilidad/auditoria.test.js`
- [X] T148 [P] [US16] Agregar pruebas de integración de historial, filtros y permisos en `tests/integration/contabilidad/registro-actividad.test.js`

### Implementación para US16

- [X] T149 [US16] Definir la colección append-only `RegistroActividad` y su clave en `src/contabilidad/almacenamiento.js`
- [X] T150 [US16] Implementar `registrarEvento` con usuario, rol, acción, fecha/hora, tipo/movimiento y campos modificados en `src/contabilidad/auditoria.js`
- [X] T151 [US16] Emitir eventos solo tras escrituras exitosas de asientos en `src/contabilidad/asientos.js`
- [X] T152 [US16] Emitir eventos solo tras escrituras exitosas de pagos en `src/contabilidad/pagos.js`
- [X] T153 [US16] Implementar cálculo de campos modificados y prevención de eventos vacíos en `src/contabilidad/auditoria.js`
- [X] T154 [US16] Evitar segundo evento de anulación en `src/contabilidad/auditoria.js`
- [X] T155 [US16] Generar eventos deterministas de creación, edición y anulación en la semilla de `src/contabilidad/semilla.js`
- [X] T156 [US16] Crear el historial por movimiento en `src/components/contabilidad/registro-actividad.js`
- [X] T157 [US16] Agregar la consulta consolidada dentro de "Reportes financieros" en `src/components/contabilidad/reportes.js`
- [X] T158 [US16] Agregar filtros locales por tipo de movimiento, acción y usuario en `src/components/contabilidad/registro-actividad.js`
- [X] T159 [US16] Restringir consulta directa al rol Auditor en `src/contabilidad/permisos.js`
- [X] T160 [US16] Agregar estados vacíos y estilos de historial en `src/styles.css`

**Punto de control**: US16 es funcional y verificable sin nueva opción de menú.

---

## Fase 17: Historia de Usuario 17 - Alertas de vencimientos de pagos en el panel (Prioridad: P1)

**Objetivo**: Mostrar alertas de vencidos y de vencimientos de la semana actual solo en el panel del Tesorero (FR-190–FR-213).

**Prueba independiente**: El Tesorero inicia sesión con semilla cargada y verifica ambas alertas con cantidades, totales CLP, detalle acotado y coherencia con Pagos y cobros.

### Pruebas para US17

- [X] T161 [P] [US17] Agregar pruebas unitarias de categorías excluyentes, semana lunes-domingo y exclusión de pagados/anulados en `tests/unit/contabilidad/alertas-vencimientos.test.js`
- [X] T162 [P] [US17] Agregar pruebas de integración del panel del Tesorero y permisos en `tests/integration/contabilidad/alertas-vencimientos.test.js`

### Implementación para US17

- [X] T163 [US17] Implementar `alertasDeVencimientos(pagos, entidades, fechaReferencia)` en `src/contabilidad/alertas-vencimientos.js`
- [X] T164 [US17] Definir precedencia de categorías y límite de detalle en `src/contabilidad/alertas-vencimientos.js`
- [X] T165 [US17] Incluir pagos relativos a la fecha de referencia en la semilla de `src/contabilidad/semilla.js`
- [X] T166 [US17] Renderizar alertas de vencidos y semana actual en `src/components/dashboard.js`
- [X] T167 [US17] Mostrar cantidad, total CLP, entidad, monto, vencimiento y pagos adicionales en `src/components/dashboard.js`
- [X] T168 [US17] Agregar estado sin alertas sin cifras engañosas en `src/components/dashboard.js`
- [X] T169 [US17] Actualizar alertas tras registrar, editar, pagar, anular o cambiar vencimiento en `src/app.js`
- [X] T170 [US17] Mostrar alertas únicamente al Tesorero en `src/contabilidad/permisos.js`
- [X] T171 [US17] Evitar opción de menú o acceso duplicado a Pagos y cobros en `src/components/menu.js`
- [X] T172 [US17] Agregar estilos de alertas y detalle acotado en `src/styles.css`

**Punto de control**: US17 es funcional y verificable sin nueva navegación.

---

## Fase 18: Historia de Usuario 19 - Exportar reportes financieros a PDF y Excel (Prioridad: P1)

**Objetivo**: Exportar cada reporte a PDF y Excel desde el mismo modelo de pantalla (FR-230–FR-253).

**Prueba independiente**: El Contador abre cada reporte, descarga ambos formatos y comprueba empresa, periodo, fecha, totales, cifras idénticas a pantalla y ausencia de efectos en el módulo.

### Pruebas para US19

- [X] T173 [P] [US19] Agregar pruebas unitarias del modelo de exportación y generadores de archivo en `tests/unit/contabilidad/exportacion-reportes.test.js`
- [X] T174 [P] [US19] Agregar pruebas de integración de botones, descarga, errores y permisos en `tests/integration/contabilidad/exportacion.test.js`

### Implementación para US19

- [X] T175 [US19] Construir `modeloExportacion` común desde los reportes activos en `src/contabilidad/exportacion-reportes.js`
- [X] T176 [US19] Implementar generador de PDF mínimo sin dependencias en `src/contabilidad/exportacion-reportes.js`
- [X] T177 [US19] Implementar generador de Excel SpreadsheetML `.xls` sin dependencias en `src/contabilidad/exportacion-reportes.js`
- [X] T178 [US19] Implementar descarga vía `Blob` y `URL.createObjectURL` en `src/contabilidad/exportacion-reportes.js`
- [X] T179 [US19] Incluir nombre exacto de la empresa, periodo y fecha de generación en `src/contabilidad/exportacion-reportes.js`
- [X] T180 [US19] Bloquear exportación cuando el reporte sea inválido y mostrar advertencia en `src/contabilidad/exportacion-reportes.js`
- [X] T181 [US19] Crear botones "Exportar PDF" y "Exportar Excel" en `src/components/contabilidad/exportacion.js`
- [X] T182 [US19] Integrar botones en las cuatro pestañas de `src/components/contabilidad/reportes.js`
- [X] T183 [US19] Mostrar mensaje claro de error de descarga en `src/components/contabilidad/exportacion.js`
- [X] T184 [US19] Ocultar botones para roles sin acceso a reportes en `src/contabilidad/permisos.js`
- [X] T185 [US19] Agregar estilos de botones y advertencias en `src/styles.css`

**Punto de control**: US19 es funcional y verificable sin modificar datos ni crear menú adicional.

---

## Fase 19: Historia de Usuario 20 - Filtros de asientos y pagos (Prioridad: P1)

**Objetivo**: Filtrar asientos y pagos por fecha, cuenta, monto y estado sin búsqueda global (FR-254–FR-283).

**Prueba independiente**: El usuario aplica filtros individuales y combinados, verifica límites inclusivos, mensajes inválidos y limpieza sin modificar registros.

### Pruebas para US20

- [X] T186 [P] [US20] Agregar pruebas unitarias de combinación AND, rangos inclusivos y validaciones en `tests/unit/contabilidad/filtros-movimientos.test.js`
- [X] T187 [P] [US20] Agregar pruebas de integración de filtros en asientos y pagos en `tests/integration/contabilidad/filtros-listados.test.js`

### Implementación para US20

- [X] T188 [US20] Implementar `filtrarAsientos` y `filtrarPagos` en `src/contabilidad/filtros-movimientos.js`
- [X] T189 [US20] Implementar filtro de cuenta de asientos por líneas en `src/contabilidad/filtros-movimientos.js`
- [X] T190 [US20] Implementar filtro de cuenta de pagos mediante asiento relacionado en `src/contabilidad/filtros-movimientos.js`
- [X] T191 [US20] Implementar validación de rangos de fecha y monto en centavos en `src/contabilidad/filtros-movimientos.js`
- [X] T192 [US20] Unificar opciones de estado de pagos con el resumen existente en `src/contabilidad/filtros-movimientos.js`
- [X] T193 [US20] Crear controles de filtros de asientos en `src/components/contabilidad/asiento-list.js`
- [X] T194 [US20] Crear controles de filtros de pagos en `src/components/contabilidad/pago-list.js`
- [X] T195 [US20] Agregar conteo de resultados, limpieza total e individual en `src/components/contabilidad/comun.js`
- [X] T196 [US20] Conectar restablecimiento de filtros con carga/restablecimiento de semilla en `src/app.js`
- [X] T197 [US20] Restringir filtros según permisos del listado en `src/contabilidad/permisos.js`
- [X] T198 [US20] Agregar estilos de filtros, mensajes inválidos y estado vacío en `src/styles.css`

**Punto de control**: US20 es funcional y verificable sin pantalla de búsqueda global.

---

## Fase 20: Historia de Usuario 21 - Interfaz profesional del módulo (Prioridad: P1)

**Objetivo**: Aplicar paleta, íconos, tablas ordenables, confirmaciones y menú móvil sin cambiar reglas de negocio (FR-284–FR-313).

**Prueba independiente**: El usuario recorre el módulo en escritorio y celular, verifica colores e íconos, ordena tablas y confirma guardados y eliminaciones.

### Pruebas para US21

- [X] T199 [P] [US21] Agregar pruebas unitarias de tokens de interfaz, íconos y comparadores de tabla en `tests/unit/contabilidad/interfaz-config.test.js`
- [X] T200 [P] [US21] Agregar pruebas de integración de tablas, confirmaciones y menú móvil en `tests/integration/contabilidad/interfaz-profesional.test.js`

### Implementación para US21

- [X] T201 [P] [US21] Definir tokens de color y estados en `src/contabilidad/interfaz-config.js`
- [X] T202 [P] [US21] Definir mapa único de íconos por sección en `src/contabilidad/interfaz-config.js`
- [X] T203 [US21] Aplicar tokens de paleta a componentes y mensajes en `src/styles.css`
- [X] T204 [US21] Mostrar íconos en menú y encabezados desde `src/components/menu.js` y `src/components/shell.js`
- [X] T205 [US21] Implementar comparadores de ordenación por fecha, monto y estado en `src/components/contabilidad/comun.js`
- [X] T206 [US21] Habilitar ordenación ascendente/descendente en listados de `src/components/contabilidad/cuenta-list.js`, `src/components/contabilidad/asiento-list.js`, `src/components/contabilidad/pago-list.js` y `src/components/contabilidad/periodo-list.js`
- [X] T207 [US21] Centralizar mensajes de confirmación de guardado y eliminación en `src/components/contabilidad/comun.js`
- [X] T208 [US21] Integrar confirmaciones en formularios de `src/components/contabilidad/cuenta-form.js`, `src/components/contabilidad/asiento-form.js`, `src/components/contabilidad/pago-form.js` y `src/components/contabilidad/periodo-form.js`
- [X] T209 [US21] Construir drawer móvil desde la misma fuente de opciones en `src/components/menu.js`
- [X] T210 [US21] Cerrar el menú móvil al seleccionar una sección en `src/app.js`
- [X] T211 [US21] Agregar estilos responsivos sin desplazamiento horizontal de página en `src/styles.css`
- [X] T212 [US21] Verificar que la interfaz no altere reglas de negocio, permisos ni datos en `src/app.js`

**Punto de control**: US21 es funcional y verificable en escritorio y celular.

---

## Fase 21: Historia de Usuario 22 - Centrar y estrechar el acceso (Prioridad: P1)

**Propósito**: Centrar y estrechar el formulario de acceso con el botón "Ingresar" inmediatamente después de los campos, sin cambiar credenciales ni validaciones.

### Pruebas para US22

- [X] T213 [P] [US22] Agregar pruebas de integración del acceso en formato anterior, con formulario y tabla visibles y sin espacio vacío superior antes de "Ingresar" en pantallas amplias y estrechas en `tests/integration/contabilidad/acceso-usabilidad.test.js` per `spec.md` HU22, FR-329–FR-332, SC-144–SC-145

### Implementación para US22

- [X] T214 [US22] Ajustar el contenedor y los estilos del formulario en `index.html`, `src/components/acceso.js` y `src/styles.css`, conservando los campos y las validaciones de HU8 per `spec.md` HU22, FR-329–FR-332

---

## Fase 22: Historia de Usuario 23 - Mostrar la identidad del usuario y el cierre de sesión en el encabezado (Prioridad: P1)

**Propósito**: Agrupar nombre, rol y "Cerrar sesión" en el encabezado, conservando el comportamiento de cierre definido en HU8.

### Pruebas para US23

- [X] T215 [P] [US23] Agregar pruebas del encabezado con nombre, rol y "Cerrar sesión" visibles y agrupados en todas las pantallas con sesión válida en `tests/integration/contabilidad/shell-accesible.test.js` per `spec.md` HU23, FR-335–FR-337, SC-147

### Implementación para US23

- [X] T216 [US23] Mostrar `Sesion.usuarioNombre` y el rol junto al botón existente de "Cerrar sesión" en `src/components/shell.js` y `src/styles.css`, sin crear una nueva acción de cierre per `spec.md` HU23, FR-335–FR-337

---

## Fase 23: Historia de Usuario 24 - Alinear el menú lateral a la izquierda (Prioridad: P1)

**Propósito**: Alinear el menú lateral al borde izquierdo del área de trabajo sin modificar secciones ni permisos.

### Pruebas para US24

- [X] T217 [P] [US24] Agregar pruebas de alineación izquierda del menú en escritorio y celular y de igualdad de secciones con la matriz vigente en `tests/integration/contabilidad/menu-usabilidad.test.js` per `spec.md` HU24, FR-333–FR-334, SC-146

### Implementación para US24

- [X] T218 [US24] Ajustar la posición del drawer y del menú en `src/styles.css` y `src/components/shell.js`, conservando las etiquetas, el orden y `OpcionMenu` per `spec.md` HU24, FR-333–FR-334

---

## Fase 24: Historia de Usuario 25 - Mostrar montos en formato chileno (Prioridad: P1)

**Propósito**: Aplicar el formato "$5.000" con puntos de miles y sin decimales en toda la presentación, sin alterar cálculos.

### Pruebas para US25

- [X] T219 [P] [US25] Agregar pruebas unitarias de formato chileno para montos de tres cifras, cero y miles, y de conservación de cálculos en `tests/unit/contabilidad/dinero-usabilidad.test.js` per `spec.md` HU25, FR-338–FR-342, SC-148–SC-149

### Implementación para US25

- [X] T220 [US25] Reutilizar `formatearCLP` de `src/contabilidad/dinero.js` y los ayudantes de `src/components/contabilidad/comun.js` en listados, formularios, resúmenes, reportes y mensajes existentes, sin modificar importes en centavos per `spec.md` HU25, FR-338–FR-342

---

## Fase 25: Historia de Usuario 26 - Mantener formulario y listado visibles (Prioridad: P1)

**Propósito**: Mantener el formulario de creación visible sobre el listado, sin botón "Nuevo" ni ventana modal, conservando el contexto y los filtros.

### Pruebas para US26

- [X] T221 [P] [US26] Agregar pruebas de integración de formulario visible antes del listado, ausencia de botón "Nuevo" y de ventana modal, conservación de filtros y permisos vigentes en `tests/integration/contabilidad/formulario-ventana.test.js` per `spec.md` HU26, FR-343–FR-349, SC-150–SC-152

### Implementación para US26

- [X] T222 [US26] Mantener el formulario en el flujo normal de `index.html` antes de cada listado, retirar la ventana reutilizable de `src/components/contabilidad/comun.js` y conservar validaciones, reglas y permisos vigentes per `spec.md` HU26, FR-343–FR-349

---

## Fase 26: Historia de Usuario 29 - Mostrar mensajes claros para listas vacías (Prioridad: P1)

**Propósito**: Mostrar un mensaje informativo y legible solo cuando un listado o un filtro no tenga resultados.

### Pruebas para US29

- [X] T223 [P] [US29] Agregar pruebas de mensaje de lista vacía, distinción de errores y desaparición al limpiar filtros en `tests/integration/contabilidad/estados-vacios.test.js` per `spec.md` HU29, FR-356–FR-360, SC-155

### Implementación para US29

- [X] T224 [US29] Unificar el mensaje informativo en `src/components/contabilidad/comun.js` y las vistas de listado existentes, conservando los mensajes de error y de estado vacío ya definidos per `spec.md` HU29, FR-356–FR-360

---

## Fase 27: Historia de Usuario 30 - Rastrear totales financieros hasta su origen (Prioridad: P1)

**Propósito**: Mostrar CLP en los encabezados monetarios, permitir ordenar por tipo y exponer el desglose de cada total sin alterar importes ni reglas contables.

### Pruebas para US30

- [X] T225 [P] [US30] Agregar pruebas de integración para encabezados CLP, orden por Tipo, desglose de totales de movimientos y de los cuatro reportes en `tests/integration/contabilidad/reportes-financieros.test.js` per `spec.md` HU30, FR-364–FR-368, SC-159–SC-161

### Implementación para US30

- [X] T226 [US30] Agregar la unidad CLP a los encabezados monetarios, habilitar el orden por Tipo y crear un panel reutilizable de desglose conectado a los totales en `index.html`, `src/components/contabilidad/reportes.js` y `src/styles.css` per `spec.md` HU30, FR-364–FR-368

### Verificación para US30

- [X] T227 [US30] Verificar con `npm test` y `npm run build` en `tests/integration/contabilidad/reportes-financieros.test.js` y `src/components/contabilidad/reportes.js` que el desglose conserva importes, permisos e igualdad contable, cerrando la deuda registrada en `specs/002-contabilidad-finanzas/plan.md:179` per `spec.md` SC-159–SC-161

---

## Fase 28: Historia de Usuario 31 - Usar CLP y terminología de IVA chilena (Prioridad: P1)

**Propósito**: Alinear moneda, unidades, formato y nombres de IVA con la empresa chilena sin alterar cálculos ni permisos.

### Pruebas para US31

- [X] T228 [P] [US31] Actualizar pruebas de formato, encabezados, semilla y documentos en `tests/integration/contabilidad/reportes-financieros.test.js` y `tests/unit/contabilidad/semilla.test.js` para exigir CLP, "$5.000" sin decimales e "IVA Débito Fiscal"/"IVA Crédito Fiscal" per `spec.md` HU31, FR-369–FR-372, SC-162–SC-164

### Implementación para US31

- [X] T229 [US31] Renombrar utilidades y valores de moneda a CLP, actualizar locales y src a `es-CL`, renombrar cuentas de IVA en `src/contabilidad/semilla.js` y fijar CLP como moneda de documentos en `src/storage.js` y `src/components/document-form.js` per `spec.md` HU31, FR-369–FR-372

### Verificación para US31

- [X] T230 [US31] Verificar con `npm test` y `npm run build` en `tests/unit/contabilidad/dinero.test.js` y `tests/integration/contabilidad/reportes-financieros.test.js` que no quedan referencias a la moneda anterior ni a las etiquetas anteriores de IVA y que cálculos, datos y permisos permanecen iguales per `spec.md` SC-162–SC-164

---

## Fase 29: Historia de Usuario 6 - Generar y consultar reportes financieros (Prioridad: P2)

**Objetivo**: Consultar movimientos y totales de débito/crédito por periodo, con estados vacíos (FR-022–FR-029).

**Prueba independiente**: Seleccionar un periodo, ver movimientos y totales coherentes y recibir mensaje cuando no haya registros.

### Pruebas para US6

- [X] T231 [P] [US6] Agregar pruebas unitarias de movimientos y totales por periodo en `tests/unit/contabilidad/reportes.test.js`
- [X] T232 [P] [US6] Agregar pruebas de integración de selección de periodo y reporte en `tests/integration/contabilidad/reportes.test.js`

### Implementación para US6

- [X] T233 [US6] Ampliar consultas de movimientos y totales en `src/contabilidad/reportes.js`
- [X] T234 [P] [US6] Crear la vista de reportes de movimientos con tabla y totales en `src/components/contabilidad/reportes.js`
- [X] T235 [US6] Conectar selector de periodo y vista en `src/app.js`
- [X] T236 [US6] Agregar mensaje de periodo sin movimientos en `src/components/contabilidad/comun.js`
- [X] T237 [US6] Agregar estilos de tabla y totales de reporte en `src/styles.css`
- [X] T238 [US6] Verificar que los totales usen `sumarCentavos` y formato CLP en `src/contabilidad/reportes.js`

**Punto de control**: US6 es funcional y verificable de forma independiente.

---

## Fase 30: Historia de Usuario 7 - Consultar el análisis financiero visual del panel (Prioridad: P2)

**Objetivo**: Mostrar barras, línea y dona derivadas de los mismos cálculos de reportes dentro de la sección "Análisis financiero" del Panel del Administrador, entre el estado de periodos y los botones de datos de ejemplo (FR-035–FR-039).

**Prueba independiente**: Iniciar sesión como Administrador con semilla cargada, ver la sección "Análisis financiero" entre "Estado de periodos" y los botones, cambiar el periodo y comprobar que las tres gráficas se actualizan en CLP; sin datos aparecen mensajes en español y otros roles no ven la sección.

### Pruebas para US7

- [X] T239 [P] [US7] Extender `tests/unit/contabilidad/series-dashboard.test.js` para verificar que las series de barras, línea y dona consumen `calcularResumen`, `calcularSaldosCuentas` y `calcularGastosPorCuenta` per `specs/002-contabilidad-finanzas/contracts/dashboard-charts.md`, `spec.md` FR-035–FR-038
- [X] T240 [P] [US7] Crear `tests/integration/contabilidad/analisis-financiero-panel.test.js` para exigir la sección "Análisis financiero" en el panel del Administrador entre "Estado de periodos" y los botones de datos de ejemplo/restablecer per `spec.md` HU7, FR-036
- [X] T241 [P] [US7] Extender `tests/integration/contabilidad/dashboard-graficas.test.js` para exigir que las gráficas del panel se oculten en otros roles y respondan al cambio de periodo per `spec.md` HU7, FR-037–FR-039
- [X] T242 [P] [US7] Agregar pruebas unitarias de series de ingresos, resultado y gastos en `tests/unit/contabilidad/series-dashboard.test.js`
- [X] T243 [P] [US7] Agregar pruebas de integración de gráficas y filtro de periodo en `tests/integration/contabilidad/dashboard-graficas.test.js`

### Implementación para US7

- [X] T244 [US7] Extraer el render de gráficas a `src/components/analisis-financiero.js` reutilizando las series de `src/contabilidad/reportes.js` per `specs/002-contabilidad-finanzas/contracts/dashboard-charts.md`
- [X] T245 [US7] Insertar la sección "Análisis financiero" en `src/components/panel-por-rol.js` entre "Estado de periodos" y los botones "Cargar datos de ejemplo"/"Restablecer datos" per `spec.md` HU7, FR-036
- [X] T246 [US7] Renderizar "Ingresos vs gastos por periodo", "Resultado financiero por periodo" y "Gastos por cuenta" dentro de la sección del panel desde `src/components/analisis-financiero.js`, conservando tooltips y etiquetas CLP de `src/contabilidad/dinero.js` per `spec.md` FR-035–FR-039
- [X] T247 [US7] Conectar el evento de periodo y la visibilidad por rol en `src/app.js` y `src/components/panel-por-rol.js`, retirando el render previo de gráficas de `src/components/dashboard.js` per `spec.md` HU7, HU9
- [X] T248 [US7] Agregar estilos de sección, rejilla y estados vacíos en `src/styles.css` per `specs/002-contabilidad-finanzas/contracts/dashboard-charts.md`, `spec.md` FR-038–FR-039
- [X] T249 [P] [US7] Derivar series desde reportes y saldos en `src/contabilidad/reportes.js`
- [X] T250 [US7] Implementar gráficas SVG de barras, línea y dona en `src/components/analisis-financiero.js`
- [X] T251 [US7] Aplicar formato CLP compartido a etiquetas y tooltips en `src/components/analisis-financiero.js`
- [X] T252 [US7] Conectar evento de periodo cambiado en `src/app.js`
- [X] T253 [US7] Agregar estados vacíos accesibles en `src/components/analisis-financiero.js`
- [X] T254 [US7] Agregar estilos de gráficas y ejes en `src/styles.css`

**Punto de control**: US7 es funcional y verificable de forma independiente.

---

## Fase 31: Historia de Usuario 18 - Identidad corporativa en el encabezado (Prioridad: P2)

**Objetivo**: Mostrar "Comercial Los Andes SpA" y logotipo ficticio en todas las pantallas posteriores al acceso (FR-214–FR-229).

**Prueba independiente**: Iniciar sesión con cualquier rol y verificar el texto exacto, el logotipo, la persistencia al navegar y el fallback accesible.

### Pruebas para US18

- [X] T255 [P] [US18] Agregar pruebas unitarias de la constante de identidad corporativa en `tests/unit/contabilidad/identidad-corporativa.test.js`
- [X] T256 [P] [US18] Agregar pruebas de integración del encabezado para todos los roles y pantallas en `tests/integration/contabilidad/encabezado-corporativo.test.js`

### Implementación para US18

- [X] T257 [US18] Definir `NOMBRE_EMPRESA = "Comercial Los Andes SpA"` en `src/module-config.js`
- [X] T258 [US18] Crear logotipo SVG en línea y fallback visual en `src/components/shell.js`
- [X] T259 [US18] Agregar descripción accesible del logotipo en `src/components/shell.js`
- [X] T260 [US18] Mostrar identidad corporativa junto al título sin duplicarlo en `src/components/shell.js`
- [X] T261 [US18] Conservar identidad al navegar, cargar y restablecer datos en `src/app.js`
- [X] T262 [US18] Agregar estilos legibles en pantallas estrechas en `src/styles.css`
- [X] T263 [US18] Reutilizar la constante corporativa en `src/contabilidad/exportacion-reportes.js`

**Punto de control**: US18 es funcional y verificable sin nueva opción de menú.

---

## Fase 32: Historia de Usuario 27 - Evitar la superposición en los filtros (Prioridad: P2)

**Propósito**: Separar la "×" de limpieza de la flecha del selector en todos los filtros.

### Pruebas para US27

- [X] T264 [P] [US27] Agregar pruebas de uso independiente de la "×" y la flecha, incluido texto extenso de opciones, en `tests/integration/contabilidad/filtros-listados.test.js` per `spec.md` HU27, FR-350–FR-353, SC-153

### Implementación para US27

- [X] T265 [US27] Separar ambos controles en `index.html` y `src/styles.css` sin cambiar `FiltroMovimientos` ni las reglas de filtrado per `spec.md` HU27, FR-350–FR-353

---

## Fase 33: Historia de Usuario 28 - Alinear la fila de totales del Libro Mayor (Prioridad: P2)

**Propósito**: Alinear los totales con saldo inicial, débitos, créditos y saldo final conservando los importes.

### Pruebas para US28

- [X] T266 [P] [US28] Agregar pruebas de alineación de la fila de totales, paridad de importes y comportamiento en pantalla estrecha en `tests/integration/contabilidad/reportes.test.js` per `spec.md` HU28, FR-354–FR-355, SC-154

### Implementación para US28

- [X] T267 [US28] Ajustar `totalesPara()` en `src/components/contabilidad/reportes.js` y los estilos de tabla en `src/styles.css`, sin modificar el cálculo ni la igualdad contable per `spec.md` HU28, FR-354–FR-355

---

## Fase 34: Pulido y Consideraciones Transversales

**Propósito**: Cerrar deuda documentada, trazabilidad, rendimiento, accesibilidad y verificación final.

- [X] T268 Verificar cobertura de todos los FR y SC buildable en `specs/002-contabilidad-finanzas/spec.md`
- [X] T269 Verificar que cada contrato en `specs/002-contabilidad-finanzas/contracts/` tenga tareas y pruebas asociadas
- [X] T270 Confirmar que `data-model.md`, `research.md`, `plan.md` y `quickstart.md` reflejen el estado implementado en `specs/002-contabilidad-finanzas/`
- [X] T271 Confirmar migración y uso exclusivo de `sessionStorage` en `src/contabilidad/almacenamiento.js`
- [X] T272 Confirmar que todas las sumas monetarias usen `sumarCentavos` en `src/contabilidad/dinero.js`
- [X] T273 Agregar casos límite de dinero y fechas en `tests/unit/contabilidad/dinero.test.js` y `tests/unit/contabilidad/fechas.test.js`
- [X] T274 Verificar paginación/filtros en los listados de `src/components/contabilidad/cuenta-list.js`, `src/components/contabilidad/asiento-list.js`, `src/components/contabilidad/pago-list.js` y `src/components/contabilidad/periodo-list.js`
- [X] T275 Verificar agregaciones incrementales en `src/contabilidad/reportes.js` y `src/contabilidad/resumen-pagos.js`
- [X] T276 Revisar accesibilidad y mensajes en `src/components/acceso.js`, `src/components/menu.js`, `src/components/panel-por-rol.js` y `src/components/contabilidad/pago-resumen.js`
- [X] T277 Ejecutar la suite completa con `npm test` según `package.json`
- [X] T278 Ejecutar `npm run build` según `package.json`
- [X] T279 Ejecutar la validación manual de `specs/002-contabilidad-finanzas/quickstart.md`

---

## Fase 35: Verificación Transversal de Usabilidad

**Propósito**: Confirmar que las HU22–HU29 no introducen cambios funcionales ni alteran permisos.

- [X] T280 Verificar con `npm test` y `npm run build` que se detectan 0 cambios funcionales en reglas, operaciones, datos y permisos, y que los cuatro roles conservan el mismo conjunto de pantallas y acciones (FR-361–FR-363, SC-156–SC-158), actualizando `specs/002-contabilidad-finanzas/spec.md`, `specs/002-contabilidad-finanzas/plan.md` y `specs/002-contabilidad-finanzas/data-model.md` si aparece alguna discrepancia

---

## Fase 36: Convergencia

- [X] T281 Centralizar todo acceso a almacenamiento en la capa del módulo base, eliminar `sessionStorage`/`localStorage` directo en `src/components/acceso.js`, `src/contabilidad/sesion.js`, `src/contabilidad/interfaz-config.js` y el uso dual en `src/storage.js`, conservar `sessionStorage` por defecto, migrar claves existentes y añadir pruebas per `.specify/memory/constitution.md:34-46,86-88` (contradicción constitucional CRITICAL)
- [X] T282 Refactorizar todas las sumas y restas monetarias de `src/contabilidad/` para usar exclusivamente `sumarCentavos` de `src/contabilidad/dinero.js` per `.specify/memory/constitution.md:22-32` (contradicción constitucional CRITICAL)
- [X] T283 Habilitar los botones "Exportar PDF" y "Exportar Excel" para todos los roles con acceso de consulta a reportes en `src/contabilidad/permisos.js`, `src/app.js` y `src/components/contabilidad/reportes.js`, con pruebas por rol per `spec.md:913-915,933` (contradicción HIGH)
- [X] T284 Restringir las alertas de vencimiento exclusivamente al Tesorero en `src/contabilidad/permisos.js`, `src/app.js` y `src/components/panel-por-rol.js`, con pruebas para Administrador, Contador, Tesorero y Auditor per `spec.md:886,896,1285` (contradicción HIGH)
- [X] T285 Regenerar la semilla en `src/contabilidad/semilla.js` sin asientos ni pagos en periodos cerrados y añadir validación automática de la regla per `spec.md:829,846,1273` (contradicción HIGH)
- [X] T286 Completar la semilla en `src/contabilidad/semilla.js` con al menos un asiento y un pago por periodo y al menos un pago pendiente, pagado y vencido, con pruebas deterministas per `spec.md:753` (incumplimiento HIGH)
- [X] T287 Implementar paneles de inicio diferenciados por rol en `src/components/panel-por-rol.js`: Administrador, Contador, Tesorero y Auditor, con cobertura de integración per `spec.md:726-730,748` (implementación parcial HIGH)
- [X] T288 Persistir `usuarioRut` y `usuarioNombre` en la sesión de `src/contabilidad/sesion.js` y verificar que cada evento de `src/contabilidad/auditoria.js` identifique nombre, rol y RUT per `spec.md:849,1280` (incumplimiento HIGH)
- [X] T289 Exponer el historial de auditoría desde el detalle de cada asiento y pago o cobro en `src/components/contabilidad/` y `src/app.js`, con mensaje de estado vacío per `spec.md:858,867,872,1276,1284` (incumplimiento HIGH)
- [X] T290 Ocultar acciones de editar, aprobar, cancelar y eliminar en `src/components/contabilidad/asiento-list.js` y `src/components/contabilidad/pago-list.js` para listados cuyo periodo esté cerrado, con pruebas de solo lectura en `tests/integration/contabilidad/asientos.test.js` y `tests/integration/contabilidad/pagos.test.js` per `spec.md:828,845` (contradicción HIGH)
- [X] T291 Eliminar los accesos rápidos duplicados del panel principal o convertirlos en acciones no navigacionales en `index.html` y `src/app.js`, preservando un único control visible por pantalla per `spec.md:765-766,1286` (duplicidad MEDIUM)
- [X] T292 Corregir la etiqueta "Restablecer datos", exigir confirmación para cargar y restablecer datos, y ocultar ambos controles para roles no administradores en `index.html`, `src/app.js` y `src/components/panel-por-rol.js` per `spec.md:750,760-761` (contradicción MEDIUM)
- [X] T293 Añadir la opción "Anulado" al filtro de estado de pagos y controles para limpiar filtros individuales sin afectar los demás en `index.html` y `src/app.js`, con pruebas per `spec.md:951,956,1323-1326` (implementación parcial MEDIUM)
- [X] T294 Hacer ordenables por fecha, monto y estado las tablas de cuentas, asientos, pagos, periodos, reportes y auditoría, conectando las utilidades de `src/contabilidad/interfaz-config.js` y `src/contabilidad/filtros-movimientos.js` con `aria-sort` per `spec.md:973-975,1333-1335` (incumplimiento MEDIUM)
- [X] T295 Mostrar mensajes de confirmación accesibles después de guardar y eliminar registros válidos en los handlers de `src/app.js` per `spec.md:980,983,1336-1337` (incumplimiento MEDIUM)
- [X] T296 Mostrar el icono correspondiente en cada encabezado de sección y reutilizar el mismo icono del menú en `src/components/shell.js` y `src/contabilidad/interfaz-config.js` per `spec.md:970-971,1331-1332` (incumplimiento MEDIUM)
- [X] T297 Mantener visibles las etiquetas de texto del menú en celular y cerrar el drawer al seleccionar una sección en `src/styles.css` y `src/components/shell.js` per `spec.md:987-990,1339` (contradicción MEDIUM)
- [X] T298 Mantener el nombre "Comercial Los Andes SpA" y el logotipo visibles y accesibles en pantallas estrechas, corrigiendo el `aria-label` en `src/components/shell.js` y `src/styles.css` per `spec.md:908,911,1294-1302` (contradicción MEDIUM)
- [X] T299 Completar estados accesibles y mensajes dinámicos en `src/components/contabilidad/pago-resumen.js`, `index.html` y `src/components/panel-por-rol.js`, actualizando la cobertura de T239 per `tasks.md:620` (implementación parcial MEDIUM)
- [X] T300 Crear `tests/unit/contabilidad/dinero.test.js` y `tests/unit/contabilidad/fechas.test.js` con los casos límite declarados en T236 per `tasks.md:617` (verificación incompleta LOW)

---

## Fase 37: Convergencia

- [X] T301 Eliminar el fallback a `localStorage` y a memoria en `obtenerAlmacenSesion()` de `src/storage.js`, ejecutar la migración de claves una sola vez en el arranque, conservar `sessionStorage` como único destino y añadir pruebas con storages separados per `.specify/memory/constitution.md:34-46,86-88`, `tasks.md:737` (contradicción CRITICAL)
- [X] T302 Restringir `sumarCentavos` en `src/contabilidad/dinero.js` a centavos enteros o conversión explícita con `aCentavos`, corregir `tests/unit/contabilidad/dinero.test.js` y ampliar casos límite per `.specify/memory/constitution.md:22-32`, `tasks.md:738,756` (contradicción CRITICAL)
- [X] T303 Reemplazar las sumas y restas monetarias directas en `src/contabilidad/reportes.js:249,335`, `src/contabilidad/exportacion-reportes.js:185`, `src/components/analisis-financiero.js:204`, `src/components/contabilidad/asiento-form.js:143-144,152` y `src/components/contabilidad/reportes.js:191` por `sumarCentavos`, con pruebas de totales per `.specify/memory/constitution.md:22-32`, `tasks.md:738` (contradicción HIGH)
- [X] T304 Regenerar `src/contabilidad/semilla.js` con al menos un periodo cerrado sin movimientos, conservar periodos y registros cerrados al cargar o restablecer datos y añadir pruebas de SC-052/SC-062 per `spec.md:753,829,846,1117,1127`, `tasks.md:741-742` (contradicción HIGH)
- [X] T305 Conciliar FR-015 y FR-063 con la eliminación vigente de `document_id` en pagos: documentar la excepción en `spec.md`/`tasks.md` o restaurar la asociación opcional en `index.html`, `src/components/contabilidad/pago-form.js`, `src/contabilidad/pagos.js` y sus pruebas per `spec.md:698,746` (contradicción HIGH) — Resolución: FR-015/FR-063 se acotan al MVP sin documentos asociados a pagos; `document_id` eliminado también de la semilla y del modelo documental
- [X] T306 Exigir que la fecha de término sea estrictamente posterior a la de inicio en `src/contabilidad/validaciones-periodos.js:29-31` y actualizar mensajes y pruebas per `spec.md:701` (contradicción MEDIUM)
- [X] T307 Conciliar FR-019 con la restricción de no reapertura de la US15: eliminar la acción y el permiso de reapertura en `src/components/contabilidad/periodo-list.js`, `src/app.js` y `src/contabilidad/permisos.js`, o actualizar la especificación, con pruebas per `spec.md:702,1269` (contradicción MEDIUM)
- [X] T308 Solicitar confirmación antes de guardar un cambio de periodo a `cerrado` desde `index.html` y `src/app.js:996-1013`, manteniendo el estado original si se cancela per `spec.md:832` (incumplimiento MEDIUM)
- [X] T309 Exponer el historial de auditoría dentro del detalle de asientos y pagos en `src/components/contabilidad/pago-list.js`, `src/app.js` y el componente de detalle de asiento, con mensaje de estado vacío per `spec.md:858,867,872` (incumplimiento HIGH)
- [X] T310 Condicionar los botones y handlers `ver-historial-asiento`/`ver-historial-pago` a `puedeVerAuditoria`/`puedeConsultarAuditoria` en `src/components/contabilidad/asiento-list.js`, `src/components/contabilidad/pago-list.js` y `src/app.js:481-532`, con bloqueo explícito para otros roles per `spec.md:865,866` (incumplimiento HIGH)
- [X] T311 Mostrar `usuarioRut` en `renderizarRegistroActividad` y `renderizarHistorialMovimiento` de `src/components/contabilidad/registro-actividad.js` y ampliar pruebas de auditoría y sesión per `spec.md:849` (implementación parcial MEDIUM)
- [X] T312 Añadir pruebas de integración por rol para `[data-exportar-pdf]` y `[data-exportar-excel]` en `tests/integration/contabilidad/exportacion.test.js`, verificando presencia para roles con consulta y ausencia para Tesorero per `spec.md:913-915,933-934`, `tasks.md:739` (implementación parcial MEDIUM)
- [X] T313 Propagar `validacion.errores` desde `iniciarSesion` en `src/contabilidad/sesion.js:59-64` hacia `mostrarErroresAcceso`/`renderAcceso` en `src/app.js:1059-1067`, mostrando `#error-acceso-rut` y `#error-acceso-contraseña` per `spec.md:732`, `index.html:79,84` (implementación parcial MEDIUM)
- [X] T314 Eliminar los handlers muertos `action-nuevo-asiento`, `action-cuentas`, `action-registrar-pago` y `action-ver-reportes` en `src/app.js:1194-1197` o convertirlos en acciones no navegacionales documentadas, con prueba de control único por pantalla per `spec.md:765-766,1286`, `tasks.md:747` (duplicidad LOW)
- [X] T315 Anunciar el filtro aplicado en `#mensaje-confirmacion` y restaurar el foco a la tarjeta activa tras el rerender de `renderizarResumenPagos` en `src/app.js:493-541` y `src/components/contabilidad/pago-resumen.js`, con pruebas DOM de teclado y ARIA per `spec.md:774,1096`, `tasks.md:755` (implementación parcial MEDIUM)
- [X] T316 Propagar `ordenTablas['reporte-${clave}']` desde `refrescarReportes` en `src/app.js:460-478` y conservar el orden al cambiar de pestaña en `src/components/contabilidad/reportes.js:337-350`, con pruebas de orden por monto en los cuatro reportes per `spec.md:973-975,1333-1335`, `tasks.md:750` (implementación parcial MEDIUM)
- [X] T317 Alinear `totalesPara()` en `src/components/contabilidad/reportes.js:181-192` con el número de columnas de `COLUMNAS` mediante `colspan` o celdas vacías, y formatear importes con `formatearCLP`, con prueba de estructura de tabla per `spec.md:795-797,973-975` (implementación parcial MEDIUM)
- [X] T318 Centralizar el formato CLP compacto de `numeroCompacto` en `src/components/analisis-financiero.js:54-59` usando utilidades compartidas de `src/contabilidad/dinero.js`, aplicándolo a ejes y total de dona per `spec.md:722` (implementación parcial MEDIUM)
- [X] T319 Mapear los errores de periodo cerrado de `src/contabilidad/pagos.js` a un mensaje global accesible o al campo de fecha/periodo en `src/app.js:938-940,969-970,991-992` y `src/components/contabilidad/pago-form.js`, en lugar de `#error-pago-amount` per `spec.md:823,830,842` (implementación parcial MEDIUM)

---

## Fase 38: Convergencia

- [X] T320 Reubicar o eliminar los asientos `asi-0004`/`asi-0005` y el pago `pag-0002` del periodo cerrado `per-2026-09` en `src/contabilidad/semilla.js`, reforzar `validarSemilla()` para rechazar cualquier asiento o pago en periodos cerrados y añadir pruebas deterministas per `spec.md:753,829,846,1273`, `tasks.md:741-742,765` (contradicción HIGH)
- [X] T321 Bloquear la transición `cerrado → abierto` en `actualizarPeriodo()` de `src/contabilidad/periodos.js`, deshabilitar la opción “Abierto” al editar un periodo cerrado en `src/components/contabilidad/periodo-form.js` y `index.html`, retirar la rama/auditoría `abrir`, y añadir pruebas de API y UI per `spec.md:702,1269`, `tasks.md:768` (contradicción HIGH)
- [X] T322 Reemplazar “Apertura, cierre y reapertura de periodos.” por “Consulta y cierre de periodos.” en `src/components/panel-por-rol.js` y añadir una aserción DOM per `spec.md:702,1269`, `tasks.md:768` (contradicción MEDIUM)
- [X] T323 Tratar `pago.anulado === true` como `anulado` antes de evaluar vencimientos en `clasificarAlertaPago()` de `src/contabilidad/alertas-vencimientos.js`, reutilizando `Pagos.calcularEstadoPago` como fuente única, y añadir el caso límite per `spec.md:880,1143,1291`, `contracts/alertas-vencimientos.md:38` (incumplimiento MEDIUM)
- [X] T324 Conservar el último listado válido cuando `validarFiltro()` falle en `src/app.js` y `src/contabilidad/filtros-movimientos.js`, sin aplicar filtros inválidos ni activar el estado vacío, y corregir las aserciones de `tests/integration/contabilidad/filtros-listados.test.js` per `spec.md:958-960,1175-1182`, `contracts/filtros-movimientos.md:46` (contradicción HIGH)
- [X] T325 Eliminar los fallbacks a `fechaVencimiento`, `cuentaId` y `cuenta_id` en `fechaRegistro()` y `cuentaIdsRegistro()` de `src/contabilidad/filtros-movimientos.js`, exigiendo fecha de movimiento y cuentas derivadas del asiento relacionado, con pruebas de exclusión per `spec.md:941,944-945,1318,1320-1321`, `contracts/filtros-movimientos.md:27` (contradicción MEDIUM)
- [X] T326 Sustituir el helper local `aCentavos()` y la heurística de `factor()` en `src/contabilidad/filtros-movimientos.js` por `aCentavos()` de `src/contabilidad/dinero.js`, validando montos negativos/no numéricos y fechas ISO reales antes de filtrar, con casos límite per `.specify/memory/constitution.md:24-25`, `spec.md:949,960`, `contracts/filtros-movimientos.md:22,28` (contradicción MEDIUM)
- [X] T327 Hacer que `filtrarAsientos()` y `filtrarPagos()` devuelvan `ListadoFiltrado` o documentar oficialmente `filtrarAsientosDetallado()`/`filtrarPagosDetallado()` como API canónica, actualizando `contracts/filtros-movimientos.md` y sus pruebas per `contracts/filtros-movimientos.md:19,26-27`, `src/contabilidad/filtros-movimientos.js:117-131` (incumplimiento LOW)
- [X] T328 Eliminar el formulario y la rama de override de identidad corporativa en `index.html`, `src/contabilidad/interfaz-config.js` y `src/components/shell.js`, centralizar nombre/logotipo en una constante inmutable, y crear las pruebas T222/T223 ausentes per `tasks.md:591-592,596,602`, `spec.md:897-910,1294-1302` (contradicción MEDIUM)
- [X] T329 Renderizar el mismo SVG Lucide del menú en los encabezados bajo `[data-icono-seccion]` en `src/components/shell.js` y `src/styles.css`, conservando el texto visible y actualizando `tests/integration/contabilidad/shell-accesible.test.js` per `spec.md:969-972,1331-1332`, `tasks.md:752`, `contracts/interfaz-profesional.md:30` (incumplimiento MEDIUM)
- [X] T330 Definir tokens semánticos `--exito`, `--advertencia`, `--informacion` y `--error`, consumir `PALETA_ESTADOS` desde `claseEstado()`, y propagar `applyTheme()` también a `--primary`/derivados per `spec.md:967-968,284-285,1227-1228`, `src/styles.css:1101-1103`, `src/app.js:1228-1230` (incumplimiento MEDIUM)
- [X] T331 Aplicar `ordenTablas.cuentas` en `renderCuentaList()` y añadir encabezados ordenables a Créditos en `asiento-list.js` y Vencimiento en `pago-list.js`, con pruebas de ambos sentidos y `aria-sort` per `spec.md:973-975,1333-1335`, `tasks.md:750,777` (incumplimiento MEDIUM)
- [X] T332 Pasar un flag `eliminable` a `cuenta-list.js` y `pago-list.js`, ocultando “Eliminar” cuando la operación real sea inactivación o anulación lógica, y añadir pruebas per `spec.md:981-985`, `src/contabilidad/cuentas.js:86-97`, `src/contabilidad/pagos.js:306-321` (contradicción MEDIUM)
- [X] T333 Añadir la columna `resultado` a `COLUMNAS.estadoResultados` en `src/contabilidad/exportacion-reportes.js`, calcularla por fila con `sumarCentavos([ingresos, -gastos])` y verificar paridad pantalla-archivo per `spec.md:924,926,1168`, `contracts/estados-financieros.md:26`, `contracts/exportacion-reportes.md:42` (pérdida de información MEDIUM)
- [X] T334 Incluir una invitación explícita a reintentar en el mensaje de fallo de descarga de `src/components/contabilidad/exportacion.js` y añadir una prueba que simule el error per `spec.md:936` (incumplimiento MEDIUM)
- [X] T335 Añadir aserciones exactas sobre `#asiento-total-debitos`, `#asiento-total-creditos`, `#asiento-diferencia` y `.chart-donut-total` con la semilla determinista en `tests/integration/contabilidad/asientos.test.js` y `tests/integration/contabilidad/dashboard-graficas.test.js` per `tasks.md:764`, `.specify/memory/constitution.md:58-62` (verificación incompleta LOW)
- [X] T336 Implementar en `src/contabilidad/interfaz-config.js` la API contractual `confirmarEliminacion`, `mostrarMensaje`, `obtenerOpcionesMenu` y `paleta`, además de los selectores `[data-ordenar]`, `[data-confirmar-eliminacion]` y `[data-menu-movil]`, con pruebas de contrato per `contracts/interfaz-profesional.md:18-33`, `tasks.md:613` (incumplimiento MEDIUM)

---

## Fase 39: Convergencia

- [X] T337 Fijar una fecha de referencia determinista en la semilla de `src/contabilidad/semilla.js:10,380,513,531,551` y propagarla desde `src/contabilidad/almacenamiento.js:121,128,142`, añadiendo pruebas de cargas repetidas per `.specify/memory/constitution.md:41-42`, `spec.md:978`, `data-model.md:359-371` (contradicción CRITICAL)
- [X] T338 Mostrar el botón `menu-toggle` con una sesión válida también en escritorio eliminando el `display:none` de `src/styles.css:1058` o limitando su alcance, con una prueba DOM de visibilidad per `spec.md:1226,1503` (incumplimiento HIGH)
- [X] T339 Aplicar el estado visual abierto/cerrado al botón `menu-toggle`, reemplazando el selector `.acciones-menu-toggle[aria-expanded="true"]` de `src/styles.css:658` por uno que use `#menu-toggle[aria-expanded]`/`[data-menu-movil]`, con prueba ARIA per `spec.md:1229,1503` (incumplimiento HIGH)
- [X] T340 Eliminar la limitación de ancho y el centrado exclusivos del formulario y la tabla de acceso en `src/styles.css:889-899` (`.acceso-card`, `.acceso-usuarios`), conservando el ancho del módulo y añadiendo una aserción de SC-144 per `spec.md:1233-1234,1504` (contradicción HIGH)
- [X] T341 Restringir `registrarEvento` en `src/contabilidad/auditoria.js:6-15,111-168` a `crear`/`editar`/`anular` de asientos y pagos, retirando o reclasificando los eventos `aprobar` de `src/contabilidad/asientos.js:266-277` y `crear`/`cerrar` de `src/contabilidad/periodos.js:43-88` del registro consolidado, con pruebas per `spec.md:1068-1071`, `contracts/registro-actividad.md:13-14,27` (contradicción HIGH)
- [X] T342 Alinear `MAPA_NAVEGACION` en `src/components/menu.js:5-13` y las opciones de `index.html:32-51` con el mapa único de `contracts/navegacion-unica.md:9-19`, retirando o renombrando las entradas no declaradas "Panel" y "Resumen financiero" sin duplicar destinos, con prueba de unicidad per `spec.md:986-991` (contradicción MEDIUM)
- [X] T343 Mostrar mensajes de estado vacío en las gráficas de `src/components/analisis-financiero.js:84-89,301-317` cuando existan periodos pero no movimientos aprobados o no haya gastos, ocultando las series vacías, per `spec.md:942`, `contracts/dashboard-charts.md:71-72` (implementación parcial MEDIUM)
- [X] T344 Sustituir las conversiones monetarias duplicadas de `src/contabilidad/filtros-movimientos.js:27,30` y `src/contabilidad/alertas-vencimientos.js:74` por `aCentavos()` de `src/contabilidad/dinero.js`, con casos límite per `.specify/memory/constitution.md:24-25,54-55`, `contracts/filtros-movimientos.md:22` (contradicción MEDIUM)
- [X] T345 Permitir corregir y borrar el dígito verificador del RUT sin impedir la edición en `src/contabilidad/validaciones-acceso.js:9-14` y `src/app.js:1159-1172`, añadiendo una prueba de teclado per `spec.md:1224` (incumplimiento MEDIUM)
- [X] T346 Verificar con `npm test -- --run` y `npm run build` que la tabla de `src/components/contabilidad/resumen.js` y la sección de `src/components/panel-por-rol.js` cumplen `spec.md` HU1 y HU7, sin peticiones de red ni regresiones de permisos per `.specify/memory/constitution.md`

---

## Dependencias y Orden de Ejecución

- La Fase 1 (Configuración) y la Fase 2 (Fundacional) bloquean todas las historias de usuario.
- Las historias P1 se ejecutan antes que las P2, en el orden de prioridad de `spec.md`.
- US1 debe completarse antes que US7 porque `calcularGastosPorCuenta()` se reutiliza en las series de la sección "Análisis financiero".
- US8, US9 y US10 son prerrequisitos funcionales para verificar vistas por sesión, permisos y semilla en US1 y US7.
- US11 y US24–US26 cierran la navegación y el formato antes de las mejoras visuales P2.
- Las fases de pulido, verificación y convergencia se ejecutan al final, después de todas las historias.
- Los archivos compartidos `src/contabilidad/reportes.js`, `src/contabilidad/dinero.js`, `src/app.js` y `src/styles.css` son puntos de serialización: no marcar tareas que los modifiquen como `[P]`.

## Ejemplos Paralelos por Historia de Usuario

| Historia | Ejemplo paralelo |
| --- | --- |
| US1 | T027 y T028 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US2 | T040 y T041 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US3 | T048 y T049 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US4 | T056 y T057 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US5 | T064 y T065 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US8 | T072 y T073 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US9 | T080 y T081 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US10 | T088 y T089 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US11 | T096 y T097 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US12 | T104 y T105 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US13 | T113 y T114 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US14 | T125 y T126 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US15 | T137 y T138 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US16 | T147 y T148 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US17 | T161 y T162 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US19 | T173 y T174 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US20 | T186 y T187 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US21 | T199 y T200 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US22 | T213 es independiente; continuar con el resto de la fase. |
| US23 | T215 es independiente; continuar con el resto de la fase. |
| US24 | T217 es independiente; continuar con el resto de la fase. |
| US25 | T219 es independiente; continuar con el resto de la fase. |
| US26 | T221 es independiente; continuar con el resto de la fase. |
| US29 | T223 es independiente; continuar con el resto de la fase. |
| US30 | T225 es independiente; continuar con el resto de la fase. |
| US31 | T228 es independiente; continuar con el resto de la fase. |
| US6 | T231 y T232 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US7 | T239 y T240 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US18 | T255 y T256 pueden ejecutarse en paralelo; continuar con el resto de la fase. |
| US27 | T264 es independiente; continuar con el resto de la fase. |
| US28 | T266 es independiente; continuar con el resto de la fase. |

## Estrategia de Implementación

1. Completar configuración y fundacionales antes de cualquier historia.
2. Construir el MVP con US1–US5 y US8–US10, incluyendo la tabla "Gastos por cuenta" de US1.
3. Continuar con el resto de historias P1 en orden, reutilizando reportes, permisos y sesión.
4. Ejecutar las historias P2, con US7 después de US1 para compartir cálculos de gastos por cuenta y mover las gráficas al Panel del Administrador.
5. Cerrar con pulido, verificación transversal y convergencia, ejecutando `npm test -- --run` y `npm run build` al final.

## Notas

- No se usa red: toda persistencia y generación de datos ocurre en la sesión del navegador.
- Las pruebas de integración con jsdom son la unidad de verificación independiente de cada historia.
- La deuda técnica de la fase de convergencia se mantiene explícita y se cierra antes de considerar terminada la feature.
- El alcance MVP incluye resumen con gastos por cuenta, cuentas, asientos, pagos, periodos, acceso, permisos y semilla.
