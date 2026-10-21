// Completa una sola vez los datos de ejemplo; conserva las ediciones del usuario.
export function completarEquiposIniciales(guardados, iniciales) {
  return guardados.map((equipo) => {
    const inicial = iniciales.find((e) => e.id === equipo.id && e.marca === equipo.marca && e.modelo === equipo.modelo);
    if (!inicial) return equipo;
    const cambios = {};
    if (!Array.isArray(equipo.fotografias) || equipo.fotografias.length === 0) cambios.fotografias = inicial.fotografias;
    if (!equipo.descripcion || equipo.descripcion === 'Equipo para prácticas y proyectos académicos. Recojo y devolución en Almacén H-102.') cambios.descripcion = inicial.descripcion;
    return { ...equipo, ...cambios };
  });
}
