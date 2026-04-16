import z from 'zod';

export const createFieldSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ El nombre debe ser menor a 250 caracteres !' }),
  permalink: z.string()
    .min(3, { message: '¡ El enlace permanente debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ El enlace permanente debe ser menor a 250 caracteres !' })
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
  city: z.union([
    z.literal(''),
    z.string()
      .min(3, { message: '¡ La ciudad debe ser mayor a 3 caracteres !' })
      .max(255, { message: '¡ La ciudad debe ser menor a 255 caracteres !' }),
  ]).optional(),
  state: z.union([
    z.literal(''),
    z.string()
      .min(3, { message: '¡ El estado debe ser mayor a 3 caracteres !' })
      .max(255, { message: '¡ El estado debe ser menor a 255 caracteres !' }),
  ]).optional(),
  country: z.union([
    z.literal(''),
    z.string()
      .min(3, { message: '¡ El país debe ser mayor a 3 caracteres !' })
      .max(255, { message: '¡ El país debe ser menor a 255 caracteres !' }),
  ]).optional(),
  address: z.union([
    z.literal(''),
    z.string()
      .min(3, { message: '¡ La dirección debe ser mayor a 3 caracteres !' })
      .max(255, { message: '¡ La dirección debe ser menor a 255 caracteres !' }),
  ]).optional(),
  map: z.union([
    z.literal(''),
    z.string()
      .min(3, { message: '¡ El mapa debe ser mayor a 3 caracteres !' })
      .max(255, { message: '¡ El mapa debe ser menor a 255 caracteres !' }),
  ]).optional(),
});
