'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type Options = Readonly<{
  tournamentPermalink: string;
  categoryPermalink: string;
}>;

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: TEAM_TYPE[];
}>;

export type TEAM_TYPE = {
  id: string;
  name: string;
  fields: {
    id: string;
    name: string;
  }[];
};

export const fetchTeamsForMatchCreateAction = async ({
  tournamentPermalink,
  categoryPermalink,
}: Options): ResponseFetchTeams => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-teams-for-match');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink: tournamentPermalink,
        category: categoryPermalink,
      },
      orderBy: { name: 'asc' },
      select: {
        teams: {
          select: {
            id: true,
            name: true,
            fields: {
              include: {
                field: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      return {
        ok: false,
        message: `¡ No se encontró el torneo con enlace permanente [${tournamentPermalink}] y categoría [${categoryPermalink}] !`,
        teams: [],
      };
    }

    const teams = tournament.teams.map((team) => ({
      ...team,
      fields: team.fields.map((teamField) => teamField.field),
    }));

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍',
      teams,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los equipos');
      return {
        ok: false,
        message: error.message,
        teams: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los equipos, revise los logs del servidor',
      teams: [],
    };
  }
};
