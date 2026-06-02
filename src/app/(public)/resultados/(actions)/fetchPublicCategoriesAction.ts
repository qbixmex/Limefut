'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type CATEGORY_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  categories: CATEGORY_TYPE[];
}>;

export const fetchPublicCategoriesAction = async (): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('public-categories');

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
      message: '! Las categorías obtenidas correctamente 👍 !',
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
      message: '¡ Error inesperado al obtener las categorías, revise los logs del servidor !',
      categories: [],
    };
  }
};
