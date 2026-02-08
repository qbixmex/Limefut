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

export const updateMatchScoreAction = async (props: Props): ResponseAction => {
  const { matchId, localScore, visitorScore, localId, visitorId } = props;

  try {
    // Fetch the current match to get old scores
    const currentMatch = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        localScore: true,
        visitorScore: true,
      },
    });

    if (!currentMatch) {
      return {
        ok: false,
        message: '¡ Partido no encontrado !',
      };
    }

    const oldLocalScore = currentMatch.localScore ?? 0;
    const oldVisitorScore = currentMatch.visitorScore ?? 0;

    // Calculate old points
    let oldLocalPoints = 0;
    let oldVisitorPoints = 0;

    if (oldLocalScore > oldVisitorScore) {
      oldLocalPoints = 3;
    } else if (oldLocalScore < oldVisitorScore) {
      oldVisitorPoints = 3;
    } else if (oldLocalScore === oldVisitorScore && oldLocalScore !== 0) {
      oldLocalPoints = 1;
      oldVisitorPoints = 1;
    }

    // Calculate new points
    let newLocalPoints = 0;
    let newVisitorPoints = 0;

    if (localScore > visitorScore) {
      newLocalPoints = 3;
    } else if (localScore < visitorScore) {
      newVisitorPoints = 3;
    } else {
      newLocalPoints = 1;
      newVisitorPoints = 1;
    }

    // Revert old standings for local team
    try {
      await prisma.standings.update({
        where: { teamId: localId },
        data: {
          matchesPlayed: { increment: -1 },
          wins: { increment: oldLocalPoints === 3 ? -1 : 0 },
          losses: { increment: oldLocalPoints === 0 ? -1 : 0 },
          draws: { increment: oldLocalPoints === 1 ? -1 : 0 },
          goalsFor: { increment: -oldLocalScore },
          goalsAgainst: { increment: -oldVisitorScore },
          goalsDifference: { increment: -(oldLocalScore - oldVisitorScore) },
          points: { increment: -oldLocalPoints },
          totalPoints: { increment: -oldLocalPoints },
        },
      });
    } catch (error) {
      console.error(`Error al revertir estadísticas del equipo local: ${(error as Error).message}`);
      return {
        ok: false,
        message: '¡ Error al revertir estadísticas del equipo local !',
      };
    }

    // Revert old standings for visitor team
    try {
      await prisma.standings.update({
        where: { teamId: visitorId },
        data: {
          matchesPlayed: { increment: -1 },
          wins: { increment: oldVisitorPoints === 3 ? -1 : 0 },
          losses: { increment: oldVisitorPoints === 0 ? -1 : 0 },
          draws: { increment: oldVisitorPoints === 1 ? -1 : 0 },
          goalsFor: { increment: -oldVisitorScore },
          goalsAgainst: { increment: -oldLocalScore },
          goalsDifference: { increment: -(oldVisitorScore - oldLocalScore) },
          points: { increment: -oldVisitorPoints },
          totalPoints: { increment: -oldVisitorPoints },
        },
      });
    } catch (error) {
      console.error(`Error al revertir estadísticas del equipo visitante: ${(error as Error).message}`);
      return {
        ok: false,
        message: '¡ Error al revertir estadísticas del equipo visitante !',
      };
    }

    // Apply new standings for local team
    try {
      await prisma.standings.update({
        where: { teamId: localId },
        data: {
          matchesPlayed: { increment: 1 },
          wins: { increment: newLocalPoints === 3 ? 1 : 0 },
          losses: { increment: newLocalPoints === 0 ? 1 : 0 },
          draws: { increment: newLocalPoints === 1 ? 1 : 0 },
          goalsFor: { increment: localScore },
          goalsAgainst: { increment: visitorScore },
          goalsDifference: { increment: localScore - visitorScore },
          points: { increment: newLocalPoints },
          totalPoints: { increment: newLocalPoints },
        },
      });
    } catch (error) {
      console.error(`Error updating local team stats: ${(error as Error).message}`);
      return {
        ok: false,
        message: '¡ Error al actualizar estadísticas del equipo local !',
      };
    }

    // Apply new standings for visitor team
    try {
      await prisma.standings.update({
        where: { teamId: visitorId },
        data: {
          matchesPlayed: { increment: 1 },
          wins: { increment: newVisitorPoints === 3 ? 1 : 0 },
          losses: { increment: newVisitorPoints === 0 ? 1 : 0 },
          draws: { increment: newVisitorPoints === 1 ? 1 : 0 },
          goalsFor: { increment: visitorScore },
          goalsAgainst: { increment: localScore },
          goalsDifference: { increment: visitorScore - localScore },
          points: { increment: newVisitorPoints },
          totalPoints: { increment: newVisitorPoints },
        },
      });
    } catch (error) {
      console.error(`Error updating visitor team stats: ${(error as Error).message}`);
      return {
        ok: false,
        message: '¡ Error al actualizar estadísticas del equipo visitante !',
      };
    }

    // Update match
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        localScore,
        visitorScore,
        status: MATCH_STATUS.COMPLETED,
      },
    });

    // Refresh caches
    updateTag('admin-matches');
    updateTag('admin-match');
    updateTag('matches');
    updateTag('public-standings');
    updateTag('dashboard-results');
    updateTag('public-results');

    if (!updatedMatch) {
      return {
        ok: false,
        message: '¡ No se pudo actualizar el partido !',
      };
    }

    return {
      ok: true,
      message: `¡ El marcador del partido se actualizó correctamente ⚽️🎉 !`,
    };
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    return {
      ok: false,
      message: '¡ Error inesperado al actualizar el partido !',
    };
  }
};
