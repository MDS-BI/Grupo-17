# Contrato de Resumen de Pagos por Estado

## Propósito

Definir la interfaz entre `Pago`, la pantalla "Pagos y cobros" y el resumen por estado introducido por la Historia de Usuario 12 (FR-088 a FR-101).

## Forma de los Datos

```js
// EstadoPago (derivado, no persistido)
"pendiente" | "pagado" | "vencido"

// ResumenPagos
{
  pendiente: { cantidad: 2, totalCentavos: 150000 },
  pagado: { cantidad: 1, totalCentavos: 89000 },
  vencido: { cantidad: 1, totalCentavos: 42000 }
}

// FiltroEstadoPago
"todos" | "pendiente" | "pagado" | "vencido"
```

`Pago.status` se persiste como `pendiente` o `pagado`. El estado `vencido` se calcula cuando un pago pendiente tiene `fechaVencimiento` anterior a la fecha actual.

## API

- `calcularEstadoPago(pago, fechaActual = new Date())`: devuelve `pagado`, `vencido` o `pendiente`.
- `resumirPagos(pagos, fechaActual)`: agrupa por `EstadoPago` y devuelve `cantidad` y `totalCentavos` para los tres estados, aunque alguno esté vacío.
- `filtrarPagos(pagos, filtro, fechaActual)`: devuelve los pagos del estado seleccionado; `todos` no filtra.
- `marcarPagado(pagoId)`: cambia `status` a `pagado` y devuelve el pago actualizado.
- `formatearResumen(resumen)`: usa `formatearMXN` para los totales sin alterar los centavos.

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Resumen | `[data-resumen-pagos]` | Tres tarjetas con cantidad y total en MXN |
| Filtro | `[data-filtro-estado]` | Opciones `Todos`, `Pendiente`, `Pagado`, `Vencido` |
| Listado | `[data-lista-pagos]` | Pagos resultantes del filtro |
| Estado vacío del resumen | `[data-estado-vacio-resumen]` | Mensaje cuando no hay pagos registrados |
| Estado vacío del filtro | `[data-estado-vacio-filtro]` | Mensaje cuando el filtro no produce resultados |

Cada tarjeta incluye `data-estado` y `data-total-centavos`. Cada fila incluye `data-pago-id` y `data-estado-pago`.

## Comportamiento

- La selección inicial del filtro es `todos`.
- Al aplicar un filtro, el listado se actualiza de inmediato y el estado elegido queda destacado.
- Los tres totales del resumen permanecen visibles al filtrar.
- Las cantidades y totales del resumen deben coincidir exactamente con el listado filtrado.
- Un pago que pasa a `pagado` se mueve del estado anterior al de pagado de forma inmediata.
- Si no hay pagos, el resumen muestra ceros y un mensaje de estado vacío.
- Si un filtro no tiene resultados, se muestra un mensaje específico sin ocultar el resumen.
- El resumen y el filtro solo existen dentro de "Pagos y cobros" para Administrador financiero y Tesorero.

## Eventos

- `pagos:estado-cambiado` con `detail = { pagoId, estadoAnterior, estadoNuevo }`.
- `pagos:filtro-cambiado` con `detail = { filtro }`.
- Al recibir cualquiera de los dos eventos, la pantalla recalcula resumen y listado desde el estado de la sesión, sin recargar.

## Restricciones

- Sin nueva opción de menú ni botón duplicado que abra la misma pantalla.
- Sin importes crudos con aritmética de punto flotante en la vista.
- Sin persistir `vencido` ni cachés del resumen.
- Sin acceso para roles sin permiso en `pagos`.
