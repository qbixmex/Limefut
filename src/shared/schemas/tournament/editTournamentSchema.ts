import z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1; // 1MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const editTournamentSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ El nombre debe ser menor a 250 caracteres !' })
    .optional(),
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
    )
    .optional(),
  image: z
    .instanceof(File, { message: "La imagen debe ser un archivo" })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  description: z.string()
    .min(3, { message: '¡ La descripción debe ser mayor a 3 caracteres !' })
    .optional(),
  category: z
    .string('¡ La categoría debe ser una cadena de texto !')
    .min(3, { message: '¡ La categoría debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La categoría debe ser menor a 200 caracteres !' })
    .optional(),
  format: z
    .string('¡ El formato debe ser una cadena de texto !')
    .min(1, { message: '¡ El formato debe ser mayor a 1 caracteres !' })
    .max(100, { message: '¡ El formato debe ser menor a 100 caracteres !' })
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
  season: z.string()
    .min(3, { message: '¡ La temporada debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ La temporada debe ser menor a 200 caracteres !' })
    .optional(),
  startDate: z.date({ message: "La fecha de inicio debe ser una fecha válida" }).optional(),
  endDate: z.date({ message: "La fecha final debe ser una fecha válida" }).optional(),
  currentWeek: z
    .int("¡ La semana actual debe ser un número válido !")
    .min(0, { message: "¡ La semana actual debe ser un número positivo !" })
    .optional(),
  active: z.boolean().optional(),
});
