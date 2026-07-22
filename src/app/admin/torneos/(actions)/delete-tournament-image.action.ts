'use server';

import prisma from '@/lib/prisma';
import deleteImage from '@/shared/actions/deleteImageAction';
import { updateTag } from 'next/cache';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTournamentImageAction = async ({
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
      message: '¡ No se puede eliminar la imagen del torneo, quizás el torneo fue eliminado ó no existe !',
    };
  }

  // Delete image from cloudinary first (before DB update).
  if (tournament.imagePublicID) {
    const response = await deleteImage(tournament.imagePublicID);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  try {
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        imageUrl: null,
        imagePublicID: null,
      },
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
        message: 'No se pudo eliminar la imagen del torneo, revise los logs del servidor',
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
  updateTag('admin-tournament');
  updateTag('admin-standings');
  updateTag('public-tournaments');
  updateTag('public-tournament');

  return {
    ok: true,
    message: '¡ La imagen ha sido eliminada correctamente 👍 !',
  };
};
