'use server';

import { auth } from '@/lib/auth';

type Props = {
  name: string;
  email: string;
  password: string;
};

type BetterAuthApiResponse = {
  code: string;
  message: string;
};

export const sighUpAction = async ({
  name,
  email,
  password,
}: Props): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      asResponse: true,
    });

    await response.json() as BetterAuthApiResponse;

    return {
      ok: true,
      message: '¡ Se registró el usuario correctamente 👍 !',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      ok: false,
      message: '¡ Error desconocido, revise los logs del servidor ❌ !',
    };
  }
};
