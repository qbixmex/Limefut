'use server';

import prisma from "@/lib/prisma";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteStandingsAction = async (tournamentId: string): ResponseDeleteAction => {
  await prisma.standings.deleteMany({ where: { tournamentId } });

  return {
    ok: true,
    message: `¡ Las estadísticas han sido eliminadas correctamente 👍 !`
  };
};
