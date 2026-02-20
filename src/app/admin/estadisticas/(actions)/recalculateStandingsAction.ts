'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import { MATCH_STATUS } from "@/shared/enums";

export type ResponseRecalculateAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const recalculateStandingsAction = async (tournamentId: string): ResponseRecalculateAction => {
  try {
    await prisma.$transaction(async (tx) => {
      // Get all teams in the tournament
      const teams = await tx.team.findMany({
        where: {
          tournamentId,
          active: true,
        },
      });

      if (teams.length === 0) {
        throw new Error('No hay equipos en este torneo');
      }

      // Delete existing standings
      await tx.standings.deleteMany({
        where: { tournamentId },
      });

      // Create standings for all teams (with default values)
      await tx.standings.createMany({
        data: teams.map(team => ({
          teamId: team.id,
          tournamentId,
          matchesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalsDifference: 0,
          points: 0,
          additionalPoints: 0,
          totalPoints: 0,
        })),
      });

      // Get all completed matches
      const completedMatches = await tx.match.findMany({
        where: {
          tournamentId,
          status: MATCH_STATUS.COMPLETED,
        },
        select: {
          localId: true,
          visitorId: true,
          localScore: true,
          visitorScore: true,
          penaltyShootout: {
            where: { status: 'completed' },
            select: {
              winnerTeamId: true,
            },
          },
        },
      });

      // Recalculate standings for each completed match
      for (const match of completedMatches) {
        const localScore = match.localScore ?? 0;
        const visitorScore = match.visitorScore ?? 0;
        const shootout = match.penaltyShootout;

        let localPoints = 0;
        let visitorPoints = 0;
        let localAdditionalPoints = 0;
        let visitorAdditionalPoints = 0;

        // Determine points from regular match score
        if (localScore > visitorScore) {
          localPoints = 3;
        } else if (visitorScore > localScore) {
          visitorPoints = 3;
        } else {
          // Draw in regular time
          localPoints = 1;
          visitorPoints = 1;

          // Check penalty shootout winner
          if (shootout) {
            if (shootout.winnerTeamId === match.localId) {
              localAdditionalPoints = 1;
            }

            if (shootout.winnerTeamId === match.visitorId) {
              visitorAdditionalPoints = 1;
            }
          }
        }

        // Update local team
        await tx.standings.update({
          where: {
            teamId: match.localId,
            tournamentId,
          },
          data: {
            matchesPlayed: { increment: 1 },
            wins: { increment: localPoints === 3 ? 1 : 0 },
            draws: { increment: localPoints === 1 ? 1 : 0 },
            losses: { increment: localPoints === 0 ? 1 : 0 },
            goalsFor: { increment: localScore },
            goalsAgainst: { increment: visitorScore },
            goalsDifference: { increment: localScore - visitorScore },
            points: { increment: localPoints },
            additionalPoints: { increment: localAdditionalPoints },
            totalPoints: { increment: localPoints + localAdditionalPoints },
          },
        });

        // Update visitor team
        await tx.standings.update({
          where: {
            teamId: match.visitorId,
            tournamentId,
          },
          data: {
            matchesPlayed: { increment: 1 },
            wins: { increment: visitorPoints === 3 ? 1 : 0 },
            draws: { increment: visitorPoints === 1 ? 1 : 0 },
            losses: { increment: visitorPoints === 0 ? 1 : 0 },
            goalsFor: { increment: visitorScore },
            goalsAgainst: { increment: localScore },
            goalsDifference: { increment: visitorScore - localScore },
            points: { increment: visitorPoints },
            additionalPoints: { increment: visitorAdditionalPoints },
            totalPoints: { increment: visitorPoints + visitorAdditionalPoints },
          },
        });
      }
    });

    // Update cache
    updateTag('admin-standings');
    updateTag('admin-tournaments-for-standings');
    updateTag('public-standings');
    updateTag('dashboard-results');

    return {
      ok: true,
      message: '¡ Las estadísticas se recalcularon correctamente 👍 !',
    };
  } catch (error) {
    console.error(`Error recalculando estadísticas: ${(error as Error).message}`);
    return {
      ok: false,
      message: `¡ Error al recalcular las estadísticas: ${(error as Error).message} !`,
    };
  }
};