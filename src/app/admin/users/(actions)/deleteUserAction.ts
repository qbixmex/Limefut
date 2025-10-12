'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ResponseDeleteUser = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteUserAction = async (userId: string): ResponseDeleteUser => {
  const userDeleted = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
    },
  });

  if (!userDeleted) {
    return {
      ok: false,
      message: '¡ No se puede eliminar por que el usuario no existe !',
    };
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  // TODO Delete previous image from third-party storage.

  revalidatePath('/admin/users');

  return {
    ok: true,
    message: `¡ El usuario "${userDeleted.name}" ha sido eliminado 👍 !`
  };
};
