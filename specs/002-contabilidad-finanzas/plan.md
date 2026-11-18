# Plan de Implementación: Módulo de Contabilidad y Finanzas

**Rama**: `002-contabilidad-finanzas` | **Fecha**: 2026-11-18 | **Especificación**: [spec.md](spec.md)
**Entrada**: Especificación de la funcionalidad desde `specs/002-contabilidad-finanzas/spec.md`, incluida la Historia de Usuario 7 que formaliza las gráficas del panel (finding F9).

## Resumen

Construir una aplicación web del módulo de Contabilidad y Finanzas de un ERP usando Vite, HTML, CSS y JavaScript Vanilla. El módulo administra el plan de cuentas, los asientos por partida doble con ciclo `borrador → aprobado → cancelado`, los pagos y cobros, los periodos contables y los reportes financieros. La Historia de Usuario 7 incorpora además el análisis financiero visual del panel: gráficas de barras de ingresos/gastos por periodo, línea de resultado y dona de gastos por cuenta, alimentadas por los mismos cálculos de los reportes.

Los importes se manejan como enteros en centavos y se formatean en MXN mediante utilidades compartidas. La persistencia se realiza exclusivamente en la sesión del navegador con `sessionStorage` como mecanismo por defecto; la migración desde la implementación actual con `localStorage` queda trazada como T063. Las estructuras base `Entity` y `Document` se reutilizan sin acoplar la lógica contable al núcleo del ERP.

## Contexto Técnico

**Lenguaje/Versión**: JavaScript (ES2022), HTML, CSS

**Dependencias Principales**: Vite para build y servidor de desarrollo; Vitest y jsdom para pruebas. Sin framework ni librerías en tiempo de ejecución.

**Almacenamiento**: `sessionStorage` del navegador para una instancia única del módulo, detrás de una capa centralizada que mantiene el contrato de almacenamiento de entidades y documentos del módulo base. La especificación no exige `localStorage`, por lo que no se usa para las colecciones del módulo.

**Pruebas**: Vitest con jsdom para pruebas unitarias de lógica financiera y de integración de flujos completos de pantalla.

**Plataforma Objetivo**: Navegadores modernos de escritorio y móviles.

**Tipo de Proyecto**: Aplicación web frontend, sin backend ni llamadas de red.

**Objetivos de Rendimiento**: Interacciones responsivas para listas de hasta 500 registros; búsqueda, filtros, actualización de listas y renderizado de gráficas deben sentirse instantáneos. Los reportes y agregaciones se calculan de forma incremental.

**Restricciones**: Huella mínima de librerías, despliegue simple, sin backend; gráficas SVG en línea sin dependencias; estructura extensible para módulos personalizados; todo el código y los mensajes visibles en español.

**Escala/Alcance**: Siete historias de usuario, seis secciones contables más el panel, CRUD de entidades y documentos base, semilla determinista reiniciable y coexistencia con la configuración del módulo.

## Verificación de la Constitución

*GATE: Debe pasar antes de la investigación de la Fase 0. Reverificar tras el diseño de la Fase 1.*

**Verificación previa**:

- **I. Integridad Financiera**: los cálculos viven en `src/contabilidad/` y consumen enteros en centavos; las gráficas leen `calcularResumen` y `calcularSaldosCuentas` en lugar de computar importes por su cuenta. Pendiente centralizar todas las sumas en `sumarCentavos` (T067).
- **II. Simulación Completa de Datos en Sesión**: sin `fetch`, XHR ni WebSockets; semilla determinista y reiniciable. La decisión de diseño es `sessionStorage`; la desviación actual con `localStorage` se corrige en T063 y las eliminaciones con referencias rotas en T064.
- **III. Código en Español, Vanilla y Modular**: ES modules nativos, identificadores y mensajes en español, SVG en línea sin librerías nuevas; las gráficas se ubican en `src/components/dashboard.js` y reutilizan utilidades de formato.
- **IV. Verificación con Tests**: lógica financiera cubierta por Vitest y flujos por jsdom; `npm test` (167 pruebas) y `npm run build` pasan. Falta cobertura unitaria directa de dinero y fechas (T068).
- **V. Claridad y Consistencia Financiera**: formatos compartidos de moneda y fecha, estados vacíos en español y tablas numéricas alineadas. Pendiente indicar unidades MXN y drill-down en reportes (T069).
- **Restricciones Técnicas y Flujo de Desarrollo**: stack cerrado, sin backend, acceso centralizado y documentación actualizada. Pendiente paginación/filtrado y cálculo incremental (T070).

**Resultado del gate**: sin violaciones sin justificar. Las desviaciones temporales quedan registradas en **Seguimiento de Complejidad** con su tarea de eliminación y se reevalúan tras el diseño.

**Re-verificación posterior al diseño**: la Historia de Usuario 7, FR-035 a FR-039 y SC-011 eliminan la condición de trabajo no solicitado de F9; las gráficas derivan de agregaciones existentes, usan formato MXN compartido y no introducen dependencias ni nuevas formas de datos. El gate sigue superado con la deuda documentada.

## Estructura del Proyecto

### Documentación (esta funcionalidad)

```text
specs/002-contabilidad-finanzas/
├── plan.md              # Plan de implementación (/speckit.plan)
├── research.md          # Decisiones de la Fase 0
├── data-model.md        # Modelo de datos y vistas derivadas
├── quickstart.md        # Guía de validación de extremo a extremo
├── contracts/           # Contratos de almacenamiento e interfaz de panel
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
│   ├── periodos.js
│   ├── reportes.js
│   ├── validaciones-cuentas.js
│   ├── validaciones-asientos.js
│   ├── validaciones-pagos.js
│   └── validaciones-periodos.js
└── components/
    ├── shell.js
    ├── dashboard.js        (indicadores, acciones rápidas y gráficas SVG del panel)
    ├── entity-form.js
    ├── entity-list.js
    ├── document-form.js
    ├── document-list.js
    ├── search-bar.js
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
        ├── periodo-form.js
        ├── periodo-list.js
        └── reportes.js

tests/
├── setup/contabilidad.js
├── unit/contabilidad/
└── integration/contabilidad/
```

**Decisión de Estructura**: aplicación Vite de un único punto de entrada con módulos JavaScript pequeños y CSS separado. `src/contabilidad/` concentra la lógica pura de dominio y `src/components/contabilidad/` las vistas; `src/components/dashboard.js` renderiza las gráficas del panel usando SVG en línea y datos de `src/contabilidad/reportes.js`. `src/app.js` orquesta el cambio de vista, la semilla perezosa y los eventos de los formularios. `module-config.js` centraliza etiquetas y tema; los tokens de diseño viven en `styles.css`.

## Seguimiento de Complejidad

| Desviación / deuda | Por qué sigue presente | Condición de eliminación |
|---|---|---|
| Persistencia en `localStorage` (T063) | La implementación heredada del módulo base usa `localStorage`; la constitución exige `sessionStorage` salvo exigencia explícita de la spec. | Migrar colecciones contables y capa base usada por el módulo a `sessionStorage` y actualizar el contrato y las pruebas. |
| Eliminación sin RESTRICT/SET NULL (T064) | Las operaciones base de `Entity`/`Document` se conservan por compatibilidad con el módulo 001. | Impedir borrar registros con asientos o pagos vinculados y desvincular referencias opcionales. |
| Sumas monetarias fuera de la utilidad central (T067) | Las agregaciones históricas usan reduce directo sobre enteros en centavos. | Enrutar todas las sumas por `sumarCentavos` y verificar con pruebas unitarias. |
| Sin pruebas unitarias directas de dinero/fechas (T068) | La cobertura actual es indirecta a través de validaciones e integración. | Agregar `dinero.test.js` y `fechas.test.js` con casos límite. |
| Tablas sin unidad MXN ni drill-down (T069) | El reporte ya lista los movimientos de origen, pero no expone el desglose desde los totales ni la unidad en los encabezados. | Mostrar MXN y permitir consultar el detalle de movimientos detrás de cada total. |
| Listas sin paginación y reportes con recálculo completo (T070) | Las colecciones de ejemplo son pequeñas, pero el objetivo de rendimiento contempla 500 registros. | Paginar/filtrar listados y calcular agregaciones de forma incremental. |
