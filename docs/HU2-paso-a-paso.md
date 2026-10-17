# HU-2: guía para entender tu avance

Lee primero [HU2-clases-y-complementos.md](HU2-clases-y-complementos.md): relaciona el código con tus PDFs y explica los complementos.

Esta guía corresponde a la primera entrega: React y datos en el navegador. La segunda entrega necesita Express, base de datos y validaciones en el servidor.

## 1. Lo que ya habías construido

Ya usabas `useState`, Context, `useEffect`, rutas y `localStorage`. Tenías el listado, el registro y la edición de equipos, el alta de unidades y la edición de condiciones. Conservamos esa estructura.

Los problemas principales eran:

- El enlace de editar apuntaba a una dirección diferente a la definida en `App.jsx`.
- El enlace de condiciones no tenía una ruta que abriera esa pestaña.
- Se podían guardar códigos de inventario repetidos.
- `accesorio` empezaba como una lista (`[]`), aunque el input edita texto.
- Un equipo sin accesorios podía recibir `''` y después intentar ejecutar `.map()` sobre ese texto.
- El borrador solo mostraba un mensaje: no guardaba datos.
- Faltaban eliminación, fotografías funcionales, errores por campo e historial de estados.

## 2. Primero: distinguir un equipo de una unidad

Un **equipo** describe el modelo: «Osciloscopio TBS1052B».
Una **unidad** es un ejemplar físico: «INV-OSC-0042».

La relación se guarda con `equipoId`:

```js
const equipo = { id: 1, nombre: 'Osciloscopio TBS1052B' };
const unidad = { codigo: 'INV-OSC-0042', equipoId: 1 };
```

La idea viene del requisito que dice que el almacén mantiene el inventario por unidad. Por eso contamos unidades reales y no guardamos manualmente un contador que podría quedar desactualizado.

```js
const propias = unidades.filter((unidad) => unidad.equipoId === equipo.id);
```

`filter()` es JavaScript. Crea otra lista con los elementos que cumplen una condición. Aquí conserva solo las unidades del equipo que estamos viendo.

## 3. Segundo: el formulario tiene memoria

```js
const [nuevoCodigo, setNuevoCodigo] = useState('');
```

`useState` es de React. El primer valor contiene el dato actual; la segunda función permite cambiarlo. `''` significa que inicialmente no hay texto.

```jsx
<input value={nuevoCodigo} onChange={(evento) => setNuevoCodigo(evento.target.value)} />
```

Este es un **input controlado**: lo que muestra depende del estado de React. Al escribir, `onChange` recibe el evento y `evento.target.value` contiene el texto nuevo.

Los checkbox usan `checked` y `evento.target.checked`, porque su valor es verdadero o falso.

Usamos un objeto para los errores:

```js
const [erroresUnidad, setErroresUnidad] = useState({});
```

Podría contener `{ codigo: 'Este código ya existe.' }`. Cada campo muestra su propio mensaje. `CampoInventario` reúne la etiqueta, el control y su error. Recibe esos datos mediante **props**, que son los argumentos de un componente. Su prop `children` es el contenido escrito entre sus etiquetas.

## 4. Tercero: validar antes de guardar

En `inventarioUtils.js` están las reglas que no necesitan dibujar una pantalla.

La pregunta «¿este código ya existe?» nace de que cada unidad necesita identificarse de manera única:

```js
const repetidas = unidades.filter((unidad) => {
  return normalizarTexto(unidad.codigo) === normalizarTexto(codigo);
});

if (repetidas.length > 0) {
  errores.codigo = 'Este código ya está registrado.';
}
```

`filter()` reúne las coincidencias en otra lista. Si su `length` es mayor que cero, el código ya existe. `trim()` quita espacios de los extremos y `toLowerCase()` permite comparar sin distinguir mayúsculas. Por eso ` inv-001 ` y `INV-001` se consideran el mismo código.

Las validaciones devuelven un objeto. Si tiene errores, detenemos la función:

```js
const encontrados = validarUnidad(nuevoCodigo, nuevaUbicacion, unidades);
setErroresUnidad(encontrados);
if (Object.keys(encontrados).length > 0) return;
```

`Object.keys()` obtiene los nombres de las propiedades del objeto. Si hay al menos una, hay un campo que corregir. `return` termina la función antes de guardar.

Los formularios usan `onSubmit`. `evento.preventDefault()` evita que el navegador recargue la página al enviarlos. `noValidate` permite mostrar nuestros mensajes junto a los campos.

## 5. Cuarto: actualizar listas sin modificar las anteriores

Para agregar:

```js
setUnidades((anteriores) => [...anteriores, nuevaUnidad]);
```

`...anteriores` copia los elementos en una lista nueva y después agrega la nueva unidad. Esta forma de usar el setter recibe la lista más reciente disponible.

Para editar:

```js
setUnidades((anteriores) => {
  return anteriores.map((unidad) => {
    if (unidad.codigo === codigoBuscado) {
      return { ...unidad, estado: nuevoEstado };
    } else {
      return unidad;
    }
  });
});
```

`map()` crea una lista a partir de otra. Cuando encuentra la unidad buscada, devuelve una copia con el nuevo estado; para las demás devuelve el elemento original.

`...unidad` copia las propiedades del objeto. `estado: nuevoEstado`, escrito después, reemplaza esa propiedad. Usamos `if/else` para que cada decisión se pueda leer por separado.

Para eliminar usamos `filter()` para conservar los equipos que tengan otro ID. También quitamos las unidades del equipo eliminado, después de comprobar las asociaciones y pedir confirmación.

La idea común: cambiar los datos con los setters permite que React actualice la interfaz. No buscamos filas de HTML para modificarlas a mano.

## 6. Quinto: compartir y conservar datos

`InventarioProvider` envuelve la aplicación en `main.jsx`. Las pantallas llaman a `useInventario()` para leer el mismo estado mediante **Context**.

```text
InventarioProvider
  ├─ Inventario
  ├─ NuevoEquipo
  ├─ DetalleEquipo
  └─ FichaPublicaEquipo
```

El Context también calcula `equiposConConteo`. Si una unidad pasa de disponible a mantenimiento, los componentes reciben los contadores nuevos.

`useEffect` sincroniza el estado con `localStorage`:

```js
useEffect(() => {
  // Guardar equipos y unidades en el navegador.
}, [equipos, unidades]);
```

La lista del final indica de qué datos depende el efecto. Se ejecuta inicialmente y cuando cambia alguno de ellos.

`localStorage` guarda texto. `JSON.stringify()` convierte los datos a texto y `JSON.parse()` los recupera. `try/catch` captura fallos de lectura o escritura. Si no puede guardar, mostramos que los cambios podrían perderse al recargar.

Esto conserva datos en ese navegador y ese origen web; todavía no es una base de datos compartida entre personas.

## 7. Sexto: rutas y reutilización

`useParams()` lee el `id` de una ruta como `/encargado/equipo/1`. Llega como texto, por eso usamos `Number(id)` para compararlo con IDs numéricos.

`Link` cambia de pantalla mediante React Router. `useNavigate()` permite navegar desde una función, por ejemplo después de guardar.

La pestaña de condiciones depende de la dirección `/encargado/equipo/:id/condiciones`. Así funciona si la abres directamente o recargas. El historial usa `#historial` en la dirección.

La ficha pública de HU-2 está en `/equipos/:id`. Las páginas de HU-3 conservan su implementación independiente. La integración del catálogo con este inventario corresponde coordinarla con su responsable. La autenticación pertenece a HU-1.

`FotoEquipo` muestra una imagen o un mensaje si falta o falla. `ModalInventario` usa el elemento HTML `dialog`: el navegador controla el foco dentro del modal y permite cerrarlo con Escape. `useRef` conserva la referencia al elemento para abrirlo con `showModal()`.

## 8. Qué quedó implementado

| Requisito | Implementación |
| --- | --- |
| Registrar y editar equipo | Campos obligatorios, marca/modelo únicos, descripción hasta 400 caracteres, accesorios y fotografías por enlaces |
| Eliminar equipo | Confirmación y comprobación de préstamos/solicitudes asociados; elimina también sus unidades |
| Registrar unidades | Código único en todo el inventario, ubicación obligatoria y observaciones opcionales |
| Estados | Transiciones manuales controladas, motivo obligatorio, confirmación de baja e historial con fecha |
| Condiciones | Días enteros positivos, penalidad válida, autorización, renovación, vista previa y descarte |
| Listado | Categoría, estado, disponibilidad, búsqueda por código/nombre/modelo, contadores y páginas de 8 |
| Ficha pública | Datos actuales, galería, accesorios, condiciones y unidades del equipo correspondiente |
| Experiencia | Errores junto al campo, avisos de resultado, estados vacíos, tablas desplazables y ajustes para anchos pequeños |
| Borradores | Guardado y recuperación por formulario, incluyendo el accesorio pendiente de agregar |

## 9. Decisiones que el grupo debe conocer

- El DOCX pide fotografías, pero excluye carga de archivos. Usamos enlaces a imágenes. Una dirección válida no garantiza que el servidor externo entregue una imagen; existe un mensaje de respaldo.
- El DOCX pide interfaz responsiva y el PDF presenta solo escritorio. Agregamos adaptación básica para anchos pequeños; falta revisarla visualmente en navegador.
- El documento enumera estados, pero no define una matriz exacta de transiciones. Implementamos esta propuesta: disponible → mantenimiento/baja; mantenimiento → disponible/baja; prestada requiere devolución; baja es definitiva. HU-4 y HU-5 deben gestionar entrega/devolución y respetar el contrato compartido.
- Para no borrar referencias, bloqueamos la eliminación cuando los datos disponibles muestran solicitudes o préstamos asociados. Las solicitudes actuales identifican al equipo por nombre; al integrar el backend, conviene acordar un `equipoId` estable con el grupo.
- Alcance acordado: trabajamos únicamente en HU-2 y en los archivos compartidos necesarios. HU-1, HU-3, HU-4 y HU-5 conservan sus archivos originales; su integración corresponde coordinarla con sus responsables.
- `datos.js` contiene solo seis unidades reales. Los totales anteriores de los modelos eran números fijos que no coincidían con ellas. Ahora algunos modelos muestran cero unidades en el inventario y la ficha pública de HU-2. El catálogo de HU-3 conserva sus datos actuales hasta que su responsable integre el inventario. No inventamos unidades para completar esos contadores.
- La protección de rutas por rol sigue siendo responsabilidad de HU-1. Un diseño de panel no sustituye la autenticación.

## 10. Primera práctica: seguir una unidad de principio a fin

1. Ejecuta `npm run dev` y abre la dirección que muestre Vite.
2. Entra a `/encargado/inventario` y abre «Unidades» del osciloscopio.
3. Pulsa «Nueva unidad» e intenta guardar vacío: deben aparecer dos errores.
4. Escribe un código existente, incluso en minúsculas: debe rechazarlo.
5. Usa un código nuevo, escribe una ubicación y guarda: debe aparecer la unidad y el aviso.
6. Abre su cambio de estado, selecciona mantenimiento e intenta guardar sin motivo.
7. Escribe el motivo y guarda. Revisa «Historial» y luego «Ver ficha pública».
8. Comprueba que bajó el número de disponibles. Recarga y confirma que el cambio continúa.

Observa en el código esta cadena: evento del botón → función → validación → setter → render actualizado → efecto que guarda en el navegador.

## 11. Prácticas siguientes, una por una

- **Equipo:** crea uno con marca/modelo nuevos; edítalo y verifica que no desaparecen sus condiciones. Intenta repetir marca y modelo en otro equipo.
- **Accesorios:** intenta agregar vacío o repetido. Agrega dos y quita uno. Guarda y consulta la ficha.
- **Fotografías:** prueba una URL de imagen y un texto inválido. Usa una URL válida que no entregue imagen para comprobar el mensaje de respaldo.
- **Condiciones:** prueba cero días, días decimales y penalidad negativa. Luego guarda valores válidos. Modifica algo y pulsa «Descartar».
- **Borrador:** escribe datos, guarda el borrador, sal del formulario, vuelve y cárgalo. No debe aparecer en inventario antes de guardar el equipo.
- **Filtros:** busca por código, combina categoría y estado, y limpia los filtros. Con más de ocho equipos comprueba la paginación.
- **Baja:** usa una unidad de prueba. Cancela primero la confirmación y verifica que no cambió. Confirma después y revisa el historial.
- **Eliminar:** crea un equipo de prueba sin solicitudes ni préstamos. Cancela primero y luego confirma. Comprueba que también desaparecen sus unidades. Intenta eliminar un equipo con préstamo: debe explicar el bloqueo.
- **Rutas:** abre directamente una dirección de condiciones y una ficha pública. Prueba un ID inexistente.

Los cambios de estas prácticas afectan el inventario de tu navegador. Usa datos de prueba nuevos para eliminar y dar de baja.

## 12. Comprobaciones automatizadas

```sh
node --test tests/hu2.test.js
npm run build
```

Las pruebas cubren contadores, aislamiento de equipos, códigos únicos, transiciones, números inválidos, duplicados de modelo, fotografías y restricciones de eliminación.

También se comprobó la generación del contenido de las rutas principales, los IDs inexistentes, el inventario vacío y la recuperación desde JSON inválido. Esa comprobación no simula clics ni confirma el aspecto visual. Las prácticas anteriores quedan como recorrido de navegador.
