# Contrato de Cierre de Periodo Contable

## Propósito

Definir el cierre de periodos y el bloqueo transversal de escrituras para las Historias de Usuario 14 y 15 (FR-127 a FR-163, SC-044 a SC-063).

## Forma de los Datos

```js
PeriodoContable = {
  id, name, startDate, endDate,
  status: "abierto" | "cerrado",
  createdAt, updatedAt
}

MensajePeriodoCerrado = "El periodo está cerrado y no permite registrar ni modificar movimientos."
```

## API

- `cerrarPeriodo(periodoId, sesion)`: valida sesión Administrador financiero, existencia del periodo, estado abierto y confirmación aplicada; escribe `status = "cerrado"` y `updatedAt`.
- `periodoPorFecha(fecha, periodos)`: devuelve el periodo que contiene la fecha.
- `periodoAbiertoPorFecha(fecha, periodos)`: devuelve `true` solo si existe periodo y está abierto.
- `validarEscrituraPeriodo(fechaOriginal, fechaNueva, periodos)`: bloquea si alguna fecha cae en un periodo cerrado.

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Acción de cierre | `[data-cerrar-periodo]` | Visible solo para Administrador financiero en periodos abiertos |
| Confirmación | `[data-confirmar-cierre]` | Mensaje claro; cancelar no modifica datos |
| Estado del periodo | `[data-estado-periodo]` | `abierto` o `cerrado` |
| Mensaje de bloqueo | `[data-periodo-cerrado]` | Texto en español al intentar escribir |

## Comportamiento

- El cierre aplica a todos los roles, incluido el Administrador financiero.
- Bloquea altas, ediciones, eliminaciones, anulaciones, cambios de estado y cambios de fecha de asientos y pagos.
- La validación se ejecuta en la capa de escritura, no solo deshabilitando controles.
- Un formulario abierto antes del cierre vuelve a validar al guardar.
- Los listados y reportes históricos permanecen disponibles sin acciones de modificación.
- No existe reapertura en este alcance; cerrar dos veces o sin periodo seleccionado muestra mensaje claro.

## Restricciones

- El cierre no altera registros financieros ni totales.
- La semilla no crea movimientos en periodos cerrados.
- Sin nueva opción de menú derivada del cierre.
