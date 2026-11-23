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
- Q: ¿El módulo manejará una sola moneda o registrará operaciones en varias monedas? → A: Una sola moneda (MXN) para todo el módulo, sin conversión.

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
5. **Dado** que el usuario consulta una gráfica, **cuando** revisa las etiquetas o herramientas de cada punto, **entonces** los importes se muestran en MXN con el mismo formato que el resto del módulo.

---

### Historia de Usuario 8 - Iniciar sesión con RUT y contraseña (Prioridad: P1)

Como administrador financiero, contador, tesorero o auditor, quiero acceder al módulo identificándome con mi RUT y mi contraseña, para ingresar a un panel de inicio acorde a mi responsabilidad y evitar que otras personas utilicen mi acceso.

**Por qué esta prioridad**: El acceso identificado permite que cada usuario del área financiera vea el punto de partida relevante para su rol y establece la base para cualquier operación posterior dentro del módulo.

**Prueba Independiente**: Un usuario de prueba de cada rol puede iniciar sesión con su RUT y contraseña, verificar que el panel mostrado corresponde a su rol, cerrar sesión y comprobar que se solicitan nuevamente las credenciales.

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

**Usuarios de prueba ficticios**:

| Rol | RUT | Contraseña | Panel de inicio esperado |
|-----|-----|------------|--------------------------|
| Administrador financiero | 11.111.111-1 | Admin2026! | Resumen integral, periodos y asuntos prioritarios |
| Contador | 22.222.222-2 | Contador2026! | Cuentas, asientos y reportes contables |
| Tesorero | 33.333.333-3 | Tesorero2026! | Pagos, cobros y flujo de efectivo |
| Auditor | 44.444.444-4 | Auditor2026! | Trazabilidad, reportes e historial |

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
7. **Dado** que el Tesorero consulta un pago, **cuando** revisa sus relaciones, **entonces** puede ver la entidad o el documento asociado sin acceder a la gestión de esas estructuras.
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

1. **Dado** que un usuario con acceso a pagos abre la pantalla "Pagos y cobros", **cuando** se carga la información, **entonces** ve un resumen con la cantidad y el total en MXN de los estados pendiente, pagado y vencido.
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
- **FR-015**: El sistema DEBE permitir asociar opcionalmente un pago o cobro con un documento correspondiente.
- **FR-016**: El sistema DEBE solicitar la fecha, monto y tipo de operación para registrar un pago o cobro.
- **FR-017**: El sistema DEBE permitir crear y consultar periodos contables indicando su nombre, fecha de inicio y fecha de término.
- **FR-018**: El sistema DEBE validar que la fecha de término de un periodo contable sea posterior a su fecha de inicio.
- **FR-019**: El sistema DEBE permitir cambiar el estado de un periodo contable entre abierto y cerrado.
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
- **FR-034**: El sistema DEBE operar con una sola moneda (MXN) y NO DEBE realizar conversiones de moneda durante el MVP.
- **FR-035**: El sistema DEBE mostrar en el panel principal una gráfica de barras con los ingresos y gastos de cada periodo contable.
- **FR-036**: El sistema DEBE mostrar en el panel principal una gráfica de línea con la evolución del resultado financiero por periodo contable.
- **FR-037**: El sistema DEBE mostrar en el panel principal una gráfica de distribución de los gastos por cuenta del periodo seleccionado.
- **FR-038**: El sistema DEBE actualizar las gráficas cuando el usuario seleccione un periodo contable diferente y mostrar mensajes de estado vacío cuando no existan datos.
- **FR-039**: Los importes presentados en las gráficas DEBEN formatearse en MXN mediante las utilidades compartidas del módulo.
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
- **FR-052**: El sistema DEBE aceptar el RUT de prueba con el formato puntuado mostrado en la tabla de usuarios y también sin puntos ni guion.
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
- **FR-063**: El Tesorero DEBE poder consultar la entidad o el documento asociado a un pago o cobro sin acceder a la gestión de esas estructuras.
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
- **FR-088**: La pantalla "Pagos y cobros" DEBE mostrar un resumen con la cantidad y el total en MXN de los estados pendiente, pagado y vencido.
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
- **FR-099**: Los importes del resumen DEBEN mostrarse en MXN con el mismo formato utilizado en el resto del módulo.
- **FR-100**: Cuando no existan pagos o cobros, el resumen DEBE mostrar cero en cada estado y un mensaje de estado vacío.
- **FR-101**: Cuando un filtro no produzca resultados, el sistema DEBE mostrar un mensaje que indique que no hay pagos con ese estado.

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
- **Pago**: Representa un movimiento de dinero correspondiente a un pago o cobro realizado por la empresa. Puede relacionarse con una entidad, un documento y un asiento contable. Posee una fecha de vencimiento y un estado pendiente, pagado o vencido.
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
- **EstadoPago**: Clasificación de un pago o cobro como pendiente, pagado o vencido, según su confirmación y su fecha de vencimiento.
- **ResumenPagos**: Agrupación de pagos y cobros por estado que presenta la cantidad de registros y el total en MXN de cada grupo.

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

## Suposiciones

- El módulo de Contabilidad y Finanzas se desarrolla como una extensión del sistema ERP base proporcionado.
- Las estructuras Entity y Document del módulo base se reutilizan para mantener la relación con clientes, proveedores y documentos asociados a las operaciones financieras.
- El módulo se enfoca en funcionalidades básicas de contabilidad y finanzas, sin implementar procesos avanzados de auditoría, tributación o conciliación bancaria.
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
- Todas las operaciones del módulo se registran en una sola moneda (MXN); no se contemplan conversiones de moneda.
- La autenticación se simula dentro de la experiencia de demostración del módulo; no se contempla un servicio de identidad externo.
- Los cuatro usuarios de prueba son ficticios, deterministas y se restauran al estado inicial al comenzar una demostración.
- El RUT se acepta con formato chileno de 7 u 8 dígitos y dígito verificador numérico o K, con o sin puntos y guion; no se valida su autenticidad fuera del listado de usuarios de prueba.
- Las contraseñas de prueba distinguen mayúsculas y minúsculas y son de uso exclusivo para demostración.
- Los paneles de inicio son vistas de acceso y resumen; las reglas de permisos se detallan en la Historia de Usuario 9.
- La Historia de Usuario 9 define el menú y los permisos vigentes y prevalece sobre menciones genéricas de roles en historias anteriores; una acción descrita para un rol solo se considera habilitada si su menú la incluye.
- El Contador puede consultar reportes financieros como apoyo a la elaboración de informes contables, aunque no puede registrar pagos o cobros ni cambiar el estado de los periodos.
- El Tesorero puede consultar el detalle de pagos y cobros y seleccionar entidades o documentos existentes, pero no administrar cuentas, asientos ni periodos.
- El Auditor tiene acceso de solo lectura a reportes; no puede crear, editar, eliminar ni cambiar estados en ninguna sección.
- Para registrar un asiento, el Contador puede seleccionar un periodo abierto sin acceder a la opción de gestionar periodos.
- Un cambio de rol requiere cerrar sesión y autenticarse nuevamente; no se contempla la reevaluación de permisos durante una sesión abierta.
- El mensaje de error ante credenciales inválidas es deliberadamente genérico para no revelar si un RUT está registrado.
- Los botones de carga y restablecimiento se muestran en el panel del Administrador financiero, único rol con permiso para modificar el estado general del módulo según la Historia de Usuario 9; los demás roles no los ven.
- "Cargar datos de ejemplo" reemplaza cualquier conjunto previo por la semilla, mientras que "Restablecer datos" limpia los registros financieros y devuelve el módulo al estado inicial sin eliminar usuarios de prueba.
- Los periodos de la semilla son consecutivos, no se superponen y al menos uno permanece abierto para permitir registrar nuevos asientos.
- La semilla utiliza MXN y respeta todas las reglas contables definidas, incluida la partida doble y el estado válido de los periodos.
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
- Los importes del resumen se expresan en MXN y utilizan las utilidades de formato compartidas del módulo.

---

