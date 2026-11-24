# Feature Specification: Reportes financieros por periodo

**Feature Branch**: `004-reportes-financieros-periodo`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Contador, quiero generar Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General por periodo, para conocer la situación financiera de la empresa."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generar el Libro Mayor por periodo (Priority: P1)

Como Contador, quiero generar el Libro Mayor de un periodo contable, para revisar el detalle de movimientos y saldos de cada cuenta contable en ese intervalo.

**Why this priority**: El Libro Mayor es la base de trazabilidad de los demás estados financieros, porque permite seguir cada importe desde el asiento contable de origen hasta el saldo de la cuenta.

**Independent Test**: Se selecciona un periodo con asientos aprobados, se genera el Libro Mayor y se verifica que cada cuenta muestre saldo inicial, débitos, créditos y saldo final coherentes con los movimientos de ese periodo.

**Acceptance Scenarios**:

1. **Given** que existen asientos contables aprobados en un periodo, **When** el Contador selecciona ese periodo y genera el Libro Mayor, **Then** el reporte muestra para cada cuenta con movimientos su código, nombre, saldo inicial, total de débitos, total de créditos y saldo final.
2. **Given** que existen movimientos aprobados en periodos anteriores, **When** se genera el Libro Mayor de un periodo posterior, **Then** el saldo inicial de cada cuenta se deriva de los movimientos aprobados anteriores a ese periodo.
3. **Given** que un periodo está cerrado, **When** el Contador genera el Libro Mayor de ese periodo, **Then** el reporte muestra los movimientos aprobados correspondientes sin permitir modificarlos.
4. **Given** que un periodo no tiene asientos aprobados ni saldos iniciales, **When** se genera el Libro Mayor, **Then** se muestra un mensaje de estado vacío en español.
5. **Given** que el Contador cambia el periodo seleccionado, **When** solicita nuevamente el Libro Mayor, **Then** la información del reporte se actualiza por completo para el nuevo periodo.
6. **Given** que existen asientos en borrador o cancelado dentro del periodo, **When** se genera el Libro Mayor, **Then** esos movimientos se excluyen del reporte.

---

### User Story 2 - Generar el Balance de Comprobación por periodo (Priority: P1)

Como Contador, quiero generar el Balance de Comprobación de un periodo, para verificar que los saldos deudores y acreedores de las cuentas mantengan la igualdad contable.

**Why this priority**: Este reporte detecta de forma temprana inconsistencias en los saldos y constituye una comprobación indispensable antes de preparar estados financieros formales.

**Independent Test**: Se genera el Balance de Comprobación de un periodo con movimientos aprobados y se comprueba que la suma de saldos deudores sea igual a la suma de saldos acreedores y que cada saldo coincida con el Libro Mayor.

**Acceptance Scenarios**:

1. **Given** que existen cuentas con saldo al cierre de un periodo, **When** el Contador genera el Balance de Comprobación, **Then** el reporte lista esas cuentas con su código, nombre, saldo deudor o saldo acreedor según corresponda.
2. **Given** que el Balance de Comprobación está visible, **When** se revisan los totales, **Then** la suma de saldos deudores es igual a la suma de saldos acreedores.
3. **Given** que una cuenta tiene saldo cero al cierre del periodo, **When** se genera el reporte, **Then** esa cuenta no se incluye en el listado de saldos.
4. **Given** que un periodo no tiene cuentas con saldo, **When** se genera el Balance de Comprobación, **Then** se muestra un mensaje de estado vacío en español.
5. **Given** que los totales del reporte no coinciden con la igualdad contable, **When** se genera el Balance de Comprobación, **Then** se muestra una advertencia clara y el reporte no se presenta como válido.

---

### User Story 3 - Generar el Estado de Resultados por periodo (Priority: P1)

Como Contador, quiero generar el Estado de Resultados de un periodo, para conocer los ingresos, los gastos y el resultado financiero obtenido en ese intervalo.

**Why this priority**: Resume la desempeño financiero del periodo y responde directamente a la necesidad del usuario de conocer la situación de la empresa.

**Independent Test**: Se genera el Estado de Resultados de un periodo con movimientos de ingresos y gastos y se verifica que el resultado mostrado sea igual a los ingresos menos los gastos, derivado de los asientos aprobados.

**Acceptance Scenarios**:

1. **Given** que existen asientos aprobados con cuentas de ingreso y gasto en un periodo, **When** el Contador genera el Estado de Resultados, **Then** el reporte muestra los ingresos del periodo, los gastos del periodo y el resultado financiero.
2. **Given** que el reporte está visible, **When** se revisa el resultado, **Then** este es igual a la suma de ingresos menos la suma de gastos del periodo seleccionado.
3. **Given** que una cuenta de ingreso o gasto no tuvo movimientos aprobados en el periodo, **When** se genera el reporte, **Then** esa cuenta no se muestra dentro del detalle.
4. **Given** que el periodo seleccionado no tiene movimientos aprobados de ingresos ni gastos, **When** se genera el Estado de Resultados, **Then** se muestra un mensaje de estado vacío en español.
5. **Given** que el Contador cambia el periodo, **When** genera nuevamente el Estado de Resultados, **Then** los importes de ingresos, gastos y resultado corresponden al nuevo periodo.
6. **Given** que existe una cuenta sin tipo clasificable como ingreso o gasto, **When** se genera el Estado de Resultados, **Then** se muestra una advertencia que identifica la cuenta que impide completar el reporte.

---

### User Story 4 - Generar el Balance General por periodo (Priority: P1)

Como Contador, quiero generar el Balance General de un periodo, para conocer la estructura de activos, pasivos y patrimonio de la empresa al cierre de ese periodo.

**Why this priority**: Complementa el Estado de Resultados al mostrar la posición financiera acumulada hasta la fecha de cierre, permitiendo evaluar la solidez de la empresa.

**Independent Test**: Se genera el Balance General de un periodo con saldos aprobados y se verifica que el total de activos sea igual al total de pasivos más patrimonio, incluyendo el resultado acumulado en el patrimonio.

**Acceptance Scenarios**:

1. **Given** que existen saldos aprobados de cuentas de activo, pasivo y patrimonio al cierre de un periodo, **When** el Contador genera el Balance General, **Then** el reporte muestra los activos, los pasivos y el patrimonio con sus totales correspondientes.
2. **Given** que el Balance General está visible, **When** se revisan los totales, **Then** el total de activos es igual a la suma del total de pasivos y el total de patrimonio.
3. **Given** que el resultado del periodo forma parte del patrimonio, **When** se genera el reporte, **Then** el patrimonio mostrado incluye ese resultado para conservar la igualdad contable.
4. **Given** que una cuenta no tiene saldo al cierre del periodo, **When** se genera el Balance General, **Then** esa cuenta no se incluye en el detalle.
5. **Given** que no existen saldos de activo, pasivo ni patrimonio al cierre del periodo, **When** se genera el Balance General, **Then** se muestra un mensaje de estado vacío en español.
6. **Given** que existe una cuenta sin tipo clasificable como activo, pasivo o patrimonio, **When** se genera el Balance General, **Then** se muestra una advertencia que identifica la cuenta que impide completar el reporte.
7. **Given** que el Contador genera los cuatro reportes para el mismo periodo, **When** compara sus cifras, **Then** los saldos y totales son coherentes entre el Libro Mayor, el Balance de Comprobación, el Estado de Resultados y el Balance General.

---

### User Story 5 - Consultar los reportes desde la sección existente (Priority: P2)

Como usuario con acceso a Reportes financieros, quiero encontrar los cuatro reportes en esa sección sin nuevas entradas de menú, para mantener una navegación única y coherente con el módulo.

**Why this priority**: La experiencia de navegación ya definida exige un solo acceso por pantalla; incorporar los reportes dentro de "Reportes financieros" evita duplicar controles o crear secciones ajenas al módulo.

**Independent Test**: Se revisa el menú lateral de los roles con acceso a Reportes financieros y se confirma que no aparece una opción adicional para estos reportes y que solo el Controlador puede generarlos.

**Acceptance Scenarios**:

1. **Given** que el Contador abre "Reportes financieros", **When** revisa las opciones disponibles, **Then** encuentra la generación de Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General para el periodo seleccionado.
2. **Given** que se revisa el menú lateral, **When** se comparan sus entradas con la configuración vigente, **Then** no se crea ninguna opción nueva para estos reportes.
3. **Given** que el Administrador financiero o el Auditor abre "Reportes financieros", **When** consulta los reportes, **Then** puede verlos sin acciones de creación, edición, eliminación ni cambio de estado.
4. **Given** que un rol sin acceso a "Reportes financieros" intenta abrir estos reportes directamente, **When** realiza la acción, **Then** se muestra un mensaje de acceso no disponible y no se revela información financiera.
5. **Given** que el Contador tiene un reporte abierto, **When** revisa las acciones disponibles, **Then** no encuentra opciones para capturar cifras manualmente ni para modificar movimientos contables.
6. **Given** que un reporte está visible, **When** se revisan sus importes, **Then** se muestran en MXN con el mismo formato utilizado en el resto del módulo.

### Edge Cases

- ¿Qué ocurre cuando el periodo seleccionado no tiene asientos aprobados?
- ¿Qué ocurre cuando el periodo seleccionado está cerrado?
- ¿Qué ocurre cuando existen asientos en borrador o cancelado dentro del periodo?
- ¿Qué ocurre cuando se cambia de periodo mientras un reporte está abierto?
- ¿Qué ocurre cuando una cuenta no tiene un tipo que permita clasificarla como activo, pasivo, patrimonio, ingreso o gasto?
- ¿Qué ocurre cuando los totales de un reporte no cumplen la igualdad contable esperada?
- ¿Qué ocurre cuando una cuenta tiene saldo inicial pero no movimientos en el periodo?
- ¿Qué ocurre cuando el Libro Mayor muestra cuentas con saldo cero?
- ¿Qué ocurre cuando se generan los cuatro reportes para periodos distintos durante la misma sesión de consulta?
- ¿Qué ocurre cuando un usuario sin acceso a Reportes financieros intenta abrir un reporte directamente?
- ¿Qué ocurre cuando no existe ningún periodo contable registrado?
- ¿Qué ocurre cuando los importes se muestran en una moneda distinta de MXN?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir al Contador seleccionar un periodo contable para generar reportes financieros.
- **FR-002**: El sistema DEBE permitir generar el Libro Mayor para el periodo seleccionado.
- **FR-003**: El Libro Mayor DEBE mostrar, por cada cuenta con movimientos aprobados en el periodo, código, nombre, saldo inicial, débitos, créditos y saldo final.
- **FR-004**: El saldo inicial del Libro Mayor DEBE derivarse de los movimientos aprobados de periodos anteriores al seleccionado.
- **FR-005**: El Libro Mayor DEBE presentar únicamente movimientos de asientos contables aprobados.
- **FR-006**: El sistema DEBE permitir generar el Balance de Comprobación para el periodo seleccionado.
- **FR-007**: El Balance de Comprobación DEBE listar las cuentas con saldo distinto de cero al cierre del periodo, indicando su saldo deudor o acreedor.
- **FR-008**: El Balance de Comprobación DEBE mostrar el total de saldos deudores y el total de saldos acreedores.
- **FR-009**: El sistema DEBE advertir claramente cuando los totales deudores y acreedores del Balance de Comprobación no sean iguales.
- **FR-010**: El sistema DEBE permitir generar el Estado de Resultados para el periodo seleccionado.
- **FR-011**: El Estado de Resultados DEBE mostrar los ingresos, los gastos y el resultado financiero del periodo derivados de asientos aprobados.
- **FR-012**: El resultado financiero del Estado de Resultados DEBE calcularse como ingresos menos gastos del periodo seleccionado.
- **FR-013**: El sistema DEBE permitir generar el Balance General para el periodo seleccionado.
- **FR-014**: El Balance General DEBE mostrar activos, pasivos y patrimonio al cierre del periodo con sus totales correspondientes.
- **FR-015**: El patrimonio del Balance General DEBE incluir el resultado acumulado hasta la fecha de cierre del periodo.
- **FR-016**: El sistema DEBE advertir claramente cuando el total de activos no sea igual a la suma de pasivos y patrimonio.
- **FR-017**: Los cuatro reportes DEBEN actualizarse cuando el usuario seleccione un periodo diferente.
- **FR-018**: Los reportes DEBEN mostrar mensajes de estado vacío en español cuando no existan movimientos o saldos para el periodo seleccionado.
- **FR-019**: Todos los importes de los reportes DEBEN mostrarse en MXN con el mismo formato utilizado en el resto del módulo.
- **FR-020**: Los reportes DEBEN derivarse de los registros contables existentes y NO DEBEN permitir la captura manual de cifras.
- **FR-021**: Los reportes DEBEN poder generarse para periodos abiertos y cerrados sin modificar el estado del periodo.
- **FR-022**: Los reportes DEBEN ser de solo consulta para todos los roles que puedan verlos.
- **FR-023**: Los reportes NO DEBEN crear una nueva opción en el menú lateral ni duplicar el acceso a la sección "Reportes financieros".
- **FR-024**: Solo los roles con acceso a "Reportes financieros" según la matriz vigente DEBEN poder consultar estos reportes.
- **FR-025**: El sistema DEBE mostrar un mensaje de acceso no disponible y no revelar información cuando un rol sin permiso intente abrir los reportes directamente.
- **FR-026**: Cuando existan cuentas sin un tipo clasificable, el sistema DEBE indicar qué cuentas impiden generar el Estado de Resultados o el Balance General.

### Key Entities *(include if feature involves data)*

- **PeriodoContable**: Intervalo de tiempo seleccionado para generar los reportes; determina qué movimientos y saldos se incluyen.
- **AsientoContableAprobado**: Registro contable válido que sirve de origen para los importes de los reportes.
- **LineaAsiento**: Detalle de un asiento que asocia una cuenta contable con un débito o un crédito.
- **CuentaContable**: Cuenta del plan contable identificada por código, nombre y tipo, que permite clasificar saldos como activo, pasivo, patrimonio, ingreso o gasto.
- **SaldoContable**: Resultado de agregar los movimientos aprobados de una cuenta hasta una fecha determinada.
- **ReporteFinanciero**: Salida de consulta por periodo que puede ser Libro Mayor, Balance de Comprobación, Estado de Resultados o Balance General.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los cuatro reportes puede generarse para cualquier periodo que tenga al menos un asiento contable aprobado.
- **SC-002**: El 100% de los importes mostrados en los reportes coincide con los movimientos aprobados de origen correspondientes al periodo seleccionado.
- **SC-003**: El 100% de los balances de comprobación generados cumple la igualdad entre totales deudores y acreedores cuando los datos son válidos.
- **SC-004**: El 100% de los balances generales generados cumple la igualdad entre activos y pasivos más patrimonio cuando los datos son válidos.
- **SC-005**: El 100% de los estados de resultados generados muestra un resultado igual a ingresos menos gastos del periodo.
- **SC-006**: El 95% de los Contadores puede generar los cuatro reportes para un mismo periodo en menos de 2 minutos durante una prueba de uso.
- **SC-007**: El usuario ve cada reporte en menos de 5 segundos después de seleccionar el periodo y solicitarlo.
- **SC-008**: El 100% de los periodos sin movimientos ni saldos muestra un mensaje de estado vacío en los cuatro reportes.
- **SC-009**: El 100% de los roles sin acceso a Reportes financieros no puede consultar los reportes ni ver sus cifras.
- **SC-010**: Al menos el 90% de los Contadores encuestados indica que los cuatro reportes le permiten comprender la situación financiera de la empresa sin consultar otras secciones.

## Assumptions

- La especificación 002-contabilidad-finanzas define el plan de cuentas, los asientos contables y los periodos contables; esta funcionalidad se incorpora como una nueva historia de usuario dentro de esa especificación.
- Los reportes se incorporan dentro de la sección existente "Reportes financieros", sin crear una nueva opción de menú ni una pantalla duplicada.
- El Contador es el actor principal que solicita los reportes; el Administrador financiero y el Auditor pueden consultarlos porque ya tienen acceso a "Reportes financieros", pero sin acciones de modificación.
- Solo los asientos contables aprobados se consideran válidos para generar reportes; los asientos en borrador o cancelado se excluyen.
- Los periodos cerrados pueden consultarse con fines históricos y su estado no cambia al generar reportes.
- El tipo de cuenta contable permite clasificar cada cuenta como activo, pasivo, patrimonio, ingreso o gasto para los reportes que lo requieren.
- El saldo inicial de una cuenta se obtiene de los movimientos aprobados de periodos anteriores al periodo consultado; si no existen, el saldo inicial es cero.
- El Balance de Comprobación incluye cuentas con saldo distinto de cero al cierre del periodo.
- El Estado de Resultados incluye cuentas de ingreso y gasto con movimientos aprobados en el periodo.
- El Balance General incluye cuentas de activo, pasivo y patrimonio con saldo distinto de cero al cierre del periodo.
- El resultado acumulado se presenta dentro del patrimonio del Balance General para conservar la igualdad contable.
- Todas las cifras se expresan en MXN y se presentan con un formato consistente con el resto del módulo.
- Los reportes son de solo consulta y no permiten crear, editar, eliminar ni cambiar estados de movimientos contables.
- Si existen datos inconsistentes que impiden validar una igualdad contable, el sistema muestra una advertencia clara en español en lugar de presentar el reporte como válido.
