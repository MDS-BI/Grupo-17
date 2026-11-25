# Contrato de Interfaz del Panel con Gráficas

## Propósito

Definir la interfaz entre `src/components/dashboard.js`, el estado de la sesión y las gráficas SVG introducidas por la Historia de Usuario 7 (FR-035 a FR-039). El panel se monta dentro del `PanelInicio` correspondiente al rol (HU8), por lo que también respeta las acciones visibles del HU10 y la unicidad de controles del HU11.

## Puntos de Montaje

El panel debe renderizar, cuando exista información, los siguientes contenedores:

| Grafica | Selector | Contenido |
|---|---|---|
| Ingresos y gastos por periodo | `[data-grafica="ingresos-gastos"]` | Barras agrupadas por periodo |
| Evolución del resultado | `[data-grafica="resultado"]` | Línea con un punto por periodo |
| Distribución de gastos por cuenta | `[data-grafica="gastos-cuenta"]` | Dona del periodo seleccionado |
| Panel por rol | `[data-panel="inicio"]` | Indicadores contextuales según `sesion.panelInicio` |
| Acciones del Administrador | `[data-acciones-panel]` | `Cargar datos de ejemplo`, `Restablecer datos` y `Cerrar sesión` |

Cuando no haya datos, cada contenedor muestra un mensaje en español con `role="status"` en lugar de un SVG vacío. Los botones de acciones son `data-accion`, nunca `data-destino`.

## API del Componente

- `renderDashboard(contexto)`: recibe `{ periodos, cuentas, asientos, pagos, periodoSeleccionado, sesion, permisos }` y actualiza indicadores, gráficas, panel por rol y acciones permitidas.
- `crearGraficaBarras(serie)`: devuelve un elemento SVG para `SerieIngresosGastos`.
- `crearGraficaLinea(serie)`: devuelve un elemento SVG para `SerieResultado`.
- `crearGraficaDona(serie)`: devuelve un elemento SVG para `DistribucionGastos`.
- `mostrarEstadoVacio(mensaje)`: devuelve el nodo de texto accesible para estados vacíos.

Las funciones de gráfica son puras respecto a los datos de entrada: no mutan el estado ni escriben en `sessionStorage`.

## Forma de las Series

```js
// SerieIngresosGastos y SerieResultado
[{ periodoId, etiqueta, ingresosCentavos, gastosCentavos, resultadoCentavos }]

// DistribucionGastos
[{ cuentaId, codigo, nombre, gastoCentavos, porcentaje }]
```

Los importes llegan en centavos; la conversión a CLP con dos decimales ocurre al construir etiquetas y tooltips mediante `formatearCLP`.

## Atributos de Datos y Accesibilidad

- Cada barra/punto/segmento incluye `data-periodo` o `data-cuenta-id` y `data-valor-centavos`.
- Cada SVG incluye `role="img"` y `aria-label` en español; el label de la dona indica el periodo seleccionado.
- Los colores se toman de los tokens definidos en `styles.css`; no se usan colores que dependan de librerías externas.

## Eventos

- El selector de periodo emite `contabilidad:periodo-cambiado` con `detail = { periodoId }`.
- Al recibir el evento, `renderDashboard` recalcula las tres series y vuelve a montar los contenedores; no se recarga la página.

## Panel por Rol y Acciones

| Rol | `sesion.panelInicio` | Énfasis del panel |
|---|---|---|
| Administrador financiero | `integral` | Resumen integral, estado de periodos, asuntos prioritarios y acciones de semilla |
| Contador | `contable` | Cuentas, asientos pendientes y reportes disponibles |
| Tesorero | `tesoreria` | Pagos/cobros recientes y flujo de efectivo |
| Auditor | `auditoria` | Trazabilidad, reportes e historial en solo lectura |

- El panel no incluye accesos a Entidades, Documentos ni Búsqueda.
- Los controles de cargar datos, restablecer datos y cerrar sesión no cuentan como navegación duplicada.
- Al cerrar sesión, `renderDashboard` deja de montar el panel y la aplicación vuelve al formulario de acceso.

## Restricciones

- Sin llamadas de red, sin frameworks y sin librerías de gráficas.
- Sin importes crudos con aritmética de punto flotante en la vista.
- Los mensajes de estado vacío incluyen los casos: sin periodos, sin movimientos aprobados y sin gastos en el periodo.
- Las gráficas se ocultan detrás de estados vacíos; nunca muestran una serie vacía como si fuera un resultado válido.
