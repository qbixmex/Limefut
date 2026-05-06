'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  tournamentId: string | null;
}>;

export const fetchTournamentByPermalinkAndCategory = async ({
  permalink,
  category,
}: {
  permalink: string;
  category: string;
}): FetchTeamResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('tournamentId');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: { permalink, category },
      select: { id: true },
    });

    if (!tournament) {
      return {
        ok: false,
        message: `¡ El torneo con el enlace permanente: "${permalink}" y categoría "${category}" no existe ❌ !`,
        tournamentId: null,
      };
    }

    return {
      ok: true,
      message: '¡ Torneo obtenido correctamente 👍 !',
      tournamentId: tournament.id,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: 'No se pudo obtener el torneo,\n¡ Revise los logs del servidor !',
        tournamentId: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      tournamentId: null,
    };
  }
};
