'use server';

import prisma from '@/lib/prisma';
import { deleteImage } from '@/shared/actions';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteHeroBannerAction = async (heroBannerId: string): ResponseDeleteAction => {
  const heroBanner = await prisma.heroBanner.findFirst({
    where: { id: heroBannerId },
    select: {
      title: true,
      imagePublicId: true,
    },
  });

  if (!heroBanner) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el banner, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.heroBanner.delete({
    where: { id: heroBannerId },
  });

  // Delete image from cloudinary.
  if (heroBanner.imagePublicId) {
    const response = await deleteImage(heroBanner.imagePublicId);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  // Update Cache
  updateTag('admin-banners');
  updateTag('admin-banner');
  updateTag('public-banners');

  return {
    ok: true,
    message: `¡ El banner "${heroBanner.title}", ha sido eliminado correctamente 👍 !`,
  };
};
