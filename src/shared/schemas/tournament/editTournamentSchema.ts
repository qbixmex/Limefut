import z from "zod";

export const editTournamentSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' })
    .optional(),
  permalink: z.string()
    .min(3, { message: '¡ El enlace permanente debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El enlace permanente debe ser menor a 100 caracteres !' })
    .optional(),
  description: z.string()
    .min(3, { message: '¡ La descripción debe ser mayor a 3 caracteres !' })
    .max(250, { message: '¡ La descripción debe ser menor a 250 caracteres !' })
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
  coach: z.string()
    .min(3, { message: '¡ El entrenador debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El entrenador debe ser menor a 100 caracteres !' })
    .optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '¡ La fecha de inicio no es válida !',
  })
  .optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '¡ La fecha de fin no es válida !',
  })
  .optional(),
  active: z.boolean().optional(),
});
