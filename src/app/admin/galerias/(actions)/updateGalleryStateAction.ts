'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateGalleryStateAction = async (id: string, state: boolean)
  : ResponseDeleteAction => {
  const galleryExists = await prisma.gallery.count({
    where: { id },
  });

  if (galleryExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar la galería, quizás fue eliminada ó no existe !',
    };
  }

  const updatedGallery = await prisma.gallery.update({
    where: { id },
    data: { active: state },
    select: {
      title: true,
      active: true,
    },
  });

  updateTag('dashboard-images');
  updateTag('admin-galleries');
  updateTag('admin-gallery');
  updateTag('public-galleries');
  updateTag('public-gallery');
  updateTag('public-home-images');

  return {
    ok: true,
    message: `¡ La galería fue ${updatedGallery.active ? 'activada' : 'desactivada'} correctamente 👍 !`,
  };
};
