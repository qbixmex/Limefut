'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

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
}: {
  tournamentPermalink: string,
  categoryPermalink: string,
}): ResponseFetchTeams => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-teams-for-match');

  try {
    const teams = await prisma.team.findMany({
      where: {
        tournament: {
          permalink: tournamentPermalink,
        },
        category: {
          permalink: categoryPermalink,
        },
      },
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
    });

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍',
      teams: teams.map((team) => ({
        ...team,
        fields: team.fields.map((teamField) => teamField.field),
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('='.repeat(20) + ' ERROR ' + '='.repeat(20));
      console.log('NAME:', error.name);
      console.log('CAUSE:', error.cause);
      console.log('MESSAGE:', error.message);
      console.log('STACK:', error.stack);
      console.log('='.repeat(47));

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
