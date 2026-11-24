# Feature Specification: Menú lateral por roles de Contabilidad y Finanzas

**Feature Branch**: `003-menu-lateral-por-roles`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas: eliminar del menú lateral Entidades, Documentos y Búsqueda porque no pertenecen al módulo. El menú lateral solo se muestra después de iniciar sesión y solo con las secciones que el rol puede usar."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mostrar el menú lateral solo después de iniciar sesión (Priority: P1)

Como usuario del módulo de Contabilidad y Finanzas, quiero que el menú lateral aparezca únicamente cuando he iniciado sesión correctamente, para que la navegación del módulo no sea visible antes de identificarme ni después de finalizar mi acceso.

**Why this priority**: Evita que usuarios no autenticados vean la estructura interna del módulo y hace que el menú represente siempre una sesión válida.

**Independent Test**: Se abre el módulo sin autenticarse y se confirma que no hay menú lateral; se inicia sesión con un usuario de prueba y aparece; se cierra sesión y desaparece sin permitir recuperarlo al volver atrás.

**Acceptance Scenarios**:

1. **Given** que una persona abre el módulo sin iniciar sesión, **When** se muestra la pantalla de acceso, **Then** no se muestra ningún menú lateral con secciones del módulo.
2. **Given** que una persona intenta iniciar sesión con credenciales incorrectas, **When** se muestra el mensaje de error, **Then** el menú lateral permanece oculto.
3. **Given** que un usuario de prueba ingresa credenciales válidas, **When** se completa la autenticación, **Then** se muestra el menú lateral correspondiente a su rol.
4. **Given** que un usuario autenticado selecciona cerrar sesión, **When** finaliza el cierre de sesión, **Then** el menú lateral desaparece y se solicitan nuevamente las credenciales.
5. **Given** que un usuario cerró sesión, **When** intenta volver a una pantalla anterior del módulo, **Then** no se muestra el menú lateral ni el contenido sin autenticarse de nuevo.

---

### User Story 2 - Quitar del menú lateral las secciones ajenas al módulo (Priority: P1)

Como usuario autenticado del módulo, quiero que Entidades, Documentos y Búsqueda no aparezcan en el menú lateral, para navegar únicamente por funciones que pertenecen a Contabilidad y Finanzas.

**Why this priority**: Estas áreas pertenecen al ERP base o a una búsqueda global y su presencia en el módulo genera rutas confusas que no corresponden a las responsabilidades financieras.

**Independent Test**: Se inicia sesión con cada uno de los cuatro roles y se revisa el menú lateral, comprobando que ninguna de las tres secciones aparece y que los flujos del módulo se completan sin ellas.

**Acceptance Scenarios**:

1. **Given** que inicia sesión cualquiera de los cuatro roles, **When** se carga el menú lateral, **Then** no se muestran las opciones "Entidades", "Documentos" ni "Búsqueda".
2. **Given** que se revisa el menú lateral del Administrador financiero, del Contador, del Tesorero y del Auditor, **When** se comparan sus opciones, **Then** ninguno de los cuatro incluye esas tres secciones.
3. **Given** que un usuario necesita seleccionar una entidad o un documento dentro de un formulario permitido, **When** abre ese formulario, **Then** puede hacerlo allí mismo sin que exista una sección independiente en el menú lateral.
4. **Given** que un usuario necesita localizar un registro, **When** usa una sección permitida, **Then** aplica los filtros disponibles en esa sección sin una pantalla global de "Búsqueda".
5. **Given** que un usuario intenta abrir Entidades, Documentos o Búsqueda sin usar el menú lateral, **When** realiza la acción, **Then** se muestra el mensaje "Sección no disponible" y no se presenta contenido de esas áreas.

---

### User Story 3 - Mostrar solo las secciones que el rol puede usar (Priority: P1)

Como usuario autenticado, quiero que el menú lateral muestre únicamente las secciones autorizadas para mi rol, para trabajar con una navegación clara y no intentar operaciones que no me corresponden.

**Why this priority**: Cada rol financiero tiene responsabilidades distintas; mostrar solo lo permitido reduce errores y evita exponer funciones sensibles.

**Independent Test**: Se inicia sesión con los cuatro usuarios de prueba y se compara el menú lateral mostrado con la matriz de acceso definida, verificando además que las secciones ausentes no puedan abrirse directamente.

**Acceptance Scenarios**:

1. **Given** que inicia sesión el Administrador financiero, **When** se carga el menú lateral, **Then** ve Panel de inicio, Cuentas contables, Asientos contables, Pagos y cobros, Periodos contables y Reportes financieros.
2. **Given** que inicia sesión el Contador, **When** se carga el menú lateral, **Then** ve Panel de inicio, Cuentas contables, Asientos contables y Reportes financieros, y no ve Pagos y cobros ni Periodos contables.
3. **Given** que inicia sesión el Tesorero, **When** se carga el menú lateral, **Then** ve Panel de inicio y Pagos y cobros, y no ve Cuentas contables, Asientos contables, Periodos contables ni Reportes financieros.
4. **Given** que inicia sesión el Auditor, **When** se carga el menú lateral, **Then** ve únicamente Panel de inicio y Reportes financieros en modo de consulta.
5. **Given** que un usuario intenta abrir una sección que no aparece en su menú lateral, **When** realiza la acción, **Then** se muestra un mensaje de acceso no disponible y no se revela información de esa sección.
6. **Given** que un usuario autenticado cambia de rol, **When** vuelve a autenticarse, **Then** el menú lateral refleja inmediatamente las secciones del nuevo rol.
7. **Given** que el sistema no reconoce el rol de una credencial válida, **When** se intenta completar la autenticación, **Then** no se muestra ninguna sección del menú lateral y se solicita una nueva autenticación.

**Matriz de acceso del menú lateral**:

| Sección | Administrador financiero | Contador | Tesorero | Auditor |
|---------|--------------------------|----------|----------|---------|
| Panel de inicio | Visible | Visible | Visible | Visible |
| Cuentas contables | Visible | Visible | No visible | No visible |
| Asientos contables | Visible | Visible | No visible | No visible |
| Pagos y cobros | Visible | No visible | Visible | No visible |
| Periodos contables | Visible | No visible | No visible | No visible |
| Reportes financieros | Visible | Visible | No visible | Visible (solo consulta) |
| Entidades | No visible | No visible | No visible | No visible |
| Documentos | No visible | No visible | No visible | No visible |
| Búsqueda | No visible | No visible | No visible | No visible |

### Edge Cases

- ¿Qué ocurre cuando una persona intenta abrir el módulo sin haber iniciado sesión?
- ¿Qué ocurre cuando falla la autenticación y la persona vuelve atrás en la navegación?
- ¿Qué ocurre cuando se cierra sesión desde el panel de inicio y se intenta reabrir una sección anterior?
- ¿Qué ocurre cuando un usuario intenta abrir directamente una sección que no aparece en su menú lateral?
- ¿Qué ocurre cuando un usuario con un rol no reconocido completa la autenticación?
- ¿Qué ocurre cuando el rol asignado cambia mientras la sesión está abierta?
- ¿Qué ocurre cuando el Tesorero necesita seleccionar una entidad o un documento para registrar un pago sin acceder a esas secciones?
- ¿Qué ocurre cuando un usuario busca un registro y solo existen filtros dentro de una sección permitida?
- ¿Qué ocurre cuando una sección eliminada del menú lateral queda como destino de un enlace antiguo?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema NO DEBE mostrar el menú lateral antes de que una persona inicie sesión correctamente.
- **FR-002**: El sistema DEBE mostrar el menú lateral únicamente después de una autenticación válida.
- **FR-003**: El sistema DEBE ocultar el menú lateral cuando se cierre la sesión.
- **FR-004**: El sistema NO DEBE mostrar el menú lateral cuando las credenciales sean incorrectas o estén incompletas.
- **FR-005**: El sistema NO DEBE permitir recuperar el menú lateral navegando hacia atrás después de cerrar sesión sin autenticarse de nuevo.
- **FR-006**: El menú lateral NO DEBE incluir las opciones "Entidades", "Documentos" ni "Búsqueda" para ningún rol.
- **FR-007**: El sistema NO DEBE ofrecer accesos a Entidades, Documentos ni Búsqueda desde los paneles de inicio de los roles.
- **FR-008**: El sistema DEBE permitir seleccionar entidades y documentos dentro de las pantallas permitidas cuando un formulario lo requiera, sin crear entradas independientes en el menú lateral.
- **FR-009**: El sistema DEBE conservar los filtros de cada sección permitida sin ofrecer una pantalla global de búsqueda.
- **FR-010**: El sistema DEBE mostrar el mensaje "Sección no disponible" cuando se intente abrir Entidades, Documentos o Búsqueda sin usar el menú lateral.
- **FR-011**: El menú lateral DEBE mostrar únicamente las secciones que el rol autenticado puede usar.
- **FR-012**: El menú lateral del Administrador financiero DEBE incluir Panel de inicio, Cuentas contables, Asientos contables, Pagos y cobros, Periodos contables y Reportes financieros.
- **FR-013**: El menú lateral del Contador DEBE incluir Panel de inicio, Cuentas contables, Asientos contables y Reportes financieros, y NO DEBE incluir Pagos y cobros ni Periodos contables.
- **FR-014**: El menú lateral del Tesorero DEBE incluir Panel de inicio y Pagos y cobros, y NO DEBE incluir Cuentas contables, Asientos contables, Periodos contables ni Reportes financieros.
- **FR-015**: El menú lateral del Auditor DEBE incluir Panel de inicio y Reportes financieros en modo de consulta, y NO DEBE incluir ninguna otra sección del módulo.
- **FR-016**: El sistema DEBE bloquear el acceso directo a una sección no autorizada para el rol y mostrar un mensaje de acceso no disponible sin revelar su contenido.
- **FR-017**: El sistema DEBE aplicar las secciones visibles del menú lateral inmediatamente después de la autenticación.
- **FR-018**: El sistema DEBE retirar las secciones visibles del menú lateral inmediatamente después del cierre de sesión.
- **FR-019**: Cuando el rol autenticado no sea reconocido, el sistema NO DEBE mostrar secciones del módulo y DEBE solicitar una nueva autenticación.
- **FR-020**: El menú lateral DEBE mantenerse coherente con la matriz de acceso por rol definida en la especificación 002-contabilidad-finanzas, con las exclusiones de esta funcionalidad.

### Key Entities *(include if feature involves data)*

- **UsuarioAutenticado**: Persona identificada en una sesión válida, con un rol asignado que determina las secciones visibles del menú lateral.
- **Rol**: Categoría de acceso del usuario: Administrador financiero, Contador, Tesorero o Auditor.
- **SeccionMenu**: Entrada de navegación del módulo que puede mostrarse o no en el menú lateral según el rol y las exclusiones de esta funcionalidad.
- **PermisoRol**: Regla que asocia un rol con las secciones que puede usar y, por lo tanto, con las que deben aparecer en el menú lateral.
- **Sesion**: Estado de acceso que comienza con una autenticación válida y termina con el cierre de sesión; determina si el menú lateral debe estar visible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las pruebas sin autenticación muestra la pantalla de acceso sin menú lateral.
- **SC-002**: El 100% de las autenticaciones válidas muestra el menú lateral con las secciones del rol en menos de 3 segundos.
- **SC-003**: El 100% de los cierres de sesión oculta el menú lateral y evita recuperarlo navegando hacia atrás.
- **SC-004**: Las opciones "Entidades", "Documentos" y "Búsqueda" aparecen 0 veces en el menú lateral de los cuatro roles de prueba.
- **SC-005**: El 100% de los usuarios de prueba ve exactamente la combinación de secciones definida en la matriz de acceso.
- **SC-006**: El 100% de los intentos de abrir una sección no visible muestra un mensaje claro y no revela información de esa sección.
- **SC-007**: Al menos el 95% de los usuarios identifica la primera sección que necesita en su menú lateral en menos de 5 segundos.
- **SC-008**: El 100% de los flujos permitidos se completa sin necesidad de abrir Entidades, Documentos ni una pantalla global de Búsqueda.
- **SC-009**: El 100% de los formularios que requieren una entidad o un documento permite seleccionarlo dentro de la pantalla permitida correspondiente.

## Assumptions

- La especificación 002-contabilidad-finanzas define la autenticación, los cuatro roles de prueba y las secciones funcionales del módulo; esta funcionalidad ajusta la presentación del menú lateral sin cambiar esas definiciones.
- El menú lateral es la navegación principal del módulo después del inicio de sesión.
- Las opciones eliminadas corresponden a navegación del ERP base o a una búsqueda global; sus datos pueden seguir existiendo para las relaciones financieras.
- Los filtros dentro de cuentas, asientos, pagos, periodos y reportes se consideran parte de esas secciones y no una pantalla de búsqueda global.
- El acceso directo a una sección no visible se bloquea con un mensaje claro en español.
- Un cambio de rol requiere cerrar sesión y autenticarse nuevamente; no se reevalúa el menú lateral durante una sesión abierta.
- El Auditor mantiene acceso de solo lectura a Reportes financieros, sin acciones de creación, edición, eliminación ni cambio de estado.
- Las acciones del panel de inicio, como cargar datos de ejemplo, restablecer datos y cerrar sesión, no forman parte del menú lateral y no se ven afectadas por esta funcionalidad.
