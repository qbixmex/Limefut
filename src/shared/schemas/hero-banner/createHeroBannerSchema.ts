import z from "zod";
import { ALIGNMENT } from "@/shared/enums";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const createHeroBannerSchema = z.object({
  title: z
    .string('¡ El título debe ser una cadena de texto !')
    .min(3, { message: '¡ El título debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ El título debe ser menor a 250 caracteres !' }),
  description: z
    .string('¡ La descripción debe ser una cadena de texto !')
    .min(3, { message: '¡ La descripción debe ser mayor a 3 caracteres !' })
    .max(300, { message: '¡ La descripción debe ser menor a 300 caracteres !' }),
  image: z
    .instanceof(File, { message: "La imagen debe ser un archivo" })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo de la imagen deber ser menor a 1MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .nullish(),
  dataAlignment: z
    .enum(
      Object.values(ALIGNMENT) as [string, ...string[]],
      { message: "¡ Seleccione una opción !" },
    )
    .nullish()
    .optional(),
  showData: z.boolean().optional(),
  position: z
    .number('¡ La posición debe ser un número válido !')
    .optional(),
  active: z.boolean("¡ Activo debe ser un valor boleano !").optional(),
});
