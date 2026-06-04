'use server';

type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const verifySecretAction = async (key: string): ResponseAction => {
  const secret = process.env.SAVE_MATCH_SECRET_KEY;

  if (!secret) {
    return {
      ok: false,
      message: 'Error de configuración del servidor',
    };
  }

  if (key !== secret) {
    return {
      ok: false,
      message: 'Clave incorrecta',
    };
  }

  return {
    ok: true,
    message: 'Verificado',
  };
};
