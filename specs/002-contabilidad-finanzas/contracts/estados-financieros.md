# Contrato de Estados Financieros por Periodo

## Propósito

Definir la interfaz entre asientos aprobados, periodos contables y la vista "Reportes financieros" para las Historias de Usuario 13 (FR-105 a FR-126).

## Forma de los Datos

```js
LibroMayor = {
  periodo,
  cuentas: [{ cuentaId, codigo, nombre, saldoInicial, debitos, creditos, saldoFinal }],
  totales: { debitos, creditos },
  valido: boolean,
  errores: string[]
}

BalanceComprobacion = {
  periodo,
  saldos: [{ cuentaId, codigo, nombre, saldoDeudor, saldoAcreedor }],
  totalDeudor,
  totalAcreedor,
  valido: boolean
}

EstadoResultados = { periodo, ingresos, gastos, resultado, detalle: [] }
BalanceGeneral = { periodo, activos, pasivos, patrimonio, resultadoAcumulado, valido: boolean }
```

Todos los importes son enteros en centavos; solo la capa de presentación los convierte a CLP.

## API

- `asientosAprobadosDelPeriodo(periodoId, asientos)`: devuelve solo asientos `aprobado` cuya fecha cae en el periodo.
- `calcularSaldosCuentas(cuentas, asientos, fechaLimite, cuentasBase)`: derive saldos por cuenta hasta una fecha inclusive.
- `libroMayor(periodo, cuentas, asientos)`: genera saldo inicial, débitos, créditos y saldo final por cuenta.
- `balanceComprobacion(periodo, cuentas, asientos)`: excluye saldo cero y verifica igualdad deudora/acreedora.
- `estadoResultados(periodo, cuentas, asientos)`: calcula ingresos, gastos y resultado del periodo.
- `balanceGeneral(periodo, cuentas, asientos)`: calcula activos, pasivos, patrimonio y resultado acumulado.

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Pestañas de reporte | `[data-reportes-tabs]` | Libro Mayor, Balance de Comprobación, Estado de Resultados, Balance General |
| Tabla de reporte | `[data-tabla-reporte]` | Filas calculadas con importes en CLP |
| Encabezados monetarios | `.tabla-financiera th.num` | Columnas monetarias etiquetadas con la unidad `(CLP)` |
| Totales | `[data-totales-reporte]`, `[data-tabla-reporte] tfoot [data-detalle-total]` | Total deudor/acreedor, resultado o totales de balance según reporte; cada total abre su desglose |
| Desglose de total | `[data-detalle-totales]`, `[data-detalle-filas]`, `[data-cerrar-detalle]` | Origen, referencia e importe CLP de los registros que componen el total |
| Advertencia | `[data-advertencia-reporte]` | Descuadre, cuenta sin tipo válido o inconsistencia |
| Estado vacío | `[data-estado-vacio-reporte]` | Mensaje en español cuando no hay movimientos ni saldos |

## Comportamiento

- Cambiar el periodo recalcula los cuatro reportes sin recargar ni mutar entidades.
- Los encabezados monetarios indican `(CLP)` y la columna `Tipo` admite orden alfabético con `aria-sort`.
- Activar un total abre un desglose con origen, referencia e importe; la suma del desglose coincide con el total sin alterar importes ni reglas contables.
- Cerrar el desglose oculta el panel sin modificar periodo, filtros ni datos.
- Los asientos `borrador` y `cancelado` se excluyen; los periodos cerrados se consultan sin modificarlos.
- Una cuenta sin tipo válido identifica la cuenta en la advertencia.
- No existen controles para capturar cifras manualmente ni modificar movimientos desde el reporte.
- Solo roles con permiso `reportes` pueden consultar; un intento directo muestra "Acceso no disponible".

## Restricciones

- Sin nueva opción de menú ni pantalla duplicada.
- Sin redondeos adicionales ni aritmética de punto flotante.
- Sin persistencia de snapshots de saldos.
