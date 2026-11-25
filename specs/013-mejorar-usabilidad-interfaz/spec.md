# Feature Specification: Mejora de usabilidad sin cambios funcionales

**Feature Branch**: `013-mejorar-usabilidad-interfaz`

**Created**: 2026-11-25

**Status**: Draft

**Input**: User description: "Mejora la usabilidad sin cambiar funciones: login centrado y angosto, sin espacio vacío antes de Ingresar; menú lateral alineado a la izquierda; "Cerrar sesión" en el encabezado junto al usuario y su rol; montos en formato chileno ($5.000, sin decimales); en cada pantalla mostrar primero la lista y un botón "Nuevo" que abra el formulario en una ventana; la "×" de los filtros sin encimarse con la flecha; alinear la fila de totales del Libro Mayor; y mensajes claros cuando una lista está vacía."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Centrar y estrechar el acceso (Priority: P1)

Como usuario del módulo, quiero que la pantalla de acceso esté centrada y sea angosta, con el botón "Ingresar" inmediatamente después de los campos, para concentrarme en las credenciales sin buscar el control de acceso.

**Why this priority**: El acceso es la primera interacción con el módulo; una presentación clara reduce errores y tiempo de ingreso.

**Independent Test**: Se abre la pantalla de acceso en una pantalla amplia y en una estrecha, y se verifica que el formulario esté centrado, angosto y que el botón "Ingresar" no tenga un espacio vacío superior que lo separe del último campo.

**Acceptance Scenarios**:

1. **Dado** que se abre la pantalla de acceso, **Cuando** se revisa su disposición, **Entonces** el formulario aparece centrado en el área visible.
2. **Dado** que la pantalla es amplia, **Cuando** se compara el ancho del formulario con el ancho de la pantalla, **Entonces** el formulario es angosto y no ocupa todo el ancho disponible.
3. **Dado** que se completan los campos de acceso, **Cuando** se revisa la posición del botón "Ingresar", **Entonces** aparece inmediatamente después del último campo sin un espacio vacío superior.
4. **Dado** que se visualiza la pantalla en un dispositivo estrecho, **Cuando** se revisa el acceso, **Entonces** los campos y el botón permanecen legibles y sin desplazamiento horizontal de toda la página.
5. **Dado** que se cambia el tamaño de la ventana, **Cuando** se revisa el acceso, **Entonces** el formulario conserva su centrado y su carácter angosto.

---

### User Story 2 - Mostrar la identidad del usuario y el cierre de sesión en el encabezado (Priority: P1)

Como usuario autenticado, quiero ver mi nombre, mi rol y la acción "Cerrar sesión" juntos en el encabezado, para reconocer con quién estoy trabajando y finalizar el acceso sin buscar en otras zonas.

**Why this priority**: La identidad del usuario y la salida rápida son referencias permanentes durante toda la sesión y reducen la incertidumbre sobre el perfil activo.

**Independent Test**: Se inicia sesión con cada usuario de prueba y se comprueba que el encabezado muestre el nombre, el rol y "Cerrar sesión" agrupados, y que la acción conserve su comportamiento habitual.

**Acceptance Scenarios**:

1. **Dado** que existe una sesión válida, **Cuando** se abre cualquier pantalla del módulo, **Entonces** el encabezado muestra el nombre del usuario autenticado y su rol.
2. **Dado** que el encabezado está visible, **Cuando** se revisa la ubicación de "Cerrar sesión", **Entonces** aparece junto al nombre del usuario y su rol.
3. **Dado** que se navega entre secciones, **Cuando** se revisa el encabezado, **Entonces** el nombre, el rol y "Cerrar sesión" permanecen visibles y agrupados.
4. **Dado** que se selecciona "Cerrar sesión" desde el encabezado, **Cuando** finaliza la acción, **Entonces** la sesión termina y se vuelve a la pantalla de acceso.
5. **Dado** que el nombre o el rol son extensos, **Cuando** se muestra el encabezado en una pantalla estrecha, **Entonces** la información sigue siendo legible y "Cerrar sesión" sigue accesible.

---

### User Story 3 - Alinear el menú lateral a la izquierda (Priority: P1)

Como usuario autenticado, quiero que el menú lateral esté alineado al borde izquierdo del área de trabajo, para tener una referencia de navegación estable y predecible.

**Why this priority**: Una navegación ubicada de forma consistente permite orientarse rápidamente y evita confusión al cambiar de pantalla.

**Independent Test**: Se abre el menú lateral en distintas pantallas y tamaños de pantalla, y se verifica que quede alineado al borde izquierdo con las mismas secciones permitidas para el rol.

**Acceptance Scenarios**:

1. **Dado** que existe una sesión válida, **Cuando** se muestra el menú lateral, **Entonces** aparece alineado al borde izquierdo del área de trabajo.
2. **Dado** que se navega entre secciones, **Cuando** se revisa el menú lateral, **Entonces** conserva su alineación a la izquierda.
3. **Dado** que el menú se abre desde el encabezado, **Cuando** se revisa su posición, **Entonces** continúa alineado a la izquierda.
4. **Dado** que se usa una pantalla estrecha, **Cuando** se abre el menú, **Entonces** el menú se despliega desde el borde izquierdo y muestra solo las secciones permitidas.
5. **Dado** que se revisan las opciones del menú, **Cuando** se comparan con la matriz de acceso vigente, **Entonces** no aparecen secciones nuevas ni se pierden las permitidas.

---

### User Story 4 - Mostrar montos en formato chileno (Priority: P1)

Como usuario del módulo, quiero ver todos los montos en formato chileno, con símbolo "$", separador de miles y sin decimales, para leer las cifras con el mismo criterio que uso habitualmente.

**Why this priority**: La consistencia en la presentación de importes evita misinterpretaciones en listados, reportes y resúmenes financieros.

**Independent Test**: Se revisan importes en listados, formularios, resúmenes y reportes, y se comprueba que un valor como cinco mil se muestre como "$5.000" sin decimales y con el mismo criterio en todas partes.

**Acceptance Scenarios**:

1. **Dado** que una pantalla muestra un monto, **Cuando** se revisa su presentación, **Entonces** aparece con el símbolo "$" antes del valor y puntos como separador de miles.
2. **Dado** que un monto es cinco mil, **Cuando** se muestra en pantalla, **Entonces** se presenta exactamente como "$5.000".
3. **Dado** que un monto tiene tres o menos cifras, **Cuando** se muestra en pantalla, **Entonces** aparece sin puntos de miles y sin decimales.
4. **Dado** que se revisan listados, formularios, resúmenes y reportes, **Cuando** se comparan sus importes, **Entonces** todos usan el mismo formato chileno sin decimales.
5. **Dado** que cambia la presentación de un importe, **Cuando** se consultan los cálculos del módulo, **Entonces** los valores y resultados financieros permanecen iguales.

---

### User Story 5 - Mostrar primero la lista y abrir el formulario desde "Nuevo" (Priority: P1)

Como usuario con permisos de creación, quiero ver primero la lista de registros y usar un botón "Nuevo" que abra el formulario en una ventana, para consultar el contexto existente antes de crear un registro sin perder el listado de fondo.

**Why this priority**: Priorizar la lista refuerza la consulta como primera acción y la ventana de formulario mantiene visible el contexto mientras se captura información.

**Independent Test**: Se abre una pantalla con registros, se verifica que la lista aparezca antes que el formulario, se selecciona "Nuevo", se interactúa con la ventana y se cierra sin guardar comprobando que el listado y sus filtros no cambiaron.

**Acceptance Scenarios**:

1. **Dado** que se abre una pantalla con registros, **Cuando** se revisa su contenido, **Entonces** la lista aparece antes que cualquier formulario de creación.
2. **Dado** que el usuario tiene permiso para crear, **Cuando** se revisa la pantalla, **Entonces** encuentra un botón visible identificado como "Nuevo".
3. **Dado** que el usuario selecciona "Nuevo", **Cuando** se abre el formulario, **Entonces** este aparece en una ventana dentro del módulo sin reemplazar la lista de fondo.
4. **Dado** que la ventana del formulario está abierta, **Cuando** se revisa la lista de fondo, **Entonces** los filtros y los registros previamente visibles permanecen sin cambios.
5. **Dado** que el usuario cierra la ventana sin guardar, **Cuando** se revisa la pantalla, **Entonces** el listado, los filtros y los datos permanecen igual.
6. **Dado** que el usuario confirma un registro válido, **Cuando** se cierra la ventana, **Entonces** la lista se actualiza conservando las reglas y validaciones vigentes.
7. **Dado** que un rol no puede crear registros, **Cuando** revisa la pantalla, **Entonces** no ve el botón "Nuevo".

---

### User Story 6 - Evitar la superposición en los filtros (Priority: P2)

Como usuario que aplica filtros, quiero que la "×" para limpiar un filtro no se encime con la flecha del selector, para poder limpiar y cambiar el valor elegido sin hacer clic en el control equivocado.

**Why this priority**: Una superposición de controles provoca acciones accidentales y dificulta la revisión de listados extensos.

**Independent Test**: Se revisan los filtros con la "×" visible y la flecha del selector, se aplica y limpia cada filtro, y se comprueba que ambos controles puedan usarse por separado.

**Acceptance Scenarios**:

1. **Dado** que un filtro tiene una "×" para limpiarlo, **Cuando** se revisa su presentación, **Entonces** la "×" no se encima con la flecha del selector.
2. **Dado** que un filtro está aplicado, **Cuando** se selecciona la "×", **Entonces** el filtro se limpia sin activar el selector.
3. **Dado** que se selecciona la flecha del selector, **Cuando** se abre la lista de opciones, **Entonces** no se activa la acción de limpiar el filtro.
4. **Dado** que se revisan todos los filtros de la pantalla, **Cuando** se comparan sus controles, **Entonces** ninguna "×" invade el espacio de una flecha.
5. **Dado** que el nombre de una opción es extenso, **Cuando** se muestra el filtro, **Entonces** la "×" y la flecha continúan separadas y legibles.

---

### User Story 7 - Alinear la fila de totales del Libro Mayor (Priority: P2)

Como Contador o usuario autorizado, quiero que la fila de totales del Libro Mayor esté alineada con las columnas correspondientes, para leer cada importe en su columna sin confundir saldos, débitos y créditos.

**Why this priority**: Una fila de totales desalineada dificulta la verificación contable y puede generar interpretaciones incorrectas de los saldos.

**Independent Test**: Se genera el Libro Mayor de un periodo con movimientos y se comprueba que los totales queden debajo de saldo inicial, débitos, créditos y saldo final, conservando los mismos importes que antes.

**Acceptance Scenarios**:

1. **Dado** que se genera un Libro Mayor con movimientos, **Cuando** se revisa la fila de totales, **Entonces** cada total está alineado con su columna.
2. **Dado** que la fila de totales es visible, **Cuando** se comparan sus columnas con las del detalle, **Entonces** saldo inicial, débitos, créditos y saldo final coinciden en posición.
3. **Dado** que se revisan los importes de los totales, **Cuando** se comparan con el cálculo vigente, **Entonces** los valores permanecen iguales.
4. **Dado** que el Libro Mayor se visualiza en una pantalla estrecha, **Cuando** se revisa la fila de totales, **Entonces** la alineación se conserva dentro del área de la tabla.
5. **Dado** que se alinea la fila de totales, **Cuando** se revisan las reglas del reporte, **Entonces** no se modifica la igualdad contable ni el criterio de cálculo.

---

### User Story 8 - Mostrar mensajes claros para listas vacías (Priority: P1)

Como usuario, quiero un mensaje claro cuando una lista no tiene registros, para saber que no hay datos disponibles y no confundir esa situación con un error o con información oculta.

**Why this priority**: Los estados vacíos son frecuentes en demostraciones y periodos sin movimientos; un mensaje explícito evita dudas sobre el estado del módulo.

**Independent Test**: Se abren listados sin registros, con filtros sin resultados y con datos cargados, y se verifica que el mensaje de estado vacío aparezca solo cuando corresponda.

**Acceptance Scenarios**:

1. **Dado** que un listado no tiene registros, **Cuando** se abre la pantalla, **Entonces** se muestra un mensaje claro en español que indica que no hay resultados.
2. **Dado** que se aplica un filtro sin coincidencias, **Cuando** se revisa el listado, **Entonces** se muestra un mensaje que explica que no hay registros para ese filtro.
3. **Dado** que existen registros, **Cuando** se revisa el listado, **Entonces** no se muestra el mensaje de lista vacía.
4. **Dado** que un mensaje de lista vacía está visible, **Cuando** se revisa su presentación, **Entonces** permanece dentro del área del listado y es legible.
5. **Dado** que el mensaje de lista vacía aparece, **Cuando** se compara con un mensaje de error, **Entonces** se distingue claramente y no sugiere que falló la carga.
6. **Dado** que se limpia un filtro y existen registros, **Cuando** se actualiza el listado, **Entonces** el mensaje de lista vacía desaparece.

---

### Edge Cases

- ¿Qué ocurre cuando la pantalla de acceso se abre en una ventana muy estrecha?
- ¿Qué ocurre cuando el nombre del usuario o su rol son extensos en el encabezado?
- ¿Qué ocurre cuando un monto es cero, tiene tres cifras o supera los miles?
- ¿Qué ocurre cuando se abre el formulario "Nuevo" con filtros aplicados en la lista?
- ¿Qué ocurre cuando se cierra la ventana del formulario sin guardar?
- ¿Qué ocurre cuando una opción de filtro tiene un texto extenso y la "×" y la flecha compiten por espacio?
- ¿Qué ocurre cuando el Libro Mayor no tiene movimientos y solo muestra totales en cero?
- ¿Qué ocurre cuando una lista está vacía porque el rol no tiene registros disponibles?
- ¿Qué ocurre cuando cambia el ancho de la pantalla mientras una ventana de formulario está abierta?
- ¿Qué ocurre cuando se aplican mejoras visuales en una pantalla con permisos reducidos?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla de acceso DEBE presentar el formulario de inicio de sesión centrado en el área visible.
- **FR-002**: El formulario de acceso DEBE ser angosto y NO DEBE ocupar todo el ancho de la pantalla en dispositivos amplios.
- **FR-003**: El botón "Ingresar" DEBE aparecer inmediatamente después del último campo obligatorio, sin un espacio vacío superior que lo separe de dicho campo.
- **FR-004**: La pantalla de acceso NO DEBE mostrar el menú lateral ni información financiera antes de una autenticación válida.
- **FR-005**: El menú lateral DEBE estar alineado al borde izquierdo del área de trabajo cuando esté visible.
- **FR-006**: El menú lateral DEBE conservar las etiquetas, el orden y los permisos vigentes de las secciones.
- **FR-007**: El encabezado DEBE mostrar el nombre del usuario autenticado y su rol cuando exista una sesión válida.
- **FR-008**: La acción "Cerrar sesión" DEBE mostrarse en el encabezado junto al nombre del usuario y su rol.
- **FR-009**: La acción "Cerrar sesión" DEBE conservar su comportamiento vigente de finalizar la sesión y volver a la pantalla de acceso.
- **FR-010**: Los importes monetarios DEBEN mostrarse con el símbolo "$" antes del valor y punto como separador de miles.
- **FR-011**: Los importes monetarios DEBEN mostrarse sin decimales.
- **FR-012**: El formato monetario DEBE aplicarse de forma consistente a listados, formularios, resúmenes, reportes y mensajes que contengan montos.
- **FR-013**: Un importe de cinco mil DEBE presentarse como "$5.000" cuando se muestre al usuario.
- **FR-014**: El cambio de presentación de los importes NO DEBE modificar los valores numéricos, los cálculos ni las reglas contables vigentes.
- **FR-015**: Cada pantalla con registros DEBE mostrar primero el listado disponible para el usuario.
- **FR-016**: Cada pantalla con registros DEBE ofrecer un botón visible identificado como "Nuevo" cuando el usuario tenga permiso para crear.
- **FR-017**: Al seleccionar "Nuevo", el sistema DEBE abrir el formulario correspondiente en una ventana dentro del módulo, sin reemplazar el listado de fondo.
- **FR-018**: La ventana del formulario DEBE conservar el listado y los filtros previamente aplicados sin cambios mientras esté abierta.
- **FR-019**: La ventana del formulario DEBE poder cerrarse sin guardar, dejando los datos y el listado sin modificaciones.
- **FR-020**: La creación de registros desde la ventana DEBE conservar las validaciones, reglas de negocio y permisos vigentes.
- **FR-021**: El botón "Nuevo" NO DEBE mostrarse en pantallas donde el rol autenticado no pueda crear registros.
- **FR-022**: El control "×" para limpiar un filtro NO DEBE superponerse con la flecha del selector.
- **FR-023**: La "×" de un filtro DEBE limpiar únicamente ese filtro sin activar el selector de opciones.
- **FR-024**: La flecha del selector DEBE abrir las opciones del filtro sin activar la acción de limpiar.
- **FR-025**: Los controles de filtro DEBEN permanecer legibles y separados incluso cuando el texto de la opción seleccionada sea extenso.
- **FR-026**: La fila de totales del Libro Mayor DEBE alinearse con las columnas de saldo inicial, débitos, créditos y saldo final.
- **FR-027**: La fila de totales del Libro Mayor DEBE conservar los importes y el criterio de cálculo vigente.
- **FR-028**: Cuando un listado no tenga registros, el sistema DEBE mostrar un mensaje claro en español que indique que no hay resultados.
- **FR-029**: Cuando un filtro no produzca coincidencias, el sistema DEBE mostrar un mensaje que indique que no hay registros para ese filtro.
- **FR-030**: El mensaje de lista vacía NO DEBE presentarse como un mensaje de error ni indicar que falló la carga.
- **FR-031**: El mensaje de lista vacía DEBE permanecer dentro del área del listado y ser legible.
- **FR-032**: Cuando existan registros, el sistema NO DEBE mostrar el mensaje de lista vacía.
- **FR-033**: Las mejoras de usabilidad NO DEBEN agregar, eliminar ni modificar operaciones, permisos, datos ni reglas de negocio.
- **FR-034**: Las mejoras de usabilidad NO DEBEN crear nuevas opciones de menú ni accesos duplicados a pantallas existentes.
- **FR-035**: Las mejoras DEBEN aplicarse a todos los roles que ya tenían acceso a las pantallas afectadas.

### Key Entities *(include if feature involves data)*

- **PantallaAcceso**: Vista inicial que concentra el formulario de credenciales y el botón "Ingresar" sin espacio vacío superior innecesario.
- **FormularioAcceso**: Conjunto de campos de autenticación conservados sin cambios funcionales respecto al comportamiento vigente.
- **MenuLateral**: Navegación principal alineada al borde izquierdo del área de trabajo, con las secciones permitidas por el rol.
- **EncabezadoModulo**: Área superior que presenta la identidad corporativa, el usuario autenticado, su rol y la acción "Cerrar sesión".
- **IdentificacionUsuario**: Nombre y rol del usuario con sesión válida, mostrados juntos en el encabezado.
- **ImporteFormateado**: Presentación de un valor monetario con símbolo "$", separador de miles y sin decimales, equivalente al valor numérico usado en cálculos.
- **ListadoPrincipal**: Primer contenido visible de una pantalla con registros, conservando filtros y datos mientras se abre un formulario.
- **BotonNuevo**: Control visible que abre el formulario de creación en una ventana dentro del módulo.
- **VentanaFormulario**: Área temporal donde se captura o edita información sin reemplazar el listado de fondo.
- **ControlFiltro**: Elemento de filtro que incluye la opción de limpiar y el selector de valores sin superposición entre ambos controles.
- **FilaTotales**: Fila del Libro Mayor que presenta los totales alineados con saldo inicial, débitos, créditos y saldo final.
- **MensajeListaVacia**: Aviso claro y legible que informa que no hay registros o que un filtro no produjo resultados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las revisiones de la pantalla de acceso confirma que el formulario está centrado y es angosto en pantallas amplias.
- **SC-002**: El 100% de los usuarios de prueba localiza el botón "Ingresar" sin desplazamiento adicional en menos de 5 segundos.
- **SC-003**: El 100% de las pantallas posteriores al acceso muestra el menú lateral alineado al borde izquierdo.
- **SC-004**: El 100% de las sesiones válidas muestra en el encabezado el nombre del usuario, su rol y "Cerrar sesión" de forma agrupada.
- **SC-005**: El 100% de los importes visibles usa el formato chileno con "$", puntos de miles y sin decimales.
- **SC-006**: El 100% de los cálculos financieros conserva idénticos resultados después del cambio de formato de los importes.
- **SC-007**: El 100% de las pantallas con registros muestra el listado antes que cualquier formulario de creación.
- **SC-008**: El 100% de los formularios abiertos desde "Nuevo" aparece en una ventana sin reemplazar el listado de fondo.
- **SC-009**: El 100% de los cierres de ventana sin guardar conserva el listado, los filtros y los datos sin cambios.
- **SC-010**: Se detectan 0 superposiciones entre la "×" de los filtros y la flecha del selector en las revisiones de pantalla.
- **SC-011**: El 100% de las filas de totales del Libro Mayor está alineada con sus columnas correspondientes.
- **SC-012**: El 100% de los listados vacíos muestra un mensaje claro en español dentro del área del listado.
- **SC-013**: Al menos el 95% de los usuarios encuestados encuentra una acción principal sin ayuda en menos de 10 segundos después de los cambios.
- **SC-014**: Se detectan 0 cambios funcionales en reglas, permisos, datos y operaciones respecto al comportamiento vigente.
- **SC-015**: El 100% de los roles conserva el mismo conjunto de pantallas y acciones permitidas que antes de la mejora.

## Assumptions

- El alcance se limita a la presentación y disposición visual; no se agregan, eliminan ni modifican funciones, datos, permisos ni reglas de negocio.
- "Ventana" significa una ventana dentro del módulo que se abre y cierra sobre el listado, sin reemplazar la pantalla ni abrir una pestaña separada del navegador.
- El formulario de acceso conserva los campos, las validaciones y las credenciales definidos en la Historia de Usuario 8 de la especificación base.
- El menú lateral conserva las secciones, etiquetas y permisos definidos en la matriz de acceso vigente.
- El encabezado muestra el nombre y el rol del usuario autenticado tal como aparecen en los usuarios de prueba de la especificación base.
- El formato chileno aplica a los importes en MXN usados por el módulo: símbolo "$" antes del valor, puntos de separación de miles y ausencia de decimales.
- No se introducen montos negativos nuevos ni cambios en el criterio de redondeo; se respeta la lógica financiera existente.
- En pantallas estrechas, el menú lateral continúa adaptándose según las reglas vigentes y permanece alineado al borde izquierdo cuando está abierto.
- Los mensajes de lista vacía son informativos y no sustituyen mensajes de error ni estados de carga.
- La fila de totales del Libro Mayor conserva los importes y la igualdad contable definida; solo cambia su alineación visual.
- Las mejoras no crean nuevas opciones de menú ni accesos duplicados a pantallas existentes.
