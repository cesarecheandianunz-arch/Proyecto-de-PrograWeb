
import { Router } from 'express';
import { requireAuth, requireRol } from '../middlewares/auth.js';
import { pendiente } from '../lib/errores.js';
import { obtenerEquipos, obtenerEquipoPorId, obtenerCategorias} from './hu2.controller.js';

const router = Router();

const encargado = [
    requireAuth,
    requireRol('ENCARGADO', 'JEFE')
];

// Públicas
router.get('/equipos', obtenerEquipos);
router.get('/equipos/:id', obtenerEquipoPorId);
router.get('/catalogos/categorias', obtenerCategorias);

// Encargado
router.post('/equipos', ...encargado, pendiente('HU-2'));
router.put('/equipos/:id', ...encargado, pendiente('HU-2'));
router.get('/equipos/:id/unidades', ...encargado, pendiente('HU-2'));
router.post('/equipos/:id/unidades', ...encargado, pendiente('HU-2'));
router.patch('/unidades/:codigo', ...encargado, pendiente('HU-2'));

export default router;
