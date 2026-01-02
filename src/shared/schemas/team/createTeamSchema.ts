import z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1; // 1MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const createTeamSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' }),
  permalink: z.string()
    .min(3, { message: '¡ El enlace permanente debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El enlace permanente debe ser menor a 100 caracteres !' }),
  headquarters: z.string()
    .min(3, { message: '¡ La sede debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La sede debe ser menor a 200 caracteres !' }),
  image: z
    .instanceof(File, { message: "La imagen debe ser un archivo" })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  category: z.string()
    .min(3, { message: '¡ La categoría debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La categoría debe ser menor a 200 caracteres !' }),
  format: z.string()
    .min(1, { message: '¡ El formato debe ser mayor a 1 caracteres !' })
    .max(100, { message: '¡ El formato debe ser menor a 100 caracteres !' }),
  gender: z.enum(['male', 'female'], {
    error: '¡ Debes seleccionar al menos un género !',
  }),
  tournamentId: z.union([
    z.uuid("El id del torneo debe ser un UUID válido"),
    z.literal(''),
    z.null(),
  ]).optional(),
  country: z.string()
    .min(3, { message: '¡ El país debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El país debe ser menor a 100 caracteres !' }),
  state: z.string()
    .min(3, { message: '¡ El estado debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El estado debe ser menor a 100 caracteres !' }),
  city: z.string()
    .min(3, { message: '¡ La ciudad debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ La ciudad debe ser menor a 100 caracteres !' }),
  coachId: z.union([
    z.uuid("El id del entrenador debe ser un UUID válido"),
    z.literal(''),
    z.null(),
  ]).optional(),
  emails: z.array(z.string())
    .refine(
      (emails) => emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
      { message: '¡ Todos los correos electrónicos deben tener un formato válido !' },
    )
    .optional(),
  address: z.union([
    z.string("¡ La dirección debe ser una cadena de texto !")
      .min(10, { message: '¡ La dirección debe ser mayor a 10 caracteres !' })
      .max(250, { message: '¡ La dirección debe ser menor a 250 caracteres !' }),
    z.literal(''),
    z.null(),
  ]).optional(),
  active: z.boolean().optional(),
});
