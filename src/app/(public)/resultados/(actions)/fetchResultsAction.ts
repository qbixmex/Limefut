'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type MatchType = {
  id: string;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  week: number | null;
  status: string;
  place: string | null;
  tournament: {
    name: string;
    permalink: string;
    category: string | null;
    format: string | null;
  };
  local: {
    name: string;
    permalink: string;
  };
  visitor: {
    name: string;
    permalink: string;
  };
  penaltyShootout: {
    localGoals: number;
    visitorGoals: number;
  } | null;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  matches: MatchType[];
}>;

export const fetchResultsAction = async (
  tournamentPermalink: string,
  category: string,
  format: string,
  roles?: string,
  teamPermalink?: string,
): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag(`public-results-roles-${teamPermalink ?? 'all'}`);

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink: tournamentPermalink,
        category,
        format,
      },
      include: {
        matches: {
          where: roles === 'team' && teamPermalink
            ? {
                OR: [
                  { local: { permalink: teamPermalink } },
                  { visitor: { permalink: teamPermalink } },
                ],
              }
            : undefined,
          orderBy: { week: 'asc' },
          select: {
            id: true,
            localScore: true,
            visitorScore: true,
            matchDate: true,
            week: true,
            status: true,
            place: true,
            tournament: {
              select: {
                name: true,
                permalink: true,
                category: true,
                format: true,
              },
            },
            local: {
              select: {
                id: true,
                name: true,
                permalink: true,
              },
            },
            visitor: {
              select: {
                name: true,
                permalink: true,
              },
            },
            penaltyShootout: {
              select: {
                localGoals: true,
                visitorGoals: true,
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      return {
        ok: false,
        message: '! No se encontró el torneo ❌ ¡',
        matches: [],
      };
    }

    const matches = tournament.matches.map((match) => ({
      ...match,
      tournament: match.tournament,
    }));

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matches,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros');
      return {
        ok: false,
        message: error.message,
        matches: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los encuentros, revise los logs del servidor',
      matches: [],
    };
  }
};
