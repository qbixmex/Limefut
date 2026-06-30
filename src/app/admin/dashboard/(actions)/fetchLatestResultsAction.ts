'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type Options = Readonly<{
  quantity: number;
}>;

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  latestResults: {
    id: string;
    localTeamName: string;
    localTeamScore: number;
    visitorTeamName: string;
    visitorTeamScore: number;
    category: {
      id: string;
      name: string;
      permalink: string;
    } | null;
  }[];
}>;

export const fetchLatestResultsAction = async ({ quantity }: Options): Promise<ResponseFetch> => {
  'use cache';

  cacheLife('days');
  cacheTag('dashboard-results');

  try {
    const matches = await prisma.match.findMany({
      where: {
        status: 'completed',
      },
      orderBy: {
        matchDate: 'desc',
      },
      select: {
        id: true,
        local: {
          select: { name: true },
        },
        localScore: true,
        visitor: {
          select: { name: true },
        },
        visitorScore: true,
        category: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      },
      take: quantity,
    });

    return {
      ok: true,
      message: '! Los resultados fueron obtenidos correctamente 👍',
      latestResults: matches.map((match) => ({
        ...match,
        localTeamName: match.local.name,
        localTeamScore: match.localScore as number,
        visitorTeamName: match.visitor.name,
        visitorTeamScore: match.visitorScore as number,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los torneos');
      return {
        ok: false,
        message: error.message,
        latestResults: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los resultados, revise los logs del servidor',
      latestResults: [],
    };
  }
};
