'use server';

import prisma from '@/lib/prisma';
import deleteImage from '@/shared/actions/deleteImageAction';
import { updateTag } from 'next/cache';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePlayerAction = async ({
  playerId,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  playerId: string;
  authenticatedUserId: string | null | undefined;
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

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      imagePublicID: true,
      name: true,
      _count: {
        select: {
          penaltyKicks: true,
        },
      },
    },
  });

  if (!player) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el jugador, quizás fue eliminado ó no existe !',
    };
  }

  if (player._count.penaltyKicks > 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el jugador porque tiene penales registrados !',
    };
  }

  try {
    await prisma.player.delete({
      where: { id: playerId },
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
        message: 'No se pudo eliminar el jugador, revise los logs del servidor',
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error del servidor no esperado, revise los logs del servidor',
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
  updateTag('admin-playoff-match');

  return {
    ok: true,
    message: `¡ El jugador ["${player.name}"] ha sido eliminado correctamente 👍 !`,
  };
};
