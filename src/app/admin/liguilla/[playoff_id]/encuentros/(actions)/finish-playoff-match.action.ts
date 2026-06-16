'use server';

import prisma from '@/lib/prisma';
import { MATCH_STATUS } from '@/shared/enums';
import { updateTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

type Props = {
  matchId: string;
  localScore: number;
  visitorScore: number;
  localId: string;
  visitorId: string;
};

export const finishPlayoffMatchAction = async (props: Props): ResponseAction => {
  const { matchId, localScore, visitorScore, localId, visitorId } = props;

  const winnerId = setWinnerTeamId({ localScore, visitorScore, localId, visitorId });

  const updatedMatch = await prisma.playoffMatch.update({
    where: { id: matchId },
    data: {
      localScore,
      visitorScore,
      winnerId,
      status: MATCH_STATUS.COMPLETED,
    },
  });

  // Refresh Match
  updateTag('admin-playoff-matches');
  updateTag('admin-playoff-match');
  updateTag('public-playoff-matches');
  updateTag('public-playoff-match');

  if (!updatedMatch) {
    return {
      ok: false,
      message: '¡ No se pudo finalizar el partido !',
    };
  }

  return {
    ok: true,
    message: '¡ El estado del partido finalizó correctamente ⚽️🎉 !',
  };
};

const setWinnerTeamId = ({
  localScore,
  visitorScore,
  localId,
  visitorId,
}: {
  localScore: number;
  visitorScore: number;
  localId: string;
  visitorId: string;
}) => {
  let winnerId: string | null;

  switch (true) {
    case localScore > visitorScore:
      winnerId = localId;
      break;
    case visitorScore > localScore:
      winnerId = visitorId;
      break;
    case visitorScore === localScore:
      winnerId = null;
      break;
    default:
      winnerId = null;
  }

  return winnerId;
};
