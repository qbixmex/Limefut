import { MATCH_STATUS } from '@/shared/enums';
import z from 'zod';

export const CreatePlayoffsMatchSchema = z.object({
  round: z
    .string('¡ La ronda debe ser una cadena de texto !')
    .min(1, '¡ Debes seleccionar una ronda !'),
  group: z
    .string('¡ El grupo inicial debe ser una cadena de texto !')
    .min(1, '¡ Debes seleccionar un grupo !'),
  localTeamScore: z
    .number('¡ El marcador del equipo local debe ser un número !')
    .gte(0, '¡ El marcador del equipo local debe ser número positivo !'),
  visitorTeamScore: z
    .number('¡ El marcador del equipo visitante debe ser un número !')
    .gte(0, '¡ El marcador del equipo local debe ser número positivo !'),
  matchDate: z
    .date('¡ La fecha del encuentro debe ser una fecha válida !')
    .optional(),
  status: z.enum(MATCH_STATUS, '¡ Debe seleccionar un estado !'),
  referee: z
    .union([
      z.literal(''),
      z
        .string('¡ El arbitro debe ser una cadena de texto !')
        .min(3, '¡ El arbitro debe ser mayor a 3 caracteres !'),
    ]).optional(),
  remarks: z
    .union([
      z.literal(''),
      z
        .string('¡ Los comentarios adicionales debe ser una cadena de texto !')
        .min(4, '¡ Los comentarios deben ser mayor a 4 caracteres !')
        .max(255, '¡ Los comentarios deben ser menor a 255 caracteres !'),
    ]).optional(),
  localTeamId: z.uuid('¡ El id del equipo local debe ser un UUID válido !'),
  visitorTeamId: z.uuid('¡ El id del equipo visitante debe ser un UUID válido !'),
  fieldId: z.uuid('¡ El id de la cancha debe ser un UUID válido !'),
});
