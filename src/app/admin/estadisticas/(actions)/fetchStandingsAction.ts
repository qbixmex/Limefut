'use server';

import prisma from '@/lib/prisma';
import type { STAGE_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
  country: string | null;
  cities: string[];
  season: string | null;
  startDate: Date;
  endDate: Date;
  stage: STAGE_TYPE;
  teams: {
    id: string;
    name: string;
    permalink: string;
  }[];
};

export type STANDING_TYPE = {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  additionalPoints: number;
  points: number;
  tournament: {
    id: string;
    name: string;
    permalink: string;
  };
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null;
  team: {
    name: string;
    id: string;
    permalink: string;
  };
};

export type StandingPromise = Promise<{
  ok: boolean;
  message: string;
  tournament: TOURNAMENT_TYPE | null;
  standings: STANDING_TYPE[] | null;
}>;

export const fetchStandingsAction = async (tournamentId: string): StandingPromise => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-standings');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: { id: tournamentId },
      select: {
        id: true,
        name: true,
        permalink: true,
        country: true,
        cities: true,
        season: true,
        startDate: true,
        endDate: true,
        stage: true,
        teams: {
          where: { active: true },
          select: {
            id: true,
            name: true,
            permalink: true,
            stage: true,
          },
        },
      },
    });

    if (!tournament) {
      return {
        ok: false,
        message: `¡ El torneo con el id <${tournamentId}> no existe !`,
        tournament: null,
        standings: null,
      };
    }

    const standings = await prisma.standings.findMany({
      where: { tournamentId },
      select: {
        matchesPlayed: true,
        wins: true,
        draws: true,
        losses: true,
        goalsFor: true,
        goalsAgainst: true,
        goalsDifference: true,
        additionalPoints: true,
        points: true,
        team: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
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
      orderBy: {
        totalPoints: 'desc',
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
      console.log('Error al intentar obtener las estadísticas');
      return {
        ok: false,
        message: error.message,
        tournament: null,
        standings: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener las estadísticas, revise los logs del servidor',
      tournament: null,
      standings: null,
    };
  }
};
