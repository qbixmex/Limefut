'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { deleteImage } from '@/shared/actions';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTournamentAction = async (tournamentId: string): ResponseDeleteAction => {
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

  try {
    await prisma.tournament.delete({
      where: { id: tournamentId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        message: error.message,
      };
    }
    if (error instanceof Error) {
      console.log('Error name:', error.name);
      console.log('Error cause:', error.cause);
      console.log('Error message:', error.message);

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

  // Delete image from cloudinary.
  if (tournament.imagePublicID) {
    const response = await deleteImage(tournament.imagePublicID);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  // Update Cache
  updateTag('admin-tournaments');
  updateTag('admin-tournaments-selector');
  updateTag('admin-tournaments-for-coach');
  updateTag('admin-tournaments-for-match');
  updateTag('admin-tournament-for-match');
  updateTag('admin-tournaments-for-gallery');
  updateTag('admin-tournament');
  updateTag('public-tournaments-list');
  updateTag('tournaments-list');
  updateTag('public-tournaments');
  updateTag('public-tournament');
  updateTag('dashboard-tournaments');

  return {
    ok: true,
    message: `¡ El torneo "${tournament.name}" ha sido eliminado correctamente 👍 !`,
  };
};
