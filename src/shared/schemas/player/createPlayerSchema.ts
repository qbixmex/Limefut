import z from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const createPlayerSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' }),
  email: z.union([
    z.literal(''),
    z.email({ message: '¡ Formato de correo electrónico incorrecto !' }),
  ]).optional(),
  phone: z.union([
    z.literal(''),
    z.string()
    .min(5, { message: '¡ El teléfono debe ser mayor a 5 caracteres !' })
    .max(100, { message: '¡ El teléfono debe ser menor a 100 caracteres !' }),
  ]).optional(),
  birthday: z
    .date({ message: 'La fecha de nacimiento debe ser una fecha válida' })
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
      (value) => value === '' || z.string().uuid().safeParse(value).success,
      { message: '¡ El id del equipo debe ser un UUID válido o vacío !' },
    )
    .nullish(),
});
