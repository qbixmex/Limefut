'use server';

import prisma from "@/lib/prisma";
import { MATCH_STATUS } from "@/shared/enums";
import { updateTag } from "next/cache";

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

export const finishMatchAction = async (props: Props): ResponseAction => {
  const { matchId, localScore, visitorScore, localId, visitorId } = props;

  let localPoints = 0;
  let visitorPoints = 0;

  if (localScore > visitorScore) {
    localPoints = 3;
  } else if (localScore < visitorScore) {
    visitorPoints = 3;
  } else {
    localPoints = 1;
    visitorPoints = 1;
  }

  try {
    // Update Local Team Standings
    await prisma.standings.update({
      where: { teamId: localId },
      data: {
        matchesPlayed: { increment: 1 },
        wins: { increment: localPoints === 3 ? 1 : 0 },
        losses: { increment: localPoints === 0 ? 1 : 0 },
        draws: { increment: localPoints === 1 ? 1 : 0 },
        goalsFor: { increment: localScore },
        goalsAgainst: { increment: visitorScore },
        goalsDifference: { increment: localScore - visitorScore },
        points: { increment: localPoints },
        totalPoints: { increment: localPoints },
      },
    });
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }

  try {
    // Update Visitor Team Standings
    await prisma.standings.update({
      where: { teamId: visitorId },
      data: {
        matchesPlayed: { increment: 1 },
        wins: { increment: visitorPoints === 3 ? 1 : 0 },
        losses: { increment: visitorPoints === 0 ? 1 : 0 },
        draws: { increment: visitorPoints === 1 ? 1 : 0 },
        goalsFor: { increment: visitorScore },
        goalsAgainst: { increment: localScore },
        goalsDifference: { increment: visitorScore - localScore },
        points: { increment: visitorPoints },
        totalPoints: { increment: visitorPoints },
      },
    });
  } catch(error) {
    console.error(`Error: ${(error as Error).message}`);
  }

  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: {
      localScore,
      visitorScore,
      status: MATCH_STATUS.COMPLETED,
    },
  });

  // Refresh Match
  updateTag('admin-matches');
  updateTag('admin-match');
  updateTag('matches');
  updateTag('public-standings');
  updateTag('dashboard-results');
  updateTag('public-matches');

  if (!updatedMatch) {
    return {
      ok: false,
      message: '¡ No se pudo finalizar el partido !',
    };
  }

  return {
    ok: true,
    message: `¡ El estado del partido finalizó correctamente ⚽️🎉 !`,
  };
};
