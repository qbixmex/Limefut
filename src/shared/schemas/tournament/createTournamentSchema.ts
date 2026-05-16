import z from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const createTournamentSchema = z.object({
  name: z.string('¡ El nombre debe ser una cadena de texto !')
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ El nombre debe ser menor a 250 caracteres !' }),
  permalink: z.string('¡ El enlace permanente debe ser una cadena de texto !')
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
  image: z
    .instanceof(File, { message: 'La imagen debe ser un archivo' })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 2MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  categoriesIds: z.array(z.uuid('¡ El valor debe ser un UUID válido !')).optional(),
  format: z.union([
    z.literal(''),
    z.string('El formato debe ser una cadena de texto')
      .min(1, { message: 'El formato debe ser mayor a 1 caracteres' })
      .max(100, { message: 'El formato debe ser menor a 100 caracteres' }),
  ]).optional(),
  gender: z.union([
    z.literal(''),
    z.string('¡ El género debe ser una cadena de texto !')
      .min(1, { message: '¡ El género debe es obligatorio !' })
      .max(50, { message: '¡ El género debe ser menor a 50 caracteres !' }),
  ]).optional(),
  country: z.union([
    z.literal(''),
    z.string('¡ El país debe ser una cadena de texto !')
      .min(3, { message: '¡ El país debe ser mayor a 3 caracteres !' })
      .max(100, { message: '¡ El país debe ser menor a 100 caracteres !' })
  ]).optional(),
  state: z.union([
    z.literal(''),
    z.string('¡ El estado debe ser una cadena de texto !')
      .min(3, { message: '¡ El estado debe ser mayor a 3 caracteres !' })
      .max(100, { message: '¡ El estado debe ser menor a 100 caracteres !' })
  ]).optional(),
  city: z.union([
    z.literal(''),
    z.string('¡ La ciudad debe ser una cadena de texto !')
      .min(3, { message: '¡ La ciudad debe ser mayor a 3 caracteres !' })
      .max(100, { message: '¡ La ciudad debe ser menor a 100 caracteres !' })
  ]).optional(),
  description: z.union([
    z.literal(''),
    z.string('¡ La descripción debe ser una cadena de texto !')
      .min(3, { message: '¡ La descripción debe ser mayor a 3 caracteres !' })
  ]).optional(),
  season: z.union([
    z.literal(''),
    z.string('¡ La temporada debe ser una cadena de texto !')
      .min(3, { message: '¡ La temporada debe ser mayor a 3 caracteres !' })
      .max(200, { message: '¡ La temporada debe ser menor a 200 caracteres !' })
  ]).optional(),
  startDate: z.date({ message: 'La fecha de inicio debe ser una fecha válida' }),
  endDate: z.date({ message: 'La fecha final debe ser una fecha válida' }),
  currentWeek: z
    .int('¡ La semana actual debe ser un número válido !')
    .min(0, { message: '¡ La semana actual debe ser un número positivo !' })
    .optional(),
  active: z.boolean().optional(),
});
