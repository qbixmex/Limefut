'use server';

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteGalleryAction = async (galleryId: string): ResponseDeleteAction => {
  const imagesCount = await prisma.galleryImage.count({
    where: { galleryId: galleryId }
  });

  if (imagesCount !== 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la galería por que contiene imágenes !',
    };
  }

  const galleryExists = await prisma.gallery.findUnique({
    where: { id: galleryId },
  });

  if (!galleryExists) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la galería, quizás fue eliminada ó no existe !',
    };
  }

  const galleryDeleted = await prisma.gallery.delete({
    where: { id: galleryId },
    select: { title: true },
  });

  revalidatePath('/admin/galerias');
  updateTag('public-galeries');
  updateTag('public-gallery');

  return {
    ok: true,
    message: `¡ La galería "${galleryDeleted.title}" ha sido eliminada correctamente 👍 !`
  };
};
