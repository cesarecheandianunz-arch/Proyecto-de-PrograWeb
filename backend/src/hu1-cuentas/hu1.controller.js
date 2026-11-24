import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { HttpError, exigirSinErrores } from '../lib/errores.js';
import { enviarCorreo } from '../lib/correo.js';
import { COOKIE_SESION } from '../middlewares/auth.js';
// Las MISMAS validaciones que usa el frontend (un solo archivo para ambos lados).
import { validarRegistro, validarPerfil, passwordValida, correoInstitucional } from '../../../src/utils/cuenta.js';

const RONDAS_BCRYPT = 10;
const MINUTOS_TOKEN = 30;

// ---------- utilidades ----------

// El body puede traer números, null o nada: las validaciones del front esperan texto.
const texto = (valor) => (valor == null ? '' : String(valor));

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Nunca se devuelve el passwordHash.
export function publico(u) {
  return {
    id: u.id,
    correo: u.correo,
    nombres: u.nombres,
    apellidos: u.apellidos,
    nombre: `${u.nombres} ${u.apellidos}`,
    rol: u.rol,
    estado: u.estado,
    carrera: u.carrera,
    ciclo: u.ciclo,
    celular: u.celular,
    almacen: u.almacen?.nombre ?? null,
    anexo: u.anexo,
  };
}

async function crearUsuario(data) {
  try {
    return await prisma.usuario.create({ data, include: { almacen: true } });
  } catch (err) {
    if (err.code === 'P2002') throw new HttpError(409, { errores: { correo: 'Este correo ya está registrado.' } });
    throw err;
  }
}

async function carreraExiste(nombre) {
  return Boolean(await prisma.carrera.findUnique({ where: { nombre } }));
}

function guardarSesion(res, usuario, recordarme) {
  const token = jwt.sign({ sub: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: recordarme ? '30d' : '8h',
  });
  res.cookie(COOKIE_SESION, token, {
    httpOnly: true, // el JavaScript del navegador no puede leerla
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // Sin "Recordarme" es cookie de sesión: se borra al cerrar el navegador.
    ...(recordarme ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
  });
}

// ---------- registro ----------

export async function registrarEstudiante(req, res) {
  const b = req.body ?? {};
  const datos = {
    nombres: texto(b.nombres), apellidos: texto(b.apellidos), carrera: texto(b.carrera),
    ciclo: texto(b.ciclo), celular: texto(b.celular), correo: texto(b.correo),
    password: texto(b.password), confirmar: texto(b.confirmar), acepta: b.acepta === true,
  };
  const errores = validarRegistro(datos, 'estudiante');
  if (!errores.carrera && !(await carreraExiste(datos.carrera))) errores.carrera = 'Selecciona una carrera de la lista.';
  exigirSinErrores(errores);

  const usuario = await crearUsuario({
    correo: datos.correo.trim().toLowerCase(),
    passwordHash: await bcrypt.hash(datos.password, RONDAS_BCRYPT),
    nombres: datos.nombres.trim(),
    apellidos: datos.apellidos.trim(),
    rol: 'ESTUDIANTE',
    carrera: datos.carrera,
    ciclo: Number(datos.ciclo),
    celular: datos.celular || null,
    aceptoReglamentoEn: new Date(),
  });
  res.status(201).json({ usuario: publico(usuario) });
}

export async function registrarEncargado(req, res) {
  const b = req.body ?? {};
  const datos = {
    nombres: texto(b.nombres), apellidos: texto(b.apellidos), almacen: texto(b.almacen),
    correo: texto(b.correo), password: texto(b.password), confirmar: texto(b.confirmar),
  };
  const anexo = texto(b.anexo).trim();
  const errores = validarRegistro(datos, 'encargado');
  const almacen = datos.almacen ? await prisma.almacen.findUnique({ where: { nombre: datos.almacen } }) : null;
  if (!errores.almacen && !almacen) errores.almacen = 'Selecciona un almacén de la lista.';
  if (anexo && !/^\d{1,6}$/.test(anexo)) errores.anexo = 'El anexo solo lleva números (hasta seis).';
  exigirSinErrores(errores);

  const usuario = await crearUsuario({
    correo: datos.correo.trim().toLowerCase(),
    passwordHash: await bcrypt.hash(datos.password, RONDAS_BCRYPT),
    nombres: datos.nombres.trim(),
    apellidos: datos.apellidos.trim(),
    rol: 'ENCARGADO',
    estado: 'PENDIENTE',
    almacenId: almacen.id,
    anexo: anexo || null,
  });
  res.status(201).json({ usuario: publico(usuario), mensaje: 'Registro enviado. Queda pendiente de aprobación.' });
}

// ---------- sesión ----------

export async function login(req, res) {
  const b = req.body ?? {};
  const correo = texto(b.correo).trim().toLowerCase();
  const password = texto(b.password);
  if (!correo || !password) throw new HttpError(400, { error: 'Completa tu correo y contraseña.' });

  const usuario = await prisma.usuario.findUnique({ where: { correo }, include: { almacen: true } });
  const valida = usuario && (await bcrypt.compare(password, usuario.passwordHash));
  // Mismo mensaje si no existe el correo o si la contraseña está mal (no revela qué falló).
  if (!valida) throw new HttpError(401, { error: 'Correo o contraseña incorrectos.' });
  if (usuario.estado === 'PENDIENTE') throw new HttpError(403, { error: 'Tu cuenta está pendiente de aprobación por el jefe de laboratorio.' });
  if (usuario.estado === 'RECHAZADA') throw new HttpError(403, { error: 'Tu registro fue rechazado. Comunícate con el laboratorio.' });

  guardarSesion(res, usuario, b.recordarme === true);
  res.json({ usuario: publico(usuario) });
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_SESION, { path: '/' });
  res.status(204).end();
}

export async function me(req, res) {
  const usuario = await prisma.usuario.findUnique({ where: { id: req.auth.id }, include: { almacen: true } });
  if (!usuario || usuario.estado !== 'ACTIVA') {
    res.clearCookie(COOKIE_SESION, { path: '/' });
    throw new HttpError(401, { error: 'Inicia sesión para continuar.' });
  }
  res.json({ usuario: publico(usuario) });
}

// ---------- mi cuenta ----------

export async function actualizarPerfil(req, res) {
  const b = req.body ?? {};
  const actual = await prisma.usuario.findUnique({ where: { id: req.auth.id } });
  if (!actual) throw new HttpError(401, { error: 'Inicia sesión para continuar.' });

  const datos = {
    nombres: texto(b.nombres), apellidos: texto(b.apellidos), carrera: texto(b.carrera),
    ciclo: texto(b.ciclo), celular: texto(b.celular),
  };
  let cambios;
  if (actual.rol === 'ESTUDIANTE') {
    const errores = validarPerfil(datos);
    if (!errores.carrera && !(await carreraExiste(datos.carrera))) errores.carrera = 'Selecciona una carrera de la lista.';
    exigirSinErrores(errores);
    cambios = {
      nombres: datos.nombres.trim(), apellidos: datos.apellidos.trim(),
      carrera: datos.carrera, ciclo: Number(datos.ciclo), celular: datos.celular || null,
    };
  } else {
    const errores = {};
    if (!datos.nombres.trim()) errores.nombres = 'Ingresa los nombres.';
    if (!datos.apellidos.trim()) errores.apellidos = 'Ingresa los apellidos.';
    const anexo = texto(b.anexo).trim();
    if (anexo && !/^\d{1,6}$/.test(anexo)) errores.anexo = 'El anexo solo lleva números (hasta seis).';
    exigirSinErrores(errores);
    cambios = { nombres: datos.nombres.trim(), apellidos: datos.apellidos.trim(), anexo: anexo || null };
  }
  // El correo y el rol no se cambian desde aquí.
  const usuario = await prisma.usuario.update({ where: { id: actual.id }, data: cambios, include: { almacen: true } });
  res.json({ usuario: publico(usuario) });
}

export async function cambiarPassword(req, res) {
  const b = req.body ?? {};
  const actual = texto(b.actual);
  const nueva = texto(b.nueva);
  const errores = {};
  if (!actual) errores.actual = 'Ingresa la contraseña actual.';
  if (!passwordValida(nueva)) errores.nueva = 'Mínimo ocho caracteres, una mayúscula y un número.';
  if (nueva !== texto(b.confirmar)) errores.confirmar = 'Las contraseñas no coinciden.';
  exigirSinErrores(errores);

  const usuario = await prisma.usuario.findUnique({ where: { id: req.auth.id } });
  if (!usuario || !(await bcrypt.compare(actual, usuario.passwordHash))) {
    throw new HttpError(400, { errores: { actual: 'La contraseña actual no es correcta.' } });
  }
  await prisma.usuario.update({ where: { id: usuario.id }, data: { passwordHash: await bcrypt.hash(nueva, RONDAS_BCRYPT) } });
  res.json({ mensaje: 'Contraseña actualizada.' });
}

// ---------- recuperación ----------

export async function solicitarRecuperacion(req, res) {
  const correo = texto(req.body?.correo).trim().toLowerCase();
  if (!correoInstitucional(correo)) throw new HttpError(400, { errores: { correo: 'Ingresa un correo institucional válido.' } });

  const usuario = await prisma.usuario.findUnique({ where: { correo } });
  if (usuario) {
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.$transaction([
      // Un enlace nuevo invalida los anteriores.
      prisma.tokenRecuperacion.updateMany({ where: { usuarioId: usuario.id, usadoEn: null }, data: { usadoEn: new Date() } }),
      prisma.tokenRecuperacion.create({
        data: { usuarioId: usuario.id, tokenHash: hashToken(token), expiraEn: new Date(Date.now() + MINUTOS_TOKEN * 60 * 1000) },
      }),
    ]);
    const enlace = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/recuperar?token=${token}`;
    await enviarCorreo({
      para: correo,
      asunto: 'Recupera tu acceso · Almacén de Equipos',
      texto: `Hola ${usuario.nombres}:\n\nPara crear una contraseña nueva abre este enlace (vence en ${MINUTOS_TOKEN} minutos):\n${enlace}\n\nSi no lo pediste, ignora este correo.`,
    });
  }
  // Siempre la misma respuesta: así no se puede averiguar qué correos están registrados.
  res.json({ mensaje: 'Si el correo está registrado, te enviamos un enlace para crear una contraseña nueva.' });
}

export async function restablecerPassword(req, res) {
  const b = req.body ?? {};
  const token = texto(b.token);
  const nueva = texto(b.nueva);
  const errores = {};
  if (!passwordValida(nueva)) errores.nueva = 'Mínimo ocho caracteres, una mayúscula y un número.';
  if (nueva !== texto(b.confirmar)) errores.confirmar = 'Las contraseñas no coinciden.';
  exigirSinErrores(errores);

  const registro = token ? await prisma.tokenRecuperacion.findUnique({ where: { tokenHash: hashToken(token) } }) : null;
  if (!registro || registro.usadoEn || registro.expiraEn < new Date()) {
    throw new HttpError(400, { error: 'El enlace no es válido o ya venció. Solicita uno nuevo.' });
  }
  await prisma.$transaction([
    prisma.usuario.update({ where: { id: registro.usuarioId }, data: { passwordHash: await bcrypt.hash(nueva, RONDAS_BCRYPT) } }),
    prisma.tokenRecuperacion.update({ where: { id: registro.id }, data: { usadoEn: new Date() } }),
  ]);
  res.json({ mensaje: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
}

// ---------- catálogos ----------

export async function listarCarreras(req, res) {
  const carreras = await prisma.carrera.findMany({ orderBy: { nombre: 'asc' } });
  res.json(carreras.map((c) => c.nombre));
}

export async function listarAlmacenes(req, res) {
  const almacenes = await prisma.almacen.findMany({ orderBy: { id: 'asc' } });
  res.json(almacenes.map((a) => a.nombre));
}

// ---------- aprobación de encargados (JEFE) ----------

const ESTADOS = ['ACTIVA', 'PENDIENTE', 'RECHAZADA'];

export async function listarEncargados(req, res) {
  const estado = texto(req.query.estado).toUpperCase();
  if (estado && !ESTADOS.includes(estado)) throw new HttpError(400, { error: 'Estado no válido.' });
  const encargados = await prisma.usuario.findMany({
    where: { rol: 'ENCARGADO', ...(estado ? { estado } : {}) },
    include: { almacen: true },
    orderBy: { creadoEn: 'desc' },
  });
  res.json(encargados.map(publico));
}

export async function cambiarEstadoEncargado(req, res) {
  const estado = texto(req.body?.estado).toUpperCase();
  if (!['ACTIVA', 'RECHAZADA'].includes(estado)) throw new HttpError(400, { error: 'El estado debe ser ACTIVA o RECHAZADA.' });
  const encargado = await prisma.usuario.findFirst({ where: { id: req.params.id, rol: 'ENCARGADO' } });
  if (!encargado) throw new HttpError(404, { error: 'Encargado no encontrado.' });
  const usuario = await prisma.usuario.update({ where: { id: encargado.id }, data: { estado }, include: { almacen: true } });
  res.json({ usuario: publico(usuario) });
}
