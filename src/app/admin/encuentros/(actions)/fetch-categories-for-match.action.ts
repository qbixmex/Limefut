'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  categories: CATEGORY_TYPE[];
}>;

export type CATEGORY_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export const fetchCategoriesForMatchAction = async (
  tournamentPermalink: string,
): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-categories-for-match', 'categories-selector-list');

  try {
    const categories = await prisma.category.findMany({
      where: {
        tournaments: {
          some: {
            tournament: {
              permalink: tournamentPermalink,
            },
          },
        },
      },
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
      message: 'Las categorías fueron obtenidos correctamente',
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
