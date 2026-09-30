'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/get-session';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteStandingsAction = async ({
  tournamentId,
  categoryId,
}: {
  tournamentId: string;
  categoryId: string;
}): ResponseDeleteAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

  try {
    // Delete Standings from database (only the given tournament and category)
    await prisma.standings.deleteMany({
      where: { tournamentId, categoryId },
    });

    // Update Cache
    updateTag('admin-standings');
    updateTag('admin-tournaments-for-standings');
    updateTag('public-standings');

    return {
      ok: true,
      message: 'Las estadísticas han sido eliminadas correctamente',
    };
  } catch (error) {
    console.log('ERROR AL ELIMINAR LAS ESTADÍSTICAS:', error);
    return {
      ok: false,
      message: 'Error al eliminar las estadísticas, revise los logs del servidor',
    };
  }
};
