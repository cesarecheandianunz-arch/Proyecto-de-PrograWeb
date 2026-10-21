// Datos de prueba (por ahora todo está en el front)

export const categorias = ['Robótica', 'Medición', 'Audiovisual', 'Cómputo', 'Redes', 'Laboratorio de física'];

export const carreras = ['Ingeniería Electrónica', 'Ingeniería Industrial', 'Ingeniería de Sistemas', 'Comunicación', 'Arquitectura'];

export const cursos = ['IN324 Laboratorio de Circuitos', 'IN401 Proyecto Integrador', 'IN352 Redes y Comunicaciones', 'CO210 Fotografía Documental'];

export const equipos = [
  { id: 1, descripcion: 'Instrumento para observar señales eléctricas en las prácticas de circuitos y electrónica. Verifica las sondas y accesorios al recogerlo.', fotografias: ['/img/osciloscopio.jpg'], accesorios: ['2 sondas de medición', 'Cable USB', 'Estuche rígido'], autorizacion: true, renovacion: false, penalidad: 15, nombre: 'Osciloscopio TBS1052B', marca: 'Tektronix', modelo: 'TBS1052B', categoria: 'Medición', libres: 3, total: 5, duracion: 7 },
  { id: 2, descripcion: 'Cámara para prácticas de fotografía, video y proyectos audiovisuales. Verifica la batería y los accesorios antes de salir del almacén.', fotografias: ['/img/camara.jpg'], accesorios: ['Estuche rígido', 'Cargador', 'Batería de repuesto', 'Correa', 'Cable USB'], autorizacion: false, renovacion: true, penalidad: 20, nombre: 'Cámara Canon EOS 90D', marca: 'Canon', modelo: 'EOS 90D', categoria: 'Audiovisual', libres: 2, total: 4, duracion: 5 },
  { id: 3, descripcion: 'Kit para construir y probar prototipos de electrónica y robótica en proyectos académicos. Devuelve sus componentes y accesorios completos.', fotografias: ['/img/arduino.jpg'], accesorios: ['Estuche rígido', 'Cable USB'], autorizacion: true, renovacion: false, penalidad: 15, nombre: 'Kit de robótica Arduino Mega', marca: 'Arduino', modelo: 'Mega 2560', categoria: 'Robótica', libres: 6, total: 6, duracion: 10 },
  { id: 4, descripcion: 'Tableta gráfica para ilustración, dibujo digital y proyectos de diseño. Se entrega con lápiz digital y cable de conexión.', fotografias: ['/img/tableta.jpg'], accesorios: ['Lápiz digital', 'Cable USB', 'Estuche'], autorizacion: true, renovacion: false, penalidad: 15, nombre: 'Tableta gráfica Wacom Intuos', marca: 'Wacom', modelo: 'CTL-4100', categoria: 'Cómputo', libres: 1, total: 3, duracion: 5 },
  { id: 5, descripcion: 'Instrumento para realizar mediciones eléctricas en prácticas de laboratorio. Revisa su estado y accesorios antes de utilizarlo.', fotografias: ['/img/multimetro.jpg'], accesorios: ['Estuche rígido', 'Cable USB'], autorizacion: true, renovacion: false, penalidad: 15, nombre: 'Multímetro Fluke 117', marca: 'Fluke', modelo: '117', categoria: 'Medición', libres: 0, total: 3, duracion: 5 },
  { id: 6, descripcion: 'Equipo para prácticas de verificación de conexiones y diagnóstico de redes. Revisa los accesorios incluidos al registrar la entrega.', fotografias: ['/img/analizador-redes.jpg'], accesorios: ['Estuche rígido', 'Cable USB'], autorizacion: true, renovacion: false, penalidad: 15, nombre: 'Analizador de redes portátil', marca: 'NetAlly', modelo: 'LinkRunner', categoria: 'Redes', libres: 2, total: 3, duracion: 7 },
  { id: 7, descripcion: 'Soporte para estabilizar cámaras durante prácticas de fotografía y grabación. Verifica seguros y piezas antes de recogerlo.', fotografias: ['/img/tripode.jpg'], accesorios: ['Estuche rígido', 'Cable USB'], autorizacion: true, renovacion: true, penalidad: 15, nombre: 'Trípode Manfrotto MT055', marca: 'Manfrotto', modelo: 'MT055', categoria: 'Audiovisual', libres: 4, total: 5, duracion: 7 },
  { id: 8, descripcion: 'Fuente regulable para alimentar circuitos durante las prácticas de electrónica. Su uso debe respetar las indicaciones del laboratorio.', fotografias: ['/img/fuente-poder.jpg'], accesorios: ['Estuche rígido', 'Cable USB'], autorizacion: true, renovacion: true, penalidad: 15, nombre: 'Fuente de poder regulable', marca: 'Korad', modelo: 'KA3005P', categoria: 'Laboratorio de física', libres: 3, total: 4, duracion: 15 },
];

export const unidades = [
  { codigo: 'INV-OSC-0042', equipoId:1,ubicacion: 'Almacén H-102 · anaquel 3', estado: 'Disponible', observacion: 'Sondas completas', prestamo: '—' },
  { codigo: 'INV-OSC-0043', equipoId:1,ubicacion: 'Almacén H-102 · anaquel 3', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-OSC-0044', equipoId:1,ubicacion: 'Lab. Electrónica H-210', estado: 'Prestada', observacion: 'Entregada con estuche', prestamo: 'PRE-2026-0318' },
  { codigo: 'INV-OSC-0045', equipoId:1,ubicacion: 'Servicio técnico externo', estado: 'Mantenimiento', observacion: 'Sonda 2 con falso contacto', prestamo: '—' },
  { codigo: 'INV-OSC-0046', equipoId:1,ubicacion: 'Almacén N-005', estado: 'Disponible', observacion: '—', prestamo: '—' },
  {codigo: 'INV-CAM-0009', equipoId:2,ubicacion: 'Almacén H-102 · anaquel 1', estado: 'Prestada', observacion: 'Entregada con estuche y cargador', prestamo: 'PRE-2026-0319' },
  { codigo: 'INV-CAM-0010', equipoId: 2, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-CAM-0011', equipoId: 2, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-CAM-0012', equipoId: 2, ubicacion: 'Almacén H-102', estado: 'Prestada', observacion: '—', prestamo: 'PRE-2026-0303' },
  { codigo: 'INV-ARD-0013', equipoId: 3, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0014', equipoId: 3, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0015', equipoId: 3, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0016', equipoId: 3, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0017', equipoId: 3, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-ARD-0018', equipoId: 3, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-TAB-0004', equipoId: 4, ubicacion: 'Almacén H-102', estado: 'Prestada', observacion: '—', prestamo: 'PRE-2026-0291' },
  { codigo: 'INV-TAB-0005', equipoId: 4, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-TAB-0006', equipoId: 4, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-MUL-0021', equipoId: 5, ubicacion: 'Almacén H-102', estado: 'Prestada', observacion: '—', prestamo: 'PRE-2026-0311' },
  { codigo: 'INV-MUL-0022', equipoId: 5, ubicacion: 'Almacén H-102', estado: 'Mantenimiento', observacion: '—', prestamo: '—' },
  { codigo: 'INV-MUL-0023', equipoId: 5, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-RED-0001', equipoId: 6, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-RED-0002', equipoId: 6, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-RED-0003', equipoId: 6, ubicacion: 'Almacén H-102', estado: 'Dada de baja', observacion: '—', prestamo: '—' },
  { codigo: 'INV-TRI-0007', equipoId: 7, ubicacion: 'Almacén H-102', estado: 'Prestada', observacion: '—', prestamo: 'PRE-2026-0320' },
  { codigo: 'INV-TRI-0008', equipoId: 7, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-TRI-0009', equipoId: 7, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-TRI-0010', equipoId: 7, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-TRI-0011', equipoId: 7, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-FUE-0001', equipoId: 8, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-FUE-0002', equipoId: 8, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-FUE-0003', equipoId: 8, ubicacion: 'Almacén H-102', estado: 'Disponible', observacion: '—', prestamo: '—' },
  { codigo: 'INV-FUE-0004', equipoId: 8, ubicacion: 'Almacén H-102', estado: 'Mantenimiento', observacion: '—', prestamo: '—' },
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