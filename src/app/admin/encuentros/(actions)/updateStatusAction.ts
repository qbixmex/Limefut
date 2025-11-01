'use server';

import prisma from "@/lib/prisma";
import { MATCH_STATUS } from "@/shared/enums";

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

  return {
    ok: true,
    message: `¡ El estado del partido fue actualizado correctamente 👍 !`
  };
};
