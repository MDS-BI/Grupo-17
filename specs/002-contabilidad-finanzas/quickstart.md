# Inicio Rápido: Módulo de Contabilidad y Finanzas

## Requisitos

- Node.js 18 o superior.
- Navegador moderno para la validación manual.

## Arranque

```bash
npm install
npm run dev
```

Abrir la URL local que muestra Vite. La aplicación inicia en la pantalla de acceso; iniciar sesión con cualquiera de los usuarios de prueba de la Historia de Usuario 8. Con el rol **Administrador financiero** (`11.111.111-1` / `Admin2026!`), usar **Cargar datos de ejemplo** en su panel para cargar la semilla determinista y **Restablecer datos** para volver al estado inicial.

## Validación Automática

```bash
npm test
npm run build
```

`npm test` debe completar sin fallos (referencia: 44 archivos y 229 pruebas en la última ejecución verificada). `npm run build` debe generar `dist/` sin errores.

## Validación de la Historia de Usuario 7 (gráficas)

1. Poblar los datos de ejemplo y permanecer en el panel principal.
2. Verificar que aparecen tres visualizaciones: barras de ingresos/gastos por periodo, línea de resultado y dona de gastos por cuenta.
3. Comprobar que las etiquetas y tooltips muestran importes en MXN con dos decimales.
4. Cambiar el periodo contable y confirmar que las tres gráficas se actualizan sin recargar la página.
5. Comprobar que la suma de ingresos y gastos del panel coincide con el resumen del reporte del mismo periodo.
6. Eliminar los datos de ejemplo o iniciar una sesión sin datos y verificar mensajes de estado vacío en español en lugar de gráficas vacías.
7. Confirmar en las herramientas del navegador que las colecciones del módulo están bajo `sessionStorage` y que no se realizan peticiones de red.

## Validación de la Historia de Usuario 8 (acceso por RUT y contraseña)

1. Probar los cuatro usuarios de prueba (`11.111.111-1`, `22.222.222-2`, `33.333.333-3`, `44.444.444-4`) con su contraseña correspondiente y confirmar que cada uno ve su panel propio.
2. Ingresar un RUT con y sin puntos/guion; ambas formas deben autenticar al mismo usuario.
3. Probar un RUT inexistente y una contraseña incorrecta; en ambos casos debe aparecer exactamente "RUT o contraseña incorrectos" y no debe abrirse ningún panel.
4. Omitir RUT o contraseña y verificar el mensaje del dato faltante.
5. Cerrar sesión desde cada panel e intentar volver al panel anterior; debe solicitarse nueva autenticación.

## Validación de la Historia de Usuario 9 (permisos por rol)

1. Verificar que el menú del Administrador incluye todas las secciones financieras y la acción de abrir/cerrar periodos.
2. Verificar que el Contador ve Cuentas contables, Asientos contables y Reportes, sin Pagos ni Periodos.
3. Verificar que el Tesorero ve solo Pagos y cobros, y que el Auditor ve solo Reportes en modo consulta.
4. Intentar abrir una sección ajena al rol y comprobar el mensaje de acceso no disponible sin que se muestre información.
5. Confirmar que el Contador puede elegir un periodo abierto al registrar asientos sin entrar a Gestión de periodos, y que el Tesorero puede seleccionar entidades/documentos dentro del formulario de pagos.

## Validación de la Historia de Usuario 10 (semilla y restablecimiento)

1. Iniciar sesión como Administrador financiero y confirmar que los botones **Cargar datos de ejemplo** y **Restablecer datos** están visibles.
2. Iniciar sesión con los otros tres roles y confirmar que esos botones no aparecen.
3. Cargar la semilla y verificar al menos cuatro periodos no superpuestos, ocho cuentas, ocho asientos aprobados y cuatro pagos/cobros, con un movimiento por periodo y pagos en estados pagado, pendiente y vencido.
4. Cargar la semilla una segunda vez; periodos, importes, fechas y cantidades deben ser idénticos y no deben existir duplicados.
5. Restablecer datos y comprobar que no quedan registros financieros ni referencias rotas, pero que los cuatro usuarios de prueba siguen disponibles.
6. Cancelar una confirmación y verificar que los datos permanecen sin cambios.

## Validación de la Historia de Usuario 11 (menú único)

1. Confirmar que "Entidades", "Documentos" y "Búsqueda" no aparecen en menú ni panel para ningún rol.
2. Recorrer el menú y el panel y verificar que cada pantalla tiene un solo control visible que la abre.
3. Confirmar que **Cargar datos de ejemplo**, **Restablecer datos** y **Cerrar sesión** se reconocen como acciones, no como accesos duplicados.
4. Intentar abrir una pantalla eliminada y verificar el mensaje "Sección no disponible".

## Validación de la Historia de Usuario 12 (resumen de pagos)

1. Iniciar sesión como Tesorero o Administrador financiero, cargar la semilla y abrir **Pagos y cobros**.
2. Verificar el resumen con cantidad y total en MXN para pendiente, pagado y vencido.
3. Aplicar cada filtro (`Todos`, `Pendiente`, `Pagado`, `Vencido`) y comprobar que el listado coincide con el resumen y que los otros totales siguen visibles.
4. Confirmar que un pago pendiente cuya fecha de vencimiento ya pasó aparece como vencido y deja de contarse como pendiente.
5. Marcar un pago como pagado y verificar el cambio inmediato en resumen, totales y listado filtrado.
6. Comprobar que los roles sin acceso a pagos no ven el resumen ni el filtro, y que un filtro sin resultados muestra su mensaje correspondiente.

## Validación de la Historia de Usuario 13 (estados financieros por periodo)

1. Iniciar sesión como Contador, cargar la semilla y abrir **Reportes financieros**.
2. Generar Libro Mayor, Balance de Comprobación, Estado de Resultados y Balance General para el mismo periodo y comprobar que no aparece una opción nueva de menú.
3. Verificar que solo se incluyen asientos aprobados y que el saldo inicial coincide con movimientos de periodos anteriores.
4. Confirmar que el Balance de Comprobación excluye cuentas con saldo cero y que sus totales deudores y acreedores coinciden.
5. Confirmar que el Estado de Resultados muestra `ingresos - gastos` y que el Balance General incluye el resultado acumulado en el patrimonio.
6. Forzar datos inconsistentes o una cuenta sin tipo válido y verificar la advertencia en español; comprobar que un periodo sin movimientos muestra estado vacío en los cuatro reportes.
7. Cambiar el periodo y verificar que los cuatro reportes se recalculan por completo, también para periodos cerrados.

## Validación de las Historias de Usuario 14 y 15 (cierre de periodos)

1. Iniciar sesión como Administrador financiero, elegir un periodo abierto y confirmar su cierre; verificar que quede marcado como cerrado.
2. Cancelar un cierre e intentar cerrar dos veces el mismo periodo; el estado no debe cambiar y debe mostrarse un mensaje claro.
3. Con cada rol, intentar crear, editar, eliminar, anular o cambiar la fecha de un asiento o pago del periodo cerrado; todas las acciones deben bloquearse con mensaje de periodo cerrado.
4. Verificar que los registros existentes permanezcan idénticos y que los reportes y listados del periodo cerrado sigan disponibles sin acciones de modificación.
5. Confirmar que los roles distintos del Administrador financiero no ven ni pueden ejecutar la acción de cierre.

## Validación de la Historia de Usuario 16 (registro de actividad)

1. Iniciar sesión como Auditor y abrir la consulta de auditoría dentro de **Reportes financieros**; no debe existir una opción nueva de menú.
2. Crear, editar y anular asientos y pagos con otros roles y verificar que el Auditor ve eventos con usuario, rol, acción, fecha y hora.
3. Comprobar que los eventos de edición identifican los campos modificados y que el historial de cada movimiento se ordena del más reciente al más antiguo.
4. Intentar editar o eliminar eventos y verificar que no existen controles para hacerlo.
5. Probar una operación rechazada y una segunda anulación; no debe generarse un evento nuevo.
6. Cargar la semilla dos veces, restablecer datos y verificar historiales idénticos y sin eventos huérfanos.
7. Confirmar que ningún rol distinto del Auditor puede abrir la consulta y que sin eventos aparece un mensaje en español.

## Validación de la Historia de Usuario 17 (alertas de vencimientos)

1. Iniciar sesión como Tesorero con datos de ejemplo y comprobar que su panel muestra alertas de pagos vencidos y de pagos que vencen esta semana, con cantidad y total en MXN.
2. Revisar el detalle de cada alerta: entidad, monto y fecha de vencimiento; si hay más de tres pagos, debe indicarse cuántos adicionales existen.
3. Verificar que un pago vencido dentro de la semana actual solo aparece en la alerta de vencidos y que un pago con vencimiento el lunes siguiente no aparece en la alerta semanal.
4. Pagar o anular un pago y actualizar el panel; la alerta correspondiente debe desaparecer o recalcularse.
5. Confirmar que los otros roles no ven las alertas y que no se creó una opción de menú ni un acceso duplicado a "Pagos y cobros".

## Validación de la Historia de Usuario 18 (identidad corporativa)

1. Iniciar sesión con cada rol y verificar que el encabezado muestra exactamente "Comercial Los Andes SpA" junto al logotipo ficticio.
2. Navegar entre todas las secciones y comprobar que nombre y logotipo permanecen visibles sin reemplazar el título de la pantalla.
3. Cargar y restablecer datos y verificar que la identidad corporativa no cambia.
4. Simular la ausencia del logotipo y confirmar que el nombre sigue visible con una referencia visual clara.

## Validación de la Historia de Usuario 19 (exportación)

1. Abrir cada reporte financiero y comprobar los botones **Exportar PDF** y **Exportar Excel**.
2. Descargar ambos formatos para el mismo periodo y verificar que el archivo contiene "Comercial Los Andes SpA", el periodo, la fecha de generación y los totales del reporte.
3. Comparar cifras y totales del archivo con la pantalla; deben ser idénticos.
4. Cambiar el periodo y exportar nuevamente; el archivo debe corresponder al nuevo periodo.
5. Exportar un reporte vacío válido y verificar totales en cero con indicación de ausencia de movimientos.
6. Probar un reporte con datos inconsistentes y confirmar que la exportación se bloquea con una advertencia comprensible.
7. Verificar que exportar no modifica datos, filtros ni eventos de auditoría y no crea una opción de menú.

## Validación de la Historia de Usuario 20 (filtros de asientos y pagos)

1. En el listado de asientos, aplicar rangos de fecha y monto, seleccionar cuenta y estado, y verificar que los límites sean inclusivos.
2. Repetir las pruebas en pagos y cobros; el filtro de cuenta debe usar el asiento relacionado y el de fecha debe usar la fecha del movimiento.
3. Combinar varios filtros y confirmar que se exigen todos simultáneamente.
4. Probar un rango inválido y comprobar el mensaje claro sin que el listado cambie.
5. Limpiar filtros y verificar que vuelven todos los registros permitidos para el rol.
6. Confirmar que los roles sin acceso a un listado no ven sus filtros y que no aparece una búsqueda global.

## Validación de la Historia de Usuario 21 (interfaz profesional)

1. Recorrer todas las secciones y comprobar que encabezados, botones y mensajes usan la misma paleta y que los estados de éxito, error y advertencia significan lo mismo.
2. Verificar que cada opción del menú y su encabezado de sección muestran el mismo ícono junto al texto.
3. Ordenar tablas por fecha, monto y estado en ambos sentidos; el orden debe ser cronológico/numérico y no modificar registros.
4. Guardar un registro válido y eliminar uno permitido; deben aparecer las confirmaciones correspondientes y cancelar la eliminación no debe cambiar datos.
5. En pantalla de celular, abrir el menú, confirmar que solo aparecen las secciones permitidas y comprobar que se cierra al seleccionar una sección.
6. Comparar menú amplio y menú de celular: deben mostrar las mismas secciones según el rol.

## Validación del Resto del Módulo

- Crear una cuenta raíz y una subcuenta; intentar duplicar el código y verificar el rechazo.
- Registrar un asiento borrador con partida doble; verificar que no afecta saldos hasta aprobarlo.
- Aprobar un asiento y comprobar que el resumen, los reportes y las gráficas se actualizan.
- Registrar un pago/cobro y verificar que impacta la cuenta bancaria y el resumen.
- Crear un segundo periodo sin solapamiento; intentar uno cerrado o traslapado y verificar el rechazo.
- Navegar entre todas las secciones y confirmar que los datos de la sesión permanecen.

## Notas de Deuda Trazada

Las desviaciones temporales respecto a la constitución y sus tareas de corrección están en `plan.md` → **Seguimiento de Complejidad** y en `tasks.md` → fase de convergencia (T117 a T120). La deuda de gráficas no solicitadas se eliminó porque el panel está cubierto por la Historia de Usuario 7; la lista de tareas debe regenerarse desde este plan para incluir HU13 a HU21.
