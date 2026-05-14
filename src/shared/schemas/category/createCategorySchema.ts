import z from 'zod';

export const createCategorySchema = z.object({
  name: z.string('¡ El nombre debe ser una cadena de texto !')
    .min(3, '¡ El nombre debe ser mayor a 3 caracteres !')
    .max(250, '¡ El nombre debe ser menor a 250 caracteres !'),
  permalink: z.string('¡ El enlace permanente debe ser una cadena de texto !')
    .min(3, '¡ El enlace permanente debe ser mayor a 3 caracteres !')
    .max(250, '¡ El enlace permanente debe ser menor a 250 caracteres !')
    .refine(
      (value) => !/\s/.test(value),
      { message: '¡ El enlace permanente no debe contener espacios,\nremplace espacios con guiones medios o bajos !' },
    )
    .refine(
      (value) => !/[áéíóúÁÉÍÓÚ]/.test(value),
      { message: '¡ El enlace permanente no debe contener acentos (á, é, í, ó, ú) !' },
    )
    .refine(
      (value) => !/[ñÑ]/.test(value),
      { message: '¡ El enlace permanente no debe contener la letra ñ !' },
    )
    .refine(
      (value) => /^[a-zA-Z0-9_-]+$/.test(value),
      { message: '¡ El enlace permanente solo puede contener letras, números, guiones y guiones bajos !' },
    ),
});
