# Especificación de la Funcionalidad: Registrar y consultar pagos

**Rama de la funcionalidad**: `002-contabilidad-finanzas-pagos`  
**Creada**: 2026-10-29  
**Estado**: Borrador  
**Entrada**: Descripción del usuario: "Como tesorero y encargado de pagos del área de Contabilidad y Finanzas, necesito registrar y consultar los pagos de la organización."

## Propósito

Esta funcionalidad permite al tesorero o encargado de pagos registrar cobros y desembolsos contra un tercero y consultarlos posteriormente desde el módulo de Contabilidad y Finanzas. El registro conserva los datos del pago, su número oficial por serie y folio, su importe exacto con dos decimales, su estado y sus vínculos opcionales con un documento y un asiento contable.

Esta especificación desarrolla la fase futura de **Pagos** descrita en `specs/002-contabilidad-finanzas/data-model.md`; no modifica el alcance MVP ni el modelo base del ERP.

## Escenarios de Usuario y Pruebas *(obligatorio)*

### Historia de Usuario 1 - Registrar un pago (Prioridad: P1)

Como tesorero o encargado de pagos, quiero registrar un cobro o desembolso con su fecha, tercero, serie y folio, importe, medio de pago y referencias opcionales, para dejar constancia financiera del movimiento y poder consultarlo después.

**Por qué esta prioridad**: El registro es el valor central de la funcionalidad; sin pagos registrados no hay nada que consultar ni conciliar.

**Prueba Independiente**: Un tesorero puede abrir el área de Pagos, completar los datos obligatorios, guardar el pago y verlo aparecer en la lista con su número y estado.

**Escenarios de Aceptación**:

1. **Dado** que el tesorero está en el área de Contabilidad y Finanzas, en la sección Pagos, **cuando** registra un pago con fecha de calendario válida, tercero existente, folio entero positivo, importe mayor que cero, moneda y medio de pago, **entonces** el pago se guarda en estado `pendiente` y aparece en la lista.
2. **Dado** que el tesorero está registrando un pago, **cuando** deja vacíos la fecha, el tercero, el folio o el importe, **entonces** el sistema impide guardar y explica qué información falta.
3. **Dado** que el tesorero introduce un importe igual o menor que cero, o con más de dos decimales, **cuando** intenta guardar, **entonces** el sistema rechaza el registro con un mensaje claro.
4. **Dado** que el tesorero indica una combinación de serie y folio ya utilizada por otro pago, **cuando** intenta guardar, **entonces** el sistema rechaza el registro por duplicidad.
5. **Dado** que el tesorero selecciona un documento o un asiento contable existente, **cuando** guarda el pago, **entonces** el vínculo se conserva; si el asiento ya está vinculado a otro pago, el sistema rechaza la operación.
6. **Dado** que el tesorero registra un pago sin serie, **cuando** guarda, **entonces** el sistema genera el número oficial usando solo el folio y valida que la combinación no se repita.
7. **Dado** que el tesorero indica un folio que no es un entero positivo, **cuando** intenta guardar, **entonces** el sistema rechaza el registro con un mensaje claro.
8. **Dado** que el tesorero selecciona un medio de pago que no está permitido, **cuando** intenta guardar, **entonces** el sistema rechaza el registro con un mensaje claro.

---

### Historia de Usuario 2 - Consultar y encontrar pagos (Prioridad: P2)

Como tesorero o encargado de pagos, quiero consultar la lista de pagos y filtrarla por fecha, tercero, estado, medio de pago o número, para localizar rápidamente un movimiento y revisar su detalle.

**Por qué esta prioridad**: La consulta convierte el registro en información útil para seguimiento, conciliación y auditoría; depende de que existan pagos registrados.

**Prueba Independiente**: Un tesorero puede abrir la lista de pagos, aplicar filtros, seleccionar un pago y ver todos sus datos, incluidos sus vínculos opcionales y su estado.

**Escenarios de Aceptación**:

1. **Dados** varios pagos registrados, **cuando** el tesorero abre la lista, **entonces** ve para cada pago el número, la fecha, el tercero, el importe, la moneda cuando exista, el medio de pago cuando exista y el estado.
2. **Dados** varios pagos registrados, **cuando** el tesorero filtra por rango de fechas, tercero, estado, medio de pago, número o serie/folio, **entonces** solo se muestran los pagos que cumplen los filtros.
3. **Dada** una búsqueda sin coincidencias, **cuando** el tesorero la envía, **entonces** el sistema muestra un estado vacío claro y permite limpiar los filtros.
4. **Dado** un pago en la lista, **cuando** el tesorero lo selecciona, **entonces** ve su detalle completo, incluidas las notas, el documento y el asiento contable vinculados si existen.
5. **Dado** un pago con estado `aplicado` o `cancelado`, **cuando** el tesorero consulta la lista, **entonces** el pago sigue visible con su estado y no se elimina físicamente.
6. **Dados** al menos 500 pagos almacenados, **cuando** el tesorero consulta o filtra, **entonces** la lista responde en menos de 1 segundo.
7. **Dado** un pago con importe registrado, **cuando** el tesorero lo ve en la lista o en el detalle, **entonces** el importe aparece con dos decimales y, cuando exista, la moneda indicada, sin diferencias por redondeo.
8. **Dado** un pago guardado, **cuando** el tesorero navega a otra área y regresa o recarga la aplicación, **entonces** el pago sigue visible con sus datos.

---

### Casos Límite

- ¿Qué ocurre cuando el importe es cero, negativo o tiene más de dos decimales?
- ¿Qué ocurre cuando falta la fecha, el tercero, el folio o el importe obligatorio?
- ¿Qué ocurre cuando la fecha no es una fecha de calendario válida?
- ¿Qué ocurre cuando el folio no es un entero positivo?
- ¿Qué ocurre cuando la combinación de serie y folio ya existe en otro pago?
- ¿Qué ocurre cuando el medio de pago no pertenece al conjunto permitido?
- ¿Qué ocurre cuando el número oficial generado ya existe?
- ¿Qué ocurre cuando el tercero, el documento o el asiento referenciado no existe?
- ¿Qué ocurre cuando el asiento seleccionado ya está vinculado a otro pago?
- ¿Qué ocurre cuando se registra un pago sin serie?
- ¿Qué ocurre cuando no hay pagos registrados o los filtros no devuelven resultados?
- ¿Qué ocurre con un pago aplicado o cancelado al consultarlo?
- ¿Qué ocurre si la aplicación se recarga después de registrar un pago?

## Requisitos *(obligatorio)*

### Requisitos Funcionales

- **FR-001**: El sistema DEBE permitir al tesorero registrar un pago con fecha, tercero, serie, folio, importe, moneda, medio de pago y notas.
- **FR-002**: El sistema DEBE exigir fecha de calendario válida, tercero existente, folio entero positivo e importe mayor que cero para guardar un pago.
- **FR-003**: El sistema DEBE validar el importe con exactitud de dos decimales, admitiendo como máximo dos decimales en la captura y rechazando cualquier valor con más precisión.
- **FR-004**: El sistema DEBE generar el número oficial del pago con formato `SERIE-FOLIO`; si no se indica serie, el número será el folio.
- **FR-005**: El sistema DEBE validar que el folio sea un entero positivo y que no se repitan ni el número oficial ni la combinación de serie y folio.
- **FR-006**: El sistema DEBE permitir registrar pagos sin serie y validar la unicidad usando solo el folio en ese caso.
- **FR-007**: El sistema DEBE permitir asociar opcionalmente un documento existente al pago.
- **FR-008**: El sistema DEBE permitir asociar opcionalmente un asiento contable existente al pago, de modo que un pago tenga como máximo un asiento y un asiento corresponda como máximo a un pago.
- **FR-009**: El sistema DEBE rechazar un pago cuyo asiento ya esté vinculado a otro pago.
- **FR-010**: El sistema DEBE guardar el pago con estado inicial `pendiente` y mostrar su estado en la lista y en el detalle.
- **FR-011**: El sistema DEBE conservar el pago y reflejarlo en la lista inmediatamente después de guardarlo.
- **FR-012**: El sistema DEBE mostrar en la lista el número, la fecha, el tercero, el importe, la moneda cuando exista, el medio de pago cuando exista y el estado de cada pago.
- **FR-013**: El sistema DEBE permitir filtrar los pagos por rango de fechas, tercero, estado, medio de pago, número y serie/folio.
- **FR-014**: El sistema DEBE mostrar un estado vacío claro cuando no haya pagos o cuando los filtros no devuelvan resultados.
- **FR-015**: El sistema DEBE permitir consultar el detalle completo de un pago, incluidas sus notas y sus vínculos opcionales.
- **FR-016**: El sistema DEBE mostrar los importes con dos decimales y, cuando exista, la moneda indicada, sin diferencias por redondeo.
- **FR-017**: El sistema DEBE presentar mensajes claros cuando falte información obligatoria, cuando el folio o el importe sean inválidos, cuando exista duplicidad o cuando una referencia no exista.
- **FR-018**: El sistema DEBE mantener visibles los pagos aplicados o cancelados con su estado, sin eliminarlos físicamente.
- **FR-019**: El sistema DEBE mantener la lista y los filtros con un tiempo de respuesta inferior a 1 segundo para al menos 500 pagos.
- **FR-020**: El sistema DEBE integrar la funcionalidad en el área de Contabilidad y Finanzas con la interfaz en español.
- **FR-021**: El sistema DEBE aceptar como medio de pago únicamente `efectivo`, `transferencia`, `cheque` o `tarjeta`.

### Entidades Clave *(incluir si la funcionalidad implica datos)*

- **Pago**: Movimiento financiero de cobro o desembolso. Registra fecha, tercero, serie y folio, número oficial, importe con dos decimales, moneda, medio de pago, estado, notas y vínculos opcionales con un documento y un asiento contable.
- **Tercero**: Cliente, proveedor, banco o acreedor contra quien se registra el pago.
- **Documento**: Documento que se liquida o se asocia al pago, cuando existe.
- **Asiento contable**: Asiento contable que corresponde al pago, cuando existe. Un pago puede vincularse como máximo a un asiento y un asiento puede corresponder como máximo a un pago.

## Criterios de Éxito *(obligatorio)*

### Resultados Medibles

- **SC-001**: Un tesorero puede registrar un pago completo y verlo en la lista en menos de 2 minutos.
- **SC-002**: Un tesorero puede encontrar un pago por número, tercero o rango de fechas en menos de 10 segundos.
- **SC-003**: Al menos el 90% de una muestra mínima de 20 usuarios de prueba pueden registrar y consultar un pago sin ayuda.
- **SC-004**: La lista y los filtros responden en menos de 1 segundo con al menos 500 pagos registrados.
- **SC-005**: El 100% de los intentos con fecha, tercero, folio, importe o medio de pago inválidos son rechazados con un mensaje claro.
- **SC-006**: No se permiten duplicados del número oficial ni de la combinación de serie y folio.
- **SC-007**: Los importes mostrados coinciden exactamente con el importe registrado, sin diferencias por redondeo.
- **SC-008**: Todo pago guardado aparece en la lista inmediatamente y conserva sus datos tras navegar o recargar.
- **SC-009**: Los filtros devuelven únicamente los pagos que cumplen todos los criterios seleccionados.
- **SC-010**: Ningún pago se pierde al navegar entre la lista, el detalle y el formulario de registro.

## Suposiciones

- Esta funcionalidad corresponde a la fase futura de Pagos del módulo de Contabilidad y Finanzas; no forma parte del MVP actual definido en `data-model.md`.
- La funcionalidad se usa en un entorno de un solo usuario, sin autenticación multiusuario ni integración con servicios externos.
- Se asume un único rol operativo de tesorero o encargado de pagos para esta funcionalidad.
- Los importes se registran con exactitud de dos decimales y no se convierten entre monedas.
- La moneda es opcional; si no se indica, el importe se muestra con dos decimales sin código de moneda.
- Un pago pertenece a un único tercero, puede asociarse como máximo a un documento y como máximo a un asiento contable.
- No se calcula el saldo pendiente del documento ni se genera automáticamente un asiento contable en esta historia; solo se permiten vínculos opcionales con registros existentes.
- El estado inicial del pago es `pendiente`; los pagos aplicados o cancelados se conservan y no se eliminan físicamente.
- La serie es opcional; si no se indica, la unicidad se valida usando solo el folio.
- La interfaz de usuario está en español y se integra en el área de Contabilidad y Finanzas.
