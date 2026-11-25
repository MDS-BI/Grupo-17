# Plan de Implementación: Módulo de Contabilidad y Finanzas

**Rama**: `002-contabilidad-finanzas` | **Fecha**: 2026-11-23 | **Especificación**: [spec.md](spec.md)
**Entrada**: Especificación de la funcionalidad desde `specs/002-contabilidad-finanzas/spec.md`, ampliada con las Historias de Usuario 1 a 29: resumen financiero, plan de cuentas, asientos, pagos, periodos, reportes, gráficas, acceso por RUT/contraseña, permisos por rol, semilla/restablecimiento, menú único, resumen de pagos, estados financieros, cierre de periodos, trazabilidad, alertas de vencimientos, identidad corporativa, exportación, filtros, interfaz profesional y mejoras de usabilidad sin cambios funcionales.

## Resumen

Construir una aplicación web del módulo de Contabilidad y Finanzas de un ERP usando Vite, HTML, CSS y JavaScript Vanilla. El módulo administra el plan de cuentas, los asientos por partida doble con ciclo `borrador → aprobado → cancelado`, los pagos y cobros, los periodos contables y los reportes financieros. La Historia de Usuario 7 formaliza el análisis financiero visual del panel: gráficas de barras de ingresos/gastos por periodo, línea de resultado y dona de gastos por cuenta, alimentadas por los mismos cálculos de los reportes.

Las Historias de Usuario 8 y 9 añaden acceso simulado con RUT y contraseña para cuatro usuarios de prueba (`Usuario` con `rut`, `contraseña` y `rol`; `Rol` con `permisos`), un panel de inicio distinto por rol y un menú que oculta las secciones no permitidas. La Historia de Usuario 10 expone en el panel del Administrador financiero las acciones "Cargar datos de ejemplo" y "Restablecer datos" con semilla determinista y estado inicial válido. La Historia de Usuario 11 elimina Entidades, Documentos y Búsqueda de la navegación y garantiza un único control visible por pantalla. La Historia de Usuario 12 incorpora dentro de "Pagos y cobros" un resumen por `pendiente`, `pagado` y `vencido` con filtro por estado.

Las Historias de Usuario 13 a 15 amplían el alcance financiero: cuatro estados financieros por periodo (Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General) calculados solo desde asientos aprobados, y el cierre de periodos con confirmación, permiso exclusivo del Administrador financiero y bloqueo de altas, ediciones, eliminaciones y cambios de fecha o estado en asientos y pagos. Las Historias de Usuario 14 y 15 se tratan como una sola capacidad de cierre con bloqueo integral.

La Historia de Usuario 16 agrega `RegistroActividad` como entidad persistente de auditoría: eventos inmutables de creación, edición y anulación de asientos y pagos, con usuario, rol, fecha, hora y campos modificados. Solo el Auditor puede consultarla dentro de "Reportes financieros" y desde el detalle de cada movimiento, sin crear una opción nueva de menú. La Historia de Usuario 17 muestra en el panel del Tesorero alertas de pagos vencidos y de pagos que vencen en la semana actual (`lunes a domingo`) con cantidad, total CLP y detalle acotado, sin enlaces duplicados a "Pagos y cobros". La Historia de Usuario 18 fija la identidad corporativa «Comercial Los Andes SpA» con logotipo ficticio en el encabezado de todas las pantallas posteriores al acceso.

Las Historias de Usuario 19 a 21 cierran la experiencia: exportación de cada reporte a PDF/Excel desde el mismo modelo de datos de pantalla, filtros por fecha/cuenta/monto/estado en asientos y pagos, y una interfaz profesional con paleta única, íconos por sección, tablas ordenables, confirmaciones de guardado/eliminación y menú adaptable a celular. Ninguna de estas mejoras crea nuevas reglas de negocio, permisos ni opciones de menú.

Las Historias de Usuario 22 a 29 refinan la presentación sin alterar la funcionalidad: acceso en su formato anterior con "Ingresar" junto a los campos, encabezado que agrupa nombre, rol y "Cerrar sesión", menú lateral alineado al borde izquierdo, importes en formato chileno "$5.000" sin decimales, formularios visibles antes de los listados y sin botón "Nuevo" ni ventana modal, controles de filtro sin superposición entre la "×" y la flecha, fila de totales del Libro Mayor alineada con sus columnas y mensajes claros para listas vacías. Estas mejoras se aplican a todos los roles que ya tenían acceso a las pantallas afectadas y conservan las reglas, operaciones, permisos y datos vigentes.

Los importes se manejan como enteros en centavos y se formatean en CLP mediante utilidades compartidas, aplicando el formato chileno definido en la Historia de Usuario 25 en listados, formularios, resúmenes, reportes y mensajes. La persistencia se realiza exclusivamente en la sesión del navegador con `sessionStorage` como mecanismo por defecto; la migración desde la implementación actual con `localStorage` queda trazada como T117. Las estructuras base `Entity` y `Document` se reutilizan sin acoplar la lógica contable al núcleo del ERP. La autenticación, los permisos, la sesión activa y los eventos de auditoría viven en la misma capa centralizada; los usuarios de prueba se conservan al restablecer los datos financieros (FR-075).

## Contexto Técnico

**Lenguaje/Versión**: JavaScript (ES2022), HTML, CSS

**Dependencias Principales**: Vite para build y servidor de desarrollo; Vitest y jsdom para pruebas. Sin framework ni librerías en tiempo de ejecución.

**Almacenamiento**: `sessionStorage` del navegador para una instancia única del módulo, detrás de una capa centralizada que mantiene el contrato de almacenamiento de entidades y documentos del módulo base. Se persisten `Usuario`, `Rol`, `Sesion`, `CuentaContable`, `AsientoContable`, `LineaAsiento`, `Pago`, `PeriodoContable` y `RegistroActividad`. No se persisten agregaciones, gráficas, alertas, filtros, estados derivados ni modelos de exportación.

**Pruebas**: Vitest con jsdom para pruebas unitarias de lógica financiera y de integración de flujos completos de pantalla.

**Plataforma Objetivo**: Navegadores modernos de escritorio y móviles.

**Tipo de Proyecto**: Aplicación web frontend, sin backend ni llamadas de red.

**Autenticación**: Simulación local basada en `Usuario`, `Rol` y una única `Sesion` activa en `sessionStorage`. El RUT se normaliza para aceptar formato puntuado o sin puntos/guion; las credenciales son fijas, ficticias y sensibles a mayúsculas. La pantalla de acceso es angosta y centrada (HU22) y el encabezado posterior al acceso agrupa nombre, rol y "Cerrar sesión" (HU23). No se envían ni se registran credenciales fuera de la sesión del navegador.

**Navegación y Permisos**: Matriz `Rol → PermisoRol → OpcionMenu derivada`. Las opciones no permitidas se ocultan, no se deshabilitan; las secciones excluidas son Entidades, Documentos y Búsqueda. El menú lateral se alinea al borde izquierdo del área de trabajo y conserva etiquetas, orden y permisos (HU24). Cada pantalla se abre desde un solo control visible; cargar datos, restablecer datos, exportar y cerrar sesión son acciones, no destinos de navegación.

**Reportes y Cierre**: `src/contabilidad/reportes.js` expone funciones puras para `libroMayor`, `balanceComprobacion`, `estadoResultados` y `balanceGeneral`, con saldos iniciales derivados de aprobados anteriores al periodo. `src/contabilidad/periodos.js` centraliza `cerrarPeriodo`, y `src/contabilidad/validaciones-periodos.js` expone `periodoAbiertoPorFecha` para asientos y pagos. El bloqueo se revalida al guardar, incluso para el Administrador financiero.

**Auditoría y Alertas**: `src/contabilidad/auditoria.js` registra eventos append-only solo después de escrituras exitosas y con cambios reales. `src/contabilidad/alertas-vencimientos.js` deriva `vencidos` y `venceEstaSemana` desde pagos pendientes, fecha de referencia y entidades, sin duplicar un pago en ambas alertas.

**Exportación e Interfaz**: La vista de reportes construye un único `modeloExportacion` para pantalla, PDF y Excel, usando `Blob` y `URL.createObjectURL`; la exportación es de solo lectura. Los tokens de color, el mapa de íconos, los comparadores de tabla y el drawer móvil se derivan de una sola configuración compartida para no duplicar lógica visual. Las HU25–HU29 reutilizan esas utilidades: `formatearCLP` para el formato chileno sin decimales, formularios permanentes antes de los listados, controles de filtro separados, totales del Libro Mayor alineados por columnas y un mensaje de lista vacía coherente con los estados vacíos ya definidos.

**Semilla y Estados de Pago**: La semilla determinista produce al menos cuatro periodos no superpuestos, ocho cuentas, ocho asientos aprobados y cuatro pagos/cobros con al menos un movimiento por periodo y un pago en cada estado. `EstadoPago` se deriva de `status`, `fechaVencimiento` y `anulado`; `ResumenPagos` agrega cantidad y total en CLP sin crear una nueva pantalla.

**Objetivos de Rendimiento**: Interacciones responsivas para listas de hasta 500 registros; filtros, ordenación, actualización de listas, cambio de sesión, reportes y renderizado de gráficas deben sentirse instantáneos. Las agregaciones se reutilizan entre panel, reportes, alertas y exportación; la paginación y el cálculo incremental quedan trazados como T120.

**Restricciones**: Huella mínima de librerías, despliegue simple, sin backend; gráficas SVG en línea y exportación vanilla sin dependencias; estructura extensible para módulos personalizados; todo el código y los mensajes visibles en español.

**Escala/Alcance**: Veintinueve historias de usuario (HU1–HU29), seis secciones financieras navegables más el panel, cuatro roles con panel propio, CRUD de entidades y documentos base solo de forma contextual, semilla determinista reiniciable, auditoría persistente, mejoras de usabilidad sin cambios funcionales y coexistencia con la configuración del módulo.

## Verificación de la Constitución

*GATE: Debe pasar antes de la investigación de la Fase 0. Reverificar tras el diseño de la Fase 1.*

**Verificación previa**:

- **I. Integridad Financiera**: los cálculos viven en `src/contabilidad/` y consumen enteros en centavos; reportes, gráficas, resumen de pagos, alertas, filtros y exportación leen `calcularResumen`, `calcularSaldosCuentas`, `resumirPagos`, `alertasDeVencimientos` y las funciones de reportes en lugar de computar importes por su cuenta. La semilla solo genera asientos balanceados y eventos de auditoría deterministas. Pendiente centralizar todas las sumas en `sumarCentavos` (T118).
- **II. Simulación Completa de Datos en Sesión**: sin `fetch`, XHR ni WebSockets; semilla determinista y reiniciable. `Usuario`, `Rol`, `Sesion`, `RegistroActividad`, `EstadoPago`, `ResumenPagos` y `AlertaPago` se gestionan en la misma capa centralizada de `sessionStorage`. La desviación actual con `localStorage` se corrige en T117 y las eliminaciones con referencias rotas en T117.
- **III. Código en Español, Vanilla y Modular**: ES modules nativos, identificadores y mensajes en español, SVG en línea y exportación sin librerías. Se añaden módulos pequeños para acceso, roles, permisos, menú, panel por rol, reportes, cierre, auditoría, alertas, exportación, filtros e interfaz; el menú no produce navegación duplicada.
- **IV. Verificación con Tests**: lógica financiera cubierta por Vitest y flujos por jsdom. Se requieren pruebas para HU13–HU21 y HU22–HU29 además de las de acceso, permisos, semilla/restablecimiento y estados de pago. La referencia actual es `npm test` sin fallos y `npm run build` correcto.
- **V. Claridad y Consistencia Financiera**: formatos compartidos de moneda y fecha, estados vacíos en español y tablas numéricas alineadas. Los reportes, exportaciones, alertas y filtros usan el mismo formato CLP; los reportes muestran advertencias cuando no cuadran y nunca permiten capturar cifras manualmente.
- **Restricciones Técnicas y Flujo de Desarrollo**: stack cerrado, sin backend, acceso centralizado y documentación actualizada. La autenticación y la auditoría son deliberadamente locales y de demostración.

**Resultado del gate**: sin violaciones sin justificar. Las desviaciones temporales quedan registradas en **Seguimiento de Complejidad** con su tarea de eliminación y se reevalúan tras el diseño.

**Re-verificación posterior al diseño**: las Historias de Usuario 13 a 21 eliminan el trabajo no solicitado y formalizan reportes, cierre, trazabilidad, alertas, identidad, exportación, filtros e interfaz. Las Historias de Usuario 22 a 29 solo ajustan disposición y presentación: no crean operaciones, pantallas, permisos ni reglas nuevas, no introducen dependencias y reutilizan el formato CLP compartido y los estados vacíos existentes. Las Historias de Usuario 30 y 31 formalizan la rastreabilidad de totales, la unidad CLP y la terminología de IVA chilena sin alterar cálculos ni permisos. Todas las vistas derivan de agregaciones o configuración existentes.
 `RegistroActividad` conserva la integridad financiera como evidencia inmutable sin convertirse en una nueva opción de menú. El gate sigue superado con la deuda documentada.

## Estructura del Proyecto

### Documentación (esta funcionalidad)

```text
specs/002-contabilidad-finanzas/
├── plan.md                    # Plan de implementación (/speckit.plan)
├── research.md                # Decisiones de la Fase 0
├── data-model.md              # Modelo de datos y vistas derivadas
├── quickstart.md              # Guía de validación de extremo a extremo
├── contracts/                 # Contratos de todas las historias
│   ├── acceso-roles.md
│   ├── navegacion-unica.md
│   ├── dashboard-charts.md
│   ├── resumen-pagos.md
│   ├── entity-storage.md
│   ├── estados-financieros.md
│   ├── cierre-periodo.md
│   ├── registro-actividad.md
│   ├── alertas-vencimientos.md
│   ├── identidad-corporativa.md
│   ├── exportacion-reportes.md
│   ├── filtros-movimientos.md
│   └── interfaz-profesional.md
├── er-diagram.md
├── diagrama.mmd
├── diagrama.png
├── spec.md
└── tasks.md                   # Lista derivada; regenerar desde este plan con /speckit.tasks
```

### Código Fuente (raíz del repositorio)

```text
src/
├── main.js
├── app.js
├── module-config.js
├── storage.js
├── styles.css
├── contabilidad/
│   ├── almacenamiento.js
│   ├── semilla.js
│   ├── dinero.js
│   ├── fechas.js
│   ├── cuentas.js
│   ├── asientos.js
│   ├── pagos.js
│   ├── resumen-pagos.js
│   ├── periodos.js
│   ├── reportes.js
│   ├── auditoria.js
│   ├── alertas-vencimientos.js
│   ├── exportacion-reportes.js
│   ├── filtros-movimientos.js
│   ├── interfaz-config.js
│   ├── usuarios.js
│   ├── roles.js
│   ├── permisos.js
│   ├── sesion.js
│   ├── validaciones-cuentas.js
│   ├── validaciones-asientos.js
│   ├── validaciones-pagos.js
│   ├── validaciones-periodos.js
│   └── validaciones-acceso.js
└── components/
    ├── shell.js
    ├── acceso.js
    ├── menu.js
    ├── panel-por-rol.js
    ├── dashboard.js
    ├── entity-form.js
    ├── entity-list.js
    ├── document-form.js
    ├── document-list.js
    ├── custom-fields.js
    └── contabilidad/
        ├── comun.js
        ├── resumen.js
        ├── cuenta-form.js
        ├── cuenta-list.js
        ├── asiento-form.js
        ├── asiento-list.js
        ├── pago-form.js
        ├── pago-list.js
        ├── pago-resumen.js
        ├── periodo-form.js
        ├── periodo-list.js
        ├── reportes.js
        ├── registro-actividad.js
        └── exportacion.js

tests/
├── setup/contabilidad.js
├── unit/contabilidad/
└── integration/contabilidad/
```

**Decisión de Estructura**: aplicación Vite de un único punto de entrada con módulos JavaScript pequeños y CSS separado. `src/contabilidad/` concentra la lógica pura de dominio y `src/components/contabilidad/` las vistas; `src/components/dashboard.js` renderiza las gráficas del panel y las alertas del Tesorero usando datos de `src/contabilidad/reportes.js` y `src/contabilidad/alertas-vencimientos.js`. La lógica de acceso, roles y permisos es pura y se prueba sin DOM; la auditoría se registra en la capa central de escrituras para cubrir asientos y pagos sin duplicar emisores. `src/app.js` orquesta autenticación, menú, cambio de vista, semilla perezosa, cierre de periodos y eventos. `module-config.js` e `interfaz-config.js` centralizan etiquetas, paleta, íconos y tema; los tokens de diseño viven en `styles.css`.

## Seguimiento de Complejidad

| Desviación / deuda | Por qué sigue presente | Condición de eliminación |
|---|---|---|
| Persistencia en `localStorage` (T117) | La implementación heredada del módulo base usa `localStorage`; la constitución exige `sessionStorage` salvo exigencia explícita de la spec. | Migrar colecciones contables y capa base usada por el módulo a `sessionStorage` y actualizar el contrato y las pruebas. |
| Eliminación sin RESTRICT/SET NULL (T117) | Las operaciones base de `Entity`/`Document` se conservan por compatibilidad con el módulo 001. | Impedir borrar registros con asientos, pagos o auditoría vinculada y desvincular referencias opcionales. |
| Sumas monetarias fuera de la utilidad central (T118) | Las agregaciones históricas usan reduce directo sobre enteros en centavos. | Enrutar todas las sumas por `sumarCentavos` y verificar con pruebas unitarias. |
| Sin pruebas unitarias directas de dinero/fechas (T118) | La cobertura actual es indirecta a través de validaciones e integración. | Agregar `dinero.test.js` y `fechas.test.js` con casos límite. |
| Unidad CLP, orden por tipo y drill-down (HU30) | Resuelta en T316–T318: los encabezados monetarios indican CLP, la columna Tipo es ordenable y cada total abre su desglose. | Mostrar CLP, ordenar por tipo y permitir consultar el detalle detrás de cada total. |
| Listas sin paginación y reportes con recálculo completo (T120) | Las colecciones de ejemplo son pequeñas, pero el objetivo de rendimiento contempla 500 registros. | Paginar/filtrar listados y calcular agregaciones de forma incremental. |
| Autenticación y contraseñas de demostración en la sesión (HU8) | La constitución exige simular el acceso sin backend ni servicio de identidad; las credenciales son ficticias y deterministas. | Mantenerlas como datos fijos de la semilla de prueba, nunca registrarlas ni reutilizarlas fuera de la demo; eliminar la deuda si el alcance incorpora un proveedor de identidad real. |
| Exportación PDF/Excel sin dependencias (HU19) | No hay librerías de runtime permitidas y el despliegue debe seguir siendo simple. | Mantener generadores vanilla acotados; revisar la deuda si el alcance permite añadir dependencias. |
