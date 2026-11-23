# Contrato de Navegación Única y Panel por Rol

## Propósito

Definir la interfaz entre permisos de sesión, menú y paneles de inicio. Implementa las Historias de Usuario 9 y 11: menú filtrado por rol, sin Entidades/Documentos/Búsqueda y con un único control visible por pantalla.

## Mapa de Pantallas

| Pantalla | Único control que la abre | Roles con acceso |
|---|---|---|
| Panel de inicio del rol | Inicio de sesión correcto | Administrador financiero, Contador, Tesorero, Auditor |
| Cuentas contables | "Cuentas contables" en el menú | Administrador financiero, Contador |
| Asientos contables | "Asientos contables" en el menú | Administrador financiero, Contador |
| Pagos y cobros | "Pagos y cobros" en el menú | Administrador financiero, Tesorero |
| Periodos contables | "Periodos contables" en el menú | Administrador financiero |
| Reportes financieros | "Reportes financieros" en el menú | Administrador financiero, Contador, Auditor |
| Entidades | Sin control de navegación | Ninguno |
| Documentos | Sin control de navegación | Ninguno |
| Búsqueda | Sin control de navegación | Ninguno |

Las entradas "Entidades", "Documentos" y "Búsqueda" están prohibidas incluso si una configuración heredada las declare visibles.

## API de Componentes

- `obtenerMapaNavegacion()`: devuelve el mapa inmutable pantalla → control → roles.
- `renderizarMenu(permisos, sesion)`: genera solo las `OpcionMenu` con `visibleEnMenu = true` y rol autorizado.
- `renderizarPanelInicio(sesion, datos)`: monta el panel correspondiente a `sesion.panelInicio`.
- `navegar(pantalla)`: cambia de vista solo si el rol tiene permiso; en caso contrario emite bloqueo.
- `esAccion(control)`: distingue acciones de navegación; `cargarDatos`, `restablecerDatos` y `cerrarSesion` siempre devuelven `true`.
- `validarUnicidadControles(controles)`: detecta dos controles visibles con el mismo `data-destino`.

## Paneles por Rol

| Rol | Contenido principal | Acciones visibles |
|---|---|---|
| Administrador financiero | Resumen integral, estado de periodos y asuntos prioritarios | Cargar datos, Restablecer datos, Cerrar sesión |
| Contador | Cuentas, asientos pendientes y reportes disponibles | Cerrar sesión |
| Tesorero | Pagos/cobros recientes y flujo de efectivo | Cerrar sesión |
| Auditor | Trazabilidad de movimientos, reportes e historial | Cerrar sesión |

Los paneles no contienen enlaces duplicados a secciones del menú. La localización de registros se hace con filtros propios de cada sección.

## Atributos de Datos y Eventos

- Menú: `[data-menu="opcion"]` con `data-destino`, `data-rol` y `aria-current` en la opción activa.
- Panel: `[data-panel="inicio"]` con `data-panel-rol` y `[data-accion]` para acciones.
- Bloqueo: `[data-mensaje="acceso"]` con texto "Acceso no disponible" o "Sección no disponible".
- Evento de navegación: `navegacion:seccion-cambiada` con `detail = { pantalla, control }`.

## Expectativas de Validación

- Cada pantalla permitida tiene exactamente un control visible que la abre.
- No existen dos controles visibles, con igual o distinta etiqueta, que apunten al mismo `data-destino`.
- Las opciones no permitidas se ocultan, no se deshabilitan.
- Un intento directo de abrir una sección ajena no presenta información de esa sección.
- La selección contextual de entidades y documentos ocurre dentro de los formularios permitidos, sin crear una sección navegable.
- Los cambios de sesión vuelven a evaluar menú y panel de inmediato.

## Restricciones

- Sin rutas nuevas, sin frameworks de enrutamiento y sin llamadas de red.
- El mapa de navegación es configuración estática, no una colección persistida.
- Las acciones de datos y cierre de sesión no cuentan como destinos de navegación.
