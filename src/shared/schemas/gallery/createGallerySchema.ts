import z from "zod";

export const createGallerySchema = z.object({
  title: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' }),
  permalink: z.string()
    .min(3, { message: '¡ El enlace permanente debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El enlace permanente debe ser menor a 100 caracteres !' }),
  galleryDate: z.date({ message: "La fecha de la galería debe ser una fecha válida" }),
  active: z.boolean().optional(),
});
