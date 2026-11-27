// Datos de prueba. Se puede correr varias veces (usa upsert).
// Cada HU agrega su parte en su función; no edites la de otra HU.
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { carreras, categorias, cursos, equipos, unidades } from '../../src/datos.js';

const prisma = new PrismaClient();
const PASSWORD = process.env.SEED_PASSWORD || 'Prueba123';

// ---------- HU-1 ----------
const almacenes = ['Almacén H-102', 'Almacén N-005', 'Laboratorio de Electrónica H-210'];

const estudiantes = [
  { nombres: 'Renzo', apellidos: 'Mendoza Cárdenas', carrera: 'Ingeniería Electrónica', ciclo: 6, correo: 'rmendoza@aloe.ulima.edu.pe' },
  { nombres: 'Alejandra', apellidos: 'Huamán Solís', carrera: 'Comunicación', ciclo: 5, correo: 'ahuaman@aloe.ulima.edu.pe' },
  { nombres: 'Diego', apellidos: 'Salcedo Vera', carrera: 'Ingeniería Industrial', ciclo: 8, correo: 'dsalcedo@aloe.ulima.edu.pe' },
  { nombres: 'Mateo', apellidos: 'Pumacahua Ríos', carrera: 'Ingeniería de Sistemas', ciclo: 7, correo: 'mchavez@aloe.ulima.edu.pe' },
  { nombres: 'Camila', apellidos: 'Quispe Andrade', carrera: 'Ingeniería Industrial', ciclo: 8, correo: 'cquispe@aloe.ulima.edu.pe' },
  { nombres: 'Lucía', apellidos: 'Paredes Ynga', carrera: 'Ingeniería Electrónica', ciclo: 9, correo: 'lparedes@aloe.ulima.edu.pe' },
  { nombres: 'Fabiana', apellidos: 'Loayza Ramos', carrera: 'Comunicación', ciclo: 5, correo: 'floayza@aloe.ulima.edu.pe' },
];

async function seedHU1() {
  for (const nombre of almacenes) await prisma.almacen.upsert({ where: { nombre }, update: {}, create: { nombre } });
  for (const nombre of carreras) await prisma.carrera.upsert({ where: { nombre }, update: {}, create: { nombre } });

  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const h102 = await prisma.almacen.findUnique({ where: { nombre: 'Almacén H-102' } });
  const usuarios = [
    ...estudiantes.map((e) => ({ ...e, rol: 'ESTUDIANTE', aceptoReglamentoEn: new Date() })),
    { nombres: 'Carla', apellidos: 'Ríos Medina', correo: 'encargado.demo@ulima.edu.pe', rol: 'ENCARGADO', almacenId: h102.id, anexo: '3120' },
    { nombres: 'Jorge', apellidos: 'Pinto Lara', correo: 'encargado.pendiente@ulima.edu.pe', rol: 'ENCARGADO', estado: 'PENDIENTE', almacenId: h102.id },
    { nombres: 'Rosa', apellidos: 'Valdivia Torres', correo: 'jefe.lab@ulima.edu.pe', rol: 'JEFE' },
  ];
  for (const u of usuarios) {
    await prisma.usuario.upsert({ where: { correo: u.correo }, update: {}, create: { ...u, passwordHash } });
  }
}

// ---------- HU-2 ----------
// 4 objetivos
//registrar categorias, registrar modelos de equipos,  ajustar el contador automatico de identificadores y registrar las unidades fisicos de cada equipo
const ESTADO_UNIDAD = { 
  Disponible: 'DISPONIBLE', 
  Prestada: 'PRESTADA', 
  Mantenimiento: 'MANTENIMIENTO', 
  'Dada de baja': 'BAJA' };
// 
async function seedHU2() {
  for (const nombre of categorias) // el upsert actualiza si existe sino existe, lo inserta
     await prisma.categoria.upsert({ 
      where: { nombre }, 
      update: {}, 
      create: { nombre } });

  for (const e of equipos) {
    const categoria = await prisma.categoria.findUnique({ where: { nombre: e.categoria } });
    const data = {
      nombre: e.nombre,
       marca: e.marca,
      modelo: e.modelo, 
      descripcion: e.descripcion, 
      categoriaId: categoria.id,
      fotografias: e.fotografias, 
      accesorios: e.accesorios, 
      requiereAutorizacion: e.autorizacion,
      permiteRenovacion: e.renovacion, 
      duracionDias: e.duracion, 
      penalidadDiaria: e.penalidad,
    };
    //upset: combina el update con el insert 
    await prisma.equipo.upsert({
       where: { id: e.id },
        update: {},
         create: { id: e.id, ...data } });
  }
  // Como los ids se pusieron a mano, se adelanta el contador para que los nuevos no choquen.
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Equipo"', 'id'), (SELECT MAX(id) FROM "Equipo"))`);
// aca el $executeRawUnsafe solo permite ejecutar SQL mediante prisma
//  este await prisma ajusta el contador automatico de IDs de PostgresSQL
  for (const u of unidades) {
    const observacion = u.observacion === '—' ? null : u.observacion;
    await prisma.unidad.upsert({
      where: { codigo: u.codigo },
      update: {},
      create: { codigo: u.codigo, 
        equipoId: u.equipoId, 
        ubicacion: u.ubicacion, 
        estado: ESTADO_UNIDAD[u.estado], 
        observacion },
    });
  }

  
}

// ---------- HU-3 ----------
async function seedHU3() {
  for (const nombre of cursos) await prisma.curso.upsert({ where: { nombre }, update: {}, create: { nombre } });
  // TODO HU-3: solicitudes de ejemplo
}

// ---------- HU-4 ----------
async function seedHU4() {
  // TODO HU-4: préstamos activos de ejemplo
}

// ---------- HU-5 ----------
async function seedHU5() {
  // TODO HU-5: devoluciones y pagos de ejemplo
}

try {
  await seedHU1();
  await seedHU2();
  await seedHU3();
  await seedHU4();
  await seedHU5();
  console.log('Seed completo.');
} finally {
  await prisma.$disconnect();
}
