'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { Pagination } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type VIDEO_TYPE = {
  id: string;
  title: string;
  permalink: string;
  url: string;
  platform: string;
  publishedDate: Date;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  videos: VIDEO_TYPE[];
  pagination: Pagination | null;
}>;

export const fetchPublicVideosAction = async (options: Options): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-videos');

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
      where: {
        active: true,
        ...whereCondition,
      },
      orderBy: { publishedDate: 'desc' },
      select: {
        id: true,
        title: true,
        permalink: true,
        url: true,
        platform: true,
        publishedDate: true,
      },
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
      return {
        ok: false,
        message: error.message,
        videos: [],
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los videos, revise los logs del servidor',
      videos: [],
      pagination: null,
    };
  }
};
