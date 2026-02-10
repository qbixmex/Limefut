'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

type Params = Readonly<{
  matchId: string;
  score: number;
  local: boolean;
  visitor: boolean;
}>;

export const updateStatusAction = async (params: Params): ResponseAction => {
  const { matchId, score, local, visitor } = params;

  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: {
      localScore: local ? score : undefined,
      visitorScore: visitor ? score : undefined,
    },
  });

  updateTag('admin-matches');
  updateTag('admin-match');
  updateTag('matches');
  updateTag('dashboard-results');
  updateTag('public-matches');
  updateTag("public-results-roles");
  updateTag("public-result-details");
  updateTag("public-matches-count");

  if (!updatedMatch) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el marcador del partido !',
    };
  }

  return {
    ok: true,
    message: `¡ El marcador del partido fue actualizado correctamente 👍 !`,
  };
};
