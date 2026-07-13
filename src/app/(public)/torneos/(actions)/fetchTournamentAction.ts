'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TournamentType = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  description: string | null;
  country: string | null;
  cities: string[] | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  categories: {
    id: string;
    name: string;
    permalink: string;
  }[];
};

type FetchTournamentResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: TournamentType | null;
}>;

export const fetchTournamentAction = async (permalink: string): FetchTournamentResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('public-tournament');

  try {
    const tournamentSelect = {
      id: true,
      name: true,
      permalink: true,
      imageUrl: true,
      description: true,
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              permalink: true,
            },
          },
        },
      },
      country: true,
      cities: true,
      season: true,
      startDate: true,
      endDate: true,
    } satisfies Prisma.TournamentSelect;

    const tournament = await prisma.tournament.findFirst({
      where: { permalink },
      select: tournamentSelect,
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
        categories: tournament.categories.map(c => c.category),
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
