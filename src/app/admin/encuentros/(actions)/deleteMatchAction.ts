'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteMatchAction = async (id: string): ResponseDeleteAction => {
  const player = await prisma.match.findUnique({
    where: { id },
    select: { id: true }
  });

  if (!player) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el jugador, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.match.delete({ where: { id: player.id } });

  revalidatePath('/encuentros');
  revalidatePath('/admin/encuentros');

  return {
    ok: true,
    message: `¡ El encuentro ha sido eliminado correctamente 👍 !`
  };
};
