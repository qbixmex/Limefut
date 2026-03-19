'use server';

import type { User } from '@/shared/interfaces';
import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchUserResponse = Promise<{
  ok: boolean;
  message: string;
  user: User | null;
}>;

export const fetchUserAction = async (
  userId: string,
  userRole: string[] | null,
): FetchUserResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-user');

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para editar usuarios !',
      user: null,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        ok: false,
        message: '¡ Usuario no encontrado ❌ !',
        user: null,
      };
    }

    return {
      ok: true,
      message: '¡ Usuario obtenido satisfactoriamente 👍 !',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        username: user.username,
        imageUrl: user.imageUrl,
        roles: user.roles,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el usuario,\n¡ Revise los logs del servidor !',
        user: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      user: null,
    };
  }
};
