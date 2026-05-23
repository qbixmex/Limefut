import z from 'zod';
import { MATCH_STATUS } from '../../enums';

export const createMatchSchema = z.object({
  localTeamId: z.uuid({
    error: (issue) => (issue.input === '')
      ? '! El equipo local es obligatorio !'
      : '¡ El id del equipo local no es un UUID válido !',
  }),
  localScore: z
    .number()
    .min(0, { message: '¡ El marcador local debe ser un número positivo !' }),
  visitorTeamId: z.uuid({
    error: (issue) => (issue.input === '')
      ? '! El equipo visitante es obligatorio !'
      : '¡ El id del equipo visitante no es un UUID válido !',
  }),
  visitorScore: z
    .int()
    .min(0, { message: '¡ El marcador visitante debe ser un número positivo !' }),
  place: z.union([
    z.literal(''),
    z.string()
      .min(3, { message: '¡ La sede debe ser mayor a 3 caracteres !' })
      .max(50, { message: '¡ La sede debe ser menor a 50 caracteres !' }),
  ]).optional(),
  referee: z.string()
    .min(3, { message: '¡ El arbitro debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El arbitro debe ser menor a 50 caracteres !' })
    .optional(),
  status: z.enum(
    Object.values(MATCH_STATUS) as [string, ...string[]],
    { message: '¡ El estado del partido debe ser válido !' },
  ),
  matchDate: z
    .date({ message: 'La fecha del encuentro debe ser una fecha válida' })
    .optional(),
  week: z
    .int()
    .min(0, { message: '¡ La sede debe ser mínimo 1 !' }),
  tournament: z
    .string('¡ El torneo debe ser una cadena de texto !')
    .min(1, '¡ Debe seleccionar un torneo de la lista !'),
  category: z
    .string('¡ La categoría debe ser una cadena de texto !')
    .min(1, '¡ Debe seleccionar una categoría de la lista !'),
});
