# Investigación: Módulo de Contabilidad y Finanzas

## Introducción

Registro de decisiones técnicas tomadas durante la fase 0. No quedan puntos `NEEDS CLARIFICATION`: el stack está fijado por la constitución, la Historia de Usuario 7 elimina la ambigüedad sobre las gráficas del panel (finding F9) y las Historias de Usuario 8 a 12 definen acceso, permisos, semilla, navegación y estados de pago.

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

- **Decisión**: Vitest + jsdom con una semilla determinista reiniciable por archivo de prueba; pruebas unitarias para dinero/fechas/validaciones/agregaciones, acceso, permisos y estados de pago; pruebas de integración para los flujos de las doce historias de usuario, incluidos estados vacíos, filtro de periodo del panel y filtro de pagos.
- **Razonamiento**: Cubre el Principio IV y permite verificar que las gráficas y los reportes usan los mismos cálculos sin depender del navegador real.
- **Alternativas consideradas**: Cypress/Playwright — rechazado por requerir navegador y aumentar la huella de dependencias. Solo pruebas manuales — rechazado porque no da regresión sobre lógica monetaria.

### Rendimiento y escala

- **Decisión**: Los listados admiten búsqueda y filtros; los reportes y agregaciones se calculan sobre el estado en memoria y se reutilizan entre panel y reportes. La paginación y el cálculo incremental quedan trazados como T070.
- **Razonamiento**: Con 500 registros, recalcular todo el reporte en cada interacción es innecesario; separar agregación de renderizado mantiene la UI responsiva sin cambiar el modelo de datos.
- **Alternativas consideradas**: Web Worker — rechazado por complejidad prematura. Precarga de datos en memoria global — rechazado porque ya existe un estado único por sesión.

### Autenticación simulada (HU8)

- **Decisión**: Modelar `Usuario` con `rut`, `rutNormalizado`, `contraseña` y `rol_id`, y mantener una única `Sesion` en `sessionStorage` a través de la capa centralizada. El RUT se normaliza para aceptar formato puntuado o sin puntos/guion.
- **Razonamiento**: La constitución prohíbe backend y servicios de identidad; cuatro credenciales fijas y deterministas cubren la demostración y hacen repetibles las pruebas. El mensaje de error genérico evita revelar si un RUT existe.
- **Alternativas consideradas**: `localStorage` para recordar la sesión — rechazado porque la spec no lo exige y la constitución lo restringe. Hash/criptografía real — rechazado porque no aporta seguridad sin un servidor y añadiría dependencias. Diferenciar el error por RUT/contraseña — rechazado por FR-048.

### Panel por rol y permisos (HU8 y HU9)

- **Decisión**: `Rol` contiene `panelInicio`, `permisos` embebidos y `accionesPanel`; `Sesion` copia esos valores al autenticarse. El menú y el panel se derivan de esa copia.
- **Razonamiento**: congela los permisos durante la sesión, cumple la suposición de que un cambio de rol exige nueva autenticación y evita consultas repetidas al catálogo de roles. Las opciones no permitidas se ocultan, no se deshabilitan (FR-054).
- **Alternativas consideradas**: calcular permisos desde `Usuario.rol_id` en cada render — rechazado por permitir cambios imprevistos en sesión abierta. Mostrar opciones deshabilitadas — rechazado por contradecir FR-054.

### Carga y restablecimiento de datos (HU10)

- **Decisión**: La semilla es una fábrica pura que reemplaza colecciones financieras completas con valores derivados de índices fijos; el restablecimiento vacía esas colecciones pero conserva `Usuario` y `Rol`.
- **Razonamiento**: Garantiza FR-069 a FR-076: no duplicados, resultados idénticos en cargas repetidas y estado inicial válido sin referencias rotas. Solo el Administrador financiero ejecuta ambas acciones desde su panel.
- **Alternativas consideradas**: acumular la semilla sobre datos existentes — rechazado por duplicar periodos y folios. Borrar también usuarios — rechazado por FR-075. Pedir confirmación solo al restablecer — rechazado por FR-077.

### Navegación única y exclusiones (HU11)

- **Decisión**: Un mapa estático define la relación pantalla → único control visible. Entidades, Documentos y Búsqueda quedan fuera del menú y del panel; la selección de entidades/documentos permanece dentro de los formularios que la necesitan.
- **Razonamiento**: evita rutas duplicadas y reduce ambigüedad (SC-024 a SC-027). Cargar datos, restablecer datos y cerrar sesión se clasifican como acciones, no como accesos a pantallas (FR-084).
- **Alternativas consideradas**: mantener accesos directos en el panel — rechazado por duplicar destinos del menú. Crear una pantalla de búsqueda global — rechazado por FR-086.

### Estados y resumen de pagos (HU12)

- **Decisión**: Persistir `Pago.status` como `pendiente` o `pagado` y derivar `vencido` en lectura comparando `fechaVencimiento` con la fecha actual. `ResumenPagos` y el filtro usan la misma función `calcularEstadoPago`.
- **Razonamiento**: evita que un pago quede marcado como vencido en almacenamiento aunque el tiempo avance; cumple FR-092 a FR-101 con una única clasificación. Los totales se suman en centavos y se formatean en MXN con la utilidad compartida.
- **Alternativas consideradas**: almacenar `vencido` como valor persistido — rechazado por desincronización con la fecha real. Crear una sección de menú para el resumen — rechazado por FR-097. Ocultar los otros totales al filtrar — rechazado por FR-091.
