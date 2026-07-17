import z from 'zod';

export const SaveMatchSchema = z.object({
  localTeamId: z.uuid({
    error: (issue) => (issue.input === '')
      ? '! El equipo local es obligatorio !'
      : '¡ El id del equipo local no es un UUID válido !',
  }),
  visitorTeamId: z.uuid({
    error: (issue) => (issue.input === '')
      ? '! El equipo visitante es obligatorio !'
      : '¡ El id del equipo visitante no es un UUID válido !',
  }),
  localTeamScore: z
    .number()
    .min(0, '¡ El marcador del equipo local debe ser un número positivo !'),
  visitorTeamScore: z
    .number()
    .min(0, '¡ El marcador del equipo visitante debe ser un número positivo !'),
  category: z
    .string('¡ La categoría debe ser una cadena de texto !')
    .trim()
    .min(1, '¡ Debes seleccionar una categoría de la lista !'),
  field: z
    .string('¡ La cacha debe ser una cadena de texto !')
    .trim()
    .min(1, '¡ Debes seleccionar una cancha de la lista !'),
  matchDate: z
    .date({ message: 'La fecha del encuentro debe ser una fecha válida' }),
  referee: z
    .string('¡ El arbitro debe ser una cadena de texto !')
    .min(3, { message: '¡ El arbitro debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El arbitro debe ser menor a 50 caracteres !' }),
  localPenaltyShoots: z
    .number()
    .min(0, '¡ Los goles de penal del equipo local debe ser un número positivo !')
    .optional(),
  visitorPenaltyShoots: z
    .number()
    .min(0, '¡ Los goles de penal del equipo visitante debe ser un número positivo !')
    .optional(),
  remarks: z.union([
    z.literal(''),
    z.string('¡ Los comentarios deben ser una cadena de texto !')
      .trim()
      .min(6, '¡ Los comentarios deben ser por lo menos 6 caracteres !'),
  ]).optional(),
});
