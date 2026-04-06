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

export type VideosType = {
  id: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  platform: string;
  active: boolean;
};

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  videos: VideosType[];
  pagination: Pagination | null;
}>;

export const fetchVideosAction = async (options: Options): ResponseFetch => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-videos');

  if (!options.userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      videos: [],
      pagination: null,
    };
  }

  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.VideoWhereInput = options?.searchTerm ? {
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
    const videos = await prisma.video.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        permalink: true,
        publishedDate: true,
        platform: true,
        active: true,
      },
      orderBy: { publishedDate: 'asc' },
      take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.video.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los videos fueron obtenidos correctamente 👍',
      videos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los videos');
      console.log('NAME:', error.name);
      console.log('MESSAGE:', error.message);

      return {
        ok: false,
        message: error.message,
        videos: [],
        pagination: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado al obtener los videos, revise los logs del servidor',
      videos: [],
      pagination: null,
    };
  }
};
