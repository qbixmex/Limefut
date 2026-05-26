import { requiredUUID } from '~/src/lib/helpers';
import { z } from 'zod';

export const SimplePenaltyShootoutsSchema = z.object({
  matchId: requiredUUID(
    '¡ El ID del encuentro es obligatorio !',
    '¡ El id del encuentro debe ser un UUID válido !',
  ),
  localTeamId: requiredUUID(
    '¡ El ID del equipo local es obligatorio !',
    '¡ El ID del equipo local debe ser un UUID válido !',
  ),
  visitorTeamId: requiredUUID(
    '¡ El ID del equipo visitante es obligatorio !',
    '¡ El ID del equipo visitante debe ser un UUID válido !',
  ),
  localGoals: z
    .number('¡ El gol local debe ser un número !')
    .min(0, '¡ El gol local no puede ser un número negativo !'),
  visitorGoals: z
    .number('¡ El gol visitante debe ser un número !')
    .min(0, '¡ El gol visitante no puede ser un número negativo !'),
});
