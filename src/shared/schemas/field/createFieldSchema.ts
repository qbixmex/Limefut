import z from 'zod';

export const createFieldSchema = z.object({
  name: z.string('El nombre debe ser una cadena de texto')
    .min(3, { message: 'El nombre debe ser mayor a 3 caracteres' })
    .max(250, { message: 'El nombre debe ser menor a 250 caracteres' }),
  permalink: z.string('El enlace permanente debe ser una cadena de texto')
    .min(3, { message: 'El enlace permanente debe ser mayor a 3 caracteres' })
    .max(250, { message: 'El enlace permanente debe ser menor a 250 caracteres' })
    .refine(
      (value) => !/\s/.test(value),
      { message: 'El enlace permanente no debe contener espacios,\nremplace espacios con guiones medios o bajos' },
    )
    .refine(
      (value) => !/[áéíóúÁÉÍÓÚ]/.test(value),
      { message: 'El enlace permanente no debe contener acentos (á, é, í, ó, ú)' },
    )
    .refine(
      (value) => !/[ñÑ]/.test(value),
      { message: 'El enlace permanente no debe contener la letra ñ' },
    )
    .refine(
      (value) => /^[a-zA-Z0-9_-]+$/.test(value),
      { message: 'El enlace permanente solo puede contener letras, números, guiones y guiones bajos' },
    ),
  country: z
    .string('El país debe ser una cadena de texto')
    .refine((value) => value === '' || value.length >= 3, {
      message: 'El país debe ser mayor a 3 caracteres',
    })
    .max(250, { message: 'El país debe ser menor a 250 caracteres' })
    .optional(),
  city: z
    .string('La ciudad debe ser una cadena de texto')
    .refine((value) => value === '' || value.length >= 3, {
      message: 'La ciudad debe ser mayor a 3 caracteres',
    })
    .max(250, { message: 'La ciudad debe ser menor a 250 caracteres' })
    .optional(),
  state: z
    .string('El estado debe ser una cadena de texto')
    .refine((value) => value === '' || value.length >= 3, {
      message: 'El estado debe ser mayor a 3 caracteres',
    })
    .max(250, { message: 'El estado debe ser menor a 250 caracteres' })
    .optional(),
  address: z
    .string('La dirección debe ser una cadena de texto')
    .refine((value) => value === '' || value.length >= 3, {
      message: 'La dirección debe ser mayor a 3 caracteres',
    })
    .max(250, { message: 'La dirección debe ser menor a 250 caracteres' })
    .optional(),
  map: z
    .string('El mapa debe ser una cadena de texto')
    .refine((value) => value === '' || value.length >= 3, {
      message: 'El mapa debe ser mayor a 3 caracteres',
    })
    .max(255, { message: 'El mapa debe ser menor a 255 caracteres' })
    .optional(),
});
