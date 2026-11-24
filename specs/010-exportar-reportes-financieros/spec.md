# Feature Specification: Exportación de reportes financieros

**Feature Branch**: `010-exportar-reportes-financieros`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Contador, quiero que cada reporte financiero tenga dos botones, \"Exportar PDF\" y \"Exportar Excel\", que descarguen el reporte del periodo seleccionado con el nombre de la empresa, la fecha y los totales."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exportar un reporte financiero a PDF (Priority: P1)

Como Contador, quiero usar el botón "Exportar PDF" en cada reporte financiero, para obtener una versión descargable del reporte del periodo seleccionado y compartirla como documento formal.

**Why this priority**: El PDF es una salida legible y estable para presentar el reporte a terceros o archivarlo.

**Independent Test**: Se abre cada reporte financiero para un periodo válido, se selecciona "Exportar PDF" y se verifica que se obtenga un archivo con la identidad de la empresa, la fecha y los totales.

**Acceptance Scenarios**:

1. **Dado** que un reporte financiero está visible para un periodo seleccionado, **Cuando** el Contador selecciona "Exportar PDF", **Entonces** se obtiene un archivo descargable en formato PDF con el contenido del reporte.
2. **Dado** que el reporte exportado está disponible, **Cuando** se revisa su encabezado, **Entonces** aparece el nombre exacto "Comercial Los Andes SpA".
3. **Dado** que el reporte exportado está disponible, **Cuando** se revisa la fecha, **Entonces** aparece el periodo seleccionado y la fecha de generación.
4. **Dado** que el reporte exportado está disponible, **Cuando** se revisan los totales, **Entonces** aparecen los totales aplicables al tipo de reporte.
5. **Dado** que se exporta el mismo reporte dos veces para el mismo periodo, **Cuando** se comparan ambos archivos, **Entonces** las cifras y la información principal coinciden.

---

### User Story 2 - Exportar un reporte financiero a Excel (Priority: P1)

Como Contador, quiero usar el botón "Exportar Excel" en cada reporte financiero, para obtener una versión descargable que pueda revisarse y analizarse posteriormente.

**Why this priority**: Excel facilita el análisis posterior y la revisión de las cifras exportadas sin alterar el módulo.

**Independent Test**: Se abre cada reporte financiero para un periodo válido, se selecciona "Exportar Excel" y se verifica que se obtenga un archivo descargable con la identidad de la empresa, la fecha y los totales.

**Acceptance Scenarios**:

1. **Dado** que un reporte financiero está visible para un periodo seleccionado, **Cuando** el Contador selecciona "Exportar Excel", **Entonces** se obtiene un archivo descargable en formato Excel con el contenido del reporte.
2. **Dado** que el archivo de Excel está disponible, **Cuando** se revisa su contenido, **Entonces** aparece el nombre exacto "Comercial Los Andes SpA".
3. **Dado** que el archivo de Excel está disponible, **Cuando** se revisa la fecha, **Entonces** aparece el periodo seleccionado y la fecha de generación.
4. **Dado** que el archivo de Excel está disponible, **Cuando** se revisan los totales, **Entonces** aparecen los totales aplicables al tipo de reporte.
5. **Dado** que se exportan PDF y Excel del mismo reporte, **Cuando** se comparan ambos archivos, **Entonces** las cifras y los totales coinciden con el reporte mostrado en pantalla.

---

### User Story 3 - Mantener coherencia entre el reporte en pantalla y el archivo exportado (Priority: P1)

Como Contador, quiero que los archivos exportados reflejen exactamente el reporte del periodo seleccionado, para confiar en que la información descargada es la misma que revisé en el módulo.

**Why this priority**: Una exportación inconsistente puede generar reportes financieros incorrectos fuera del módulo.

**Independent Test**: Se generan ambos formatos para cada reporte y se comparan los totales y las cifras con la vista en pantalla.

**Acceptance Scenarios**:

1. **Dado** que un reporte muestra cifras para un periodo, **Cuando** se exporta en cualquiera de los dos formatos, **Entonces** el archivo contiene las mismas cifras y totales visibles en pantalla.
2. **Dado** que se cambia el periodo seleccionado, **Cuando** se exporta el reporte, **Entonces** el archivo corresponde al nuevo periodo.
3. **Dado** que un reporte incluye totales por cuenta o por categoría, **Cuando** se exporta, **Entonces** esos totales se conservan en el archivo.
4. **Dado** que un reporte no tiene movimientos pero es válido, **Cuando** se exporta, **Entonces** el archivo incluye la identidad de la empresa, la fecha, los totales en cero y una indicación de que no hay movimientos.
5. **Dado** que existen datos inconsistentes que impiden validar el reporte, **Cuando** el Contador intenta exportarlo, **Entonces** la exportación se bloquea y se muestra la advertencia correspondiente.
6. **Dado** que se exporta un reporte, **Cuando** se revisa el módulo, **Entonces** no se modifican cuentas, asientos, pagos ni periodos.

---

### User Story 4 - Mostrar los botones de exportación de forma clara y restringida (Priority: P2)

Como Contador, quiero encontrar los botones "Exportar PDF" y "Exportar Excel" en cada reporte financiero, para saber que puedo descargar el resultado sin buscar opciones adicionales.

**Why this priority**: La ubicación y etiquetas claras reducen errores y evitan crear navegación duplicada.

**Independent Test**: Se revisa cada reporte financiero y se comprueba que ambos botones aparezcan con sus etiquetas exactas, sin nuevas opciones de menú.

**Acceptance Scenarios**:

1. **Dado** que se abre cualquiera de los reportes financieros definidos, **Cuando** se revisan sus acciones, **Entonces** aparecen los botones "Exportar PDF" y "Exportar Excel".
2. **Dado** que los botones están visibles, **Cuando** se comparan sus etiquetas, **Entonces** coinciden exactamente con "Exportar PDF" y "Exportar Excel".
3. **Dado** que se revisa el menú lateral, **Cuando** se comparan sus opciones, **Entonces** la exportación no crea una nueva sección ni una opción adicional.
4. **Dado** que un reporte no está disponible para un rol, **Cuando** se revisan sus acciones, **Entonces** ese rol no ve los botones de exportación de ese reporte.
5. **Dado** que el Contador exporta un reporte, **Cuando** se revisa el historial de auditoría, **Entonces** la exportación no genera un evento de creación, edición ni anulación de movimientos.

### Edge Cases

- ¿Qué ocurre cuando el reporte no tiene movimientos?
- ¿Qué ocurre cuando los datos son inconsistentes y el reporte no puede validarse?
- ¿Qué ocurre cuando se cambia el periodo después de abrir el reporte?
- ¿Qué ocurre cuando se exporta el mismo reporte dos veces seguidas?
- ¿Qué ocurre cuando se exportan PDF y Excel del mismo periodo?
- ¿Qué ocurre cuando el nombre de la empresa no está disponible en la vista del reporte?
- ¿Qué ocurre cuando un rol sin acceso a reportes intenta usar los botones directamente?
- ¿Qué ocurre cuando el archivo no puede descargarse?
- ¿Qué ocurre cuando el periodo seleccionado está cerrado?
- ¿Qué ocurre cuando se cargan o restablecen datos antes de exportar?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada reporte financiero DEBE incluir un botón etiquetado exactamente "Exportar PDF".
- **FR-002**: Cada reporte financiero DEBE incluir un botón etiquetado exactamente "Exportar Excel".
- **FR-003**: Los botones de exportación DEBEN estar disponibles en el Libro Mayor, el Balance de Comprobación, el Estado de Resultados y el Balance General.
- **FR-004**: El botón "Exportar PDF" DEBE obtener un archivo descargable en formato PDF del reporte correspondiente.
- **FR-005**: El botón "Exportar Excel" DEBE obtener un archivo descargable en formato Excel del reporte correspondiente.
- **FR-006**: Los archivos exportados DEBEN corresponder al periodo seleccionado en el momento de la exportación.
- **FR-007**: Los archivos exportados DEBEN incluir el nombre exacto "Comercial Los Andes SpA".
- **FR-008**: Los archivos exportados DEBEN incluir el periodo seleccionado y la fecha de generación.
- **FR-009**: Los archivos exportados DEBEN incluir los totales aplicables al tipo de reporte.
- **FR-010**: Para el Libro Mayor, el archivo DEBE conservar saldos iniciales, débitos, créditos y saldos finales por cuenta, además de los totales generales.
- **FR-011**: Para el Balance de Comprobación, el archivo DEBE conservar los totales de débito y crédito.
- **FR-012**: Para el Estado de Resultados, el archivo DEBE conservar ingresos, gastos y resultado.
- **FR-013**: Para el Balance General, el archivo DEBE conservar activos, pasivos, patrimonio y resultado acumulado cuando corresponda.
- **FR-014**: Los archivos exportados DEBEN reflejar las mismas cifras y totales mostrados en pantalla para el mismo periodo.
- **FR-015**: Los archivos exportados NO DEBEN incluir movimientos de periodos distintos al seleccionado.
- **FR-016**: Cuando el reporte sea válido pero no tenga movimientos, el archivo DEBE incluir totales en cero y una indicación clara de ausencia de movimientos.
- **FR-017**: Cuando existan datos inconsistentes que impidan validar el reporte, el sistema DEBE bloquear la exportación y mostrar la advertencia correspondiente.
- **FR-018**: La exportación NO DEBE modificar cuentas, asientos, pagos, periodos ni filtros del módulo.
- **FR-019**: La exportación NO DEBE generar eventos de auditoría de creación, edición ni anulación de movimientos.
- **FR-020**: Los botones de exportación NO DEBEN crear una nueva opción de menú ni una pantalla adicional.
- **FR-021**: Los botones de exportación DEBEN estar disponibles para los roles que pueden consultar el reporte correspondiente.
- **FR-022**: El sistema DEBE ocultar los botones de exportación cuando el rol no pueda consultar el reporte.
- **FR-023**: El archivo descargable DEBE tener un nombre comprensible que identifique el reporte y el periodo seleccionado.
- **FR-024**: Cuando un archivo no pueda descargarse, el sistema DEBE mostrar un mensaje claro en español que permita reintentar la acción.

### Key Entities *(include if feature involves data)*

- **BotonExportacion**: Acción visible en un reporte financiero que permite obtener el archivo en PDF o Excel.
- **ArchivoReporte**: Resultado descargable que contiene el reporte del periodo seleccionado con identidad de empresa, fecha y totales.
- **ReporteFinanciero**: Consulta contable de periodo que puede exportarse en PDF o Excel.
- **PeriodoSeleccionado**: Intervalo contable usado para determinar el contenido del archivo exportado.
- **EmpresaFicticia**: Organización "Comercial Los Andes SpA" cuyo nombre debe aparecer en el archivo exportado.
- **TotalesReporte**: Conjunto de importes y saldos aplicables al tipo de reporte que deben conservarse en la exportación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los reportes financieros muestra los botones "Exportar PDF" y "Exportar Excel".
- **SC-002**: El 100% de las exportaciones genera un archivo descargable en el formato seleccionado.
- **SC-003**: El 100% de los archivos exportados incluye el nombre exacto "Comercial Los Andes SpA".
- **SC-004**: El 100% de los archivos exportados incluye el periodo seleccionado y la fecha de generación.
- **SC-005**: El 100% de los archivos exportados incluye los totales aplicables al reporte.
- **SC-006**: El 100% de las comparaciones entre pantalla y archivo muestra cifras y totales idénticos.
- **SC-007**: El 100% de las exportaciones bloqueadas por datos inconsistentes muestra una advertencia comprensible.
- **SC-008**: El 100% de las exportaciones de reportes vacíos válidos muestra totales en cero y una indicación de ausencia de movimientos.
- **SC-009**: El 100% de las exportaciones conserva el estado del módulo y no genera eventos de auditoría de movimientos.
- **SC-010**: No se crea ninguna opción de menú ni pantalla adicional para la exportación.
- **SC-011**: El 95% de los Contadores obtiene el archivo correcto en menos de 10 segundos desde que abre el reporte.
- **SC-012**: Al menos el 90% de los Contadores encuestados indica que los archivos exportados contienen la información necesaria para revisar el periodo seleccionado.

## Assumptions

- Los reportes financieros cubiertos son Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General.
- El Contador es el actor principal de esta historia.
- El Administrador financiero y el Auditor, que ya pueden consultar reportes financieros, también pueden exportarlos porque la exportación no modifica información.
- Los roles sin acceso a un reporte no ven los botones de exportación de ese reporte.
- El nombre de la empresa en los archivos es exactamente "Comercial Los Andes SpA", conforme a la identidad corporativa del encabezado.
- La fecha requerida en el archivo incluye tanto el periodo seleccionado como la fecha de generación de la exportación.
- Los totales exportados son los aplicables a cada tipo de reporte y deben coincidir con los mostrados en pantalla.
- Solo se exportan movimientos aprobados y coherentes con las reglas ya definidas para los reportes financieros.
- Un reporte válido sin movimientos puede exportarse con totales en cero y una indicación de ausencia de movimientos.
- Un reporte con datos inconsistentes no puede exportarse hasta que la advertencia sea atendida.
- La exportación es una acción de solo lectura: no cambia datos financieros, filtros, periodos ni eventos de auditoría.
- Los botones de exportación forman parte de cada reporte y no crean una nueva opción de menú ni una pantalla adicional.
- No se requiere configurar el contenido del archivo desde la interfaz; el contenido se deriva del reporte visible y del periodo seleccionado.
