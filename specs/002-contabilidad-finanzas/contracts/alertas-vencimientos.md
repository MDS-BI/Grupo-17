# Contrato de Alertas de Vencimientos de Pagos

## Propósito

Definir las alertas informativas del panel del Tesorero para la Historia de Usuario 17 (FR-190 a FR-213, SC-076 a SC-087).

## Forma de los Datos

```js
AlertaPago = {
  categoria: "vencido" | "venceEstaSemana",
  cantidad,
  totalCentavos,
  detalles: [{ pagoId, entidad, montoCentavos, fechaVencimiento }],
  adicionales
}

SemanaReferencia = { inicioLunes, finDomingo }
```

## API

- `semanaReferencia(fechaReferencia)`: devuelve el intervalo lunes-domingo que contiene la fecha.
- `alertasDeVencimientos(pagos, entidades, fechaReferencia = fechaHoyISO())`: devuelve `vencidos` y `venceEstaSemana`.
- `formatearAlerta(alerta)`: convierte totales y fechas con los formateadores compartidos.

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Alertas del Tesorero | `[data-alertas-tesorero]` | Contenedor de ambas alertas |
| Alerta vencidos | `[data-alerta-vencidos]` | Cantidad, total y detalles |
| Alerta semanal | `[data-alerta-semanal]` | Cantidad, total y detalles |
| Sin alertas | `[data-sin-alertas]` | Mensaje o alerta oculta sin cifras engañosas |

## Comportamiento

- Solo pagos `pendiente` y no anulados.
- `vencido`: fecha de vencimiento anterior a la fecha de referencia.
- `venceEstaSemana`: entre la fecha de referencia y el domingo de la semana actual, inclusive.
- Las categorías son mutuamente excluyentes.
- Hasta tres detalles y contador `+N más` cuando existan más pagos.
- Se recalculan al iniciar sesión, al volver al panel y al actualizar pagos.
- Sin enlaces ni `data-action` que abran "Pagos y cobros".

## Restricciones

- Solo para Tesorero.
- Sin nueva opción de menú ni acceso duplicado.
- Sin importes en punto flotante ni fechas parseadas de forma distinta al resto del módulo.
