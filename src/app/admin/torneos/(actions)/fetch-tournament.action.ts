'use server';

import prisma from '@/lib/prisma';
import type { STAGE_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  permalink: string;
  description: string | null;
  country: string | null;
  cities: string[];
  season: string | null;
  startDate: Date;
  endDate: Date;
  stage: STAGE_TYPE;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: {
    id: string;
    name: string;
    permalink: string;
  }[];
  teams: {
    id: string;
    name: string;
  }[];
  teamsQuantity: number;
};

type FetchTournamentResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: TOURNAMENT_TYPE | null;
}>;

export const fetchTournamentAction = async (
  tournamentId: string,
  userRole: string[] | null,
): FetchTournamentResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-tournament');

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      tournament: null,
    };
  }

  try {
    const tournament = await prisma.tournament.findFirst({
      where: { id: tournamentId },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        imagePublicID: true,
        description: true,
        country: true,
        cities: true,
        season: true,
        startDate: true,
        endDate: true,
        stage: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
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
        _count: {
          select: { teams: true },
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
        teamsQuantity: tournament._count.teams ?? 0,
        categories: tournament.categories.map((tc) => tc.category),
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
