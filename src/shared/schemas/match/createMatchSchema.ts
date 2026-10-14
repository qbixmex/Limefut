import z from 'zod';
import { MATCH_MODE, MATCH_STATUS } from '../../enums';

export const createMatchSchema = z.object({
  localTeamId: z.uuid({
    error: (issue) => (issue.input === '')
      ? 'El equipo local es obligatorio'
      : 'El id del equipo local no es un UUID válido',
  }),
  localScore: z
    .number()
    .min(0, 'El marcador local debe ser un número positivo'),
  visitorTeamId: z.uuid({
    error: (issue) => (issue.input === '')
      ? 'El equipo visitante es obligatorio'
      : 'El id del equipo visitante no es un UUID válido',
  }),
  visitorScore: z
    .int()
    .min(0, 'El marcador visitante debe ser un número positivo'),
  fieldId: z.union([
    z.literal(''),
    z.uuid({
      error: (issue) => (issue.input === '')
        ? 'La sede es obligatoria'
        : 'El id de la sede debe ser un UUID válido',
    }),
  ]).optional(),
  referee: z.union([
    z.literal(''),
    z.string('El arbitro debe ser una cadena de texto')
      .min(3, 'El arbitro debe ser mayor a 3 caracteres')
      .max(50, 'El arbitro debe ser menor a 50 caracteres'),
  ]).optional(),
  status: z.enum(
    [
      MATCH_STATUS.SCHEDULED,
      MATCH_STATUS.IN_PROGRESS,
      MATCH_STATUS.IN_REVIEW,
      MATCH_STATUS.COMPLETED,
      MATCH_STATUS.POST_POSED,
      MATCH_STATUS.CANCELED,
    ],
    { message: 'Debes seleccionar un estado' },
  ),
  matchDate: z
    .date('La fecha del encuentro debe ser una fecha válida')
    .optional(),
  mode: z.enum(
    [MATCH_MODE.LEAGUE, MATCH_MODE.FRIENDLY],
    { error: 'Debes seleccionar un tipo de encuentro válido' },
  ),
  week: z
    .int()
    .min(0, 'La sede debe ser mínimo 1'),
  tournament: z
    .string('El torneo debe ser una cadena de texto')
    .trim()
    .min(1, 'Debe seleccionar un torneo de la lista'),
  category: z
    .string('La categoría debe ser una cadena de texto')
    .trim()
    .min(1, 'Debe seleccionar una categoría de la lista'),
});
