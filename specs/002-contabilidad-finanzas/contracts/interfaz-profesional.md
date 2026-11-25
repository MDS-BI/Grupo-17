# Contrato de Interfaz Profesional del Módulo

## Propósito

Definir paleta, íconos, tablas ordenables, confirmaciones y menú adaptable para la Historia de Usuario 21 (FR-284 a FR-313, SC-122 a SC-135).

## Forma de los Datos

```js
InterfazConfig = {
  paleta: { primario, exito, error, advertencia, informacion, texto, fondo },
  iconos: { [seccion]: "caracter-o-svg" },
  ordenTabla: { columna, sentido: "asc" | "desc" },
  mensaje: { tipo: "exito" | "error" | "advertencia" | "informacion", texto }
}
```

## API

Todas las funciones viven en `src/contabilidad/interfaz-config.js`.

- `ordenarRegistros(registros, columna, sentido, tipo)`: devuelve una copia ordenada por fecha ISO, centavos o estado; no muta la entrada.
- `confirmarEliminacion(mensaje)`: muestra `window.confirm`; `false` cancela sin cambios.
- `mostrarMensaje(tipo, texto)`: escribe en `[data-mensaje="global"]`, aplica `dataset.tipo` y oculta el contenedor con texto vacío.
- `obtenerOpcionesMenu(sesion, ancho)`: deriva las mismas opciones para menú amplio y drawer móvil desde los permisos efectivos.
- `IDENTIDAD_EMPRESA` y `NOMBRE_EMPRESA`: identidad corporativa fija, sin override persistente ni formulario de configuración.
- `PALETA_ESTADOS` y `paleta`: fuente única para insignias de estado y tokens semánticos `--exito`, `--advertencia`, `--informacion`, `--error`.

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Mensajes | `[data-mensaje]`, `[data-mensaje="global"]` | Confirmaciones de éxito, error, advertencia e información |
| Encabezado de sección | `[data-icono-seccion]` | SVG Lucide consistente con el menú |
| Columnas ordenables | `[data-ordenar]` | Encabezado clicable con `aria-sort` e indicador visual |
| Confirmación de eliminación | `[data-confirmar-eliminacion]` | Cancelar y confirmar antes de eliminar, inactivar o anular |
| Menú móvil | `[data-menu-movil]` | Mismas secciones permitidas por rol |

## Comportamiento

- La paleta y el significado de colores son idénticos en todas las pantallas.
- La identidad corporativa es fija: no existe formulario, override ni opción de menú para cambiarla.
- El texto de la sección siempre acompaña al ícono; si falla el ícono, el texto sigue siendo comprensible.
- Ordenar fechas respeta cronología ISO, montos respeta centavos y estados respeta el orden definido.
- Ordenar no muta registros ni permisos.
- Guardar válido muestra éxito; guardar inválido nunca muestra éxito.
- Eliminar permitido requiere confirmación previa y muestra confirmación posterior; cancelar no elimina.
- El menú móvil conserva las secciones del menú amplio y se cierra al navegar.

## Restricciones

- Sin librerías de UI o íconos.
- Sin nuevas opciones de menú.
- Sin cambios en reglas de negocio, permisos ni datos financieros.
