# HU-2: relación con tus clases y explicación de los complementos

El objetivo es que puedas explicar cada cambio con tus palabras. Esta revisión simplifica la escritura del código; conserva las funciones de HU-2 que ya teníamos.

## 1. Qué usamos de tus clases

Las páginas indicadas son las páginas del PDF, empezando en 1.

| Material | Tema del curso | Dónde lo aplicamos |
| --- | --- | --- |
| [3.pdf](/Users/khalett/Downloads/3.pdf), págs. 22–23 | Texto, plantillas, `trim`, `includes`, `split` | Limpiar códigos, buscar y separar enlaces de fotografías |
| 3.pdf, págs. 27 y 29 | `Number`, `if/else` | Convertir los inputs numéricos y tomar decisiones |
| 3.pdf, págs. 32 y 36–37 | Bucles, valores ausentes y `Math` | Revisar listas, dar valores iniciales y calcular páginas |
| [4.Javascript_Avanzado_DOM.pdf](/Users/khalett/Downloads/4.Javascript_Avanzado_DOM.pdf), págs. 6–10 | Funciones, archivos, `import/export` y funciones flecha | Separar reglas y reutilizarlas en las pantallas |
| 4.Javascript_Avanzado_DOM.pdf, págs. 11–18 | `map`, `filter`, `forEach`, objetos, `Object.keys` y `...` | Listar, buscar, validar y actualizar datos |
| [5.React.pdf](/Users/khalett/Downloads/5.React.pdf), págs. 24–28 | Props, `children`, condiciones, listas y rutas | Componentes de campo/modal, tablas y navegación |
| 5.React.pdf, págs. 30–32 | `useState`, arreglos de estado y formularios controlados | Datos que escribes y cambios en el inventario |
| 5.React.pdf, págs. 34 y 37–39 | `useEffect`, Context y reglas de hooks | Guardar en el navegador y compartir los datos entre pantallas |
| [7.Persistencia.pdf](/Users/khalett/Downloads/7.Persistencia.pdf), págs. 14–16 y 23–25 | JSON, `try/catch` y `localStorage` | Conservar el inventario y los borradores al recargar |
| [Readme.md del taller](/Users/khalett/Downloads/2026-2.Taller_React-main/Readme.md) | Componentes, props, estado, inputs y Router | La misma base de trabajo, aplicada a equipos y unidades |

El ternario sí aparece en las diapositivas, pero por tu preferencia usamos `if/else` en el código revisado de HU-2. No necesitas emplear la forma más corta para resolver el requisito.

## 2. Qué simplificamos ahora

- **Decisiones:** reemplazamos ternarios por `if/else` o por dos bloques de JSX con condiciones explícitas.
- **Filtros:** primero categoría, después estado, después búsqueda y después disponibilidad. Cada paso trabaja sobre el resultado del anterior.
- **Historial:** quitamos `flatMap`. Usamos `forEach` para recorrer y `push` para agregar a una lista nueva.
- **Fotografías:** quitamos `filter(Boolean)`. Ahora se lee `return url !== ''`, que explica por qué conservamos una línea.
- **Actualizaciones:** `map` ahora tiene un bloque con `if/else`: si es el equipo buscado devuelve la copia modificada; si no, devuelve el original.
- **Validaciones:** separamos coincidencias y condiciones en variables con nombre. Quitamos búsquedas con `some` en las reglas de HU-2 para usar `filter` y `length`.
- **Formulario:** repartimos los atributos largos de los inputs en varias líneas. Eso solo cambia cómo se lee el archivo.

Por ejemplo, para elegir el texto de renovación:

```js
let textoRenovacion;

if (renovacion) {
  textoRenovacion = 'Admite renovación.';
} else {
  textoRenovacion = 'No admite renovación.';
}
```

Después, dentro del JSX, escribimos `{textoRenovacion}`. Primero decidimos el dato y después lo mostramos.

## 3. Por qué todavía aparece `&&` en el JSX

```jsx
{mensaje !== '' && <p>{mensaje}</p>}
```

Se lee: «si hay mensaje, muestra el párrafo». Está en 3.pdf, pág. 48, y en 5.React.pdf, pág. 25. Dentro de las llaves de JSX no se puede escribir directamente una sentencia `if`. Podemos calcular un valor antes del `return` con `if/else`, o usar esta condición para mostrar un elemento opcional.

Para presentar una lista o un mensaje vacío usamos dos condiciones separadas:

```jsx
{unidadesEquipo.length === 0 && <p>No hay unidades.</p>}
{unidadesEquipo.length > 0 && <table>...</table>}
```

Aquí `...` representa el contenido de la tabla, no es código para copiar. Usamos comparaciones que devuelven `true` o `false`: no escribimos `{unidadesEquipo.length && ...}`, que podría mostrar un cero.

## 4. `??` y `?.` son distintos del ternario

Ambos aparecen en **3.pdf, pág. 36**. Conservamos algunos usos para los datos que pueden faltar.

```js
setPenalidad(actual.penalidad ?? 15);
```

Significa: si `penalidad` es `null` o `undefined`, usar 15. Si vale cero, conservar cero. Su equivalente con `if/else` es:

```js
if (actual.penalidad === null || actual.penalidad === undefined) {
  setPenalidad(15);
} else {
  setPenalidad(actual.penalidad);
}
```

`location.state?.mensaje` lee el mensaje de navegación cuando existe `state`. Si falta, devuelve `undefined` sin intentar leer una propiedad de un valor vacío.

## 5. Complemento: abrir un modal con `useRef` y `dialog`

**Dónde:** `src/components/ModalInventario.jsx`.

**Por qué lo agregamos:** el modal necesita abrirse sobre la pantalla, permitir Escape y mantener el foco del teclado dentro de él.

**Qué aporta cada parte:**

- `dialog` es una etiqueta HTML del navegador.
- `useRef(null)` es un hook de React que guarda una referencia al elemento HTML. No se desarrolla en los PDFs recibidos.
- `ref={dialogo}` conecta esa referencia con el elemento.
- `dialogo.current` permite acceder al elemento una vez que React lo colocó en la pantalla.
- `showModal()` lo abre y el navegador controla el foco dentro del diálogo.
- `onCancel={onCerrar}` avisa al componente padre cuando se pulsa Escape. El padre cambia su estado y retira el modal.
- La función que devuelve `useEffect` lo cierra cuando React retira el componente.

La diferencia útil: `useState` guarda datos que deciden qué dibujar; `useRef` permite conservar una referencia sin provocar otro render al cambiarla. Aquí no lo usamos para modificar textos de la tabla a mano.

## 6. Complemento: fechas del historial

**Dónde:** `DetalleEquipo.jsx`.

**Por qué:** necesitamos saber cuándo ocurrió un cambio y mostrar primero el más reciente.

```js
const cambio = {
  fecha: new Date().toISOString(),
  anterior: actual.estado,
  nuevo: nuevoEstado,
  motivo: motivoCambio.trim(),
};
```

`new Date()` obtiene la fecha y hora actuales. `toISOString()` las convierte en texto de formato uniforme que podemos guardar con JSON. `toLocaleString('es-PE', { timeZone: 'America/Lima' })` permite presentarlas para lectura en horario de Lima.

`sort()` ordena la lista con una función que compara dos elementos:

```js
historial.sort((primero, segundo) => {
  return new Date(segundo.fecha) - new Date(primero.fecha);
});
```

La resta compara sus tiempos en milisegundos. Si el segundo es más reciente, el resultado es positivo y se coloca antes del primero. `sort` modifica la lista que recibe; por eso lo aplicamos a `historial`, una lista nueva calculada en la pantalla, y no directamente a una lista guardada en el estado.

`push` también modifica una lista. Es correcto para reunir cambios en esa lista nueva. Para actualizar el estado de React seguimos creando otra lista con `map`, `filter` o `...`.

## 7. Complementos pequeños de JavaScript

No se desarrollan específicamente en los ejemplos de las clases recibidas. Los usamos con estos objetivos:

| Herramienta | Para qué está y qué hace en el código |
| --- | --- |
| `find` | Obtiene el primer equipo con el ID de la ruta. Devuelve `undefined` si no lo encuentra; por eso comprobamos `if (!equipo)`. Ya estaba en tu avance. |
| `Array.isArray` | Comprueba que lo recuperado del almacenamiento sea una lista antes de usarlo como lista. Evita, por ejemplo, ejecutar `map` sobre un texto. |
| `Number.isInteger` | Comprueba que los días sean enteros: acepta 7 y rechaza 1.5, `NaN` e infinito. |
| `Number.isFinite` | Rechaza `NaN` e infinito como penalidad. Comprobamos aparte que el monto no sea negativo. |
| `new URL` y `protocol` | Interpretan el enlace de una fotografía y permiten aceptar solo direcciones HTTP o HTTPS. Si la dirección no se puede interpretar, `catch` devuelve `false`. No comprueban que el servidor entregue una imagen. |
| `endsWith` | Comprueba si la dirección termina en `/condiciones` para elegir esa pestaña. |
| `Boolean` | Convierte un valor a `true` o `false`. Lo usamos para señalar si un campo tiene un error, sin la abreviatura `!!`. |
| `window.confirm` | Abre una confirmación del navegador. Devuelve `true` al aceptar y `false` al cancelar; al cancelar salimos antes de dar de baja la unidad. |

Son herramientas incluidas en JavaScript o en el navegador. No instalamos otra librería para usarlas.

## 8. Complemento de Router: leer y cambiar la dirección

En la clase se presenta Router con rutas y enlaces. Estos hooks amplían ese uso:

- `useParams()` obtiene el `id` que cambia en `/encargado/equipo/:id`.
- `useNavigate()` permite cambiar de pantalla después de guardar, desde una función.
- `useLocation()` permite leer la dirección actual y el mensaje enviado al navegar.

Por ejemplo, después de guardar, `navigate` envía `{ state: { mensaje: mensajeGuardado } }`. La pantalla siguiente lee ese mensaje y muestra el resultado. Ese `state` es información de navegación; el inventario se conserva por separado en Context y `localStorage`.

## 9. Complemento de HTML: etiquetas y accesibilidad

`label` con `htmlFor` conecta el nombre del campo con su input mediante el `id`. Los atributos `aria-*` aportan información para herramientas como lectores de pantalla:

- `aria-invalid` indica si un campo tiene un error.
- `aria-describedby` conecta el campo con el texto de su error.
- `aria-label` da nombre a un control sin etiqueta visible, como un botón de fotografía.
- `aria-pressed` indica cuál botón de fotografía está seleccionado.

`role="alert"` anuncia un error y `role="status"` permite anunciar un resultado. Estos atributos no guardan datos ni cambian las reglas del formulario.

## 10. Complementos funcionales y pruebas

**Borradores:** es una función adicional al formulario básico. Guarda una versión incompleta con `localStorage`; no la incorpora al inventario hasta pulsar guardar equipo. Sus herramientas principales ya están en la clase de persistencia.

**Historial de estados:** conserva cada cambio y su motivo. Usa arreglos, objetos y estado del curso, más las funciones de fecha explicadas arriba.

**Pruebas automáticas:** `tests/hu2.test.js` usa `node:test` y `node:assert/strict`, herramientas de Node.js. No son parte de React ni de las pantallas. Ejecutan ejemplos y comprueban resultados esperados, como que un código repetido se rechace. Son un complemento de desarrollo, sin dependencias nuevas.

Para ejecutarlas:

```sh
node --test tests/hu2.test.js
```

## 11. Orden para seguirlo con calma

1. Empieza por `guardarUnidad` en `DetalleEquipo.jsx`: evento, validación, creación del objeto y actualización de la lista.
2. Sigue con `validarUnidad` en `inventarioUtils.js`: `filter`, comparación de códigos y objeto de errores.
3. Revisa cómo `InventarioContext.jsx` conserva esa lista con `useEffect` y `localStorage`.
4. Después pasa a `guardarCambioEstado`, donde `map` elige la unidad a modificar.
5. Deja el modal, las fechas y el resto de complementos para cuando esa secuencia esté clara.

Para cada función, intenta responder: qué recibe, qué comprueba, qué cambia y qué resultado produce. La [guía de práctica](HU2-paso-a-paso.md) contiene el recorrido para comprobarlo en el navegador.
