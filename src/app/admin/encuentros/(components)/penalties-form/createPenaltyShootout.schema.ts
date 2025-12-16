import z from "zod";
import { requiredUUID } from "~/src/lib/helpers";

export const createPenaltyShootoutSchema = z.object({
  localPlayerId: requiredUUID(
    '¡ Seleccione el tirador local !',
    '¡ El id del tirador local debe ser un UUID válido !',
  ),
  visitorPlayerId: requiredUUID(
    '¡ Seleccione el tirador visitante !',
    '¡ El id del tirador visitante debe ser un UUID válido !',
  ),
  localIsGoal: z
    .string('¡ Es Gol local debe ser una cadena de texto !'),
  visitorIsGoal: z
    .string('¡ Es Gol visitante debe ser una cadena de texto !'),
});
