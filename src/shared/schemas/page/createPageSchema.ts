import z from "zod";
import { ROBOTS } from "../../interfaces";

export const createPageSchema = z.object({
  title: z.string('¡ El título debe ser una cadena de texto !')
    .min(3, { message: '¡ El título debe ser mayor a 3 caracteres !' })
    .max(255, { message: '¡ El título debe ser menor a 255 caracteres !' }),
  permalink: z.string('¡ El enlace permanente debe ser una cadena de texto !')
    .min(3, { message: '¡ El enlace permanente debe ser mayor a 3 caracteres !' })
    .max(255, { message: '¡ El enlace permanente debe ser menor a 255 caracteres !' }),
  content: z.string('¡ El contenido debe ser una cadena de texto !')
    .min(1, { message: '¡ El contenido es obligatorio !' }),
  seoTitle: z.string('¡ El título SEO debe ser una cadena de texto')
    .min(3, { message: '¡ El título SEO debe ser mayor a 3 caracteres !' })
    .max(70, { message: '¡ El título SEO debe ser menor a 70 caracteres !' })
    .optional(),
  seoDescription: z.string('¡ La descripción SEO debe ser una cadena de texto')
    .min(3, { message: '¡ La descripción SEO debe ser mayor a 3 caracteres !' })
    .max(160, { message: '¡ La descripción SEO debe ser menor a 160 caracteres !' })
    .optional(),
  seoRobots: z
    .enum(
      Object.values(ROBOTS) as [string, ...string[]],
      { message: "¡ Seleccione una opción de Robots SEO !" },
    ),
  active: z.boolean().optional(),
});
