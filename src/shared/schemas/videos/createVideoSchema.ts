import z from 'zod';

export const createVideoSchema = z.object({
  title: z
    .string('¡ El nombre debe ser una cadena de texto !')
    .min(3, { message: '¡ El título debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ El título debe ser menor a 200 caracteres !' }),
  permalink: z
    .string('¡ El nombre debe ser una cadena de texto !')
    .min(3, { message: '¡ El enlace permanente debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ El enlace permanente debe ser menor a 200 caracteres !' }),
  url: z
    .string('¡ El URL debe ser una cadena de texto !')
    .min(3, { message: '¡ El URL debe ser mayor a 3 caracteres !' }),
  publishedDate: z
    .date({ message: 'Selecciona la fecha de publicación' }),
  description: z
    .string('¡ La descripción debe ser una cadena de texto !')
    .min(3, { message: '¡ La descripción debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ La descripción debe ser menor a 250 caracteres !' }),
  active: z.boolean('¡ Activo debe ser un valor boleano !').optional(),
});
