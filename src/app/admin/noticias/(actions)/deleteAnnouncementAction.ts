'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteAnnouncementAction = async (announcementId: string): ResponseDeleteAction => {
  const announcement = await prisma.announcement.findFirst({
    where: { id: announcementId },
    select: { title: true },
  });

  if (!announcement) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la noticia, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.announcement.delete({
    where: { id: announcementId },
  });

  // Update Cache
  updateTag('admin-announcements');
  updateTag('admin-announcement');
  updateTag('public-announcements');

  return {
    ok: true,
    message: `¡ La noticia "${announcement.title}", ha sido eliminada correctamente 👍 !`,
  };
};
