import test from 'node:test';
import assert from 'node:assert/strict';
import { equipos, unidades } from '../src/datos.js';
import { crearOperacionesIniciales } from '../src/data/prestamosIniciales.js';
import { crearSolicitud, aprobarSolicitud, rechazarSolicitud, retirarSolicitud, registrarEntrega, registrarDevolucion, renovarPrestamo } from '../src/utils/operaciones.js';
import { hoyISO, sumarDias, diasEntre, fechaValida, unidadesDisponibles, calcularPenalidad } from '../src/utils/prestamos.js';
import { validarRegistro } from '../src/utils/cuenta.js';

function escenario() {
  const equipo = { id: 99, nombre: 'Equipo de prueba', duracion: 7, autorizacion: true, renovacion: true, penalidad: 20 };
  const unidades = [{ codigo: 'INV-TST-0001', equipoId: 99, estado: 'Disponible', prestamo: '—' }];
  const estudiante = { id: 'prueba', nombre: 'Estudiante de prueba', carrera: 'Ingeniería', deuda: 0, bloqueada: false };
  const datos = { solicitudes: [], prestamos: [], estudiantes: [estudiante] };
  const formulario = { equipoId: 99, estudianteId: 'prueba', inicio: hoyISO(), fin: sumarDias(hoyISO(), 3), curso: 'Programación Web', motivo: 'Práctica académica de integración de equipos.', acepta: true };
  return { equipo, unidades, datos, formulario };
}

test('datos semilla: préstamos y unidades tienen referencias coherentes', () => {
  const datos = crearOperacionesIniciales(unidades, equipos);
  assert.equal(new Set(unidades.map((u) => u.codigo)).size, unidades.length);
  for (const unidad of unidades) assert.ok(equipos.find((e) => e.id === unidad.equipoId));
  for (const prestamo of datos.prestamos) {
    const unidad = unidades.find((u) => u.codigo === prestamo.unidad);
    assert.equal(unidad.equipoId, prestamo.equipoId);
    assert.ok(datos.solicitudes.find((s) => s.codigo === prestamo.codigo));
    assert.ok(fechaValida(prestamo.fin));
    if (prestamo.estado === 'Activo') assert.equal(unidad.prestamo, prestamo.codigo);
  }
  for (const estudiante of datos.estudiantes) {
    let deuda = 0;
    for (const prestamo of datos.prestamos) {
      if (prestamo.estudianteId === estudiante.id && prestamo.devolucion && !prestamo.penalidadPagada) deuda += prestamo.devolucion.penalidad;
    }
    assert.equal(estudiante.deuda, deuda);
  }
});

test('fechas: años bisiestos, rangos y penalidad con tarifa cero', () => {
  assert.equal(fechaValida('2028-02-29'), true);
  assert.equal(fechaValida('2026-02-29'), false);
  assert.equal(fechaValida('2026-13-01'), false);
  assert.equal(diasEntre('2026-10-20', '2026-10-27'), 7);
  assert.deepEqual(calcularPenalidad('2026-10-20', '2026-10-23', 20), { retraso: 3, penalidad: 60 });
  assert.deepEqual(calcularPenalidad('2026-10-20', '2026-10-23', 0), { retraso: 3, penalidad: 0 });
});

test('solicitud: rechaza fechas, duración, motivo corto, curso y aceptación', () => {
  const { equipo, unidades, datos, formulario } = escenario();
  const resultado = crearSolicitud(datos, { ...formulario, fin: sumarDias(formulario.inicio, 8), curso: '', motivo: 'corto', acepta: false }, [equipo], unidades);
  for (const campo of ['fin', 'curso', 'motivo', 'acepta']) assert.ok(resultado.errores[campo]);
  assert.ok(crearSolicitud(datos, { ...formulario, inicio: sumarDias(hoyISO(), -1) }, [equipo], unidades).errores.inicio);
  assert.equal(datos.solicitudes.length, 0);
});

test('recorrido completo: crear, aprobar, entregar, devolver y preservar historial', () => {
  const { equipo, unidades, datos, formulario } = escenario();
  let resultado = crearSolicitud(datos, formulario, [equipo], unidades);
  const codigo = resultado.codigo;
  assert.ok(codigo);
  assert.equal(resultado.datos.solicitudes[0].estado, 'Enviada');
  resultado = aprobarSolicitud(resultado.datos, codigo, unidades[0].codigo, [equipo], unidades, true);
  assert.equal(resultado.datos.solicitudes[0].unidad, unidades[0].codigo);
  assert.ok(retirarSolicitud(resultado.datos, codigo, 'prueba').error);
  assert.equal(unidadesDisponibles(99, formulario.inicio, formulario.fin, unidades, resultado.datos.solicitudes, []).length, 0);
  const entrega = registrarEntrega(resultado.datos, codigo, { fecha: hoyISO() + 'T09:00', accesorios: [{ nombre: 'Cable', entregado: true }], observaciones: 'Operativo' }, [equipo], unidades);
  assert.equal(entrega.unidad.estado, 'Prestada');
  assert.equal(entrega.datos.prestamos[0].tarifa, 20);
  assert.ok(registrarEntrega(entrega.datos, codigo, { fecha: hoyISO() + 'T09:00' }, [equipo], unidades).error);
  const devolucion = registrarDevolucion(entrega.datos, codigo, { fecha: hoyISO(), accesorios: [{ nombre: 'Cable', devuelto: true }], estadoRetorno: 'Sin novedades', descripcion: '', mantenimiento: false });
  assert.equal(devolucion.unidad.estado, 'Disponible');
  assert.equal(devolucion.datos.solicitudes[0].estado, 'Devuelta');
  assert.equal(devolucion.datos.prestamos[0].estado, 'Devuelto');
  assert.equal(devolucion.calculo.penalidad, 0);
  assert.ok(registrarDevolucion(devolucion.datos, codigo, {}).error);
  assert.equal(JSON.parse(JSON.stringify(devolucion.datos)).prestamos[0].observaciones, 'Operativo');
});

test('aprobación: exige autorización, estudiante habilitado y unidad correcta', () => {
  const { equipo, unidades, datos, formulario } = escenario();
  const creada = crearSolicitud(datos, formulario, [equipo], unidades);
  assert.ok(aprobarSolicitud(creada.datos, creada.codigo, unidades[0].codigo, [equipo], unidades, false).error);
  assert.ok(aprobarSolicitud(creada.datos, creada.codigo, 'INV-OTR-0001', [equipo], unidades, true).error);
  const conDeuda = { ...creada.datos, estudiantes: [{ ...datos.estudiantes[0], deuda: 45 }] };
  assert.ok(aprobarSolicitud(conDeuda, creada.codigo, unidades[0].codigo, [equipo], unidades, true).error);
});

test('dos solicitudes no pueden recibir la misma unidad en fechas superpuestas', () => {
  const { equipo, unidades, datos, formulario } = escenario();
  let resultado = crearSolicitud(datos, formulario, [equipo], unidades);
  const primero = resultado.codigo;
  resultado = crearSolicitud(resultado.datos, formulario, [equipo], unidades);
  const segundo = resultado.codigo;
  const aprobada = aprobarSolicitud(resultado.datos, primero, unidades[0].codigo, [equipo], unidades, true);
  assert.ok(aprobarSolicitud(aprobada.datos, segundo, unidades[0].codigo, [equipo], unidades, true).error);
  assert.equal(unidadesDisponibles(99, sumarDias(formulario.fin, 1), sumarDias(formulario.fin, 3), unidades, aprobada.datos.solicitudes, []).length, 1);
});

test('retiro y rechazo quedan compartidos y no eliminan su registro', () => {
  const { equipo, unidades, datos, formulario } = escenario();
  const creada = crearSolicitud(datos, formulario, [equipo], unidades);
  assert.ok(retirarSolicitud(creada.datos, creada.codigo, 'otro').error);
  assert.equal(retirarSolicitud(creada.datos, creada.codigo, 'prueba').datos.solicitudes[0].estado, 'Retirada');
  assert.ok(rechazarSolicitud(creada.datos, creada.codigo, ' ').error);
  const rechazada = rechazarSolicitud(creada.datos, creada.codigo, 'Falta autorización');
  assert.equal(rechazada.datos.solicitudes[0].motivoRechazo, 'Falta autorización');
});

test('devolución tardía con daño actualiza deuda y deriva a mantenimiento', () => {
  const { equipo, datos } = escenario();
  const prestamo = { codigo: 'PRE-2026-0010', equipoId: 99, unidad: 'INV-TST-0001', estudianteId: 'prueba', estado: 'Activo', fechaEntrega: sumarDias(hoyISO(), -7) + 'T09:00', fin: sumarDias(hoyISO(), -3), tarifa: 20, accesorios: [] };
  const estado = { ...datos, prestamos: [prestamo], solicitudes: [{ ...prestamo, estado: 'Entregada' }] };
  const formulario = { fecha: hoyISO(), accesorios: [], estadoRetorno: 'Con daños', descripcion: 'Pantalla dañada', mantenimiento: false };
  assert.ok(registrarDevolucion(estado, prestamo.codigo, { ...formulario, descripcion: '' }).error);
  assert.ok(registrarDevolucion(estado, prestamo.codigo, { ...formulario, fecha: sumarDias(hoyISO(), 1) }).error);
  const resultado = registrarDevolucion(estado, prestamo.codigo, formulario);
  assert.equal(resultado.calculo.penalidad, 60);
  assert.equal(resultado.datos.estudiantes[0].deuda, 60);
  assert.equal(resultado.unidad.estado, 'Mantenimiento');
});

test('renovación: nueva fecha persistible, una sola vez y bloqueo por solicitudes', () => {
  const { equipo, datos } = escenario();
  const prestamo = { codigo: 'PRE-2026-0010', equipoId: 99, estudianteId: 'prueba', estado: 'Activo', fin: sumarDias(hoyISO(), 1), renovaciones: 0 };
  const estado = { ...datos, prestamos: [prestamo] };
  const resultado = renovarPrestamo(estado, prestamo.codigo, [equipo]);
  assert.equal(resultado.datos.prestamos[0].fin, sumarDias(prestamo.fin, 7));
  assert.ok(renovarPrestamo(resultado.datos, prestamo.codigo, [equipo]).error);
  assert.ok(renovarPrestamo({ ...estado, solicitudes: [{ codigo: 'otro', equipoId: 99, estado: 'Enviada' }] }, prestamo.codigo, [equipo]).error);
  assert.ok(renovarPrestamo(estado, prestamo.codigo, [{ ...equipo, renovacion: false }]).error);
});

test('registro valida campos vacíos, dominio, contraseña y aceptación', () => {
  const datos = { nombres: '', apellidos: '', carrera: '', ciclo: '', correo: 'no@otro.com', password: '123', confirmar: '', acepta: false };
  const errores = validarRegistro(datos, 'estudiante');
  for (const campo of ['nombres', 'apellidos', 'carrera', 'ciclo', 'correo', 'password', 'confirmar', 'acepta']) assert.ok(errores[campo]);
  assert.deepEqual(validarRegistro({ nombres: 'Ana', apellidos: 'Pérez', carrera: 'Ingeniería', ciclo: '5', correo: 'ana@aloe.ulima.edu.pe', password: 'Clase2026', confirmar: 'Clase2026', acepta: true }, 'estudiante'), {});
});
