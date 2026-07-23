'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteCategoryAction = async ({
  categoryId,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  categoryId: string;
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

  const categoryExists = await prisma.category.count({ where: { id: categoryId } });

  if (categoryExists === 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la categoría, quizás fue eliminada ó no existe !',
    };
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    // Update Cache
    updateTag('admin-categories');
    updateTag('admin-categories-for-match');
    updateTag('categories-selector-list');

    return {
      ok: true,
      message: '¡ La categoría ha sido eliminada correctamente 👍 !',
    };
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
        message: 'No se pudo eliminar la categoría, revise los logs del servidor',
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error del servidor no esperado, revise los logs del servidor',
    };
  }
};
