# Feature Specification: Interfaz profesional del módulo

**Feature Branch**: `012-interfaz-profesional-modulo`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como usuario, quiero una interfaz profesional: mismos colores en todo el módulo, íconos en cada sección, tablas ordenables, mensaje de confirmación al guardar o eliminar, y menú adaptable en celular."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mantener una paleta de colores coherente (Priority: P1)

Como usuario, quiero que todo el módulo use los mismos colores, para percibir una interfaz profesional y reconocer fácilmente acciones, estados y mensajes.

**Why this priority**: La coherencia visual reduce la confusión y transmite confianza en una herramienta financiera.

**Independent Test**: Se recorren las pantallas principales y se comprueba que encabezados, botones, mensajes y estados usen la misma paleta definida.

**Acceptance Scenarios**:

1. **Dado** que se recorren todas las secciones del módulo, **Cuando** se comparan sus colores, **Entonces** encabezados, botones y mensajes usan la misma paleta.
2. **Dado** que un estado es exitoso, **Cuando** se muestra su mensaje, **Entonces** usa el mismo color de éxito en todas las pantallas.
3. **Dado** que un estado es de error o advertencia, **Cuando** se muestra su mensaje, **Entonces** usa el mismo color de error o advertencia en todo el módulo.
4. **Dado** que se navega entre paneles, listados y reportes, **Cuando** se revisa la interfaz, **Entonces** no aparecen combinaciones de colores ajenas a la paleta definida.

---

### User Story 2 - Mostrar íconos en cada sección (Priority: P1)

Como usuario, quiero ver un ícono junto al nombre de cada sección, para reconocer más rápido las opciones disponibles y diferenciarlas visualmente.

**Why this priority**: Los íconos apoyan la navegación y hacen que el menú y los encabezados sean más comprensibles de un vistazo.

**Independent Test**: Se revisan el menú lateral y los encabezados de sección, y se comprueba que cada sección tenga un ícono consistente y un texto visible.

**Acceptance Scenarios**:

1. **Dado** que el menú lateral está visible, **Cuando** se revisa cada opción, **Entonces** cada sección muestra un ícono junto a su texto.
2. **Dado** que una sección tiene un ícono en el menú, **Cuando** se abre esa sección, **Entonces** el mismo ícono aparece en su encabezado.
3. **Dado** que se comparan las secciones del módulo, **Cuando** se revisan sus íconos, **Entonces** cada sección usa un ícono propio y fácil de distinguir.
4. **Dado** que se muestra un ícono, **Cuando** se revisa su presentación, **Entonces** el texto de la sección permanece visible y comprensible.
5. **Dado** que un rol ve solo algunas secciones, **Cuando** revisa el menú, **Entonces** cada sección visible conserva su ícono correspondiente.

---

### User Story 3 - Ordenar tablas por columnas (Priority: P1)

Como usuario, quiero ordenar las tablas del módulo por sus columnas, para encontrar información con mayor rapidez y comparar registros de forma clara.

**Why this priority**: Los listados financieros requieren revisar importes, fechas y estados; el orden ayuda a detectar patrones y anomalías.

**Independent Test**: Se abre una tabla con varios registros, se ordena por diferentes columnas en ambos sentidos y se verifica que el orden cambie sin alterar los datos.

**Acceptance Scenarios**:

1. **Dado** que una tabla tiene encabezados de columna, **Cuando** se selecciona un encabezado, **Entonces** los registros se ordenan por esa columna.
2. **Dado** que una tabla está ordenada por una columna, **Cuando** se selecciona el mismo encabezado nuevamente, **Entonces** el orden cambia entre ascendente y descendente.
3. **Dado** que una tabla está ordenada, **Cuando** se revisa su encabezado, **Entonces** se indica claramente la columna y el sentido del orden aplicado.
4. **Dado** que una tabla contiene fechas, **Cuando** se ordena por fecha, **Entonces** los registros se ordenan por valor cronológico.
5. **Dado** que una tabla contiene importes, **Cuando** se ordena por monto, **Entonces** los registros se ordenan por valor numérico.
6. **Dado** que una tabla contiene estados, **Cuando** se ordena por estado, **Entonces** los registros se agrupan de forma coherente con los estados definidos.
7. **Dado** que se ordena una tabla, **Cuando** se revisan los registros, **Entonces** su información no se modifica.

---

### User Story 4 - Confirmar guardados y eliminaciones (Priority: P1)

Como usuario, quiero recibir mensajes de confirmación al guardar o eliminar registros, para saber si la acción se realizó correctamente y evitar eliminaciones accidentales.

**Why this priority**: La retroalimentación clara evita dudas sobre si un cambio fue aplicado y protege la información financiera frente a eliminaciones no intencionadas.

**Independent Test**: Se guarda un registro válido, se intenta eliminar un registro cancelando la confirmación y luego se confirma la eliminación, verificando los mensajes y el estado final.

**Acceptance Scenarios**:

1. **Dado** que se guarda un registro válido, **Cuando** finaliza la acción, **Entonces** se muestra un mensaje de confirmación de guardado exitoso.
2. **Dado** que se intenta eliminar un registro permitido, **Cuando** se inicia la acción, **Entonces** se muestra un mensaje de confirmación antes de eliminar.
3. **Dado** que aparece la confirmación de eliminación, **Cuando** el usuario cancela, **Entonces** el registro permanece sin cambios.
4. **Dado** que aparece la confirmación de eliminación, **Cuando** el usuario confirma, **Entonces** se elimina el registro y se muestra un mensaje de confirmación de eliminación.
5. **Dado** que un guardado es rechazado por validación, **Cuando** finaliza la acción, **Entonces** no se muestra un mensaje de éxito y se explica el problema.
6. **Dado** que un registro no puede eliminarse según las reglas vigentes, **Cuando** se intenta eliminar, **Entonces** no se ofrece la confirmación y se explica la restricción.
7. **Dado** que se muestran mensajes de confirmación, **Cuando** se comparan en distintas pantallas, **Entonces** usan el mismo estilo y lenguaje claro.

---

### User Story 5 - Adaptar el menú a pantallas de celular (Priority: P1)

Como usuario, quiero que el menú se adapte a pantallas de celular, para acceder a las secciones permitidas sin perder opciones ni tener que desplazarme horizontalmente.

**Why this priority**: El módulo debe ser usable en dispositivos pequeños sin sacrificar navegación ni cumplir reglas de permisos.

**Independent Test**: Se abre el módulo en un tamaño de pantalla de celular, se despliega el menú y se verifica que todas las secciones permitidas estén accesibles.

**Acceptance Scenarios**:

1. **Dado** que el módulo se visualiza en una pantalla de celular, **Cuando** se abre el menú, **Entonces** las secciones permitidas están disponibles para el rol autenticado.
2. **Dado** que el menú está abierto en celular, **Cuando** se selecciona una sección, **Entonces** se navega a esa sección y el menú deja de ocupar la pantalla.
3. **Dado** que se visualiza una tabla en celular, **Cuando** se revisa la pantalla, **Entonces** no se requiere desplazamiento horizontal de toda la página para leer el menú.
4. **Dado** que el menú se adapta a celular, **Cuando** se comparan sus opciones con la versión amplia, **Entonces** no aparece una sección nueva ni desaparece una sección permitida.
5. **Dado** que un rol tiene permisos limitados, **Cuando** abre el menú en celular, **Entonces** sigue viendo únicamente las secciones autorizadas.
6. **Dado** que se cierra el menú en celular, **Cuando** se revisa la pantalla, **Entonces** el contenido de la sección permanece utilizable.
7. **Dado** que se usa una pantalla amplia, **Cuando** se revisa el menú, **Entonces** mantiene su presentación habitual sin perder las mejoras de interfaz.

### Edge Cases

- ¿Qué ocurre cuando una tabla no tiene registros?
- ¿Qué ocurre cuando una columna no es ordenable?
- ¿Qué ocurre cuando dos registros tienen el mismo valor en la columna ordenada?
- ¿Qué ocurre cuando se ordena una tabla y después se aplica un filtro?
- ¿Qué ocurre cuando se cancela una eliminación?
- ¿Qué ocurre cuando se elimina un registro y luego se actualiza un listado abierto?
- ¿Qué ocurre cuando el guardado falla por validación?
- ¿Qué ocurre cuando un rol no tiene permiso para eliminar?
- ¿Qué ocurre cuando el menú en celular tiene más secciones de las que caben en pantalla?
- ¿Qué ocurre cuando se gira el dispositivo o cambia el ancho de pantalla?
- ¿Qué ocurre cuando un ícono no puede mostrarse?
- ¿Qué ocurre cuando un mensaje de confirmación aparece en una pantalla estrecha?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Todas las pantallas del módulo DEBEN usar la misma paleta de colores.
- **FR-002**: Los colores de éxito, error, advertencia e información DEBEN ser consistentes en todo el módulo.
- **FR-003**: Cada sección del menú DEBE mostrar un ícono junto a su texto.
- **FR-004**: Cada encabezado de sección DEBE mostrar el ícono correspondiente a esa sección.
- **FR-005**: Los íconos DEBEN ser consistentes entre menú y encabezado de sección.
- **FR-006**: El texto de cada sección DEBE permanecer visible junto a su ícono.
- **FR-007**: Las tablas del módulo DEBEN permitir ordenar registros por sus columnas aplicables.
- **FR-008**: Cada columna ordenable DEBE permitir orden ascendente y descendente.
- **FR-009**: La tabla DEBE indicar la columna ordenada y el sentido del orden aplicado.
- **FR-010**: El orden por fechas DEBE respetar el valor cronológico.
- **FR-011**: El orden por importes DEBE respetar el valor numérico.
- **FR-012**: El orden por estados DEBE agrupar los registros de forma coherente con los estados definidos.
- **FR-013**: Ordenar una tabla NO DEBE modificar los registros ni sus valores.
- **FR-014**: Después de guardar un registro válido, el sistema DEBE mostrar un mensaje de confirmación de éxito.
- **FR-015**: Antes de eliminar un registro permitido, el sistema DEBE mostrar un mensaje de confirmación.
- **FR-016**: Cuando el usuario cancele la confirmación de eliminación, el sistema NO DEBE eliminar el registro.
- **FR-017**: Después de confirmar una eliminación permitida, el sistema DEBE mostrar un mensaje de confirmación de eliminación.
- **FR-018**: Cuando un guardado falle por validación, el sistema NO DEBE mostrar un mensaje de éxito.
- **FR-019**: Cuando un registro no sea eliminable según las reglas vigentes, el sistema NO DEBE ofrecer la confirmación de eliminación.
- **FR-020**: Los mensajes de confirmación DEBEN usar un lenguaje claro y consistente en todo el módulo.
- **FR-021**: El menú DEBE adaptarse a pantallas de celular sin ocultar secciones permitidas para el rol.
- **FR-022**: El menú en celular NO DEBE mostrar secciones no permitidas para el rol autenticado.
- **FR-023**: Al seleccionar una sección desde el menú en celular, el menú DEBE dejar de ocupar la pantalla.
- **FR-024**: Las opciones del menú en celular DEBEN ser las mismas que las del menú en pantalla amplia, respetando permisos.
- **FR-025**: La interfaz NO DEBE requerir desplazamiento horizontal de toda la página para usar el menú en celular.
- **FR-026**: Las mejoras de interfaz NO DEBEN modificar reglas de negocio, permisos ni datos financieros.
- **FR-027**: La interfaz NO DEBE crear una nueva opción de menú derivada de estos cambios.
- **FR-028**: Cuando un ícono no pueda mostrarse, el texto de la sección DEBE permanecer visible y comprensible.
- **FR-029**: Cuando una tabla no tenga registros, DEBE mostrarse un estado vacío claro con la paleta definida.
- **FR-030**: Cuando un mensaje de confirmación se muestre en pantalla estrecha, DEBE permanecer legible y comprensible.

### Key Entities *(include if feature involves data)*

- **PaletaColores**: Conjunto único de colores usado para encabezados, botones, mensajes y estados en todo el módulo.
- **IconoSeccion**: Elemento visual asociado a una sección del menú y a su encabezado.
- **TablaOrdenable**: Tabla cuyas columnas permiten ordenar registros en sentido ascendente o descendente.
- **MensajeConfirmacion**: Aviso claro que informa el resultado de guardar o confirma una eliminación.
- **MenuAdaptable**: Presentación del menú que se ajusta a celular conservando secciones y permisos.
- **EstadoInterfaz**: Estado visual coherente para éxito, error, advertencia, información y ausencia de datos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las pantallas del módulo usa la paleta de colores definida.
- **SC-002**: El 100% de los mensajes de éxito, error, advertencia e información usa colores consistentes.
- **SC-003**: El 100% de las secciones del menú muestra un ícono junto a su texto.
- **SC-004**: El 100% de los encabezados de sección muestra el ícono correspondiente.
- **SC-005**: El 100% de las tablas aplicables permite ordenar por columnas en ambos sentidos.
- **SC-006**: El 100% de las ordenaciones por fecha, monto y estado produce el orden esperado.
- **SC-007**: El 100% de las acciones de ordenar conserva los datos originales.
- **SC-008**: El 100% de los guardados válidos muestra un mensaje de confirmación de éxito.
- **SC-009**: El 100% de las eliminaciones permitidas solicita confirmación antes de realizarse.
- **SC-010**: El 100% de las cancelaciones de eliminación conserva el registro sin cambios.
- **SC-011**: El 100% de las secciones permitidas sigue accesible desde el menú en celular.
- **SC-012**: El 100% de los roles ve el mismo conjunto de secciones en menú amplio y menú de celular, según sus permisos.
- **SC-013**: El 95% de los usuarios encuentra una sección o dato ordenado en menos de 10 segundos.
- **SC-014**: Al menos el 90% de los usuarios encuestados percibe la interfaz como profesional y coherente.

## Assumptions

- La interfaz profesional se aplica a todas las pantallas del módulo sin cambiar su funcionalidad financiera.
- La paleta de colores es única para todo el módulo.
- Los colores de estado significan lo mismo en todas las pantallas.
- Cada sección del menú y su encabezado comparten el mismo ícono.
- El texto de la sección siempre acompaña al ícono para evitar ambigüedad.
- Las tablas aplicables incluyen listados de cuentas, asientos, pagos, periodos, reportes y registros de auditoría.
- Las columnas que representan fechas, montos y estados deben ser ordenables cuando estén presentes.
- El orden de una tabla no modifica datos ni permisos.
- Guardar un registro válido muestra confirmación después de la acción.
- Eliminar un registro permitido requiere confirmación antes de la acción y muestra confirmación después de realizarla.
- Las reglas vigentes sobre qué registros pueden eliminarse se mantienen sin cambios.
- El menú en celular conserva las mismas secciones y permisos del menú amplio.
- Las mejoras de interfaz no crean nuevas opciones de menú.
- Los mensajes y estados vacíos se muestran en español y con la paleta definida.
