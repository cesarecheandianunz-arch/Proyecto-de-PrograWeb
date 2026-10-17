// Funciones de HU-2: reciben datos y devuelven resultados, sin dibujar pantallas.
export const estadosUnidad = ['Disponible', 'Prestada', 'Mantenimiento', 'Dada de baja'];

export function normalizarTexto(texto) {
  return texto.trim().toLowerCase();
}

export function contarUnidades(equipo, unidades) {
  const propias = unidades.filter((unidad) => unidad.equipoId === equipo.id);
  const disponibles = propias.filter((unidad) => unidad.estado === 'Disponible');
  const prestadas = propias.filter((unidad) => unidad.estado === 'Prestada');
  const mantenimiento = propias.filter((unidad) => unidad.estado === 'Mantenimiento');
  const bajas = propias.filter((unidad) => unidad.estado === 'Dada de baja');

  return {
    ...equipo,
    total: propias.length,
    libres: disponibles.length,
    prestadas: prestadas.length,
    mantenimiento: mantenimiento.length,
    baja: bajas.length,
  };
}

// Entregar y devolver una unidad corresponde a HU-4 y HU-5.
// En esta propuesta, una baja se considera definitiva.
export function estadosPermitidos(unidad) {
  if (unidad.prestamo && unidad.prestamo !== '—') {
    return [];
  }

  if (unidad.estado === 'Disponible') {
    return ['Mantenimiento', 'Dada de baja'];
  } else if (unidad.estado === 'Mantenimiento') {
    return ['Disponible', 'Dada de baja'];
  } else {
    return [];
  }
}

export function validarUnidad(codigo, ubicacion, unidades) {
  const errores = {};
  const repetidas = unidades.filter((unidad) => {
    return normalizarTexto(unidad.codigo) === normalizarTexto(codigo);
  });

  if (codigo.trim() === '') {
    errores.codigo = 'Ingresa el código de inventario.';
  } else if (repetidas.length > 0) {
    errores.codigo = 'Este código ya está registrado en el inventario.';
  }

  if (ubicacion.trim() === '') {
    errores.ubicacion = 'Ingresa la ubicación.';
  }
  return errores;
}

export function validarCondiciones(duracion, penalidad) {
  const errores = {};
  const dias = Number(duracion);
  const monto = Number(penalidad);

  // Extra: isInteger comprueba que sea un número entero, sin decimales.
  if (String(duracion).trim() === '' || !Number.isInteger(dias) || dias <= 0) {
    errores.duracion = 'Ingresa una cantidad entera de días mayor que cero.';
  }
  // Extra: isFinite rechaza NaN e Infinity, que no son montos válidos.
  if (String(penalidad).trim() === '' || !Number.isFinite(monto) || monto < 0) {
    errores.penalidad = 'Ingresa una penalidad válida, mayor o igual a cero.';
  }
  return errores;
}

export function fotoValida(url) {
  // Extra: URL interpreta la dirección; si no tiene formato válido, entra al catch.
  try {
    const direccion = new URL(url);
    if (direccion.protocol === 'http:' || direccion.protocol === 'https:') {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

export function impedimentoEliminar(equipo, unidades, solicitudes, prestamos) {
  const propias = unidades.filter((unidad) => unidad.equipoId === equipo.id);

  for (const unidad of propias) {
    const tienePrestamo = unidad.prestamo && unidad.prestamo !== '—';
    if (unidad.estado === 'Prestada' || tienePrestamo) {
      return 'No se puede eliminar: hay unidades con un préstamo vigente.';
    }
  }

  // Consultamos las otras historias, conservando sus datos sin cambios.
  const solicitudesEquipo = solicitudes.filter((solicitud) => solicitud.equipo === equipo.nombre);
  let tieneHistorial = false;
  for (const unidad of propias) {
    const prestamosUnidad = prestamos.filter((prestamo) => prestamo.unidad === unidad.codigo);
    if (prestamosUnidad.length > 0) {
      tieneHistorial = true;
    }
  }

  if (solicitudesEquipo.length > 0 || tieneHistorial) {
    return 'No se puede eliminar: este equipo tiene solicitudes o préstamos asociados. Conserva su historial dando de baja las unidades cuando corresponda.';
  }
  return '';
}

export function validarEquipo(datos, equipos, id) {
  const errores = {};
  const obligatorios = ['nombre', 'categoria', 'marca', 'modelo'];
  for (const campo of obligatorios) {
    if (datos[campo].trim() === '') {
      errores[campo] = 'Este campo es obligatorio.';
    }
  }

  if (datos.descripcion.length > 400) {
    errores.descripcion = 'Máximo 400 caracteres.';
  }

  const repetidos = equipos.filter((equipo) => {
    const esOtroEquipo = equipo.id !== Number(id);
    const mismaMarca = normalizarTexto(equipo.marca) === normalizarTexto(datos.marca);
    const mismoModelo = normalizarTexto(equipo.modelo) === normalizarTexto(datos.modelo);
    return esOtroEquipo && mismaMarca && mismoModelo;
  });
  if (repetidos.length > 0) {
    errores.modelo = 'Ya existe un equipo con esta marca y modelo.';
  }

  const fotosInvalidas = datos.fotografias.filter((url) => fotoValida(url) === false);
  if (fotosInvalidas.length > 0) {
    errores.fotografias = 'Cada fotografía debe tener una dirección http:// o https:// válida.';
  }
  return errores;
}
