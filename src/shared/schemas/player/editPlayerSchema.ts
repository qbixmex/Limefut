import z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1; // 1MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const editPlayerSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' })
    .optional(),
  email: z.string()
    .min(1, { message: '¡ El correo electrónico es obligatorio !' })
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: '¡ Formato incorrecto del correo electrónico !' }
    )
    .optional(),
  phone: z.string()
    .min(12, { message: '¡ El teléfono debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El teléfono debe ser menor a 100 caracteres !' })
    .optional(),
  birthday: z
    .date({ message: "La fecha de nacimiento debe ser una fecha válida" })
    .optional(),
  nationality: z.string()
    .min(3, { message: '¡ La nacionalidad debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ La nacionalidad debe ser menor a 100 caracteres !' })
    .optional(),
  image: z
    .instanceof(File, { message: 'La imagen debe ser un archivo' })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  active: z.boolean().optional(),
  teamId: z
    .string()
    .refine(
      (value) => value === '' || z.uuid().safeParse(value).success,
      { message: '¡ El id del equipo debe ser un UUID válido o vacío !' }
    )
    .nullish(),
});
