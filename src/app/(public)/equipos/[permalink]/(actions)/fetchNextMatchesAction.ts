'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  matches: NEXT_MATCH_TYPE[];
}>;

export type NEXT_MATCH_TYPE = {
  id: string;
  localTeam: {
    name: string;
    imageUrl: string | null;
  };
  visitorTeam: {
    name: string;
    imageUrl: string | null;
  };
  matchDetails: {
    matchDate: Date | null;
    place: string | null;
    week: number | null;
    status: string;
  };
};

export const fetchNextMatchesAction = async ({
  teamId,
  count,
}: {
  teamId: string;
  count: number;
}): FetchTeamResponse => {
  "use cache";

  cacheLife('days');
  cacheTag('public-team-matches');

  try {
    const matches = await prisma.match.findMany({
      where: {
        AND: [
          {
            OR: [
              { localId: teamId },
              { visitorId: teamId },
            ],
          },
          {
            OR: [
              { status: 'scheduled' },
              { status: 'inProgress' },
              { status: 'postPosed' },
            ],
          },
          {
            matchDate: {
              gte: new Date(),
            },
          },
        ],
      },
      select: {
        id: true,
        matchDate: true,
        place: true,
        status: true,
        week: true,
        local: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
        visitor: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        matchDate: 'asc',
      },
      take: count,
    });

    return {
      ok: true,
      message: '¡ Encuentros obtenidos correctamente 👍 !',
      matches: matches.map((match) => ({
        id: match.id,
        localTeam: {
          name: match.local.name,
          imageUrl: match.local.imageUrl,
        },
        visitorTeam: {
          name: match.visitor.name,
          imageUrl: match.visitor.imageUrl,
        },
        matchDetails: {
          matchDate: match.matchDate,
          place: match.place,
          week: match.week,
          status: match.status,
        },
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener los encuentros,\n¡ Revise los logs del servidor !",
        matches: [],
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      matches: [],
    };
  }
};
