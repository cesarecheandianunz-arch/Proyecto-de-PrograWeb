// Error con código HTTP. Express 5 captura los `throw` dentro de funciones async.
//   throw new HttpError(400, { errores: { correo: '...' } })  → errores por campo (formularios)
//   throw new HttpError(403, { error: 'Acceso denegado' })    → mensaje general
export class HttpError extends Error {
  constructor(status, cuerpo) {
    super(cuerpo?.error || 'Error HTTP ' + status);
    this.status = status;
    this.cuerpo = cuerpo;
  }
}

// Lanza 400 si el objeto de errores por campo no está vacío.
export function exigirSinErrores(errores) {
  if (Object.keys(errores).length > 0) throw new HttpError(400, { errores });
}

// Para las rutas que todavía no implementa su HU.
export function pendiente(hu) {
  return (req, res) => res.status(501).json({ error: `Pendiente (${hu}): ${req.method} ${req.originalUrl}` });
}

export function manejarErrores(err, req, res, next) {
  if (err instanceof HttpError) return res.status(err.status).json(err.cuerpo);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'El cuerpo no es un JSON válido.' });
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
}
