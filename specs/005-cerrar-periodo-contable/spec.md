# Feature Specification: Cierre de periodo contable

**Feature Branch**: `005-cerrar-periodo-contable`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Administrador financiero, quiero cerrar un periodo contable para que nadie pueda registrar ni modificar asientos o pagos en ese periodo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cerrar un periodo contable (Priority: P1)

Como Administrador financiero, quiero cerrar un periodo contable, para congelar las operaciones de ese intervalo y evitar cambios posteriores en la información financiera.

**Why this priority**: El cierre de periodo protege la integridad de la contabilidad al impedir que se agreguen o alteren movimientos después de que el periodo haya sido finalizado.

**Independent Test**: El Administrador financiero selecciona un periodo abierto, confirma el cierre y verifica que el periodo quede marcado como cerrado y que la acción no pueda repetirse.

**Acceptance Scenarios**:

1. **Given** que existe un periodo contable abierto, **When** el Administrador financiero selecciona cerrarlo y confirma la acción, **Then** el periodo queda marcado como cerrado en el listado.
2. **Given** que un periodo tiene asientos y pagos registrados, **When** el Administrador financiero lo cierra, **Then** los registros existentes se conservan sin cambios y solo su estado pasa a cerrado.
3. **Given** que un periodo está abierto, **When** el Administrador financiero inicia el cierre y cancela la confirmación, **Then** el periodo permanece abierto y no se aplica ningún bloqueo.
4. **Given** que un periodo ya está cerrado, **When** el Administrador financiero intenta cerrarlo de nuevo, **Then** no se permite la acción y se muestra un mensaje claro.
5. **Given** que un periodo no tiene movimientos registrados, **When** el Administrador financiero lo cierra, **Then** el cierre se aplica correctamente y el periodo queda identificado como cerrado.
6. **Given** que un periodo está cerrado, **When** se consultan otros periodos, **Then** el estado y las operaciones de esos otros periodos no se modifican.

---

### User Story 2 - Impedir registrar o modificar asientos en un periodo cerrado (Priority: P1)

Como Administrador financiero, quiero que nadie pueda registrar ni modificar asientos contables en un periodo cerrado, para conservar la trazabilidad y el equilibrio de la información contable.

**Why this priority**: Los asientos son la fuente de los reportes financieros; permitir cambios en un periodo cerrado haría que los estados financieros ya consultados dejaran de ser confiables.

**Independent Test**: Con un periodo cerrado, se intentan crear, editar, eliminar y cambiar el estado de un asiento asignado a ese periodo, verificando que todas las acciones se bloqueen con un mensaje claro.

**Acceptance Scenarios**:

1. **Given** que un periodo está cerrado, **When** cualquier usuario intenta registrar un asiento con fecha correspondiente a ese periodo, **Then** el sistema impide el registro y muestra un mensaje indicando que el periodo está cerrado.
2. **Given** que existe un asiento aprobado en un periodo cerrado, **When** cualquier usuario intenta editar su fecha, concepto, líneas o montos, **Then** el sistema bloquea la edición y no guarda cambios.
3. **Given** que existe un asiento en un periodo cerrado, **When** cualquier usuario intenta eliminarlo, **Then** el sistema bloquea la eliminación y conserva el registro.
4. **Given** que existe un asiento en un periodo cerrado, **When** cualquier usuario intenta cambiarlo a aprobado o cancelado, **Then** el sistema bloquea el cambio de estado.
5. **Given** que existe un asiento en un periodo abierto, **When** un usuario intenta cambiar su fecha a un periodo cerrado, **Then** el sistema bloquea el cambio y mantiene el asiento en su periodo original.
6. **Given** que un periodo fue cerrado mientras un asiento estaba abierto para edición, **When** el usuario intenta guardar, **Then** el sistema rechaza el guardado y muestra el mensaje de periodo cerrado.
7. **Given** que el propio Administrador financiero intenta modificar un asiento del periodo cerrado, **When** confirma la acción, **Then** el sistema también lo bloquea porque el cierre aplica a todos los roles.

---

### User Story 3 - Impedir registrar o modificar pagos y cobros en un periodo cerrado (Priority: P1)

Como Administrador financiero, quiero que nadie pueda registrar ni modificar pagos y cobros en un periodo cerrado, para que los movimientos de tesorería ya finalizados no cambien después del cierre.

**Why this priority**: Los pagos y cobros afectan los saldos y el resumen financiero; modificarlos en un periodo cerrado generaría diferencias entre los reportes y la realidad registrada.

**Independent Test**: Con un periodo cerrado, se intentan registrar, editar, marcar como pagado y eliminar pagos o cobros de ese periodo, verificando que todas las acciones se bloqueen.

**Acceptance Scenarios**:

1. **Given** que un periodo está cerrado, **When** cualquier usuario intenta registrar un pago o cobro con fecha correspondiente a ese periodo, **Then** el sistema impide el registro y muestra un mensaje indicando que el periodo está cerrado.
2. **Given** que existe un pago o cobro en un periodo cerrado, **When** cualquier usuario intenta modificar su fecha, monto, tipo, entidad, documento o fecha de vencimiento, **Then** el sistema bloquea la edición y no guarda cambios.
3. **Given** que existe un pago o cobro pendiente o vencido en un periodo cerrado, **When** cualquier usuario intenta marcarlo como pagado, **Then** el sistema bloquea el cambio de estado.
4. **Given** que existe un pago o cobro en un periodo cerrado, **When** cualquier usuario intenta eliminarlo, **Then** el sistema bloquea la eliminación y conserva el registro.
5. **Given** que existe un pago o cobro en un periodo abierto, **When** un usuario intenta cambiar su fecha a un periodo cerrado, **Then** el sistema bloquea el cambio y mantiene el registro en su periodo original.
6. **Given** que el Tesorero consulta un pago de un periodo cerrado, **When** revisa el detalle, **Then** puede verlo pero no encuentra acciones de edición, cambio de estado ni eliminación.

---

### User Story 4 - Consultar periodos cerrados sin alterarlos (Priority: P2)

Como usuario con acceso a la información financiera, quiero poder consultar los registros y reportes de un periodo cerrado, para analizar la información histórica sin posibilidad de modificarla.

**Why this priority**: El cierre debe proteger los datos, no ocultarlos; los roles autorizados necesitan acceder a la información para auditoría y análisis.

**Independent Test**: Se cierra un periodo con movimientos y se verifica que los listados y reportes sigan mostrando la información, pero sin acciones de creación, edición, eliminación ni cambio de estado.

**Acceptance Scenarios**:

1. **Given** que un periodo cerrado tiene asientos y pagos registrados, **When** un usuario con acceso abre los listados correspondientes, **Then** puede consultar los registros del periodo.
2. **Given** que un usuario consulta reportes de un periodo cerrado, **When** genera Libro Mayor, Balance de Comprobación, Estado de Resultados o Balance General, **Then** los reportes muestran la información del periodo sin permitir modificaciones.
3. **Given** que un periodo cerrado está incluido en una lista de selección de periodos, **When** un usuario lo elige para consultar, **Then** la consulta funciona normalmente y las acciones de edición permanecen bloqueadas.
4. **Given** que un usuario sin permiso para cerrar periodos revisa la gestión de periodos, **When** observa un periodo cerrado, **Then** ve su estado pero no encuentra la acción para cerrarlo.

---

### User Story 5 - Restringir la acción de cierre al Administrador financiero (Priority: P1)

Como usuario del módulo, quiero que solo el Administrador financiero pueda cerrar periodos, para evitar que otros roles alteren el estado general de la contabilidad.

**Why this priority**: El cierre afecta a todos los usuarios y a todas las operaciones del periodo; por eso debe permanecer bajo la responsabilidad administrativa definida en la matriz de permisos.

**Independent Test**: Se inicia sesión con cada rol y se comprueba que solo el Administrador financiero ve y puede ejecutar la acción de cerrar periodos.

**Acceptance Scenarios**:

1. **Given** que inicia sesión el Administrador financiero, **When** abre la gestión de periodos, **Then** ve la acción para cerrar periodos abiertos.
2. **Given** que inicia sesión el Contador, el Tesorero o el Auditor, **When** abre la gestión de periodos o cualquier pantalla relacionada, **Then** no ve la acción para cerrar periodos.
3. **Given** que un rol distinto del Administrador financiero intenta cerrar un periodo directamente, **When** realiza la acción, **Then** el sistema bloquea la operación y muestra un mensaje de acceso no disponible.
4. **Given** que el Administrador financiero cierra un periodo, **When** otro rol intenta registrar o modificar movimientos en ese periodo, **Then** el bloqueo se aplica de inmediato para todos los roles.

### Edge Cases

- ¿Qué ocurre cuando se cancela la confirmación de cierre?
- ¿Qué ocurre cuando se intenta cerrar un periodo que ya está cerrado?
- ¿Qué ocurre cuando no existe el periodo seleccionado?
- ¿Qué ocurre cuando un asiento o pago estaba abierto para edición antes de cerrar el periodo?
- ¿Qué ocurre cuando se intenta cambiar la fecha de un asiento o pago desde un periodo abierto hacia uno cerrado?
- ¿Qué ocurre cuando se intenta cambiar la fecha de un asiento o pago desde un periodo cerrado hacia uno abierto?
- ¿Qué ocurre cuando un pago vencido de un periodo cerrado se intenta marcar como pagado?
- ¿Qué ocurre cuando se cargan datos de ejemplo mientras existen periodos cerrados?
- ¿Qué ocurre cuando se restablecen datos después de cerrar periodos?
- ¿Qué ocurre cuando un usuario sin permiso intenta cerrar un periodo directamente?
- ¿Qué ocurre cuando un periodo cerrado se consulta desde un reporte financiero?
- ¿Qué ocurre cuando se cierra un periodo que no tiene movimientos registrados?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir únicamente al Administrador financiero cerrar un periodo contable abierto.
- **FR-002**: El sistema DEBE solicitar confirmación antes de aplicar el cierre de un periodo.
- **FR-003**: El sistema DEBE marcar el periodo como cerrado después de confirmar la acción.
- **FR-004**: El sistema DEBE conservar sin cambios los asientos y pagos existentes cuando se cierra un periodo.
- **FR-005**: El sistema NO DEBE permitir cerrar un periodo que ya esté cerrado.
- **FR-006**: El sistema DEBE mostrar claramente el estado abierto o cerrado de cada periodo en el listado de periodos.
- **FR-007**: El sistema NO DEBE permitir registrar asientos contables cuya fecha corresponda a un periodo cerrado.
- **FR-008**: El sistema NO DEBE permitir modificar asientos contables existentes en un periodo cerrado.
- **FR-009**: El sistema NO DEBE permitir eliminar asientos contables existentes en un periodo cerrado.
- **FR-010**: El sistema NO DEBE permitir cambiar el estado de un asiento contable en un periodo cerrado.
- **FR-011**: El sistema NO DEBE permitir cambiar la fecha de un asiento o pago desde un periodo abierto hacia un periodo cerrado.
- **FR-012**: El sistema NO DEBE permitir mover un asiento o pago desde un periodo cerrado hacia otro periodo mediante la edición de su fecha.
- **FR-013**: El sistema NO DEBE permitir registrar pagos ni cobros cuya fecha corresponda a un periodo cerrado.
- **FR-014**: El sistema NO DEBE permitir modificar pagos ni cobros existentes en un periodo cerrado.
- **FR-015**: El sistema NO DEBE permitir marcar como pagado un pago o cobro en un periodo cerrado.
- **FR-016**: El sistema NO DEBE permitir eliminar pagos ni cobros en un periodo cerrado.
- **FR-017**: El bloqueo de un periodo cerrado DEBE aplicarse a todos los roles, incluido el Administrador financiero.
- **FR-018**: El sistema DEBE mostrar un mensaje claro de periodo cerrado cuando se intente registrar o modificar un movimiento en ese periodo.
- **FR-019**: El sistema DEBE rechazar el guardado de un formulario abierto cuando su periodo correspondiente haya sido cerrado antes del guardado.
- **FR-020**: Los roles distintos del Administrador financiero NO DEBEN ver la acción de cerrar periodos.
- **FR-021**: El sistema DEBE bloquear el acceso directo a la acción de cierre para roles no autorizados y mostrar un mensaje de acceso no disponible.
- **FR-022**: El cierre de un periodo NO DEBE afectar las operaciones ni el estado de otros periodos.
- **FR-023**: Los usuarios autorizados DEBEN poder consultar los asientos, pagos, cobros y reportes de un periodo cerrado.
- **FR-024**: La consulta de un periodo cerrado NO DEBE mostrar acciones de creación, edición, eliminación ni cambio de estado sobre sus movimientos.
- **FR-025**: La carga de datos de ejemplo NO DEBE registrar asientos ni pagos en periodos cerrados.
- **FR-026**: El mensaje de bloqueo DEBE indicar que el periodo está cerrado y que no se pueden registrar ni modificar movimientos en ese periodo.

### Key Entities *(include if feature involves data)*

- **PeriodoContable**: Intervalo de tiempo que puede estar abierto o cerrado; su estado determina si se permiten operaciones sobre asientos y pagos.
- **AsientoContable**: Registro contable cuya fecha determina el periodo al que pertenece y, por lo tanto, si puede crearse, editarse, eliminarse o cambiar de estado.
- **Pago**: Movimiento de pago o cobro cuya fecha determina el periodo al que pertenece y si puede registrarse o modificarse.
- **AdministradorFinanciero**: Rol único con permiso para ejecutar el cierre de periodos.
- **CierrePeriodo**: Acción administrativa confirmada que cambia un periodo de abierto a cerrado y activa el bloqueo de operaciones sobre ese periodo.
- **MensajePeriodoCerrado**: Comunicación clara que informa al usuario que la operación solicitada no está disponible porque el periodo está cerrado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los periodos cerrados queda identificado como cerrado inmediatamente después de confirmar la acción.
- **SC-002**: El 100% de los intentos de registrar o modificar asientos en periodos cerrados se bloquea y muestra un mensaje claro.
- **SC-003**: El 100% de los intentos de registrar o modificar pagos y cobros en periodos cerrados se bloquea y muestra un mensaje claro.
- **SC-004**: El 100% de los intentos de mover un asiento o pago desde o hacia un periodo cerrado se bloquea.
- **SC-005**: El 100% de los roles distintos del Administrador financiero no ve ni puede ejecutar la acción de cerrar periodos.
- **SC-006**: El 100% de los cierres cancelados deja el periodo abierto y sin cambios.
- **SC-007**: El 100% de los registros existentes se conserva sin modificaciones después de cerrar el periodo correspondiente.
- **SC-008**: El 100% de los usuarios autorizados puede consultar reportes de periodos cerrados sin encontrar acciones de modificación.
- **SC-009**: El 100% de los periodos cerrados conserva sus registros después de cargar datos de ejemplo.
- **SC-010**: El 95% de los Administradores financieros puede cerrar un periodo y explicar sus efectos en menos de 1 minuto durante una prueba de uso.

## Assumptions

- La especificación 002-contabilidad-finanzas define los periodos contables, los asientos, los pagos y los roles; esta funcionalidad refuerza las reglas de cierre existentes y las extiende a la modificación de pagos.
- El Administrador financiero es el único rol autorizado para cerrar periodos, conforme a la matriz de permisos vigente.
- "Pagos" incluye tanto pagos como cobros, de acuerdo con la terminología de la sección "Pagos y cobros" del módulo.
- Se considera modificación cualquier cambio sobre un registro, incluida su edición, eliminación, cambio de estado y cambio de fecha.
- La pertenencia de un asiento o pago a un periodo se determina por su fecha contable o fecha del movimiento.
- El cierre es una acción administrativa con confirmación y, dentro de esta funcionalidad, no se contempla la reapertura del periodo.
- El cierre no altera los registros existentes; solo cambia el estado del periodo y activa el bloqueo de operaciones posteriores.
- El bloqueo se aplica a todos los roles, incluido el Administrador financiero, para garantizar la integridad de la información cerrada.
- Los reportes financieros y las consultas de periodos cerrados permanecen disponibles para los roles autorizados.
- La semilla de datos de ejemplo respeta los periodos cerrados y no crea movimientos dentro de ellos.
- El restablecimiento de datos sigue siendo una acción administrativa independiente y devuelve el módulo a su estado inicial según las reglas ya definidas.
- Los mensajes de bloqueo y de acceso no disponible se muestran en español y en un lenguaje comprensible para usuarios no técnicos.
