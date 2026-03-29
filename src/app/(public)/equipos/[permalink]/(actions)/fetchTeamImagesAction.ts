'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  images: unknown[];
}>;

export const fetchTeamImagesAction = async (): FetchTeamResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('public-team-images');

  try {
    const images = await prisma.gallery.findMany({
      where: { active: true },
      select: {
        id: true,
        title: true,
        permalink: true,
        galleryDate: true,
        images: {
          where: { active: true },
          select: {
            title: true,
            imageUrl: true,
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    console.log(images);

    return {
      ok: true,
      message: '¡ Imágenes obtenidas correctamente 👍 !',
      images,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener las imágenes,\n¡ Revise los logs del servidor !',
        images: [],
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      images: [],
    };
  }
};
