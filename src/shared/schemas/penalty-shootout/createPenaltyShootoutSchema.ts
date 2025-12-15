import z from "zod";

export const createPenaltyShootoutSchema = z.object({
  matchId: z
    .uuid('El id del encuentro debe ser un UUID válido'),
  localTeamId: z
    .uuid('El id del equipo local debe ser un UUID válido'),
  visitorTeamId: z
    .uuid('El id del equipo visitante debe ser un UUID válido'),
  localPlayerId: z
    .uuid('El id del jugador local debe ser un UUID válido'),
  visitorPlayerId: z
    .uuid('El id del jugador visitante debe ser un UUID válido'),
});
