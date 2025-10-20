import z from "zod";

export const createCredentialSchema = z.object({
  fullName: z
    .string("¡ El nombre completo debe ser una cadena de texto !")
    .min(3, { message: "¡ El nombre completo debe ser mayor a 3 caracteres !" })
    .max(100, { message: "¡ El nombre completo debe ser menor a 100 caracteres !" }),
  playerId: z.uuid({ message: "¡ El ID del jugador debe ser un UUID válido !" }),
  curp: z
    .string("¡ CURP debe ser una cadena de texto !")
    .length(18, { message: "¡ CURP debe ser de 18 caracteres !" }),
  position: z
    .string("¡ La posición debe ser una cadena de texto !")
    .min(3, { message: "¡ La posición debe ser mayor a 3 caracteres !" })
    .max(50, { message: "¡ La posición debe ser menor a 50 caracteres !" }),
  jerseyNumber: z
    .number("¡ El número de camiseta debe ser un número !")
    .min(1, { message: "¡ La posición debe ser mayor a 0 !" }),
});
