'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  matches: LAST_MATCH_TYPE[];
}>;

export type LAST_MATCH_TYPE = {
  id: string;
  localTeam: {
    name: string;
    imageUrl: string | null;
    score: number;
  };
  visitorTeam: {
    name: string;
    imageUrl: string | null;
    score: number;
  };
  matchDetails: {
    matchDate: Date | null;
    place: string | null;
    week: number | null;
    status: string;
  };
};

export const fetchLastMatchesAction = async ({
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
              { status: 'completed' },
            ],
          },
        ],
      },
      select: {
        id: true,
        matchDate: true,
        place: true,
        status: true,
        week: true,
        localScore: true,
        visitorScore: true,
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
        matchDate: 'desc',
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
          score: match.localScore ?? 0,
        },
        visitorTeam: {
          name: match.visitor.name,
          imageUrl: match.visitor.imageUrl,
          score: match.visitorScore ?? 0,
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
