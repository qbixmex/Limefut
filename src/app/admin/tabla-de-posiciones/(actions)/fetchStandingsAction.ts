'use server';

import prisma from "@/lib/prisma";

export type TournamentType = {
  id: string;
  name: string;
  permalink: string;
  country: string;
  state: string;
  city: string;
  season: string;
  startDate: Date;
  endDate: Date;
  currentWeek: number;
  teams: {
    id: string;
    name: string;
    permalink: string;
  }[];
};

export type StandingType = {
  team: {
    id: string;
    name: string;
    permalink: string;
  };
  matchesPlayed: number;
  wings: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  points: number;
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
          }
        }
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
      orderBy: {
        points: 'desc',
      },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            permalink: true,
          }
        },
        matchesPlayed: true,
        wings: true,
        draws: true,
        losses: true,
        goalsFor: true,
        goalsAgainst: true,
        goalsDifference: true,
        points: true,
        tournament: {
          select: {
            id: true,
            name: true,
            permalink: true,
          }
        }
      },
    });

    const standingsOutput = standings.map((standing) => ({
      team: {
        id: standing.team.id,
        name: standing.team.name,
        permalink: standing.team.permalink,
      },
      matchesPlayed: standing.matchesPlayed,
      wings: standing.wings,
      draws: standing.draws,
      losses: standing.losses,
      goalsFor: standing.goalsFor,
      goalsAgainst: standing.goalsAgainst,
      goalsDifference: standing.goalsDifference,
      points: standing.points,
    }));

    return {
      ok: true,
      message: '! Las estadísticas fueron obtenidas correctamente 👍',
      tournament,
      standings: standingsOutput,
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
