import z from "zod";

export const createStandingsSchema = z.array(
  z.object({
    tournamentId: z.uuid("¡ El id del torneo debe ser un uuid válido !"),
    teamId: z.uuid("¡ El id del equipo debe ser un uuid válido !"),
  }),
);
