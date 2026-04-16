'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteFieldAction = async (fieldId: string): ResponseDeleteAction => {
  const fieldCount = await prisma.field.count({
    where: { id: fieldId },
  });

  if (fieldCount === 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la cancha, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.field.delete({
    where: { id: fieldId },
  });

  // Update Cache
  updateTag('admin-fields');
  updateTag('admin-fields-for-team');
  updateTag('admin-field');
  updateTag('public-fields');
  updateTag('public-field');

  return {
    ok: true,
    message: '¡ La cancha ha sido eliminada correctamente 👍 !',
  };
};
