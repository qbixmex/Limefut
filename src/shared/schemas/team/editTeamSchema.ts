import z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1; // 1MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const editTeamSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' })
    .optional(),
  permalink: z.string()
    .min(3, { message: '¡ El enlace permanente debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El enlace permanente debe ser menor a 100 caracteres !' })
    .optional(),
  headquarters: z.string()
    .min(3, { message: '¡ La sede debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La sede debe ser menor a 200 caracteres !' })
    .optional(),
  image: z.instanceof(File)
    .refine((file) => file.size <= MAX_UPLOAD_SIZE, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), `El tipo de archivo debe ser uno de los siguientes: ${ACCEPTED_FILE_TYPES.join(', ')}`)
    .nullish(),
  division: z.string()
    .min(3, { message: '¡ La división debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La división debe ser menor a 200 caracteres !' })
    .optional(),
  group: z.string()
    .min(3, { message: '¡ El grupo debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El grupo debe ser menor a 100 caracteres !' })
    .optional(),
  tournament: z.string()
    .min(3, { message: '¡ El torneo debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ El torneo debe ser menor a 200 caracteres !' })
    .optional(),
  country: z.string()
    .min(3, { message: '¡ El país debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El país debe ser menor a 100 caracteres !' })
    .optional(),
  state: z.string()
    .min(3, { message: '¡ El estado debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El estado debe ser menor a 100 caracteres !' })
    .optional(),
  city: z.string()
    .min(3, { message: '¡ La ciudad debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ La ciudad debe ser menor a 100 caracteres !' })
    .optional(),
  coach: z.string()
    .min(3, { message: '¡ El entrenador debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El entrenador debe ser menor a 100 caracteres !' })
    .optional(),
  emails: z.array(z.string())
    .refine(
      (emails) => emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
      { message: '¡ Todos los correos electrónicos deben tener un formato válido !' }
    )
    .optional(),
  address: z.string()
    .min(10, { message: '¡ La dirección debe ser mayor a 10 caracteres !' })
    .max(250, { message: '¡ La dirección debe ser menor a 250 caracteres !' })
    .optional(),
  active: z.boolean().optional(),
});
