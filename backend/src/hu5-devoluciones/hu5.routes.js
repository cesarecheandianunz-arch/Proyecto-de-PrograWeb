// HU-5 · Devoluciones, renovaciones, historial y pagos
// Pantallas: hu5/Devolucion, Renovacion, Historial
// Responsable: ____________
//
// Cómo implementar: crea hu5.controller.js en esta carpeta (mira hu1-cuentas como ejemplo).
// Penalidad = días de retraso × tarifa del préstamo (Prestamo.tarifa).
import { Router } from 'express';
import { requireAuth, requireRol } from '../middlewares/auth.js';
import { pendiente } from '../lib/errores.js';

const router = Router();
const encargado = [requireAuth, requireRol('ENCARGADO', 'JEFE')];
const estudiante = [requireAuth, requireRol('ESTUDIANTE')];

router.post('/encargado/prestamos/:codigo/devolucion', ...encargado, pendiente('HU-5')); // { estadoEquipo, accesorios, observaciones }
router.post('/prestamos/:codigo/renovacion', ...estudiante, pendiente('HU-5'));
router.get('/historial', ...estudiante, pendiente('HU-5'));                              // préstamos y deuda del estudiante
router.get('/encargado/historial', ...encargado, pendiente('HU-5'));                     // ?estudianteId=
router.post('/encargado/pagos', ...encargado, pendiente('HU-5'));                        // { estudianteId, monto, nota }

export default router;
