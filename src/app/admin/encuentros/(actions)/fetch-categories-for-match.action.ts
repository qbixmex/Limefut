'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  categories: {
    id: string;
    name: string;
    permalink: string;
  }[];
}>;

export const fetchCategoriesForMatchAction = async (): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-categories-for-match');

  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { name: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });

    return {
      ok: true,
      message: '! Las categorías fueron obtenidos correctamente 👍',
      categories,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener las categorías para encuentros:');
      return {
        ok: false,
        message: error.message,
        categories: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
      categories: [],
    };
  }
};
