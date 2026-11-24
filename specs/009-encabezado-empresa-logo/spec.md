# Feature Specification: Identidad corporativa en el encabezado

**Feature Branch**: `009-encabezado-empresa-logo`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: mostrar en el encabezado el nombre de la empresa ficticia \"Comercial Los Andes SpA\" con su logo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mostrar la identidad de la empresa en el encabezado (Priority: P1)

Como usuario del módulo, quiero ver en el encabezado el nombre "Comercial Los Andes SpA" junto a su logo, para reconocer de inmediato la empresa ficticia a la que pertenece la información financiera mostrada.

**Why this priority**: La identidad visual reduce la ambigüedad durante la demostración y hace evidente que los datos son ficticios y pertenecen a una sola empresa.

**Independent Test**: Se inicia sesión con cualquier rol y se comprueba que el encabezado muestre el texto exacto y un logo reconocible junto a él.

**Acceptance Scenarios**:

1. **Dado** que existe una sesión válida, **Cuando** se abre cualquier pantalla del módulo, **Entonces** el encabezado muestra el nombre exacto "Comercial Los Andes SpA".
2. **Dado** que el encabezado está visible, **Cuando** se revisa su contenido, **Entonces** el logo aparece junto al nombre de la empresa.
3. **Dado** que se compara el texto mostrado con el nombre definido, **Cuando** se revisa su escritura, **Entonces** no aparecen variantes de mayúsculas, acentos o puntuación.
4. **Dado** que el logo y el nombre están visibles, **Cuando** se revisa el encabezado, **Entonces** ambos se identifican claramente como una sola identidad corporativa.

---

### User Story 2 - Mantener la identidad coherente en pantallas y roles (Priority: P1)

Como usuario del módulo, quiero que el encabezado sea idéntico al navegar entre pantallas y al cambiar de rol, para percibir una experiencia consistente.

**Why this priority**: Un encabezado inconsistente genera confusión y debilita la credibilidad de la demostración financiera.

**Independent Test**: Se recorren las pantallas disponibles con cada rol y se compara el encabezado en cada una.

**Acceptance Scenarios**:

1. **Dado** que un usuario navega entre pantallas, **Cuando** llega a una nueva sección, **Entonces** el encabezado sigue mostrando el nombre y el logo de la empresa.
2. **Dado** que inician sesión distintos roles, **Cuando** revisan sus paneles, **Entonces** todos ven el mismo nombre y el mismo logo en el encabezado.
3. **Dado** que el encabezado está visible, **Cuando** se revisa el menú lateral, **Entonces** la identidad corporativa no aparece como una opción de menú adicional.
4. **Dado** que una pantalla tiene su propio título, **Cuando** se revisa el encabezado, **Entonces** el nombre de la empresa no sustituye ni duplica ese título.
5. **Dado** que se cargan o restablecen datos, **Cuando** se consulta el encabezado, **Entonces** la identidad corporativa permanece igual.

---

### User Story 3 - Asegurar legibilidad y respaldo visual (Priority: P2)

Como usuario del módulo, quiero que el nombre y el logo sean legibles y que exista una alternativa visual si el logo no está disponible, para no perder la identidad de la empresa por un problema de visualización.

**Why this priority**: El encabezado debe seguir siendo útil incluso cuando el elemento gráfico no puede mostrarse correctamente.

**Independent Test**: Se revisa el encabezado en condiciones normales y con el logo no disponible, y se comprueba que el nombre siga siendo visible y comprensible.

**Acceptance Scenarios**:

1. **Dado** que el encabezado está visible, **Cuando** se revisa su contraste, **Entonces** el nombre de la empresa puede leerse sin dificultad.
2. **Dado** que el logo está disponible, **Cuando** se muestra en pantallas más estrechas, **Entonces** el nombre y el logo permanecen visibles o se presentan de forma legible.
3. **Dado** que el logo no puede mostrarse, **Cuando** se visualiza el encabezado, **Entonces** el nombre "Comercial Los Andes SpA" permanece visible y el espacio del logo conserva una referencia visual clara.
4. **Dado** que el logo está visible, **Cuando** se consulta su descripción accesible, **Entonces** identifica a "Comercial Los Andes SpA" como la empresa ficticia del módulo.
5. **Dado** que se revisa el encabezado, **Cuando** se comparan sus elementos con el resto del módulo, **Entonces** no modifica datos financieros ni el estado de la sesión.

### Edge Cases

- ¿Qué ocurre cuando el logo no está disponible?
- ¿Qué ocurre cuando el nombre de la empresa se muestra en una pantalla estrecha?
- ¿Qué ocurre cuando el encabezado se visualiza en una pantalla con tema claro u oscuro?
- ¿Qué ocurre cuando un rol no tiene permisos para una sección?
- ¿Qué ocurre cuando se cargan o restablecen datos mientras el encabezado está visible?
- ¿Qué ocurre cuando el título de la pantalla coincide parcialmente con el nombre de la empresa?
- ¿Qué ocurre cuando se inicia sesión con cada uno de los roles de prueba?
- ¿Qué ocurre cuando se cierra sesión?
- ¿Qué ocurre cuando el texto del nombre no cabe en una sola línea?
- ¿Qué ocurre cuando la descripción accesible del logo no está definida?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El encabezado del módulo DEBE mostrar el nombre exacto "Comercial Los Andes SpA".
- **FR-002**: El encabezado DEBE mostrar un logo ficticio junto al nombre de la empresa.
- **FR-003**: El nombre y el logo DEBEN mostrarse juntos como identidad corporativa del módulo.
- **FR-004**: El encabezado con la identidad corporativa DEBE estar visible en todas las pantallas del módulo después de una sesión válida.
- **FR-005**: La identidad corporativa DEBE ser la misma para todos los roles de prueba.
- **FR-006**: El encabezado DEBE conservar la identidad corporativa al navegar entre secciones.
- **FR-007**: El nombre de la empresa NO DEBE aparecer como una nueva opción del menú lateral.
- **FR-008**: El nombre de la empresa NO DEBE sustituir ni duplicar el título de la pantalla activa.
- **FR-009**: El logo DEBE ser propio del prototipo y NO DEBE representar una marca real.
- **FR-010**: El nombre y el logo DEBEN ser claramente legibles en el encabezado.
- **FR-011**: Cuando el logo no esté disponible, el encabezado DEBE conservar el nombre de la empresa y una referencia visual clara en su lugar.
- **FR-012**: El logo DEBE contar con una descripción accesible que identifique a "Comercial Los Andes SpA".
- **FR-013**: La identidad corporativa NO DEBE modificar datos financieros, filtros ni el estado de la sesión.
- **FR-014**: La identidad corporativa DEBE permanecer igual después de cargar datos de ejemplo o restablecer datos.
- **FR-015**: En pantallas estrechas, el nombre y el logo DEBEN permanecer visibles o presentarse de forma legible.
- **FR-016**: El encabezado NO DEBE requerir una acción del usuario para mostrar la identidad corporativa.

### Key Entities *(include if feature involves data)*

- **EncabezadoModulo**: Área superior común del módulo que presenta la identidad de la empresa ficticia.
- **EmpresaFicticia**: Organización demostrativa llamada "Comercial Los Andes SpA", propietaria de los datos financieros de ejemplo.
- **LogotipoEmpresa**: Elemento visual ficticio que identifica a "Comercial Los Andes SpA" dentro del encabezado.
- **IdentidadCorporativa**: Combinación del nombre de la empresa y su logotipo presentada de forma consistente en todas las pantallas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las pantallas posteriores al inicio de sesión muestra el nombre exacto "Comercial Los Andes SpA" en el encabezado.
- **SC-002**: El 100% de las pantallas posteriores al inicio de sesión muestra el logotipo junto al nombre de la empresa.
- **SC-003**: El 100% de las verificaciones de texto confirma que el nombre no tiene errores de escritura ni variaciones.
- **SC-004**: El 100% de los roles de prueba ve la misma identidad corporativa en el encabezado.
- **SC-005**: El 100% de las navegaciones entre pantallas conserva el nombre y el logo sin cambios.
- **SC-006**: El 100% de las pruebas de carga y restablecimiento de datos conserva la identidad corporativa.
- **SC-007**: El 100% de las pruebas sin logo disponible mantiene el nombre visible y una referencia visual clara.
- **SC-008**: No se crea ninguna opción adicional de menú a partir de la identidad corporativa.
- **SC-009**: El 95% de los usuarios identifica el nombre de la empresa en el encabezado en menos de 3 segundos.
- **SC-010**: Al menos el 90% de los usuarios encuestados indica que el encabezado ayuda a reconocer la empresa ficticia del módulo.

## Assumptions

- La identidad corporativa se muestra en el encabezado principal del módulo una vez que existe una sesión válida.
- La pantalla de inicio de sesión no forma parte del alcance de este cambio.
- El nombre de la empresa es exactamente "Comercial Los Andes SpA" en todas las pantallas.
- El logo es ficticio, propio del prototipo y no representa una marca real.
- No se solicita configurar ni cambiar el nombre o el logo desde la interfaz.
- Todos los roles de prueba ven la misma identidad corporativa.
- El encabezado es un elemento de identidad y navegación visual, no una opción de menú ni una acción.
- El nombre de la empresa no reemplaza el título de cada pantalla.
- La identidad corporativa no altera datos financieros, filtros ni el estado de la sesión.
- Los datos de ejemplo y el restablecimiento no cambian la identidad corporativa.
- Cuando el logo no esté disponible, se mantiene el nombre y se muestra una referencia visual clara en su lugar.
- La legibilidad y la descripción accesible forman parte de la experiencia básica del encabezado.
