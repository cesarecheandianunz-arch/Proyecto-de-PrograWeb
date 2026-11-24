import express from 'express';
import cookieParser from 'cookie-parser';
import { manejarErrores } from './lib/errores.js';
import { prisma } from './lib/prisma.js';

// Cada HU tiene su carpeta y su router. Aquí solo se registran (una línea por HU).
import hu1 from './hu1-cuentas/hu1.routes.js';
import hu2 from './hu2-inventario/hu2.routes.js';
import hu3 from './hu3-solicitudes/hu3.routes.js';
import hu4 from './hu4-prestamos/hu4.routes.js';
import hu5 from './hu5-devoluciones/hu5.routes.js';

export const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.get('/api/salud', async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

app.use('/api', hu1);
app.use('/api', hu2);
app.use('/api', hu3);
app.use('/api', hu4);
app.use('/api', hu5);

app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use(manejarErrores);
