'use server';

import prisma from '@/lib/prisma';
import { Tournament, Team } from "@/shared/interfaces";

type FetchTournamentResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: Tournament & { teams: Partial<Team>[] } | null;
}>;

export const fetchTournamentAction = async (
  permalink: string,
  userRole: string[] | null,
): FetchTournamentResponse => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      tournament: null,
    };
  }

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { permalink: permalink },
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            permalink: true,
          }
        }
      }
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
