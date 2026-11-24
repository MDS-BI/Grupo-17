# Feature Specification: Alertas de vencimientos de pagos en el panel

**Feature Branch**: `008-alertas-pagos-vencimientos`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Tesorero, quiero ver en el panel alertas de pagos vencidos y de pagos que vencen esta semana."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver alerta de pagos vencidos (Priority: P1)

Como Tesorero, quiero ver en mi panel una alerta de pagos vencidos, para priorizar la cobranza o regularización de los movimientos que ya superaron su fecha de vencimiento.

**Why this priority**: Los pagos vencidos representan un riesgo financiero inmediato; mostrarlos al iniciar sesión permite actuar sin buscar en otros listados.

**Independent Test**: Se inicia sesión como Tesorero con pagos vencidos en los datos de ejemplo y se verifica que el panel muestre la alerta con cantidad y total.

**Acceptance Scenarios**:

1. **Dado** que existen pagos pendientes con fecha de vencimiento anterior a la fecha de referencia, **Cuando** inicia sesión el Tesorero, **Entonces** su panel muestra una alerta de pagos vencidos con la cantidad de movimientos y el total en MXN.
2. **Dado** que la alerta de pagos vencidos está visible, **Cuando** el Tesorero revisa su detalle, **Entonces** puede identificar para cada pago la entidad, el monto y la fecha de vencimiento.
3. **Dado** que existen más pagos vencidos de los que caben en el detalle, **Cuando** se revisa la alerta, **Entonces** se muestra una indicación clara de cuántos pagos adicionales existen.
4. **Dado** que no existen pagos vencidos, **Cuando** inicia sesión el Tesorero, **Entonces** la alerta no se muestra o se presenta como estado sin alertas, sin cifras engañosas.
5. **Dado** que un pago vencido se marca como pagado, **Cuando** se actualiza el panel, **Entonces** el pago deja de contarse en la alerta de vencidos.
6. **Dado** que un pago vencido se anula, **Cuando** se actualiza el panel, **Entonces** el pago deja de contarse en la alerta de vencidos y se conserva su registro para auditoría.

---

### User Story 2 - Ver alerta de pagos que vencen esta semana (Priority: P1)

Como Tesorero, quiero ver en mi panel una alerta de pagos que vencen esta semana, para anticiparme a los compromisos financieros próximos.

**Why this priority**: La visibilidad de los vencimientos próximos permite planificar la tesorería con anticipación y evitar nuevos atrasos.

**Independent Test**: Se inicia sesión como Tesorero con pagos pendientes cuya fecha de vencimiento cae entre la fecha de referencia y el domingo de la semana actual, y se verifica que el panel muestre la alerta correspondiente.

**Acceptance Scenarios**:

1. **Dado** que existen pagos pendientes que vencen entre la fecha de referencia y el domingo de la semana actual, **Cuando** inicia sesión el Tesorero, **Entonces** su panel muestra una alerta de pagos que vencen esta semana con cantidad y total en MXN.
2. **Dado** que la alerta de vencimientos de la semana está visible, **Cuando** el Tesorero revisa su detalle, **Entonces** puede identificar para cada pago la entidad, el monto y la fecha de vencimiento.
3. **Dado** que un pago vence el domingo de la semana actual, **Cuando** se consulta el panel, **Entonces** el pago se incluye en la alerta semanal.
4. **Dado** que un pago vence el lunes de la semana siguiente, **Cuando** se consulta el panel, **Entonces** el pago no se incluye en la alerta semanal.
5. **Dado** que no existen pagos que vencan en la semana actual, **Cuando** inicia sesión el Tesorero, **Entonces** se muestra un estado sin alertas o la alerta se oculta sin cifras engañosas.
6. **Dado** que un pago de la semana se marca como pagado, **Cuando** se actualiza el panel, **Entonces** el pago deja de contarse en la alerta semanal.

---

### User Story 3 - Mantener alertas claras, coherentes y restringidas (Priority: P1)

Como Tesorero, quiero que las alertas del panel sean coherentes con la información de "Pagos y cobros" y que solo aparezcan en mi panel, para confiar en ellas sin duplicar la navegación del módulo.

**Why this priority**: Evita contradicciones entre el panel y el listado, y respeta la regla de una sola navegación visible por sección.

**Independent Test**: Se comparan las cifras del panel con el listado filtrado de pagos, se cambia el estado de un pago y se verifica que las alertas se actualicen; luego se inicia sesión con otros roles y se comprueba que no vean las alertas.

**Acceptance Scenarios**:

1. **Dado** que el Tesorero ve alertas en el panel, **Cuando** compara los importes con la información de "Pagos y cobros", **Entonces** las cantidades y totales coinciden con los pagos que cumplen cada condición.
2. **Dado** que se registra un nuevo pago con vencimiento en la semana actual, **Cuando** se actualiza el panel, **Entonces** la alerta semanal incluye el nuevo movimiento.
3. **Dado** que se cambia la fecha de vencimiento de un pago, **Cuando** se actualiza el panel, **Entonces** el pago se reclasifica entre vencido, próximo a vencer o fuera de alerta según corresponda.
4. **Dado** que un pago está pagado o anulado, **Cuando** se consultan las alertas, **Entonces** el pago se excluye de ambas alertas.
5. **Dado** que se revisa el menú lateral, **Cuando** se comparan sus opciones con el panel, **Entonces** las alertas no crean una nueva opción de menú ni un acceso duplicado a "Pagos y cobros".
6. **Dado** que inicia sesión un rol distinto del Tesorero, **Cuando** revisa su panel, **Entonces** no ve las alertas de vencimientos de pagos.
7. **Dado** que el Tesorero intenta usar una alerta como acceso directo, **Cuando** revisa el panel, **Entonces** las alertas son informativas y no abren una pantalla duplicada.

---

### User Story 4 - Usar datos de ejemplo deterministas para las alertas (Priority: P2)

Como Tesorero, quiero que las alertas se basen en datos de ejemplo deterministas, para probar y demostrar el panel siempre con el mismo resultado.

**Why this priority**: La demostración financiera debe ser repetible y no depender de fechas o importes arbitrarios.

**Independent Test**: Se cargan datos de ejemplo dos veces con la misma fecha de referencia, se consulta el panel del Tesorero y se comparan las alertas resultantes.

**Acceptance Scenarios**:

1. **Dado** que se cargan datos de ejemplo, **Cuando** el Tesorero consulta su panel, **Entonces** existen pagos de ejemplo que permiten ver al menos una alerta de vencidos o una alerta de vencimientos semanales.
2. **Dado** que se cargan datos de ejemplo dos veces con la misma fecha de referencia, **Cuando** se comparan las alertas, **Entonces** cantidades, totales y montos son idénticos.
3. **Dado** que se restablecen datos, **Cuando** el Tesorero consulta su panel, **Entonces** las alertas vuelven a su estado inicial coherente con la semilla.
4. **Dado** que la semilla no contiene pagos que cumplan una de las condiciones, **Cuando** se consulta el panel, **Entonces** se muestra el estado sin alertas correspondiente.

### Edge Cases

- ¿Qué ocurre cuando no existen pagos pendientes?
- ¿Qué ocurre cuando todos los pagos están pagados o anulados?
- ¿Qué ocurre cuando un pago vence exactamente en la fecha de referencia?
- ¿Qué ocurre cuando un pago vence el domingo de la semana actual?
- ¿Qué ocurre cuando un pago vence el lunes de la semana siguiente?
- ¿Qué ocurre cuando un pago vencido también tiene fecha dentro de la semana actual?
- ¿Qué ocurre cuando se cambia la fecha de vencimiento de un pago ya vencido a la semana siguiente?
- ¿Qué ocurre cuando un pago se anula después de aparecer en una alerta?
- ¿Qué ocurre cuando se restablecen datos mientras el panel del Tesorero está abierto?
- ¿Qué ocurre cuando hay más pagos de alerta de los que se muestran en el detalle?
- ¿Qué ocurre cuando un pago tiene un monto inválido en los datos de ejemplo?
- ¿Qué ocurre cuando un rol distinto del Tesorero intenta acceder a las alertas directamente?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El panel del Tesorero DEBE mostrar una alerta de pagos vencidos cuando existan pagos pendientes cuya fecha de vencimiento sea anterior a la fecha de referencia.
- **FR-002**: El panel del Tesorero DEBE mostrar una alerta de pagos que vencen esta semana cuando existan pagos pendientes cuya fecha de vencimiento esté entre la fecha de referencia y el domingo de la semana actual, inclusive.
- **FR-003**: Cada alerta DEBE mostrar la cantidad de pagos que cumplen la condición.
- **FR-004**: Cada alerta DEBE mostrar el total en MXN de los pagos que cumplen la condición, usando el mismo criterio de cálculo que el módulo.
- **FR-005**: Cada alerta DEBE permitir identificar la entidad, el monto y la fecha de vencimiento de los pagos incluidos.
- **FR-006**: Cuando existan más pagos de los que se muestran en el detalle, la alerta DEBE indicar cuántos pagos adicionales existen.
- **FR-007**: Los pagos pagados DEBEN excluirse de ambas alertas.
- **FR-008**: Los pagos anulados DEBEN excluirse de ambas alertas.
- **FR-009**: Las categorías de alerta DEBEN ser mutuamente excluyentes: un pago vencido se muestra solo en la alerta de vencidos, y un pago que vence en la semana actual se muestra solo en la alerta semanal.
- **FR-010**: Un pago con fecha de vencimiento posterior al domingo de la semana actual NO DEBE incluirse en ninguna alerta.
- **FR-011**: Las alertas DEBEN actualizarse cuando se registre, edite, marque como pagado o anule un pago.
- **FR-012**: Las alertas DEBEN actualizarse cuando se cambie la fecha de vencimiento de un pago.
- **FR-013**: Cuando no existan pagos que cumplan una condición, el panel DEBE mostrar un estado sin alertas claro o bien ocultar esa alerta sin mostrar cifras engañosas.
- **FR-014**: Las alertas DEBEN mostrarse únicamente en el panel del Tesorero.
- **FR-015**: Las alertas NO DEBEN crear una nueva opción en el menú lateral.
- **FR-016**: Las alertas NO DEBEN funcionar como acceso directo duplicado a la sección "Pagos y cobros".
- **FR-017**: Las alertas DEBEN ser coherentes con la información mostrada en la sección "Pagos y cobros" para las mismas condiciones.
- **FR-018**: La semana actual DEBE considerarse de lunes a domingo, usando la fecha de referencia definida para el panel.
- **FR-019**: Los importes de las alertas DEBEN expresarse en MXN y usar el formato consistente del módulo.
- **FR-020**: Las fechas de vencimiento de las alertas DEBEN mostrarse con el formato consistente del módulo.
- **FR-021**: Los datos de ejemplo DEBEN incluir pagos que permitan demostrar las alertas de forma determinista.
- **FR-022**: Cargar datos de ejemplo dos veces con la misma fecha de referencia DEBE producir alertas idénticas.
- **FR-023**: El restablecimiento de datos DEBE dejar las alertas en su estado inicial coherente con la semilla.
- **FR-024**: El sistema DEBE bloquear la visualización de las alertas para roles distintos del Tesorero.

### Key Entities *(include if feature involves data)*

- **AlertaPago**: Aviso del panel del Tesorero que resume un conjunto de pagos con una condición de vencimiento específica.
- **ResumenAlerta**: Cantidad de pagos y total en MXN asociados a una alerta.
- **Pago**: Movimiento de pago o cobro cuya fecha de vencimiento y estado determinan su inclusión en las alertas.
- **PanelTesorero**: Vista inicial del Tesorero donde se muestran las alertas de vencimientos.
- **SemanaReferencia**: Intervalo de lunes a domingo usado para determinar qué pagos vencen esta semana.
- **EntidadPago**: Cliente, proveedor u otra entidad asociada al pago, utilizada para identificar cada movimiento dentro de la alerta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los pagos pendientes vencidos se refleja en la alerta de vencidos con cantidad y total correctos.
- **SC-002**: El 100% de los pagos pendientes que vencen en la semana actual se refleja en la alerta semanal con cantidad y total correctos.
- **SC-003**: El 100% de los pagos pagados o anulados se excluye de ambas alertas.
- **SC-004**: El 100% de las alertas muestra importes en MXN y fechas con el formato consistente del módulo.
- **SC-005**: El 100% de los cambios de estado o fecha de vencimiento se refleja en las alertas después de actualizar el panel.
- **SC-006**: El 100% de los roles distintos del Tesorero no ve las alertas en su panel.
- **SC-007**: El 100% de las pruebas con datos de ejemplo produce alertas idénticas para la misma fecha de referencia.
- **SC-008**: El 100% de los restablecimientos deja las alertas coherentes con la semilla inicial.
- **SC-009**: El Tesorero identifica los pagos vencidos y de la semana actual en menos de 10 segundos desde su panel en el 95% de las pruebas.
- **SC-010**: Al menos el 90% de los Tesoreros encuestados indica que las alertas del panel le ayudan a priorizar los vencimientos.
- **SC-011**: El 100% de las alertas coincide con la información de "Pagos y cobros" al aplicar las mismas condiciones.
- **SC-012**: No se introduce ninguna opción de menú adicional ni acceso duplicado derivado de las alertas.

## Assumptions

- El Tesorero es el único rol que ve estas alertas en su panel de inicio.
- Las alertas son informativas; no crean una nueva opción de menú ni un acceso directo duplicado a "Pagos y cobros".
- Un pago vencido es un pago pendiente cuya fecha de vencimiento es anterior a la fecha de referencia.
- Un pago que vence esta semana es un pago pendiente cuya fecha de vencimiento cae entre la fecha de referencia y el domingo de la semana actual, inclusive.
- La semana se entiende de lunes a domingo.
- Las dos categorías son mutuamente excluyentes para evitar duplicar un mismo pago en ambas alertas.
- Los pagos pagados y los pagos anulados se excluyen de ambas alertas.
- La fecha de referencia es la fecha definida para la demostración del panel; con la misma fecha de referencia, las alertas deben ser deterministas.
- Los importes se muestran en MXN con el mismo formato y criterio de cálculo que el resto del módulo.
- El detalle de cada alerta muestra una cantidad limitada de pagos e indica cuándo existen más, sin sustituir a la sección "Pagos y cobros".
- Los datos de ejemplo incluyen pagos suficientes para demostrar ambas alertas o sus estados vacíos de forma repetible.
- El restablecimiento de datos devuelve las alertas a su estado inicial coherente con la semilla.
- El panel conserva la regla de navegación única: las alertas no cuentan como accesos a pantallas.
