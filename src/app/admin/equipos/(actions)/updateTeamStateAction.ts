'use server';

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateTeamStateAction = async (id: string, state: boolean): ResponseDeleteAction => {
  const teamExists = await prisma.team.count({
    where: { id },
  });

  if (teamExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el equipo, quizás fue eliminado ó no existe !',
    };
  }

  const updatedTeam = await prisma.team.update({
    where: { id },
    data: { active: state },
    select: {
      name: true,
      active: true,
    },
  });

  revalidatePath('/equipo');
  revalidatePath('/admin/equipo');
  updateTag('public-team');

  return {
    ok: true,
    message: `¡ El equipo "${updatedTeam.name}" fue ${updatedTeam.active ? 'activado' : 'desactivado'} correctamente 👍 !`
  };
};
