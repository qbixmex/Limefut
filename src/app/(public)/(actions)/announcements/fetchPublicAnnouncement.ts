'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';

type AnnouncementType = {
  id: string;
  title: string;
  content: string;
  publishedDate: Date;
}

type FetchAnnouncementResponse = Promise<{
  ok: boolean;
  message: string;
  announcement: AnnouncementType | null;
}>;

export const fetchPublicAnnouncementAction = async (permalink: string): FetchAnnouncementResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('public-announcement');

  try {
    const announcement = await prisma.announcement.findFirst({
      where: {
        AND: [
          { permalink },
          { active: true },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        publishedDate: true,
      },
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
