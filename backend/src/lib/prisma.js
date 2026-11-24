import { PrismaClient } from '@prisma/client';

// Una sola instancia para toda la API (cada HU la importa desde aquí).
export const prisma = new PrismaClient();
