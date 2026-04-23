'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export const addTeamToStandingsAction = async ({
  tournamentId,
  teamId,
  userRole,
}: {
  tournamentId: string,
  teamId: string,
  userRole: string[] | null,
}): Promise<{ ok: boolean; }> => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return { ok: false };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const standingsCount = await transaction.standings.count({
        where: { tournamentId, teamId },
      });

      if (standingsCount === 0) {
        await transaction.standings.create({
          data: { tournamentId, teamId },
        });
        return { ok: true };
      }

      return { ok: true };
    });

    // Update Cache
    updateTag('admin-standings');
    updateTag('public-standings');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        console.log(fieldError);
        return { ok: false };
      }

      console.log('NAME:', error.name);
      console.log('CAUSE:', error.cause);
      console.log('MESSAGE:', error.message);

      return { ok: false };
    }
    console.log(error);
    return { ok: false };
  }
};
