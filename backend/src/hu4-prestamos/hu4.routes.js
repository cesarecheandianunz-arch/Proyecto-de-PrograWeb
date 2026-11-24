// HU-4 · Bandeja del encargado, entrega y préstamos activos
// Pantallas: hu4/Bandeja, RegistrarEntrega, Constancia, Prestamos
// Responsable: ____________
//
// Cómo implementar: crea hu4.controller.js en esta carpeta (mira hu1-cuentas como ejemplo).
// Aprobar y entregar cambian varias tablas a la vez: usa prisma.$transaction([...]).
import { Router } from 'express';
import { requireAuth, requireRol } from '../middlewares/auth.js';
import { pendiente } from '../lib/errores.js';

const router = Router();
const encargado = [requireAuth, requireRol('ENCARGADO', 'JEFE')];

router.get('/encargado/solicitudes', ...encargado, pendiente('HU-4'));                    // ?estado=ENVIADA
router.patch('/encargado/solicitudes/:codigo/aprobar', ...encargado, pendiente('HU-4'));  // { unidadCodigo, autorizacionDocente }
router.patch('/encargado/solicitudes/:codigo/rechazar', ...encargado, pendiente('HU-4')); // { motivo }

router.post('/encargado/prestamos', ...encargado, pendiente('HU-4'));                     // entrega: { solicitudCodigo, accesorios, observaciones }
router.get('/encargado/prestamos', ...encargado, pendiente('HU-4'));                      // ?estado=ACTIVO&vencidos=true
router.get('/prestamos/:codigo/constancia', requireAuth, pendiente('HU-4'));

export default router;
