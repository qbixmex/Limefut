'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTournamentAction = async (teamId: string): ResponseDeleteAction => {
  const teamDeleted = await prisma.tournament.findUnique({
    where: { id: teamId },
    select: { name: true },
  });

  if (!teamDeleted) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el torneo, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.tournament.delete({
    where: { id: teamId },
  });

  revalidatePath('/torneos');
  revalidatePath('/admin/torneos');

  return {
    ok: true,
    message: `¡ El torneo "${teamDeleted.name}" ha sido eliminado correctamente 👍 !`
  };
};
