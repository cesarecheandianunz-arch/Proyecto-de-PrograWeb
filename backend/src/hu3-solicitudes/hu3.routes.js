// HU-3 · Catálogo y solicitudes del estudiante
// Pantallas: hu3/Catalogo, DetalleCatalogo, Solicitar, MisSolicitudes, DetalleSolicitud
// Responsable: ____________
//
// Cómo implementar: crea hu3.controller.js en esta carpeta (mira hu1-cuentas como ejemplo).
// El estudiante de la sesión está en req.auth.id (no lo recibas en el body).
// Reglas que ya existen en el front: src/utils/prestamos.js y src/utils/operaciones.js
import { Router } from 'express';
import { requireAuth, requireRol } from '../middlewares/auth.js';
import { pendiente } from '../lib/errores.js';

const router = Router();
const estudiante = [requireAuth, requireRol('ESTUDIANTE')];

router.get('/catalogos/cursos', pendiente('HU-3'));
router.get('/equipos/:id/disponibilidad', pendiente('HU-3'));          // ?inicio=AAAA-MM-DD&fin=AAAA-MM-DD

router.post('/solicitudes', ...estudiante, pendiente('HU-3'));         // { equipoId, curso, motivo, inicio, fin }
router.get('/solicitudes/mias', ...estudiante, pendiente('HU-3'));
router.get('/solicitudes/:codigo', ...estudiante, pendiente('HU-3'));
router.patch('/solicitudes/:codigo/cancelar', ...estudiante, pendiente('HU-3'));

export default router;
