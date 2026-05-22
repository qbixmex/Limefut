'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { updateTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateStatusAction = async (matchId: string, status: MATCH_STATUS_TYPE): ResponseAction => {
  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: { status },
  });

  if (!updatedMatch) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el estado del partido !',
    };
  }

  updateTag('admin-matches');
  updateTag('admin-match');
  updateTag('matches');
  updateTag('dashboard-results');
  updateTag('public-matches');
  updateTag('public-results-roles');
  updateTag('public-result-details');
  updateTag('public-matches-count');
  updateTag('public-team-matches');
  updateTag('public-team-standings');

  return {
    ok: true,
    message: '¡ El estado del partido fue actualizado correctamente 👍 !',
  };
};
