# Investigación: Módulo de Contabilidad y Finanzas

## Introducción

Registro de decisiones técnicas tomadas durante la fase 0. No quedan puntos `NEEDS CLARIFICATION`: el stack está fijado por la constitución y la Historia de Usuario 7 elimina la ambigüedad sobre las gráficas del panel (finding F9).

## Decisiones

### Gráficas del panel

- **Decisión**: Mantener las gráficas en SVG generado en línea desde `src/components/dashboard.js`, sin librerías de charting.
- **Razonamiento**: La constitución fija un stack cerrado de JavaScript Vanilla y huella mínima de dependencias; las gráficas existentes ya usan SVG, son ligeras y funcionan sin red. Cubren FR-035 a FR-039 con barras para ingresos/gastos por periodo, línea para resultado y dona para gastos por cuenta.
- **Alternativas consideradas**: Chart.js / ECharts — rechazadas porque añadirían dependencias en tiempo de ejecución y una capa de renderizado innecesaria. Imágenes estáticas — rechazadas porque no responden al filtro de periodo ni a datos reales de la sesión.

### Origen de los datos de las gráficas

- **Decisión**: Las gráficas consumen `calcularResumen(periodos, cuentas, asientos, pagos)` y `calcularSaldosCuentas(cuentas, asientos, pagos)` desde `src/contabilidad/reportes.js`.
- **Razonamiento**: Garantiza un único cálculo para panel, reportes y tablas. La suma de la serie de resultado debe coincidir con el resumen y con los totales del reporte; evita duplicar reglas de partida doble en la vista.
- **Alternativas consideradas**: Calcular series dentro del componente — rechazado porque introduciría divergencia con los reportes (riesgo sobre Principio I). Llamadas a un backend — rechazado porque no existe backend y la constitución prohíbe llamadas de red.

### Formato monetario y compacto de ejes

- **Decisión**: tooltips, etiquetas y tablas usan `formatearMXN` de `src/contabilidad/comun.js`; las etiquetas compactas de los ejes se centralizan en la misma capa de formato para no repetir división y redondeo en el componente.
- **Razonamiento**: El importe se almacena en centavos y debe mostrarse en MXN con dos decimales; un formato disperso produce inconsistencias visuales y viola el Principio V. La centralización pendiente queda trazada como T067.
- **Alternativas consideradas**: `toLocaleString` directo en cada gráfica — rechazado porque permitiría aritmética de punto flotante y formatos dispares. Mostrar centavos crudos — rechazado porque no es legible para el usuario financiero.

### Estados vacíos y mensajes

- **Decisión**: Reutilizar el patrón `mostrarMensaje` con mensajes en español cuando no haya periodos, cuando el periodo seleccionado no tenga movimientos o cuando un grupo de gastos esté vacío.
- **Razonamiento**: Cubre los casos límite de US7, evita gráficas en blanco y mantiene consistencia con reportes y listados.
- **Alternativas consideradas**: Renderizar ejes vacíos — rechazado por baja claridad. Ocultar el panel completo — rechazado porque el usuario todavía necesita ver el selector de periodo y las acciones rápidas.

### Persistencia en sesión

- **Decisión**: `sessionStorage` como mecanismo por defecto, encapsulado en la capa de almacenamiento del módulo; las colecciones heredadas de `Entity`/`Document` se migran desde `localStorage` sin cambiar su contrato público.
- **Razonamiento**: La especificación no pide persistencia entre sesiones y la constitución solo permite `localStorage` con exigencia explícita. `sessionStorage` cumple el Principio II y mantiene el reinicio determinista de la semilla.
- **Alternativas consideradas**: Mantener `localStorage` — rechazado por contradecir la constitución (F1). IndexedDB — rechazado porque añade complejidad asíncrona y no aporta al caso de una sola pestaña.

### Integridad referencial

- **Decisión**: Centralizar las reglas `RESTRICT`/`SET NULL` en las operaciones de borrado: no eliminar cuentas, periodos, entidades o documentos con asientos/pagos dependientes; desvincular referencias opcionales cuando corresponda.
- **Razonamiento**: Los reportes y las gráficas deben seguir siendo coherentes durante la sesión; un borrado huérfano rompería FR-032 y los cálculos de los componentes.
- **Alternativas consideradas**: Borrado en cascada — rechazado porque destruiría información financiera aprobada. Borrado libre con filtros en la vista — rechazado porque dejaría referencias rotas en la persistencia.

### Estrategia de pruebas

- **Decisión**: Vitest + jsdom con una semilla determinista reiniciable por archivo de prueba; pruebas unitarias para dinero/fechas/validaciones/agregaciones y pruebas de integración para los flujos de las siete historias de usuario, incluidos estados vacíos y filtro de periodo del panel.
- **Razonamiento**: Cubre el Principio IV y permite verificar que las gráficas y los reportes usan los mismos cálculos sin depender del navegador real.
- **Alternativas consideradas**: Cypress/Playwright — rechazado por requerir navegador y aumentar la huella de dependencias. Solo pruebas manuales — rechazado porque no da regresión sobre lógica monetaria.

### Rendimiento y escala

- **Decisión**: Los listados admiten búsqueda y filtros; los reportes y agregaciones se calculan sobre el estado en memoria y se reutilizan entre panel y reportes. La paginación y el cálculo incremental quedan trazados como T070.
- **Razonamiento**: Con 500 registros, recalcular todo el reporte en cada interacción es innecesario; separar agregación de renderizado mantiene la UI responsiva sin cambiar el modelo de datos.
- **Alternativas consideradas**: Web Worker — rechazado por complejidad prematura. Precarga de datos en memoria global — rechazado porque ya existe un estado único por sesión.
