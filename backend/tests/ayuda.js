// Levanta la API en un puerto libre y da un `pedir` que conserva la cookie de sesión.
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

export async function iniciarServidor() {
  const servidor = app.listen(0);
  await new Promise((r) => servidor.once('listening', r));
  const base = `http://localhost:${servidor.address().port}/api`;
  return {
    base,
    cerrar: async () => { servidor.close(); await prisma.$disconnect(); },
  };
}

// Cliente con su propia "cookie jar" (un navegador distinto por cliente).
export function cliente(base) {
  let cookie = '';
  return async function pedir(metodo, ruta, cuerpo) {
    const res = await fetch(base + ruta, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
    const nueva = res.headers.get('set-cookie');
    if (nueva) cookie = nueva.split(';')[0];
    const texto = await res.text();
    return { status: res.status, body: texto ? JSON.parse(texto) : null, setCookie: nueva };
  };
}
