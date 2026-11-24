import nodemailer from 'nodemailer';

// En desarrollo los correos llegan a Mailpit (http://localhost:8026), no a buzones reales.
const transporte = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT) || 1026,
  secure: false,
});

export async function enviarCorreo({ para, asunto, texto }) {
  try {
    await transporte.sendMail({ from: process.env.CORREO_REMITENTE, to: para, subject: asunto, text: texto });
  } catch (err) {
    // Si Mailpit no está levantado, el flujo sigue y el contenido queda en la consola.
    console.warn(`[correo] No se pudo enviar a ${para} (${err.code || err.message}). Contenido:\n${texto}`);
  }
}
