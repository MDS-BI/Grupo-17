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
3. Cargar la semilla y verificar cuatro periodos no superpuestos, diecisiete cuentas, seis asientos y tres pagos/cobros, con movimientos en los periodos 2026-08 a 2026-10 y pagos en estados pagado, pendiente y vencido.
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

## Validación del Resto del Módulo

- Crear una cuenta raíz y una subcuenta; intentar duplicar el código y verificar el rechazo.
- Registrar un asiento borrador con partida doble; verificar que no afecta saldos hasta aprobarlo.
- Aprobar un asiento y comprobar que el resumen, los reportes y las gráficas se actualizan.
- Registrar un pago/cobro y verificar que impacta la cuenta bancaria y el resumen.
- Crear un segundo periodo sin solapamiento; intentar uno cerrado o traslapado y verificar el rechazo.
- Navegar entre todas las secciones y confirmar que los datos de la sesión permanecen.

## Notas de Deuda Trazada

Las desviaciones temporales respecto a la constitución y sus tareas de corrección están en `plan.md` → **Seguimiento de Complejidad** y en `tasks.md` → **Phase 10: Convergence** (T063 a T070). La tarea anterior sobre gráficas no solicitadas se eliminó porque el panel ahora está cubierto por la Historia de Usuario 7.
