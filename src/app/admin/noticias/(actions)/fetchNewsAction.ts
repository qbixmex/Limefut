'use server';

import { cacheLife, cacheTag } from 'next/cache';
import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { Pagination } from '@/shared/interfaces';

type Options = Readonly<{
  userRoles: string[];
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type NewType = {
  id: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  active: boolean;
};

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  news: NewType[];
  pagination: Pagination | null;
}>;

export const fetchNewsAction = async (options: Options): ResponseFetch => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-news');

  if (!options.userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      news: [],
      pagination: null,
    };
  }

  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.NewsWhereInput = options?.searchTerm ? {
    OR: [
      {
        title: {
          contains: options.searchTerm,
          mode: 'insensitive' as const,
        },
      },
    ],
  } : {};

  try {
    const news = await prisma.news.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        permalink: true,
        publishedDate: true,
        active: true,
      },
      orderBy: { publishedDate: 'asc' },
      take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.news.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los patrocinadores fueron obtenidos correctamente 👍',
      news,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener las noticias');
      console.log('NAME:', error.name);
      console.log('MESSAGE:', error.message);

      return {
        ok: false,
        message: error.message,
        news: [],
        pagination: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado al obtener los patrocinadores, revise los logs del servidor',
      news: [],
      pagination: null,
    };
  }
};
