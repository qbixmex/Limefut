'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/get-session';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteFieldAction = async (fieldId: string): ResponseDeleteAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

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
