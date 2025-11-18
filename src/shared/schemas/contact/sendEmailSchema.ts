import z from "zod";

export const sendMessageSchema = z.object({
  name: z.string("El nombre deber ser una cadena de texto")
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' }),
  email: z.email("¡ Formato de email incorrecto !"),
  message: z.string("¡ El mensaje deber ser una cadena de texto !")
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ El nombre debe ser menor a 50 caracteres !' }),
});
