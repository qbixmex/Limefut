'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateUserStateAction = async (id: string, state: boolean): ResponseDeleteAction => {
  const userExists = await prisma.user.count({
    where: { id },
  });

  if (userExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el usuario, quizás fue eliminado ó no existe !',
    };
  }

  const updatedTeam = await prisma.user.update({
    where: { id },
    data: { isActive: state },
    select: {
      name: true,
      isActive: true,
    },
  });

  // Update Cache
  updateTag('admin-users');
  updateTag('admin-user');

  return {
    ok: true,
    message: `¡ El usuario "${updatedTeam.name}" fue ${updatedTeam.isActive ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
