'use server';

import prisma from "@/lib/prisma";

export type TournamentType = {
  id: string;
  name: string;
  permalink: string;
  category: string;
  format: string;
  country: string | null;
  state: string | null;
  city: string | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  currentWeek: number | null;
  teams: {
    id: string;
    name: string;
    permalink: string;
  }[];
};

export type StandingType = {
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
    name: string;
    id: string;
    category: string;
    permalink: string;
    format: string;
  };
  team: {
    name: string;
    id: string;
    permalink: string;
  };
};

export type StandingPromise = Promise<{
  ok: boolean;
  message: string;
  tournament: TournamentType | null;
  standings: StandingType[] | null;
}>;

export const fetchStandingsAction = async (tournamentId: string): StandingPromise => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        name: true,
        permalink: true,
        category: true,
        format: true,
        country: true,
        state: true,
        city: true,
        season: true,
        startDate: true,
        endDate: true,
        currentWeek: true,
        teams: {
          select: {
            id: true,
            name: true,
            permalink: true,
            category: true,
            format: true,
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
            category: true,
            format: true,
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
      console.log("Error al intentar obtener las estadísticas");
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
      message: "Error inesperado al obtener las estadísticas, revise los logs del servidor",
      tournament: null,
      standings: null,
    };
  }
};
