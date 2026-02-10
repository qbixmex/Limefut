'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import { deleteImage } from "~/src/shared/actions";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteGalleryImageAction = async (galleryImageId: string): ResponseDeleteAction => {
  const galleryImageExists = await prisma.galleryImage.count({
    where: { id: galleryImageId },
  });

  if (galleryImageExists == 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la imagen de la galería, quizás fue eliminada ó no existe !',
    };
  }

  const galleryImage = await prisma.galleryImage.delete({
    where: { id: galleryImageId },
    select: {
      imagePublicID: true,
      position: true,
      gallery: {
        select: {
          permalink: true,
        },
      },
    },
  });

  // Delete image from cloudinary.
  if (galleryImage.imagePublicID) {
    const response = await deleteImage(galleryImage.imagePublicID);
    if (!response.ok) {
      throw 'Error al eliminar la imagen de cloudinary';
    }
  }

  // Shift up positions for pages that were after the deleted one
  // Use updateMany with decrement to avoid unique conflicts and for performance
  await prisma.galleryImage.updateMany({
    where: { position: { gt: galleryImage.position as number } },
    data: { position: { decrement: 1 } },
  });

  // Update Cache
  updateTag('admin-galleries');
  updateTag('admin-gallery');
  updateTag('dashboard-images');
  updateTag('public-galleries');
  updateTag('public-gallery');
  updateTag("public-galleries");
  updateTag("public-gallery");

  return {
    ok: true,
    message: `¡ La imagen de la galería ha sido eliminada correctamente 👍 !`,
  };
};
