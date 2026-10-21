// localStorage solo conserva texto. JSON transforma listas y objetos a texto y viceversa.
export function leerObjeto(clave, inicial) {
  try {
    const valor = JSON.parse(localStorage.getItem(clave));
    if (valor && typeof valor === 'object' && !Array.isArray(valor)) return valor;
  } catch {
    // Si el texto está dañado, usamos los datos iniciales sin borrar otras claves.
  }
  return inicial;
}
