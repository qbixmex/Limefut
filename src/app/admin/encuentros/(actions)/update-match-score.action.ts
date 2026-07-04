'use server';

import prisma from '@/lib/prisma';
import { MATCH_STATUS } from '@/shared/enums';
import { updateTag } from 'next/cache';

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
        tournamentId: true,
        categoryId: true,
        tournament: {
          select: {
            permalink: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      },
    });

    if (!currentMatch) {
      return {
        ok: false,
        message: '¡ Partido no encontrado !',
        currentMatch: null,
      };
    }

    const { tournamentId, categoryId } = currentMatch;
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
      await updateTeamStandings({
        teamId: localId,
        tournamentId,
        categoryId,
        data: {
          matchesPlayed: { decrement: 1 },
          wins: { decrement: oldLocalPoints === 3 ? 1 : 0 },
          losses: { decrement: oldLocalPoints === 0 ? 1 : 0 },
          draws: { decrement: oldLocalPoints === 1 ? 1 : 0 },
          goalsFor: { decrement: oldLocalScore },
          goalsAgainst: { decrement: oldVisitorScore },
          goalsDifference: { decrement: oldLocalScore - oldVisitorScore },
          points: { decrement: oldLocalPoints },
          totalPoints: { decrement: oldLocalPoints },
        },
      });
    } catch (error) {
      console.error(`Error al revertir estadísticas del equipo local: ${(error as Error).message}`);
      return {
        ok: false,
        message: '¡ Error al revertir estadísticas del equipo local !',
        currentMatch: null,
      };
    }

    // Revert old standings for visitor team
    try {
      await updateTeamStandings({
        teamId: visitorId,
        tournamentId,
        categoryId,
        data: {
          matchesPlayed: { decrement: 1 },
          wins: { decrement: oldVisitorPoints === 3 ? 1 : 0 },
          losses: { decrement: oldVisitorPoints === 0 ? 1 : 0 },
          draws: { decrement: oldVisitorPoints === 1 ? 1 : 0 },
          goalsFor: { decrement: oldVisitorScore },
          goalsAgainst: { decrement: oldLocalScore },
          goalsDifference: { decrement: oldVisitorScore - oldLocalScore },
          points: { decrement: oldVisitorPoints },
          totalPoints: { decrement: oldVisitorPoints },
        },
      });
    } catch (error) {
      console.error(`Error al revertir estadísticas del equipo visitante: ${(error as Error).message}`);
      return {
        ok: false,
        message: '¡ Error al revertir estadísticas del equipo visitante !',
        currentMatch: null,
      };
    }

    // Apply new standings for local team
    try {
      await updateTeamStandings({
        teamId: localId,
        tournamentId,
        categoryId,
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
        currentMatch: null,
      };
    }

    // Apply new standings for visitor team
    try {
      await updateTeamStandings({
        teamId: visitorId,
        tournamentId,
        categoryId,
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
        currentMatch: null,
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
      select: {
        tournament: {
          select: {
            id: true,
            permalink: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      },
    });

    // Refresh caches
    updateTag('admin-matches');
    updateTag('admin-match');
    updateTag('matches');
    updateTag('public-standings');
    updateTag('dashboard-results');
    updateTag('public-matches');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-standings');

    if (!updatedMatch) {
      return {
        ok: false,
        message: '¡ No se pudo actualizar el partido !',
        currentMatch: null,
      };
    }

    return {
      ok: true,
      message: '¡ El marcador del partido se actualizó correctamente ⚽️🎉 !',
      currentMatch: {
        tournament: updatedMatch.tournament,
        category: updatedMatch.category,
      },
    };
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    return {
      ok: false,
      message: '¡ Error inesperado al actualizar el partido !',
      currentMatch: null,
    };
  }
};

type StandingsFieldMutation = { increment: number } | { decrement: number };

const updateTeamStandings = async ({
  teamId,
  tournamentId,
  categoryId,
  data,
}: {
  teamId: string,
  tournamentId: string,
  categoryId: string | null,
  data: {
    matchesPlayed: StandingsFieldMutation;
    wins: StandingsFieldMutation;
    losses: StandingsFieldMutation;
    draws: StandingsFieldMutation;
    goalsFor: StandingsFieldMutation;
    goalsAgainst: StandingsFieldMutation;
    goalsDifference: StandingsFieldMutation;
    points: StandingsFieldMutation;
    totalPoints: StandingsFieldMutation;
  },
}): Promise<void> => {
  const standings = await prisma.standings.findFirst({
    where: { teamId, tournamentId, categoryId },
    select: { id: true },
  });

  if (!standings) {
    throw new Error(`Standings record not found for team ${teamId} in tournament ${tournamentId}`);
  }

  await prisma.standings.update({
    where: { id: standings.id },
    data,
  });
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  currentMatch: MATCH_TYPE | null;
}>;

type MATCH_TYPE = {
  tournament: {
    permalink: string;
  };
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null;
};
