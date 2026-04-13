'use server';

import prisma from '@/lib/prisma';
import deleteImage from '@/shared/actions/deleteImageAction';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteLogoImageAction = async ({
  deleteLogoImage = false,
  deleteFavIcon = false,
}: {
  deleteLogoImage: boolean;
  deleteFavIcon: boolean;
}): ResponseDeleteAction => {
  const settings = await prisma.globalSettings.findFirst({
    where: { id: 1 },
    select: {
      logoPublicId: true,
      favIconPublicId: true,
    },
  });

  if (!settings) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la imagen, los ajustes globales no existen !',
    };
  } else {
    if (deleteLogoImage) {
      if (settings.logoPublicId) {
        // Delete logo image from cloudinary.
        const responseLogoImage = await deleteImage(settings.logoPublicId);
        if (!responseLogoImage.ok) {
          throw new Error('Error al eliminar el logo de cloudinary');
        }
      }

      await prisma.globalSettings.update({
        where: { id: 1 },
        data: { logoUrl: null, logoPublicId: null },
      });
    }

    if (deleteFavIcon) {
      if (settings.favIconPublicId) {
        // Delete favicon image from cloudinary.
        const responseFavImage = await deleteImage(settings.favIconPublicId);
        if (!responseFavImage.ok) {
          throw new Error('Error al eliminar el favicon de cloudinary');
        }
      }

      await prisma.globalSettings.update({
        where: { id: 1 },
        data: { faviconUrl: null, favIconPublicId: null },
      });
    }
  }

  // Update Cache
  updateTag('admin-global-settings');

  return {
    ok: true,
    message: '¡ La imagen ha sido eliminada correctamente 👍 !',
  };
};
