# Contrato de Registro de Actividad

## Propósito

Definir la persistencia y consulta de eventos de auditoría de asientos y pagos para la Historia de Usuario 16 (FR-164 a FR-189, SC-064 a SC-075).

## Forma de los Datos

```js
RegistroActividad = {
  id,
  fechaHora,
  accion: "crear" | "editar" | "anular",
  tipoMovimiento: "asiento" | "pago",
  movimientoId,
  numero,
  usuarioRut,
  usuarioNombre,
  rolId,
  rolNombre,
  camposModificados: [{ campo, valorAnterior, valorNuevo }]
}
```

## API

- `registrarEvento({ accion, tipoMovimiento, movimiento, sesion, camposModificados })`: escribe un evento solo tras una operación exitosa con cambios reales.
- `listarEventos(filtros)`: devuelve eventos ordenados por `fechaHora` descendente; filtros por tipo, acción y usuario.
- `historialPorMovimiento(tipoMovimiento, movimientoId)`: devuelve los eventos de un movimiento.
- `puedeConsultarAuditoria(sesion)`: `true` solo para el rol Auditor.

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Consulta de auditoría | `[data-auditoria-consolidada]` | Tabla de eventos dentro de "Reportes financieros" |
| Historial del movimiento | `[data-historial-movimiento]` | Eventos del asiento o pago en detalle |
| Filtros locales | `[data-filtro-auditoria]` | Tipo de movimiento, acción y usuario |
| Estado vacío | `[data-estado-vacio-auditoria]` | Mensaje en español sin eventos inventados |

## Comportamiento

- Un evento de `editar` requiere al menos un campo modificado con valores distintos.
- No se genera evento en operaciones rechazadas, no-op, doble anulación ni exportaciones.
- Los eventos son inmutables: no existen acciones de alta manual, edición ni eliminación.
- Solo el Auditor puede consultar; otros roles reciben "Acceso no disponible".
- La semilla produce eventos deterministas y el restablecimiento reinicia la colección sin huérfanos.
- Un movimiento con eventos no se elimina físicamente; se anula lógicamente.

## Restricciones

- Sin nueva opción de menú.
- Sin credenciales ni contraseñas en los eventos.
- Sin persistencia de eventos dentro de asientos o pagos.
