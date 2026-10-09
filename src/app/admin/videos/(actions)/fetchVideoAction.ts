'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

type FetchVideoResponse = Promise<{
  ok: boolean;
  message: string;
  video: VIDEO_TYPE | null;
}>;

export type VIDEO_TYPE = {
  id: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  description: string;
  url: string;
  platform: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const fetchVideoAction = async (
  videoId: string,
): FetchVideoResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-video');

  try {
    const video = await prisma.video.findFirst({
      where: { id: videoId },
    });

    if (!video) {
      return {
        ok: false,
        message: 'Video no encontrada',
        video: null,
      };
    }

    return {
      ok: true,
      message: 'Video obtenido correctamente',
      video,
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
          video: null,
        };
      }

      return {
        ok: false,
        message: 'Hubo errores de base de datos, revise los logs del servidor',
        video: null,
      };
    }

    if (error instanceof Error) {
      console.log('Error Name:', error.name);
      console.log('Error Message:', error.message);
      console.log('Error Cause:', error.cause ?? 'none');
      console.log('Error Stack:', error.stack ?? 'none');

      return {
        ok: false,
        message: 'No se pudo obtener el video, revise los logs del servidor',
        video: null,
      };
    }

    console.log(error);

    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
      video: null,
    };
  }
};
