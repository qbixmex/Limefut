'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TournamentType = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
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
  stage: string;
  teams: {
    id: string;
    name: string;
    permalink: string;
    category: string;
    format: string;
    imageUrl: string | null;
  }[];
  teamsQuantity: number;
};

type FetchTournamentResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: TournamentType | null;
}>;

export const fetchTournamentAction = async (
  permalink: string,
  category: string,
  format: string,
): FetchTournamentResponse => {
  "use cache";

  cacheLife('days');
  cacheTag('public-tournament');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink,
        category,
        format,
      },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        description: true,
        category: true,
        format: true,
        gender: true,
        country: true,
        state: true,
        city: true,
        season: true,
        startDate: true,
        endDate: true,
        currentWeek: true,
        stage: true,
        teams: {
          select: {
            id: true,
            name: true,
            permalink: true,
            category: true,
            format: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            teams: true,
          },
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
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener el torneo,\n¡ Revise los logs del servidor !",
        tournament: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      tournament: null,
    };
  }
};
