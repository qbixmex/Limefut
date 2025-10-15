'use server';

import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';

type Props = {
  email: string;
  password: string;
};

export const handleLoginCredentials = async ({ email, password }: Props): Promise<string> => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return 'Success';
  } catch(error) {
    if (error instanceof AuthError) {
      switch((error as AuthError & { type: string }).type) {
        case 'CredentialsSignin':
          return '¡ Credenciales Inválidas !';
        case 'CallbackRouteError':
          return '¡ Error de callback !';
        default:
          return '¡ Error desconocido !';
      }
    }
    console.error('Login error:', error);
    return '¡ Error Desconocido, revise logs !';
  }
};