'use server';

import prisma from '@/lib/prisma';
import type { MATCH_MODE_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type MATCH_TYPE = {
  id: string;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  mode: MATCH_MODE_TYPE;
  week: number | null;
  status: string;
  field: {
    id: string;
    name: string;
  } | null;
  tournament: {
    name: string;
    permalink: string;
  };
  category: {
    name: string;
    permalink: string;
  } | null;
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
  matches: MATCH_TYPE[];
}>;

export const fetchPublicResultsAction = async ({
  tournamentPermalink,
  categoryPermalink,
  roles,
  teamPermalink,
}: {
  tournamentPermalink: string,
  categoryPermalink: string,
  roles?: string,
  teamPermalink?: string,
}): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('public-results');

  try {
    const matches = await prisma.match.findMany({
      where: {
        tournament: { permalink: tournamentPermalink },
        category: { permalink: categoryPermalink },
        ...(roles === 'team' && teamPermalink
          ? {
            OR: [
              { local: { permalink: teamPermalink } },
              { visitor: { permalink: teamPermalink } },
            ],
          }
          : {}),
      },
      select: {
        id: true,
        localScore: true,
        visitorScore: true,
        matchDate: true,
        mode: true,
        week: true,
        status: true,
        field: {
          select: {
            id: true,
            name: true,
          },
        },
        tournament: {
          select: {
            name: true,
            permalink: true,
          },
        },
        category: {
          select: {
            name: true,
            permalink: true,
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
      orderBy: { week: 'asc' },
    });

    if (!matches) {
      return {
        ok: false,
        message: `No se encontraron encuentros en el torneo [${tournamentPermalink}]`,
        matches: [],
      };
    }

    return {
      ok: true,
      message: 'Los encuentros fueron obtenidos correctamente',
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
