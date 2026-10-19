// Datos de prueba (por ahora todo está en el front)

export const categorias = ['Robótica', 'Medición', 'Audiovisual', 'Cómputo', 'Redes', 'Laboratorio de física'];

export const carreras = ['Ingeniería Electrónica', 'Ingeniería Industrial', 'Ingeniería de Sistemas', 'Comunicación', 'Arquitectura'];

export const cursos = ['IN324 Laboratorio de Circuitos', 'IN401 Proyecto Integrador', 'IN352 Redes y Comunicaciones', 'CO210 Fotografía Documental'];

export const equipos = [
  { id: 1, nombre: 'Osciloscopio TBS1052B', marca: 'Tektronix', modelo: 'TBS1052B', categoria: 'Medición', libres: 3, total: 5, duracion: 7, penalidad: 15, renovacion: false, accesorios: ['2 sondas de medición', 'Cable USB', 'Estuche rígido'] },
  { id: 2, nombre: 'Cámara Canon EOS 90D', marca: 'Canon', modelo: 'EOS 90D', categoria: 'Audiovisual', libres: 2, total: 4, duracion: 5, penalidad: 20, renovacion: true, accesorios: ['Estuche rígido', 'Cargador', 'Batería de repuesto', 'Correa', 'Cable USB'] },
  { id: 3, nombre: 'Kit de robótica Arduino Mega', marca: 'Arduino', modelo: 'Mega 2560', categoria: 'Robótica', libres: 6, total: 6, duracion: 10, penalidad: 15, renovacion: true, accesorios: ['Cable USB', 'Estuche'] },
  { id: 4, nombre: 'Tableta gráfica Wacom Intuos', marca: 'Wacom', modelo: 'CTL-4100', categoria: 'Cómputo', libres: 1, total: 3, duracion: 5, penalidad: 15, renovacion: false, accesorios: ['Lápiz digital', 'Cable USB', 'Estuche'] },
  { id: 5, nombre: 'Multímetro Fluke 117', marca: 'Fluke', modelo: '117', categoria: 'Medición', libres: 0, total: 3, duracion: 5, penalidad: 15, renovacion: true, accesorios: ['Puntas de prueba', 'Estuche'] },
  { id: 6, nombre: 'Analizador de redes portátil', marca: 'NetAlly', modelo: 'LinkRunner', categoria: 'Redes', libres: 2, total: 3, duracion: 7, penalidad: 15, renovacion: false, accesorios: ['Estuche rígido', 'Cargador y cable de red'] },
  { id: 7, nombre: 'Trípode Manfrotto MT055', marca: 'Manfrotto', modelo: 'MT055', categoria: 'Audiovisual', libres: 4, total: 5, duracion: 7, penalidad: 15, renovacion: true, accesorios: ['Funda'] },
  { id: 8, nombre: 'Fuente de poder regulable', marca: 'Korad', modelo: 'KA3005P', categoria: 'Laboratorio de física', libres: 3, total: 4, duracion: 15, penalidad: 15, renovacion: true, accesorios: ['Cable de alimentación'] },
];

export const unidades = [
  { codigo: 'INV-OSC-0042', equipoId:1,ubicacion: 'Almacén H-102 · anaquel 3', estado: 'Disponible', observacion: 'Sondas completas', prestamo: '—' },
  { codigo: 'INV-OSC-0043', equipoId:1,ubicacion: 'Almacén H-102 · anaquel 3', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-OSC-0044', equipoId:1,ubicacion: 'Lab. Electrónica H-210', estado: 'Prestada', observacion: 'Entregada con estuche', prestamo: 'PRE-2026-0318' },
  { codigo: 'INV-OSC-0045', equipoId:1,ubicacion: 'Servicio técnico externo', estado: 'Mantenimiento', observacion: 'Sonda 2 con falso contacto', prestamo: '—' },
  { codigo: 'INV-OSC-0046', equipoId:1,ubicacion: 'Almacén N-005', estado: 'Disponible', observacion: '—', prestamo: '—' },
  {codigo: 'INV-CAM-0009', equipoId:2,ubicacion: 'Almacén H-102 · anaquel 1', estado: 'Prestada', observacion: 'Entregada con estuche y cargador', prestamo: 'PRE-2026-0319' },
  { codigo: 'INV-CAM-0010', equipoId: 2, ubicacion: 'Almacén H-102 · anaquel 1', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-CAM-0011', equipoId: 2, ubicacion: 'Almacén H-102 · anaquel 1', estado: 'Mantenimiento', observacion: 'Lente con polvo', prestamo: '—' },
  { codigo: 'INV-CAM-0012', equipoId: 2, ubicacion: 'Almacén H-102 · anaquel 1', estado: 'Prestada', observacion: 'Entregada con estuche', prestamo: 'PRE-2026-0303' },
  { codigo: 'INV-CAM-0013', equipoId: 2, ubicacion: 'Almacén H-102 · anaquel 1', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0011', equipoId: 3, ubicacion: 'Almacén H-102 · anaquel 4', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0012', equipoId: 3, ubicacion: 'Almacén H-102 · anaquel 4', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0013', equipoId: 3, ubicacion: 'Almacén H-102 · anaquel 4', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0015', equipoId: 3, ubicacion: 'Almacén H-102 · anaquel 4', estado: 'Prestada', observacion: 'Kit completo', prestamo: 'PRE-2026-0321' },
  { codigo: 'INV-TAB-0004', equipoId: 4, ubicacion: 'Almacén H-102 · anaquel 2', estado: 'Prestada', observacion: 'Entregada con estuche', prestamo: 'PRE-2026-0291' },
  { codigo: 'INV-TAB-0005', equipoId: 4, ubicacion: 'Almacén H-102 · anaquel 2', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-MUL-0021', equipoId: 5, ubicacion: 'Almacén H-102 · anaquel 3', estado: 'Prestada', observacion: 'Puntas completas', prestamo: 'PRE-2026-0311' },
  { codigo: 'INV-MUL-0022', equipoId: 5, ubicacion: 'Almacén H-102 · anaquel 3', estado: 'Mantenimiento', observacion: 'Fusible dañado', prestamo: '—' },
  { codigo: 'INV-RED-0001', equipoId: 6, ubicacion: 'Almacén H-102 · anaquel 5', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-RED-0002', equipoId: 6, ubicacion: 'Almacén H-102 · anaquel 5', estado: 'Prestada', observacion: 'Entregado con estuche', prestamo: 'PRE-2026-0322' },
  { codigo: 'INV-RED-0003', equipoId: 6, ubicacion: 'Almacén H-102 · anaquel 5', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-TRI-0007', equipoId: 7, ubicacion: 'Almacén H-102 · anaquel 6', estado: 'Prestada', observacion: 'Entregado con funda', prestamo: 'PRE-2026-0320' },
  { codigo: 'INV-TRI-0008', equipoId: 7, ubicacion: 'Almacén H-102 · anaquel 6', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-TRI-0009', equipoId: 7, ubicacion: 'Almacén H-102 · anaquel 6', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-FUE-0001', equipoId: 8, ubicacion: 'Almacén H-102 · anaquel 7', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-FUE-0002', equipoId: 8, ubicacion: 'Almacén H-102 · anaquel 7', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-FUE-0003', equipoId: 8, ubicacion: 'Almacén H-102 · anaquel 7', estado: 'Disponible', observacion: '—', prestamo: '—' },
];

// Fecha "de hoy" de la maqueta y utilidades de fechas
export const HOY = '2026-09-14';
export const diasHasta = (fin) => Math.round((new Date(fin) - new Date(HOY)) / 86400000);
export const fmt = (iso) => iso.split('-').reverse().join('/'); // 2026-09-21 -> 21/09/2026
export const fmtHora = (iso) => { const [d, h] = iso.split('T'); return fmt(d) + ' ' + h; };
export const sumarDias = (iso, n) => {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
export const docente = 'Ing. Elena Rivas Talledo';

// Estudiantes en lista de espera por equipo (id del equipo -> cantidad); bloquea renovaciones
export const enEspera = { 2: 4, 4: 2 };

// deuda: monto en soles (0 si no debe). fin: fecha de devolución en formato ISO.
export const solicitudes = [
  { codigo: 'PRE-2026-0330', estudiante: 'Renzo Mendoza Cárdenas', codigoAlumno: '20213456', carrera: 'Ing. Electrónica · 6.º', deuda: 0, equipoId: 1, equipo: 'Osciloscopio TBS1052B', curso: 'IN324 Laboratorio de Circuitos', fechas: '16/09 → 21/09/2026', fin: '2026-09-21', motivo: 'Práctica calificada 3 de circuitos', hace: 'hace 2 h', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0331', estudiante: 'Alejandra Huamán Solís', codigoAlumno: '20219087', carrera: 'Comunicación · 6.º', deuda: 60, equipoId: 2, equipo: 'Cámara Canon EOS 90D', curso: 'CO210 Fotografía Documental', fechas: '17/09 → 22/09/2026', fin: '2026-09-22', motivo: 'Registro fotográfico del taller', hace: 'hace 5 h', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0332', estudiante: 'Diego Salcedo Vera', codigoAlumno: '20207731', carrera: 'Ing. Industrial · 8.º', deuda: 0, equipoId: 3, equipo: 'Kit de robótica Arduino Mega', curso: 'IN401 Proyecto Integrador', fechas: '18/09 → 25/09/2026', fin: '2026-09-25', motivo: 'Prototipo del proyecto integrador', hace: 'hace 1 d', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0333', estudiante: 'Fabiana Loayza Ramos', codigoAlumno: '20226654', carrera: 'Comunicación · 5.º', deuda: 0, equipoId: 7, equipo: 'Trípode Manfrotto MT055', curso: 'CO210 Fotografía Documental', fechas: '16/09 → 18/09/2026', fin: '2026-09-18', motivo: 'Grabación del cortometraje', hace: 'hace 1 d', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0334', estudiante: 'Sebastián Rojas Ynga', codigoAlumno: '20211203', carrera: 'Ing. de Sistemas · 7.º', deuda: 0, equipoId: 5, equipo: 'Multímetro Fluke 117', curso: 'IN324 Laboratorio de Circuitos', fechas: '17/09 → 20/09/2026', fin: '2026-09-20', motivo: 'Mediciones del laboratorio', hace: 'hace 1 d', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0335', estudiante: 'Valeria Ccahuana Pino', codigoAlumno: '20223390', carrera: 'Arquitectura · 4.º', deuda: 0, equipoId: 8, equipo: 'Fuente de poder regulable', curso: 'FI210 Física Aplicada', fechas: '20/09 → 24/09/2026', fin: '2026-09-24', motivo: 'Maqueta con circuito de alimentación', hace: 'hace 3 h', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0325', estudiante: 'Mateo Chávez Ríos', codigoAlumno: '20198812', carrera: 'Ing. de Sistemas · 7.º', deuda: 0, equipoId: 6, equipo: 'Analizador de redes portátil', curso: 'IN352 Redes y Comunicaciones', fechas: '19/09 → 23/09/2026', fin: '2026-09-23', motivo: 'Certificación de cableado del lab.', hace: 'hace 2 d', unidad: 'INV-RED-0001', estado: 'Aprobada' },
  { codigo: 'PRE-2026-0326', estudiante: 'Sebastián Rojas Ynga', codigoAlumno: '20211203', carrera: 'Ing. de Sistemas · 7.º', deuda: 0, equipoId: 3, equipo: 'Kit de robótica Arduino Mega', curso: 'IN401 Proyecto Integrador', fechas: '15/09 → 22/09/2026', fin: '2026-09-22', motivo: 'Prototipo de domótica', hace: 'hace 3 d', unidad: 'INV-ARD-0011', estado: 'Aprobada' },
  { codigo: 'PRE-2026-0327', estudiante: 'Lucía Paredes Ynga', codigoAlumno: '20189045', carrera: 'Ing. Electrónica · 9.º', deuda: 0, equipoId: 1, equipo: 'Osciloscopio TBS1052B', curso: 'IN324 Laboratorio de Circuitos', fechas: '16/09 → 20/09/2026', fin: '2026-09-20', motivo: 'Mediciones de la tesis', hace: 'hace 3 d', unidad: 'INV-OSC-0043', estado: 'Aprobada' },
  { codigo: 'PRE-2026-0318', estudiante: 'Renzo Mendoza Cárdenas', codigoAlumno: '20213456', carrera: 'Ing. Electrónica · 6.º', deuda: 0, equipoId: 1, equipo: 'Osciloscopio TBS1052B', curso: 'IN324 Laboratorio de Circuitos', fechas: '14/09 → 21/09/2026', fin: '2026-09-21', motivo: 'Medición de señales', hace: 'hace 3 d', unidad: 'INV-OSC-0044', estado: 'Entregada', entrega: { accesorios: [{ nombre: '2 sondas de medición', entregado: true }, { nombre: 'Cable USB', entregado: true }, { nombre: 'Estuche rígido', entregado: false }], fecha: '2026-09-14T09:20', observaciones: 'Carcasa con rayadura superficial en la tapa. Pantalla y perillas operativas.' } },
  { codigo: 'PRE-2026-0310', estudiante: 'Camila Quispe Andrade', codigoAlumno: '20204512', carrera: 'Ing. Industrial · 8.º', deuda: 45, equipoId: 4, equipo: 'Tableta gráfica Wacom Intuos', curso: 'CO210 Fotografía Documental', fechas: '10/09 → 14/09/2026', fin: '2026-09-14', motivo: 'Entrega del curso de dibujo', hace: 'hace 6 d', unidad: '—', estado: 'Rechazada', motivoRechazo: 'Penalidad pendiente: regulariza la deuda de S/ 45.00 en Tesorería.' },
  { codigo: 'PRE-2026-0312', estudiante: 'Valeria Ccahuana Pino', codigoAlumno: '20223390', carrera: 'Arquitectura · 4.º', deuda: 0, equipoId: 6, equipo: 'Analizador de redes portátil', curso: 'IN352 Redes y Comunicaciones', fechas: '05/09 → 10/09/2026', fin: '2026-09-10', motivo: 'Prueba de cableado', hace: 'hace 8 d', unidad: '—', estado: 'Rechazada', motivoRechazo: 'Fechas no disponibles: no había unidades libres en ese rango.' },
];

// Préstamos en curso. El vencimiento y los días se calculan desde `fin`.
export const prestamos = [
  { codigo: 'PRE-2026-0291', unidad: 'INV-TAB-0004', estudiante: 'Camila Quispe Andrade', equipoId: 4, fin: '2026-09-11' },
  { codigo: 'PRE-2026-0303', unidad: 'INV-CAM-0012', estudiante: 'Alejandra Huamán Solís', equipoId: 2, fin: '2026-09-12' },
  { codigo: 'PRE-2026-0311', unidad: 'INV-MUL-0021', estudiante: 'Lucía Paredes Ynga', equipoId: 5, fin: '2026-09-14' },
  { codigo: 'PRE-2026-0318', unidad: 'INV-OSC-0044', estudiante: 'Renzo Mendoza Cárdenas', equipoId: 1, fin: '2026-09-21' },
  { codigo: 'PRE-2026-0319', unidad: 'INV-CAM-0009', estudiante: 'Fabiana Loayza Ramos', equipoId: 2, fin: '2026-09-19' },
  { codigo: 'PRE-2026-0320', unidad: 'INV-TRI-0007', estudiante: 'Mateo Chávez Ríos', equipoId: 7, fin: '2026-09-17' },
  { codigo: 'PRE-2026-0321', unidad: 'INV-ARD-0015', estudiante: 'Diego Salcedo Vera', equipoId: 3, fin: '2026-09-25' },
  { codigo: 'PRE-2026-0322', unidad: 'INV-RED-0002', estudiante: 'Sebastián Rojas Ynga', equipoId: 6, fin: '2026-09-23' },
];
