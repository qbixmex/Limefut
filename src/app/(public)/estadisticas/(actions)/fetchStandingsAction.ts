'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
  country: string | null;
  cities: string[] | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  teams: {
    id: string;
    name: string;
    permalink: string;
    tournamentId: string | null;
    categoryId: string | null;
  }[];
};

export type STANDING_TYPE = {
  team: {
    id: string;
    name: string;
    permalink: string;
  };
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  additionalPoints: number;
  points: number;
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null;
};

export type StandingPromise = Promise<{
  ok: boolean;
  message: string;
  tournament: TOURNAMENT_TYPE | null;
  standings: STANDING_TYPE[];
}>;

export const fetchStandingsAction = async ({
  tournamentPermalink,
  categoryPermalink,
}: {
  tournamentPermalink: string;
  categoryPermalink: string;
}): StandingPromise => {
  'use cache';

  cacheLife('days');
  cacheTag('public-standings');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink: tournamentPermalink,
      },
      select: {
        id: true,
        name: true,
        permalink: true,
        country: true,
        cities: true,
        season: true,
        startDate: true,
        endDate: true,
        teams: {
          where: {
            category: {
              permalink: categoryPermalink,
            },
          },
          select: {
            id: true,
            name: true,
            permalink: true,
            tournamentId: true,
            categoryId: true,
          },
        },
      },
    });

    if (!tournament) {
      return {
        ok: false,
        message: '¡ No se pudo obtener el torneo ❌ !',
        tournament: null,
        standings: [],
      };
    }

    const standings = await prisma.standings.findMany({
      where: { tournamentId: tournament.id },
      orderBy: {
        totalPoints: 'desc',
      },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        matchesPlayed: true,
        wins: true,
        draws: true,
        losses: true,
        goalsFor: true,
        goalsAgainst: true,
        goalsDifference: true,
        additionalPoints: true,
        points: true,
        tournament: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      },
    });

    return {
      ok: true,
      message: '! Las estadísticas fueron obtenidas correctamente 👍',
      tournament,
      standings,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        ok: false,
        message: error.message,
        tournament: null,
        standings: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener las estadísticas, revise los logs del servidor',
      tournament: null,
      standings: [],
    };
  }
};
