'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

type Params = Readonly<{
  matchId: string;
  score: number;
  local: boolean;
  visitor: boolean;
}>;

export const updatePlayoffMatchInputScoreAction = async (params: Params): ResponseAction => {
  const { matchId, score, local, visitor } = params;

  const updatedMatch = await prisma.playoffMatch.update({
    where: { id: matchId },
    data: {
      localScore: local ? score : undefined,
      visitorScore: visitor ? score : undefined,
    },
  });

  updateTag('admin-playoff-matches');
  updateTag('admin-playoff-match');
  updateTag('public-playoff-matches');
  updateTag('public-playoff-match');

  if (!updatedMatch) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el marcador del partido !',
    };
  }

  return {
    ok: true,
    message: '¡ El marcador del partido fue actualizado correctamente 👍 !',
  };
};
