import z from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const createSponsorSchema = z.object({
  name: z
    .string('¡ El nombre debe ser una cadena de texto !')
    .min(3, { message: '¡ El name debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ El name debe ser menor a 250 caracteres !' }),
  url: z
    .string('¡ El URL debe ser una cadena de texto !')
    .min(3, { message: '¡ El URL debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ El URL debe ser menor a 250 caracteres !' })
    .optional(),
  startDate: z
    .date({ message: 'La fecha inicial debe ser una fecha válida' })
    .optional(),
  endDate: z
    .date({ message: 'La fecha final debe ser una fecha válida' })
    .optional(),
  position: z
    .string('¡ La posición debe ser una cadena de texto !'),
  clicks: z
    .int()
    .min(0, { message: '¡ Los clicks deben ser un número positivo !' })
    .optional(),
  image: z
    .instanceof(File, { message: 'La imagen debe ser un archivo' })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 2MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  active: z.boolean('¡ Activo debe ser un valor boleano !').optional(),
});
