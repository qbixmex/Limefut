'use server';

import prisma from "@/lib/prisma";

type OptionsType = {
  week?: number;
};

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: {
    id: string;
    name: string;
  }[] | null;
}>;

export const fetchTeamsForMatchAction = async (options?: OptionsType): ResponseFetchTeams => {
  const { week } = options ?? {};

  try {
    // Get teams that are already scheduled for the specified week.
    const scheduledTeams = week ? await prisma.match.findMany({
      where: { week },
      select: {
        localId: true,
        visitorId: true,
        week: true,
      },
    }) : [];

    // Extract all team IDs that are already scheduled.
    const scheduledTeamsIds = new Set([
      ...scheduledTeams.map(match => match.localId),
      ...scheduledTeams.map(match => match.visitorId),
    ]);

    // Get all active teams excluding those already scheduled.
    const teams = await prisma.team.findMany({
      where: {
        active: true,
        ...({
          id: {
            notIn: Array.from(scheduledTeamsIds),
          }
        })
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
        teams: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los equipos, revise los logs del servidor",
      teams: null,
    };
  }
};
