'use server';

import prisma from '@/lib/prisma';
import type { Gallery } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type GalleryImageType = {
  id: string;
  title: string;
  imageUrl: string;
  active: boolean;
  position: number;
};

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  gallery: Gallery & {
    images: GalleryImageType[];
  } | null;
}>;

export const fetchGalleryAction = async (
  userRoles: string[],
  galleryId: string,
): FetchTeamResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-gallery');

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      gallery: null,
    };
  }

  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      select: {
        id: true,
        title: true,
        permalink: true,
        galleryDate: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        images: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            active: true,
            position: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!gallery) {
      return {
        ok: false,
        message: '¡ Galería no encontrada ❌ !',
        gallery: null,
      };
    }

    return {
      ok: true,
      message: '¡ Galería obtenida correctamente 👍 !',
      gallery,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener la galería,\n¡ Revise los logs del servidor !',
        gallery: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      gallery: null,
    };
  }
};
