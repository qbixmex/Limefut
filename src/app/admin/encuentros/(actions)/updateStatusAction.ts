'use server';

import prisma from "@/lib/prisma";
import type { MATCH_STATUS } from "@/shared/enums";
import { updateTag } from "next/cache";

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateStatusAction = async (matchId: string, status: MATCH_STATUS): ResponseAction => {
  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: { status },
  });

  if (!updatedMatch) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el estado del partido !',
    };
  }

  updateTag('matches');

  return {
    ok: true,
    message: `¡ El estado del partido fue actualizado correctamente 👍 !`,
  };
};
