'use server';

import { auth } from "@/lib/auth";

type BetterAuthApiResponse = {
  code: string;
  message: string;
}

export const signInAction = async (formData: FormData): Promise<{
  ok: boolean;
  message: string;
}> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    const data = await response.json() as BetterAuthApiResponse;

    if (data.code === "INVALID_EMAIL_OR_PASSWORD") {
      return {
        ok: false,
        message: '! Correo ó contraseña invalido !',
      };
    }

    return {
      ok: true,
      message: '¡ Datos correctos 👍 !',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      ok: false,
      message: '¡ Error desconocido, revise los logs del servidor ❌ !',
    };
  }
};
