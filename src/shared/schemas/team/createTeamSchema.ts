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
  division: z.string()
    .min(3, { message: '¡ La división debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La división debe ser menor a 200 caracteres !' }),
  group: z.string()
    .min(3, { message: '¡ El grupo debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El grupo debe ser menor a 100 caracteres !' }),
  tournamentId: z.uuid("El id del torneo debe ser un UUID válido"),
  country: z.string()
    .min(3, { message: '¡ El país debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El país debe ser menor a 100 caracteres !' }),
  state: z.string()
    .min(3, { message: '¡ El estado debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El estado debe ser menor a 100 caracteres !' }),
  city: z.string()
    .min(3, { message: '¡ La ciudad debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ La ciudad debe ser menor a 100 caracteres !' }),
  coachId: z.uuid("El id del entrenador debe ser un UUID válido"),
  emails: z.array(z.string())
    .refine(
      (emails) => emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
      { message: '¡ Todos los correos electrónicos deben tener un formato válido !' }
    )
    .optional(),
  address: z.string()
    .min(10, { message: '¡ La dirección debe ser mayor a 10 caracteres !' })
    .max(250, { message: '¡ La dirección debe ser menor a 250 caracteres !' })
    .optional()
    .or(z.literal('')),
  active: z.boolean().optional(),
});
