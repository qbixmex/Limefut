'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
    permalink: string;
    category: string;
    format: string;
  }[] | null;
}>;

export const fetchTournamentsForCoach = async (): ResponseFetch => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-tournaments-for-coach');

  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: [
        { name: 'asc' },
        { category: 'desc' },
      ],
      where: { active: true },
      select: {
        id: true,
        name: true,
        permalink: true,
        category: true,
        format: true,
      },
    });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los equipos');
      return {
        ok: false,
        message: error.message,
        tournaments: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los torneos, revise los logs del servidor',
      tournaments: null,
    };
  }
};
