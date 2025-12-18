'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TournamentType = {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  division: string | null;
  group: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  currentWeek: number | null;
  teams: {
    id: string;
    name: string;
    permalink: string;
    imageUrl: string | null;
  }[];
};

type FetchTournamentResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: TournamentType | null;
}>;

export const fetchTournamentAction = async (
  permalink: string,
): FetchTournamentResponse => {
  "use cache";

  cacheLife('days');
  cacheTag('public-tournament');

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { permalink: permalink },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        division: true,
        group: true,
        country: true,
        state: true,
        city: true,
        season: true,
        startDate: true,
        endDate: true,
        currentWeek: true,
        teams: {
          select: {
            id: true,
            name: true,
            permalink: true,
            imageUrl: true,
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
      tournament,
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
