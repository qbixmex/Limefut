'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/get-session';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteMessageAction = async (id: string): ResponseDeleteAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { ok: false, message: guard.message };
  }

  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el mensaje, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.contactMessage.delete({
    where: { id },
  });

  // Update Cache
  updateTag('admin-messages');
  updateTag('admin-message');

  return {
    ok: true,
    message: '¡ El mensaje de ha sido eliminado correctamente 👍 !',
  };
};
