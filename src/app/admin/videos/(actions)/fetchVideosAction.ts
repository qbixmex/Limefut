'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { Pagination } from '@/shared/interfaces';

type Options = Readonly<{
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
      message: 'Los videos fueron obtenidos correctamente',
      videos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('Error Name:', error.name);
      console.log('Error Code:', error.code);
      console.log('Error cause:', error.cause ?? 'none');
      console.log('Error Metadata:', error.meta ?? 'none');
      console.log('Error Message:', error.message);

      if (error.code === 'P2002') {
        return {
          ok: false,
          message: 'Hay campos duplicados, revise los logs del servidor',
          videos: [],
          pagination: null,
        };
      }

      return {
        ok: false,
        message: 'Hubo errores de base de datos, revise los logs del servidor',
        videos: [],
        pagination: null,
      };
    }

    if (error instanceof Error) {
      console.log('Error Name:', error.name);
      console.log('Error Message:', error.message);
      console.log('Error Cause:', error.cause ?? 'none');
      console.log('Error Stack:', error.stack ?? 'none');

      return {
        ok: false,
        message: 'No se pudieron obtener los videos, revise los logs del servidor',
        videos: [],
        pagination: null,
      };
    }

    console.log(error);

    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
      videos: [],
      pagination: null,
    };
  }
};
