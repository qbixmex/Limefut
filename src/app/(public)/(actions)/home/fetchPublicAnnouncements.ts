'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';

export type ANNOUNCEMENT_TYPE = {
  id: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  imageUrl: string | null;
  description: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  announcements: ANNOUNCEMENT_TYPE[];
}>;

export const fetchPublicAnnouncementsAction = async (): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-announcements');

  try {
    const announcements = await prisma.announcement.findMany({
      where: { active: true },
      orderBy: { publishedDate: 'desc' },
      select: {
        id: true,
        title: true,
        permalink: true,
        imageUrl: true,
        publishedDate: true,
        description: true,
      },
    });

    return {
      ok: true,
      message: '! Las noticias fueron obtenidas correctamente 👍',
      announcements,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener las noticias');
      return {
        ok: false,
        message: error.message,
        announcements: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener las noticias, revise los logs del servidor',
      announcements: [],
    };
  }
};
