# Inicio Rápido: Módulo de Contabilidad y Finanzas

## Requisitos

- Node.js 18 o superior.
- Navegador moderno para la validación manual.

## Arranque

```bash
npm install
npm run dev
```

Abrir la URL local que muestra Vite. La aplicación inicia con el panel principal; si no hay datos, usar el botón **Poblar datos de ejemplo** para cargar la semilla determinista.

## Validación Automática

```bash
npm test
npm run build
```

`npm test` debe completar sin fallos (referencia: 27 archivos y 167 pruebas en la última ejecución verificada). `npm run build` debe generar `dist/` sin errores.

## Validación de la Historia de Usuario 7 (gráficas)

1. Poblar los datos de ejemplo y permanecer en el panel principal.
2. Verificar que aparecen tres visualizaciones: barras de ingresos/gastos por periodo, línea de resultado y dona de gastos por cuenta.
3. Comprobar que las etiquetas y tooltips muestran importes en MXN con dos decimales.
4. Cambiar el periodo contable y confirmar que las tres gráficas se actualizan sin recargar la página.
5. Comprobar que la suma de ingresos y gastos del panel coincide con el resumen del reporte del mismo periodo.
6. Eliminar los datos de ejemplo o iniciar una sesión sin datos y verificar mensajes de estado vacío en español en lugar de gráficas vacías.
7. Confirmar en las herramientas del navegador que las colecciones del módulo están bajo `sessionStorage` y que no se realizan peticiones de red.

## Validación del Resto del Módulo

- Crear una cuenta raíz y una subcuenta; intentar duplicar el código y verificar el rechazo.
- Registrar un asiento borrador con partida doble; verificar que no afecta saldos hasta aprobarlo.
- Aprobar un asiento y comprobar que el resumen, los reportes y las gráficas se actualizan.
- Registrar un pago/cobro y verificar que impacta la cuenta bancaria y el resumen.
- Crear un segundo periodo sin solapamiento; intentar uno cerrado o traslapado y verificar el rechazo.
- Navegar entre todas las secciones y confirmar que los datos de la sesión permanecen.

## Notas de Deuda Trazada

Las desviaciones temporales respecto a la constitución y sus tareas de corrección están en `plan.md` → **Seguimiento de Complejidad** y en `tasks.md` → **Phase 10: Convergence** (T063 a T070). La tarea anterior sobre gráficas no solicitadas se eliminó porque el panel ahora está cubierto por la Historia de Usuario 7.
