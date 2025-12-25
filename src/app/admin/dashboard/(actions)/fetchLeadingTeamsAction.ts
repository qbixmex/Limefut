'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  quantity: number;
}>;

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  leadingTeams: {
    team: {
      id: string;
      name: string;
      permalink: string;
    };
    tournament: {
      name: string;
      permalink: string;
    };
    points: number;
  }[];
}>;

export const fetchLeadingTeamsAction = async ({ quantity }: Options): Promise<ResponseFetch> => {
  "use cache";

  cacheLife('days');
  cacheTag('dashboard-leading');

  // Only takes positive numbers
  const safeQuantity = Math.max(1, quantity);

  try {
    const standings = await prisma.standings.findMany({
      where: {
        tournament: {
          active: true,
        },
      },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        tournament: {
          select: {
            name: true,
            permalink: true,
          },
        },
        totalPoints: true,
      },
      orderBy: [
        { totalPoints: 'desc' },
      ],
      distinct: ['tournamentId'],
      take: safeQuantity,
    });


    return {
      ok: true,
      message: '! Los resultados fueron obtenidos correctamente 👍',
      leadingTeams: standings.map((standing) => ({
        team: {
          id: standing.team.id,
          name: standing.team.name,
          permalink: standing.team.permalink,
        },
        tournament: {
          name: standing.tournament.name,
          permalink: standing.tournament.permalink,
        },
        points: standing.totalPoints,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los equipos punteros");
      console.log(`Error: ${error.message}`);
      return {
        ok: false,
        message: error.message,
        leadingTeams: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los equipos punteros, revise los logs del servidor",
      leadingTeams: [],
    };
  }
};
