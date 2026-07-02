'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: {
    id: string;
    name: string;
  }[];
}>;

export const fetchTeamsForPlayer = async ({
  tournamentPermalink,
  categoryPermalink,
}: {
  tournamentPermalink: string | undefined;
  categoryPermalink: string | undefined;
}): ResponseFetchTeams => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-teams-for-player');

  if (!tournamentPermalink && !categoryPermalink) {
    return {
      ok: false,
      message: '¡ El torneo y la categoría son obligatorios !',
      teams: [],
    };
  }

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink: tournamentPermalink,
        category: categoryPermalink,
      },
      select: { id: true },
    });

    if (!tournament) {
      return {
        ok: false,
        message: '¡ No hay equipos registrados con el torneo y categoría subministrados !',
        teams: [],
      };
    }

    const teams = await prisma.team.findMany({
      orderBy: { name: 'asc' },
      where: {
        tournamentId: tournament.id,
      },
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
