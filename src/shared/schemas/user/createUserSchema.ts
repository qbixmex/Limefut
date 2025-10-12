import z from "zod";

export const createUserSchema = z.object({
  name: z.string()
    .min(3, { message: '¡ El nombre debe ser mayor a 3 caracteres !' })
    .max(50, { message: '¡ El nombre debe ser menor a 50 caracteres !' }),
  username: z.string()
    .min(3, { message: '¡ El nombre de usuario debe ser mayor a 3 caracteres !' })
    .max(100, { message: '¡ El nombre debe ser menor a 100 caracteres !' })
    .optional(),
  email: z.string()
    .min(1, { message: '¡ El correo electrónico es obligatorio !' })
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: '¡ Formato incorrecto del correo electrónico !' }
    ),
  imageUrl: z.string()
    .min(5, { message: '¡ El url de la imagen debe ser mayor a 5 caracteres !' })
    .max(255, { message: '¡ El url de la imagen debe ser menor a 255 caracteres !' })
    .optional(),
  password: z.string().min(8, {
    message: '¡ La contraseña debe ser por lo menos de 8 caracteres!'
  }),
  passwordConfirmation: z.string().min(8, {
    error: '¡ La confirmación de la contraseña debe ser por lo menos de 8 caracteres!'
  }),
  roles: z.array(z.enum(['user', 'admin'])).min(1, {
    message: '¡ Debe seleccionar al menos un rol !'
  }),
  isActive: z.boolean().optional(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "¡ Las contraseñas no coinciden !",
  path: ["passwordConfirmation"]
});
