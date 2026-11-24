# Contrato de Identidad Corporativa en el Encabezado

## Propósito

Definir la identidad visual de la empresa ficticia en el encabezado del módulo para la Historia de Usuario 18 (FR-214 a FR-229, SC-088 a SC-097).

## Forma de los Datos

```js
NOMBRE_EMPRESA = "Comercial Los Andes SpA"
IdentidadCorporativa = {
  nombre: NOMBRE_EMPRESA,
  logotipo: "svg-en-linea",
  ariaLabel: "Logo de Comercial Los Andes SpA"
}
```

## Puntos de Montaje

| Elemento | Selector | Contenido |
|---|---|---|
| Encabezado | `[data-encabezado-modulo]` | Nombre y logotipo de la empresa |
| Nombre | `[data-nombre-empresa]` | Texto exacto "Comercial Los Andes SpA" |
| Logotipo | `[data-logo-empresa]` | SVG ficticio en línea con etiqueta accesible |

## Comportamiento

- Se muestra en todas las pantallas posteriores a una autenticación válida.
- Todos los roles ven la misma identidad corporativa.
- Navegar, cargar datos o restablecer datos no cambia el encabezado.
- El nombre de la empresa no sustituye ni duplica el título de la sección.
- La identidad corporativa no aparece como opción de menú ni acción.
- Si el logotipo no está disponible, se mantiene el nombre y una referencia visual clara.

## Restricciones

- Sin imágenes remotas ni peticiones de red.
- Sin configuración editable desde la interfaz.
- Sin nuevas dependencias.
