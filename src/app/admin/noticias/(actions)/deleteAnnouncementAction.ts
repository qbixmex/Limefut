'use server';

import prisma from '@/lib/prisma';
import { deleteImage } from '@/shared/actions';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteAnnouncementAction = async (announcementId: string): ResponseDeleteAction => {
  const announcement = await prisma.announcement.findFirst({
    where: { id: announcementId },
    select: {
      title: true,
      imagePublicId: true,
    },
  });

  if (!announcement) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el patrocinador, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.announcement.delete({
    where: { id: announcementId },
  });

  // Delete image from cloudinary.
  if (announcement.imagePublicId) {
    const response = await deleteImage(announcement.imagePublicId);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  // Update Cache
  updateTag('admin-announcements');
  updateTag('admin-announcement');
  updateTag('public-announcements');

  return {
    ok: true,
    message: `¡ La noticia "${announcement.title}", ha sido eliminada correctamente 👍 !`,
  };
};
