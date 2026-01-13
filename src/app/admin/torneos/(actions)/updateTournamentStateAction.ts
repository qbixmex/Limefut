'use server';

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

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

  revalidatePath('/admin/torneos');

  // Update Cache
  updateTag("admin-tournaments-list");
  updateTag("public-tournaments-list");
  updateTag("tournaments-list");
  updateTag("public-tournaments");
  updateTag("public-tournament");
  updateTag("dashboard-tournaments");

  return {
    ok: true,
    message: `¡ El torneo "${updatedTournament.name}" fue ${updatedTournament.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
