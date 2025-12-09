'use server';

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
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

  const { imagePublicID, gallery } = await prisma.galleryImage.delete({
    where: { id: galleryImageId },
    select: {
      imagePublicID: true,
      gallery: {
        select: {
          permalink: true,
        },
      },
    },
  });

  // Delete image from cloudinary.
  if (imagePublicID) {
    const response = await deleteImage(imagePublicID);
    if (!response.ok) {
      throw 'Error al eliminar la imagen de cloudinary';
    }
  }

  revalidatePath(`/admin/galerias/${gallery.permalink}`);
  updateTag('public-galeries');
  updateTag('public-gallery');

  return {
    ok: true,
    message: `¡ La galería ha sido eliminada correctamente 👍 !`,
  };
};
