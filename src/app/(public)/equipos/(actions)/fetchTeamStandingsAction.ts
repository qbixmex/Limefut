'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type StandingsType = {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalsDifference: number;
    additionalPoints: number;
    points: number;
    totalPoints: number;
    position: number;
};

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  standings: StandingsType | null;
}>;

export const fetchTeamStandingsAction = async ({
  teamId,
  tournamentId,
}: {
  teamId: string;
  tournamentId: string;
}): FetchTeamResponse => {
  "use cache";

  cacheLife('days');
  cacheTag('public-team-standings');

  try {
    const teamStandings = await prisma.standings.findFirst({
      where: { teamId },
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
        totalPoints: true,
      },
    });

    if (!teamStandings) {
      return {
        ok: false,
        message: '¡ No hay estadísticas para este equipo ❌ !',
        standings: null,
      };
    }

    const tournamentStandings = await prisma.standings.findMany({
      where: { tournamentId },
      orderBy: [
        { totalPoints: 'desc' },
        { points: 'desc' },
        { goalsDifference: 'desc' },
      ],
      select: {
        teamId: true,
      },
    });

    let position = 0;

    tournamentStandings.forEach((std,index) => {
      if (std.teamId === teamId) {
        position = index + 1;
      }
    });

    return {
      ok: true,
      message: '¡ Las estadísticas fueron obtenidas correctamente 👍 !',
      standings: {
        ...teamStandings,
        position,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener las estadísticas,\n¡ Revise los logs del servidor !",
        standings: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      standings: null,
    };
  }
};
