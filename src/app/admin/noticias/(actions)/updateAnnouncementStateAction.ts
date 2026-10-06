'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateAnnouncementStateAction = async (id: string, state: boolean): ResponseAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { ok: false, message: guard.message };
  }

  const announcementExists = await prisma.announcement.count({
    where: { id },
  });

  if (announcementExists === 0) {
    return {
      ok: false,
      message: 'No se pudo actualizar la noticia, quizás fue eliminada ó no existe',
    };
  }

  try {
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
      message: 'La noticia fue ' +
        (announcement.active ? 'activado' : 'desactivado') +
        ' correctamente',
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CODE:', error.code);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: 'Error al actualizar la noticia, revise los logs del servidor',
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
