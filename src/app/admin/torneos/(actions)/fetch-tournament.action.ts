'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TournamentType = {
  id: string;
  name: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  permalink: string;
  description: string | null;
  category: string | null;
  format: string;
  gender: string;
  country: string | null;
  state: string | null;
  city: string | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  currentWeek: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: {
    id: string;
    name: string;
  }[];
  teams: {
    id: string;
    name: string;
  }[];
  stage: string;
  teamsQuantity: number;
};

type FetchTournamentResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: TournamentType | null;
}>;

export const fetchTournamentAction = async (
  tournamentId: string,
  userRole: string[] | null,
): FetchTournamentResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-tournament');

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      tournament: null,
    };
  }

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { teams: true },
        },
      },
    });

    if (!tournament) {
      return {
        ok: false,
        message: '¡ Torneo no encontrado ❌ !',
        tournament: null,
      };
    }

    return {
      ok: true,
      message: '¡ Torneo obtenido correctamente 👍 !',
      tournament: {
        ...tournament,
        teamsQuantity: tournament._count.teams ?? 0,
        categories: tournament.categories.map((tournamentCategory) => {
          return tournamentCategory.category;
        }),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el torneo,\n¡ Revise los logs del servidor !',
        tournament: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      tournament: null,
    };
  }
};
