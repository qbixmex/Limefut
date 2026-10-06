'use server';

import prisma from '@/lib/prisma';
import { deleteImage } from '@/shared/actions';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteAnnouncementAction = async (announcementId: string): ResponseDeleteAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { ok: false, message: guard.message };
  }

  const announcement = await prisma.announcement.findFirst({
    where: { id: announcementId },
    select: {
      title: true,
      imagePublicID: true,
    },
  });

  if (!announcement) {
    return {
      ok: false,
      message: 'No se puede eliminar la noticia, quizás fue eliminada ó no existe',
    };
  }

  try {
    await prisma.announcement.delete({
      where: { id: announcementId },
    });

    // Delete image from cloudinary.
    if (announcement.imagePublicID) {
      const response = await deleteImage(announcement.imagePublicID);
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
      message: 'La noticia ha sido eliminada correctamente',
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2001') {
        return {
          ok: false,
          message: 'No se encuentra la noticia en la bse de datos',
        };
      }

      console.log('ERROR NAME:', error.name);
      console.log('ERROR CODE:', error.code);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: 'Error al eliminar la noticia, revise los logs del servidor',
      };
    }

    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: 'Error inesperado, revise los logs del servidor',
      };
    }

    console.log(error);

    return {
      ok: false,
      message: 'Error desconocido, revise los logs del servidor',
    };
  }
};
