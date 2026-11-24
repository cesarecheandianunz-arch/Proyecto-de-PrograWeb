// Pruebas de HU-1. Necesitan la base levantada y con seed: npm run db:up && npm run db:push && npm run db:seed
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { iniciarServidor, cliente } from './ayuda.js';
import { prisma } from '../src/lib/prisma.js';

const PASSWORD = process.env.SEED_PASSWORD || 'Prueba123';
const sufijo = Date.now();
const correoEstudiante = `test.est${sufijo}@aloe.ulima.edu.pe`;
const correoEncargado = `test.enc${sufijo}@ulima.edu.pe`;
let srv;

before(async () => { srv = await iniciarServidor(); });
after(async () => {
  await prisma.usuario.deleteMany({ where: { correo: { in: [correoEstudiante, correoEncargado] } } });
  await srv.cerrar();
});

const registroValido = {
  nombres: 'Ana', apellidos: 'Prueba Test', carrera: 'Ingeniería de Sistemas', ciclo: '4',
  correo: correoEstudiante, password: 'Segura123', confirmar: 'Segura123', acepta: true,
};

test('registro: devuelve errores por campo con el mismo formato del front', async () => {
  const pedir = cliente(srv.base);
  const r = await pedir('POST', '/auth/registro', { ...registroValido, correo: 'alguien@gmail.com', password: 'corta', acepta: false });
  assert.equal(r.status, 400);
  assert.ok(r.body.errores.correo);
  assert.ok(r.body.errores.password);
  assert.ok(r.body.errores.acepta);
});

test('registro de estudiante, correo duplicado y login', async () => {
  const pedir = cliente(srv.base);
  const r = await pedir('POST', '/auth/registro', registroValido);
  assert.equal(r.status, 201);
  assert.equal(r.body.usuario.rol, 'ESTUDIANTE');
  assert.equal(r.body.usuario.passwordHash, undefined);

  const dup = await pedir('POST', '/auth/registro', registroValido);
  assert.equal(dup.status, 409);

  const mal = await pedir('POST', '/auth/login', { correo: correoEstudiante, password: 'Otra1234' });
  assert.equal(mal.status, 401);

  const ok = await pedir('POST', '/auth/login', { correo: correoEstudiante, password: 'Segura123' });
  assert.equal(ok.status, 200);
  assert.match(ok.setCookie, /HttpOnly/i);

  const yo = await pedir('GET', '/auth/me');
  assert.equal(yo.body.usuario.correo, correoEstudiante);
});

test('mi cuenta: actualizar perfil y cambiar contraseña', async () => {
  const pedir = cliente(srv.base);
  await pedir('POST', '/auth/login', { correo: correoEstudiante, password: 'Segura123' });

  const perfil = await pedir('PATCH', '/usuarios/me', { nombres: 'Ana María', apellidos: 'Prueba Test', carrera: 'Comunicación', ciclo: 5, celular: '987654321' });
  assert.equal(perfil.status, 200);
  assert.equal(perfil.body.usuario.carrera, 'Comunicación');

  const malActual = await pedir('PATCH', '/usuarios/me/password', { actual: 'NoEsEsta1', nueva: 'Nueva1234', confirmar: 'Nueva1234' });
  assert.equal(malActual.status, 400);
  assert.ok(malActual.body.errores.actual);

  const cambio = await pedir('PATCH', '/usuarios/me/password', { actual: 'Segura123', nueva: 'Nueva1234', confirmar: 'Nueva1234' });
  assert.equal(cambio.status, 200);
  const login = await cliente(srv.base)('POST', '/auth/login', { correo: correoEstudiante, password: 'Nueva1234' });
  assert.equal(login.status, 200);
});

test('sin sesión: 401; logout borra la sesión', async () => {
  const pedir = cliente(srv.base);
  assert.equal((await pedir('GET', '/auth/me')).status, 401);
  await pedir('POST', '/auth/login', { correo: 'rmendoza@aloe.ulima.edu.pe', password: PASSWORD });
  assert.equal((await pedir('GET', '/auth/me')).status, 200);
  assert.equal((await pedir('POST', '/auth/logout')).status, 204);
  assert.equal((await pedir('GET', '/auth/me')).status, 401);
});

test('encargado: queda pendiente y el jefe lo aprueba', async () => {
  const pedir = cliente(srv.base);
  const r = await pedir('POST', '/auth/registro-encargado', {
    nombres: 'Luis', apellidos: 'Prueba', correo: correoEncargado, password: 'Segura123', confirmar: 'Segura123', almacen: 'Almacén H-102', anexo: '3121',
  });
  assert.equal(r.status, 201);
  assert.equal(r.body.usuario.estado, 'PENDIENTE');
  assert.equal((await pedir('POST', '/auth/login', { correo: correoEncargado, password: 'Segura123' })).status, 403);

  // Un estudiante no puede aprobar
  const est = cliente(srv.base);
  await est('POST', '/auth/login', { correo: 'rmendoza@aloe.ulima.edu.pe', password: PASSWORD });
  assert.equal((await est(`PATCH`, `/encargados/${r.body.usuario.id}/estado`, { estado: 'ACTIVA' })).status, 403);

  const jefe = cliente(srv.base);
  await jefe('POST', '/auth/login', { correo: 'jefe.lab@ulima.edu.pe', password: PASSWORD });
  const pendientes = await jefe('GET', '/encargados?estado=PENDIENTE');
  assert.ok(pendientes.body.some((e) => e.correo === correoEncargado));
  assert.equal((await jefe('PATCH', `/encargados/${r.body.usuario.id}/estado`, { estado: 'ACTIVA' })).status, 200);

  assert.equal((await pedir('POST', '/auth/login', { correo: correoEncargado, password: 'Segura123' })).status, 200);
});

test('recuperación: misma respuesta exista o no el correo, y token de un solo uso', async () => {
  const pedir = cliente(srv.base);
  const existe = await pedir('POST', '/auth/recuperar', { correo: correoEstudiante });
  const noExiste = await pedir('POST', '/auth/recuperar', { correo: 'nadie.aqui@aloe.ulima.edu.pe' });
  assert.equal(existe.status, 200);
  assert.deepEqual(existe.body, noExiste.body);

  const malo = await pedir('POST', '/auth/restablecer', { token: 'inventado', nueva: 'Otra12345', confirmar: 'Otra12345' });
  assert.equal(malo.status, 400);
});

test('catálogos para los formularios', async () => {
  const pedir = cliente(srv.base);
  const carreras = await pedir('GET', '/catalogos/carreras');
  assert.ok(carreras.body.includes('Ingeniería de Sistemas'));
  const almacenes = await pedir('GET', '/catalogos/almacenes');
  assert.ok(almacenes.body.includes('Almacén H-102'));
});
