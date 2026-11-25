# Contrato de Filtros de Asientos y Pagos

## Propósito

Definir los filtros locales de listados para la Historia de Usuario 20 (FR-254 a FR-283, SC-110 a SC-121).

## Forma de los Datos

```js
FiltroMovimientos = {
  fechaDesde: "YYYY-MM-DD" | null,
  fechaHasta: "YYYY-MM-DD" | null,
  cuentaId: string | null,
  montoDesde: number | null,
  montoHasta: number | null,
  estado: "todos" | string
}

ListadoFiltrado = { registros: [], totalCentavos, sinResultados: boolean }
```

Los montos se capturan en CLP pero se comparan como enteros en centavos.

## API

- `filtrarAsientosDetallado(asientos, filtro)`: API canónica; aplica fecha contable, líneas por cuenta, total del asiento y estado y devuelve `ListadoFiltrado`.
- `filtrarPagosDetallado(pagos, filtro)`: API canónica; aplica fecha del movimiento, cuenta del asiento relacionado, monto y estado visible y devuelve `ListadoFiltrado`.
- `filtrarAsientos(asientos, filtro)` y `filtrarPagos(pagos, filtro)`: envoltorios de compatibilidad que devuelven solo `registros`.
- `validarFiltro(filtro)`: verifica fechas ISO reales, montos no negativos y rango `desde <= hasta`.
- `limpiarFiltros()`: restaura el estado sin filtros.

Cuando `validarFiltro()` falla, las APIs canónicas no aplican el filtro inválido: devuelven el listado de entrada sin activar `sinResultados`. La interfaz conserva el último filtro válido mientras muestra el mensaje de error.

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Filtros de asientos | `[data-filtros-asientos]` | Controles del listado de asientos |
| Filtros de pagos | `[data-filtros-pagos]` | Controles del listado de pagos y cobros |
| Listado filtrado | `[data-listado-filtrado]` | Registros resultantes |
| Error de filtro | `[data-error-filtro]` | Mensaje para rangos inválidos |
| Estado vacío | `[data-estado-vacio-filtro]` | Mensaje cuando no hay coincidencias |

## Comportamiento

- Todos los criterios activos se combinan con AND; fechas y montos son inclusivos.
- `Todos` es la selección inicial de estado y significa ausencia de filtro.
- Los pagos sin asiento relacionado no coinciden al filtrar por cuenta.
- Un rango inválido muestra mensaje claro y no aplica el filtro.
- Limpiar filtros restaura todos los registros permitidos para el rol.
- Los filtros son locales, no persisten y no crean búsqueda global ni menú adicional.

## Restricciones

- No modificar registros financieros ni totales originales.
- No duplicar el control de estado de pagos; el filtro existente lo sustituye.
- No mostrar filtros de listados sin permiso.
