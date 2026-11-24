# Contrato de Exportación de Reportes a PDF y Excel

## Propósito

Definir la descarga de reportes financieros para la Historia de Usuario 19 (FR-230 a FR-253, SC-098 a SC-109).

## Forma de los Datos

```js
ModeloExportacion = {
  empresa: "Comercial Los Andes SpA",
  reporte: "libroMayor" | "balanceComprobacion" | "estadoResultados" | "balanceGeneral",
  periodo,
  fechaGeneracion,
  filas: [],
  totales: {},
  vacio: boolean,
  valido: boolean,
  advertencias: []
}
```

## API

- `construirModeloExportacion(reporte, periodo, datos)`: crea el único modelo usado por pantalla y archivos.
- `exportarPDF(modelo)`: descarga un PDF mínimo vanilla con encabezado, filas y totales.
- `exportarExcel(modelo)`: descarga un archivo SpreadsheetML `.xls` con el mismo contenido.
- `nombreArchivo(modelo)`: `Comercial-Los-Andes-SpA_<reporte>_<periodo>.{pdf,xls}`.

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Exportar PDF | `[data-exportar-pdf]` | Botón dentro del reporte visible |
| Exportar Excel | `[data-exportar-excel]` | Botón dentro del reporte visible |
| Advertencia de exportación | `[data-advertencia-exportacion]` | Mensaje cuando el reporte no es válido |

## Comportamiento

- Los botones aparecen solo para roles con acceso a "Reportes financieros".
- Los archivos incluyen nombre exacto de la empresa, periodo, fecha de generación y totales aplicables.
- Las cifras exportadas coinciden exactamente con las mostradas en pantalla.
- Un reporte vacío válido se exporta con totales en cero y texto "Sin movimientos".
- Un reporte con descuadre bloquea la exportación y muestra la advertencia.
- La descarga usa `Blob` y `URL.createObjectURL`, con liberación posterior de la URL.
- Exportar no modifica datos, filtros, periodos ni auditoría.

## Restricciones

- Sin librerías de runtime, backend ni nuevas opciones de menú.
- Sin regenerar el modelo desde el DOM ni releer `sessionStorage` en el handler.
