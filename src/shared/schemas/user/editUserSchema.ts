import z from "zod";

export const editUserSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' })
    .nullish(),
  username: z.string()
    .min(3, { message: '¡ El nombre de usuario debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El nombre debe ser menor a 100 caracteres !' })
    .nullish(),
  email: z.string()
    .min(1, { message: '¡ El correo electrónico es obligatorio !' })
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: '¡ Formato incorrecto del correo electrónico !' }
    )
    .nullish(),
  imageUrl: z.string()
    .min(5, { message: '¡ El url de la imagen debe ser mayor a 5 caracteres !' })
    .max(255, { message: '¡ El url de la imagen debe ser menor a 255 caracteres !' })
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(8, { message: '¡ La contraseña debe ser por lo menos de 8 caracteres!' })
    .optional()
    .or(z.literal('')),
  passwordConfirmation: z.string()
    .min(8, { message: '¡ La confirmación de la contraseña debe ser por lo menos de 8 caracteres!' })
    .optional()
    .or(z.literal('')),
  roles: z.array(z.enum(['user', 'admin']))
    .min(1, { message: '¡ Debe seleccionar al menos un rol !' })
    .nullish(),
  isActive: z.boolean().optional(),
}).refine((data) => {
  if (data.password && data.passwordConfirmation) {
    return data.password === data.passwordConfirmation;
  }
  return true;
}, {
  message: "¡ Las contraseñas no coinciden !",
  path: ["passwordConfirmation"]
});
