'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { deleteImage } from '@/shared/actions';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTournamentAction = async ({
  tournamentId,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  tournamentId: string;
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}): ResponseDeleteAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
    };
  }

  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId },
    select: {
      name: true,
      imagePublicID: true,
    },
  });

  if (!tournament) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el torneo, quizás fue eliminado ó no existe !',
    };
  }

  const teamsExists = await prisma.team.count({
    where: { tournamentId },
  });

  if (teamsExists) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el torneo, por que contiene equipos !',
    };
  }

  const playoffsExists = await prisma.playoff.count({
    where: { tournamentId },
  });

  if (playoffsExists) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el torneo, por que contiene partidos de liguilla !',
    };
  }

  const standingsExists = await prisma.standings.count({
    where: { tournamentId },
  });

  if (standingsExists) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el torneo, por que contiene estadísticas !',
    };
  }

  // Delete image from cloudinary first (before DB delete).
  if (tournament.imagePublicID) {
    const response = await deleteImage(tournament.imagePublicID);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  try {
    await prisma.tournament.delete({
      where: { id: tournamentId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('='.repeat(20) + ' PRISMA ERROR ' + '='.repeat(20));
      console.log('META:', error.meta);
      console.log('CODE:', error.code);
      console.log('MESSAGE:', error.message);
      console.log('='.repeat(54));
      return {
        ok: false,
        message: error.message,
      };
    }
    if (error instanceof Error) {
      console.log('='.repeat(20) + ' ERROR ' + '='.repeat(20));
      console.log('Error name:', error.name);
      console.log('Error cause:', error.cause);
      console.log('Error message:', error.message);
      console.log('='.repeat(47));

      return {
        ok: false,
        message: 'No se pudo eliminar el torneo, revise los logs del servidor',
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error del servidor no esperado, revise los logs del servidor',
    };
  }

  // Update Cache
  updateTag('admin-tournaments');
  updateTag('admin-tournaments-selector');
  updateTag('admin-tournaments-for-coach');
  updateTag('admin-tournaments-for-match');
  updateTag('admin-tournament-for-match');
  updateTag('admin-tournaments-for-gallery');
  updateTag('admin-tournament');
  updateTag('admin-tournament-id');
  updateTag('public-tournaments-list');
  updateTag('tournaments-list');
  updateTag('tournaments-selector-list');
  updateTag('public-tournaments');
  updateTag('public-tournament');
  updateTag('dashboard-tournaments');
  updateTag('categories-selector-list');

  return {
    ok: true,
    message: `¡ El torneo "${tournament.name}" ha sido eliminado correctamente 👍 !`,
  };
};
