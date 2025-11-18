"use server";

import nodeMailer from 'nodemailer';
import { sendMessageSchema } from "@/shared/schemas";

const sendEmailAction = async (formData: FormData) => {
  const rawData = {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    message: formData.get('message') ?? '',
  };

  const formVerified = sendMessageSchema.safeParse(rawData);

  if (!formVerified.success) {
    return {
      ok: false,
      message: formVerified.error.message,
    };
  }

  const MAILER_SERVICE = process.env.MAILER_SERVICE ?? '';
  const MAILER_EMAIL = process.env.MAILER_EMAIL ?? '';
  const MAILER_TO = process.env.MAILER_TO ?? '';
  const MAILERS_TO = process.env.MAILERS_TO ?? '';
  const MAILER_SECRET_KEY = process.env.MAILER_SECRET_KEY ?? '';

  const transporter = nodeMailer.createTransport({
    service: MAILER_SERVICE,
    auth: {
      user: MAILER_EMAIL,
      pass: MAILER_SECRET_KEY,
    },
  });

  const { name, email, message } = formVerified.data;

  const htmlMessage = '<h1>Detalles del mensaje</h1>'
    + '<h2>Remitente</h2>'
    + '<ul>'
    + `<li><b>Nombre:</b> ${name}</li>`
    + `<li><b>Email:</b> ${email}</li>`
    + '</ul>'
    + `<h2>Mensaje:</h2>`
    + `<p>${message}</p>`;

  try {
    await transporter.sendMail({
      from: name,
      to: MAILER_TO,
      cc: MAILERS_TO ?? undefined,
      subject: `Mensaje de ${name} del sitio Limefut`,
      html: htmlMessage,
    });
    return {
      ok: true,
      message: 'Mensaje enviado correctamente 👍',
    };
  } catch (error) {
    console.error('There was an error:', error);
    return {
      ok: false,
      message: '¡ No se pudo enviar el mensaje 🚩 !',
    };
  }
};

export default sendEmailAction;
