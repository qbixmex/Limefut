'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TournamentType = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  description: string | null;
  country: string | null;
  cities: string[] | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  stage: string;
  categories: {
    id: string;
    name: string;
    permalink: string;
  }[];
  teams: {
    id: string;
    name: string;
    permalink: string;
    category: string;
    format: string;
    imageUrl: string | null;
  }[];
  teamsQuantity: number;
};

type FetchTournamentResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: TournamentType | null;
}>;

export const fetchTournamentAction = async (
  permalink: string,
  category: string,
): FetchTournamentResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('public-tournament');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink,
        category,
      },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        description: true,
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                permalink: true,
              },
            },
          },
        },
        country: true,
        cities: true,
        season: true,
        startDate: true,
        endDate: true,
        stage: true,
        teams: {
          where: {
            active: true,
          },
          select: {
            id: true,
            name: true,
            permalink: true,
            category: true,
            format: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            teams: true,
          },
        },
      },
    });

    if (!tournament) {
      return {
        ok: false,
        message: '¡ Torneo no encontrado ❌ !',
        tournament: null,
      };
    }

    return {
      ok: true,
      message: '¡ Torneo obtenido correctamente 👍 !',
      tournament: {
        ...tournament,
        categories: tournament.categories.map(c => c.category),
        teamsQuantity: tournament._count.teams ?? 0,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el torneo,\n¡ Revise los logs del servidor !',
        tournament: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      tournament: null,
    };
  }
};
