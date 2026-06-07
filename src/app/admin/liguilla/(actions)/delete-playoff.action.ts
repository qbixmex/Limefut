'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePlayoffAction = async (id: string): ResponseDeleteAction => {
  try {
    const playoff = await prisma.playoff.findFirst({
      where: { id },
      select: {
        id: true,
        _count: {
          select: { matches: true },
        },
      },
    });

    if (!playoff) {
      return {
        ok: false,
        message: '¡ No se puede eliminar la liguilla, quizás fue eliminada ó no existe !',
      };
    }

    if (playoff._count.matches > 0) {
      return {
        ok: false,
        message: '¡ No se puede eliminar la liguilla por que contiene encuentros !',
      };
    }

    await prisma.playoff.delete({ where: { id: playoff.id } });

    updateTag('admin-playoffs');
    updateTag('admin-playoff');
    updateTag('public-playoffs');
    updateTag('public-playoff');

    return {
      ok: true,
      message: '¡ La liguilla ha sido eliminada correctamente 👍 !',
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error name:', error.name);
      console.log('Error cause:', error.cause);
      console.log('Error message:', error.message);

      return {
        ok: false,
        message: '¡ No se pudo eliminar la liguilla ❌ !',
      };
    }

    console.log('Error:', `${error}`);

    return {
      ok: false,
      message: '¡ Error inesperado del sistema, revise los logs ❌ !',
    };
  }
};
