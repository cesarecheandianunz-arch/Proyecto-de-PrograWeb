// Datos de prueba (por ahora todo está en el front)

export const categorias = ['Robótica', 'Medición', 'Audiovisual', 'Cómputo', 'Redes', 'Laboratorio de física'];

export const carreras = ['Ingeniería Electrónica', 'Ingeniería Industrial', 'Ingeniería de Sistemas', 'Comunicación', 'Arquitectura'];

export const cursos = ['IN324 Laboratorio de Circuitos', 'IN401 Proyecto Integrador', 'IN352 Redes y Comunicaciones', 'CO210 Fotografía Documental'];

export const equipos = [
  { id: 1, nombre: 'Osciloscopio TBS1052B', marca: 'Tektronix', modelo: 'TBS1052B', categoria: 'Medición', libres: 3, total: 5, duracion: 7 },
  { id: 2, nombre: 'Cámara Canon EOS 90D', marca: 'Canon', modelo: 'EOS 90D', categoria: 'Audiovisual', libres: 2, total: 4, duracion: 5 },
  { id: 3, nombre: 'Kit de robótica Arduino Mega', marca: 'Arduino', modelo: 'Mega 2560', categoria: 'Robótica', libres: 6, total: 6, duracion: 10 },
  { id: 4, nombre: 'Tableta gráfica Wacom Intuos', marca: 'Wacom', modelo: 'CTL-4100', categoria: 'Cómputo', libres: 1, total: 3, duracion: 5 },
  { id: 5, nombre: 'Multímetro Fluke 117', marca: 'Fluke', modelo: '117', categoria: 'Medición', libres: 0, total: 3, duracion: 5 },
  { id: 6, nombre: 'Analizador de redes portátil', marca: 'NetAlly', modelo: 'LinkRunner', categoria: 'Redes', libres: 2, total: 3, duracion: 7 },
  { id: 7, nombre: 'Trípode Manfrotto MT055', marca: 'Manfrotto', modelo: 'MT055', categoria: 'Audiovisual', libres: 4, total: 5, duracion: 7 },
  { id: 8, nombre: 'Fuente de poder regulable', marca: 'Korad', modelo: 'KA3005P', categoria: 'Laboratorio de física', libres: 3, total: 4, duracion: 15 },
];

export const unidades = [
  { codigo: 'INV-OSC-0042', ubicacion: 'Almacén H-102 · anaquel 3', estado: 'Disponible', observacion: 'Sondas completas', prestamo: '—' },
  { codigo: 'INV-OSC-0043', ubicacion: 'Almacén H-102 · anaquel 3', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-OSC-0044', ubicacion: 'Lab. Electrónica H-210', estado: 'Prestada', observacion: 'Entregada con estuche', prestamo: 'PRE-2026-0318' },
  { codigo: 'INV-OSC-0045', ubicacion: 'Servicio técnico externo', estado: 'Mantenimiento', observacion: 'Sonda 2 con falso contacto', prestamo: '—' },
  { codigo: 'INV-OSC-0046', ubicacion: 'Almacén N-005', estado: 'Disponible', observacion: '—', prestamo: '—' },
];

export const solicitudes = [
  { codigo: 'PRE-2026-0330', estudiante: 'Renzo Mendoza Cárdenas', carrera: 'Ing. Electrónica · 6.º', equipo: 'Osciloscopio TBS1052B', curso: 'IN324 Laboratorio de Circuitos', fechas: '16/09 → 21/09/2026', motivo: 'Práctica calificada 3 de circuitos', hace: 'hace 2 h', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0331', estudiante: 'Alejandra Huamán Solís', carrera: 'Deuda S/ 60.00', equipo: 'Cámara Canon EOS 90D', curso: 'CO210 Fotografía Documental', fechas: '17/09 → 22/09/2026', motivo: 'Registro fotográfico del taller', hace: 'hace 5 h', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0332', estudiante: 'Diego Salcedo Vera', carrera: 'Ing. Industrial · 8.º', equipo: 'Kit de robótica Arduino Mega', curso: 'IN401 Proyecto Integrador', fechas: '18/09 → 25/09/2026', motivo: 'Prototipo del proyecto integrador', hace: 'hace 1 d', unidad: 'Pendiente de asignar', estado: 'Enviada' },
  { codigo: 'PRE-2026-0325', estudiante: 'Mateo Chávez Ríos', carrera: 'Ing. de Sistemas · 7.º', equipo: 'Analizador de redes portátil', curso: 'IN352 Redes y Comunicaciones', fechas: '19/09 → 23/09/2026', motivo: 'Certificación de cableado del lab.', hace: 'hace 2 d', unidad: 'INV-RED-0001', estado: 'Aprobada' },
  { codigo: 'PRE-2026-0318', estudiante: 'Renzo Mendoza Cárdenas', carrera: 'Ing. Electrónica · 6.º', equipo: 'Osciloscopio TBS1052B', curso: 'IN324 Laboratorio de Circuitos', fechas: '14/09 → 21/09/2026', motivo: 'Medición de señales', hace: 'hace 3 d', unidad: 'INV-OSC-0044', estado: 'Entregada' },
  { codigo: 'PRE-2026-0310', estudiante: 'Camila Quispe Andrade', carrera: 'Deuda S/ 45.00', equipo: 'Tableta gráfica Wacom Intuos', curso: 'CO210 Fotografía Documental', fechas: '10/09 → 14/09/2026', motivo: 'Entrega del curso de dibujo', hace: 'hace 6 d', unidad: '—', estado: 'Rechazada' },
];

export const prestamos = [
  { codigo: 'PRE-2026-0291', unidad: 'INV-TAB-0004', estudiante: 'Camila Quispe Andrade', vence: '11/09/2026', dias: -3 },
  { codigo: 'PRE-2026-0303', unidad: 'INV-CAM-0012', estudiante: 'Alejandra Huamán Solís', vence: '12/09/2026', dias: -2 },
  { codigo: 'PRE-2026-0311', unidad: 'INV-MUL-0021', estudiante: 'Lucía Paredes Ynga', vence: '14/09/2026', dias: 0 },
  { codigo: 'PRE-2026-0318', unidad: 'INV-OSC-0044', estudiante: 'Renzo Mendoza Cárdenas', vence: '21/09/2026', dias: 7 },
  { codigo: 'PRE-2026-0319', unidad: 'INV-CAM-0009', estudiante: 'Fabiana Loayza Ramos', vence: '19/09/2026', dias: 5 },
  { codigo: 'PRE-2026-0320', unidad: 'INV-TRI-0007', estudiante: 'Mateo Chávez Ríos', vence: '17/09/2026', dias: 3 },
];
