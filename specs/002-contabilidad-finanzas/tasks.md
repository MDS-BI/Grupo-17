---
description: "Task list for feature implementation"
---

# Tareas: Módulo de Contabilidad y Finanzas

**Entrada**: Documentos de diseño desde `/specs/002-contabilidad-finanzas/`
**Prerrequisitos**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md
**Pruebas**: Incluidas porque la constitución exige Vitest para lógica financiera y pruebas de integración con jsdom para flujos de usuario.
**Organización**: Las tareas se agrupan por historia de usuario para permitir implementación y validación independientes. Las P1 se ordenan antes que las P2.

## Formato: `[ID] [P?] [Historia] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias de tareas incompletas)
- **[Historia]**: US1 a US12, según `spec.md`
- Todas las tareas incluyen la ruta de archivo exacta.

## Convenciones de Rutas

- Aplicación existente: `src/` y `tests/` en la raíz del repositorio.
- Lógica de dominio contable y acceso: `src/contabilidad/`.
- Componentes de interfaz: `src/components/` y `src/components/contabilidad/`.
- Pruebas unitarias: `tests/unit/contabilidad/`.
- Pruebas de integración: `tests/integration/contabilidad/`.

---

## Fase 1: Configuración (Infraestructura Compartida)

**Propósito**: Preparar estructura, contenedores, estilos y ayudantes de prueba del módulo.

- [X] T001 Crear la estructura de módulos y pruebas, incluido `src/contabilidad/.gitkeep`, en `src/components/`, `src/components/contabilidad/`, `tests/unit/contabilidad/` y `tests/integration/contabilidad/`
- [X] T002 [P] Agregar contenedores de acceso, menú, panel por rol y vistas financieras, sin Búsqueda, en `index.html`
- [X] T003 [P] Actualizar etiquetas y nombre del módulo contable en `src/module-config.js` y `src/components/shell.js`
- [X] T004 [P] Agregar tokens y estilos de acceso, menú, paneles, tablas, formularios y estados vacíos en `src/styles.css`
- [X] T005 [P] Crear ayudantes de reinicio de sesión y semilla determinista en `tests/setup/contabilidad.js`
- [X] T006 [P] Verificar dependencias y scripts de Vite, Vitest y jsdom en `package.json`

---

## Fase 2: Fundacional (Prerrequisitos Bloqueantes)

**Propósito**: Implementar la infraestructura compartida que bloquea todas las historias de usuario.

**CRÍTICO**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [X] T007 [P] Implementar conversión a centavos, suma exacta y formato MXN en `src/contabilidad/dinero.js`
- [X] T008 [P] Implementar validación, comparación y formateo de fechas en `src/contabilidad/fechas.js`
- [X] T009 [P] Implementar ayudantes compartidos de errores, formato y tablas en `src/components/contabilidad/comun.js`
- [X] T010 Implementar la capa central de almacenamiento en `sessionStorage`, claves de contabilidad/acceso, migración desde `localStorage` y reinicio en `src/contabilidad/almacenamiento.js`
- [X] T011 [P] Implementar el catálogo de roles con panelInicio, permisos y accionesPanel en `src/contabilidad/roles.js`
- [X] T012 [P] Implementar los cuatro usuarios de prueba con normalización de RUT en `src/contabilidad/usuarios.js`
- [X] T013 [P] Implementar la matriz de permisos y derivación de OpcionMenu en `src/contabilidad/permisos.js`
- [X] T014 Implementar creación, lectura, copia de permisos y cierre de sesión en `src/contabilidad/sesion.js`
- [X] T015 [P] Implementar validación de RUT, credenciales y mensajes de acceso en `src/contabilidad/validaciones-acceso.js`
- [X] T016 Implementar la semilla determinista de cuentas, periodos, asientos, pagos, entidades, documentos, usuarios y roles en `src/contabilidad/semilla.js`
- [X] T017 [P] Implementar validaciones compartidas de cuentas, asientos, pagos y periodos en `src/contabilidad/validaciones-cuentas.js`, `src/contabilidad/validaciones-asientos.js`, `src/contabilidad/validaciones-pagos.js` y `src/contabilidad/validaciones-periodos.js`
- [X] T018 Implementar cálculos de resumen, saldos, movimientos y totales de reportes en `src/contabilidad/reportes.js`
- [X] T019 Extender `src/app.js` con registro de módulos, cambio de vista, sesión activa e inicialización de semilla
- [X] T020 [P] Agregar pruebas unitarias de dinero y fechas en `tests/unit/contabilidad/dinero.test.js` y `tests/unit/contabilidad/fechas.test.js`
- [X] T021 [P] Agregar pruebas unitarias de almacenamiento y semilla en `tests/unit/contabilidad/almacenamiento.test.js` y `tests/unit/contabilidad/semilla.test.js`
- [X] T022 [P] Agregar pruebas unitarias de usuarios, roles, permisos y sesión en `tests/unit/contabilidad/usuarios.test.js`, `tests/unit/contabilidad/roles.test.js`, `tests/unit/contabilidad/permisos.test.js` y `tests/unit/contabilidad/sesion.test.js`
- [X] T023 Agregar prueba de integración base de arranque, persistencia y semilla en `tests/integration/contabilidad/base.test.js`

**Punto de control**: La infraestructura contable y de acceso está lista; las historias pueden comenzar.

---

## Fase 3: Historia de Usuario 1 - Consultar el resumen financiero (Prioridad: P1) - MVP

**Objetivo**: Mostrar ingresos, gastos y resultado filtrables por periodo, con estado vacío.

**Prueba independiente**: Abrir el panel, ver indicadores calculados desde movimientos y cambiar el periodo; sin movimientos debe aparecer un mensaje en español.

### Pruebas para US1

- [X] T024 [P] [US1] Agregar pruebas unitarias del resumen financiero en `tests/unit/contabilidad/reportes-resumen.test.js`
- [X] T025 [P] [US1] Agregar pruebas de integración del panel, filtro por periodo y estado vacío en `tests/integration/contabilidad/resumen.test.js`

### Implementación para US1

- [X] T026 [P] [US1] Crear el componente de resumen con indicadores y selector de periodo en `src/components/contabilidad/resumen.js`
- [X] T027 [US1] Conectar el resumen con `src/contabilidad/reportes.js` y el evento de periodo en `src/app.js`
- [X] T028 [US1] Agregar estilos de tarjetas e indicadores en `src/styles.css`
- [X] T029 [US1] Agregar mensajes de estado vacío accesibles en `src/components/contabilidad/resumen.js`

**Punto de control**: US1 es funcional y verificable de forma independiente.

---

## Fase 4: Historia de Usuario 2 - Gestionar cuentas contables (Prioridad: P1)

**Objetivo**: Crear, consultar, editar y organizar jerárquicamente las cuentas del plan contable.

**Prueba independiente**: Crear una cuenta, verla en el listado, editarla y rechazar código duplicado o campos obligatorios vacíos.

### Pruebas para US2

- [X] T030 [P] [US2] Agregar pruebas unitarias de jerarquía, tipo y código duplicado en `tests/unit/contabilidad/validaciones-cuentas.test.js`
- [X] T031 [P] [US2] Agregar pruebas de integración de alta, edición y listado jerárquico en `tests/integration/contabilidad/cuentas.test.js`

### Implementación para US2

- [X] T032 [P] [US2] Crear el formulario de cuentas en `src/components/contabilidad/cuenta-form.js`
- [X] T033 [P] [US2] Crear el listado jerárquico de cuentas en `src/components/contabilidad/cuenta-list.js`
- [X] T034 [US2] Implementar CRUD y persistencia de la jerarquía en `src/contabilidad/cuentas.js`
- [X] T035 [US2] Implementar validaciones de cuenta, ciclo y baja protegida en `src/contabilidad/validaciones-cuentas.js`
- [X] T036 [US2] Conectar vistas y validaciones en `src/app.js` y agregar estilos en `src/styles.css`

**Punto de control**: US2 es funcional y verificable de forma independiente.

---

## Fase 5: Historia de Usuario 3 - Registrar asientos contables (Prioridad: P1)

**Objetivo**: Registrar asientos con líneas de débito/crédito, partida doble y ciclo borrador → aprobado → cancelado.

**Prueba independiente**: Crear un asiento, guardar solo cuando cuadre, rechazar menos de dos líneas y bloquear periodos cerrados o asientos aprobados.

### Pruebas para US3

- [X] T037 [P] [US3] Agregar pruebas unitarias de partida doble, líneas mínimas y periodo cerrado en `tests/unit/contabilidad/validaciones-asientos.test.js`
- [X] T038 [P] [US3] Agregar pruebas de integración de alta, desbalance, aprobación, cancelación y periodo cerrado en `tests/integration/contabilidad/asientos.test.js`

### Implementación para US3

- [X] T039 [P] [US3] Crear el formulario de asiento con líneas dinámicas en `src/components/contabilidad/asiento-form.js`
- [X] T040 [P] [US3] Crear el listado y detalle de asientos en `src/components/contabilidad/asiento-list.js`
- [X] T041 [US3] Implementar CRUD de asientos, recálculo de totales y ciclo de estados en `src/contabilidad/asientos.js`
- [X] T042 [US3] Implementar validaciones de asiento y línea en `src/contabilidad/validaciones-asientos.js`
- [X] T043 [US3] Conectar formulario, listado y acciones en `src/app.js`
- [X] T044 [US3] Agregar estilos de líneas, totales y estados en `src/styles.css`

**Punto de control**: US3 es funcional y verificable de forma independiente.

---

## Fase 6: Historia de Usuario 4 - Registrar y consultar pagos (Prioridad: P1)

**Objetivo**: Registrar pagos y cobros con fecha de vencimiento, entidad, documento opcional y detalle consultable.

**Prueba independiente**: Guardar un pago con campos obligatorios, asociarlo a una entidad/documento y consultarlo en el listado.

### Pruebas para US4

- [X] T045 [P] [US4] Agregar pruebas unitarias de pagos, fechaVencimiento y relaciones en `tests/unit/contabilidad/validaciones-pagos.test.js`
- [X] T046 [P] [US4] Agregar pruebas de integración de alta, listado y detalle de pagos en `tests/integration/contabilidad/pagos.test.js`

### Implementación para US4

- [X] T047 [P] [US4] Crear el formulario de pagos con selección contextual de entidad y documento en `src/components/contabilidad/pago-form.js`
- [X] T048 [P] [US4] Crear el listado y detalle de pagos en `src/components/contabilidad/pago-list.js`
- [X] T049 [US4] Implementar CRUD de pagos y vínculo opcional con asiento en `src/contabilidad/pagos.js`
- [X] T050 [US4] Implementar validaciones de pago, serie/folio y vencimiento en `src/contabilidad/validaciones-pagos.js`
- [X] T051 [US4] Conectar vistas, validaciones y almacenamiento en `src/app.js`
- [X] T052 [US4] Agregar estilos de formulario, tabla y detalle de pagos en `src/styles.css`

**Punto de control**: US4 es funcional y verificable de forma independiente.

---

## Fase 7: Historia de Usuario 5 - Gestionar periodos contables (Prioridad: P1)

**Objetivo**: Crear periodos no superpuestos, listar su estado y abrirlos o cerrarlos.

**Prueba independiente**: Crear un periodo válido, rechazar fechas invirtiendo el rango o solapamientos, cerrarlo e impedir asientos nuevos.

### Pruebas para US5

- [X] T053 [P] [US5] Agregar pruebas unitarias de fechas, solapamiento y cierre en `tests/unit/contabilidad/validaciones-periodos.test.js`
- [X] T054 [P] [US5] Agregar pruebas de integración de alta, listado y cambio de estado en `tests/integration/contabilidad/periodos.test.js`

### Implementación para US5

- [X] T055 [P] [US5] Crear el formulario de periodos en `src/components/contabilidad/periodo-form.js`
- [X] T056 [P] [US5] Crear el listado de periodos con estado visible en `src/components/contabilidad/periodo-list.js`
- [X] T057 [US5] Implementar CRUD y apertura/cierre de periodos en `src/contabilidad/periodos.js`
- [X] T058 [US5] Implementar validaciones de rango y solapamiento en `src/contabilidad/validaciones-periodos.js`
- [X] T059 [US5] Conectar vistas y validaciones en `src/app.js` y agregar estilos en `src/styles.css`

**Punto de control**: US5 es funcional y verificable de forma independiente.

---

## Fase 8: Historia de Usuario 8 - Iniciar sesión con RUT y contraseña (Prioridad: P1)

**Objetivo**: Autenticar cuatro usuarios de prueba con RUT/contraseña, mostrar panel por rol, error genérico y cierre de sesión.

**Prueba independiente**: Los cuatro usuarios inician sesión, ven su panel, cierran sesión y requieren nueva autenticación para volver.

### Pruebas para US8

- [X] T060 [P] [US8] Agregar pruebas unitarias de normalización de RUT y autenticación en `tests/unit/contabilidad/acceso-roles.test.js`
- [X] T061 [P] [US8] Agregar pruebas de integración de cuatro roles, errores y cierre de sesión en `tests/integration/acceso-roles.test.js`

### Implementación para US8

- [X] T062 [P] [US8] Crear la pantalla de acceso con RUT y contraseña en `src/components/acceso.js`
- [X] T063 [US8] Implementar el flujo iniciarSesion/cerrarSesion en `src/contabilidad/sesion.js`
- [X] T064 [P] [US8] Crear los cuatro paneles iniciales por rol en `src/components/panel-por-rol.js`
- [X] T065 [US8] Conectar acceso, sesión y panel en `src/app.js`
- [X] T066 [US8] Agregar mensaje "RUT o contraseña incorrectos" y campos obligatorios en `src/contabilidad/validaciones-acceso.js`
- [X] T067 [US8] Agregar estilos de acceso y paneles por rol en `src/styles.css`

**Punto de control**: US8 es funcional y verificable de forma independiente.

---

## Fase 9: Historia de Usuario 9 - Aplicar permisos por rol en el menú (Prioridad: P1)

**Objetivo**: Mostrar solo secciones permitidas y bloquear intentos de acceso ajenos al rol.

**Prueba independiente**: Cada rol ve exactamente su menú; un intento directo a otra sección muestra acceso no disponible sin revelar información.

### Pruebas para US9

- [X] T068 [P] [US9] Agregar pruebas unitarias de matriz por rol en `tests/unit/contabilidad/permisos.test.js`
- [X] T069 [P] [US9] Agregar pruebas de integración de menú filtrado y bloqueo en `tests/integration/contabilidad/permisos.test.js`

### Implementación para US9

- [X] T070 [US9] Ajustar matriz y acciones por rol en `src/contabilidad/permisos.js`
- [X] T071 [P] [US9] Crear el menú filtrado por permisos en `src/components/menu.js`
- [X] T072 [US9] Aplicar permisos y acciones al panel por rol en `src/components/panel-por-rol.js`
- [X] T073 [US9] Implementar guarda de rutas internas en `src/app.js`
- [X] T074 [US9] Ocultar opciones no permitidas en `src/components/shell.js`
- [X] T075 [US9] Agregar estilos de menú filtrado y mensajes de bloqueo en `src/styles.css`

**Punto de control**: US9 es funcional y verificable de forma independiente.

---

## Fase 10: Historia de Usuario 10 - Cargar y restablecer datos de ejemplo (Prioridad: P1)

**Objetivo**: Permitir al Administrador cargar semilla determinista y restablecer estado inicial con confirmación.

**Prueba independiente**: El Administrador carga dos veces la semilla sin duplicados, restablece conservando usuarios y cancela una confirmación sin cambios.

### Pruebas para US10

- [X] T076 [P] [US10] Agregar pruebas unitarias de requisitos mínimos y determinismo en `tests/unit/contabilidad/semilla-datos-ejemplo.test.js`
- [X] T077 [P] [US10] Agregar pruebas de integración de carga, reemplazo, restablecimiento y visibilidad por rol en `tests/integration/contabilidad/semilla-datos-ejemplo.test.js`

### Implementación para US10

- [X] T078 [US10] Ampliar la semilla con cuatro periodos, cuentas, seis asientos y pagos en estado pagado, pendiente y vencido en `src/contabilidad/semilla.js`
- [X] T079 [US10] Implementar reemplazo atómico y restablecimiento que conserva usuarios/roles en `src/contabilidad/almacenamiento.js`
- [X] T080 [P] [US10] Agregar botones "Cargar datos de ejemplo" y "Restablecer datos" al panel del Administrador en `src/components/panel-por-rol.js`
- [X] T081 [P] [US10] Agregar confirmaciones y mensajes de resultado en `src/components/contabilidad/comun.js`
- [X] T082 [US10] Conectar acciones de semilla y restauración en `src/app.js`
- [X] T083 [US10] Agregar estilos de botones y confirmaciones en `src/styles.css`

**Punto de control**: US10 es funcional y verificable de forma independiente.

---

## Fase 11: Historia de Usuario 11 - Simplificar el menú y eliminar navegación duplicada (Prioridad: P1)

**Objetivo**: Quitar Entidades, Documentos y Búsqueda y garantizar un único control visible por pantalla.

**Prueba independiente**: Ningún rol ve esas secciones, cada pantalla tiene un solo acceso y los intentos directos muestran "Sección no disponible".

### Pruebas para US11

- [X] T084 [P] [US11] Agregar pruebas unitarias del mapa navegación-control en `tests/unit/contabilidad/navegacion.test.js`
- [X] T085 [P] [US11] Agregar pruebas de integración de menú sin secciones eliminadas y sin duplicados en `tests/integration/contabilidad/navegacion.test.js`

### Implementación para US11

- [X] T086 [US11] Aplicar mapa de navegación única en `src/components/menu.js`
- [X] T087 [P] [US11] Eliminar entradas de Entidades, Documentos y Búsqueda en `index.html` y `src/components/shell.js`
- [X] T088 [US11] Quitar accesos directos duplicados del panel en `src/components/panel-por-rol.js`
- [X] T089 [US11] Implementar mensaje "Sección no disponible" para destinos eliminados en `src/app.js`
- [X] T090 [US11] Mantener selección contextual de entidades y documentos en `src/components/contabilidad/pago-form.js`
- [X] T091 [US11] Ajustar estilos de menú, panel y acciones en `src/styles.css`

**Punto de control**: US11 es funcional y verificable de forma independiente.

---

## Fase 12: Historia de Usuario 12 - Resumir pagos por estado (Prioridad: P1)

**Objetivo**: Mostrar cantidad y total MXN por pendiente, pagado y vencido, con filtro dentro de Pagos y cobros.

**Prueba independiente**: Con semilla cargada, los totales coinciden con el listado filtrado; un pago vencido deja de contarse como pendiente y el cambio a pagado es inmediato.

### Pruebas para US12

- [X] T092 [P] [US12] Agregar pruebas unitarias de EstadoPago y ResumenPagos en `tests/unit/contabilidad/resumen-pagos.test.js`
- [X] T093 [P] [US12] Agregar pruebas de integración de resumen, filtros y marcar pagado en `tests/integration/contabilidad/resumen-pagos.test.js`

### Implementación para US12

- [X] T094 [P] [US12] Implementar clasificación y agregación en centavos en `src/contabilidad/resumen-pagos.js`
- [X] T095 [P] [US12] Crear el componente de resumen y filtro en `src/components/contabilidad/pago-resumen.js`
- [X] T096 [US12] Integrar resumen y filtro en `src/components/contabilidad/pago-list.js`
- [X] T097 [US12] Agregar marcarPagado y normalización de estados heredados en `src/contabilidad/pagos.js`
- [X] T098 [US12] Conectar eventos de filtro y cambio de estado en `src/app.js`
- [X] T099 [US12] Agregar estados vacíos y estilos del resumen en `src/styles.css`
- [X] T100 [US12] Restringir resumen y filtro a Administrador y Tesorero en `src/contabilidad/permisos.js`

**Punto de control**: US12 es funcional y verificable de forma independiente.

---

## Fase 13: Historia de Usuario 6 - Generar y consultar reportes financieros (Prioridad: P2)

**Objetivo**: Consultar movimientos y totales de débito/crédito por periodo, con estados vacíos.

**Prueba independiente**: Seleccionar un periodo, ver movimientos y totales coherentes, y recibir mensaje cuando no haya registros.

### Pruebas para US6

- [X] T101 [P] [US6] Agregar pruebas unitarias de movimientos y totales por periodo en `tests/unit/contabilidad/reportes.test.js`
- [X] T102 [P] [US6] Agregar pruebas de integración de selección de periodo y reporte en `tests/integration/contabilidad/reportes.test.js`

### Implementación para US6

- [X] T103 [US6] Ampliar consultas de movimientos y totales en `src/contabilidad/reportes.js`
- [X] T104 [P] [US6] Crear la vista de reportes con tabla y totales en `src/components/contabilidad/reportes.js`
- [X] T105 [US6] Conectar selector de periodo y vista en `src/app.js`
- [X] T106 [US6] Agregar mensaje de periodo sin movimientos en `src/components/contabilidad/comun.js`
- [X] T107 [US6] Agregar estilos de tabla y totales de reporte en `src/styles.css`

**Punto de control**: US6 es funcional y verificable de forma independiente.

---

## Fase 14: Historia de Usuario 7 - Consultar el análisis financiero visual del panel (Prioridad: P2)

**Objetivo**: Mostrar barras, línea y dona derivadas de los mismos cálculos de reportes.

**Prueba independiente**: Al cambiar el periodo, las tres gráficas se actualizan en MXN; sin datos aparecen mensajes en español.

### Pruebas para US7

- [X] T108 [P] [US7] Agregar pruebas unitarias de series de ingresos, resultado y gastos en `tests/unit/contabilidad/series-dashboard.test.js`
- [X] T109 [P] [US7] Agregar pruebas de integración de gráficas y filtro de periodo en `tests/integration/contabilidad/dashboard-graficas.test.js`

### Implementación para US7

- [X] T110 [P] [US7] Derivar series desde reportes y saldos en `src/contabilidad/reportes.js`
- [X] T111 [US7] Implementar gráficas SVG de barras, línea y dona en `src/components/dashboard.js`
- [X] T112 [US7] Aplicar formato MXN compartido a etiquetas y tooltips en `src/components/dashboard.js`
- [X] T113 [US7] Conectar evento de periodo cambiado en `src/app.js`
- [X] T114 [US7] Agregar estados vacíos accesibles en `src/components/dashboard.js`
- [X] T115 [US7] Agregar estilos de gráficas y ejes en `src/styles.css`

**Punto de control**: US7 es funcional y verificable de forma independiente.

---

## Fase 15: Pulido y Consideraciones Transversales

**Propósito**: Cerrar deuda documentada, rendimiento, accesibilidad y verificación final.

- [X] T116 [P] Verificar que spec, plan, data-model, contratos y quickstart reflejen el estado implementado en `specs/002-contabilidad-finanzas/quickstart.md`
- [X] T117 Confirmar migración y uso exclusivo de `sessionStorage` en `src/contabilidad/almacenamiento.js`
- [X] T118 [P] Agregar casos límite de dinero y fechas en `tests/unit/contabilidad/dinero.test.js` y `tests/unit/contabilidad/fechas.test.js`
- [X] T119 Agregar filtros/paginación a los listados en `src/components/contabilidad/cuenta-list.js`, `src/components/contabilidad/asiento-list.js`, `src/components/contabilidad/pago-list.js` y `src/components/contabilidad/periodo-list.js`
- [X] T120 Calcular agregaciones de forma incremental en `src/contabilidad/reportes.js` y `src/contabilidad/resumen-pagos.js`
- [X] T121 [P] Revisar accesibilidad y mensajes en `src/components/acceso.js`, `src/components/menu.js`, `src/components/panel-por-rol.js` y `src/components/contabilidad/pago-resumen.js`
- [X] T122 Ejecutar la suite completa con `npm test` según `package.json`
- [X] T123 Ejecutar `npm run build` y la validación manual de `specs/002-contabilidad-finanzas/quickstart.md`

---

## Dependencias y Orden de Ejecución

### Dependencias de Fases

- **Fase 1 (Configuración)**: Sin dependencias; puede iniciar de inmediato.
- **Fase 2 (Fundacional)**: Depende de la Fase 1 y bloquea todas las historias.
- **Fases 3 a 14 (Historias)**: Dependen de la Fase 2; se ejecutan en orden P1 y luego P2, o en paralelo si hay capacidad.
- **Fase 15 (Pulido)**: Depende de las historias incluidas en el alcance.

### Dependencias entre Historias

- **US1 (P1)**: Sin dependencias entre historias; usa semilla y reportes fundacionales.
- **US2 (P1)**: Sin dependencias entre historias; prepara cuentas para US3.
- **US3 (P1)**: Depende de US2 y US5 para cuentas y periodos en escenarios reales; puede probarse con semilla.
- **US4 (P1)**: Depende de la semilla de entidades/documentos; se integra con US12.
- **US5 (P1)**: Sin dependencias entre historias; bloquea el registro de asientos en periodos cerrados.
- **US8 (P1)**: Sin dependencias entre historias; habilita el acceso a los paneles.
- **US9 (P1)**: Depende de US8 para tener rol autenticado; aplica a todas las secciones.
- **US10 (P1)**: Depende de US8 y US9 para mostrar acciones solo al Administrador; alimenta todas las historias.
- **US11 (P1)**: Depende de US8 y US9; debe aplicarse al menú final.
- **US12 (P1)**: Depende de US4, US9 y US10.
- **US6 (P2)**: Depende de US3 y US5; usa los mismos cálculos que US1.
- **US7 (P2)**: Depende de US1, US6 y US10.

### Dentro de Cada Historia

- Pruebas antes que implementación cuando apliquen.
- Modelos/lógica pura antes que componentes.
- Componentes antes de integración en `src/app.js`.
- Cada historia debe quedar funcional antes de pasar a la siguiente.

### Oportunidades Paralelas

- Tareas [P] de Configuración y Fundacional pueden ejecutarse en paralelo dentro de su fase.
- US1, US2, US4, US5 y US8 pueden iniciarse en paralelo tras la Fase 2.
- US9 y US10 pueden avanzar en paralelo después de US8.
- US11 puede avanzar después de US8/US9; US12 después de US4/US9/US10.
- US6 y US7 pueden ejecutarse en paralelo entre sí después de sus dependencias.

---

## Ejemplo Paralelo: US12

```bash
# Pruebas de la historia (T092, T093):
Task: "Agregar pruebas unitarias de EstadoPago y ResumenPagos en tests/unit/contabilidad/resumen-pagos.test.js"
Task: "Agregar pruebas de integración de resumen, filtros y marcar pagado en tests/integration/contabilidad/resumen-pagos.test.js"

# Lógica y componente aislados (T094, T095):
Task: "Implementar clasificación y agregación en centavos en src/contabilidad/resumen-pagos.js"
Task: "Crear el componente de resumen y filtro en src/components/contabilidad/pago-resumen.js"
```

---

## Estrategia de Implementación

### MVP Recomendado

1. Completar Fase 1 y Fase 2.
2. Implementar US8 para tener acceso válido.
3. Implementar US1 para mostrar el panel financiero.
4. Validar US8 y US1 de forma independiente antes de continuar.

### Entrega Incremental

1. Fundamento listo → acceso + resumen (MVP).
2. Cuentas, asientos, pagos y periodos (US2 a US5).
3. Permisos, semilla y navegación única (US9 a US11).
4. Resumen de pagos (US12).
5. Reportes y gráficas (US6 y US7).
6. Pulido y verificación final.

### Estrategia con Equipo Paralelo

- Un desarrollador en US2/US3, otro en US4/US12, otro en US8/US9/US10/US11.
- US6 y US7 se asignan después de que existan movimientos y semilla.
- Cada historia se valida con su **Prueba independiente** antes de integrarse.

---

## Notas

- [P] significa archivos distintos y sin dependencias de tareas incompletas.
- [USn] garantiza trazabilidad hacia la especificación.
- Cada tarea incluye una ruta de archivo concreta.
- No se introduce ninguna dependencia nueva sin justificación en `plan.md`.
- Los documentos de diseño se actualizan cuando cambian formas de datos o comportamiento.
