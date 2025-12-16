import z from "zod";
import { requiredUUID } from "~/src/lib/helpers";

export const createPenaltyShootoutSchema = z.object({
  matchId: requiredUUID(
    '¡ El id del encuentro es obligatorio !',
    '¡ El id del encuentro debe ser un UUID válido !',
  ),
  localTeamId: requiredUUID(
    '¡ El id del equipo local es obligatorio !',
    '¡ El id del encuentro debe ser un UUID válido !',
  ),
  visitorTeamId: requiredUUID(
    '¡ El id del equipo visitante es obligatorio !',
    '¡ El id del equipo visitante debe ser un UUID válido !',
  ),
  localPlayerId: requiredUUID(
    '¡ Seleccione el tirador local !',
    '¡ El id del tirador local debe ser un UUID válido !',
  ),
  localPlayerName: z
    .string('¡ El nombre del tirador local debe ser una cadena de texto !')
    .min(1, '¡ El nombre del tirador local es obligatorio !'),
  visitorPlayerId: requiredUUID(
    '¡ Seleccione el tirador visitante !',
    '¡ El id del tirador visitante debe ser un UUID válido !',
  ),
  visitorPlayerName: z
    .string('¡ El nombre del tirador visitante debe ser una cadena de texto !')
    .min(1, '¡ El nombre del tirador visitante es obligatorio !'),
  localIsGoal: z
    .enum(['scored', 'missed', 'not-taken'], {
      error: "¡ localIsGoal solo puede ser: 'scored', 'missed', 'not-taken'",
    }),
  visitorIsGoal: z
    .enum(['scored', 'missed', 'not-taken'], {
      error: "¡ localIsGoal solo puede ser: 'scored', 'missed', 'not-taken'",
    }),
});
