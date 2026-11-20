import { Resend } from "resend";
import { template } from "../templates";

// Envía el correo de prueba y retorna { data } si resulta o { error } si falla
export async function enviarPostulacion() {
  // Se crea aquí y no al importar: sin .env, la app sigue funcionando y solo falla el envío
  if (!process.env.RESEND_API_KEY) {
    return { error: { message: "Falta RESEND_API_KEY en el archivo .env" } };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "AquaChile <onboarding@resend.dev>",
    to: [process.env.CORREO_PRUEBA],
    subject: "Confirmación de postulación - AquaChile",
    html: template,
  });

  if (error) return { error };
  return { data };
}
