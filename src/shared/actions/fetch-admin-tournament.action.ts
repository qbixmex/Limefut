'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  tournamentId: string | null;
}>;

export const fetchAdminTournamentAction = async ({
  tournamentPermalink,
  categoryPermalink,
}: {
  tournamentPermalink: string | undefined;
  categoryPermalink: string | undefined;
}): FetchTeamResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('tournamentId');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink: tournamentPermalink,
        categories: {
          some: {
            category: {
              permalink: categoryPermalink,
            },
          },
        },
      },
      select: { id: true },
    });

    if (!tournament) {
      return {
        ok: false,
        message: `¡ El torneo con el enlace permanente: "${tournamentPermalink}" y categoría "${categoryPermalink}" no existe ❌ !`,
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
