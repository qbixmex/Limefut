'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';

export type Gallery = {
  id: string;
  title: string;
  permalink: string;
  imageUrl: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  latestImages: Gallery[];
}>;

export const fetchLatestImagesAction = async (): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-home-images');

  try {
    const images = await prisma.gallery.findMany({
      where: { active: true },
      select: {
        id: true,
        title: true,
        permalink: true,
        images: {
          select: {
            title: true,
            imageUrl: true,
          },
          take: 1,
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    return {
      ok: true,
      message: '! Las imágenes fueron obtenidas correctamente 👍',
      latestImages: images.map((image) => ({
        id: image.id,
        title: image.title,
        permalink: image.permalink,
        imageUrl: image.images[0].imageUrl,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros');
      return {
        ok: false,
        message: error.message,
        latestImages: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener las imágenes, revise los logs del servidor',
      latestImages: [],
    };
  }
};
