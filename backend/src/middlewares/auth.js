import jwt from 'jsonwebtoken';
import { HttpError } from '../lib/errores.js';

export const COOKIE_SESION = 'sesion';

// Exige una sesión válida. Deja en req.auth = { id, rol }.
export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_SESION];
  if (!token) throw new HttpError(401, { error: 'Inicia sesión para continuar.' });
  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { id: datos.sub, rol: datos.rol };
    next();
  } catch {
    throw new HttpError(401, { error: 'Tu sesión venció. Inicia sesión otra vez.' });
  }
}

// Uso: router.get('/ruta', requireAuth, requireRol('ENCARGADO', 'JEFE'), controlador)
export function requireRol(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.auth?.rol)) throw new HttpError(403, { error: 'No tienes permiso para esta acción.' });
    next();
  };
}
