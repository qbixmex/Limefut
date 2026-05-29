import z from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const CreateAnnouncementSchema = z.object({
  title: z
    .string('¡ El nombre debe ser una cadena de texto !')
    .min(3, { message: '¡ El título debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ El título debe ser menor a 200 caracteres !' }),
  permalink: z
    .string('¡ El nombre debe ser una cadena de texto !')
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(200, { message: '¡ El nombre debe ser menor a 200 caracteres !' }),
  publishedDate: z
    .date({ message: 'Selecciona la fecha de publicación' }),
  description: z
    .string('¡ La descripción debe ser una cadena de texto !')
    .min(3, { message: '¡ La descripción debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ La descripción debe ser menor a 250 caracteres !' }),
  content: z
    .string('¡ El contenido debe ser una cadena de texto !')
    .min(4, { message: '¡ El contenido debe ser mayor a 3 caracteres !' }),
  image: z
    .instanceof(File, { message: 'La imagen debe ser un archivo' })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  active: z.boolean('¡ Activo debe ser un valor boleano !').optional(),
});
