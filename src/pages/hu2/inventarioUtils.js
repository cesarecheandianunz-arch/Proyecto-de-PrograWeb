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

export function codigoInventarioValido(codigo) {
  // Ejemplo: INV-OSC-0047 se separa en ['INV', 'OSC', '0047'].
  const partes = codigo.trim().toUpperCase().split('-');

  if (partes.length !== 3) {
    return false;
  }
  if (partes[0] !== 'INV' || partes[1].length !== 3 || partes[2].length !== 4) {
    return false;
  }

  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const letra of partes[1]) {
    if (!letras.includes(letra)) {
      return false;
    }
  }

  const numeros = '0123456789';
  for (const digito of partes[2]) {
    if (!numeros.includes(digito)) {
      return false;
    }
  }

  return true;
}

export function validarUnidad(codigo, ubicacion, unidades) {
  const errores = {};
  const repetidas = unidades.filter((unidad) => {
    return normalizarTexto(unidad.codigo) === normalizarTexto(codigo);
  });

  if (codigo.trim() === '') {
    errores.codigo = 'Ingresa el código de inventario.';
  } else if (!codigoInventarioValido(codigo)) {
    errores.codigo = 'Usa el formato INV-XXX-0000: tres letras y cuatro números. Ejemplo: INV-OSC-0047.';
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
  // Las imágenes seleccionadas con FileReader se guardan como texto de imagen.
  if (url.startsWith('data:image/png;base64,') || url.startsWith('data:image/jpeg;base64,')) {
    return url.length <= 800050;
  }
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

export function impedimentoEliminar(equipo, unidades, solicitudes, prestamos, equiposIniciales = []) {
  const propias = unidades.filter((unidad) => unidad.equipoId === equipo.id);

  for (const unidad of propias) {
    const tienePrestamo = unidad.prestamo && unidad.prestamo !== '—';
    if (unidad.estado === 'Prestada' || tienePrestamo) {
      return 'No se puede eliminar: hay unidades con un préstamo vigente.';
    }
  }

  // El ID identifica al equipo aunque su nombre cambie.
  // Los datos antiguos solo guardaban el nombre: consultamos también su nombre inicial.
  const equipoInicial = equiposIniciales.find((inicial) => inicial.id === equipo.id);
  const solicitudesEquipo = solicitudes.filter((solicitud) => {
    if (solicitud.equipoId !== undefined && solicitud.equipoId !== null) {
      return Number(solicitud.equipoId) === equipo.id;
    }
    if (solicitud.equipo === equipo.nombre) {
      return true;
    }
    if (equipoInicial && solicitud.equipo === equipoInicial.nombre) {
      return true;
    }
    return false;
  });

  const prestamosEquipo = prestamos.filter((prestamo) => {
    return Number(prestamo.equipoId) === equipo.id;
  });
  let tieneHistorial = false;
  for (const unidad of propias) {
    const prestamosUnidad = prestamos.filter((prestamo) => prestamo.unidad === unidad.codigo);
    if (prestamosUnidad.length > 0) {
      tieneHistorial = true;
    }
  }

  if (solicitudesEquipo.length > 0 || prestamosEquipo.length > 0 || tieneHistorial) {
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
    errores.fotografias = 'Selecciona imágenes JPG/PNG o usa direcciones http:// o https:// válidas.';
  }
  if (datos.fotografias.length > 3) errores.fotografias = 'Conserva como máximo tres fotografías por equipo.';
  return errores;
}
