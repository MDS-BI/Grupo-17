# Contrato de Acceso, Roles y Sesión

## Propósito

Definir la interfaz entre la pantalla de acceso, la capa centralizada de almacenamiento y las vistas que consumen permisos. La autenticación es una simulación local sin backend (HU8 y HU9).

## Forma de los Datos

```js
// Usuario
{
  rut: "11.111.111-1",
  rutNormalizado: "111111111",
  nombre: "Administrador financiero",
  contraseña: "Admin2026!",
  rol_id: "administrador"
}

// Rol
{
  id: "administrador",
  nombre: "Administrador financiero",
  panelInicio: "integral",
  permisos: [PermisoRol],
  accionesPanel: ["cargarDatos", "restablecerDatos", "cerrarSesion"]
}

// PermisoRol (embebido en Rol.permisos)
{
  seccion: "cuentas",
  acceso: "gestionar",
  acciones: ["crear", "editar", "eliminar"],
  visibleEnMenu: true
}

// Sesion
{
  id: "ses-1",
  usuarioRut: "11.111.111-1",
  rolId: "administrador",
  permisos: [PermisoRol],
  panelInicio: "integral",
  estado: "autenticada",
  iniciadaEn: "2026-11-23T10:00:00.000Z"
}
```

## Operaciones

- `normalizarRUT(rut)`: elimina puntos y guion, normaliza `k`/`K` a `k` y devuelve la forma de comparación.
- `validarFormatoRUT(rut)`: comprueba 7 u 8 dígitos y dígito verificador numérico o `k`; no valida autenticidad.
- `iniciarSesion(rut, contraseña)`: compara `normalizarRUT(rut)` y contraseña contra los usuarios de la semilla; crea `Sesion` o devuelve error genérico.
- `cerrarSesion()`: elimina la sesión activa y bloquea el acceso a cualquier panel.
- `obtenerSesionActiva()`: devuelve la sesión vigente o `null`.
- `obtenerPermisos(seccion)`: devuelve el `PermisoRol` de la sección para la sesión activa.
- `puedeAcceder(seccion)`: devuelve `true` solo si `visibleEnMenu` es `true` y `acceso !== "noDisponible"`.
- `puedeEjecutar(accion)`: comprueba `accionesPanel` o las acciones del permiso de sección.
- `obtenerPanelInicio()`: devuelve la clave `panelInicio` de la sesión activa.

## Reglas de Acceso

| Rol | Panel | Secciones permitidas | Acciones globales |
|---|---|---|---|
| Administrador financiero | `integral` | Panel, Cuentas, Asientos, Pagos, Periodos, Reportes | Cargar datos, Restablecer datos, Cerrar sesión |
| Contador | `contable` | Panel, Cuentas, Asientos, Reportes | Cerrar sesión |
| Tesorero | `tesoreria` | Panel, Pagos | Cerrar sesión |
| Auditor | `auditoria` | Panel, Reportes (solo consulta) | Cerrar sesión |

- Entidades, Documentos y Búsqueda siempre son `noDisponible` y no generan `OpcionMenu`.
- El error para RUT inexistente y contraseña incorrecta es exactamente "RUT o contraseña incorrectos".
- Si falta RUT o contraseña, se devuelve un mensaje específico por campo y no se crea sesión.
- Los permisos se copian a la sesión al autenticarse; un cambio de rol requiere cerrar sesión.
- Después de cerrar sesión, cualquier intento de navegación interna debe redirigir a la pantalla de acceso.

## Puntos de Montaje y Eventos

- Pantalla de acceso: `[data-acceso="formulario"]`, campos `[data-acceso="rut"]` y `[data-acceso="contraseña"]`, acción `[data-acceso="ingresar"]`.
- Cierre de sesión: `[data-accion="cerrar-sesion"]`, presente en los cuatro paneles.
- Eventos: `acceso:sesion-iniciada` con `detail = { usuarioRut, rolId, panelInicio }` y `acceso:sesion-cerrada` sin `detail`.
- Los componentes de menú y panel escuchan estos eventos para renderizarse de nuevo.

## Restricciones

- Sin `fetch`, XHR, WebSockets ni servicios de identidad.
- Sin `localStorage`; la sesión se guarda solo en `sessionStorage` mediante la capa centralizada.
- Las contraseñas son ficticias, no se registran en consolas ni se muestran después de la autenticación.
- Ningún componente consulta catálogos de roles directamente; toda lectura pasa por estas operaciones.
