// Reglas compartidas: JavaScript normal, sin componentes ni cambios de estado.
export function hoyISO() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Lima' });
}

export function fechaValida(fecha) {
  if (typeof fecha !== 'string' || fecha.length !== 10) return false;
  const partes = fecha.split('-');
  if (partes.length !== 3) return false;
  const tiempo = Date.UTC(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  if (!Number.isFinite(tiempo)) return false;
  return new Date(tiempo).toISOString().slice(0, 10) === fecha;
}

export function diasEntre(inicio, fin) {
  if (!fechaValida(inicio) || !fechaValida(fin)) return NaN;
  // UTC evita que los cambios de horario alteren la cantidad de días calendario.
  return (new Date(fin + 'T00:00:00Z') - new Date(inicio + 'T00:00:00Z')) / 86400000;
}

export function sumarDias(fecha, dias) {
  return new Date(new Date(fecha + 'T00:00:00Z').getTime() + dias * 86400000).toISOString().slice(0, 10);
}

export function mostrarFecha(fecha) {
  if (!fecha) return '—';
  const partes = fecha.slice(0, 10).split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

export function rangosCruzan(inicio, fin, otroInicio, otroFin) {
  return inicio <= otroFin && fin >= otroInicio;
}

export function unidadesDisponibles(equipoId, inicio, fin, unidades, solicitudes, prestamos, excluirCodigo = '') {
  return unidades.filter((unidad) => {
    if (unidad.equipoId !== Number(equipoId) || unidad.estado !== 'Disponible') return false;
    for (const solicitud of solicitudes) {
      if (solicitud.codigo !== excluirCodigo && solicitud.estado === 'Aprobada' && solicitud.unidad === unidad.codigo && rangosCruzan(inicio, fin, solicitud.inicio, solicitud.fin)) return false;
    }
    for (const prestamo of prestamos) {
      if (prestamo.codigo !== excluirCodigo && prestamo.estado === 'Activo' && prestamo.unidad === unidad.codigo) return false;
    }
    return true;
  });
}

export function validarSolicitud(datos, equipo, disponibles, hoy = hoyISO()) {
  const errores = {};
  if (!fechaValida(datos.inicio) || datos.inicio < hoy) errores.inicio = 'Selecciona hoy o una fecha futura.';
  if (!fechaValida(datos.fin) || datos.fin <= datos.inicio) errores.fin = 'La devolución debe ser posterior al inicio.';
  if (equipo && diasEntre(datos.inicio, datos.fin) > equipo.duracion) errores.fin = 'La duración máxima es de ' + equipo.duracion + ' días.';
  if (!datos.curso.trim()) errores.curso = 'Selecciona el curso asociado.';
  if (datos.motivo.trim().length < 20) errores.motivo = 'Explica el motivo con al menos 20 caracteres.';
  if (!datos.acepta) errores.acepta = 'Debes aceptar las condiciones del préstamo.';
  if (fechaValida(datos.inicio) && fechaValida(datos.fin) && disponibles.length === 0) errores.disponibilidad = 'No hay unidades disponibles para ese rango. Prueba otras fechas o equipo.';
  return errores;
}

export function calcularPenalidad(fin, retorno, tarifa) {
  const retraso = Math.max(0, diasEntre(fin, retorno));
  return { retraso, penalidad: Number((retraso * tarifa).toFixed(2)) };
}

export function motivoNoRenovar(prestamo, equipo, solicitudes, hoy = hoyISO()) {
  if (!prestamo || prestamo.estado !== 'Activo') return 'El préstamo ya no está activo.';
  if (!equipo || !equipo.renovacion) return 'Este equipo no admite renovación.';
  if (prestamo.renovaciones >= 1) return 'Este préstamo ya fue renovado una vez.';
  if (prestamo.fin < hoy) return 'Un préstamo vencido no puede renovarse.';
  for (const solicitud of solicitudes) {
    if (solicitud.equipoId === prestamo.equipoId && solicitud.codigo !== prestamo.codigo && (solicitud.estado === 'Enviada' || solicitud.estado === 'Aprobada')) return 'Existe una solicitud pendiente para este equipo.';
  }
  return '';
}
