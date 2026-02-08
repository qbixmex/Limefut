'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TournamentType = {
  weeks: number[];
};

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: TournamentType | null,
}>;

export const fetchTournamentForMatchAction = async (id: string): FetchResponse => {
  "use cache";
  
  cacheLife("days");
  cacheTag("admin-tournament-for-match");

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      select: {
        matches: {
          select: {
            week: true,
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
        weeks: Array.from(
          new Set(
            tournament.matches
              .map((m) => m.week)
              .filter((w): w is number => w !== null),
          ),
        ).sort((a, b) => a - b),
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
