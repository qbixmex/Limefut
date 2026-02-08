'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

type OptionsType = {
  tournamentId: string;
  week: number;
};

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: {
    id: string;
    name: string;
  }[];
}>;

export const fetchTeamsForMatchAction = async ({ tournamentId, week }: OptionsType)
  : ResponseFetchTeams => {
  "use cache";

  cacheLife("days");
  cacheTag("admin-teams-for-match");

  try {
    // Get teams that are already scheduled for the specified tournament and week.
    const scheduledTeams = await prisma.match.findMany({
      where: {
        tournamentId,
        week,
      },
      select: {
        localId: true,
        visitorId: true,
        week: true,
      },
    });

    // Extract all team IDs that are already scheduled.
    const scheduledTeamsIds = new Set([
      ...scheduledTeams.map(match => match.localId),
      ...scheduledTeams.map(match => match.visitorId),
    ]);

    // Get all active teams excluding those already scheduled.
    const teams = await prisma.team.findMany({
      where: {
        tournamentId,
        ...({
          id: {
            notIn: Array.from(scheduledTeamsIds),
          },
        }),
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍',
      teams,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los equipos");
      return {
        ok: false,
        message: error.message,
        teams: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los equipos, revise los logs del servidor",
      teams: [],
    };
  }
};
