# Especificación de la Funcionalidad: Módulo Contabilidad y Finanzas de Software de Planificación de Recursos Empresariales (ERP)

**Rama de la funcionalidad**: 002-contabilidad-finanzas  
**Creada**: 2026-10-29 
**Estado**: Borrador  
**Entrada**: Descripción del usuario: "Desarrollar un módulo de Contabilidad y Finanzas para un sistema ERP, que permita gestionar cuentas contables, registrar asientos contables, administrar pagos y cobros, gestionar periodos contables y consultar reportes financieros."

## Propósito

El objetivo de este módulo es incorporar funcionalidades de contabilidad y finanzas a un sistema ERP, permitiendo organizar y consultar las operaciones económicas de una empresa.

El módulo permitirá gestionar un plan de cuentas contables, registrar asientos contables mediante el principio de partida doble, administrar pagos y cobros, controlar periodos contables y generar reportes de movimientos financieros.

Además, el módulo utilizará las estructuras existentes del ERP base, como Entidades y Documentos, para mantener la relación entre la información financiera y los registros generales de la empresa.

La implementación inicial se enfocará en una interfaz frontend funcional que permita representar y probar las principales operaciones mediante datos de ejemplo, sin requerir una conexión real a una base de datos.

## Escenarios de Usuario y Pruebas *(obligatorio)*

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
- ¿Qué ocurre cuando se intenta crear un periodo contable que se superpone con otro periodo existente?
- ¿Qué ocurre cuando un usuario intenta registrar un pago sin indicar su monto, fecha o entidad relacionada?
- ¿Qué ocurre cuando se intenta asociar un pago a un documento que no existe?
- ¿Qué ocurre cuando un usuario consulta un reporte financiero para un periodo sin movimientos registrados?
- ¿Qué ocurre cuando existen movimientos contables, pero los totales de débitos y créditos no coinciden?
- ¿Qué ocurre cuando el usuario cambia el periodo seleccionado mientras está consultando un reporte?
- ¿Qué ocurre cuando no existen cuentas contables, periodos o movimientos registrados al ingresar por primera vez al módulo?
- ¿Se mantienen los registros contables al navegar entre las distintas secciones del módulo?
- ¿Qué ocurre cuando el usuario intenta modificar o eliminar un registro que está relacionado con otros movimientos contables?

## Requisitos *(obligatorio)*

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
- **FR-010: El sistema DEBE exigir al menos dos líneas contables para registrar un asiento.
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

### Requisitos de Extensibilidad *(obligaciones del módulo base)*

El módulo de Contabilidad y Finanzas DEBE:
- **XR-001**: Reutilizar las estructuras base Entity y Document del sistema ERP para relacionar las operaciones financieras con los registros generales de la empresa.
- **XR-002**: Mantener las entidades específicas del módulo separadas de las estructuras centrales del ERP base.
- **XR-003**: Permitir relacionar los pagos y cobros con entidades y documentos existentes.
- **XR-004**: Mantener relaciones consistentes entre cuentas contables, asientos contables, líneas de asiento y periodos contables.
- **XR-005**: Permitir incorporar futuras funcionalidades financieras sin modificar innecesariamente la estructura central del ERP.
- **XR-006**: Mantener la compatibilidad con la estructura de datos definida por el módulo base.

### Entidades Clave *(incluir si la funcionalidad implica datos)*


- **CuentaContable**: Representa una cuenta del plan contable de la empresa. Permite clasificar las operaciones financieras según su naturaleza y mantener una estructura jerárquica mediante cuentas principales y subcuentas.
- **AsientoContable**: Representa el registro de una operación económica de la empresa. Contiene información como fecha, concepto, periodo contable, débitos y créditos.
- **LineaAsiento**: Representa cada movimiento individual que forma parte de un asiento contable. Se relaciona con una cuenta contable y registra un monto correspondiente al debe o al haber.
- **Pago**: Representa un movimiento de dinero correspondiente a un pago o cobro realizado por la empresa. Puede relacionarse con una entidad, un documento y un asiento contable.
- **PeriodoContable**: Representa un intervalo de tiempo utilizado para organizar las operaciones contables. Posee una fecha de inicio, una fecha de término y un estado que indica si está abierto o cerrado.
- **Entity (Entidad)**: Estructura heredada del módulo base ERP que representa clientes, proveedores u otras entidades relacionadas con las operaciones financieras.
- **Document (Documento)**: Estructura heredada del módulo base ERP que permite relacionar documentos comerciales o transaccionales con las operaciones del módulo financiero.

## Criterios de Éxito *(obligatorio)*

### Resultados Medibles

- **SC-001**:SC-001: Los usuarios pueden crear y consultar cuentas contables desde la interfaz del módulo.
- **SC-002**: Los usuarios pueden registrar un asiento contable cuando la suma de débitos coincide con la suma de créditos.
- **SC-003**: El sistema identifica y rechaza los asientos contables que no cumplen el principio de partida doble.
- **SC-004**: Los usuarios pueden registrar y consultar pagos y cobros asociados a entidades existentes.
- **SC-005**: Los usuarios pueden crear y consultar periodos contables, identificando claramente cuáles están abiertos y cuáles cerrados.
- **SC-006**: El sistema impide registrar nuevos asientos contables en periodos cerrados.
- **SC-007**: Los usuarios pueden consultar reportes con los movimientos contables correspondientes al periodo seleccionado.
- **SC-008**: Los reportes muestran correctamente los totales de débitos y créditos de los movimientos consultados.
- **SC-009**: Las principales funcionalidades del módulo pueden probarse mediante la interfaz frontend y datos de ejemplo, sin requerir una conexión real a una base de datos.
- **SC-010**: La navegación entre las distintas secciones permite consultar las funcionalidades del módulo sin perder los datos de ejemplo durante su uso.

## Suposiciones

- El módulo de Contabilidad y Finanzas se desarrolla como una extensión del sistema ERP base proporcionado.
- Las estructuras Entity y Document del módulo base se reutilizan para mantener la relación con clientes, proveedores y documentos asociados a las operaciones financieras.
- El módulo se enfoca en funcionalidades básicas de contabilidad y finanzas, sin implementar procesos avanzados de auditoría, tributación o conciliación bancaria.
- Los asientos contables deben cumplir el principio de partida doble, por lo que la suma de débitos debe ser igual a la suma de créditos.
- Cada asiento contable debe contener al menos dos líneas contables.
- Las cuentas contables se organizan mediante una estructura jerárquica que permite establecer relaciones entre cuentas principales y subcuentas.
- Los periodos contables poseen una fecha de inicio, una fecha de término y un estado que indica si están abiertos o cerrados.
- No se permite registrar nuevos asientos contables en periodos que se encuentren cerrados.
- Los pagos y cobros pueden asociarse a entidades y, opcionalmente, a documentos existentes.
- Los reportes financieros se generan utilizando los movimientos contables registrados en el módulo.
- La implementación inicial corresponde a una solución frontend, por lo que se utilizarán datos de ejemplo para representar las operaciones.
- No se contempla una conexión real a una base de datos ni la integración con sistemas bancarios externos durante esta etapa del proyecto.
- La información utilizada en el prototipo tiene fines demostrativos y no corresponde a registros financieros reales.

