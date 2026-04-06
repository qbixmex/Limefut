'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Video } from '@/shared/interfaces';

type FetchVideoResponse = Promise<{
  ok: boolean;
  message: string;
  video: Video | null;
}>;

export const fetchVideoAction = async (
  userRoles: string[] | null,
  videoId: string,
): FetchVideoResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-video');

  if ((userRoles !== null) && (!userRoles.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      video: null,
    };
  }

  try {
    const video = await prisma.video.findFirst({
      where: { id: videoId },
    });

    if (!video) {
      return {
        ok: false,
        message: '¡ Video no encontrada ❌ !',
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
