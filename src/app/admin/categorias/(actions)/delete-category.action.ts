'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteCategoryAction = async (categoryId: string): ResponseDeleteAction => {
  const category = await prisma.category.count({ where: { id: categoryId } });

  if (category === 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la categoría, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  // Update Cache
  updateTag('admin-categories');

  return {
    ok: true,
    message: '¡ La categoría ha sido eliminada correctamente 👍 !',
  };
};
