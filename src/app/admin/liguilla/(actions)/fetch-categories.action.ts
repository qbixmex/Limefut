'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  categories: CATEGORY_TYPE[];
}>;

type CATEGORY_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export const fetchCategoriesAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
} : {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('admin-categories');

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      categories: [],
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos para realizar esta acción !',
      categories: [],
    };
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'desc',
      },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });

    return {
      ok: true,
      message: '! Las categorías fueron obtenidas correctamente 👍 !',
      categories,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('¡ Error al intentar obtener las categorías !');
      return {
        ok: false,
        message: error.message,
        categories: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      categories: [],
    };
  }
};
