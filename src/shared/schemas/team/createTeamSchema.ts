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
  headquarters: z.string()
    .min(3, { message: '¡ La sede debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La sede debe ser menor a 200 caracteres !' })
    .optional(),
  image: z
    .instanceof(File, { message: "La imagen debe ser un archivo" })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  category: z.string()
    .min(3, { message: '¡ La categoría debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La categoría debe ser menor a 200 caracteres !' })
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
