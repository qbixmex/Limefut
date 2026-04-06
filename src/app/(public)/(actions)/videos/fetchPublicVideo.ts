'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';

export type VideoType = {
  id: string;
  title: string;
  url: string;
  platform: string;
  description: string;
  publishedDate: Date;
}

type FetchVideosResponse = Promise<{
  ok: boolean;
  message: string;
  video: VideoType | null;
}>;

export const fetchPublicVideoAction = async (permalink: string): FetchVideosResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('public-video');

  try {
    const video = await prisma.video.findFirst({
      where: {
        AND: [
          { permalink },
          { active: true },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        platform: true,
        url: true,
        publishedDate: true,
      },
    });

    if (!video) {
      return {
        ok: false,
        message: '¡ Video no encontrado ❌ !',
        video: null,
      };
    }

    return {
      ok: true,
      message: '¡ Video obtenido correctamente 👍 !',
      video,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el video,\n¡ Revise los logs del servidor !',
        video: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      video: null,
    };
  }
};
