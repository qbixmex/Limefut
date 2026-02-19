'use server';

import prisma from "@/lib/prisma";
import deleteImage from "@/shared/actions/deleteImageAction";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTeamAction = async (teamId: string): ResponseDeleteAction => {
  const team = await prisma.team.findFirst({
    where: { id: teamId },
    select: {
      name: true,
      imagePublicID: true,
      _count: {
        select: {
          players: true,
        },
      },
    },
  });

  if (!team) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el equipo, quizás fue eliminado ó no existe !',
    };
  }

  // Verify if team contains associated players
  if (team._count.players > 0) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el equipo porque tiene jugadores asociados !',
    };
  }

  const teamDeleted = await prisma.team.delete({
    where: { id: teamId },
  });

  // Delete image from cloudinary.
  if (teamDeleted.imagePublicID) {
    const response = await deleteImage(teamDeleted.imagePublicID);
    if (!response.ok) {
      throw 'Error al eliminar la imagen de cloudinary';
    }
  }

  // Update Cache
  updateTag('admin-teams');
  updateTag('admin-teams-for-coach');
  updateTag('admin-teams-for-player');
  updateTag("admin-teams-for-gallery");
  updateTag('admin-teams-for-match');
  updateTag('admin-team');
  updateTag('public-teams');
  updateTag('public-team');
  updateTag('standings');

  return {
    ok: true,
    message: `¡ El equipo "${teamDeleted.name}" ha sido eliminado correctamente 👍 !`,
  };
};
