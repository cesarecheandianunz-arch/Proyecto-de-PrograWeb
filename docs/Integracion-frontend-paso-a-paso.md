# Cierre del frontend: HU-1 a HU-5

Estos cambios fueron autorizados para integrar el trabajo del grupo. Se conservaron las páginas, las tablas, los formularios, los componentes y los estilos existentes. No se añadieron dependencias, servidor ni autenticación real.

## Qué cambió en cada historia

| Historia | Archivos principales | Cambio |
| --- | --- | --- |
| HU-1 | Inicio, Login, Registro, RegistroEncargado, MiCuenta, Recuperar | El buscador lleva el texto al catálogo. Los formularios validan datos. El registro conserva el perfil de demostración, la cuenta permite editarlo y el encabezado muestra su nombre. La recuperación y el cambio de contraseña muestran el flujo y validan, sin almacenar contraseñas ni enviar correos. |
| HU-2 | NuevoEquipo, Inventario, DetalleEquipo, FichaPublicaEquipo, inventarioUtils | Se pueden seleccionar o arrastrar JPG/PNG, conservarlos en el borrador y verlos en la ficha. La eliminación consulta las solicitudes y los préstamos compartidos. Se impide cambiar manualmente una unidad asignada a una solicitud aprobada. |
| HU-3 | Catalogo, Solicitar, MisSolicitudes; nuevo DetalleSolicitud | Filtros, orden y paginación. Fechas, duración y aceptación de condiciones. Enviar, consultar o retirar una solicitud modifica los datos compartidos. El detalle permite ver el rechazo y la constancia. |
| HU-4 | Bandeja, RegistrarEntrega, Constancia, Prestamos | Filtros y búsqueda; asignación de una unidad del equipo correcto, revisión de deuda y autorización. Rechazo con motivo. Entrega y constancia usan el código seleccionado. Los préstamos y sus vencimientos reflejan los cambios. |
| HU-5 | Devolucion, Historial, Renovacion | Devolución del préstamo seleccionado, accesorios realmente entregados, daños, fotografía y tarifa del equipo. Actualiza disponibilidad, historial y deuda. La renovación cambia el vencimiento y contempla los bloqueos. Pago y bloqueo se comparten con la bandeja y las solicitudes. |
| Compartido | App, main, Navbar, PanelEncargado, Pagina, Footer, datos, context y utils | Rutas con código de préstamo/ID del estudiante, menús de demostración, contadores reales, datos semilla coherentes y almacenamiento común. Ayuda y reglamento tienen enlaces y pantallas. |

## Por qué fue necesario compartir datos

Antes cada pantalla tenía su propia lista. Cambiar el estado en una no cambiaba las otras.

Ahora los datos tienen una fuente común:

- `InventarioContext`: equipos y unidades, responsabilidad de HU-2.
- `PrestamosContext`: solicitudes, préstamos y estudiantes para HU-3, HU-4 y HU-5.
- `CuentaContext`: cuál estudiante de demostración se está mostrando. No autentica ni protege una sesión.

`main.jsx` coloca los proveedores alrededor de `App`. Así todas las rutas de React Router pueden consumirlos.

## El recorrido de un dato, desde cero

1. El estudiante escribe. Cada input tiene un `value` que viene de `useState` y un `onChange` que lo actualiza. Es un formulario controlado.
2. Pulsa enviar. El evento llama a una función de `PrestamosContext`.
3. Esa función llama a una regla de `utils/operaciones.js`, pasando los datos actuales.
4. La regla revisa condiciones con `if`. Si algo falla, devuelve un objeto con `error` y, cuando corresponde, `errores` por campo.
5. Si todo está bien, crea una copia con los cambios. `map` actualiza un registro; `filter` selecciona registros; `...` copia el resto de sus propiedades.
6. El Context llama a su setter. React vuelve a dibujar las pantallas que consumen esos datos.
7. `useEffect` sincroniza los datos con `localStorage`, usando `JSON.stringify`. Al recargar se recuperan con `JSON.parse`.

Context comparte; localStorage conserva. Una cosa no reemplaza a la otra.

## Qué significa el resultado de una operación

La función no dibuja nada. Devuelve datos para que la pantalla decida:

```js
const resultado = aprobarSolicitud(codigo, unidad, autorizacion);

if (resultado.error) {
  setMensaje(resultado.error);
  return;
}

setMensaje('Solicitud aprobada y unidad asignada.');
```

`return` termina la función en ese punto. Si hay un error, no continúa guardando ni navegando.

En las reglas, `datos` contiene la copia del estado que se guardará. `unidad`, si existe, indica qué unidad del inventario debe actualizarse. De esa manera HU-4 y HU-5 no mantienen inventarios distintos.

## Equipo, unidad, solicitud y préstamo no son lo mismo

- Equipo: el modelo, por ejemplo una cámara. Se identifica con un `id` numérico.
- Unidad: el ejemplar físico, por ejemplo `INV-CAM-0010`. Guarda el `equipoId` de su modelo.
- Solicitud: lo que pide un estudiante, con `equipoId`, `estudianteId`, `inicio`, `fin`, `curso`, `motivo` y `estado`.
- Préstamo: se crea al registrar la entrega de una solicitud aprobada. Guarda la unidad, accesorios entregados, fecha, tarifa y observaciones.

El código de la solicitud acompaña a la entrega, la constancia y la devolución. No identificamos equipos comparando sus nombres, porque el nombre puede editarse.

La aprobación asigna la unidad en ese rango, pero no significa que ya fue entregada. La entrega cambia su estado a `Prestada`. La devolución la devuelve a `Disponible` o la deriva a `Mantenimiento`. Las aprobaciones superpuestas no pueden asignar la misma unidad.

## Cómo leer una ruta

Ejemplo: `/encargado/devolucion/PRE-2026-0318`.

En `App.jsx` se declara `/encargado/devolucion/:codigo`. `useParams()` permite obtener `codigo`. Con `find` se obtiene ese préstamo del Context. Por eso se conserva el registro seleccionado al cambiar de pantalla o recargar.

`Link` permite navegar al pulsar un enlace. `useNavigate` se usa después de guardar correctamente una operación. No se debe usar `window.location` para estos cambios de pantalla.

## Complementos que deben estudiar

Las funciones flecha, `map`, `filter`, `forEach`, `...`, props, `children`, `useState`, Context, `useEffect`, JSON y localStorage aparecen en el material del curso. Estos complementos merecen explicación aparte:

| Complemento | Por qué se usa | Alternativa y diferencia |
| --- | --- | --- |
| `FileReader` y `readAsDataURL` | Leer una fotografía seleccionada y conservarla como texto de imagen en el navegador. `onload` se ejecuta cuando termina la lectura. | Conservar solamente el nombre del archivo no permite volver a mostrar su contenido después de recargar. Subirla a un servidor se deja para otra entrega. |
| `onDrop`, `onDragOver`, `dataTransfer.files` | Recibir archivos arrastrados. `preventDefault` evita que el navegador abra el archivo y abandone la aplicación. | El selector de archivos sigue disponible si no se quiere arrastrar. |
| `Date`, `Date.UTC`, `toISOString` | Comparar fechas, contar días calendario y obtener nuevas fechas. UTC evita diferencias por cambios horarios al restar días. | Restar textos no calcula días. Separamos el formato guardado `AAAA-MM-DD` del mostrado `DD/MM/AAAA`. |
| `sort` y `localeCompare` | Ordenar equipos por texto en español o por disponibilidad. | Un recorrido manual también sirve, pero implica escribir el algoritmo completo. Se ordena una copia para no modificar el estado. |
| `useParams`, `useSearchParams`, `useLocation`, `useNavigate` | Leer IDs, filtros y mensajes; navegar al terminar una operación. | Escribir URLs a mano no cumple el recorrido pedido. Estos hooks complementan los enlaces de Router de las clases. |
| `Number.isInteger`, `Number.isFinite` | Distinguir días enteros y montos válidos. | Comprobar solo `> 0` permitiría duraciones decimales. |
| `import * as operaciones` | Reunir las funciones exportadas por un archivo bajo el nombre `operaciones`. | Se podrían importar una por una con alias. No ejecuta nada automáticamente ni instala una librería. |

`useRef` y el elemento HTML `dialog` ya se utilizaban en los modales de HU-2; se explican en `HU2-clases-y-complementos.md`.

## Persistencia y alcance de la maqueta

- `equipos` y `unidades`: se conservan las claves anteriores del inventario.
- `operaciones-v1`: solicitudes, préstamos y estudiantes, guardados juntos.
- `vista-demo-v1`: estudiante seleccionado para la vista de demostración.
- `hu2-borrador-...`: borrador por formulario de equipo.
- `encargados-demo`: registros de encargados pendientes, sin contraseñas.

La primera apertura completa las unidades semilla ausentes una sola vez, para equipos que todavía existan. No reemplaza unidades editadas ni borra el inventario guardado. La marca `unidades-semilla-v2` evita volver a agregarlas en cada recarga.

Las fotografías locales tienen un límite por archivo porque localStorage tiene capacidad limitada. Si el navegador no puede guardar, se muestra el error; no se afirma que el cambio quedó conservado.

El login conserva su simulación por rol. El correo de un estudiante registrado o de los ejemplos selecciona su perfil; otro correo institucional de estudiante abre el ejemplo de Renzo. No valida credenciales reales. La contraseña no se almacena. No hay envío de correos, servidor, sesiones seguras, HU-6 ni HU-7.

## Prueba de demostración

1. Inicio → Vista del estudiante → Catálogo → Solicitar préstamo.
2. Inicio: hoy; devolución: dentro de tres días; curso; motivo de 20 caracteres o más; aceptar condiciones.
3. Enviar y comprobar el detalle en Mis solicitudes.
4. Vista del encargado → Solicitudes → Aprobar. Seleccionar una unidad y confirmar la autorización del docente si corresponde.
5. Pestaña Aprobadas → Registrar entrega → comprobar accesorios → guardar.
6. Consultar la constancia. «Guardar como PDF» abre la impresión del navegador: elegir guardar en PDF. No requiere una librería de PDF.
7. Préstamos vigentes → devolución de ese código → registrar. Comprobar inventario e historial.
8. Recargar y comprobar que los cambios permanecen.
9. Probar rechazo con motivo; deuda; renovación permitida y bloqueada; filtros sin resultados; formularios incompletos; imágenes; borrador.

Para demostrar una entrega inmediata, solicitar desde hoy. Una aprobación para mañana no permite inventar una entrega futura: su validación exige estar dentro del rango y no después de hoy.

## Cómo justificar el uso de IA

Explicar el aporte real: se usó IA para revisar y completar la integración, y se pidió conservar las pantallas y usar lógica del curso. Un ejemplo de revisión crítica es el código originalmente denso, que se separó y se explicó. No atribuirse como escrito sin ayuda lo que se generó con asistencia.

Cada compañero debe revisar sus cambios, ejecutar la demostración y poder explicar un evento, una validación, el estado y la ruta que usa su historia. No se hicieron commits, push ni publicación automáticos.

## Verificación realizada

- `npm test`: 25 pruebas de reglas, datos semilla y recorrido integrado.
- `npm run build`: compilación completa de las cinco historias.
- Chrome con perfil temporal: solicitud → aprobación → entrega → constancia → devolución → recarga; comprobación de cambios en inventario y préstamos.
- Chrome: filtros, rechazo compartido, deuda que bloquea la aprobación, renovación y su límite, daños con tarifa del equipo, pago, archivo de imagen, borrador recuperado, unidad nueva y perfil conservado tras recargar.
- Se visitaron 30 rutas para detectar errores de ejecución o pantallas vacías.

Las pruebas del navegador usaron un perfil temporal, independiente del navegador personal. No borraron los datos del navegador del estudiante.
- Comprobación adicional: 83 enlaces internos corresponden a rutas declaradas. Diez pantallas principales revisadas a 390 px de ancho sin desbordar horizontalmente la página.
