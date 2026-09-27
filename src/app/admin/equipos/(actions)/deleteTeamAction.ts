'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/get-session';
import deleteImage from '@/shared/actions/deleteImageAction';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTeamAction = async (teamId: string): ResponseDeleteAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { ok: false, message: guard.message };
  }

  const team = await prisma.team.findFirst({
    where: { id: teamId },
    select: {
      name: true,
      imagePublicID: true,
      _count: {
        select: {
          players: true,
        },
      },
    },
  });

  if (!team) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el equipo, quizás fue eliminado ó no existe !',
    };
  }

  // Verify if team contains associated players
  if (team._count.players > 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el equipo porque tiene jugadores registrados !',
    };
  }

  const matchesCount = await prisma.match.count({
    where: {
      OR: [
        { localId: teamId },
        { visitorId: teamId },
      ],
    },
  });

  if (matchesCount > 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el equipo' +
        ` porque aparece en ( ${matchesCount} )` +
        ` encuentro${matchesCount > 0 ? 's' : ''} !`,
    };
  }

  // Fetch the team's standings rows to distinguish real statistics from
  // enrollment placeholders (all-zero rows created when the team is registered
  // in a tournament, before it has played any match).
  const standingsRows = await prisma.standings.findMany({
    where: { teamId },
    select: {
      id: true,
      matchesPlayed: true,
      wins: true,
      draws: true,
      losses: true,
      goalsFor: true,
      goalsAgainst: true,
      goalsDifference: true,
      points: true,
      additionalPoints: true,
      totalPoints: true,
    },
  });

  const rowsWithStats = standingsRows.filter((standing) => (
    standing.matchesPlayed > 0 ||
    standing.wins > 0 ||
    standing.draws > 0 ||
    standing.losses > 0 ||
    standing.goalsFor > 0 ||
    standing.goalsAgainst > 0 ||
    standing.goalsDifference !== 0 ||
    standing.points > 0 ||
    standing.additionalPoints > 0 ||
    standing.totalPoints > 0
  ));

  if (rowsWithStats.length > 0) {
    const played = Math.max(...rowsWithStats.map((standing) => standing.matchesPlayed));

    return {
      ok: false,
      message: '¡ No se puede eliminar el equipo' +
        ' porque tiene estadísticas en la tabla de posiciones' +
        ` ( ${played} partido${played === 1 ? '' : 's'}` +
        ` jugado${played === 1 ? '' : 's'} ) !`,
    };
  }

  // Remove the team and its all-zero standings rows atomically. The standings
  // rows must be deleted first because of the ON DELETE RESTRICT foreign key.
  const removedFromStandings = standingsRows.length > 0;

  let teamDeleted: { imagePublicID: string | null } | null = null;

  try {
    teamDeleted = await prisma.$transaction(async (transaction) => {
      if (removedFromStandings) {
        await transaction.standings.deleteMany({ where: { teamId } });
      }

      return transaction.team.delete({ where: { id: teamId } });
    });
  } catch (error) {
    console.error(`Error eliminando el equipo: ${(error as Error).message}`);
    return {
      ok: false,
      message: '¡ No se pudo eliminar el equipo, revise los logs del servidor !',
    };
  }

  // Delete image from cloudinary.
  if (teamDeleted.imagePublicID) {
    const response = await deleteImage(teamDeleted.imagePublicID);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  // Update Cache
  updateTag('admin-teams');
  updateTag('admin-teams-for-coach');
  updateTag('admin-teams-for-player');
  updateTag('admin-teams-for-gallery');
  updateTag('admin-teams-for-match');
  updateTag('admin-team');
  updateTag('public-teams');
  updateTag('public-team');
  updateTag('standings');

  return {
    ok: true,
    message: removedFromStandings
      ? '¡ El equipo ha sido eliminado y fue retirado de la tabla de posiciones 👍 !'
      : '¡ El equipo ha sido eliminado correctamente 👍 !',
  };
};
