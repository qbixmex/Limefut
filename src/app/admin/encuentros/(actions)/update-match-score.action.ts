'use server';

import prisma from '@/lib/prisma';
import { MATCH_MODE, MATCH_STATUS } from '@/shared/enums';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

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

type Props = {
  matchId: string;
  localScore: number;
  visitorScore: number;
  localId: string;
  visitorId: string;
};

export const updateMatchScoreAction = async (props: Props): ResponseAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
      currentMatch: null,
    };
  }

  const { matchId, localScore, visitorScore, localId, visitorId } = props;

  try {
    // Fetch the current match to get old scores
    const currentMatch = await prisma.match.findFirst({
      where: { id: matchId },
      select: {
        localScore: true,
        visitorScore: true,
        tournamentId: true,
        categoryId: true,
        mode: true,
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
        message: 'Partido no encontrado',
        currentMatch: null,
      };
    }

    const { tournamentId, categoryId, mode } = currentMatch;
    // Friendly matches must never affect the standings table
    const isLeague = mode === MATCH_MODE.LEAGUE;
    const oldLocalScore = currentMatch.localScore ?? 0;
    const oldVisitorScore = currentMatch.visitorScore ?? 0;

    // Calculate old points
    let oldLocalPoints = 0;
    let oldVisitorPoints = 0;

    if (oldLocalScore > oldVisitorScore) {
      oldLocalPoints = 3;
    } else if (oldLocalScore < oldVisitorScore) {
      oldVisitorPoints = 3;
    } else {
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

    // Both standings rows are resolved before opening the transaction so it can
    // never commit a half applied update when one of them is missing.
    const standings = isLeague
      ? await prisma.standings.findMany({
          where: {
            tournamentId,
            categoryId,
            teamId: { in: [localId, visitorId] },
          },
          select: { id: true, teamId: true },
        })
      : [];

    const localStandingsId = standings.find((s) => s.teamId === localId)?.id ?? '';
    const visitorStandingsId = standings.find((s) => s.teamId === visitorId)?.id ?? '';

    // Empty ids only happen on friendly matches, which return early below.
    if (isLeague && (!localStandingsId || !visitorStandingsId)) {
      return {
        ok: false,
        message: `No se encontraron las estadísticas del equipo ${!localStandingsId ? 'local' : 'visitante'} en la tabla de posiciones`,
        currentMatch: null,
      };
    }

    const updatedMatch = await prisma.$transaction(async (transaction) => {
      if (isLeague) {
        // Revert old standings for local team
        await transaction.standings.update({
          where: { id: localStandingsId },
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

        // Revert old standings for visitor team
        await transaction.standings.update({
          where: { id: visitorStandingsId },
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

        // Apply new standings for local team
        await transaction.standings.update({
          where: { id: localStandingsId },
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

        // Apply new standings for visitor team
        await transaction.standings.update({
          where: { id: visitorStandingsId },
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
      }

      const updated = await transaction.match.update({
        where: { id: matchId },
        data: {
          localScore,
          visitorScore,
          status: MATCH_STATUS.COMPLETED,
        },
        select: {
          id: true,
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
          local: { select: { permalink: true } },
        },
      });

      if (!updated) {
        throw new Error(`No se pudo actualizar el partido ${matchId}`);
      }

      return updated;
    });

    // Refresh caches
    updateTag('admin-matches');
    updateTag(`admin-match-${updatedMatch.id}`);
    updateTag('matches');
    updateTag('public-standings');
    updateTag('dashboard-results');
    updateTag('public-matches');
    updateTag('public-results');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-standings');

    return {
      ok: true,
      message: 'El marcador del partido se actualizó correctamente',
      currentMatch: {
        tournament: updatedMatch.tournament,
        category: updatedMatch.category,
      },
    };
  } catch (error) {
    let errorMessage = 'Error inesperado';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The standings rows are validated before the transaction, so a P2001 here
      // means one of them was deleted in between.
      if (error.code === 'P2001') {
        errorMessage = 'El partido o las estadísticas de los equipos no existen';
      } else if (error.code === 'P2002') {
        errorMessage = 'Hay campos duplicados';
      } else {
        errorMessage = 'Error al actualizar el marcador del partido';
      }

      console.log('='.repeat(20) + ' PRISMA ERROR ' + '='.repeat(20));
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
      console.log('='.repeat(54));
    } else if (error instanceof Error) {
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('MESSAGE:', error.message);
    } else {
      console.log(error);
    }

    return {
      ok: false,
      message: `${errorMessage}, revise los logs del servidor`,
      currentMatch: null,
    };
  }
};
