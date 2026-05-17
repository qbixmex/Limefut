'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  categories: CategoryType[];
}>;

export type CategoryType = {
  id: string;
  name: string;
  permalink: string;
};

export const fetchCategoriesAction = async (): ResponseFetch => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-categories');

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'desc' },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });

    return {
      ok: true,
      message: '! Las categorías fueron obtenidas correctamente 👍',
      categories,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los torneos');
      return {
        ok: false,
        message: error.message,
        categories: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los torneos, revise los logs del servidor',
      categories: [],
    };
  }
};
