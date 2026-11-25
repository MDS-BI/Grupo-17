# Especificación de la Funcionalidad: Módulo Contabilidad y Finanzas de Software de Planificación de Recursos Empresariales (ERP)

**Rama de la funcionalidad**: 002-contabilidad-finanzas  
**Creada**: 2026-10-29 
**Estado**: Borrador  
**Entrada**: Descripción del usuario: "Desarrollar un módulo de Contabilidad y Finanzas para un sistema ERP, que permita gestionar cuentas contables, registrar asientos contables, administrar pagos y cobros, gestionar periodos contables y consultar reportes financieros."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar historia de usuario 8: inicio de sesión con RUT y contraseña. Roles: Administrador financiero, Contador, Tesorero y Auditor. Crear un usuario de prueba ficticio por rol. Cada rol ve un panel de inicio distinto. Mostrar error si el RUT o la contraseña son incorrectos. Botón de cerrar sesión."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar historia de usuario 9: permisos por rol. Administrador financiero hace todo y abre o cierra periodos. Contador gestiona cuentas y asientos. Tesorero registra pagos y cobros. Auditor solo consulta reportes. El menú oculta lo que el rol no puede usar."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar historia de usuario 10: botón visible en el panel para cargar datos de ejemplo de al menos 4 periodos (cuentas, asientos y pagos) y botón para restablecer datos."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar historia de usuario 11: quitar del menú Entidades, Documentos y Búsqueda. Que no haya dos botones que lleven a la misma pantalla."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar historia de usuario 12: resumen de pagos por estado (pendiente, pagado, vencido) con filtro por estado."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas: eliminar del menú lateral Entidades, Documentos y Búsqueda porque no pertenecen al módulo. El menú lateral solo se muestra después de iniciar sesión y solo con las secciones que el rol puede usar."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Contador, quiero generar Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General por periodo, para conocer la situación financiera de la empresa."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Administrador financiero, quiero cerrar un periodo contable para que nadie pueda registrar ni modificar asientos o pagos en ese periodo."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Administrador financiero, quiero cerrar un periodo contable para que nadie pueda registrar ni modificar asientos o pagos en ese periodo."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Auditor, quiero ver un registro de quién creó, editó o anuló cada asiento y pago, con fecha y hora, para controlar riesgos."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Tesorero, quiero ver en el panel alertas de pagos vencidos y de pagos que vencen esta semana."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: mostrar en el encabezado el nombre de la empresa ficticia \"Comercial Los Andes SpA\" con su logo."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Contador, quiero que cada reporte financiero tenga dos botones, \"Exportar PDF\" y \"Exportar Excel\", que descarguen el reporte del periodo seleccionado con el nombre de la empresa, la fecha y los totales."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como usuario, quiero filtrar asientos y pagos por fecha, cuenta, monto y estado."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como usuario, quiero una interfaz profesional: mismos colores en todo el módulo, íconos en cada sección, tablas ordenables, mensaje de confirmación al guardar o eliminar, y menú adaptable en celular."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, actualizar la historia de inicio de sesión: el campo RUT se formatea automáticamente mientras el usuario escribe (agrega puntos y guion, acepta k mayúscula o minúscula), valida el dígito verificador y muestra un mensaje si el RUT no es válido. El botón Menú del encabezado abre y cierra el menú lateral."
**Entrada adicional**: Descripción del usuario: "Mejora la usabilidad sin cambiar funciones: login centrado y angosto, sin espacio vacío antes de Ingresar; menú lateral alineado a la izquierda; 'Cerrar sesión' en el encabezado junto al usuario y su rol; montos en formato chileno ($5.000, sin decimales); en cada pantalla mostrar primero la lista y un botón 'Nuevo' que abra el formulario en una ventana; la '×' de los filtros sin encimarse con la flecha; alinear la fila de totales del Libro Mayor; y mensajes claros cuando una lista está vacía."
**Entrada adicional**: Descripción del usuario: "En la especificación 002-contabilidad-finanzas, agregar una nueva historia de usuario: como Auditor, quiero ver la unidad CLP en los encabezados monetarios y consultar el detalle detrás de cada total de los reportes financieros, para rastrear cada cifra hasta sus movimientos de origen sin modificar los datos."
**Entrada adicional**: Descripción del usuario: "La empresa es chilena: usa CLP como única moneda en todo el módulo, con formato $5.000 sin decimales; renombra las cuentas de IVA a 'IVA Débito Fiscal' e 'IVA Crédito Fiscal'; actualiza los datos de ejemplo y la especificación."

## Propósito

El objetivo de este módulo es incorporar funcionalidades de contabilidad y finanzas a un sistema ERP, permitiendo organizar y consultar las operaciones económicas de una empresa.

El módulo permitirá gestionar un plan de cuentas contables, registrar asientos contables mediante el principio de partida doble, administrar pagos y cobros, controlar periodos contables y generar reportes de movimientos financieros.

Además, el módulo utilizará las estructuras existentes del ERP base, como Entidades y Documentos, para mantener la relación entre la información financiera y los registros generales de la empresa.

La implementación inicial se enfocará en una interfaz frontend funcional que permita representar y probar las principales operaciones mediante datos de ejemplo, sin requerir una conexión real a una base de datos.

## Clarifications

### Session 2026-11-02

- Q: ¿El alcance MVP debe incluir el registro y la consulta de pagos y cobros descritos en la Historia de Usuario 4? (FR-013–FR-016) → A: Incluir pagos y cobros en el MVP (registro, listado y detalle).
- Q: ¿El MVP debe incluir un ciclo de estados para los asientos contables (borrador → aprobado → cancelado) con bloqueo de edición una vez aprobados? → A: Incluir el ciclo completo: borrador, aprobado y cancelado, con bloqueo de edición tras aprobar.
- Q: Cuando se elimina un Documento que tiene asientos contables asociados, ¿qué comportamiento debe aplicar el sistema? → A: RESTRICT: impedir borrar el documento mientras existan asientos asociados.
- Q: ¿El sistema debe permitir que existan periodos contables con fechas superpuestas? → A: Prohibir cualquier solapamiento entre periodos, abiertos o cerrados.
- Q: ¿El módulo manejará una sola moneda o registrará operaciones en varias monedas? → A: Una sola moneda (CLP) para todo el módulo, sin conversión.

## Escenarios de Usuario y Pruebas 

### Historia de Usuario 1 -  Consultar el resumen financiero (Prioridad: P1)
Como gerente o encargado de finanzas, quiero consultar un resumen de los ingresos, gastos y resultados financieros de la empresa, para conocer su situación económica y facilitar la toma de decisiones.

**Por qué esta prioridad**: El resumen financiero permite visualizar rápidamente la situación económica de la empresa y constituye una herramienta importante para el seguimiento de sus operaciones.

**Prueba Independiente**: Un usuario puede abrir el módulo de Contabilidad y Finanzas, visualizar un panel con los principales indicadores financieros y consultar los valores correspondientes a un periodo determinado.

**Escenarios de Aceptación**:

1. **Dado** que el usuario ingresa al módulo de Contabilidad y Finanzas, **cuando** se carga el panel principal, **entonces** se muestran indicadores de ingresos, gastos y resultado financiero.
2. **Dado** que el panel principal está visible, **cuando** el usuario selecciona un periodo determinado, **entonces** los indicadores se actualizan para mostrar la información correspondiente a ese periodo.
3. **Dado** que existen movimientos contables registrados, **cuando** el usuario consulta el resumen financiero, **entonces** los valores mostrados se calculan a partir de dichos movimientos.
4. **Dado** que no existen movimientos registrados, **cuando** el usuario ingresa al panel, **entonces** se muestra un mensaje indicando que no hay información financiera disponible.

---

### Historia de Usuario 2 - Gestionar cuentas contables (Prioridad: P1)
Como contador o administrador contable, quiero crear, consultar, editar y organizar las cuentas contables de la empresa, para mantener una estructura ordenada que permita clasificar sus operaciones financieras.

**Por qué esta prioridad**: El plan de cuentas es la base para registrar y clasificar las operaciones contables. Sin él, no es posible organizar correctamente los movimientos financieros.

**Prueba Independiente**: Un usuario puede ingresar a la sección de cuentas contables, crear una cuenta, visualizarla en el listado y modificar su información.

**Escenarios de Aceptación**:

1. **Dado** que el usuario se encuentra en la sección de cuentas contables, **cuando** crea una cuenta ingresando su código, nombre y tipo, **entonces** la cuenta se guarda y aparece en el listado.
2. **Dado** que el usuario está creando una cuenta contable, **cuando** deja vacío alguno de los campos obligatorios, **entonces** el sistema impide guardar y muestra un mensaje indicando la información faltante.
3. **Dada** una cuenta contable existente, **cuando** el usuario modifica su nombre, descripción o estado, **entonces** los cambios se guardan y se reflejan en el listado.
4. **Dadas** varias cuentas contables, **cuando** el usuario organiza las cuentas mediante una relación jerárquica, **entonces** el sistema permite identificar las cuentas principales y sus respectivas subcuentas.

---

### Historia de Usuario 3 - Registrar asientos contables (Prioridad: P1)

Como contador, quiero registrar asientos contables indicando las cuentas involucradas y sus respectivos cargos y abonos, para mantener un registro ordenado de las operaciones financieras de la empresa.

**Por qué esta prioridad**: El registro de asientos contables constituye una de las funciones centrales del módulo, ya que permite documentar las operaciones económicas aplicando el principio de partida doble.

**Prueba Independiente**: Un usuario puede crear un asiento contable, agregar líneas con sus respectivas cuentas y montos, y guardar el registro cuando se cumple la igualdad entre débitos y créditos.

**Escenarios de Aceptación**:

1. **Dado** que el usuario se encuentra en la sección de asientos contables, **cuando** registra un nuevo asiento con fecha, concepto y cuentas involucradas, **entonces** el sistema permite ingresar sus respectivas líneas contables.
2. **Dado** que el usuario está registrando un asiento, **cuando** agrega una línea contable, **entonces** debe seleccionar una cuenta e indicar un monto en el debe o en el haber.
3. **Dado** que el usuario ha ingresado todas las líneas del asiento, **cuando** la suma de los débitos coincide con la suma de los créditos, **entonces** el sistema permite guardar el asiento.
4. **Dado** que el usuario intenta guardar un asiento, **cuando** los débitos y créditos no coinciden, **entonces** el sistema impide guardar y muestra un mensaje indicando que el asiento debe estar cuadrado.
5. **Dado** que el usuario intenta guardar un asiento sin líneas contables suficientes, **cuando** confirma el registro, **entonces** el sistema informa que debe ingresar al menos dos líneas contables.

---

### Historia de Usuario 4 - Registrar y consultar pagos (Prioridad: P1)

Como encargado de tesorería, quiero registrar y consultar los pagos y cobros realizados por la empresa, para mantener un control de los movimientos de dinero y su relación con las entidades y documentos correspondientes.

**Por qué esta prioridad**: El registro de pagos y cobros permite realizar un seguimiento de las operaciones financieras y mantener relacionada la información de los movimientos de dinero con clientes, proveedores y documentos asociados.

**Prueba Independiente**: Un usuario puede registrar un pago o cobro indicando su monto, fecha, tipo y entidad relacionada, y posteriormente visualizarlo en el listado de pagos.

**Escenarios de Aceptación**:

1. **Dado** que el usuario se encuentra en la sección de pagos, **cuando** registra un nuevo pago o cobro ingresando la fecha, monto, tipo y entidad relacionada, **entonces** el sistema guarda el registro y lo muestra en el listado.
2. **Dado** que el usuario está registrando un pago, **cuando** selecciona una entidad existente, **entonces** el pago queda asociado a dicha entidad
3. **Dado** que el usuario registra un pago relacionado con un documento, **cuando** selecciona el documento correspondiente, **entonces** el sistema mantiene la relación entre ambos registros.
4. **Dada** una lista de pagos registrados, **cuando** el usuario selecciona uno de ellos, **entonces** puede consultar sus detalles
5. **Dado** que el usuario intenta registrar un pago sin completar los campos obligatorios, **cuando** confirma el registro, **entonces** el sistema impide guardar y muestra un mensaje indicando la información faltante.

---

### Historia de Usuario 5 - Gestionar periodos contables (Prioridad: P1)

Como administrador contable, quiero crear, consultar y gestionar los periodos contables de la empresa, para organizar los registros financieros según intervalos de tiempo y controlar cuáles periodos se encuentran abiertos o cerrados.

**Por qué esta prioridad**: La gestión de periodos permite organizar cronológicamente las operaciones contables y evitar que se registren nuevos movimientos en periodos que ya fueron cerrados.

**Prueba Independiente**: Un usuario puede crear un periodo contable indicando su fecha de inicio y término, visualizarlo en un listado y cambiar su estado entre abierto y cerrado.

**Escenarios de Aceptación**:

1. **Dado** que el usuario se encuentra en la sección de periodos contables, **cuando** crea un nuevo periodo indicando su nombre, fecha de inicio y fecha de término, **entonces** el sistema guarda el periodo y lo muestra en el listado.
2. **Dado** que el usuario está creando un periodo contable, **cuando** ingresa una fecha de término anterior a la fecha de inicio, **entonces** el sistema impide guardar y muestra un mensaje de validación.
3. **Dado** que existe un periodo contable abierto, **cuando** el administrador cambia su estado a cerrado, **entonces** el sistema actualiza su estado y lo identifica como cerrado.
4. **Dado** que un periodo contable se encuentra cerrado, **cuando** un usuario intenta registrar un nuevo asiento contable dentro de ese periodo, **entonces** el sistema impide el registro y muestra un mensaje indicando que el periodo está cerrado.
5. **Dado** que existen varios periodos contables, **cuando** el usuario consulta el listado, **entonces** puede identificar cuáles se encuentran abiertos y cuáles cerrados.

---

### Historia de Usuario 6 - Generar y consultar reportes financieros (Prioridad: P2)

Como analista financiero o contador, quiero generar y consultar reportes de los movimientos contables de la empresa durante un periodo determinado, para analizar las operaciones realizadas y facilitar la elaboración de informes financieros.

**Por qué esta prioridad**: Los reportes permiten transformar los registros contables en información organizada y útil para analizar las operaciones de la empresa. Aunque dependen de que existan movimientos registrados, son importantes para apoyar el seguimiento y la toma de decisiones financieras.

**Prueba Independiente**: Un usuario puede ingresar a la sección de reportes, seleccionar un periodo contable y visualizar los movimientos correspondientes, incluyendo las cuentas involucradas, los débitos y los créditos.

**Escenarios de Aceptación**:

1. **Dado** que el usuario se encuentra en la sección de reportes financieros, **cuando** selecciona un periodo contable, **entonces** el sistema muestra los movimientos registrados dentro de ese periodo.
2. **Dado** que existen asientos contables registrados, **cuando** el usuario genera un reporte, **entonces** se muestra información como la fecha, el concepto, las cuentas involucradas y sus respectivos débitos y créditos.
3. **Dado** que el usuario consulta un reporte financiero, **cuando** se muestran los movimientos del periodo, **entonces** el sistema presenta los totales de débitos y créditos.
4. **Dado** que el usuario selecciona un periodo sin movimientos registrados, **cuando** genera el reporte, **entonces** el sistema muestra un mensaje indicando que no existen registros para ese periodo.
5. **Dado** que el usuario cambia el periodo seleccionado, **cuando** solicita nuevamente el reporte, **entonces** la información se actualiza de acuerdo con el nuevo periodo.

---

### Historia de Usuario 7 - Consultar el análisis financiero visual del panel (Prioridad: P2)

Como gerente o analista financiero, quiero visualizar gráficas de ingresos, gastos, resultado y distribución de gastos por cuenta en el panel principal, para interpretar rápidamente la evolución y la composición de las operaciones de la empresa.

**Por qué esta prioridad**: Las gráficas complementan los indicadores del resumen y hacen más evidentes las tendencias y la concentración de gastos sin sustituir las tablas ni los reportes financieros.

**Prueba Independiente**: Un usuario abre el panel, selecciona un periodo contable y observa las gráficas de barras, de línea y de dona actualizadas con los movimientos aprobados de ese periodo, además de mensajes cuando no hay datos.

**Escenarios de Aceptación**:

1. **Dado** que el usuario abre el panel principal, **cuando** se cargan las gráficas, **entonces** se muestran la comparación de ingresos y gastos por periodo, la evolución del resultado y la distribución de gastos por cuenta.
2. **Dado** que el panel está visible, **cuando** el usuario selecciona un periodo contable, **entonces** las gráficas se actualizan con la información correspondiente a ese periodo.
3. **Dado** que existen movimientos contables aprobados, **cuando** se renderizan las gráficas, **entonces** los valores provienen de los mismos cálculos de resumen y saldos utilizados por los reportes.
4. **Dado** que no existen periodos o movimientos registrados, **cuando** se cargan las gráficas, **entonces** se muestran mensajes de estado vacío en español en lugar de gráficas sin información.
5. **Dado** que el usuario consulta una gráfica, **cuando** revisa las etiquetas o herramientas de cada punto, **entonces** los importes se muestran en CLP con el mismo formato que el resto del módulo.

---

### Historia de Usuario 8 - Iniciar sesión con RUT y contraseña (Prioridad: P1)

Como administrador financiero, contador, tesorero o auditor, quiero acceder al módulo identificándome con mi RUT y mi contraseña, para ingresar a un panel de inicio acorde a mi responsabilidad y evitar que otras personas utilicen mi acceso. El RUT debe formatearse automáticamente mientras escribo, validar su dígito verificador y avisarme si no es válido; además, el botón "Menú" del encabezado debe permitirme abrir y cerrar el menú lateral.

**Por qué esta prioridad**: El acceso identificado permite que cada usuario del área financiera vea el punto de partida relevante para su rol y establece la base para cualquier operación posterior dentro del módulo. El formateo y la validación del RUT reducen errores de captura, y el control del menú desde el encabezado mantiene la navegación accesible sin cambiar de pantalla.

**Prueba Independiente**: Un usuario de prueba de cada rol puede escribir su RUT con o sin puntos ni guion y con el dígito verificador en mayúscula o minúscula cuando corresponda, comprobar que se formatea y valida, iniciar sesión con su contraseña, verificar el panel según su rol, abrir y cerrar el menú lateral desde el encabezado, cerrar sesión y comprobar que se solicitan nuevamente las credenciales.

**Escenarios de Aceptación**:

1. **Dado** que un usuario de prueba se encuentra en la pantalla de acceso, **cuando** ingresa su RUT y contraseña correctos, **entonces** el sistema lo reconoce y muestra el panel de inicio correspondiente a su rol.
2. **Dado** que el usuario autenticado es el Administrador financiero, **cuando** carga su panel, **entonces** ve un resumen integral de la situación financiera, el estado de los periodos y los asuntos que requieren su atención.
3. **Dado** que el usuario autenticado es el Contador, **cuando** carga su panel, **entonces** ve el plan de cuentas, los asientos pendientes y los reportes contables disponibles.
4. **Dado** que el usuario autenticado es el Tesorero, **cuando** carga su panel, **entonces** ve los pagos y cobros recientes, el flujo de efectivo y las entidades o documentos relacionados.
5. **Dado** que el usuario autenticado es el Auditor, **cuando** carga su panel, **entonces** ve la trazabilidad de movimientos, los reportes emitidos y el historial de cambios disponible para consulta.
6. **Dado** que un usuario ingresa un RUT que no corresponde a un usuario de prueba, **cuando** confirma el acceso, **entonces** el sistema muestra el mensaje "RUT o contraseña incorrectos" y no abre ningún panel.
7. **Dado** que un usuario ingresa una contraseña incorrecta para un RUT válido, **cuando** confirma el acceso, **entonces** el sistema muestra el mismo mensaje de error y no abre ningún panel.
8. **Dado** que un usuario omite el RUT o la contraseña, **cuando** confirma el acceso, **entonces** el sistema indica qué dato falta y no abre ningún panel.
9. **Dado** que un usuario ha iniciado sesión, **cuando** selecciona "Cerrar sesión", **entonces** el sistema finaliza el acceso, vuelve a la pantalla de inicio de sesión y no permite continuar en el panel anterior sin volver a autenticarse.
10. **Dado** que un usuario escribe su RUT en la pantalla de acceso, **cuando** ingresa solo los dígitos, **entonces** el campo muestra el RUT con puntos de agrupación y guion antes del dígito verificador sin borrar ni duplicar caracteres.
11. **Dado** que el usuario continúa escribiendo el RUT, **cuando** llega al dígito verificador, **entonces** el guion se mantiene en la posición correcta y el valor final queda con el formato chileno esperado.
12. **Dado** que el RUT de prueba termina en K, **cuando** el usuario escribe `k` en minúscula o `K` en mayúscula, **entonces** el sistema acepta ambas formas como equivalentes, las presenta de forma consistente y permite continuar con la autenticación.
13. **Dado** que un usuario pega un RUT sin formato, **cuando** el valor se coloca en el campo, **entonces** el sistema aplica el mismo formateo automático que al escribirlo manualmente.
14. **Dado** que un usuario corrige o borra caracteres del RUT, **cuando** edita el campo, **entonces** el formato se recalcula sin impedir la corrección ni dejar signos sobrantes.
15. **Dado** que el usuario completa un RUT con un dígito verificador que no coincide con la validación chilena, **cuando** confirma el acceso, **entonces** el sistema muestra el mensaje "El RUT ingresado no es válido" y no abre ningún panel.
16. **Dado** que el usuario completa un RUT válido que no corresponde a ningún usuario de prueba, **cuando** confirma el acceso con cualquier contraseña, **entonces** el sistema muestra el mensaje "RUT o contraseña incorrectos" y no abre ningún panel.
17. **Dado** que el usuario ingresa un RUT de prueba con formato sin puntos ni guion, **cuando** confirma el acceso con su contraseña correcta, **entonces** el sistema lo autentica igual que con el RUT puntuado.
18. **Dado** que un usuario autenticado ve el encabezado, **cuando** selecciona el botón "Menú" con el menú lateral cerrado, **entonces** el menú lateral se abre y muestra únicamente las secciones permitidas para su rol.
19. **Dado** que el menú lateral está abierto, **cuando** el usuario selecciona nuevamente el botón "Menú", **entonces** el menú se cierra sin cambiar de pantalla, sin cerrar sesión y sin modificar datos.
20. **Dado** que un usuario cerró sesión, **cuando** revisa el encabezado de la pantalla de acceso, **entonces** no puede abrir el menú lateral sin autenticarse de nuevo.

**Usuarios de prueba ficticios**:

| Rol | RUT | Contraseña | Panel de inicio esperado |
|-----|-----|------------|--------------------------|
| Administrador financiero | 11.111.111-4 | Admin2026! | Resumen integral, periodos y asuntos prioritarios |
| Contador | 22.222.222-8 | Contador2026! | Cuentas, asientos y reportes contables |
| Tesorero | 33.333.333-1 | Tesorero2026! | Pagos, cobros y flujo de efectivo |
| Auditor | 88.888.888-K | Auditor2026! | Trazabilidad, reportes e historial |

---

### Historia de Usuario 9 - Aplicar permisos por rol en el menú (Prioridad: P1)

Como usuario autenticado del módulo, quiero que el menú muestre únicamente las funciones que mi rol puede usar, para evitar intentos de operaciones no autorizadas y trabajar con una interfaz clara acorde a mi responsabilidad.

**Por qué esta prioridad**: Los roles financieros tienen responsabilidades distintas. Mostrar solo las acciones permitidas reduce errores, protege la información sensible y hace evidente quién puede afectar cuentas, asientos, movimientos de dinero o periodos contables.

**Prueba Independiente**: Se inicia sesión con cada usuario de prueba y se verifica que el menú contenga únicamente sus opciones permitidas y que cualquier intento de abrir una sección ajena sea bloqueado con un mensaje claro.

**Escenarios de Aceptación**:

1. **Dado** que inicia sesión el Administrador financiero, **cuando** se carga el menú, **entonces** ve todas las secciones del módulo, incluida la gestión de periodos con la acción de abrir o cerrar cada periodo.
2. **Dado** que inicia sesión el Contador, **cuando** se carga el menú, **entonces** ve Cuentas contables, Asientos contables y Reportes, y no ve Pagos y cobros ni Gestión de periodos.
3. **Dado** que inicia sesión el Tesorero, **cuando** se carga el menú, **entonces** ve Pagos y cobros, y no ve Cuentas contables, Asientos contables, Gestión de periodos ni Reportes.
4. **Dado** que inicia sesión el Auditor, **cuando** se carga el menú, **entonces** ve únicamente Reportes en modo de consulta y no ve opciones para crear, editar, eliminar ni cambiar estados.
5. **Dado** que un usuario intenta abrir una sección que su rol no puede usar, **cuando** realiza la acción, **entonces** el sistema muestra un mensaje de acceso no disponible y no presenta la información de esa sección.
6. **Dado** que el Contador registra un asiento, **cuando** necesita seleccionar el periodo, **entonces** puede elegir un periodo abierto sin que se muestre la opción de cambiar su estado.
7. **Dado** que el Tesorero consulta un pago, **cuando** revisa sus relaciones, **entonces** puede ver la entidad asociada sin acceder a la gestión de esa estructura; la consulta de documentos asociados a pagos queda fuera del MVP.
8. **Dado** que el Auditor consulta un reporte, **cuando** revisa la información, **entonces** puede filtrar por periodo pero no encuentra acciones de modificación sobre movimientos ni periodos.

**Matriz de acceso por rol**:

| Sección del menú | Administrador financiero | Contador | Tesorero | Auditor |
|------------------|--------------------------|----------|----------|---------|
| Panel de inicio del rol | Ver | Ver | Ver | Ver |
| Cuentas contables | Gestionar | Gestionar | No disponible | No disponible |
| Asientos contables | Gestionar | Gestionar | No disponible | No disponible |
| Pagos y cobros | Gestionar | No disponible | Registrar y consultar | No disponible |
| Periodos contables | Gestionar y abrir/cerrar | No disponible | No disponible | No disponible |
| Reportes financieros | Consultar | Consultar | No disponible | Consultar |
| Entidades | No disponible | No disponible | No disponible | No disponible |
| Documentos | No disponible | No disponible | No disponible | No disponible |
| Búsqueda | No disponible | No disponible | No disponible | No disponible |

---

### Historia de Usuario 10 - Cargar y restablecer datos de ejemplo (Prioridad: P1)

Como Administrador financiero, quiero tener en mi panel un botón para cargar datos de ejemplo y otro para restablecerlos, para preparar demostraciones y pruebas de forma rápida, repetible y sin depender de datos reales.

**Por qué esta prioridad**: El módulo se demuestra con información ficticia. Contar con acciones visibles permite iniciar cada prueba desde un estado conocido y recuperarse después de haber modificado la información durante una demostración.

**Prueba Independiente**: El Administrador financiero carga la semilla, verifica la presencia de al menos cuatro periodos con cuentas, asientos y pagos, y luego restablece los datos para comprobar que el módulo vuelve a su estado inicial.

**Escenarios de Aceptación**:

1. **Dado** que el Administrador financiero abre su panel, **cuando** revisa las acciones disponibles, **entonces** ve de forma visible los botones "Cargar datos de ejemplo" y "Restablecer datos".
2. **Dado** que no existen datos financieros cargados, **cuando** el Administrador selecciona "Cargar datos de ejemplo", **entonces** el sistema carga una semilla determinista con al menos cuatro periodos contables no superpuestos, al menos ocho cuentas contables, al menos ocho asientos contables aprobados y al menos cuatro pagos o cobros, con al menos un asiento y un pago por periodo.
3. **Dado** que ya existen datos de ejemplo o registros creados, **cuando** el Administrador selecciona "Cargar datos de ejemplo" y confirma la acción, **entonces** el sistema reemplaza el conjunto anterior por la semilla sin duplicar periodos, cuentas, asientos ni pagos.
4. **Dado** que la semilla fue cargada, **cuando** el Administrador consulta periodos, cuentas, asientos, pagos, reportes y gráficas, **entonces** todos muestran información coherente con los datos cargados.
5. **Dado** que se carga la semilla en dos ocasiones distintas, **cuando** se comparan los resultados, **entonces** periodos, importes, fechas y cantidades son idénticos.
6. **Dado** que el Administrador selecciona "Restablecer datos" y confirma la acción, **cuando** finaliza el proceso, **entonces** el módulo vuelve a un estado inicial válido sin registros financieros, conservando los usuarios de prueba.
7. **Dado** que se restablecen los datos mientras existen asientos, pagos y documentos relacionados, **cuando** se revisa el estado resultante, **entonces** no quedan referencias rotas ni totales incoherentes.
8. **Dado** que un usuario con rol Contador, Tesorero o Auditor abre su panel, **cuando** revisa las acciones disponibles, **entonces** no ve los botones de carga ni de restablecimiento.
9. **Dado** que el Administrador cancela la confirmación de alguna de estas acciones, **cuando** se cierra el mensaje, **entonces** los datos permanecen sin cambios.

---

### Historia de Usuario 11 - Simplificar el menú y eliminar navegación duplicada (Prioridad: P1)

Como usuario del módulo, quiero que el menú no muestre Entidades, Documentos ni Búsqueda y que cada pantalla tenga una sola forma de acceso, para encontrar lo que necesito sin opciones confusas ni rutas repetidas.

**Por qué esta prioridad**: Las secciones del ERP base no forman parte del flujo del módulo financiero y su presencia, junto con controles duplicados, dificulta la navegación y genera ambigüedad sobre dónde realizar cada tarea.

**Prueba Independiente**: Se revisa el menú y el panel de cada rol, se comprueba que Entidades, Documentos y Búsqueda no aparecen y se verifica que ninguna pantalla sea abierta por más de un control visible.

**Escenarios de Aceptación**:

1. **Dado** que inicia sesión cualquiera de los cuatro roles, **cuando** se carga el menú, **entonces** no se muestran las opciones "Entidades", "Documentos" ni "Búsqueda".
2. **Dado** que un usuario revisa su panel de inicio, **cuando** busca accesos a esas tres áreas, **entonces** no encuentra botones ni enlaces que lleven a ellas.
3. **Dado** que el Tesorero registra un pago, **cuando** necesita una entidad o un documento, **entonces** puede seleccionarlo dentro del formulario sin que exista una sección independiente para administrarlo.
4. **Dado** que un usuario necesita localizar un registro, **cuando** utiliza una sección permitida, **entonces** aplica los filtros disponibles en esa sección sin una pantalla global de "Búsqueda".
5. **Dado** que se revisan todos los controles visibles de menú y panel, **cuando** se comparan sus destinos, **entonces** cada pantalla tiene un único control que la abre.
6. **Dado** que dos controles con etiquetas distintas apuntan a la misma pantalla, **cuando** se aplica esta historia, **entonces** se conserva una sola opción coherente con la matriz de permisos y se elimina la otra.
7. **Dado** que un usuario intenta abrir una pantalla eliminada del menú, **cuando** realiza la acción, **entonces** el sistema muestra un mensaje de sección no disponible y no presenta su contenido.
8. **Dado** que un usuario abre el panel del Administrador financiero, **cuando** identifica los botones "Cargar datos de ejemplo", "Restablecer datos" y "Cerrar sesión", **entonces** los reconoce como acciones y no como accesos duplicados a pantallas del menú.
9. **Dado** que una persona abre el módulo sin iniciar sesión, **cuando** se muestra la pantalla de acceso, **entonces** no se muestra el menú lateral con secciones del módulo.
10. **Dado** que un usuario autenticado selecciona "Cerrar sesión", **cuando** finaliza el cierre, **entonces** el menú lateral desaparece y no reaparece al volver a una pantalla anterior sin autenticarse de nuevo.
11. **Dado** que un usuario inicia sesión con un rol válido, **cuando** se carga el menú lateral, **entonces** el menú contiene únicamente las secciones que ese rol puede usar según la matriz de acceso.

**Mapa de navegación única**:

| Pantalla | Único control que la abre | Roles con acceso |
|----------|---------------------------|------------------|
| Panel de inicio del rol | Inicio de sesión correcto | Administrador financiero, Contador, Tesorero, Auditor |
| Cuentas contables | "Cuentas contables" en el menú | Administrador financiero, Contador |
| Asientos contables | "Asientos contables" en el menú | Administrador financiero, Contador |
| Pagos y cobros | "Pagos y cobros" en el menú | Administrador financiero, Tesorero |
| Periodos contables | "Periodos contables" en el menú | Administrador financiero |
| Reportes financieros | "Reportes financieros" en el menú | Administrador financiero, Contador, Auditor |
| Entidades | Sin control de navegación | Ninguno |
| Documentos | Sin control de navegación | Ninguno |
| Búsqueda | Sin control de navegación | Ninguno |

---

### Historia de Usuario 12 - Resumir pagos por estado (Prioridad: P1)

Como Tesorero o Administrador financiero, quiero ver un resumen de pagos y cobros agrupado por pendiente, pagado y vencido, con un filtro por estado, para priorizar gestiones y conocer de un vistazo qué movimientos requieren atención.

**Por qué esta prioridad**: La tesorería necesita distinguir rápidamente entre lo que aún debe gestionarse, lo que ya se concretó y lo que se atrasó. Un resumen con filtro evita revisar la lista completa para identificar prioridades.

**Prueba Independiente**: Un usuario con acceso a pagos carga los datos de ejemplo, consulta el resumen, aplica cada filtro de estado y comprueba que los importes y las cantidades coinciden con el listado mostrado.

**Escenarios de Aceptación**:

1. **Dado** que un usuario con acceso a pagos abre la pantalla "Pagos y cobros", **cuando** se carga la información, **entonces** ve un resumen con la cantidad y el total en CLP de los estados pendiente, pagado y vencido.
2. **Dado** que el resumen está visible, **cuando** el usuario selecciona el filtro "Pendiente", **entonces** el listado muestra únicamente pagos y cobros pendientes y ese estado queda destacado en el resumen sin ocultar los otros totales.
3. **Dado** que el usuario selecciona el filtro "Pagado", **cuando** se aplica el filtro, **entonces** el listado muestra únicamente pagos y cobros pagados.
4. **Dado** que el usuario selecciona el filtro "Vencido", **cuando** se aplica el filtro, **entonces** el listado muestra únicamente pagos y cobros cuya fecha de vencimiento ya pasó y que no están pagados.
5. **Dado** que el usuario selecciona "Todos", **cuando** se aplica el filtro, **entonces** se muestran todos los pagos y cobros sin importar su estado.
6. **Dado** que un pago pendiente supera su fecha de vencimiento, **cuando** se consulta el resumen, **entonces** el pago se contabiliza como vencido y deja de contarse como pendiente.
7. **Dado** que un pago se marca como pagado, **cuando** se actualiza el resumen, **entonces** su importe pasa del estado anterior al de pagado de forma inmediata.
8. **Dado** que un usuario sin acceso a pagos abre su panel, **cuando** revisa la información disponible, **entonces** no ve el resumen ni el filtro por estado.
9. **Dado** que no existen pagos registrados, **cuando** se consulta el resumen, **entonces** se muestran ceros en cada estado y un mensaje de estado vacío.
10. **Dado** que se aplica un filtro sin resultados, **cuando** se revisa el listado, **entonces** se muestra un mensaje indicando que no hay pagos con ese estado.

---

### Historia de Usuario 13 - Generar estados financieros por periodo (Prioridad: P1)

Como Contador, quiero generar Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General por periodo, para conocer la situación financiera de la empresa.

**Por qué esta prioridad**: Estos reportes transforman los asientos contables aprobados en información organizada para analizar la posición y el desempeño financiero. El Libro Mayor aporta trazabilidad, el Balance de Comprobación valida la igualdad contable, el Estado de Resultados resume ingresos y gastos, y el Balance General muestra activos, pasivos y patrimonio al cierre del periodo.

**Prueba Independiente**: El Contador selecciona un periodo con asientos aprobados, genera los cuatro reportes desde la sección "Reportes financieros" y verifica que los saldos y totales sean coherentes entre sí y con los movimientos de origen.

**Escenarios de Aceptación**:

1. **Dado** que existen asientos contables aprobados en un periodo, **cuando** el Contador selecciona ese periodo y genera el Libro Mayor, **entonces** el reporte muestra para cada cuenta con movimientos su código, nombre, saldo inicial, total de débitos, total de créditos y saldo final.
2. **Dado** que existen movimientos aprobados en periodos anteriores, **cuando** se genera el Libro Mayor de un periodo posterior, **entonces** el saldo inicial de cada cuenta se deriva de los movimientos aprobados anteriores a ese periodo.
3. **Dado** que existen asientos en borrador o cancelado dentro del periodo, **cuando** se generan los reportes, **entonces** esos movimientos se excluyen de los importes mostrados.
4. **Dado** que el Contador genera el Balance de Comprobación de un periodo con saldos, **cuando** revisa los totales, **entonces** la suma de saldos deudores es igual a la suma de saldos acreedores.
5. **Dado** que una cuenta tiene saldo cero al cierre del periodo, **cuando** se genera el Balance de Comprobación, **entonces** esa cuenta no se incluye en el listado de saldos.
6. **Dado** que los totales del Balance de Comprobación no cumplen la igualdad contable, **cuando** se genera el reporte, **entonces** se muestra una advertencia clara y el reporte no se presenta como válido.
7. **Dado** que existen asientos aprobados con cuentas de ingreso y gasto en un periodo, **cuando** se genera el Estado de Resultados, **entonces** el reporte muestra los ingresos, los gastos y el resultado financiero del periodo.
8. **Dado** que el Estado de Resultados está visible, **cuando** se revisa el resultado, **entonces** este es igual a la suma de ingresos menos la suma de gastos del periodo seleccionado.
9. **Dado** que existen saldos aprobados de cuentas de activo, pasivo y patrimonio al cierre de un periodo, **cuando** se genera el Balance General, **entonces** el reporte muestra activos, pasivos y patrimonio con sus totales correspondientes.
10. **Dado** que el Balance General está visible, **cuando** se revisan los totales, **entonces** el total de activos es igual a la suma del total de pasivos y el total de patrimonio, incluyendo el resultado acumulado en el patrimonio.
11. **Dado** que una cuenta no tiene un tipo que permita clasificarla como activo, pasivo, patrimonio, ingreso o gasto, **cuando** se genera el Estado de Resultados o el Balance General, **entonces** se muestra una advertencia que identifica la cuenta que impide completar el reporte.
12. **Dado** que un periodo no tiene movimientos aprobados ni saldos, **cuando** se generan los cuatro reportes, **entonces** cada uno muestra un mensaje de estado vacío en español.
13. **Dado** que el Contador cambia el periodo seleccionado, **cuando** genera nuevamente cualquier reporte, **entonces** la información se actualiza por completo para el nuevo periodo.
14. **Dado** que un periodo está cerrado, **cuando** se generan los reportes de ese periodo, **entonces** se muestran los saldos históricos sin modificar el estado del periodo ni los movimientos.
15. **Dado** que se revisa el menú lateral, **cuando** se comparan sus entradas con la configuración vigente, **entonces** no se crea ninguna opción nueva para estos reportes.
16. **Dado** que un rol sin acceso a "Reportes financieros" intenta abrir estos reportes directamente, **cuando** realiza la acción, **entonces** se muestra un mensaje de acceso no disponible y no se revela información financiera.
17. **Dado** que un reporte está visible, **cuando** se revisan sus importes y acciones, **entonces** los importes se muestran en CLP con el mismo formato del módulo y no existen opciones para capturar cifras manualmente ni modificar movimientos.

---

### Historia de Usuario 14 - Cerrar un periodo contable (Prioridad: P1)

Como Administrador financiero, quiero cerrar un periodo contable para que nadie pueda registrar ni modificar asientos o pagos en ese periodo.

**Por qué esta prioridad**: El cierre protege la integridad de la información financiera al impedir cambios posteriores en los movimientos de un periodo ya finalizado y evita que los reportes consultados dejen de ser confiables.

**Prueba Independiente**: El Administrador financiero cierra un periodo abierto, confirma la acción y verifica que no sea posible registrar, editar, eliminar ni cambiar el estado de asientos o pagos de ese periodo, mientras los reportes sigan disponibles para consulta.

**Escenarios de Aceptación**:

1. **Dado** que existe un periodo contable abierto, **cuando** el Administrador financiero selecciona cerrarlo y confirma la acción, **entonces** el periodo queda marcado como cerrado en el listado.
2. **Dado** que un periodo tiene asientos y pagos registrados, **cuando** el Administrador financiero lo cierra, **entonces** los registros existentes se conservan sin cambios y solo su estado pasa a cerrado.
3. **Dado** que un periodo está abierto, **cuando** el Administrador financiero inicia el cierre y cancela la confirmación, **entonces** el periodo permanece abierto y no se aplica ningún bloqueo.
4. **Dado** que un periodo ya está cerrado, **cuando** el Administrador financiero intenta cerrarlo de nuevo, **entonces** no se permite la acción y se muestra un mensaje claro.
5. **Dado** que un periodo está cerrado, **cuando** cualquier usuario intenta registrar un asiento con fecha correspondiente a ese periodo, **entonces** el sistema impide el registro y muestra un mensaje indicando que el periodo está cerrado.
6. **Dado** que existe un asiento en un periodo cerrado, **cuando** cualquier usuario intenta editarlo, eliminarlo o cambiar su estado, **entonces** el sistema bloquea la acción y no guarda cambios.
7. **Dado** que existe un asiento en un periodo abierto, **cuando** un usuario intenta cambiar su fecha a un periodo cerrado, **entonces** el sistema bloquea el cambio y mantiene el asiento en su periodo original.
8. **Dado** que un periodo está cerrado, **cuando** cualquier usuario intenta registrar un pago o cobro con fecha correspondiente a ese periodo, **entonces** el sistema impide el registro y muestra el mensaje de periodo cerrado.
9. **Dado** que existe un pago o cobro en un periodo cerrado, **cuando** cualquier usuario intenta modificarlo, marcarlo como pagado o eliminarlo, **entonces** el sistema bloquea la acción y conserva el registro.
10. **Dado** que existe un pago o cobro en un periodo abierto, **cuando** un usuario intenta cambiar su fecha a un periodo cerrado, **entonces** el sistema bloquea el cambio y mantiene el registro en su periodo original.
11. **Dado** que un asiento o pago estaba abierto para edición antes de cerrar el periodo, **cuando** el usuario intenta guardar después del cierre, **entonces** el sistema rechaza el guardado y muestra el mensaje de periodo cerrado.
12. **Dado** que el propio Administrador financiero intenta modificar un asiento o pago del periodo cerrado, **cuando** confirma la acción, **entonces** el sistema también lo bloquea porque el cierre aplica a todos los roles.
13. **Dado** que un periodo cerrado tiene asientos y pagos registrados, **cuando** un usuario autorizado consulta listados o reportes de ese periodo, **entonces** puede ver la información sin encontrar acciones de creación, edición, eliminación ni cambio de estado.
14. **Dado** que inicia sesión el Contador, el Tesorero o el Auditor, **cuando** abre la gestión de periodos, **entonces** no ve la acción para cerrar periodos.
15. **Dado** que un rol distinto del Administrador financiero intenta cerrar un periodo directamente, **cuando** realiza la acción, **entonces** el sistema bloquea la operación y muestra un mensaje de acceso no disponible.
16. **Dado** que se cierra un periodo, **cuando** se revisan otros periodos, **entonces** sus estados y operaciones permanecen sin cambios.
17. **Dado** que no existe un periodo seleccionado para cerrar, **cuando** se intenta aplicar el cierre, **entonces** el sistema no realiza cambios y muestra un mensaje claro.

---

### Historia de Usuario 15 - Cerrar un periodo contable para bloquear movimientos (Prioridad: P1)

Como Administrador financiero, quiero cerrar un periodo contable para que nadie pueda registrar ni modificar asientos o pagos en ese periodo.

**Por qué esta prioridad**: Refuerza la integridad financiera al congelar un intervalo ya finalizado y evitar que cambios posteriores alteren saldos, resúmenes y reportes previamente consultados.

**Prueba Independiente**: El Administrador financiero cierra un periodo abierto y se comprueba que los asientos y pagos de ese periodo no puedan crearse, editarse, eliminarse ni cambiar de estado, mientras la consulta y los reportes permanezcan disponibles.

**Escenarios de Aceptación**:

1. **Dado** que existe un periodo abierto, **cuando** el Administrador financiero confirma su cierre, **entonces** el periodo queda marcado como cerrado y se muestra claramente en el listado.
2. **Dado** que el cierre se cancela, **cuando** se cierra la confirmación, **entonces** el periodo permanece abierto y sin cambios.
3. **Dado** que un periodo ya está cerrado, **cuando** se intenta cerrarlo nuevamente, **entonces** el sistema rechaza la acción y muestra un mensaje claro.
4. **Dado** que un periodo está cerrado, **cuando** cualquier rol intenta registrar un asiento con fecha de ese periodo, **entonces** el sistema bloquea el registro y muestra el mensaje de periodo cerrado.
5. **Dado** que existe un asiento en un periodo cerrado, **cuando** cualquier rol intenta editarlo, eliminarlo o cambiar su estado, **entonces** el sistema bloquea la acción y conserva el registro original.
6. **Dado** que un periodo está cerrado, **cuando** cualquier rol intenta registrar un pago o cobro con fecha de ese periodo, **entonces** el sistema bloquea el registro y muestra el mensaje de periodo cerrado.
7. **Dado** que existe un pago o cobro en un periodo cerrado, **cuando** cualquier rol intenta editarlo, marcarlo como pagado o eliminarlo, **entonces** el sistema bloquea la acción y conserva el registro original.
8. **Dado** que un asiento o pago está en un periodo abierto, **cuando** se intenta cambiar su fecha a un periodo cerrado, **entonces** el sistema bloquea el cambio.
9. **Dado** que un asiento o pago estaba abierto para edición antes del cierre, **cuando** se intenta guardar después del cierre, **entonces** el sistema rechaza el guardado y muestra el mensaje de periodo cerrado.
10. **Dado** que un periodo cerrado tiene movimientos, **cuando** un usuario autorizado consulta listados o reportes, **entonces** puede ver la información sin encontrar acciones de modificación.
11. **Dado** que inicia sesión un rol distinto del Administrador financiero, **cuando** revisa la gestión de periodos, **entonces** no ve la acción de cierre y su acceso directo es bloqueado.

---

### Historia de Usuario 16 - Registrar trazabilidad de creación, edición y anulación (Prioridad: P1)

Como Auditor, quiero ver un registro de quién creó, editó o anuló cada asiento y pago, con fecha y hora, para controlar riesgos.

**Por qué esta prioridad**: La trazabilidad de las operaciones permite identificar responsables de cambios, detectar actividades inusuales y apoyar la revisión de riesgos financieros con evidencia confiable.

**Prueba Independiente**: El Auditor crea una consulta de auditoría dentro de "Reportes financieros", revisa eventos de asientos y pagos con usuario, rol, fecha y hora, y comprueba que no puedan modificarse.

**Escenarios de Aceptación**:

1. **Dado** que un usuario crea un asiento o pago, **cuando** finaliza la acción, **entonces** se genera automáticamente un evento de auditoría con usuario, rol, fecha y hora.
2. **Dado** que un asiento o pago es editado, **cuando** se guarda el cambio, **entonces** se genera un evento de edición que describe los campos modificados.
3. **Dado** que un asiento o pago es anulado, **cuando** se aplica la anulación, **entonces** se genera un evento de anulación y el registro se conserva para consulta.
4. **Dado** que un movimiento tiene varios eventos, **cuando** el Auditor abre su historial, **entonces** ve los eventos en orden cronológico con el más reciente primero.
5. **Dado** que el Auditor abre "Reportes financieros", **cuando** selecciona la consulta de auditoría, **entonces** ve una lista consolidada de eventos de asientos y pagos.
6. **Dado** que la lista consolidada está visible, **cuando** el Auditor filtra por tipo de movimiento, acción o usuario, **entonces** la lista muestra únicamente los eventos coincidentes.
7. **Dado** que un evento de auditoría está visible, **cuando** cualquier usuario intenta editarlo o eliminarlo, **entonces** el sistema bloquea la acción.
8. **Dado** que una operación es rechazada, **cuando** no se produce ningún cambio real, **entonces** no se genera un evento de auditoría.
9. **Dado** que un movimiento ya está anulado, **cuando** se intenta anularlo de nuevo, **entonces** no se genera un segundo evento de anulación.
10. **Dado** que los datos de ejemplo son cargados dos veces, **cuando** se comparan los historiales, **entonces** usuarios, acciones, fechas y horas son idénticos.
11. **Dado** que el Administrador restablece datos, **cuando** el Auditor consulta el registro, **entonces** el historial vuelve a su estado inicial determinista sin eventos huérfanos.
12. **Dado** que se revisa el menú lateral, **cuando** se compara con la configuración vigente, **entonces** no se crea una nueva opción para la consulta de auditoría.
13. **Dado** que un rol distinto del Auditor intenta abrir el registro de auditoría directamente, **cuando** realiza la acción, **entonces** se muestra un mensaje de acceso no disponible y no se revelan eventos.
14. **Dado** que no existen eventos para un movimiento o para los filtros aplicados, **cuando** se consulta el registro, **entonces** se muestra un mensaje de estado vacío en español.

---

### Historia de Usuario 17 - Alertas de vencimientos de pagos en el panel (Prioridad: P1)

Como Tesorero, quiero ver en el panel alertas de pagos vencidos y de pagos que vencen esta semana, para priorizar la cobranza y anticiparme a los compromisos financieros próximos.

**Por qué esta prioridad**: Los vencimientos afectan directamente la tesorería; mostrarlos al iniciar sesión permite actuar sin buscar en otros listados.

**Prueba Independiente**: El Tesorero inicia sesión con datos de ejemplo que contienen pagos vencidos y pagos con vencimiento en la semana actual, y verifica que el panel muestre ambas alertas con cantidades y totales coherentes.

**Escenarios de Aceptación**:

1. **Dado** que existen pagos pendientes vencidos, **cuando** inicia sesión el Tesorero, **entonces** su panel muestra una alerta de pagos vencidos con cantidad y total en CLP.
2. **Dado** que existen pagos pendientes que vencen entre la fecha de referencia y el domingo de la semana actual, **cuando** inicia sesión el Tesorero, **entonces** su panel muestra una alerta de pagos que vencen esta semana con cantidad y total en CLP.
3. **Dado** que una alerta está visible, **cuando** el Tesorero revisa su detalle, **entonces** puede identificar la entidad, el monto y la fecha de vencimiento de cada pago incluido.
4. **Dado** que hay más pagos de los que caben en el detalle, **cuando** se revisa la alerta, **entonces** se indica cuántos pagos adicionales existen.
5. **Dado** que un pago vence el domingo de la semana actual, **cuando** se consulta el panel, **entonces** se incluye en la alerta semanal.
6. **Dado** que un pago vence el lunes de la semana siguiente, **cuando** se consulta el panel, **entonces** no se incluye en la alerta semanal.
7. **Dado** que un pago está pagado o anulado, **cuando** se consultan las alertas, **entonces** se excluye de ambas alertas.
8. **Dado** que un pago vencido tiene fecha dentro de la semana actual, **cuando** se consultan las alertas, **entonces** se muestra solo en la alerta de vencidos.
9. **Dado** que se registra, edita, paga o anula un pago, **cuando** se actualiza el panel, **entonces** las alertas reflejan el nuevo estado del movimiento.
10. **Dado** que no existen pagos que cumplan una condición, **cuando** se consulta el panel, **entonces** se muestra un estado sin alertas o la alerta se oculta sin cifras engañosas.
11. **Dado** que se revisa el menú lateral, **cuando** se comparan sus opciones con el panel, **entonces** las alertas no crean una nueva opción ni un acceso duplicado a "Pagos y cobros".
12. **Dado** que inicia sesión un rol distinto del Tesorero, **cuando** revisa su panel, **entonces** no ve las alertas de vencimientos de pagos.
13. **Dado** que se cargan datos de ejemplo dos veces con la misma fecha de referencia, **cuando** se comparan las alertas, **entonces** cantidades, totales y montos son idénticos.
14. **Dado** que se restablecen datos, **cuando** el Tesorero consulta su panel, **entonces** las alertas vuelven a su estado inicial coherente con la semilla.

---

### Historia de Usuario 18 - Identidad corporativa en el encabezado (Prioridad: P2)

Como usuario del módulo, quiero ver en el encabezado el nombre de la empresa ficticia "Comercial Los Andes SpA" con su logo, para reconocer de inmediato la empresa a la que pertenece la información financiera mostrada.

**Por qué esta prioridad**: La identidad corporativa hace evidente que los datos son ficticios y pertenecen a una sola empresa, mejorando la claridad de la demostración.

**Prueba Independiente**: El usuario inicia sesión con cualquier rol y verifica que el encabezado muestra el texto exacto "Comercial Los Andes SpA" junto a un logotipo ficticio reconocible.

**Escenarios de Aceptación**:

1. **Dado** que existe una sesión válida, **cuando** se abre cualquier pantalla del módulo, **entonces** el encabezado muestra el nombre exacto "Comercial Los Andes SpA".
2. **Dado** que el encabezado está visible, **cuando** se revisa su contenido, **entonces** el logotipo aparece junto al nombre de la empresa.
3. **Dado** que se comparan las pantallas disponibles, **cuando** se navega entre secciones, **entonces** el nombre y el logotipo permanecen visibles.
4. **Dado** que inician sesión distintos roles, **cuando** revisan sus paneles, **entonces** todos ven la misma identidad corporativa.
5. **Dado** que el encabezado está visible, **cuando** se revisa el menú lateral, **entonces** la identidad corporativa no aparece como una opción adicional.
6. **Dado** que una pantalla tiene su propio título, **cuando** se revisa el encabezado, **entonces** el nombre de la empresa no sustituye ni duplica ese título.
7. **Dado** que el logotipo no está disponible, **cuando** se visualiza el encabezado, **entonces** el nombre de la empresa permanece visible y el espacio del logotipo conserva una referencia visual clara.
8. **Dado** que se cargan o restablecen datos, **cuando** se consulta el encabezado, **entonces** la identidad corporativa permanece igual.

---

### Historia de Usuario 19 - Exportar reportes financieros a PDF y Excel (Prioridad: P1)

Como Contador, quiero que cada reporte financiero tenga los botones "Exportar PDF" y "Exportar Excel", para descargar el reporte del periodo seleccionado con el nombre de la empresa, la fecha y los totales.

**Por qué esta prioridad**: La exportación permite compartir y archivar los reportes financieros con información trazable y coherente con lo revisado en el módulo.

**Prueba Independiente**: El Contador abre cada reporte financiero para un periodo válido, usa ambos botones y verifica que los archivos descargados contengan el nombre de la empresa, la fecha y los totales del periodo.

**Escenarios de Aceptación**:

1. **Dado** que un reporte financiero está visible para un periodo seleccionado, **cuando** se revisan sus acciones, **entonces** aparecen los botones "Exportar PDF" y "Exportar Excel".
2. **Dado** que se selecciona "Exportar PDF", **cuando** finaliza la acción, **entonces** se obtiene un archivo descargable en formato PDF con el contenido del reporte.
3. **Dado** que se selecciona "Exportar Excel", **cuando** finaliza la acción, **entonces** se obtiene un archivo descargable en formato Excel con el contenido del reporte.
4. **Dado** que un archivo exportado está disponible, **cuando** se revisa su encabezado, **entonces** aparece el nombre exacto "Comercial Los Andes SpA".
5. **Dado** que un archivo exportado está disponible, **cuando** se revisa la fecha, **entonces** aparece el periodo seleccionado y la fecha de generación.
6. **Dado** que un archivo exportado está disponible, **cuando** se revisan los totales, **entonces** aparecen los totales aplicables al tipo de reporte.
7. **Dado** que se comparan el reporte en pantalla y el archivo exportado, **cuando** se revisan las cifras, **entonces** coinciden para el mismo periodo.
8. **Dado** que se cambia el periodo seleccionado, **cuando** se exporta el reporte, **entonces** el archivo corresponde al nuevo periodo.
9. **Dado** que un reporte válido no tiene movimientos, **cuando** se exporta, **entonces** el archivo incluye totales en cero y una indicación de ausencia de movimientos.
10. **Dado** que existen datos inconsistentes que impiden validar el reporte, **cuando** se intenta exportar, **entonces** la exportación se bloquea y se muestra la advertencia correspondiente.
11. **Dado** que se exporta un reporte, **cuando** se revisa el módulo, **entonces** no se modifican cuentas, asientos, pagos, periodos ni filtros.
12. **Dado** que se revisa el menú lateral, **cuando** se compara con las acciones del reporte, **entonces** la exportación no crea una opción de menú adicional.

---

### Historia de Usuario 20 - Filtros de asientos y pagos (Prioridad: P1)

Como usuario, quiero filtrar asientos y pagos por fecha, cuenta, monto y estado, para encontrar rápidamente los movimientos que necesito revisar.

**Por qué esta prioridad**: Los filtros reducen el tiempo de localización de movimientos y disminuyen errores al revisar listados extensos.

**Prueba Independiente**: El usuario aplica filtros individuales y combinados en los listados de asientos y pagos, verifica los resultados y comprueba que pueda limpiarlos sin modificar registros.

**Escenarios de Aceptación**:

1. **Dado** que el listado de asientos está visible, **cuando** se aplica un rango de fechas, **entonces** se muestran solo los asientos cuya fecha contable esté dentro del rango, incluyendo ambos límites.
2. **Dado** que el listado de asientos está visible, **cuando** se selecciona una cuenta contable, **entonces** se muestran solo los asientos que tienen al menos una línea con esa cuenta.
3. **Dado** que el listado de asientos está visible, **cuando** se define un rango de montos, **entonces** se muestran solo los asientos cuyo monto total esté dentro del rango, incluyendo ambos límites.
4. **Dado** que el listado de asientos está visible, **cuando** se selecciona un estado, **entonces** se muestran solo los asientos con ese estado.
5. **Dado** que el listado de pagos y cobros está visible, **cuando** se aplica un rango de fechas, **entonces** se muestran solo los pagos cuya fecha del movimiento esté dentro del rango, incluyendo ambos límites.
6. **Dado** que el listado de pagos y cobros está visible, **cuando** se selecciona una cuenta contable, **entonces** se muestran solo los pagos relacionados con un asiento que utilice esa cuenta.
7. **Dado** que el listado de pagos y cobros está visible, **cuando** se define un rango de montos, **entonces** se muestran solo los pagos cuyo monto esté dentro del rango, incluyendo ambos límites.
8. **Dado** que el listado de pagos y cobros está visible, **cuando** se selecciona un estado, **entonces** se muestran solo los pagos con ese estado.
9. **Dado** que se aplican varios filtros a la vez, **cuando** se revisa el listado, **entonces** se muestran solo los registros que cumplen todos los criterios simultáneamente.
10. **Dado** que no existen resultados, **cuando** se aplican los filtros, **entonces** se muestra un mensaje de estado vacío en español.
11. **Dado** que se han aplicado filtros, **cuando** se selecciona limpiar filtros, **entonces** el listado vuelve a mostrar todos los registros disponibles para el rol.
12. **Dado** que un rango de fechas o montos es inválido, **cuando** se intenta filtrar, **entonces** se muestra un mensaje específico y no se aplica ese filtro.
13. **Dado** que un rol no tiene acceso a un listado, **cuando** revisa el módulo, **entonces** no ve los filtros de ese listado.
14. **Dado** que se revisa el menú lateral, **cuando** se comparan los filtros, **entonces** no se crea una nueva opción de menú ni una pantalla de búsqueda global.

---

### Historia de Usuario 21 - Interfaz profesional del módulo (Prioridad: P1)

Como usuario, quiero una interfaz profesional con colores coherentes, íconos por sección, tablas ordenables, mensajes de confirmación y menú adaptable en celular, para trabajar con claridad y confianza en distintos dispositivos.

**Por qué esta prioridad**: La consistencia visual y la retroalimentación clara reducen errores y mejoran la usabilidad de una herramienta financiera.

**Prueba Independiente**: El usuario recorre el módulo en pantalla amplia y celular, verifica colores e íconos, ordena tablas y confirma guardados y eliminaciones.

**Escenarios de Aceptación**:

1. **Dado** que se recorren todas las secciones del módulo, **cuando** se comparan sus colores, **entonces** encabezados, botones y mensajes usan la misma paleta.
2. **Dado** que un estado es de éxito, error o advertencia, **cuando** se muestra su mensaje, **entonces** usa el mismo color en todas las pantallas.
3. **Dado** que el menú lateral está visible, **cuando** se revisa cada opción, **entonces** cada sección muestra un ícono junto a su texto.
4. **Dado** que se abre una sección, **cuando** se revisa su encabezado, **entonces** aparece el ícono correspondiente a esa sección.
5. **Dado** que una tabla tiene encabezados de columna, **cuando** se selecciona un encabezado, **entonces** los registros se ordenan por esa columna.
6. **Dado** que una tabla está ordenada, **cuando** se selecciona el mismo encabezado nuevamente, **entonces** el orden cambia entre ascendente y descendente.
7. **Dado** que una tabla contiene fechas o importes, **cuando** se ordena por esas columnas, **entonces** el orden respeta el valor cronológico o numérico.
8. **Dado** que se guarda un registro válido, **cuando** finaliza la acción, **entonces** se muestra un mensaje de confirmación de guardado exitoso.
9. **Dado** que se intenta eliminar un registro permitido, **cuando** se inicia la acción, **entonces** se muestra un mensaje de confirmación antes de eliminar.
10. **Dado** que el usuario cancela la confirmación de eliminación, **cuando** se cierra el mensaje, **entonces** el registro permanece sin cambios.
11. **Dado** que el usuario confirma la eliminación permitida, **cuando** finaliza la acción, **entonces** se elimina el registro y se muestra un mensaje de confirmación.
12. **Dado** que el módulo se visualiza en una pantalla de celular, **cuando** se abre el menú, **entonces** las secciones permitidas están disponibles para el rol autenticado.
13. **Dado** que se selecciona una sección desde el menú en celular, **cuando** se navega, **entonces** el menú deja de ocupar la pantalla.
14. **Dado** que se comparan menú amplio y menú de celular, **cuando** se revisan sus opciones, **entonces** ambos muestran las mismas secciones permitidas para el rol.
15. **Dado** que se aplican mejoras de interfaz, **cuando** se revisan reglas de negocio, permisos y datos, **entonces** permanecen sin cambios.

---

### Historia de Usuario 22 - Centrar y estrechar el acceso (Prioridad: P1)

Como usuario del módulo, quiero que la pantalla de acceso esté centrada y sea angosta, con el botón "Ingresar" inmediatamente después de los campos, para concentrarme en las credenciales sin buscar el control de acceso.

**Por qué esta prioridad**: El acceso es la primera interacción con el módulo; una presentación clara reduce errores y tiempo de ingreso.

**Prueba Independiente**: Se abre la pantalla de acceso en una pantalla amplia y en una estrecha, y se verifica que el formulario esté centrado, angosto y que el botón "Ingresar" no tenga un espacio vacío superior que lo separe del último campo.

**Escenarios de Aceptación**:

1. **Dado** que se abre la pantalla de acceso, **cuando** se revisa su disposición, **entonces** el formulario aparece centrado en el área visible.
2. **Dado** que la pantalla es amplia, **cuando** se compara el ancho del formulario con el ancho de la pantalla, **entonces** el formulario es angosto y no ocupa todo el ancho disponible.
3. **Dado** que se completan los campos de acceso, **cuando** se revisa la posición del botón "Ingresar", **entonces** aparece inmediatamente después del último campo sin un espacio vacío superior.
4. **Dado** que se visualiza la pantalla en un dispositivo estrecho, **cuando** se revisa el acceso, **entonces** los campos y el botón permanecen legibles y sin desplazamiento horizontal de toda la página.
5. **Dado** que se cambia el tamaño de la ventana, **cuando** se revisa el acceso, **entonces** el formulario conserva su centrado y su carácter angosto.

---

### Historia de Usuario 23 - Mostrar la identidad del usuario y el cierre de sesión en el encabezado (Prioridad: P1)

Como usuario autenticado, quiero ver mi nombre, mi rol y la acción "Cerrar sesión" juntos en el encabezado, para reconocer con quién estoy trabajando y finalizar el acceso sin buscar en otras zonas.

**Por qué esta prioridad**: La identidad del usuario y la salida rápida son referencias permanentes durante toda la sesión y reducen la incertidumbre sobre el perfil activo.

**Prueba Independiente**: Se inicia sesión con cada usuario de prueba y se comprueba que el encabezado muestre el nombre, el rol y "Cerrar sesión" agrupados, y que la acción conserve su comportamiento habitual.

**Escenarios de Aceptación**:

1. **Dado** que existe una sesión válida, **cuando** se abre cualquier pantalla del módulo, **entonces** el encabezado muestra el nombre del usuario autenticado y su rol.
2. **Dado** que el encabezado está visible, **cuando** se revisa la ubicación de "Cerrar sesión", **entonces** aparece junto al nombre del usuario y su rol.
3. **Dado** que se navega entre secciones, **cuando** se revisa el encabezado, **entonces** el nombre, el rol y "Cerrar sesión" permanecen visibles y agrupados.
4. **Dado** que se selecciona "Cerrar sesión" desde el encabezado, **cuando** finaliza la acción, **entonces** la sesión termina y se vuelve a la pantalla de acceso, conservando el comportamiento definido en la Historia de Usuario 8.
5. **Dado** que el nombre o el rol son extensos, **cuando** se muestra el encabezado en una pantalla estrecha, **entonces** la información sigue siendo legible y "Cerrar sesión" sigue accesible.

---

### Historia de Usuario 24 - Alinear el menú lateral a la izquierda (Prioridad: P1)

Como usuario autenticado, quiero que el menú lateral esté alineado al borde izquierdo del área de trabajo, para tener una referencia de navegación estable y predecible.

**Por qué esta prioridad**: Una navegación ubicada de forma consistente permite orientarse rápidamente y evita confusión al cambiar de pantalla.

**Prueba Independiente**: Se abre el menú lateral en distintas pantallas y tamaños de pantalla, y se verifica que quede alineado al borde izquierdo con las mismas secciones permitidas para el rol.

**Escenarios de Aceptación**:

1. **Dado** que existe una sesión válida, **cuando** se muestra el menú lateral, **entonces** aparece alineado al borde izquierdo del área de trabajo.
2. **Dado** que se navega entre secciones, **cuando** se revisa el menú lateral, **entonces** conserva su alineación a la izquierda.
3. **Dado** que el menú se abre desde el encabezado, **cuando** se revisa su posición, **entonces** continúa alineado a la izquierda.
4. **Dado** que se usa una pantalla estrecha, **cuando** se abre el menú, **entonces** el menú se despliega desde el borde izquierdo y muestra solo las secciones permitidas.
5. **Dado** que se revisan las opciones del menú, **cuando** se comparan con la matriz de acceso vigente, **entonces** no aparecen secciones nuevas ni se pierden las permitidas.

---

### Historia de Usuario 25 - Mostrar montos en formato chileno (Prioridad: P1)

Como usuario del módulo, quiero ver todos los montos en formato chileno, con símbolo "$", separador de miles y sin decimales, para leer las cifras con el mismo criterio que uso habitualmente.

**Por qué esta prioridad**: La consistencia en la presentación de importes evita misinterpretaciones en listados, reportes y resúmenes financieros.

**Prueba Independiente**: Se revisan importes en listados, formularios, resúmenes y reportes, y se comprueba que un valor como cinco mil se muestre como "$5.000" sin decimales y con el mismo criterio en todas partes.

**Escenarios de Aceptación**:

1. **Dado** que una pantalla muestra un monto, **cuando** se revisa su presentación, **entonces** aparece con el símbolo "$" antes del valor y puntos como separador de miles.
2. **Dado** que un monto es cinco mil, **cuando** se muestra en pantalla, **entonces** se presenta exactamente como "$5.000".
3. **Dado** que un monto tiene tres o menos cifras, **cuando** se muestra en pantalla, **entonces** aparece sin puntos de miles y sin decimales.
4. **Dado** que se revisan listados, formularios, resúmenes y reportes, **cuando** se comparan sus importes, **entonces** todos usan el mismo formato chileno sin decimales.
5. **Dado** que cambia la presentación de un importe, **cuando** se consultan los cálculos del módulo, **entonces** los valores y resultados financieros permanecen iguales.

---

### Historia de Usuario 26 - Mostrar primero la lista y abrir el formulario desde "Nuevo" (Prioridad: P1)

Como usuario con permisos de creación, quiero ver primero la lista de registros y usar un botón "Nuevo" que abra el formulario en una ventana, para consultar el contexto existente antes de crear un registro sin perder el listado de fondo.

**Por qué esta prioridad**: Priorizar la lista refuerza la consulta como primera acción y la ventana de formulario mantiene visible el contexto mientras se captura información.

**Prueba Independiente**: Se abre una pantalla con registros, se verifica que la lista aparezca antes que el formulario, se selecciona "Nuevo", se interactúa con la ventana y se cierra sin guardar comprobando que el listado y sus filtros no cambiaron.

**Escenarios de Aceptación**:

1. **Dado** que se abre una pantalla con registros, **cuando** se revisa su contenido, **entonces** la lista aparece antes que cualquier formulario de creación.
2. **Dado** que el usuario tiene permiso para crear, **cuando** se revisa la pantalla, **entonces** encuentra un botón visible identificado como "Nuevo".
3. **Dado** que el usuario selecciona "Nuevo", **cuando** se abre el formulario, **entonces** este aparece en una ventana dentro del módulo sin reemplazar la lista de fondo.
4. **Dado** que la ventana del formulario está abierta, **cuando** se revisa la lista de fondo, **entonces** los filtros y los registros previamente visibles permanecen sin cambios.
5. **Dado** que el usuario cierra la ventana sin guardar, **cuando** se revisa la pantalla, **entonces** el listado, los filtros y los datos permanecen igual.
6. **Dado** que el usuario confirma un registro válido, **cuando** se cierra la ventana, **entonces** la lista se actualiza conservando las reglas y validaciones vigentes.
7. **Dado** que un rol no puede crear registros, **cuando** revisa la pantalla, **entonces** no ve el botón "Nuevo".

---

### Historia de Usuario 27 - Evitar la superposición en los filtros (Prioridad: P2)

Como usuario que aplica filtros, quiero que la "×" para limpiar un filtro no se encime con la flecha del selector, para poder limpiar y cambiar el valor elegido sin hacer clic en el control equivocado.

**Por qué esta prioridad**: Una superposición de controles provoca acciones accidentales y dificulta la revisión de listados extensos.

**Prueba Independiente**: Se revisan los filtros con la "×" visible y la flecha del selector, se aplica y limpia cada filtro, y se comprueba que ambos controles puedan usarse por separado.

**Escenarios de Aceptación**:

1. **Dado** que un filtro tiene una "×" para limpiarlo, **cuando** se revisa su presentación, **entonces** la "×" no se encima con la flecha del selector.
2. **Dado** que un filtro está aplicado, **cuando** se selecciona la "×", **entonces** el filtro se limpia sin activar el selector.
3. **Dado** que se selecciona la flecha del selector, **cuando** se abre la lista de opciones, **entonces** no se activa la acción de limpiar el filtro.
4. **Dado** que se revisan todos los filtros de la pantalla, **cuando** se comparan sus controles, **entonces** ninguna "×" invade el espacio de una flecha.
5. **Dado** que el nombre de una opción es extenso, **cuando** se muestra el filtro, **entonces** la "×" y la flecha continúan separadas y legibles.

---

### Historia de Usuario 28 - Alinear la fila de totales del Libro Mayor (Prioridad: P2)

Como Contador o usuario autorizado, quiero que la fila de totales del Libro Mayor esté alineada con las columnas correspondientes, para leer cada importe en su columna sin confundir saldos, débitos y créditos.

**Por qué esta prioridad**: Una fila de totales desalineada dificulta la verificación contable y puede generar interpretaciones incorrectas de los saldos.

**Prueba Independiente**: Se genera el Libro Mayor de un periodo con movimientos y se comprueba que los totales queden debajo de saldo inicial, débitos, créditos y saldo final, conservando los mismos importes que antes.

**Escenarios de Aceptación**:

1. **Dado** que se genera un Libro Mayor con movimientos, **cuando** se revisa la fila de totales, **entonces** cada total está alineado con su columna.
2. **Dado** que la fila de totales es visible, **cuando** se comparan sus columnas con las del detalle, **entonces** saldo inicial, débitos, créditos y saldo final coinciden en posición.
3. **Dado** que se revisan los importes de los totales, **cuando** se comparan con el cálculo vigente, **entonces** los valores permanecen iguales.
4. **Dado** que el Libro Mayor se visualiza en una pantalla estrecha, **cuando** se revisa la fila de totales, **entonces** la alineación se conserva dentro del área de la tabla.
5. **Dado** que se alinea la fila de totales, **cuando** se revisan las reglas del reporte, **entonces** no se modifica la igualdad contable ni el criterio de cálculo.

---

### Historia de Usuario 29 - Mostrar mensajes claros para listas vacías (Prioridad: P1)

Como usuario, quiero un mensaje claro cuando una lista no tiene registros, para saber que no hay datos disponibles y no confundir esa situación con un error o con información oculta.

**Por qué esta prioridad**: Los estados vacíos son frecuentes en demostraciones y periodos sin movimientos; un mensaje explícito evita dudas sobre el estado del módulo.

**Prueba Independiente**: Se abren listados sin registros, con filtros sin resultados y con datos cargados, y se verifica que el mensaje de estado vacío aparezca solo cuando corresponda.

**Escenarios de Aceptación**:

1. **Dado** que un listado no tiene registros, **cuando** se abre la pantalla, **entonces** se muestra un mensaje claro en español que indica que no hay resultados.
2. **Dado** que se aplica un filtro sin coincidencias, **cuando** se revisa el listado, **entonces** se muestra un mensaje que explica que no hay registros para ese filtro.
3. **Dado** que existen registros, **cuando** se revisa el listado, **entonces** no se muestra el mensaje de lista vacía.
4. **Dado** que un mensaje de lista vacía está visible, **cuando** se revisa su presentación, **entonces** permanece dentro del área del listado y es legible.
5. **Dado** que el mensaje de lista vacía aparece, **cuando** se compara con un mensaje de error, **entonces** se distingue claramente y no sugiere que falló la carga.
6. **Dado** que se limpia un filtro y existen registros, **cuando** se actualiza el listado, **entonces** el mensaje de lista vacía desaparece.

---

### Historia de Usuario 30 - Rastrear totales financieros hasta su origen (Prioridad: P1)

Como Auditor, quiero ver la unidad CLP en los encabezados monetarios y consultar el detalle detrás de cada total de los reportes financieros, para rastrear cada cifra hasta sus movimientos de origen sin modificar los datos.

**Por qué esta prioridad**: La constitución exige que las cifras financieras sean consistentes, estén etiquetadas y sean rastreables; un total sin desglose impide verificar su origen durante una revisión.

**Prueba Independiente**: Se abren los cuatro reportes y la tabla de movimientos, se confirma que los encabezados monetarios indican CLP, se consulta el desglose de cada total y se comprueba que la suma del desglose coincide con el total mostrado.

**Escenarios de Aceptación**:

1. **Dado** que se visualiza una tabla financiera, **cuando** se revisan sus encabezados monetarios, **entonces** todos indican la unidad CLP.
2. **Dado** que un total monetario tiene registros que lo componen, **cuando** se activa su control de desglose, **entonces** se muestra el origen, la referencia y el importe de cada registro.
3. **Dado** que se consulta el desglose de un total, **cuando** se suman sus importes, **entonces** el resultado coincide con el total mostrado y conserva el formato chileno sin decimales.
4. **Dado** que un total no tiene registros que lo compongan, **cuando** se abre su desglose, **entonces** se muestra un mensaje claro en español sin estimar importes.
5. **Dado** que un desglose está abierto, **cuando** se cierra, **entonces** desaparece sin modificar periodos, filtros, datos ni permisos.
6. **Dado** que el reporte Estado de Resultados incluye la columna Tipo, **cuando** se ordena por esa columna, **entonces** las filas se reordenan alfabéticamente y el indicador `aria-sort` refleja la dirección.
7. **Dado** que se consulta un total de un reporte, **cuando** se comparan las cifras antes y después del desglose, **entonces** no cambian las reglas de cálculo ni la igualdad contable.

---

### Historia de Usuario 31 - Usar CLP y terminología de IVA chilena (Prioridad: P1)

Como usuario del módulo, quiero que todas las cifras, unidades y datos de ejemplo usen CLP y la terminología de IVA chilena, para que la información financiera coincida con la empresa y con mi criterio habitual.

**Por qué esta prioridad**: La identidad corporativa es chilena; mostrar otra moneda o nombres de impuestos ajenos genera confusión y rompe la consistencia exigida por la constitución.

**Prueba Independiente**: Se revisan encabezados, registros semilla, formularios, exportaciones y reportes, y se comprueba que la moneda es CLP, que cinco mil pesos se muestran como "$5.000" sin decimales y que las cuentas de IVA usan "IVA Débito Fiscal" e "IVA Crédito Fiscal".

**Escenarios de Aceptación**:

1. **Dado** que se abre cualquier pantalla con importes, **cuando** se revisan encabezados o etiquetas de moneda, **entonces** todos indican CLP.
2. **Dado** que se consulta un importe de cinco mil pesos, **cuando** se muestra en pantalla o en una exportación, **entonces** aparece como "$5.000" sin decimales.
3. **Dado** que se consultan los datos de ejemplo, **cuando** se revisan cuentas, asientos, pagos y documentos, **entonces** todos usan CLP.
4. **Dado** que se consulta el plan de cuentas semilla, **cuando** se buscan cuentas de IVA, **entonces** aparecen "IVA Crédito Fiscal" e "IVA Débito Fiscal" y no aparecen denominaciones anteriores.
5. **Dado** que se crea un documento sin indicar moneda, **cuando** se guarda, **entonces** se almacena CLP.
6. **Dado** que se cambia la moneda y las etiquetas, **cuando** se comparan los cálculos y permisos, **entonces** permanecen sin cambios.

---

### Casos Límite

- ¿Qué ocurre cuando un usuario intenta crear una cuenta contable sin ingresar su código, nombre o tipo?
- ¿Qué ocurre cuando se intenta crear una cuenta contable utilizando un código que ya existe?
- ¿Qué ocurre cuando un usuario intenta crear una cuenta subordinada sin seleccionar una cuenta principal válida?
- ¿Qué ocurre cuando se intenta registrar un asiento contable sin seleccionar cuentas contables?
- ¿Qué ocurre cuando un asiento contable tiene menos de dos líneas de registro?
- ¿Qué ocurre cuando la suma de los débitos no coincide con la suma de los créditos de un asiento contable?
- ¿Qué ocurre cuando un usuario ingresa un monto igual a cero o un valor negativo en una línea de asiento?
- ¿Qué ocurre cuando se intenta registrar un asiento contable en un periodo que se encuentra cerrado?
- ¿Qué ocurre cuando un usuario intenta crear un periodo contable cuya fecha de término es anterior a la fecha de inicio?
- Se rechaza la creación de un periodo contable cuyas fechas se superpongan con otro periodo existente, abierto o cerrado.
- ¿Qué ocurre cuando un usuario intenta registrar un pago sin indicar su monto, fecha o entidad relacionada?
- ¿Qué ocurre cuando se intenta asociar un pago a un documento que no existe?
- ¿Qué ocurre cuando un usuario consulta un reporte financiero para un periodo sin movimientos registrados?
- ¿Qué ocurre cuando existen movimientos contables, pero los totales de débitos y créditos no coinciden?
- ¿Qué ocurre cuando el usuario cambia el periodo seleccionado mientras está consultando un reporte?
- ¿Qué ocurre cuando no existen cuentas contables, periodos o movimientos registrados al ingresar por primera vez al módulo?
- ¿Se mantienen los registros contables al navegar entre las distintas secciones del módulo?
- ¿Qué ocurre cuando el usuario intenta modificar o eliminar un registro que está relacionado con otros movimientos contables?
- ¿Qué ocurre cuando no existen periodos contables al cargar las gráficas del panel principal?
- ¿Qué ocurre cuando el periodo seleccionado no tiene gastos registrados?
- ¿Qué ocurre cuando el número de periodos supera el espacio disponible para las etiquetas del eje de una gráfica?
- ¿Qué ocurre cuando el RUT se ingresa con puntos y guion o sin ellos?
- ¿Qué ocurre cuando el campo inserta puntos y guion automáticamente mientras el usuario escribe?
- ¿Qué ocurre cuando el usuario borra o corrige un carácter en medio del RUT?
- ¿Qué ocurre cuando el dígito verificador se escribe como k minúscula o K mayúscula?
- ¿Qué ocurre cuando el dígito verificador no coincide con la validación del RUT?
- ¿Qué ocurre cuando se ingresa un RUT válido pero no registrado y una contraseña cualquiera?
- ¿Qué ocurre cuando se abre y cierra el menú lateral desde el botón "Menú" en una pantalla estrecha?
- ¿Qué ocurre cuando se cierra sesión mientras el menú lateral está abierto?
- ¿Qué ocurre cuando la contraseña incluye mayúsculas, minúsculas o caracteres especiales?
- ¿Qué ocurre cuando se intenta acceder con un RUT válido y la contraseña de otro usuario?
- ¿Qué ocurre cuando se cierra sesión desde un panel y se intenta volver a él sin autenticarse?
- ¿Qué ocurre cuando se realizan varios intentos fallidos de acceso de forma consecutiva?
- ¿Qué ocurre cuando un usuario intenta abrir una sección que no aparece en su menú?
- ¿Qué ocurre cuando el Auditor encuentra una acción de modificación dentro de un reporte?
- ¿Qué ocurre cuando el Contador intenta cambiar el estado de un periodo desde el formulario de asientos?
- ¿Qué ocurre cuando el Tesorero necesita seleccionar una entidad o un documento para registrar un pago?
- ¿Qué ocurre cuando el rol asignado a un usuario de prueba cambia mientras la sesión está abierta?
- ¿Qué ocurre cuando se carga la semilla mientras ya existen periodos creados manualmente?
- ¿Qué ocurre cuando el Administrador cancela la confirmación de carga o restablecimiento?
- ¿Qué ocurre cuando se restablecen datos con reportes o gráficas abiertas?
- ¿Qué ocurre cuando un asiento de la semilla pertenece a un periodo cerrado?
- ¿Qué ocurre cuando se carga la semilla dos veces seguidas sin cambios intermedios?
- ¿Qué ocurre cuando un panel incluye un acceso directo a una sección que ya está en el menú?
- ¿Qué ocurre cuando dos controles con nombres diferentes abren la misma pantalla?
- ¿Qué ocurre cuando el Tesorero necesita seleccionar una entidad o un documento sin acceder a esas secciones?
- ¿Qué ocurre cuando un usuario intenta abrir Entidades, Documentos o Búsqueda sin usar el menú?
- ¿Qué ocurre cuando los filtros de una sección se confunden con una pantalla global de Búsqueda?
- ¿Qué ocurre cuando un pago pendiente alcanza su fecha de vencimiento sin que cambie ningún registro?
- ¿Qué ocurre cuando se marca como pagado un pago que ya estaba vencido?
- ¿Qué ocurre cuando un pago no tiene fecha de vencimiento registrada?
- ¿Qué ocurre cuando se filtra por un estado sin pagos asociados?
- ¿Qué ocurre cuando el total de un estado no coincide con la suma del listado filtrado?
- ¿Qué ocurre cuando el periodo seleccionado no tiene asientos aprobados?
- ¿Qué ocurre cuando el periodo seleccionado está cerrado?
- ¿Qué ocurre cuando existen asientos en borrador o cancelado dentro del periodo?
- ¿Qué ocurre cuando se cambia de periodo mientras un reporte financiero está abierto?
- ¿Qué ocurre cuando una cuenta no tiene un tipo que permita clasificarla como activo, pasivo, patrimonio, ingreso o gasto?
- ¿Qué ocurre cuando los totales de un reporte financiero no cumplen la igualdad contable esperada?
- ¿Qué ocurre cuando una cuenta tiene saldo inicial pero no movimientos en el periodo?
- ¿Qué ocurre cuando se generan los cuatro reportes financieros para periodos distintos durante la misma consulta?
- ¿Qué ocurre cuando un usuario sin acceso a Reportes financieros intenta abrir un reporte directamente?
- ¿Qué ocurre cuando un total monetario es cero y se consulta su desglose?
- ¿Qué ocurre cuando se cierra un desglose y cambia el periodo seleccionado?
- ¿Qué ocurre cuando se cancela la confirmación de cierre de un periodo?
- ¿Qué ocurre cuando se intenta cerrar un periodo que ya está cerrado?
- ¿Qué ocurre cuando no existe el periodo seleccionado para cerrar?
- ¿Qué ocurre cuando un asiento o pago estaba abierto para edición antes de cerrar el periodo?
- ¿Qué ocurre cuando se intenta cambiar la fecha de un asiento o pago desde un periodo abierto hacia uno cerrado?
- ¿Qué ocurre cuando se intenta cambiar la fecha de un asiento o pago desde un periodo cerrado hacia uno abierto?
- ¿Qué ocurre cuando un pago vencido de un periodo cerrado se intenta marcar como pagado?
- ¿Qué ocurre cuando se cargan datos de ejemplo mientras existen periodos cerrados?
- ¿Qué ocurre cuando se restablecen datos después de cerrar periodos?
- ¿Qué ocurre cuando un usuario sin permiso intenta cerrar un periodo directamente?
- ¿Qué ocurre cuando un periodo cerrado se consulta desde un reporte financiero?
- ¿Qué ocurre cuando se cierra un periodo que no tiene movimientos registrados?
- ¿Qué ocurre cuando un movimiento fue creado antes de que existiera el registro de auditoría?
- ¿Qué ocurre cuando el usuario responsable ya no aparece en la lista de usuarios de prueba?
- ¿Qué ocurre cuando dos eventos ocurren con la misma fecha y hora?
- ¿Qué ocurre cuando se intenta anular un movimiento ya anulado?
- ¿Qué ocurre cuando una edición no cambia ningún valor?
- ¿Qué ocurre cuando se restablecen datos con filtros de auditoría aplicados?
- ¿Qué ocurre cuando un usuario sin rol de Auditor intenta abrir el registro de auditoría directamente?
- ¿Qué ocurre cuando no existen eventos de auditoría?
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
- ¿Qué ocurre cuando un rol distinto del Tesorero intenta acceder a las alertas directamente?
- ¿Qué ocurre cuando el logotipo no está disponible?
- ¿Qué ocurre cuando el nombre de la empresa se muestra en una pantalla estrecha?
- ¿Qué ocurre cuando se cargan o restablecen datos mientras el encabezado está visible?
- ¿Qué ocurre cuando el título de la pantalla coincide parcialmente con el nombre de la empresa?
- ¿Qué ocurre cuando se cierra sesión?
- ¿Qué ocurre cuando el texto del nombre no cabe en una sola línea?
- ¿Qué ocurre cuando la descripción accesible del logotipo no está definida?
- ¿Qué ocurre cuando el reporte no tiene movimientos?
- ¿Qué ocurre cuando los datos son inconsistentes y el reporte no puede validarse?
- ¿Qué ocurre cuando se cambia el periodo después de abrir el reporte?
- ¿Qué ocurre cuando se exporta el mismo reporte dos veces seguidas?
- ¿Qué ocurre cuando se exportan PDF y Excel del mismo periodo?
- ¿Qué ocurre cuando un rol sin acceso a reportes intenta usar los botones directamente?
- ¿Qué ocurre cuando el archivo no puede descargarse?
- ¿Qué ocurre cuando se cargan o restablecen datos antes de exportar?
- ¿Qué ocurre cuando no existen registros en el listado?
- ¿Qué ocurre cuando no hay resultados para la combinación de filtros?
- ¿Qué ocurre cuando la fecha inicial es posterior a la fecha final?
- ¿Qué ocurre cuando el monto mínimo es mayor que el monto máximo?
- ¿Qué ocurre cuando se ingresa un monto negativo o no numérico?
- ¿Qué ocurre cuando se selecciona una cuenta sin movimientos?
- ¿Qué ocurre cuando un pago no tiene asiento relacionado y se filtra por cuenta?
- ¿Qué ocurre cuando un asiento tiene varias líneas con cuentas distintas?
- ¿Qué ocurre cuando se restablecen datos con filtros aplicados?
- ¿Qué ocurre cuando un rol sin acceso intenta usar los filtros directamente?
- ¿Qué ocurre cuando una tabla no tiene registros?
- ¿Qué ocurre cuando una columna no es ordenable?
- ¿Qué ocurre cuando dos registros tienen el mismo valor en la columna ordenada?
- ¿Qué ocurre cuando se ordena una tabla y después se aplica un filtro?
- ¿Qué ocurre cuando se cancela una eliminación?
- ¿Qué ocurre cuando un guardado falla por validación?
- ¿Qué ocurre cuando un rol no tiene permiso para eliminar?
- ¿Qué ocurre cuando el menú en celular tiene más secciones de las que caben en pantalla?
- ¿Qué ocurre cuando cambia el ancho de pantalla?
- ¿Qué ocurre cuando un ícono no puede mostrarse?
- ¿Qué ocurre cuando un mensaje de confirmación aparece en una pantalla estrecha?
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

## Requisitos 

### Requisitos Funcionales

- **FR-001**: El sistema DEBE permitir a los usuarios consultar un panel principal con un resumen de los ingresos, gastos y resultados financieros de la empresa.
- **FR-002**: El sistema DEBE permitir filtrar el resumen financiero según el periodo seleccionado.
- **FR-003**: El sistema DEBE permitir crear, consultar y editar cuentas contables.
- **FR-004**: El sistema DEBE solicitar como mínimo un código, nombre y tipo para registrar una cuenta contable.
- **FR-005**: El sistema DEBE permitir organizar las cuentas contables mediante relaciones jerárquicas entre cuentas principales y subcuentas.
- **FR-006**: El sistema DEBE validar que los códigos de las cuentas contables no se encuentren duplicados.
- **FR-007**: El sistema DEBE permitir registrar asientos contables indicando su fecha, concepto y periodo contable correspondiente.
- **FR-008**: El sistema DEBE permitir agregar una o más líneas contables a cada asiento, indicando la cuenta involucrada y el monto correspondiente al debe o al haber.
- **FR-009**: Cada línea de asiento contable DEBE registrar un monto en el debe o en el haber, pero no en ambos simultáneamente.
- **FR-010**: El sistema DEBE exigir al menos dos líneas contables para registrar un asiento.
- **FR-011**: El sistema DEBE validar que la suma de los débitos sea igual a la suma de los créditos antes de permitir guardar un asiento contable.
- **FR-012**: El sistema DEBE informar claramente cuando un asiento contable no cumpla con la condición de igualdad entre débitos y créditos.
- **FR-013**: El sistema DEBE permitir registrar y consultar pagos y cobros realizados por la empresa.
- **FR-014**: El sistema DEBE permitir asociar cada pago o cobro con una entidad existente.
- **FR-015**: El sistema NO DEBE asociar pagos ni cobros con documentos en el MVP; `document_id` queda excluido del modelo operativo de `Pago`. Los documentos solo se referencian desde asientos mediante `sourceDocumentId`.
- **FR-016**: El sistema DEBE solicitar la fecha, monto y tipo de operación para registrar un pago o cobro.
- **FR-017**: El sistema DEBE permitir crear y consultar periodos contables indicando su nombre, fecha de inicio y fecha de término.
- **FR-018**: El sistema DEBE validar que la fecha de término de un periodo contable sea posterior a su fecha de inicio.
- **FR-019**: El sistema DEBE permitir cerrar un periodo contable abierto; el estado `cerrado` es definitivo y NO DEBE ofrecerse una acción de reapertura.
- **FR-020**: El sistema NO DEBE permitir registrar nuevos asientos contables en periodos que se encuentren cerrados.
- **FR-021**: El sistema DEBE mostrar el estado de cada periodo contable para facilitar su identificación.
- **FR-022**: El sistema DEBE permitir generar y consultar reportes de movimientos contables según el periodo seleccionado.
- **FR-023**: Los reportes DEBEN mostrar la fecha, concepto, cuentas involucradas, débitos y créditos de los movimientos registrados.
- **FR-024**: El sistema DEBE mostrar los totales de débitos y créditos correspondientes al periodo consultado.
- **FR-025**: El sistema DEBE informar cuando no existan movimientos contables para el periodo seleccionado.
- **FR-026**: El sistema DEBE actualizar la información de los reportes cuando el usuario seleccione un periodo diferente.
- **FR-027**: El sistema DEBE mostrar mensajes claros cuando falte información obligatoria o se produzca un error de validación.
- **FR-028**: El sistema DEBE mantener la información de los registros al navegar entre las distintas secciones del módulo.
- **FR-029**: El sistema DEBE permitir visualizar los registros contables mediante listados organizados y formularios de consulta.
- **FR-030**: El sistema DEBE utilizar datos de ejemplo para representar las operaciones del módulo durante la implementación frontend, sin requerir una conexión real a una base de datos.
- **FR-031**: El sistema DEBE manejar los estados `borrador`, `aprobado` y `cancelado` en los asientos contables, impidiendo modificar o eliminar las líneas de un asiento aprobado y conservando los asientos cancelados para auditoría.
- **FR-032**: El sistema DEBE impedir eliminar un documento que tenga asientos contables asociados, conservando la referencia al documento de origen.
- **FR-033**: El sistema DEBE impedir crear un periodo contable cuyas fechas se superpongan con las de otro periodo existente, independientemente de su estado.
- **FR-034**: El sistema DEBE operar con una sola moneda (CLP) y NO DEBE realizar conversiones de moneda durante el MVP.
- **FR-035**: El sistema DEBE mostrar en el panel principal una gráfica de barras con los ingresos y gastos de cada periodo contable.
- **FR-036**: El sistema DEBE mostrar en el panel principal una gráfica de línea con la evolución del resultado financiero por periodo contable.
- **FR-037**: El sistema DEBE mostrar en el panel principal una gráfica de distribución de los gastos por cuenta del periodo seleccionado.
- **FR-038**: El sistema DEBE actualizar las gráficas cuando el usuario seleccione un periodo contable diferente y mostrar mensajes de estado vacío cuando no existan datos.
- **FR-039**: Los importes presentados en las gráficas DEBEN formatearse en CLP mediante las utilidades compartidas del módulo.
- **FR-040**: El sistema DEBE solicitar RUT y contraseña para permitir el acceso al módulo.
- **FR-041**: El sistema DEBE contar con cuatro usuarios de prueba ficticios, uno por cada rol: Administrador financiero, Contador, Tesorero y Auditor.
- **FR-042**: El sistema DEBE autenticar a cada usuario de prueba únicamente cuando su RUT y su contraseña coincidan.
- **FR-043**: El sistema DEBE mostrar un panel de inicio distinto según el rol autenticado.
- **FR-044**: El panel del Administrador financiero DEBE mostrar el resumen integral, el estado de los periodos y los asuntos prioritarios.
- **FR-045**: El panel del Contador DEBE mostrar cuentas contables, asientos y reportes disponibles.
- **FR-046**: El panel del Tesorero DEBE mostrar pagos, cobros y flujo de efectivo.
- **FR-047**: El panel del Auditor DEBE mostrar trazabilidad de movimientos, reportes e historial para consulta.
- **FR-048**: El sistema DEBE mostrar el mensaje "RUT o contraseña incorrectos" cuando las credenciales no correspondan a un usuario de prueba, sin revelar cuál dato falló.
- **FR-049**: El sistema DEBE indicar qué dato obligatorio falta cuando el usuario omite el RUT o la contraseña.
- **FR-050**: El sistema DEBE ofrecer una acción de cierre de sesión desde cada panel de inicio.
- **FR-051**: Después del cierre de sesión, el sistema NO DEBE permitir el acceso a un panel sin una nueva autenticación válida.
- **FR-052**: El sistema DEBE aceptar el RUT de prueba con el formato puntuado mostrado en la tabla de usuarios y también sin puntos ni guion, aplicando el formateo automático y la validación del dígito verificador definidos en los requisitos FR-314 a FR-316.
- **FR-053**: El sistema DEBE mostrar en el menú únicamente las secciones que el rol autenticado puede usar.
- **FR-054**: El sistema DEBE ocultar las secciones no permitidas en lugar de mostrarlas deshabilitadas.
- **FR-055**: El Administrador financiero DEBE poder acceder a todas las secciones del módulo, incluida la apertura y el cierre de periodos contables.
- **FR-056**: El Contador DEBE poder gestionar cuentas contables y asientos contables.
- **FR-057**: El Contador DEBE poder consultar reportes financieros como apoyo a su gestión contable.
- **FR-058**: El Tesorero DEBE poder registrar y consultar pagos y cobros.
- **FR-059**: El Auditor DEBE poder consultar reportes financieros y NO DEBE tener acceso a ninguna otra sección del módulo.
- **FR-060**: El Auditor NO DEBE ver acciones para crear, editar, eliminar ni cambiar el estado de la información.
- **FR-061**: El sistema DEBE bloquear el acceso a una sección no permitida y mostrar un mensaje de acceso no disponible.
- **FR-062**: El Contador DEBE poder seleccionar un periodo contable abierto al registrar un asiento sin acceder a la gestión de periodos.
- **FR-063**: El Tesorero DEBE poder consultar la entidad asociada a un pago o cobro sin acceder a la gestión de esa estructura; la consulta de documentos asociados a pagos queda fuera del MVP.
- **FR-064**: Los permisos DEBEN aplicarse de inmediato después de la autenticación y dejar de aplicarse al cerrar sesión.
- **FR-065**: El menú presentado a cada rol DEBE ser coherente con el panel de inicio definido en la Historia de Usuario 8.
- **FR-066**: El panel del Administrador financiero DEBE mostrar de forma visible el botón "Cargar datos de ejemplo".
- **FR-067**: El panel del Administrador financiero DEBE mostrar de forma visible el botón "Restablecer datos".
- **FR-068**: Los roles Contador, Tesorero y Auditor NO DEBEN ver los botones de carga ni de restablecimiento.
- **FR-069**: El sistema DEBE cargar una semilla determinista que cumpla las reglas vigentes del módulo cuando el Administrador seleccione "Cargar datos de ejemplo".
- **FR-070**: La semilla DEBE incluir al menos cuatro periodos contables no superpuestos, al menos ocho cuentas contables, al menos ocho asientos contables aprobados y al menos cuatro pagos o cobros, con al menos un asiento y un pago por periodo y al menos un pago en cada estado: pendiente, pagado y vencido.
- **FR-071**: Los asientos de la semilla DEBEN cumplir la igualdad entre débitos y créditos.
- **FR-072**: La carga de datos DEBE reemplazar cualquier conjunto previo para evitar duplicados de periodos, cuentas, asientos o pagos.
- **FR-073**: Después de cargar la semilla, los paneles, listados, reportes y gráficas DEBEN reflejar de inmediato la información cargada.
- **FR-074**: Cargar la semilla dos veces DEBE producir idénticos periodos, importes, fechas y cantidades.
- **FR-075**: El sistema DEBE devolver el módulo a un estado inicial válido, sin registros financieros y conservando los usuarios de prueba, cuando el Administrador seleccione "Restablecer datos".
- **FR-076**: El restablecimiento DEBE eliminar las relaciones entre asientos, pagos, documentos y entidades sin dejar referencias rotas.
- **FR-077**: Ambas acciones DEBEN solicitar confirmación antes de modificar datos existentes.
- **FR-078**: El sistema DEBE informar con un mensaje claro el resultado de la carga o del restablecimiento.
- **FR-079**: El menú NO DEBE incluir las opciones "Entidades", "Documentos" ni "Búsqueda" para ningún rol.
- **FR-080**: El panel de inicio NO DEBE incluir botones ni enlaces que abran Entidades, Documentos o Búsqueda.
- **FR-081**: El sistema DEBE mantener la selección contextual de entidades y documentos dentro de las pantallas permitidas, sin crear una sección independiente para ellas.
- **FR-082**: Cada pantalla permitida DEBE tener un único control visible que la abra.
- **FR-083**: El sistema NO DEBE mostrar dos controles visibles, con igual o distinta etiqueta, que abran la misma pantalla.
- **FR-084**: Las acciones de cargar datos, restablecer datos y cerrar sesión NO DEBEN considerarse accesos a pantallas ni duplicar entradas del menú.
- **FR-085**: El sistema DEBE mostrar el mensaje "Sección no disponible" y no presentar contenido cuando se intente abrir una pantalla eliminada del menú.
- **FR-086**: La localización de registros DEBE realizarse mediante filtros propios de cada sección permitida, sin una pantalla global de búsqueda.
- **FR-087**: El menú final DEBE cumplir simultáneamente la matriz de permisos de la Historia de Usuario 9 y las exclusiones de la Historia de Usuario 11.
- **FR-088**: La pantalla "Pagos y cobros" DEBE mostrar un resumen con la cantidad y el total en CLP de los estados pendiente, pagado y vencido.
- **FR-089**: El sistema DEBE ofrecer un filtro por estado con las opciones "Todos", "Pendiente", "Pagado" y "Vencido".
- **FR-090**: El filtro por estado DEBE actualizar el listado de pagos y cobros de forma inmediata.
- **FR-091**: El resumen DEBE destacar el estado seleccionado sin ocultar las cantidades ni los totales de los demás estados.
- **FR-092**: Cada pago o cobro DEBE tener uno de los estados pendiente, pagado o vencido.
- **FR-093**: El sistema DEBE solicitar una fecha de vencimiento al registrar un pago o cobro.
- **FR-094**: Un pago o cobro DEBE considerarse vencido cuando no está pagado y su fecha de vencimiento es anterior a la fecha actual.
- **FR-095**: El sistema DEBE permitir marcar un pago o cobro como pagado y conservar el registro en el resumen.
- **FR-096**: Todo cambio de estado DEBE reflejarse de inmediato en el resumen, en los totales y en el listado filtrado.
- **FR-097**: El resumen y el filtro NO DEBEN crear una nueva opción de menú ni un botón duplicado que abra la misma pantalla.
- **FR-098**: Los roles sin acceso a pagos NO DEBEN ver el resumen ni el filtro por estado.
- **FR-099**: Los importes del resumen DEBEN mostrarse en CLP con el mismo formato utilizado en el resto del módulo.
- **FR-100**: Cuando no existan pagos o cobros, el resumen DEBE mostrar cero en cada estado y un mensaje de estado vacío.
- **FR-101**: Cuando un filtro no produzca resultados, el sistema DEBE mostrar un mensaje que indique que no hay pagos con ese estado.
- **FR-102**: El menú lateral NO DEBE mostrarse antes de que una persona inicie sesión correctamente.
- **FR-103**: El menú lateral DEBE mostrarse después de una autenticación válida únicamente con las secciones que el rol autenticado puede usar según la matriz de acceso.
- **FR-104**: El menú lateral DEBE ocultarse al cerrar sesión y NO DEBE recuperarse navegando hacia atrás sin una nueva autenticación.
- **FR-105**: El sistema DEBE permitir al Contador seleccionar un periodo contable para generar reportes financieros.
- **FR-106**: El sistema DEBE permitir generar el Libro Mayor, el Balance de Comprobación, el Estado de Resultados y el Balance General para el periodo seleccionado.
- **FR-107**: El Libro Mayor DEBE mostrar, por cada cuenta con movimientos aprobados en el periodo, código, nombre, saldo inicial, débitos, créditos y saldo final.
- **FR-108**: El saldo inicial del Libro Mayor DEBE derivarse de los movimientos aprobados de periodos anteriores al seleccionado.
- **FR-109**: Los reportes financieros DEBEN excluir los asientos en borrador o cancelado.
- **FR-110**: El Balance de Comprobación DEBE listar las cuentas con saldo distinto de cero al cierre del periodo, indicando su saldo deudor o acreedor.
- **FR-111**: El Balance de Comprobación DEBE mostrar el total de saldos deudores y el total de saldos acreedores y advertir cuando no sean iguales.
- **FR-112**: El Estado de Resultados DEBE mostrar los ingresos, los gastos y el resultado financiero del periodo derivados de asientos aprobados.
- **FR-113**: El resultado financiero del Estado de Resultados DEBE calcularse como ingresos menos gastos del periodo seleccionado.
- **FR-114**: El Balance General DEBE mostrar activos, pasivos y patrimonio al cierre del periodo con sus totales correspondientes.
- **FR-115**: El patrimonio del Balance General DEBE incluir el resultado acumulado hasta la fecha de cierre del periodo.
- **FR-116**: El sistema DEBE advertir claramente cuando el total de activos no sea igual a la suma de pasivos y patrimonio.
- **FR-117**: Los reportes financieros DEBEN actualizarse cuando el usuario seleccione un periodo diferente.
- **FR-118**: Los reportes financieros DEBEN mostrar mensajes de estado vacío en español cuando no existan movimientos o saldos para el periodo seleccionado.
- **FR-119**: Todos los importes de los reportes financieros DEBEN mostrarse en CLP con el mismo formato utilizado en el resto del módulo.
- **FR-120**: Los reportes financieros DEBEN derivarse de los registros contables existentes y NO DEBEN permitir la captura manual de cifras.
- **FR-121**: Los reportes financieros DEBEN poder generarse para periodos abiertos y cerrados sin modificar el estado del periodo.
- **FR-122**: Los reportes financieros DEBEN ser de solo consulta para todos los roles que puedan verlos.
- **FR-123**: Los reportes financieros NO DEBEN crear una nueva opción en el menú lateral ni duplicar el acceso a la sección "Reportes financieros".
- **FR-124**: Solo los roles con acceso a "Reportes financieros" según la matriz vigente DEBEN poder consultar estos reportes.
- **FR-125**: El sistema DEBE mostrar un mensaje de acceso no disponible y no revelar información cuando un rol sin permiso intente abrir los reportes directamente.
- **FR-126**: Cuando existan cuentas sin un tipo clasificable, el sistema DEBE indicar qué cuentas impiden generar el Estado de Resultados o el Balance General.
- **FR-127**: El sistema DEBE permitir únicamente al Administrador financiero cerrar un periodo contable abierto.
- **FR-128**: El sistema DEBE solicitar confirmación antes de aplicar el cierre de un periodo.
- **FR-129**: El sistema DEBE marcar el periodo como cerrado después de confirmar la acción.
- **FR-130**: El sistema DEBE conservar sin cambios los asientos y pagos existentes cuando se cierra un periodo.
- **FR-131**: El sistema NO DEBE permitir cerrar un periodo que ya esté cerrado.
- **FR-132**: El sistema DEBE mostrar claramente el estado abierto o cerrado de cada periodo en el listado de periodos.
- **FR-133**: El sistema NO DEBE permitir registrar asientos contables cuya fecha corresponda a un periodo cerrado.
- **FR-134**: El sistema NO DEBE permitir modificar, eliminar ni cambiar el estado de asientos contables existentes en un periodo cerrado.
- **FR-135**: El sistema NO DEBE permitir cambiar la fecha de un asiento o pago desde un periodo abierto hacia un periodo cerrado.
- **FR-136**: El sistema NO DEBE permitir mover un asiento o pago desde un periodo cerrado hacia otro periodo mediante la edición de su fecha.
- **FR-137**: El sistema NO DEBE permitir registrar pagos ni cobros cuya fecha corresponda a un periodo cerrado.
- **FR-138**: El sistema NO DEBE permitir modificar, marcar como pagado ni eliminar pagos o cobros existentes en un periodo cerrado.
- **FR-139**: El bloqueo de un periodo cerrado DEBE aplicarse a todos los roles, incluido el Administrador financiero.
- **FR-140**: El sistema DEBE mostrar un mensaje claro de periodo cerrado cuando se intente registrar o modificar un movimiento en ese periodo.
- **FR-141**: El sistema DEBE rechazar el guardado de un formulario abierto cuando su periodo correspondiente haya sido cerrado antes del guardado.
- **FR-142**: Los roles distintos del Administrador financiero NO DEBEN ver la acción de cerrar periodos.
- **FR-143**: El sistema DEBE bloquear el acceso directo a la acción de cierre para roles no autorizados y mostrar un mensaje de acceso no disponible.
- **FR-144**: El cierre de un periodo NO DEBE afectar las operaciones ni el estado de otros periodos.
- **FR-145**: Los usuarios autorizados DEBEN poder consultar asientos, pagos, cobros y reportes de un periodo cerrado sin acciones de modificación.
- **FR-146**: La carga de datos de ejemplo NO DEBE registrar asientos ni pagos en periodos cerrados.
- **FR-147**: El mensaje de bloqueo DEBE indicar que el periodo está cerrado y que no se pueden registrar ni modificar movimientos en ese periodo.
- **FR-148**: El sistema DEBE permitir únicamente al Administrador financiero cerrar periodos contables abiertos.
- **FR-149**: El sistema DEBE solicitar confirmación antes de cerrar un periodo y mantenerlo abierto si se cancela.
- **FR-150**: El sistema DEBE identificar claramente los periodos cerrados en el listado de periodos.
- **FR-151**: El sistema NO DEBE permitir cerrar un periodo ya cerrado ni aceptar un cierre sin periodo seleccionado.
- **FR-152**: El sistema NO DEBE permitir registrar asientos cuya fecha corresponda a un periodo cerrado.
- **FR-153**: El sistema NO DEBE permitir modificar, eliminar ni cambiar el estado de asientos en un periodo cerrado.
- **FR-154**: El sistema NO DEBE permitir registrar pagos ni cobros cuya fecha corresponda a un periodo cerrado.
- **FR-155**: El sistema NO DEBE permitir modificar, marcar como pagado ni eliminar pagos o cobros en un periodo cerrado.
- **FR-156**: El sistema NO DEBE permitir cambiar la fecha de asientos o pagos desde o hacia un periodo cerrado.
- **FR-157**: El sistema DEBE rechazar el guardado de un formulario abierto cuando su periodo haya sido cerrado antes de guardar.
- **FR-158**: El bloqueo por periodo cerrado DEBE aplicarse a todos los roles, incluido el Administrador financiero.
- **FR-159**: El sistema DEBE mostrar un mensaje claro de periodo cerrado ante cualquier intento de registro o modificación bloqueada.
- **FR-160**: Los roles distintos del Administrador financiero NO DEBEN ver la acción de cierre y NO DEBEN poder ejecutarla directamente.
- **FR-161**: El cierre de un periodo NO DEBE modificar los registros existentes ni afectar a otros periodos.
- **FR-162**: Los usuarios autorizados DEBEN poder consultar listados y reportes de periodos cerrados sin acciones de modificación.
- **FR-163**: La carga de datos de ejemplo NO DEBE crear asientos ni pagos en periodos cerrados.
- **FR-164**: El sistema DEBE generar automáticamente eventos de auditoría al crear, editar o anular asientos contables.
- **FR-165**: El sistema DEBE generar automáticamente eventos de auditoría al crear, editar o anular pagos y cobros.
- **FR-166**: Cada evento de auditoría DEBE identificar al usuario responsable mediante nombre, rol y RUT de prueba.
- **FR-167**: Cada evento de auditoría DEBE indicar la acción realizada: creación, edición o anulación.
- **FR-168**: Cada evento de auditoría DEBE registrar y mostrar la fecha y la hora en que ocurrió la acción.
- **FR-169**: Cada evento de edición DEBE describir los campos modificados del asiento o pago.
- **FR-170**: Cada evento DEBE identificar el asiento o pago afectado mediante un identificador visible y datos mínimos de contexto.
- **FR-171**: El sistema NO DEBE generar eventos de auditoría para operaciones rechazadas que no produjeron cambios.
- **FR-172**: El sistema NO DEBE generar un segundo evento de anulación cuando el movimiento ya esté anulado.
- **FR-173**: La anulación de un asiento DEBE conservar el registro y corresponder al estado cancelado.
- **FR-174**: La anulación de un pago o cobro DEBE conservar el registro y dejar de incluirlo en los totales vigentes y en el resumen por estado.
- **FR-175**: El Auditor DEBE poder consultar el historial de auditoría desde el detalle de cada asiento y de cada pago o cobro.
- **FR-176**: El Auditor DEBE poder consultar un registro consolidado de eventos de asientos y pagos dentro de "Reportes financieros".
- **FR-177**: El registro consolidado DEBE presentar los eventos en orden cronológico, con el más reciente primero.
- **FR-178**: El registro consolidado DEBE ofrecer filtros locales por tipo de movimiento, acción y usuario.
- **FR-179**: Los filtros de auditoría NO DEBEN constituir una pantalla global de búsqueda ni una nueva opción de menú.
- **FR-180**: Los eventos de auditoría NO DEBEN poder crearse, editarse ni eliminarse manualmente.
- **FR-181**: Los eventos de auditoría DEBEN permanecer sin cambios cuando se edite posteriormente el movimiento relacionado.
- **FR-182**: Solo el Auditor DEBE poder consultar el registro de auditoría.
- **FR-183**: El sistema DEBE bloquear el acceso directo de otros roles al registro de auditoría y mostrar un mensaje de acceso no disponible.
- **FR-184**: El sistema DEBE mostrar un mensaje de estado vacío cuando no existan eventos para un movimiento o para los filtros aplicados.
- **FR-185**: La fecha y hora de cada evento DEBEN mostrarse en un formato consistente con el resto del módulo.
- **FR-186**: Los datos de ejemplo DEBEN incluir eventos de auditoría deterministas de creación, edición y anulación.
- **FR-187**: Cargar datos de ejemplo dos veces DEBE producir historiales de auditoría idénticos.
- **FR-188**: El restablecimiento de datos DEBE devolver el registro de auditoría a su estado inicial determinista sin eventos huérfanos.
- **FR-189**: Cuando un movimiento no tenga eventos disponibles, el sistema DEBE informarlo sin mostrar datos incompletos ni inventar eventos.
- **FR-190**: El panel del Tesorero DEBE mostrar una alerta de pagos vencidos cuando existan pagos pendientes cuya fecha de vencimiento sea anterior a la fecha de referencia.
- **FR-191**: El panel del Tesorero DEBE mostrar una alerta de pagos que vencen esta semana cuando existan pagos pendientes cuya fecha de vencimiento esté entre la fecha de referencia y el domingo de la semana actual, inclusive.
- **FR-192**: Cada alerta DEBE mostrar la cantidad de pagos que cumplen la condición.
- **FR-193**: Cada alerta DEBE mostrar el total en CLP de los pagos que cumplen la condición, usando el mismo criterio de cálculo que el módulo.
- **FR-194**: Cada alerta DEBE permitir identificar la entidad, el monto y la fecha de vencimiento de los pagos incluidos.
- **FR-195**: Cuando existan más pagos de los que se muestran en el detalle, la alerta DEBE indicar cuántos pagos adicionales existen.
- **FR-196**: Los pagos pagados DEBEN excluirse de ambas alertas.
- **FR-197**: Los pagos anulados DEBEN excluirse de ambas alertas.
- **FR-198**: Las categorías de alerta DEBEN ser mutuamente excluyentes: un pago vencido se muestra solo en la alerta de vencidos, y un pago que vence en la semana actual se muestra solo en la alerta semanal.
- **FR-199**: Un pago con fecha de vencimiento posterior al domingo de la semana actual NO DEBE incluirse en ninguna alerta.
- **FR-200**: Las alertas DEBEN actualizarse cuando se registre, edite, marque como pagado o anule un pago.
- **FR-201**: Las alertas DEBEN actualizarse cuando se cambie la fecha de vencimiento de un pago.
- **FR-202**: Cuando no existan pagos que cumplan una condición, el panel DEBE mostrar un estado sin alertas claro o bien ocultar esa alerta sin mostrar cifras engañosas.
- **FR-203**: Las alertas DEBEN mostrarse únicamente en el panel del Tesorero.
- **FR-204**: Las alertas NO DEBEN crear una nueva opción en el menú lateral.
- **FR-205**: Las alertas NO DEBEN funcionar como acceso directo duplicado a la sección "Pagos y cobros".
- **FR-206**: Las alertas DEBEN ser coherentes con la información mostrada en la sección "Pagos y cobros" para las mismas condiciones.
- **FR-207**: La semana actual DEBE considerarse de lunes a domingo, usando la fecha de referencia definida para el panel.
- **FR-208**: Los importes de las alertas DEBEN expresarse en CLP y usar el formato consistente del módulo.
- **FR-209**: Las fechas de vencimiento de las alertas DEBEN mostrarse con el formato consistente del módulo.
- **FR-210**: Los datos de ejemplo DEBEN incluir pagos que permitan demostrar las alertas de forma determinista.
- **FR-211**: Cargar datos de ejemplo dos veces con la misma fecha de referencia DEBE producir alertas idénticas.
- **FR-212**: El restablecimiento de datos DEBE dejar las alertas en su estado inicial coherente con la semilla.
- **FR-213**: El sistema DEBE bloquear la visualización de las alertas para roles distintos del Tesorero.
- **FR-214**: El encabezado del módulo DEBE mostrar el nombre exacto "Comercial Los Andes SpA".
- **FR-215**: El encabezado DEBE mostrar un logotipo ficticio junto al nombre de la empresa.
- **FR-216**: El nombre y el logotipo DEBEN mostrarse juntos como identidad corporativa del módulo.
- **FR-217**: El encabezado con la identidad corporativa DEBE estar visible en todas las pantallas del módulo después de una sesión válida.
- **FR-218**: La identidad corporativa DEBE ser la misma para todos los roles de prueba.
- **FR-219**: El encabezado DEBE conservar la identidad corporativa al navegar entre secciones.
- **FR-220**: El nombre de la empresa NO DEBE aparecer como una nueva opción del menú lateral.
- **FR-221**: El nombre de la empresa NO DEBE sustituir ni duplicar el título de la pantalla activa.
- **FR-222**: El logotipo DEBE ser propio del prototipo y NO DEBE representar una marca real.
- **FR-223**: El nombre y el logotipo DEBEN ser claramente legibles en el encabezado.
- **FR-224**: Cuando el logotipo no esté disponible, el encabezado DEBE conservar el nombre de la empresa y una referencia visual clara en su lugar.
- **FR-225**: El logotipo DEBE contar con una descripción accesible que identifique a "Comercial Los Andes SpA".
- **FR-226**: La identidad corporativa NO DEBE modificar datos financieros, filtros ni el estado de la sesión.
- **FR-227**: La identidad corporativa DEBE permanecer igual después de cargar datos de ejemplo o restablecer datos.
- **FR-228**: En pantallas estrechas, el nombre y el logotipo DEBEN permanecer visibles o presentarse de forma legible.
- **FR-229**: El encabezado NO DEBE requerir una acción del usuario para mostrar la identidad corporativa.
- **FR-230**: Cada reporte financiero DEBE incluir un botón etiquetado exactamente "Exportar PDF".
- **FR-231**: Cada reporte financiero DEBE incluir un botón etiquetado exactamente "Exportar Excel".
- **FR-232**: Los botones de exportación DEBEN estar disponibles en el Libro Mayor, el Balance de Comprobación, el Estado de Resultados y el Balance General.
- **FR-233**: El botón "Exportar PDF" DEBE obtener un archivo descargable en formato PDF del reporte correspondiente.
- **FR-234**: El botón "Exportar Excel" DEBE obtener un archivo descargable en formato Excel del reporte correspondiente.
- **FR-235**: Los archivos exportados DEBEN corresponder al periodo seleccionado en el momento de la exportación.
- **FR-236**: Los archivos exportados DEBEN incluir el nombre exacto "Comercial Los Andes SpA".
- **FR-237**: Los archivos exportados DEBEN incluir el periodo seleccionado y la fecha de generación.
- **FR-238**: Los archivos exportados DEBEN incluir los totales aplicables al tipo de reporte.
- **FR-239**: Para el Libro Mayor, el archivo DEBE conservar saldos iniciales, débitos, créditos y saldos finales por cuenta, además de los totales generales.
- **FR-240**: Para el Balance de Comprobación, el archivo DEBE conservar los totales de débito y crédito.
- **FR-241**: Para el Estado de Resultados, el archivo DEBE conservar ingresos, gastos y resultado.
- **FR-242**: Para el Balance General, el archivo DEBE conservar activos, pasivos, patrimonio y resultado acumulado cuando corresponda.
- **FR-243**: Los archivos exportados DEBEN reflejar las mismas cifras y totales mostrados en pantalla para el mismo periodo.
- **FR-244**: Los archivos exportados NO DEBEN incluir movimientos de periodos distintos al seleccionado.
- **FR-245**: Cuando el reporte sea válido pero no tenga movimientos, el archivo DEBE incluir totales en cero y una indicación clara de ausencia de movimientos.
- **FR-246**: Cuando existan datos inconsistentes que impidan validar el reporte, el sistema DEBE bloquear la exportación y mostrar la advertencia correspondiente.
- **FR-247**: La exportación NO DEBE modificar cuentas, asientos, pagos, periodos ni filtros del módulo.
- **FR-248**: La exportación NO DEBE generar eventos de auditoría de creación, edición ni anulación de movimientos.
- **FR-249**: Los botones de exportación NO DEBEN crear una nueva opción de menú ni una pantalla adicional.
- **FR-250**: Los botones de exportación DEBEN estar disponibles para los roles que pueden consultar el reporte correspondiente.
- **FR-251**: El sistema DEBE ocultar los botones de exportación cuando el rol no pueda consultar el reporte.
- **FR-252**: El archivo descargable DEBE tener un nombre comprensible que identifique el reporte y el periodo seleccionado.
- **FR-253**: Cuando un archivo no pueda descargarse, el sistema DEBE mostrar un mensaje claro en español que permita reintentar la acción.
- **FR-254**: El listado de asientos DEBE ofrecer filtros por fecha, cuenta, monto y estado.
- **FR-255**: El listado de pagos y cobros DEBE ofrecer filtros por fecha, cuenta, monto y estado.
- **FR-256**: El filtro de fecha DEBE permitir definir un rango con fecha inicial y fecha final, ambos inclusive.
- **FR-257**: En asientos, el filtro de fecha DEBE aplicarse a la fecha contable del asiento.
- **FR-258**: En pagos y cobros, el filtro de fecha DEBE aplicarse a la fecha del movimiento.
- **FR-259**: El filtro de cuenta DEBE permitir seleccionar una cuenta contable existente.
- **FR-260**: En asientos, el filtro de cuenta DEBE considerar coincidente un asiento cuando al menos una de sus líneas use la cuenta seleccionada.
- **FR-261**: En pagos y cobros, el filtro de cuenta DEBE considerar coincidente un pago cuando su asiento relacionado use la cuenta seleccionada.
- **FR-262**: Un pago sin asiento relacionado NO DEBE considerarse coincidente cuando se aplique un filtro por cuenta específica.
- **FR-263**: El filtro de monto DEBE permitir definir un rango con monto mínimo y monto máximo, ambos inclusive.
- **FR-264**: En asientos, el filtro de monto DEBE aplicarse al monto total del asiento.
- **FR-265**: En pagos y cobros, el filtro de monto DEBE aplicarse al monto del pago o cobro.
- **FR-266**: Los montos del filtro DEBEN expresarse en CLP y usar el formato consistente del módulo.
- **FR-267**: El filtro de estado en asientos DEBE ofrecer borrador, aprobado y cancelado.
- **FR-268**: El filtro de estado en pagos y cobros DEBE ofrecer pendiente, pagado, vencido y anulado.
- **FR-269**: La opción inicial del filtro de estado DEBE ser "Todos", que representa ausencia de filtro por estado.
- **FR-270**: Los filtros aplicados DEBEN combinarse entre sí con criterio de coincidencia simultánea.
- **FR-271**: El sistema DEBE mostrar cuántos resultados cumplen los filtros aplicados.
- **FR-272**: El sistema DEBE ofrecer una acción para limpiar todos los filtros aplicados.
- **FR-273**: El sistema DEBE permitir limpiar un filtro individual sin afectar los demás.
- **FR-274**: Cuando no existan resultados, el sistema DEBE mostrar un mensaje de estado vacío claro en español.
- **FR-275**: Cuando un rango de fechas sea inválido, el sistema DEBE mostrar un mensaje específico y NO DEBE aplicar ese filtro.
- **FR-276**: Cuando un rango de montos sea inválido, el sistema DEBE mostrar un mensaje específico y NO DEBE aplicar ese filtro.
- **FR-277**: Cuando se ingrese un monto negativo o no numérico, el sistema DEBE rechazarlo con una explicación clara.
- **FR-278**: Los filtros DEBEN respetar la matriz de permisos vigente.
- **FR-279**: Los filtros NO DEBEN crear una nueva opción de menú ni una pantalla global de búsqueda.
- **FR-280**: El filtro de estado de pagos y cobros DEBE unificarse con el control de estado existente para evitar duplicidad.
- **FR-281**: Aplicar o limpiar filtros NO DEBE modificar cuentas, asientos, pagos ni periodos.
- **FR-282**: Los filtros DEBEN actualizarse de forma coherente cuando cambien los datos de ejemplo o se restablezca el módulo.
- **FR-283**: Las opciones de filtro DEBEN corresponder solo a estados y cuentas válidos para el tipo de registro.
- **FR-284**: Todas las pantallas del módulo DEBEN usar la misma paleta de colores.
- **FR-285**: Los colores de éxito, error, advertencia e información DEBEN ser consistentes en todo el módulo.
- **FR-286**: Cada sección del menú DEBE mostrar un ícono junto a su texto.
- **FR-287**: Cada encabezado de sección DEBE mostrar el ícono correspondiente a esa sección.
- **FR-288**: Los íconos DEBEN ser consistentes entre menú y encabezado de sección.
- **FR-289**: El texto de cada sección DEBE permanecer visible junto a su ícono.
- **FR-290**: Las tablas del módulo DEBEN permitir ordenar registros por sus columnas aplicables.
- **FR-291**: Cada columna ordenable DEBE permitir orden ascendente y descendente.
- **FR-292**: La tabla DEBE indicar la columna ordenada y el sentido del orden aplicado.
- **FR-293**: El orden por fechas DEBE respetar el valor cronológico.
- **FR-294**: El orden por importes DEBE respetar el valor numérico.
- **FR-295**: El orden por estados DEBE agrupar los registros de forma coherente con los estados definidos.
- **FR-296**: Ordenar una tabla NO DEBE modificar los registros ni sus valores.
- **FR-297**: Después de guardar un registro válido, el sistema DEBE mostrar un mensaje de confirmación de éxito.
- **FR-298**: Antes de eliminar un registro permitido, el sistema DEBE mostrar un mensaje de confirmación.
- **FR-299**: Cuando el usuario cancele la confirmación de eliminación, el sistema NO DEBE eliminar el registro.
- **FR-300**: Después de confirmar una eliminación permitida, el sistema DEBE mostrar un mensaje de confirmación de eliminación.
- **FR-301**: Cuando un guardado falle por validación, el sistema NO DEBE mostrar un mensaje de éxito.
- **FR-302**: Cuando un registro no sea eliminable según las reglas vigentes, el sistema NO DEBE ofrecer la confirmación de eliminación.
- **FR-303**: Los mensajes de confirmación DEBEN usar un lenguaje claro y consistente en todo el módulo.
- **FR-304**: El menú DEBE adaptarse a pantallas de celular sin ocultar secciones permitidas para el rol.
- **FR-305**: El menú en celular NO DEBE mostrar secciones no permitidas para el rol autenticado.
- **FR-306**: Al seleccionar una sección desde el menú en celular, el menú DEBE dejar de ocupar la pantalla.
- **FR-307**: Las opciones del menú en celular DEBEN ser las mismas que las del menú en pantalla amplia, respetando permisos.
- **FR-308**: La interfaz NO DEBE requerir desplazamiento horizontal de toda la página para usar el menú en celular.
- **FR-309**: Las mejoras de interfaz NO DEBEN modificar reglas de negocio, permisos ni datos financieros.
- **FR-310**: La interfaz NO DEBE crear una nueva opción de menú derivada de estos cambios.
- **FR-311**: Cuando un ícono no pueda mostrarse, el texto de la sección DEBE permanecer visible y comprensible.
- **FR-312**: Cuando una tabla no tenga registros, DEBE mostrarse un estado vacío claro con la paleta definida.
- **FR-313**: Cuando un mensaje de confirmación se muestre en pantalla estrecha, DEBE permanecer legible y comprensible.
- **FR-314**: El campo RUT DEBE formatear automáticamente el valor mientras se escribe, insertando puntos de agrupación y un guion antes del dígito verificador sin borrar, duplicar ni reordenar dígitos.
- **FR-315**: El campo RUT DEBE aceptar un dígito verificador numérico o la letra k en mayúscula o minúscula, y DEBE reconocer ambas formas como equivalentes para la validación y la autenticación.
- **FR-316**: El sistema DEBE validar el dígito verificador del RUT con la regla chilena estándar antes de intentar autenticar al usuario.
- **FR-317**: Cuando el RUT tenga un dígito verificador inválido, el sistema DEBE mostrar el mensaje "El RUT ingresado no es válido" y NO DEBE iniciar sesión ni mostrar el mensaje genérico de credenciales incorrectas.
- **FR-318**: Cuando el RUT sea válido pero no corresponda a un usuario de prueba, o cuando la contraseña sea incorrecta, el sistema DEBE mostrar el mensaje "RUT o contraseña incorrectos" definido en FR-048 sin revelar cuál dato falló.
- **FR-319**: El formateo automático DEBE conservar la equivalencia entre un RUT escrito con puntos y guion y el mismo RUT escrito sin ellos, de modo que ambos autentiquen de igual forma con la misma contraseña.
- **FR-320**: El formateo automático NO DEBE impedir corregir, borrar ni reemplazar caracteres del RUT mientras se edita el campo.
- **FR-321**: Cuando el valor pegado en el campo RUT no tenga puntos ni guion, el sistema DEBE aplicar el mismo formateo automático que aplica a la escritura manual.
- **FR-322**: El encabezado DEBE mostrar un botón identificado como "Menú" cuando exista una sesión válida.
- **FR-323**: Al seleccionar el botón "Menú" con el menú lateral cerrado, el sistema DEBE abrirlo y mostrar únicamente las secciones permitidas para el rol autenticado.
- **FR-324**: Al seleccionar el botón "Menú" con el menú lateral abierto, el sistema DEBE cerrarlo sin cambiar de pantalla, sin cerrar sesión y sin modificar datos.
- **FR-325**: El botón "Menú" DEBE reflejar visualmente si el menú lateral está abierto o cerrado.
- **FR-326**: El botón "Menú" NO DEBE crear una entrada adicional en el menú lateral ni duplicar el acceso a una pantalla existente.
- **FR-327**: Después de cerrar sesión, el botón "Menú" NO DEBE abrir el menú lateral sin una nueva autenticación válida.
- **FR-328**: Abrir o cerrar el menú lateral desde el encabezado NO DEBE modificar reglas de negocio, permisos, filtros, datos financieros ni el estado de autenticación.
- **FR-329**: La pantalla de acceso DEBE presentar el formulario de inicio de sesión centrado en el área visible.
- **FR-330**: El formulario de acceso DEBE ser angosto y NO DEBE ocupar todo el ancho de la pantalla en dispositivos amplios.
- **FR-331**: El botón "Ingresar" DEBE aparecer inmediatamente después del último campo obligatorio, sin un espacio vacío superior que lo separe de dicho campo.
- **FR-332**: La pantalla de acceso NO DEBE mostrar información financiera antes de una autenticación válida, además de la ocultación del menú lateral definida en FR-102.
- **FR-333**: El menú lateral DEBE estar alineado al borde izquierdo del área de trabajo cuando esté visible.
- **FR-334**: El menú lateral DEBE conservar las etiquetas, el orden y los permisos vigentes de las secciones.
- **FR-335**: El encabezado DEBE mostrar el nombre del usuario autenticado y su rol cuando exista una sesión válida.
- **FR-336**: La acción "Cerrar sesión" DEBE mostrarse en el encabezado junto al nombre del usuario y su rol.
- **FR-337**: La acción "Cerrar sesión" del encabezado DEBE conservar el comportamiento definido en FR-050 y FR-051.
- **FR-338**: Los importes monetarios DEBEN mostrarse con el símbolo "$" antes del valor y punto como separador de miles.
- **FR-339**: Los importes monetarios DEBEN mostrarse sin decimales.
- **FR-340**: El formato monetario DEBE aplicarse de forma consistente a listados, formularios, resúmenes, reportes y mensajes que contengan montos.
- **FR-341**: Un importe de cinco mil DEBE presentarse como "$5.000" cuando se muestre al usuario.
- **FR-342**: El cambio de presentación de los importes NO DEBE modificar los valores numéricos, los cálculos ni las reglas contables vigentes.
- **FR-343**: Cada pantalla con registros DEBE mostrar primero el listado disponible para el usuario.
- **FR-344**: Cada pantalla con registros DEBE ofrecer un botón visible identificado como "Nuevo" cuando el usuario tenga permiso para crear.
- **FR-345**: Al seleccionar "Nuevo", el sistema DEBE abrir el formulario correspondiente en una ventana dentro del módulo, sin reemplazar el listado de fondo.
- **FR-346**: La ventana del formulario DEBE conservar el listado y los filtros previamente aplicados sin cambios mientras esté abierta.
- **FR-347**: La ventana del formulario DEBE poder cerrarse sin guardar, dejando los datos y el listado sin modificaciones.
- **FR-348**: La creación de registros desde la ventana DEBE conservar las validaciones, reglas de negocio y permisos vigentes.
- **FR-349**: El botón "Nuevo" NO DEBE mostrarse en pantallas donde el rol autenticado no pueda crear registros.
- **FR-350**: El control "×" para limpiar un filtro NO DEBE superponerse con la flecha del selector.
- **FR-351**: La "×" de un filtro DEBE limpiar únicamente ese filtro sin activar el selector de opciones.
- **FR-352**: La flecha del selector DEBE abrir las opciones del filtro sin activar la acción de limpiar.
- **FR-353**: Los controles de filtro DEBEN permanecer legibles y separados incluso cuando el texto de la opción seleccionada sea extenso.
- **FR-354**: La fila de totales del Libro Mayor DEBE alinearse con las columnas de saldo inicial, débitos, créditos y saldo final.
- **FR-355**: La fila de totales del Libro Mayor DEBE conservar los importes y el criterio de cálculo vigente.
- **FR-356**: Cuando un listado no tenga registros, el sistema DEBE mostrar un mensaje claro en español que indique que no hay resultados.
- **FR-357**: Cuando un filtro no produzca coincidencias, el sistema DEBE mostrar un mensaje que indique que no hay registros para ese filtro, además del estado vacío general definido en FR-274.
- **FR-358**: El mensaje de lista vacía NO DEBE presentarse como un mensaje de error ni indicar que falló la carga.
- **FR-359**: El mensaje de lista vacía DEBE permanecer dentro del área del listado y ser legible.
- **FR-360**: Cuando existan registros, el sistema NO DEBE mostrar el mensaje de lista vacía.
- **FR-361**: Las mejoras de usabilidad NO DEBEN agregar, eliminar ni modificar operaciones, permisos, datos ni reglas de negocio.
- **FR-362**: Las mejoras de usabilidad NO DEBEN crear nuevas opciones de menú ni accesos duplicados a pantallas existentes.
- **FR-363**: Las mejoras DEBEN aplicarse a todos los roles que ya tenían acceso a las pantallas afectadas.
- **FR-364**: Los encabezados de columnas monetarias en tablas y reportes financieros DEBEN indicar la unidad CLP.
- **FR-365**: Cada total monetario de los reportes financieros DEBE ofrecer un desglose con los registros o movimientos que lo componen.
- **FR-366**: El desglose DEBE mostrar el origen, la referencia y el importe CLP de cada registro y DEBE poder cerrarse sin modificar datos, filtros ni periodos.
- **FR-367**: Las tablas de reportes DEBEN permitir ordenar por tipo cuando esté presente la columna "Tipo".
- **FR-368**: El desglose y la indicación de unidad NO DEBEN modificar importes, reglas de cálculo, permisos ni la igualdad contable.
- **FR-369**: Todo el módulo DEBE usar CLP como única moneda en datos, encabezados, etiquetas y exportaciones, sin conversión.
- **FR-370**: Los importes DEBEN mostrarse en formato chileno con "$", puntos de miles y sin decimales, incluidas las etiquetas compactas.
- **FR-371**: La semilla y el plan de cuentas DEBEN usar "IVA Débito Fiscal" e "IVA Crédito Fiscal" como nombres de las cuentas de IVA.
- **FR-372**: Los documentos creados sin moneda explícita DEBEN almacenarse con CLP.

### Requisitos de Extensibilidad 

El módulo de Contabilidad y Finanzas DEBE:
- **XR-001**: Reutilizar las estructuras base Entity y Document del sistema ERP para relacionar las operaciones financieras con los registros generales de la empresa.
- **XR-002**: Mantener las entidades específicas del módulo separadas de las estructuras centrales del ERP base.
- **XR-003**: Permitir relacionar los pagos y cobros con entidades y documentos existentes.
- **XR-004**: Mantener relaciones consistentes entre cuentas contables, asientos contables, líneas de asiento y periodos contables.
- **XR-005**: Permitir incorporar futuras funcionalidades financieras sin modificar innecesariamente la estructura central del ERP.
- **XR-006**: Mantener la compatibilidad con la estructura de datos definida por el módulo base.

### Entidades Clave 


- **CuentaContable**: Representa una cuenta del plan contable de la empresa. Permite clasificar las operaciones financieras según su naturaleza y mantener una estructura jerárquica mediante cuentas principales y subcuentas.
- **AsientoContable**: Representa el registro de una operación económica de la empresa. Contiene información como fecha, concepto, periodo contable, débitos y créditos.
- **LineaAsiento**: Representa cada movimiento individual que forma parte de un asiento contable. Se relaciona con una cuenta contable y registra un monto correspondiente al debe o al haber.
- **Pago**: Representa un movimiento de dinero correspondiente a un pago o cobro realizado por la empresa. Puede relacionarse con una entidad, un documento y un asiento contable. Posee una fecha de vencimiento y un estado pendiente, pagado, vencido o anulado.
- **PeriodoContable**: Representa un intervalo de tiempo utilizado para organizar las operaciones contables. Posee una fecha de inicio, una fecha de término y un estado que indica si está abierto o cerrado.
- **Entity (Entidad)**: Estructura heredada del módulo base ERP que representa clientes, proveedores u otras entidades relacionadas con las operaciones financieras.
- **Document (Documento)**: Estructura heredada del módulo base ERP que permite relacionar documentos comerciales o transaccionales con las operaciones del módulo financiero.
- **UsuarioDemo**: Usuario ficticio de demostración identificado por un RUT, una contraseña de prueba, un nombre y un rol asignado.
- **Rol**: Categoría de acceso que determina el panel de inicio presentado: Administrador financiero, Contador, Tesorero o Auditor.
- **PanelInicio**: Vista inicial asociada a un rol, que resume la información relevante para ese usuario y ofrece la acción de cerrar sesión.
- **PermisoRol**: Conjunto de acciones permitidas por cada rol sobre las secciones del módulo, según la matriz de acceso.
- **OpcionMenu**: Entrada visible del menú que se muestra solo cuando el rol autenticado tiene permiso para usar la sección correspondiente.
- **DatosEjemplo**: Conjunto determinista de periodos, cuentas, asientos y pagos o cobros que puede cargarse desde el panel del Administrador financiero.
- **EstadoInicial**: Situación válida sin registros financieros a la que vuelve el módulo al restablecer datos, conservando los usuarios de prueba.
- **DestinoNavegacion**: Pantalla del módulo que debe tener un único acceso visible y estar disponible solo para los roles autorizados.
- **ControlAccion**: Botón del panel que ejecuta una acción inmediata, como cargar datos, restablecer datos o cerrar sesión, sin abrir una pantalla de navegación.
- **EstadoPago**: Clasificación de un pago o cobro como pendiente, pagado, vencido o anulado, según su confirmación, su fecha de vencimiento y su anulación conservando el registro.
- **ResumenPagos**: Agrupación de pagos y cobros por estado que presenta la cantidad de registros y el total en CLP de cada grupo.
- **ReporteFinanciero**: Consulta por periodo que presenta el Libro Mayor, el Balance de Comprobación, el Estado de Resultados o el Balance General a partir de asientos aprobados.
- **SaldoContable**: Resultado de agregar los movimientos aprobados de una cuenta hasta una fecha determinada, utilizado para los reportes financieros.
- **CierrePeriodo**: Acción administrativa confirmada que cambia un periodo de abierto a cerrado y bloquea el registro y la modificación de asientos y pagos en ese periodo.
- **MensajePeriodoCerrado**: Comunicación clara que informa que la operación solicitada no está disponible porque el periodo está cerrado.
- **EventoAuditoria**: Registro automático e inmutable de una creación, edición o anulación de un asiento o pago, con usuario responsable, fecha y hora.
- **HistorialAuditoria**: Conjunto ordenado de eventos de auditoría asociados a un asiento o pago específico.
- **RegistroConsolidado**: Consulta de solo lectura que reúne eventos de asientos y pagos con filtros locales para el Auditor.
- **UsuarioResponsable**: Usuario ficticio de demostración identificado por nombre, rol y RUT, responsable de una acción registrada en auditoría.
- **AlertaPago**: Aviso del panel del Tesorero que resume pagos con una condición de vencimiento específica.
- **ResumenAlerta**: Cantidad de pagos y total en CLP asociados a una alerta.
- **PanelTesorero**: Vista inicial del Tesorero donde se muestran las alertas de vencimientos de pagos.
- **SemanaReferencia**: Intervalo de lunes a domingo usado para determinar qué pagos vencen esta semana.
- **EntidadPago**: Cliente, proveedor u otra entidad asociada al pago, utilizada para identificar cada movimiento dentro de la alerta.
- **EncabezadoModulo**: Área superior común del módulo que presenta la identidad de la empresa ficticia, el nombre y rol del usuario autenticado y la acción "Cerrar sesión".
- **EmpresaFicticia**: Organización demostrativa llamada "Comercial Los Andes SpA", propietaria de los datos financieros de ejemplo.
- **LogotipoEmpresa**: Elemento visual ficticio que identifica a "Comercial Los Andes SpA" dentro del encabezado.
- **IdentidadCorporativa**: Combinación del nombre de la empresa y su logotipo presentada de forma consistente en todas las pantallas.
- **BotonExportacion**: Acción visible en un reporte financiero que permite obtener el archivo en PDF o Excel.
- **ArchivoReporte**: Resultado descargable que contiene el reporte del periodo seleccionado con identidad de empresa, fecha y totales.
- **TotalesReporte**: Conjunto de importes y saldos aplicables al tipo de reporte que deben conservarse en la exportación.
- **FiltroFecha**: Rango inclusive de fechas aplicado a la fecha contable de un asiento o a la fecha del movimiento de un pago.
- **FiltroCuenta**: Criterio que selecciona una cuenta contable y determina qué asientos o pagos coinciden.
- **FiltroMonto**: Rango inclusive de montos en CLP aplicado al total de un asiento o al monto de un pago.
- **FiltroEstado**: Criterio que selecciona uno o todos los estados válidos del tipo de registro.
- **ListadoFiltrado**: Resultado de aplicar uno o varios filtros sobre el listado de asientos o pagos.
- **ResultadoVacio**: Estado que informa que ningún registro cumple la combinación de filtros aplicada.
- **PaletaColores**: Conjunto único de colores usado para encabezados, botones, mensajes y estados en todo el módulo.
- **IconoSeccion**: Elemento visual asociado a una sección del menú y a su encabezado.
- **TablaOrdenable**: Tabla cuyas columnas permiten ordenar registros en sentido ascendente o descendente.
- **MensajeConfirmacion**: Aviso claro que informa el resultado de guardar o confirma una eliminación.
- **MenuAdaptable**: Presentación del menú que se ajusta a celular conservando secciones y permisos.
- **EstadoInterfaz**: Estado visual coherente para éxito, error, advertencia, información y ausencia de datos.
- **RutFormateado**: Valor del RUT presentado con puntos y guion mientras se escribe, equivalente al valor introducido sin esos signos y con k en mayúscula o minúscula.
- **DigitoVerificador**: Carácter final del RUT validado con la regla chilena estándar para determinar si el RUT es válido antes de autenticar.
- **MensajeRutInvalido**: Aviso específico que informa que el RUT no es válido por su dígito verificador y bloquea el acceso.
- **BotonMenu**: Control del encabezado que abre y cierra el menú lateral sin cambiar de pantalla ni modificar la sesión.
- **EstadoMenuLateral**: Condición del menú lateral como abierto o cerrado, reflejada en el botón "Menú".
- **PantallaAcceso**: Vista inicial que concentra el formulario de credenciales y el botón "Ingresar" sin espacio vacío superior innecesario.
- **FormularioAcceso**: Conjunto de campos de autenticación conservados sin cambios funcionales respecto al comportamiento vigente.
- **MenuLateral**: Navegación principal alineada al borde izquierdo del área de trabajo, con las secciones permitidas por el rol.
- **IdentificacionUsuario**: Nombre y rol del usuario con sesión válida, mostrados juntos en el encabezado.
- **ImporteFormateado**: Presentación de un valor monetario con símbolo "$", separador de miles y sin decimales, equivalente al valor numérico usado en cálculos.
- **ListadoPrincipal**: Primer contenido visible de una pantalla con registros, conservando filtros y datos mientras se abre un formulario.
- **BotonNuevo**: Control visible que abre el formulario de creación en una ventana dentro del módulo.
- **VentanaFormulario**: Área temporal donde se captura o edita información sin reemplazar el listado de fondo.
- **ControlFiltro**: Elemento de filtro que incluye la opción de limpiar y el selector de valores sin superposición entre ambos controles.
- **FilaTotales**: Fila del Libro Mayor que presenta los totales alineados con saldo inicial, débitos, créditos y saldo final.
- **MensajeListaVacia**: Aviso claro y legible que informa que no hay registros o que un filtro no produjo resultados.

## Criterios de Éxito 

### Resultados Medibles

- **SC-001**: Los usuarios pueden crear y consultar cuentas contables desde la interfaz del módulo.
- **SC-002**: Los usuarios pueden registrar un asiento contable cuando la suma de débitos coincide con la suma de créditos.
- **SC-003**: El sistema identifica y rechaza los asientos contables que no cumplen el principio de partida doble.
- **SC-004**: Los usuarios pueden registrar y consultar pagos y cobros asociados a entidades existentes.
- **SC-005**: Los usuarios pueden crear y consultar periodos contables, identificando claramente cuáles están abiertos y cuáles cerrados.
- **SC-006**: El sistema impide registrar nuevos asientos contables en periodos cerrados.
- **SC-007**: Los usuarios pueden consultar reportes con los movimientos contables correspondientes al periodo seleccionado.
- **SC-008**: Los reportes muestran correctamente los totales de débitos y créditos de los movimientos consultados.
- **SC-009**: Las principales funcionalidades del módulo pueden probarse mediante la interfaz frontend y datos de ejemplo, sin requerir una conexión real a una base de datos.
- **SC-010**: La navegación entre las distintas secciones permite consultar las funcionalidades del módulo sin perder los datos de ejemplo durante su uso.
- **SC-011**: Los usuarios pueden interpretar en el panel las gráficas de ingresos, gastos, resultado y gastos por cuenta, coherentes con los cálculos de los reportes financieros.
- **SC-012**: El 100% de los cuatro usuarios de prueba puede iniciar sesión en menos de un minuto y acceder al panel correspondiente a su rol.
- **SC-013**: Cada rol identifica al menos un indicador o sección exclusiva de su panel de inicio en la primera visualización.
- **SC-014**: El 100% de los intentos con credenciales incorrectas muestra el mensaje de error y no otorga acceso a ningún panel.
- **SC-015**: Un usuario autenticado puede cerrar sesión en un solo paso y, al intentar volver a su panel, debe autenticarse nuevamente en el 100% de las pruebas.
- **SC-016**: El 100% de los usuarios de prueba ve exactamente las opciones de menú definidas para su rol, sin secciones adicionales ni ausentes.
- **SC-017**: El 100% de los intentos de acceso a secciones no permitidas muestra un mensaje de acceso no disponible y no revela información de esas secciones.
- **SC-018**: El Administrador financiero puede abrir o cerrar un periodo contable sin intervención de otro rol durante una misma sesión de trabajo.
- **SC-019**: Al menos el 95% de los usuarios de prueba identifica la acción principal de su rol en el menú en menos de 10 segundos durante pruebas de usabilidad.
- **SC-020**: El 100% de las cargas de datos de ejemplo finaliza en menos de 10 segundos y produce al menos cuatro periodos con cuentas, asientos y pagos o cobros.
- **SC-021**: El 100% de las cargas repetidas genera idénticos periodos, importes, fechas y cantidades.
- **SC-022**: El 100% de los restablecimientos deja el módulo en un estado inicial válido, sin referencias rotas y con los usuarios de prueba disponibles.
- **SC-023**: Al menos el 95% de los administradores financieros encuentra los botones de carga y restablecimiento en su panel sin ayuda en menos de 5 segundos.
- **SC-024**: El 100% de los roles no ve Entidades, Documentos ni Búsqueda en el menú ni en el panel de inicio.
- **SC-025**: La revisión de navegación identifica 0 pantallas con más de un control visible que las abra.
- **SC-026**: El 100% de los flujos que requieren una entidad o un documento se completa dentro de la pantalla permitida correspondiente.
- **SC-027**: Al menos el 95% de los usuarios encuentra la pantalla requerida con un solo acceso visible en menos de 5 segundos.
- **SC-028**: El 100% de los pagos y cobros de la semilla queda clasificado correctamente entre pendiente, pagado y vencido.
- **SC-029**: En el 100% de las verificaciones, las cantidades y los totales del resumen coinciden con el listado resultante de cada filtro.
- **SC-030**: Un usuario con acceso a pagos aplica cualquier filtro de estado y visualiza el resultado actualizado en menos de 3 segundos.
- **SC-031**: Al menos el 95% de los usuarios con acceso a pagos identifica el estado de un movimiento sin ayuda después de usar el resumen.
- **SC-032**: El 100% de las pruebas sin autenticación no muestra menú lateral y el 100% de las autenticaciones válidas muestra únicamente las secciones permitidas para el rol.
- **SC-033**: El 100% de los cierres de sesión oculta el menú lateral y evita recuperarlo navegando hacia atrás sin autenticarse de nuevo.
- **SC-034**: El 100% de los cuatro reportes financieros puede generarse para cualquier periodo que tenga al menos un asiento contable aprobado.
- **SC-035**: El 100% de los importes mostrados en los reportes financieros coincide con los movimientos aprobados de origen correspondientes al periodo seleccionado.
- **SC-036**: El 100% de los balances de comprobación generados cumple la igualdad entre totales deudores y acreedores cuando los datos son válidos.
- **SC-037**: El 100% de los balances generales generados cumple la igualdad entre activos y pasivos más patrimonio cuando los datos son válidos.
- **SC-038**: El 100% de los estados de resultados generados muestra un resultado igual a ingresos menos gastos del periodo.
- **SC-039**: El 95% de los Contadores puede generar los cuatro reportes para un mismo periodo en menos de 2 minutos durante una prueba de uso.
- **SC-040**: El usuario ve cada reporte financiero en menos de 5 segundos después de seleccionar el periodo y solicitarlo.
- **SC-041**: El 100% de los periodos sin movimientos ni saldos muestra un mensaje de estado vacío en los cuatro reportes.
- **SC-042**: El 100% de los roles sin acceso a Reportes financieros no puede consultar los reportes ni ver sus cifras.
- **SC-043**: Al menos el 90% de los Contadores encuestados indica que los cuatro reportes le permiten comprender la situación financiera de la empresa sin consultar otras secciones.
- **SC-044**: El 100% de los periodos cerrados queda identificado como cerrado inmediatamente después de confirmar la acción.
- **SC-045**: El 100% de los intentos de registrar o modificar asientos en periodos cerrados se bloquea y muestra un mensaje claro.
- **SC-046**: El 100% de los intentos de registrar o modificar pagos y cobros en periodos cerrados se bloquea y muestra un mensaje claro.
- **SC-047**: El 100% de los intentos de mover un asiento o pago desde o hacia un periodo cerrado se bloquea.
- **SC-048**: El 100% de los roles distintos del Administrador financiero no ve ni puede ejecutar la acción de cerrar periodos.
- **SC-049**: El 100% de los cierres cancelados deja el periodo abierto y sin cambios.
- **SC-050**: El 100% de los registros existentes se conserva sin modificaciones después de cerrar el periodo correspondiente.
- **SC-051**: El 100% de los usuarios autorizados puede consultar reportes de periodos cerrados sin encontrar acciones de modificación.
- **SC-052**: El 100% de los periodos cerrados conserva sus registros después de cargar datos de ejemplo.
- **SC-053**: El 95% de los Administradores financieros puede cerrar un periodo y explicar sus efectos en menos de 1 minuto durante una prueba de uso.
- **SC-054**: El 100% de los periodos cerrados queda marcado como cerrado inmediatamente después de confirmar la acción.
- **SC-055**: El 100% de los intentos de registrar o modificar asientos en periodos cerrados se bloquea con un mensaje claro.
- **SC-056**: El 100% de los intentos de registrar o modificar pagos y cobros en periodos cerrados se bloquea con un mensaje claro.
- **SC-057**: El 100% de los intentos de mover asientos o pagos desde o hacia periodos cerrados se bloquea.
- **SC-058**: El 100% de los roles distintos del Administrador financiero no ve ni ejecuta la acción de cierre.
- **SC-059**: El 100% de los registros existentes se conserva sin cambios después de cerrar el periodo correspondiente.
- **SC-060**: El 100% de los usuarios autorizados puede consultar reportes de periodos cerrados sin encontrar acciones de modificación.
- **SC-061**: El 100% de los cierres cancelados deja el periodo abierto y sin cambios.
- **SC-062**: El 100% de los periodos cerrados conserva sus registros después de cargar datos de ejemplo.
- **SC-063**: El 95% de los usuarios puede identificar un periodo cerrado en el listado sin ayuda en menos de 5 segundos.
- **SC-064**: El 100% de las creaciones, ediciones y anulaciones de asientos genera un evento de auditoría completo.
- **SC-065**: El 100% de las creaciones, ediciones y anulaciones de pagos y cobros genera un evento de auditoría completo.
- **SC-066**: El 100% de los eventos muestra usuario, rol, acción, fecha y hora del momento en que ocurrió la acción.
- **SC-067**: El 100% de los historiales por movimiento muestra sus eventos en orden cronológico descendente.
- **SC-068**: El 100% de los eventos de edición identifica los campos modificados.
- **SC-069**: El 100% de los intentos de modificar o eliminar eventos de auditoría es bloqueado.
- **SC-070**: El 100% de los roles distintos del Auditor no puede consultar el registro de auditoría.
- **SC-071**: El 100% de las consultas con filtros devuelve únicamente los eventos que coinciden con la selección.
- **SC-072**: El 100% de las cargas de datos de ejemplo produce historiales idénticos en usuarios, acciones, fechas y horas.
- **SC-073**: El 100% de los restablecimientos deja el registro de auditoría en su estado inicial sin eventos huérfanos.
- **SC-074**: El Auditor localiza el evento de creación, edición o anulación de un movimiento en menos de 1 minuto en el 95% de las pruebas.
- **SC-075**: Al menos el 90% de los Auditores encuestados indica que el registro de auditoría le permite identificar responsables de cambios y apoyar el control de riesgos.
- **SC-076**: El 100% de los pagos pendientes vencidos se refleja en la alerta de vencidos con cantidad y total correctos.
- **SC-077**: El 100% de los pagos pendientes que vencen en la semana actual se refleja en la alerta semanal con cantidad y total correctos.
- **SC-078**: El 100% de los pagos pagados o anulados se excluye de ambas alertas.
- **SC-079**: El 100% de las alertas muestra importes en CLP y fechas con el formato consistente del módulo.
- **SC-080**: El 100% de los cambios de estado o fecha de vencimiento se refleja en las alertas después de actualizar el panel.
- **SC-081**: El 100% de los roles distintos del Tesorero no ve las alertas en su panel.
- **SC-082**: El 100% de las pruebas con datos de ejemplo produce alertas idénticas para la misma fecha de referencia.
- **SC-083**: El 100% de los restablecimientos deja las alertas coherentes con la semilla inicial.
- **SC-084**: El Tesorero identifica los pagos vencidos y de la semana actual en menos de 10 segundos desde su panel en el 95% de las pruebas.
- **SC-085**: Al menos el 90% de los Tesoreros encuestados indica que las alertas del panel le ayudan a priorizar los vencimientos.
- **SC-086**: El 100% de las alertas coincide con la información de "Pagos y cobros" al aplicar las mismas condiciones.
- **SC-087**: No se introduce ninguna opción de menú adicional ni acceso duplicado derivado de las alertas.
- **SC-088**: El 100% de las pantallas posteriores al inicio de sesión muestra el nombre exacto "Comercial Los Andes SpA" en el encabezado.
- **SC-089**: El 100% de las pantallas posteriores al inicio de sesión muestra el logotipo junto al nombre de la empresa.
- **SC-090**: El 100% de las verificaciones de texto confirma que el nombre no tiene errores de escritura ni variaciones.
- **SC-091**: El 100% de los roles de prueba ve la misma identidad corporativa en el encabezado.
- **SC-092**: El 100% de las navegaciones entre pantallas conserva el nombre y el logotipo sin cambios.
- **SC-093**: El 100% de las pruebas de carga y restablecimiento de datos conserva la identidad corporativa.
- **SC-094**: El 100% de las pruebas sin logotipo disponible mantiene el nombre visible y una referencia visual clara.
- **SC-095**: No se crea ninguna opción adicional de menú a partir de la identidad corporativa.
- **SC-096**: El 95% de los usuarios identifica el nombre de la empresa en el encabezado en menos de 3 segundos.
- **SC-097**: Al menos el 90% de los usuarios encuestados indica que el encabezado ayuda a reconocer la empresa ficticia del módulo.
- **SC-098**: El 100% de los reportes financieros muestra los botones "Exportar PDF" y "Exportar Excel".
- **SC-099**: El 100% de las exportaciones genera un archivo descargable en el formato seleccionado.
- **SC-100**: El 100% de los archivos exportados incluye el nombre exacto "Comercial Los Andes SpA".
- **SC-101**: El 100% de los archivos exportados incluye el periodo seleccionado y la fecha de generación.
- **SC-102**: El 100% de los archivos exportados incluye los totales aplicables al reporte.
- **SC-103**: El 100% de las comparaciones entre pantalla y archivo muestra cifras y totales idénticos.
- **SC-104**: El 100% de las exportaciones bloqueadas por datos inconsistentes muestra una advertencia comprensible.
- **SC-105**: El 100% de las exportaciones de reportes vacíos válidos muestra totales en cero y una indicación de ausencia de movimientos.
- **SC-106**: El 100% de las exportaciones conserva el estado del módulo y no genera eventos de auditoría de movimientos.
- **SC-107**: No se crea ninguna opción de menú ni pantalla adicional para la exportación.
- **SC-108**: El 95% de los Contadores obtiene el archivo correcto en menos de 10 segundos desde que abre el reporte.
- **SC-109**: Al menos el 90% de los Contadores encuestados indica que los archivos exportados contienen la información necesaria para revisar el periodo seleccionado.
- **SC-110**: El 100% de los asientos que cumplen los filtros aplicados aparece en el listado filtrado.
- **SC-111**: El 100% de los pagos y cobros que cumplen los filtros aplicados aparece en el listado filtrado.
- **SC-112**: El 100% de los registros que no cumplen los filtros queda excluido del listado filtrado.
- **SC-113**: El 100% de las combinaciones de filtros respeta coincidencia simultánea de todos los criterios aplicados.
- **SC-114**: El 100% de los rangos de fecha y monto incluye sus valores límite.
- **SC-115**: El 100% de las opciones de estado corresponde a los estados válidos del tipo de registro.
- **SC-116**: El 100% de las acciones de limpiar filtros restaura el listado completo permitido para el rol.
- **SC-117**: El 100% de las entradas inválidas de fecha o monto muestra un mensaje claro y no altera el listado.
- **SC-118**: El 100% de los roles ve filtros solo en los listados a los que tiene acceso.
- **SC-119**: No se crea ninguna opción de menú ni pantalla de búsqueda global derivada de los filtros.
- **SC-120**: El 95% de los usuarios localiza un asiento o pago específico usando filtros en menos de 15 segundos.
- **SC-121**: Al menos el 90% de los usuarios encuestados indica que los filtros le ayudan a revisar movimientos con mayor rapidez.
- **SC-122**: El 100% de las pantallas del módulo usa la paleta de colores definida.
- **SC-123**: El 100% de los mensajes de éxito, error, advertencia e información usa colores consistentes.
- **SC-124**: El 100% de las secciones del menú muestra un ícono junto a su texto.
- **SC-125**: El 100% de los encabezados de sección muestra el ícono correspondiente.
- **SC-126**: El 100% de las tablas aplicables permite ordenar por columnas en ambos sentidos.
- **SC-127**: El 100% de las ordenaciones por fecha, monto y estado produce el orden esperado.
- **SC-128**: El 100% de las acciones de ordenar conserva los datos originales.
- **SC-129**: El 100% de los guardados válidos muestra un mensaje de confirmación de éxito.
- **SC-130**: El 100% de las eliminaciones permitidas solicita confirmación antes de realizarse.
- **SC-131**: El 100% de las cancelaciones de eliminación conserva el registro sin cambios.
- **SC-132**: El 100% de las secciones permitidas sigue accesible desde el menú en celular.
- **SC-133**: El 100% de los roles ve el mismo conjunto de secciones en menú amplio y menú de celular, según sus permisos.
- **SC-134**: El 95% de los usuarios encuentra una sección o dato ordenado en menos de 10 segundos.
- **SC-135**: Al menos el 90% de los usuarios encuestados percibe la interfaz como profesional y coherente.
- **SC-136**: El 100% de los RUT introducidos sin puntos ni guion se presenta con formato chileno antes de confirmar el acceso, sin perder ni duplicar caracteres.
- **SC-137**: El 100% de los RUT de prueba autentica correctamente cuando el dígito verificador se escribe en mayúscula o minúscula.
- **SC-138**: El 100% de los RUT con dígito verificador inválido muestra el mensaje "El RUT ingresado no es válido" y no otorga acceso.
- **SC-139**: El 100% de los intentos con un RUT válido no registrado o una contraseña incorrecta muestra el mensaje "RUT o contraseña incorrectos" y no abre ningún panel.
- **SC-140**: El 100% de las selecciones del botón "Menú" cambia el estado del menú lateral en menos de 1 segundo.
- **SC-141**: El 100% de los roles ve exactamente las mismas secciones al abrir el menú desde el botón del encabezado que las definidas en su matriz de acceso.
- **SC-142**: El 100% de los cierres del menú conserva la pantalla activa, la sesión y los datos del módulo sin cambios.
- **SC-143**: Al menos el 95% de los usuarios identifica cómo abrir y cerrar el menú lateral sin ayuda en menos de 5 segundos.
- **SC-144**: El 100% de las revisiones de la pantalla de acceso confirma que el formulario está centrado y es angosto en pantallas amplias.
- **SC-145**: El 100% de los usuarios de prueba localiza el botón "Ingresar" sin desplazamiento adicional en menos de 5 segundos.
- **SC-146**: El 100% de las pantallas posteriores al acceso muestra el menú lateral alineado al borde izquierdo.
- **SC-147**: El 100% de las sesiones válidas muestra en el encabezado el nombre del usuario, su rol y "Cerrar sesión" de forma agrupada.
- **SC-148**: El 100% de los importes visibles usa el formato chileno con "$", puntos de miles y sin decimales.
- **SC-149**: El 100% de los cálculos financieros conserva idénticos resultados después del cambio de formato de los importes.
- **SC-150**: El 100% de las pantallas con registros muestra el listado antes que cualquier formulario de creación.
- **SC-151**: El 100% de los formularios abiertos desde "Nuevo" aparece en una ventana sin reemplazar el listado de fondo.
- **SC-152**: El 100% de los cierres de ventana sin guardar conserva el listado, los filtros y los datos sin cambios.
- **SC-153**: Se detectan 0 superposiciones entre la "×" de los filtros y la flecha del selector en las revisiones de pantalla.
- **SC-154**: El 100% de las filas de totales del Libro Mayor está alineada con sus columnas correspondientes.
- **SC-155**: El 100% de los listados vacíos muestra un mensaje claro en español dentro del área del listado.
- **SC-156**: Al menos el 95% de los usuarios encuestados encuentra una acción principal sin ayuda en menos de 10 segundos después de los cambios.
- **SC-157**: Se detectan 0 cambios funcionales en reglas, permisos, datos y operaciones respecto al comportamiento vigente.
- **SC-158**: El 100% de los roles conserva el mismo conjunto de pantallas y acciones permitidas que antes de la mejora.
- **SC-159**: El 100% de los encabezados monetarios de tablas y reportes financieros indica la unidad CLP.
- **SC-160**: El 100% de los totales monetarios abre un desglose cuya suma coincide con el importe total mostrado.
- **SC-161**: Se detectan 0 cambios en importes, reglas contables, permisos o igualdad financiera al usar el desglose o el orden por tipo.
- **SC-162**: El 100% de las referencias visibles y persistidas a la moneda usa CLP.
- **SC-163**: El 100% de las cuentas de IVA en datos de ejemplo usa "IVA Débito Fiscal" o "IVA Crédito Fiscal".
- **SC-164**: Se detectan 0 cambios en cálculos, permisos e igualdad contable tras el cambio de moneda y terminología.

## Suposiciones

- El módulo de Contabilidad y Finanzas se desarrolla como una extensión del sistema ERP base proporcionado.
- Las estructuras Entity y Document del módulo base se reutilizan para mantener la relación con clientes, proveedores y documentos asociados a las operaciones financieras.
- El módulo se enfoca en funcionalidades básicas de contabilidad y finanzas, sin implementar procesos avanzados de auditoría, tributación o conciliación bancaria; el registro de auditoría de la Historia de Usuario 16 se limita a trazabilidad básica de creación, edición y anulación.
- Los asientos contables deben cumplir el principio de partida doble, por lo que la suma de débitos debe ser igual a la suma de créditos.
- Cada asiento contable debe contener al menos dos líneas contables.
- Los asientos contables siguen el ciclo de vida borrador → aprobado → cancelado; solo los borradores admiten edición y borrado físico.
- Las cuentas contables se organizan mediante una estructura jerárquica que permite establecer relaciones entre cuentas principales y subcuentas.
- Los periodos contables poseen una fecha de inicio, una fecha de término y un estado que indica si están abiertos o cerrados.
- No se permite que dos periodos contables tengan fechas superpuestas, sin importar su estado.
- No se permite registrar nuevos asientos contables en periodos que se encuentren cerrados.
- Los pagos y cobros forman parte del MVP y deben permitir registro, listado y consulta de detalle.
- Los pagos y cobros pueden asociarse a entidades y, opcionalmente, a documentos existentes.
- Los reportes financieros se generan utilizando los movimientos contables registrados en el módulo.
- La implementación inicial corresponde a una solución frontend, por lo que se utilizarán datos de ejemplo para representar las operaciones.
- No se contempla una conexión real a una base de datos ni la integración con sistemas bancarios externos durante esta etapa del proyecto.
- La información utilizada en el prototipo tiene fines demostrativos y no corresponde a registros financieros reales.
- Todas las operaciones del módulo se registran en una sola moneda (CLP); no se contemplan conversiones de moneda.
- La autenticación se simula dentro de la experiencia de demostración del módulo; no se contempla un servicio de identidad externo.
- Los cuatro usuarios de prueba son ficticios, deterministas y se restauran al estado inicial al comenzar una demostración.
- El RUT se acepta con formato chileno de 7 u 8 dígitos y dígito verificador numérico o K; se admite K en mayúscula o minúscula, se formatea automáticamente mientras se escribe y se valida su dígito verificador antes de intentar el acceso.
- Los cuatro RUT de prueba cumplen la validación del dígito verificador y el del Auditor termina en K para permitir probar la aceptación de mayúscula y minúscula.
- Las contraseñas de prueba distinguen mayúsculas y minúsculas y son de uso exclusivo para demostración.
- Los paneles de inicio son vistas de acceso y resumen; las reglas de permisos se detallan en la Historia de Usuario 9.
- La Historia de Usuario 9 define el menú y los permisos vigentes y prevalece sobre menciones genéricas de roles en historias anteriores; una acción descrita para un rol solo se considera habilitada si su menú la incluye.
- El Contador puede consultar reportes financieros como apoyo a la elaboración de informes contables, aunque no puede registrar pagos o cobros ni cambiar el estado de los periodos.
- El Tesorero puede consultar el detalle de pagos y cobros y seleccionar entidades o documentos existentes, pero no administrar cuentas, asientos ni periodos.
- El Auditor tiene acceso de solo lectura a reportes; no puede crear, editar, eliminar ni cambiar estados en ninguna sección.
- Para registrar un asiento, el Contador puede seleccionar un periodo abierto sin acceder a la opción de gestionar periodos.
- Un cambio de rol requiere cerrar sesión y autenticarse nuevamente; no se contempla la reevaluación de permisos durante una sesión abierta.
- El mensaje de error ante credenciales inválidas es deliberadamente genérico para no revelar si un RUT está registrado; el mensaje específico de RUT no válido se reserva para fallas del dígito verificador.
- El formateo automático no cambia la identidad del RUT: un mismo RUT con o sin puntos, guion y con k minúscula se considera equivalente para autenticar.
- Un RUT con dígito verificador inválido se bloquea con un mensaje específico antes de evaluar la contraseña; un RUT válido pero no registrado usa el mensaje genérico de credenciales incorrectas.
- El botón "Menú" se ofrece únicamente cuando existe una sesión válida; antes del inicio de sesión no hay menú lateral que abrir.
- El menú lateral puede estar abierto o cerrado; el botón "Menú" invierte el estado visible cada vez que se selecciona.
- Los botones de carga y restablecimiento se muestran en el panel del Administrador financiero, único rol con permiso para modificar el estado general del módulo según la Historia de Usuario 9; los demás roles no los ven.
- "Cargar datos de ejemplo" reemplaza cualquier conjunto previo por la semilla, mientras que "Restablecer datos" limpia los registros financieros y devuelve el módulo al estado inicial sin eliminar usuarios de prueba.
- Los periodos de la semilla son consecutivos, no se superponen y al menos uno permanece abierto para permitir registrar nuevos asientos.
- La semilla utiliza CLP y respeta todas las reglas contables definidas, incluida la partida doble y el estado válido de los periodos.
- Ambas acciones requieren confirmación porque afectan a todo el contenido de demostración de la sesión.
- Los datos de la semilla son ficticios y no representan operaciones financieras reales.
- Entidades, Documentos y Búsqueda se eliminan de la navegación visible; las estructuras Entity y Document siguen existiendo para mantener las relaciones financieras.
- La selección de entidades y documentos dentro de pagos y cobros se mantiene como apoyo contextual, sin convertirse en una sección navegable.
- Los filtros dentro de listados y reportes no se consideran una pantalla global de Búsqueda.
- Los botones de cargar datos, restablecer datos y cerrar sesión son acciones, no accesos a pantallas, por lo que no cuentan como navegación duplicada.
- La regla de un solo control por pantalla aplica a menú y panel; cuando exista un acceso directo en el panel a una sección ya presente en el menú, se elimina el duplicado.
- La matriz de permisos de la Historia de Usuario 9 se actualiza con Entidades, Documentos y Búsqueda como "No disponible" para todos los roles.
- El resumen de estados se muestra dentro de la pantalla existente "Pagos y cobros", sin crear una nueva sección de menú ni una pantalla adicional.
- Solo el Administrador financiero y el Tesorero ven el resumen y el filtro, porque son los roles con acceso a pagos según la Historia de Usuario 9.
- Todo pago o cobro registra una fecha de vencimiento; un registro pendiente cuya fecha ya pasó se considera vencido automáticamente.
- El estado pagado se obtiene de la confirmación del movimiento y no elimina el registro del listado ni del resumen.
- "Todos" es la selección inicial del filtro y representa la ausencia de filtro, no un estado adicional.
- Los importes del resumen se expresan en CLP y utilizan las utilidades de formato compartidas del módulo.
- El menú lateral es la navegación principal del módulo después del inicio de sesión; por eso solo se muestra cuando existe una sesión válida.
- Las secciones visibles del menú lateral se derivan de la matriz de acceso por rol y excluyen Entidades, Documentos y Búsqueda para todos los roles.
- Los reportes financieros se incorporan dentro de la sección existente "Reportes financieros", sin crear una nueva opción de menú ni una pantalla duplicada.
- El Contador es el actor principal que solicita los reportes financieros; el Administrador financiero y el Auditor pueden consultarlos porque ya tienen acceso a "Reportes financieros", pero sin acciones de modificación.
- Solo los asientos contables aprobados se consideran válidos para generar reportes; los asientos en borrador o cancelado se excluyen.
- Los periodos cerrados pueden consultarse con fines históricos y su estado no cambia al generar reportes.
- El tipo de cuenta contable permite clasificar cada cuenta como activo, pasivo, patrimonio, ingreso o gasto para los reportes que lo requieren.
- El saldo inicial de una cuenta se obtiene de los movimientos aprobados de periodos anteriores al periodo consultado; si no existen, el saldo inicial es cero.
- El Balance de Comprobación incluye cuentas con saldo distinto de cero al cierre del periodo.
- El Estado de Resultados incluye cuentas de ingreso y gasto con movimientos aprobados en el periodo.
- El Balance General incluye cuentas de activo, pasivo y patrimonio con saldo distinto de cero al cierre del periodo.
- El resultado acumulado se presenta dentro del patrimonio del Balance General para conservar la igualdad contable.
- Los reportes financieros son de solo consulta y no permiten crear, editar, eliminar ni cambiar estados de movimientos contables.
- Si existen datos inconsistentes que impiden validar una igualdad contable, el sistema muestra una advertencia clara en español en lugar de presentar el reporte como válido.
- El Administrador financiero es el único rol autorizado para cerrar periodos, conforme a la matriz de permisos vigente.
- "Pagos" incluye tanto pagos como cobros, de acuerdo con la terminología de la sección "Pagos y cobros" del módulo.
- Se considera modificación cualquier cambio sobre un registro, incluida su edición, eliminación, cambio de estado y cambio de fecha.
- La pertenencia de un asiento o pago a un periodo se determina por su fecha contable o fecha del movimiento.
- El cierre es una acción administrativa con confirmación y, dentro de esta historia, no se contempla la reapertura del periodo.
- El cierre no altera los registros existentes; solo cambia el estado del periodo y activa el bloqueo de operaciones posteriores.
- El bloqueo se aplica a todos los roles, incluido el Administrador financiero, para garantizar la integridad de la información cerrada.
- Los reportes financieros y las consultas de periodos cerrados permanecen disponibles para los roles autorizados.
- La semilla de datos de ejemplo respeta los periodos cerrados y no crea movimientos dentro de ellos.
- El restablecimiento de datos sigue siendo una acción administrativa independiente y devuelve el módulo a su estado inicial según las reglas ya definidas.
- Los mensajes de bloqueo y de acceso no disponible se muestran en español y en un lenguaje comprensible para usuarios no técnicos.
- El registro de auditoría es una consulta de solo lectura para el Auditor y se ofrece dentro de "Reportes financieros" y desde el detalle de cada movimiento, sin crear una nueva opción de menú.
- Solo el Auditor puede consultar el registro de auditoría; los demás roles no ven esta información.
- Los eventos de auditoría se generan automáticamente, no pueden crearse, editarse ni eliminarse manualmente y permanecen sin cambios cuando se edita el movimiento relacionado.
- La anulación de un asiento equivale a su estado cancelado, mientras que la anulación de un pago o cobro conserva el registro y lo excluye de totales vigentes y del resumen por estado.
- La identificación del usuario responsable usa los usuarios ficticios de demostración, incluyendo nombre, rol y RUT de prueba.
- Los eventos se generan solo para acciones que produjeron cambios reales; los intentos fallidos o rechazados no generan eventos.
- Los datos de ejemplo incluyen eventos deterministas de creación, edición y anulación, y el restablecimiento devuelve el historial a su estado inicial sin eventos huérfanos.
- Los filtros de auditoría son locales a la consulta y no sustituyen ni reactivan una pantalla global de búsqueda.
- Cuando un movimiento no tenga eventos disponibles, se muestra un mensaje claro en español en lugar de información incompleta o eventos inventados.
- Las alertas de pagos de la Historia de Usuario 17 se muestran únicamente en el panel del Tesorero.
- Las alertas son informativas, no crean una nueva opción de menú ni un acceso directo duplicado a "Pagos y cobros".
- Un pago vencido es un pago pendiente cuya fecha de vencimiento es anterior a la fecha de referencia del panel.
- Un pago que vence esta semana es un pago pendiente cuya fecha de vencimiento cae entre la fecha de referencia y el domingo de la semana actual, inclusive.
- La semana se entiende de lunes a domingo.
- Las categorías de alerta son mutuamente excluyentes para evitar duplicar un mismo pago en ambas alertas.
- Los pagos pagados y anulados se excluyen de ambas alertas.
- Con la misma fecha de referencia, las alertas basadas en datos de ejemplo deben ser deterministas.
- El detalle de cada alerta muestra una cantidad limitada de pagos e indica cuándo existen más, sin sustituir a la sección "Pagos y cobros".
- La identidad corporativa se muestra en el encabezado principal del módulo una vez que existe una sesión válida.
- La pantalla de inicio de sesión no forma parte del alcance de la Historia de Usuario 18.
- El nombre de la empresa es exactamente "Comercial Los Andes SpA" en todas las pantallas.
- El logotipo es ficticio, propio del prototipo y no representa una marca real.
- No se solicita configurar ni cambiar el nombre o el logotipo desde la interfaz.
- El encabezado es un elemento de identidad, no una opción de menú ni una acción.
- El nombre de la empresa no reemplaza el título de cada pantalla.
- La identidad corporativa no altera datos financieros, filtros ni el estado de la sesión.
- Cuando el logotipo no esté disponible, se mantiene el nombre y se muestra una referencia visual clara en su lugar.
- Los reportes financieros cubiertos por la Historia de Usuario 19 son Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General.
- El Contador es el actor principal de la exportación de reportes.
- El Administrador financiero y el Auditor, que ya pueden consultar reportes financieros, también pueden exportarlos porque la exportación no modifica información.
- Los roles sin acceso a un reporte no ven los botones de exportación de ese reporte.
- El nombre de la empresa en los archivos exportados es exactamente "Comercial Los Andes SpA".
- La fecha requerida en el archivo incluye tanto el periodo seleccionado como la fecha de generación de la exportación.
- Los totales exportados son los aplicables a cada tipo de reporte y deben coincidir con los mostrados en pantalla.
- Solo se exportan movimientos aprobados y coherentes con las reglas ya definidas para los reportes financieros.
- Un reporte válido sin movimientos puede exportarse con totales en cero y una indicación de ausencia de movimientos.
- Un reporte con datos inconsistentes no puede exportarse hasta que la advertencia sea atendida.
- La exportación es una acción de solo lectura: no cambia datos financieros, filtros, periodos ni eventos de auditoría.
- Los usuarios con acceso a asientos pueden usar los filtros en el listado de asientos.
- Los usuarios con acceso a pagos y cobros pueden usar los filtros en ese listado.
- Los roles sin acceso a un listado no ven sus filtros.
- El filtro de fecha de asientos se aplica a la fecha contable.
- El filtro de fecha de pagos y cobros se aplica a la fecha del movimiento, no a la fecha de vencimiento.
- El filtro de cuenta en asientos busca coincidencias en las líneas del asiento.
- El filtro de cuenta en pagos y cobros busca coincidencias a través del asiento relacionado.
- Los pagos sin asiento relacionado no coinciden cuando se filtra por una cuenta específica.
- El filtro de monto se expresa como un rango en CLP con límites inclusivos.
- Los estados disponibles son borrador, aprobado y cancelado para asientos, y pendiente, pagado, vencido y anulado para pagos y cobros.
- "Todos" es la selección inicial del filtro de estado y significa ausencia de filtro.
- Los filtros son locales a cada listado y no constituyen una pantalla global de búsqueda.
- El filtro de estado de pagos y cobros sustituye al control de estado existente para evitar duplicidad.
- Aplicar o limpiar filtros no modifica registros financieros ni el estado del módulo.
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
- El alcance de las Historias de Usuario 22 a 29 se limita a la presentación y disposición visual; no se agregan, eliminan ni modifican funciones, datos, permisos ni reglas de negocio.
- "Ventana" significa una ventana dentro del módulo que se abre y cierra sobre el listado, sin reemplazar la pantalla ni abrir una pestaña separada del navegador.
- El formulario de acceso conserva los campos, las validaciones y las credenciales definidos en la Historia de Usuario 8 de la especificación base.
- El menú lateral conserva las secciones, etiquetas y permisos definidos en la matriz de acceso vigente.
- El encabezado muestra el nombre y el rol del usuario autenticado tal como aparecen en los usuarios de prueba de la especificación base.
- El formato chileno aplica a los importes en CLP usados por el módulo: símbolo "$" antes del valor, puntos de separación de miles y ausencia de decimales.
- No se introducen montos negativos nuevos ni cambios en el criterio de redondeo; se respeta la lógica financiera existente.
- En pantallas estrechas, el menú lateral continúa adaptándose según las reglas vigentes y permanece alineado al borde izquierdo cuando está abierto.
- Los mensajes de lista vacía son informativos y no sustituyen mensajes de error ni estados de carga.
- La fila de totales del Libro Mayor conserva los importes y la igualdad contable definida; solo cambia su alineación visual.
- Las mejoras de usabilidad no crean nuevas opciones de menú ni accesos duplicados a pantallas existentes.

---

