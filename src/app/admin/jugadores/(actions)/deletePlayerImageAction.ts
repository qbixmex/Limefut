'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/get-session';
import { updateTag } from 'next/cache';
import deleteImage from '@/shared/actions/deleteImageAction';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePlayerImageAction = async ({
  playerId,
}: {
  playerId: string;
}): ResponseDeleteAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      name: true,
      imagePublicID: true,
    },
  });

  if (!player) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la imagen del jugador, quizás fue eliminada ó no existe !',
    };
  }

  try {
    await prisma.player.update({
      where: { id: playerId },
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
        message: 'No se pudo eliminar la imagen del jugador, revise los logs del servidor',
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado del servidor,\nrevise los logs del servidor !',
    };
  }

  if (player.imagePublicID) {
    const response = await deleteImage(player.imagePublicID);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  updateTag('admin-players');
  updateTag('admin-player');
  updateTag('public-players');
  updateTag('public-player');

  return {
    ok: true,
    message: `¡ La imagen del jugador ["${player.name}"] ha sido eliminada correctamente 👍 !`,
  };
};
