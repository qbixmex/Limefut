'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { updateTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updatePlayoffMatchStatusAction = async (matchId: string, status: MATCH_STATUS_TYPE): ResponseAction => {
  const updatedMatch = await prisma.playoffMatch.update({
    where: { id: matchId },
    data: { status },
  });

  if (!updatedMatch) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el estado del partido !',
    };
  }

  updateTag('admin-playoff-matches');
  updateTag('admin-playoff-match');

  return {
    ok: true,
    message: '¡ El estado del partido fue actualizado correctamente 👍 !',
  };
};
