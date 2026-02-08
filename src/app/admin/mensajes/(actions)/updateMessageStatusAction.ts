'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateMessageStatusAction = async (id: string, state: boolean): ResponseDeleteAction => {
  const messageExists = await prisma.contactMessage.count({ where: { id } });

  if (messageExists === 0) {
    return {
      ok: false,
      message: '¡ Mensaje no encontrado ❌ !',
    };
  }

  await prisma.contactMessage.update({
    where: { id },
    data: { read: state },
  });

  // Update Cache
  updateTag('admin-messages');
  updateTag('admin-message');

  return {
    ok: true,
    message: `¡ El mensaje fue actualizado correctamente 👍 !`,
  };
};
