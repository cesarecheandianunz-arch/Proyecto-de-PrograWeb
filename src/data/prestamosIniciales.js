import { solicitudes, prestamos, equipos } from '../datos.js';
import { hoyISO, sumarDias } from '../utils/prestamos.js';

export const estudiantesIniciales = [
  { id: 'renzo', nombre: 'Renzo Mendoza Cárdenas', carrera: 'Ingeniería Electrónica', ciclo: '6', correo: 'rmendoza@aloe.ulima.edu.pe', deuda: 0, bloqueada: false },
  { id: 'alejandra', nombre: 'Alejandra Huamán Solís', carrera: 'Comunicación', ciclo: '5', correo: 'ahuaman@aloe.ulima.edu.pe', deuda: 60, bloqueada: false },
  { id: 'diego', nombre: 'Diego Salcedo Vera', carrera: 'Ingeniería Industrial', ciclo: '8', correo: 'dsalcedo@aloe.ulima.edu.pe', deuda: 0, bloqueada: false },
  { id: 'mateo', nombre: 'Mateo Chávez Ríos', carrera: 'Ingeniería de Sistemas', ciclo: '7', correo: 'mchavez@aloe.ulima.edu.pe', deuda: 0, bloqueada: false },
  { id: 'camila', nombre: 'Camila Quispe Andrade', carrera: 'Ingeniería Industrial', ciclo: '8', correo: 'cquispe@aloe.ulima.edu.pe', deuda: 45, bloqueada: false },
  { id: 'lucia', nombre: 'Lucía Paredes Ynga', carrera: 'Ingeniería Electrónica', ciclo: '9', correo: 'lparedes@aloe.ulima.edu.pe', deuda: 0, bloqueada: false },
  { id: 'fabiana', nombre: 'Fabiana Loayza Ramos', carrera: 'Comunicación', ciclo: '5', correo: 'floayza@aloe.ulima.edu.pe', deuda: 0, bloqueada: false },
];

// Se construye una sola vez al abrir un navegador sin operaciones guardadas.
// Las fechas relativas permiten demostrar vencidos, hoy y vigentes cualquier día.
export function crearOperacionesIniciales(unidades, inventario) {
  const hoy = hoyISO();
  const listaPrestamos = [];
  const listaSolicitudes = [];
  for (const anterior of prestamos) {
    const unidad = unidades.find((u) => u.codigo === anterior.unidad);
    if (!unidad || unidad.prestamo !== anterior.codigo || unidad.estado !== 'Prestada') continue;
    const equipo = inventario.find((e) => e.id === unidad.equipoId);
    if (!equipo) continue;
    const estudiante = estudiantesIniciales.find((e) => e.nombre === anterior.estudiante);
    const fin = sumarDias(hoy, anterior.dias);
    let estudianteId = 'renzo';
    if (estudiante) estudianteId = estudiante.id;
    listaPrestamos.push({
      ...anterior, equipoId: equipo.id, equipo: equipo.nombre, estudianteId,
      inicio: sumarDias(fin, -equipo.duracion), fin, estado: 'Activo', renovaciones: 0,
      fechaEntrega: sumarDias(fin, -equipo.duracion) + 'T09:00', curso: 'Prácticas de laboratorio',
      accesorios: (equipo.accesorios || []).map((nombre) => ({ nombre, entregado: true })),
      observaciones: 'Equipo operativo al entregar.', tarifa: equipo.penalidad ?? 15,
    });
  }
  for (const anterior of solicitudes) {
    const original = equipos.find((e) => e.nombre === anterior.equipo);
    if (!original) continue;
    const equipo = inventario.find((e) => e.id === original.id);
    if (!equipo) continue;
    const estudiante = estudiantesIniciales.find((e) => e.nombre === anterior.estudiante);
    const prestamo = listaPrestamos.find((p) => p.codigo === anterior.codigo);
    let inicio = hoy;
    let fin = sumarDias(inicio, Math.min(equipo.duracion, 5));
    if (prestamo) { inicio = prestamo.inicio; fin = prestamo.fin; }
    if (anterior.estado === 'Entregada' && !prestamo) continue;
    let motivoRechazo = '';
    if (anterior.estado === 'Rechazada') motivoRechazo = 'Penalidad pendiente: regulariza tu deuda antes de solicitar otro préstamo.';
    listaSolicitudes.push({ ...anterior, equipoId: equipo.id, equipo: equipo.nombre, estudianteId: estudiante.id, inicio, fin, creada: hoy, motivoRechazo, autorizacion: false });
  }
  // Devoluciones anteriores que explican las deudas de demostración.
  for (const ejemplo of [
    { codigo: 'PRE-2026-0245', estudianteId: 'camila', unidad: 'INV-TAB-0005', tarifa: 15 },
    { codigo: 'PRE-2026-0246', estudianteId: 'alejandra', unidad: 'INV-CAM-0010', tarifa: 20 },
  ]) {
    const unidad = unidades.find((u) => u.codigo === ejemplo.unidad);
    if (!unidad) continue;
    const equipo = inventario.find((e) => e.id === unidad.equipoId);
    const estudiante = estudiantesIniciales.find((e) => e.id === ejemplo.estudianteId);
    if (!equipo) continue;
    const fin = sumarDias(hoy, -10);
    listaPrestamos.push({
      ...ejemplo,
      equipoId: equipo.id,
      equipo: equipo.nombre,
      estudiante: estudiante.nombre,
      inicio: sumarDias(fin, -5),
      fin,
      fechaEntrega: sumarDias(fin, -5) + 'T09:00',
      estado: 'Devuelto',
      renovaciones: 0,
      curso: 'Prácticas de laboratorio',
      accesorios: [],
      observaciones: 'Sin novedades al entregar.',
      penalidadPagada: false,
      devolucion: {
        fecha: sumarDias(fin, 3),
        retraso: 3,
        penalidad: ejemplo.tarifa * 3,
        estadoRetorno: 'Sin novedades',
        accesorios: [],
        descripcion: '',
        mantenimiento: false,
      },
    });
  }
  // Toda entrega tiene su solicitud y puede consultarse desde ambas vistas.
  for (const prestamo of listaPrestamos) {
    if (listaSolicitudes.filter((s) => s.codigo === prestamo.codigo).length === 0) {
      let estado = 'Entregada';
      if (prestamo.estado === 'Devuelto') estado = 'Devuelta';
      listaSolicitudes.push({ ...prestamo, estado, creada: prestamo.inicio, motivo: 'Préstamo de demostración para prácticas académicas.', hace: 'Datos de ejemplo' });
    }
  }
  return { solicitudes: listaSolicitudes, prestamos: listaPrestamos, estudiantes: estudiantesIniciales };
}
