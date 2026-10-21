import { hoyISO, fechaValida, sumarDias, unidadesDisponibles, validarSolicitud, calcularPenalidad, motivoNoRenovar } from './prestamos.js';

// Cada función recibe el estado anterior y devuelve una copia o un error.
// Las reglas usan objetos, arreglos, if/else y funciones.
function cambiarSolicitud(datos, codigo, cambios) {
  return datos.solicitudes.map((solicitud) => {
    if (solicitud.codigo === codigo) return { ...solicitud, ...cambios };
    return solicitud;
  });
}

export function crearSolicitud(datos, formulario, equipos, unidades) {
  const equipo = equipos.find((e) => e.id === Number(formulario.equipoId));
  const estudiante = datos.estudiantes.find((e) => e.id === formulario.estudianteId);
  if (!equipo || !estudiante) return { error: 'No se encontró el equipo o estudiante.' };
  if (estudiante.deuda > 0 || estudiante.bloqueada) return { error: 'Regulariza tu deuda o bloqueo antes de solicitar.' };
  const disponibles = unidadesDisponibles(equipo.id, formulario.inicio, formulario.fin, unidades, datos.solicitudes, datos.prestamos);
  const errores = validarSolicitud(formulario, equipo, disponibles);
  if (Object.keys(errores).length > 0) return { error: 'Revisa los campos marcados.', errores };
  let numero = 0;
  for (const solicitud of datos.solicitudes) {
    const valor = Number(solicitud.codigo.split('-')[2]);
    if (valor > numero) numero = valor;
  }
  let numeroTexto = String(numero + 1);
  while (numeroTexto.length < 4) numeroTexto = '0' + numeroTexto;
  const codigo = 'PRE-' + hoyISO().slice(0, 4) + '-' + numeroTexto;
  const solicitud = {
    codigo, equipoId: equipo.id, equipo: equipo.nombre, estudianteId: estudiante.id,
    estudiante: estudiante.nombre, carrera: estudiante.carrera, curso: formulario.curso.trim(),
    motivo: formulario.motivo.trim(), inicio: formulario.inicio, fin: formulario.fin,
    estado: 'Enviada', unidad: 'Pendiente de asignar', creada: hoyISO(), hace: 'Ahora', motivoRechazo: '',
  };
  return { datos: { ...datos, solicitudes: [...datos.solicitudes, solicitud] }, codigo };
}

export function retirarSolicitud(datos, codigo, estudianteId) {
  const solicitud = datos.solicitudes.find((s) => s.codigo === codigo);
  if (!solicitud || solicitud.estudianteId !== estudianteId || solicitud.estado !== 'Enviada') return { error: 'Solo puedes retirar tus solicitudes pendientes.' };
  return { datos: { ...datos, solicitudes: cambiarSolicitud(datos, codigo, { estado: 'Retirada' }) } };
}

export function aprobarSolicitud(datos, codigo, unidadCodigo, equipos, unidades, autorizacion) {
  const solicitud = datos.solicitudes.find((s) => s.codigo === codigo);
  if (!solicitud || solicitud.estado !== 'Enviada') return { error: 'La solicitud ya fue resuelta.' };
  const equipo = equipos.find((e) => e.id === solicitud.equipoId);
  const estudiante = datos.estudiantes.find((e) => e.id === solicitud.estudianteId);
  if (!equipo || !estudiante) return { error: 'No se encontró el equipo o estudiante.' };
  if (estudiante.deuda > 0 || estudiante.bloqueada) return { error: 'No se puede aprobar: el estudiante tiene deuda o está bloqueado.' };
  if (solicitud.fin < hoyISO()) return { error: 'El rango solicitado ya terminó. El estudiante debe enviar una solicitud nueva.' };
  if (equipo.autorizacion && !autorizacion) return { error: 'Confirma que se recibió la autorización del docente.' };
  const libres = unidadesDisponibles(equipo.id, solicitud.inicio, solicitud.fin, unidades, datos.solicitudes, datos.prestamos);
  if (libres.filter((u) => u.codigo === unidadCodigo).length === 0) return { error: 'Selecciona una unidad disponible del equipo en ese rango.' };
  return { datos: { ...datos, solicitudes: cambiarSolicitud(datos, codigo, { estado: 'Aprobada', unidad: unidadCodigo, autorizacion: Boolean(autorizacion) }) } };
}

export function rechazarSolicitud(datos, codigo, motivo) {
  const solicitud = datos.solicitudes.find((s) => s.codigo === codigo);
  if (!solicitud || solicitud.estado !== 'Enviada') return { error: 'La solicitud ya fue resuelta.' };
  if (!motivo.trim()) return { error: 'Indica el motivo del rechazo.' };
  return { datos: { ...datos, solicitudes: cambiarSolicitud(datos, codigo, { estado: 'Rechazada', motivoRechazo: motivo.trim() }) } };
}

export function registrarEntrega(datos, codigo, formulario, equipos, unidades) {
  const solicitud = datos.solicitudes.find((s) => s.codigo === codigo);
  if (!solicitud || solicitud.estado !== 'Aprobada') return { error: 'Selecciona una solicitud aprobada que aún no se haya entregado.' };
  const equipo = equipos.find((e) => e.id === solicitud.equipoId);
  const estudiante = datos.estudiantes.find((e) => e.id === solicitud.estudianteId);
  if (!equipo || !estudiante || estudiante.deuda > 0 || estudiante.bloqueada) return { error: 'El equipo no existe o el estudiante tiene deuda o bloqueo.' };
  const dia = formulario.fecha.slice(0, 10);
  if (!fechaValida(dia) || formulario.fecha.length !== 16 || dia > hoyISO() || dia < solicitud.inicio || dia > solicitud.fin) return { error: 'La entrega debe estar dentro del rango aprobado y no puede ser futura.' };
  // Aprobar para una fecha futura no equivale a tener físicamente la unidad hoy.
  const unidad = unidades.find((u) => u.codigo === solicitud.unidad);
  if (!unidad || unidad.estado !== 'Disponible' || (unidad.prestamo && unidad.prestamo !== '—')) return { error: 'La unidad debe haber sido devuelta y estar disponible antes de registrar otra entrega.' };
  const disponibles = unidadesDisponibles(equipo.id, dia, solicitud.fin, unidades, datos.solicitudes, datos.prestamos, codigo);
  if (disponibles.filter((u) => u.codigo === solicitud.unidad).length === 0) return { error: 'La unidad ya no está disponible. Revisa la asignación.' };
  const prestamo = {
    ...solicitud, estado: 'Activo', fechaEntrega: formulario.fecha,
    accesorios: formulario.accesorios, observaciones: formulario.observaciones.trim(),
    tarifa: equipo.penalidad ?? 15, renovaciones: 0,
  };
  return {
    datos: { ...datos, solicitudes: cambiarSolicitud(datos, codigo, { estado: 'Entregada' }), prestamos: [...datos.prestamos, prestamo] },
    unidad: { codigo: solicitud.unidad, estado: 'Prestada', prestamo: codigo },
  };
}

export function registrarDevolucion(datos, codigo, formulario) {
  const prestamo = datos.prestamos.find((p) => p.codigo === codigo);
  if (!prestamo || prestamo.estado !== 'Activo') return { error: 'El préstamo no está activo o ya fue devuelto.' };
  if (!fechaValida(formulario.fecha) || formulario.fecha < prestamo.fechaEntrega.slice(0, 10) || formulario.fecha > hoyISO()) return { error: 'La fecha de retorno debe estar entre la entrega y hoy.' };
  const faltantes = formulario.accesorios.filter((a) => !a.devuelto);
  if (formulario.estadoRetorno === 'Faltantes' && faltantes.length === 0) return { error: 'Marca al menos un accesorio faltante.' };
  if (formulario.estadoRetorno === 'Sin novedades' && faltantes.length > 0) return { error: 'Hay accesorios sin devolver: selecciona «Faltantes» o revisa la lista.' };
  if ((formulario.estadoRetorno === 'Con daños' || faltantes.length > 0) && !formulario.descripcion.trim()) return { error: 'Describe los daños o accesorios faltantes.' };
  const calculo = calcularPenalidad(prestamo.fin, formulario.fecha, prestamo.tarifa);
  let estado = 'Disponible';
  if (formulario.mantenimiento || formulario.estadoRetorno === 'Con daños') estado = 'Mantenimiento';
  const prestamos = datos.prestamos.map((p) => {
    if (p.codigo === codigo) return { ...p, estado: 'Devuelto', devolucion: { ...formulario, ...calculo }, penalidadPagada: calculo.penalidad === 0 };
    return p;
  });
  const estudiantes = datos.estudiantes.map((e) => {
    if (e.id === prestamo.estudianteId) return { ...e, deuda: Number((e.deuda + calculo.penalidad).toFixed(2)) };
    return e;
  });
  return {
    datos: { ...datos, prestamos, estudiantes, solicitudes: cambiarSolicitud(datos, codigo, { estado: 'Devuelta' }) },
    unidad: { codigo: prestamo.unidad, estado, prestamo: '—', observacion: formulario.descripcion.trim() || 'Devuelta sin novedades' },
    calculo,
  };
}

export function renovarPrestamo(datos, codigo, equipos) {
  const prestamo = datos.prestamos.find((p) => p.codigo === codigo);
  let equipo;
  if (prestamo) equipo = equipos.find((e) => e.id === prestamo.equipoId);
  const impedimento = motivoNoRenovar(prestamo, equipo, datos.solicitudes);
  if (impedimento) return { error: impedimento };
  const estudiante = datos.estudiantes.find((e) => e.id === prestamo.estudianteId);
  if (estudiante.deuda > 0 || estudiante.bloqueada) return { error: 'El estudiante tiene deuda o bloqueo.' };
  const fin = sumarDias(prestamo.fin, equipo.duracion);
  const prestamos = datos.prestamos.map((p) => {
    if (p.codigo === codigo) return { ...p, fin, renovaciones: p.renovaciones + 1 };
    return p;
  });
  return { datos: { ...datos, prestamos, solicitudes: cambiarSolicitud(datos, codigo, { fin }) } };
}
