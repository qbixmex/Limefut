'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteStandingsAction = async (tournamentId: string): ResponseDeleteAction => {
  await prisma.standings.deleteMany({ where: { tournamentId } });

  updateTag('standings');

  return {
    ok: true,
    message: `¡ Las estadísticas han sido eliminadas correctamente 👍 !`,
  };
};
