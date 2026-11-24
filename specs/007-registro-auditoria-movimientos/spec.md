# Feature Specification: Registro de auditoría de movimientos

**Feature Branch**: `007-registro-auditoria-movimientos`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Auditor, quiero ver un registro de quién creó, editó o anuló cada asiento y pago, con fecha y hora, para controlar riesgos."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar la auditoría de un asiento contable (Priority: P1)

Como Auditor, quiero ver quién creó, editó o anuló un asiento contable y cuándo ocurrió cada acción, para evaluar la trazabilidad de los movimientos contables.

**Why this priority**: Los asientos son la base de los reportes financieros; conocer su historial permite detectar cambios sospechosos y comprender el origen de cada cifra.

**Independent Test**: Se abre el detalle de un asiento con eventos de creación, edición y anulación, y se comprueba que cada evento muestra usuario, rol, acción, fecha y hora.

**Acceptance Scenarios**:

1. **Given** que existe un asiento creado por un usuario de prueba, **When** el Auditor abre su historial de auditoría, **Then** ve el evento de creación con el nombre del usuario, su rol, la fecha y la hora de la creación.
2. **Given** que un asiento fue editado, **When** el Auditor consulta su historial, **Then** ve cada evento de edición con usuario, rol, fecha, hora y una descripción de los campos modificados.
3. **Given** que un asiento fue anulado al pasar a estado cancelado, **When** el Auditor consulta su historial, **Then** ve el evento de anulación con usuario, rol, fecha y hora.
4. **Given** que un asiento tiene varios eventos, **When** se muestra su historial, **Then** los eventos aparecen en orden cronológico, con el más reciente primero.
5. **Given** que un asiento no tiene eventos de auditoría, **When** el Auditor abre su historial, **Then** se muestra un mensaje claro indicando que no hay registro de auditoría disponible.
6. **Given** que el Auditor revisa el historial, **When** intenta modificar o eliminar un evento, **Then** el sistema no ofrece esas acciones y conserva el registro intacto.

---

### User Story 2 - Consultar la auditoría de un pago o cobro (Priority: P1)

Como Auditor, quiero ver quién creó, editó o anuló un pago o cobro y cuándo ocurrió cada acción, para controlar los riesgos asociados a los movimientos de dinero.

**Why this priority**: Los pagos y cobros afectan directamente la tesorería y los saldos; su historial permite identificar cambios no autorizados o tardíos.

**Independent Test**: Se abre el detalle de un pago o cobro con eventos de creación, edición y anulación, y se verifica que cada evento muestre usuario, rol, acción, fecha y hora.

**Acceptance Scenarios**:

1. **Given** que existe un pago o cobro registrado, **When** el Auditor abre su historial de auditoría, **Then** ve el evento de creación con usuario, rol, fecha y hora.
2. **Given** que un pago o cobro fue editado en su fecha, monto, entidad, documento o fecha de vencimiento, **When** el Auditor consulta su historial, **Then** ve el evento de edición con la descripción del cambio.
3. **Given** que un pago o cobro fue anulado, **When** el Auditor consulta su historial, **Then** ve el evento de anulación con usuario, rol, fecha y hora, y el registro permanece disponible para consulta.
4. **Given** que un pago o cobro tiene varios eventos, **When** se muestra su historial, **Then** los eventos se ordenan con el más reciente primero.
5. **Given** que un pago o cobro no tiene eventos de auditoría, **When** el Auditor abre su historial, **Then** se muestra un mensaje de estado vacío en español.
6. **Given** que el Auditor consulta un pago o cobro anulado, **When** revisa su historial, **Then** puede identificar quién realizó la anulación y cuándo se realizó.

---

### User Story 3 - Consultar el registro consolidado de auditoría (Priority: P1)

Como Auditor, quiero consultar un registro consolidado de los eventos de asientos y pagos, con filtros locales, para revisar rápidamente las operaciones con mayor riesgo.

**Why this priority**: Una vista consolidada permite detectar patrones, concentración de cambios por usuario o movimientos recientes sin abrir registro por registro.

**Independent Test**: Se abre la consulta dentro de "Reportes financieros", se aplican filtros por tipo de movimiento, acción y usuario, y se verifica que la lista muestre solo los eventos coincidentes con fecha y hora.

**Acceptance Scenarios**:

1. **Given** que el Auditor abre "Reportes financieros", **When** selecciona la consulta de auditoría, **Then** ve una lista consolidada de eventos de asientos y pagos.
2. **Given** que la lista consolidada está visible, **When** el Auditor revisa cada fila, **Then** puede identificar el tipo de movimiento, el registro afectado, la acción realizada, el usuario responsable, su rol, la fecha y la hora.
3. **Given** que existen eventos de varios usuarios, **When** el Auditor filtra por usuario, **Then** la lista muestra únicamente los eventos de ese usuario.
4. **Given** que existen eventos de creación, edición y anulación, **When** el Auditor filtra por acción, **Then** la lista muestra únicamente los eventos de esa acción.
5. **Given** que existen eventos de asientos y pagos, **When** el Auditor filtra por tipo de movimiento, **Then** la lista muestra únicamente los eventos del tipo seleccionado.
6. **Given** que no existen eventos que coincidan con los filtros, **When** se aplica el filtro, **Then** se muestra un mensaje indicando que no hay eventos de auditoría para esa selección.
7. **Given** que se revisa el menú lateral, **When** se compara con la configuración vigente, **Then** no se crea una nueva opción para esta consulta ni una entrada duplicada.

---

### User Story 4 - Proteger la integridad del registro de auditoría (Priority: P1)

Como Auditor, quiero que los eventos de auditoría sean generados automáticamente y no modificables, para confiar en ellos como evidencia de control.

**Why this priority**: Si los eventos pudieran editarse o borrarse, perderían valor como mecanismo de control de riesgos.

**Independent Test**: Se crea, edita y anula un movimiento, se revisan los eventos generados y se comprueba que no existan acciones para alterarlos manualmente.

**Acceptance Scenarios**:

1. **Given** que un usuario crea, edita o anula un asiento o pago, **When** finaliza la acción, **Then** el sistema genera automáticamente el evento de auditoría correspondiente.
2. **Given** que un evento de auditoría fue generado, **When** cualquier usuario intenta editarlo o eliminarlo, **Then** el sistema no permite la acción.
3. **Given** que un movimiento se edita varias veces, **When** se consulta su historial, **Then** cada edición genera un evento independiente y los eventos anteriores permanecen sin cambios.
4. **Given** que un usuario intenta realizar una operación no permitida, **When** la operación es rechazada, **Then** no se genera un evento de auditoría porque no se produjo un cambio real.
5. **Given** que un movimiento se anula dos veces, **When** la segunda anulación es rechazada, **Then** no se genera un segundo evento de anulación.
6. **Given** que el Auditor consulta eventos, **When** verifica su contenido, **Then** la fecha y hora mostradas corresponden al momento en que ocurrió la acción, no al momento de la consulta.

---

### User Story 5 - Auditar los datos de ejemplo y el restablecimiento (Priority: P2)

Como Auditor, quiero que los datos de ejemplo incluyan eventos de auditoría deterministas y que el restablecimiento devuelva ese historial a su estado inicial, para realizar pruebas repetibles de control.

**Why this priority**: Sin datos de ejemplo representativos, el Auditor no puede validar el registro de auditoría ni repetir pruebas de riesgo de forma consistente.

**Independent Test**: Se cargan datos de ejemplo dos veces, se revisa el historial y se comprueba que los eventos sean idénticos; después se restablecen los datos y se verifica el estado inicial del historial.

**Acceptance Scenarios**:

1. **Given** que se cargan datos de ejemplo, **When** el Auditor consulta el registro consolidado, **Then** ve eventos deterministas de creación, edición y anulación asociados con los movimientos de la semilla.
2. **Given** que se cargan datos de ejemplo en dos ocasiones, **When** se comparan los historiales, **Then** usuarios, acciones, fechas y horas son idénticos.
3. **Given** que el Administrador restablece datos, **When** el Auditor consulta el registro, **Then** el historial vuelve a su estado inicial determinista sin eventos huérfanos.
4. **Given** que se restablecen datos mientras el Auditor tiene una consulta abierta, **When** actualiza la consulta, **Then** ve el historial coherente con el estado inicial.

### Edge Cases

- ¿Qué ocurre cuando un movimiento fue creado antes de que existiera el registro de auditoría?
- ¿Qué ocurre cuando el usuario responsable ya no aparece en la lista de usuarios de prueba?
- ¿Qué ocurre cuando dos eventos ocurren con la misma fecha y hora?
- ¿Qué ocurre cuando se intenta anular un movimiento ya anulado?
- ¿Qué ocurre cuando una edición no cambia ningún valor?
- ¿Qué ocurre cuando un movimiento se crea y se edita en el mismo periodo?
- ¿Qué ocurre cuando los datos de ejemplo se cargan dos veces seguidas?
- ¿Qué ocurre cuando se restablecen datos con filtros de auditoría aplicados?
- ¿Qué ocurre cuando un usuario sin rol de Auditor intenta abrir el registro de auditoría directamente?
- ¿Qué ocurre cuando no existen eventos de auditoría?
- ¿Qué ocurre cuando el campo modificado de un asiento o pago no tiene una descripción disponible?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE generar automáticamente un evento de auditoría cuando se crea un asiento contable.
- **FR-002**: El sistema DEBE generar automáticamente un evento de auditoría cuando se edita un asiento contable.
- **FR-003**: El sistema DEBE generar automáticamente un evento de auditoría cuando se anula un asiento contable.
- **FR-004**: El sistema DEBE generar automáticamente un evento de auditoría cuando se crea un pago o cobro.
- **FR-005**: El sistema DEBE generar automáticamente un evento de auditoría cuando se edita un pago o cobro.
- **FR-006**: El sistema DEBE generar automáticamente un evento de auditoría cuando se anula un pago o cobro.
- **FR-007**: Cada evento de auditoría DEBE identificar al usuario responsable mediante nombre, rol y RUT de prueba.
- **FR-008**: Cada evento de auditoría DEBE indicar la acción realizada: creación, edición o anulación.
- **FR-009**: Cada evento de auditoría DEBE registrar y mostrar la fecha y la hora en que ocurrió la acción.
- **FR-010**: Cada evento de edición DEBE describir los campos modificados del asiento o pago.
- **FR-011**: Cada evento DEBE identificar el asiento o pago afectado mediante un identificador visible y datos mínimos de contexto.
- **FR-012**: El sistema NO DEBE generar eventos de auditoría para operaciones rechazadas que no produjeron cambios.
- **FR-013**: El sistema NO DEBE generar un segundo evento de anulación cuando el movimiento ya esté anulado.
- **FR-014**: La anulación de un asiento DEBE conservar el registro y corresponder al estado cancelado.
- **FR-015**: La anulación de un pago o cobro DEBE conservar el registro y dejar de incluirlo en los totales vigentes y en el resumen por estado.
- **FR-016**: El Auditor DEBE poder consultar el historial de auditoría desde el detalle de cada asiento.
- **FR-017**: El Auditor DEBE poder consultar el historial de auditoría desde el detalle de cada pago o cobro.
- **FR-018**: El Auditor DEBE poder consultar un registro consolidado de eventos de asientos y pagos.
- **FR-019**: El registro consolidado DEBE presentar los eventos en orden cronológico, con el más reciente primero.
- **FR-020**: El registro consolidado DEBE ofrecer filtros locales por tipo de movimiento, acción y usuario.
- **FR-021**: Los filtros de auditoría NO DEBEN constituir una pantalla global de búsqueda ni una nueva opción de menú.
- **FR-022**: La consulta de auditoría DEBE incorporarse dentro de la sección existente "Reportes financieros" del Auditor.
- **FR-023**: Los eventos de auditoría NO DEBEN poder crearse, editarse ni eliminarse manualmente.
- **FR-024**: Los eventos de auditoría DEBEN permanecer sin cambios cuando se edite posteriormente el movimiento relacionado.
- **FR-025**: Solo el Auditor DEBE poder consultar el registro de auditoría.
- **FR-026**: El sistema DEBE bloquear el acceso directo de otros roles al registro de auditoría y mostrar un mensaje de acceso no disponible.
- **FR-027**: El sistema DEBE mostrar un mensaje de estado vacío cuando no existan eventos para un movimiento o para los filtros aplicados.
- **FR-028**: La fecha y hora de cada evento DEBEN mostrarse en un formato consistente con el resto del módulo.
- **FR-029**: Los datos de ejemplo DEBEN incluir eventos de auditoría deterministas de creación, edición y anulación.
- **FR-030**: Cargar datos de ejemplo dos veces DEBE producir historiales de auditoría idénticos.
- **FR-031**: El restablecimiento de datos DEBE devolver el registro de auditoría a su estado inicial determinista sin eventos huérfanos.
- **FR-032**: Cuando un movimiento no tenga eventos disponibles, el sistema DEBE informarlo sin mostrar datos incompletos ni inventar eventos.

### Key Entities *(include if feature involves data)*

- **EventoAuditoria**: Registro automático e inmutable que describe una creación, edición o anulación realizada sobre un asiento o pago, con usuario responsable, fecha y hora.
- **AsientoContable**: Movimiento contable cuyo historial de eventos permite reconstruir quién lo creó, editó o anuló.
- **Pago**: Movimiento de pago o cobro cuyo historial de eventos permite identificar cambios y anulaciones.
- **UsuarioResponsable**: Usuario de prueba que ejecutó la acción, identificado por nombre, rol y RUT.
- **HistorialAuditoria**: Conjunto ordenado de eventos asociados a un movimiento específico o al módulo completo.
- **RegistroConsolidado**: Consulta de auditoría que reúne eventos de asientos y pagos con filtros locales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las creaciones, ediciones y anulaciones de asientos genera un evento de auditoría completo.
- **SC-002**: El 100% de las creaciones, ediciones y anulaciones de pagos y cobros genera un evento de auditoría completo.
- **SC-003**: El 100% de los eventos muestra usuario, rol, acción, fecha y hora del momento en que ocurrió la acción.
- **SC-004**: El 100% de los historiales por movimiento muestra sus eventos en orden cronológico descendente.
- **SC-005**: El 100% de los eventos de edición identifica los campos modificados.
- **SC-006**: El 100% de los intentos de modificar o eliminar eventos de auditoría es bloqueado.
- **SC-007**: El 100% de los roles distintos del Auditor no puede consultar el registro de auditoría.
- **SC-008**: El 100% de las consultas con filtros devuelve únicamente los eventos que coinciden con la selección.
- **SC-009**: El 100% de las cargas de datos de ejemplo produce historiales idénticos en usuarios, acciones, fechas y horas.
- **SC-010**: El 100% de los restablecimientos deja el registro de auditoría en su estado inicial sin eventos huérfanos.
- **SC-011**: El Auditor localiza el evento de creación, edición o anulación de un movimiento en menos de 1 minuto en el 95% de las pruebas.
- **SC-012**: Al menos el 90% de los Auditores encuestados indica que el registro de auditoría le permite identificar responsables de cambios y apoyar el control de riesgos.

## Assumptions

- La especificación 002-contabilidad-finanzas define los asientos, los pagos, los usuarios de prueba y el rol Auditor; esta funcionalidad incorpora trazabilidad sin cambiar las responsabilidades ya definidas.
- El Auditor es el único rol con acceso al registro de auditoría.
- La consulta se ofrece dentro de la sección existente "Reportes financieros" y desde el detalle de cada movimiento, sin crear una nueva opción en el menú lateral.
- La anulación de un asiento equivale a su cambio a estado cancelado, conservando el registro para auditoría.
- La anulación de un pago o cobro conserva el registro y lo excluye de totales vigentes y del resumen por estado.
- La identificación del usuario responsable usa los usuarios ficticios de demostración, incluyendo nombre, rol y RUT de prueba.
- La fecha y hora mostradas corresponden al momento en que se realizó la acción y se presentan con un formato consistente en todo el módulo.
- Los eventos de auditoría se generan solo para acciones que produjeron cambios reales; los intentos fallidos o rechazados no generan eventos.
- Los eventos de auditoría son inmutables y no pueden crearse, editarse ni eliminarse manualmente.
- Los datos de ejemplo incluyen eventos deterministas de creación, edición y anulación para permitir pruebas repetibles.
- El restablecimiento de datos devuelve el historial de auditoría a su estado inicial determinista, conservando los usuarios de prueba.
- Los filtros de la consulta son locales a la sección de auditoría y no sustituyen ni reactivan una pantalla global de búsqueda.
- Cuando un movimiento no tenga eventos disponibles, se muestra un mensaje claro en español en lugar de información incompleta.
