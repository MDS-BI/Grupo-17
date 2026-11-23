# Plan de Implementación: Módulo de Contabilidad y Finanzas

**Rama**: `002-contabilidad-finanzas` | **Fecha**: 2026-11-23 | **Especificación**: [spec.md](spec.md)
**Entrada**: Especificación de la funcionalidad desde `specs/002-contabilidad-finanzas/spec.md`, ampliada con las Historias de Usuario 8 a 12: acceso con RUT y contraseña, permisos por rol, carga y restablecimiento de datos, menú sin navegación duplicada y resumen de pagos por estado. La Historia de Usuario 7 formaliza las gráficas del panel (finding F9).

## Resumen

Construir una aplicación web del módulo de Contabilidad y Finanzas de un ERP usando Vite, HTML, CSS y JavaScript Vanilla. El módulo administra el plan de cuentas, los asientos por partida doble con ciclo `borrador → aprobado → cancelado`, los pagos y cobros, los periodos contables y los reportes financieros. La Historia de Usuario 7 incorpora el análisis financiero visual del panel: gráficas de barras de ingresos/gastos por periodo, línea de resultado y dona de gastos por cuenta, alimentadas por los mismos cálculos de los reportes.

Las Historias de Usuario 8 y 9 añaden un acceso simulado con RUT y contraseña para cuatro usuarios de prueba (`Usuario` con `rut`, `contraseña` y `rol`; `Rol` con `permisos`), un panel de inicio distinto por rol y un menú que oculta las secciones no permitidas. La Historia de Usuario 10 expone en el panel del Administrador financiero las acciones "Cargar datos de ejemplo" y "Restablecer datos" con semilla determinista y estado inicial válido. La Historia de Usuario 11 elimina Entidades, Documentos y Búsqueda de la navegación y garantiza un único control visible por pantalla. La Historia de Usuario 12 incorpora dentro de "Pagos y cobros" un resumen por `pendiente`, `pagado` y `vencido` con filtro por estado.

Los importes se manejan como enteros en centavos y se formatean en MXN mediante utilidades compartidas. La persistencia se realiza exclusivamente en la sesión del navegador con `sessionStorage` como mecanismo por defecto; la migración desde la implementación actual con `localStorage` queda trazada como T063. Las estructuras base `Entity` y `Document` se reutilizan sin acoplar la lógica contable al núcleo del ERP. La autenticación, los permisos y la sesión activa viven en la misma capa centralizada; los usuarios de prueba se conservan al restablecer los datos financieros (FR-075).

## Contexto Técnico

**Lenguaje/Versión**: JavaScript (ES2022), HTML, CSS

**Dependencias Principales**: Vite para build y servidor de desarrollo; Vitest y jsdom para pruebas. Sin framework ni librerías en tiempo de ejecución.

**Almacenamiento**: `sessionStorage` del navegador para una instancia única del módulo, detrás de una capa centralizada que mantiene el contrato de almacenamiento de entidades y documentos del módulo base. La especificación no exige `localStorage`, por lo que no se usa para las colecciones del módulo.

**Pruebas**: Vitest con jsdom para pruebas unitarias de lógica financiera y de integración de flujos completos de pantalla.

**Plataforma Objetivo**: Navegadores modernos de escritorio y móviles.

**Tipo de Proyecto**: Aplicación web frontend, sin backend ni llamadas de red.

**Autenticación**: Simulación local basada en `Usuario`, `Rol` y una única `Sesion` activa en `sessionStorage`. El RUT se normaliza para aceptar formato puntuado o sin puntos/guion; las credenciales son fijas, ficticias y sensibles a mayúsculas. No se envían ni se registran credenciales fuera de la sesión del navegador.

**Navegación y Permisos**: Matriz `Rol → PermisoRol → OpcionMenu derivada`. Las opciones no permitidas se ocultan, no se deshabilitan; las secciones excluidas son Entidades, Documentos y Búsqueda. Cada pantalla se abre desde un solo control visible; cargar datos, restablecer datos y cerrar sesión son acciones, no destinos de navegación.

**Semilla y Estados de Pago**: La semilla determinista produce al menos cuatro periodos no superpuestos, ocho cuentas, ocho asientos aprobados y cuatro pagos/cobros con al menos un movimiento por periodo y un pago en cada estado. `EstadoPago` se deriva de `status` y `fechaVencimiento`; `ResumenPagos` agrega cantidad y total en MXN sin crear una nueva pantalla.

**Objetivos de Rendimiento**: Interacciones responsivas para listas de hasta 500 registros; filtros, actualización de listas, cambio de sesión y renderizado de gráficas deben sentirse instantáneos. Los reportes y agregaciones, incluido el resumen de pagos, se calculan de forma incremental.

**Restricciones**: Huella mínima de librerías, despliegue simple, sin backend; gráficas SVG en línea sin dependencias; estructura extensible para módulos personalizados; todo el código y los mensajes visibles en español.

**Escala/Alcance**: Doce historias de usuario, seis secciones financieras navegables más el panel, cuatro roles con panel propio, CRUD de entidades y documentos base solo de forma contextual, semilla determinista reiniciable y coexistencia con la configuración del módulo.

## Verificación de la Constitución

*GATE: Debe pasar antes de la investigación de la Fase 0. Reverificar tras el diseño de la Fase 1.*

**Verificación previa**:

- **I. Integridad Financiera**: los cálculos viven en `src/contabilidad/` y consumen enteros en centavos; las gráficas y el resumen de pagos leen `calcularResumen`, `calcularSaldosCuentas` y `resumirPagos` en lugar de computar importes por su cuenta. La semilla solo genera asientos balanceados. Pendiente centralizar todas las sumas en `sumarCentavos` (T067).
- **II. Simulación Completa de Datos en Sesión**: sin `fetch`, XHR ni WebSockets; semilla determinista y reiniciable. `Usuario`, `Rol`, `Sesion`, `EstadoPago` y `ResumenPagos` se gestionan en la misma capa centralizada de `sessionStorage`. La desviación actual con `localStorage` se corrige en T063 y las eliminaciones con referencias rotas en T064.
- **III. Código en Español, Vanilla y Modular**: ES modules nativos, identificadores y mensajes en español, SVG en línea sin librerías nuevas. Se añaden módulos pequeños para acceso, roles, permisos, menú, panel por rol y resumen de pagos; el menú no produce navegación duplicada.
- **IV. Verificación con Tests**: lógica financiera cubierta por Vitest y flujos por jsdom; `npm test` (167 pruebas) y `npm run build` pasan. Falta cobertura unitaria directa de dinero y fechas (T068) y se requieren pruebas de acceso, permisos, semilla/restablecimiento y estados de pago.
- **V. Claridad y Consistencia Financiera**: formatos compartidos de moneda y fecha, estados vacíos en español y tablas numéricas alineadas. Los paneles por rol y el resumen de pagos usan el mismo formato MXN; el resumen mantiene visibles los tres totales al aplicar un filtro. Pendiente indicar unidades MXN y drill-down en reportes (T069).
- **Restricciones Técnicas y Flujo de Desarrollo**: stack cerrado, sin backend, acceso centralizado y documentación actualizada. La autenticación es deliberadamente local y de demostración. Pendiente paginación/filtrado y cálculo incremental (T070).

**Resultado del gate**: sin violaciones sin justificar. Las desviaciones temporales quedan registradas en **Seguimiento de Complejidad** con su tarea de eliminación y se reevalúan tras el diseño.

**Re-verificación posterior al diseño**: las Historias de Usuario 7 a 12 y FR-035 a FR-101 eliminan la condición de trabajo no solicitado de F9 y formalizan el acceso, la navegación, la semilla y el resumen de pagos. Todas las vistas derivan de agregaciones o configuración de sesión existentes, usan formato MXN compartido y no introducen dependencias. El gate sigue superado con la deuda documentada.

## Estructura del Proyecto

### Documentación (esta funcionalidad)

```text
specs/002-contabilidad-finanzas/
├── plan.md              # Plan de implementación (/speckit.plan)
├── research.md          # Decisiones de la Fase 0
├── data-model.md        # Modelo de datos y vistas derivadas
├── quickstart.md        # Guía de validación de extremo a extremo
├── contracts/           # Contratos de acceso/roles, navegación, panel y pagos
│   ├── acceso-roles.md
│   ├── navegacion-unica.md
│   ├── dashboard-charts.md
│   ├── resumen-pagos.md
│   └── entity-storage.md
├── er-diagram.md
├── diagrama.mmd
├── diagrama.png
├── spec.md
└── tasks.md
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
    ├── dashboard.js        (indicadores, gráficas SVG y acciones del panel)
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
        └── reportes.js

tests/
├── setup/contabilidad.js
├── unit/contabilidad/
└── integration/contabilidad/
```

**Decisión de Estructura**: aplicación Vite de un único punto de entrada con módulos JavaScript pequeños y CSS separado. `src/contabilidad/` concentra la lógica pura de dominio y `src/components/contabilidad/` las vistas; `src/components/dashboard.js` renderiza las gráficas del panel usando SVG en línea y datos de `src/contabilidad/reportes.js`. La lógica de acceso, roles y permisos es pura y se prueba sin DOM en `src/contabilidad/usuarios.js`, `roles.js`, `permisos.js` y `sesion.js`; `src/components/acceso.js`, `menu.js` y `panel-por-rol.js` solo presentan ese estado. `src/contabilidad/resumen-pagos.js` deriva `EstadoPago` y `ResumenPagos`; `src/components/contabilidad/pago-resumen.js` los muestra dentro de `pago-list.js` sin nueva ruta. `src/app.js` orquesta autenticación, menú, cambio de vista, semilla perezosa y eventos. `module-config.js` centraliza etiquetas y tema; los tokens de diseño viven en `styles.css`.

## Seguimiento de Complejidad

| Desviación / deuda | Por qué sigue presente | Condición de eliminación |
|---|---|---|
| Persistencia en `localStorage` (T063) | La implementación heredada del módulo base usa `localStorage`; la constitución exige `sessionStorage` salvo exigencia explícita de la spec. | Migrar colecciones contables y capa base usada por el módulo a `sessionStorage` y actualizar el contrato y las pruebas. |
| Eliminación sin RESTRICT/SET NULL (T064) | Las operaciones base de `Entity`/`Document` se conservan por compatibilidad con el módulo 001. | Impedir borrar registros con asientos o pagos vinculados y desvincular referencias opcionales. |
| Sumas monetarias fuera de la utilidad central (T067) | Las agregaciones históricas usan reduce directo sobre enteros en centavos. | Enrutar todas las sumas por `sumarCentavos` y verificar con pruebas unitarias. |
| Sin pruebas unitarias directas de dinero/fechas (T068) | La cobertura actual es indirecta a través de validaciones e integración. | Agregar `dinero.test.js` y `fechas.test.js` con casos límite. |
| Tablas sin unidad MXN ni drill-down (T069) | El reporte ya lista los movimientos de origen, pero no expone el desglose desde los totales ni la unidad en los encabezados. | Mostrar MXN y permitir consultar el detalle de movimientos detrás de cada total. |
| Listas sin paginación y reportes con recálculo completo (T070) | Las colecciones de ejemplo son pequeñas, pero el objetivo de rendimiento contempla 500 registros. | Paginar/filtrar listados y calcular agregaciones de forma incremental. |
| Autenticación y contraseñas de demostración en la sesión (HU8) | La constitución exige simular el acceso sin backend ni servicio de identidad; las credenciales son ficticias y deterministas. | Mantenerlas como datos fijos de la semilla de prueba, nunca registrarlas ni reutilizarlas fuera de la demo; eliminar la deuda si el alcance incorpora un proveedor de identidad real. |
