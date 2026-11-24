# Feature Specification: Filtros de asientos y pagos

**Feature Branch**: `011-filtros-asientos-pagos`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como usuario, quiero filtrar asientos y pagos por fecha, cuenta, monto y estado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filtrar asientos contables (Priority: P1)

Como usuario con acceso a asientos, quiero filtrar el listado de asientos por fecha, cuenta, monto y estado, para encontrar rápidamente los movimientos contables que necesito revisar.

**Why this priority**: Los asientos pueden acumularse rápidamente; sin filtros, localizar un movimiento específico es lento y propenso a errores.

**Independent Test**: Se abre el listado de asientos con datos de ejemplo, se aplica un filtro por cada criterio y se verifica que solo aparezcan los asientos coincidentes.

**Acceptance Scenarios**:

1. **Dado** que el listado de asientos está visible, **Cuando** se aplica un rango de fechas, **Entonces** se muestran solo los asientos cuya fecha contable esté dentro del rango, incluyendo ambos límites.
2. **Dado** que el listado de asientos está visible, **Cuando** se selecciona una cuenta contable, **Entonces** se muestran solo los asientos que tienen al menos una línea con esa cuenta.
3. **Dado** que el listado de asientos está visible, **Cuando** se define un rango de montos, **Entonces** se muestran solo los asientos cuyo monto total esté dentro del rango, incluyendo ambos límites.
4. **Dado** que el listado de asientos está visible, **Cuando** se selecciona un estado, **Entonces** se muestran solo los asientos con ese estado.
5. **Dado** que se aplican varios filtros a la vez, **Cuando** se revisa el listado, **Entonces** se muestran solo los asientos que cumplen todos los criterios simultáneamente.
6. **Dado** que no existen asientos que cumplan los filtros, **Cuando** se aplica la selección, **Entonces** se muestra un mensaje de estado vacío en español.
7. **Dado** que se aplica un filtro de cuenta a un asiento con varias líneas, **Cuando** una de esas líneas usa la cuenta seleccionada, **Entonces** el asiento se considera coincidente.

---

### User Story 2 - Filtrar pagos y cobros (Priority: P1)

Como usuario con acceso a pagos y cobros, quiero filtrar el listado por fecha, cuenta, monto y estado, para ubicar rápidamente los movimientos de dinero relevantes para mi revisión.

**Why this priority**: La tesorería y la administración necesitan localizar pagos específicos sin recorrer todo el listado, especialmente cuando hay muchos movimientos.

**Independent Test**: Se abre el listado de pagos y cobros con datos de ejemplo, se aplica cada filtro y se comprueba que solo aparezcan los pagos coincidentes.

**Acceptance Scenarios**:

1. **Dado** que el listado de pagos y cobros está visible, **Cuando** se aplica un rango de fechas, **Entonces** se muestran solo los pagos cuya fecha del movimiento esté dentro del rango, incluyendo ambos límites.
2. **Dado** que el listado de pagos y cobros está visible, **Cuando** se selecciona una cuenta contable, **Entonces** se muestran solo los pagos relacionados con un asiento que utilice esa cuenta.
3. **Dado** que el listado de pagos y cobros está visible, **Cuando** se define un rango de montos, **Entonces** se muestran solo los pagos cuyo monto esté dentro del rango, incluyendo ambos límites.
4. **Dado** que el listado de pagos y cobros está visible, **Cuando** se selecciona un estado, **Entonces** se muestran solo los pagos con ese estado.
5. **Dado** que un pago no tiene un asiento relacionado, **Cuando** se filtra por una cuenta específica, **Entonces** ese pago no se considera coincidente.
6. **Dado** que se aplican varios filtros a la vez, **Cuando** se revisa el listado, **Entonces** se muestran solo los pagos que cumplen todos los criterios simultáneamente.
7. **Dado** que no existen pagos que cumplan los filtros, **Cuando** se aplica la selección, **Entonces** se muestra un mensaje de estado vacío en español.

---

### User Story 3 - Combinar, limpiar y comprender los filtros (Priority: P1)

Como usuario, quiero combinar filtros y poder limpiarlos fácilmente, para ajustar mi búsqueda sin perder el contexto del listado.

**Why this priority**: Un filtro que no puede combinarse ni limpiarse obliga al usuario a recargar o repetir pasos, reduciendo la utilidad del listado.

**Independent Test**: Se aplican varios filtros, se verifica el número de resultados, se limpian los filtros y se comprueba que el listado vuelva a su estado inicial.

**Acceptance Scenarios**:

1. **Dado** que se han aplicado filtros, **Cuando** se revisa el listado, **Entonces** se indica cuántos resultados cumplen la selección.
2. **Dado** que se han aplicado filtros, **Cuando** se selecciona la opción de limpiar filtros, **Entonces** el listado vuelve a mostrar todos los registros disponibles para ese rol.
3. **Dado** que no se ha aplicado ningún filtro, **Cuando** se revisa el estado inicial, **Entonces** la selección de estado es "Todos" y los demás filtros están sin aplicar.
4. **Dado** que se cambia un solo filtro, **Cuando** se actualiza el listado, **Entonces** se conservan los demás filtros previamente aplicados.
5. **Dado** que se aplica un rango de fechas inválido, **Cuando** se intenta filtrar, **Entonces** se muestra un mensaje específico y no se aplica ese filtro.
6. **Dado** que se aplica un rango de montos inválido, **Cuando** se intenta filtrar, **Entonces** se muestra un mensaje específico y no se aplica ese filtro.
7. **Dado** que se filtra por un estado no disponible para el tipo de registro, **Cuando** se aplica el filtro, **Entonces** el sistema no ofrece esa opción.

---

### User Story 4 - Mantener filtros coherentes con permisos y navegación (Priority: P2)

Como usuario, quiero que los filtros respeten los permisos y no alteren la navegación del módulo, para usarlos con confianza dentro de las secciones que ya conozco.

**Why this priority**: Los filtros son apoyo a listados existentes; no deben convertirse en una nueva sección ni permitir ver información restringida.

**Independent Test**: Se revisan los filtros con cada rol y se comprueba que solo aparezcan en listados autorizados y que no alteren cuentas, asientos ni pagos.

**Acceptance Scenarios**:

1. **Dado** que un rol no tiene acceso a asientos, **Cuando** revisa el módulo, **Entonces** no ve los filtros de asientos.
2. **Dado** que un rol no tiene acceso a pagos y cobros, **Cuando** revisa el módulo, **Entonces** no ve los filtros de pagos.
3. **Dado** que los filtros están disponibles, **Cuando** se revisa el menú lateral, **Entonces** no se crea una nueva opción de menú ni una pantalla de búsqueda global.
4. **Dado** que se aplican filtros, **Cuando** se consulta un registro, **Entonces** el registro conserva su información original.
5. **Dado** que el Tesorero ya usa el filtro de estado en pagos, **Cuando** se incorporan los nuevos filtros, **Entonces** el control de estado queda unificado y no duplicado.
6. **Dado** que se cargan o restablecen datos, **Cuando** se revisan los filtros, **Entonces** las opciones disponibles corresponden a los datos vigentes.

### Edge Cases

- ¿Qué ocurre cuando no existen registros en el listado?
- ¿Qué ocurre cuando no hay resultados para la combinación de filtros?
- ¿Qué ocurre cuando la fecha inicial es posterior a la fecha final?
- ¿Qué ocurre cuando el monto mínimo es mayor que el monto máximo?
- ¿Qué ocurre cuando se ingresa un monto negativo o no numérico?
- ¿Qué ocurre cuando se selecciona una cuenta sin movimientos?
- ¿Qué ocurre cuando un pago no tiene asiento relacionado y se filtra por cuenta?
- ¿Qué ocurre cuando un asiento tiene varias líneas con cuentas distintas?
- ¿Qué ocurre cuando se cambia el estado de un registro mientras un filtro está aplicado?
- ¿Qué ocurre cuando se limpia un filtro individual sin limpiar los demás?
- ¿Qué ocurre cuando se restablecen datos con filtros aplicados?
- ¿Qué ocurre cuando un rol sin acceso intenta usar los filtros directamente?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El listado de asientos DEBE ofrecer filtros por fecha, cuenta, monto y estado.
- **FR-002**: El listado de pagos y cobros DEBE ofrecer filtros por fecha, cuenta, monto y estado.
- **FR-003**: El filtro de fecha DEBE permitir definir un rango con fecha inicial y fecha final, ambos inclusive.
- **FR-004**: En asientos, el filtro de fecha DEBE aplicarse a la fecha contable del asiento.
- **FR-005**: En pagos y cobros, el filtro de fecha DEBE aplicarse a la fecha del movimiento.
- **FR-006**: El filtro de cuenta DEBE permitir seleccionar una cuenta contable existente.
- **FR-007**: En asientos, el filtro de cuenta DEBE considerar coincidente un asiento cuando al menos una de sus líneas use la cuenta seleccionada.
- **FR-008**: En pagos y cobros, el filtro de cuenta DEBE considerar coincidente un pago cuando su asiento relacionado use la cuenta seleccionada.
- **FR-009**: Un pago sin asiento relacionado NO DEBE considerarse coincidente cuando se aplique un filtro por cuenta específica.
- **FR-010**: El filtro de monto DEBE permitir definir un rango con monto mínimo y monto máximo, ambos inclusive.
- **FR-011**: En asientos, el filtro de monto DEBE aplicarse al monto total del asiento.
- **FR-012**: En pagos y cobros, el filtro de monto DEBE aplicarse al monto del pago o cobro.
- **FR-013**: Los montos del filtro DEBEN expresarse en MXN y usar el formato consistente del módulo.
- **FR-014**: El filtro de estado en asientos DEBE ofrecer borrador, aprobado y cancelado.
- **FR-015**: El filtro de estado en pagos y cobros DEBE ofrecer pendiente, pagado, vencido y anulado.
- **FR-016**: La opción inicial del filtro de estado DEBE ser "Todos", que representa ausencia de filtro por estado.
- **FR-017**: Los filtros aplicados DEBEN combinarse entre sí con criterio de coincidencia simultánea.
- **FR-018**: El sistema DEBE mostrar cuántos resultados cumplen los filtros aplicados.
- **FR-019**: El sistema DEBE ofrecer una acción para limpiar todos los filtros aplicados.
- **FR-020**: El sistema DEBE permitir limpiar un filtro individual sin afectar los demás.
- **FR-021**: Cuando no existan resultados, el sistema DEBE mostrar un mensaje de estado vacío claro en español.
- **FR-022**: Cuando un rango de fechas sea inválido, el sistema DEBE mostrar un mensaje específico y NO DEBE aplicar ese filtro.
- **FR-023**: Cuando un rango de montos sea inválido, el sistema DEBE mostrar un mensaje específico y NO DEBE aplicar ese filtro.
- **FR-024**: Cuando se ingrese un monto negativo o no numérico, el sistema DEBE rechazarlo con una explicación clara.
- **FR-025**: Los filtros DEBEN respetar la matriz de permisos vigente.
- **FR-026**: Los filtros NO DEBEN crear una nueva opción de menú ni una pantalla global de búsqueda.
- **FR-027**: El filtro de estado de pagos y cobros DEBE unificarse con el control de estado existente para evitar duplicidad.
- **FR-028**: Aplicar o limpiar filtros NO DEBE modificar cuentas, asientos, pagos ni periodos.
- **FR-029**: Los filtros DEBEN actualizarse de forma coherente cuando cambien los datos de ejemplo o se restablezca el módulo.
- **FR-030**: Las opciones de filtro DEBEN corresponder solo a estados y cuentas válidos para el tipo de registro.

### Key Entities *(include if feature involves data)*

- **FiltroFecha**: Rango inclusive de fechas aplicado a la fecha contable de un asiento o a la fecha del movimiento de un pago.
- **FiltroCuenta**: Criterio que selecciona una cuenta contable y determina qué asientos o pagos coinciden.
- **FiltroMonto**: Rango inclusive de montos en MXN aplicado al total de un asiento o al monto de un pago.
- **FiltroEstado**: Criterio que selecciona uno o todos los estados válidos del tipo de registro.
- **ListadoFiltrado**: Resultado de aplicar uno o varios filtros sobre el listado de asientos o pagos.
- **ResultadoVacio**: Estado que informa que ningún registro cumple la combinación de filtros aplicada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los asientos que cumplen los filtros aplicados aparece en el listado filtrado.
- **SC-002**: El 100% de los pagos y cobros que cumplen los filtros aplicados aparece en el listado filtrado.
- **SC-003**: El 100% de los registros que no cumplen los filtros queda excluido del listado filtrado.
- **SC-004**: El 100% de las combinaciones de filtros respeta coincidencia simultánea de todos los criterios aplicados.
- **SC-005**: El 100% de los rangos de fecha y monto incluye sus valores límite.
- **SC-006**: El 100% de las opciones de estado corresponde a los estados válidos del tipo de registro.
- **SC-007**: El 100% de las acciones de limpiar filtros restaura el listado completo permitido para el rol.
- **SC-008**: El 100% de las entradas inválidas de fecha o monto muestra un mensaje claro y no altera el listado.
- **SC-009**: El 100% de los roles ve filtros solo en los listados a los que tiene acceso.
- **SC-010**: No se crea ninguna opción de menú ni pantalla de búsqueda global derivada de los filtros.
- **SC-011**: El 95% de los usuarios localiza un asiento o pago específico usando filtros en menos de 15 segundos.
- **SC-012**: Al menos el 90% de los usuarios encuestados indica que los filtros le ayudan a revisar movimientos con mayor rapidez.

## Assumptions

- Los usuarios con acceso a asientos pueden usar los filtros en el listado de asientos.
- Los usuarios con acceso a pagos y cobros pueden usar los filtros en ese listado.
- Los roles sin acceso a un listado no ven sus filtros.
- El filtro de fecha de asientos se aplica a la fecha contable.
- El filtro de fecha de pagos y cobros se aplica a la fecha del movimiento, no a la fecha de vencimiento.
- El filtro de cuenta en asientos busca coincidencias en las líneas del asiento.
- El filtro de cuenta en pagos y cobros busca coincidencias a través del asiento relacionado.
- Los pagos sin asiento relacionado no coinciden cuando se filtra por una cuenta específica.
- El filtro de monto se expresa como un rango en MXN con límites inclusivos.
- Los estados disponibles son borrador, aprobado y cancelado para asientos, y pendiente, pagado, vencido y anulado para pagos y cobros.
- "Todos" es la selección inicial del filtro de estado y significa ausencia de filtro.
- Los filtros son locales a cada listado y no constituyen una pantalla global de búsqueda.
- El filtro de estado de pagos y cobros sustituye al control de estado existente para evitar duplicidad.
- Los filtros no modifican registros financieros ni el estado del módulo.
- Los datos de ejemplo deterministas permiten probar los filtros de forma repetible.
