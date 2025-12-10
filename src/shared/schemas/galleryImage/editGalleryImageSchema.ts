import z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const editGalleryImageSchema = z.object({
  title: z.string('¡ El título debe ser una cadena de texto !')
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' })
    .optional(),
  permalink: z.string('¡ El enlace permanente debe ser una cadena de texto !')
    .min(3, { message: '¡ El enlace permanente debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El enlace permanente debe ser menor a 100 caracteres !' }),
  image: z.instanceof(File)
    .refine((file) => file.size <= MAX_UPLOAD_SIZE, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), `El tipo de archivo debe ser uno de los siguientes: ${ACCEPTED_FILE_TYPES.join(', ')}`)
    .nullish(),
  active: z.boolean().optional(),
});
