'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateAnnouncementStateAction = async (id: string, state: boolean): ResponseAction => {
  const announcementExists = await prisma.announcement.count({
    where: { id },
  });

  if (announcementExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar la noticia, quizás fue eliminada ó no existe !',
    };
  }

  const announcement = await prisma.announcement.update({
    where: { id },
    data: { active: state },
    select: { active: true },
  });

  // Update Cache
  updateTag('admin-announcements');
  updateTag('admin-announcement');
  updateTag('public-announcements');

  return {
    ok: true,
    message: `¡ La noticia fue ${announcement.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
