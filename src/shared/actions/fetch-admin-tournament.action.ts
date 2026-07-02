'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: { id: string } | null;
}>;

export const fetchAdminTournamentAction = async (
  tournamentPermalink: string | undefined,
): FetchResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('tournamentId');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink: tournamentPermalink,
      },
      select: { id: true },
    });

    if (!tournament) {
      return {
        ok: false,
        message: `¡ El torneo con el enlace permanente: "${tournamentPermalink}" no existe ❌ !`,
        tournament: null,
      };
    }

    return {
      ok: true,
      message: '¡ Torneo obtenido correctamente 👍 !',
      tournament: { id: tournament.id },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

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
