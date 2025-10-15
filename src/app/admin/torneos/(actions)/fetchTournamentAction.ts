'use server';

import prisma from '@/lib/prisma';
import { Tournament } from "@/shared/interfaces";

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: Tournament | null;
}>;

export const fetchTournamentAction = async (
  permalink: string,
  userRole: string[] | null,
): FetchTeamResponse => {
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
        id: tournament.id,
        name: tournament.name,
        permalink: tournament.permalink,
        description: tournament.description,
        country: tournament.country,
        state: tournament.state,
        city: tournament.city,
        season: tournament.season,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        active: tournament.active,
        createdAt: tournament.createdAt,
        updatedAt: tournament.updatedAt,
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
