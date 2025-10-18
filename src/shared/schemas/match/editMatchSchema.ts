import z from "zod";
import { MATCH_STATUS } from "../../enums";

export const editMatchSchema = z.object({
  local: z.string()
    .min(3, { message: '¡ El equipo local debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El equipo local debe ser menor a 50 caracteres !' })
    .optional(),
  visitor: z.string()
    .min(3, { message: '¡ El equipo visitante debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El equipo visitante debe ser menor a 50 caracteres !' })
    .optional(),
  place: z.string()
    .min(3, { message: '¡ La sede debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ La sede debe ser menor a 50 caracteres !' })
    .optional(),
  week: z
    .int()
    .min(1, { message: '¡ La sede debe ser mínimo 1 !' })
    .optional(),
  referee: z.string()
    .min(3, { message: '¡ El arbitro debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El arbitro debe ser menor a 50 caracteres !' })
    .optional(),
  status: z.enum(
    Object.values(MATCH_STATUS) as [string, ...string[]],
    { message: "¡ El estado del partido debe ser válido !" }
  )
    .optional(),
  localScore: z
    .int()
    .min(0, { message: '¡ El marcador local debe ser mayor a 0 !' })
    .optional(),
  visitorScore: z
    .int()
    .min(0, { message: '¡ El marcador visitante debe ser mayor a 0 !' })
    .optional(),
  matchDate: z
    .date({ message: "La fecha del encuentro debe ser una fecha válida" })
    .optional(),
  tournamentId: z
    .uuid({ message: "¡ El torneo seleccionado no es válido !" })
    .optional(),
});
