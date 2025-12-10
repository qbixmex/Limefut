import z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1; // 1MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const createCoachSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' }),
  email: z.string()
    .min(1, { message: '¡ El correo electrónico es obligatorio !' })
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: '¡ Formato incorrecto del correo electrónico !' },
    ),
  phone: z.string()
    .min(12, { message: '¡ El teléfono debe ser mayor a 12 caracteres !' })
    .max(100, { message: '¡ El teléfono debe ser menor a 100 caracteres !' })
    .optional(),
  age: z.int()
    .min(1, { message: '¡ La edad debe ser mayor a 1 !' })
    .max(100, { message: '¡ La edad debe ser menor a 100 !' })
    .optional(),
  nationality: z.string()
    .min(3, { message: '¡ La nacionalidad debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ La nacionalidad debe ser menor a 100 caracteres !' })
    .optional(),
  image: z
    .instanceof(File, { message: "La imagen debe ser un archivo" })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  description: z.string()
    .min(8, { message: '¡ La descripción debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ La descripción debe ser menor a 250 caracteres !' })
    .optional(),
  active: z.boolean().optional(),
  teamsIds: z.array(z.uuid("¡ El valor debe ser un UUID válido !")).optional(),
});
