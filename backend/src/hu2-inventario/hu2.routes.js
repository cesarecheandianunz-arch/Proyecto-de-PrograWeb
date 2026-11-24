// HU-2 · Inventario (equipos y unidades)
// Pantallas: hu2/Inventario, NuevoEquipo, DetalleEquipo, FichaPublicaEquipo
// Responsable: ____________
//
// Cómo implementar: crea hu2.controller.js en esta carpeta (mira hu1-cuentas como ejemplo)
// y cambia cada `pendiente('HU-2')` por la función del controlador.
// Reglas de negocio que ya existen en el front: src/pages/hu2/inventarioUtils.js
import { Router } from 'express';
import { requireAuth, requireRol } from '../middlewares/auth.js';
import { pendiente } from '../lib/errores.js';

const router = Router();
const encargado = [requireAuth, requireRol('ENCARGADO', 'JEFE')];

// Públicas (catálogo y ficha pública)
router.get('/equipos', pendiente('HU-2'));                 // lista con libres/total, ?buscar=&categoria=
router.get('/equipos/:id', pendiente('HU-2'));             // ficha con unidades y condiciones
router.get('/catalogos/categorias', pendiente('HU-2'));

// Encargado
router.post('/equipos', ...encargado, pendiente('HU-2'));
router.put('/equipos/:id', ...encargado, pendiente('HU-2'));
router.get('/equipos/:id/unidades', ...encargado, pendiente('HU-2'));
router.post('/equipos/:id/unidades', ...encargado, pendiente('HU-2'));
router.patch('/unidades/:codigo', ...encargado, pendiente('HU-2')); // estado, ubicación, observación

export default router;
