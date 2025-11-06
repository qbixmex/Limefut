'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateTournamentStateAction = async (id: string, state: boolean): ResponseDeleteAction => {
  const tournamentExists = await prisma.tournament.count({
    where: { id },
  });

  if (tournamentExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el torneo, quizás fue eliminado ó no existe !',
    };
  }

  const updatedTournament = await prisma.tournament.update({
    where: { id },
    data: { active: state },
    select: {
      name: true,
      active: true,
    },
  });

  revalidatePath('/torneos');
  revalidatePath('/admin/torneos');

  return {
    ok: true,
    message: `¡ El torneo "${updatedTournament.name}" fue ${updatedTournament.active ? 'activado' : 'desactivado'} correctamente 👍 !`
  };
};
