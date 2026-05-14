'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import type { Pagination } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  categories: CategoryType[];
  pagination: Pagination | null;
}>;

export type CategoryType = {
  id: string;
  name: string;
  permalink: string | null;
};

export const fetchCategoriesAction = async (options?: Options): ResponseFetch => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-categories');

  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.CategoryWhereInput = options?.searchTerm ? {
    name: {
      contains: options.searchTerm,
      mode: 'insensitive' as const,
    },
  } : {};

  try {
    const categories = await prisma.category.findMany({
      where: whereCondition,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
      take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.category.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Las categorías fueron obtenidas correctamente 👍',
      categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los torneos');
      return {
        ok: false,
        message: error.message,
        categories: [],
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los torneos, revise los logs del servidor',
      categories: [],
      pagination: null,
    };
  }
};
