import z from 'zod';

export const CreatePlayoffsSchema = z.object({
  teamsIds: z.array(z.string('¡ El equipo deben ser una cadena de texto !')).min(2, {
    message: '¡ Debes seleccionar al menos 2 equipos !',
  }),
  startingRound: z.string('¡ La etapa inicial debe ser una cadena de texto !')
    .min(1, '¡ La ronda inicial es obligatoria !')
    .max(100, '¡ La ronda inicial debe ser menor a 100 caracteres !'),
  tournament: z
    .string('¡ El torneo debe ser una cadena de texto !')
    .min(1, '¡ Debes seleccionar un torneo !'),
  category: z
    .string('¡ La categoría debe ser una cadena de texto !')
    .min(1, '¡ Debes seleccionar una categoría !'),
});
