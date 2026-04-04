'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Announcement } from '@/shared/interfaces';

type FetchAnnouncementResponse = Promise<{
  ok: boolean;
  message: string;
  announcement: Announcement | null;
}>;

export const fetchAnnouncementAction = async (
  userRoles: string[] | null,
  announcementId: string,
): FetchAnnouncementResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-announcement');

  if ((userRoles !== null) && (!userRoles.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      announcement: null,
    };
  }

  try {
    const announcement = await prisma.announcement.findFirst({
      where: { id: announcementId },
    });

    if (!announcement) {
      return {
        ok: false,
        message: '¡ Noticia no encontrada ❌ !',
        announcement: null,
      };
    }

    return {
      ok: true,
      message: '¡Noticia obtenida correctamente 👍 !',
      announcement,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener la noticia,\n¡ Revise los logs del servidor !',
        announcement: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      announcement: null,
    };
  }
};
