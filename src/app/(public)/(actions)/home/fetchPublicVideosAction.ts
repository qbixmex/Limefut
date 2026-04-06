'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';

export type VideoType = {
  id: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  url: string;
  platform: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  videos: VideoType[];
}>;

export const fetchPublicVideosAction = async (): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-videos');

  try {
    const videos = await prisma.video.findMany({
      where: { active: true },
      orderBy: { publishedDate: 'desc' },
      select: {
        id: true,
        title: true,
        permalink: true,
        publishedDate: true,
        url: true,
        platform: true,
      },
      take: 5,
    });

    return {
      ok: true,
      message: '! Los videos fueron obtenidos correctamente 👍',
      videos,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los videos');
      return {
        ok: false,
        message: error.message,
        videos: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los videos, revise los logs del servidor',
      videos: [],
    };
  }
};
