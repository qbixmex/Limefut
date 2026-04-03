'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';

export type SponsorType = {
  id: string;
  name: string;
  url?: string | null;
  imageUrl: string;
  alignment: string;
  position: number;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  sponsors: SponsorType[];
}>;

export const fetchPublicSponsorsAction = async (): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-sponsors');

  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { active: true },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        name: true,
        url: true,
        imageUrl: true,
        alignment: true,
        position: true,
      },
    });

    return {
      ok: true,
      message: '! Los patrocinadores fueron obtenidos correctamente 👍',
      sponsors,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los patrocinadores');
      return {
        ok: false,
        message: error.message,
        sponsors: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los patrocinadores, revise los logs del servidor',
      sponsors: [],
    };
  }
};
