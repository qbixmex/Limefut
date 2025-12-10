'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateCoachStateAction = async (id: string, state: boolean): ResponseDeleteAction => {
  const coachExists = await prisma.coach.count({
    where: { id },
  });

  if (coachExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el entrenador, quizás fue eliminado ó no existe !',
    };
  }

  const updatedTeam = await prisma.coach.update({
    where: { id },
    data: { active: state },
    select: {
      name: true,
      active: true,
    },
  });

  revalidatePath('/entrenadores');
  revalidatePath('/admin/entrenadores');

  return {
    ok: true,
    message: `¡ El entrenador "${updatedTeam.name}" fue ${updatedTeam.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
