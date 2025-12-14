import z from "zod";

export const createPenaltiesSchema = z.object({
  matchId: z
    .uuid('El id del encuentro debe ser un UUID válido'),
  teamId: z
    .uuid('El id del equipo debe ser un UUID válido'),
  shooterNumber: z
    .number('El número de tirador debe ser un número')
    .gt(1, 'El numero debe ser mayor a 0'),
  isGoal: z
    .boolean('Es Gol debe ser un valor boleano')
    .optional(),
  shooterName: z
    .string('El nombre del tirador debe ser una cadena de texto')
    .optional(),
});
