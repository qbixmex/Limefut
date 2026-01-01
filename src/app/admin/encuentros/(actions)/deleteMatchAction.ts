'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteMatchAction = async (id: string): ResponseDeleteAction => {
  const player = await prisma.match.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!player) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el jugador, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.match.delete({ where: { id: player.id } });

  updateTag('admin-matches');
  updateTag('matches');
  updateTag('dashboard-results');
  updateTag('public-results');

  return {
    ok: true,
    message: `¡ El encuentro ha sido eliminado correctamente 👍 !`,
  };
};
