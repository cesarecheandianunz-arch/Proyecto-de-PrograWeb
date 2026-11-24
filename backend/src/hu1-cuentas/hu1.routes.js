// HU-1 · Cuentas: registro, acceso, perfil y recuperación
// Pantallas: hu1/Login, Registro, RegistroEncargado, Recuperar, MiCuenta
import { Router } from 'express';
import { requireAuth, requireRol } from '../middlewares/auth.js';
import * as c from './hu1.controller.js';

const router = Router();

// Acceso
router.post('/auth/registro', c.registrarEstudiante);
router.post('/auth/registro-encargado', c.registrarEncargado);
router.post('/auth/login', c.login);
router.post('/auth/logout', c.logout);
router.get('/auth/me', requireAuth, c.me);

// Recuperación de contraseña
router.post('/auth/recuperar', c.solicitarRecuperacion);
router.post('/auth/restablecer', c.restablecerPassword);

// Mi cuenta
router.patch('/usuarios/me', requireAuth, c.actualizarPerfil);
router.patch('/usuarios/me/password', requireAuth, c.cambiarPassword);

// Catálogos de los formularios de registro
router.get('/catalogos/carreras', c.listarCarreras);
router.get('/catalogos/almacenes', c.listarAlmacenes);

// Aprobación de encargados (jefe de laboratorio)
router.get('/encargados', requireAuth, requireRol('JEFE'), c.listarEncargados);
router.patch('/encargados/:id/estado', requireAuth, requireRol('JEFE'), c.cambiarEstadoEncargado);

export default router;
