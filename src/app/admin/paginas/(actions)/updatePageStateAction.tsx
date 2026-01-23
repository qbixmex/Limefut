'use server';

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updatePageStateAction = async (id: string, state: boolean): ResponseAction => {
  const pageExists = await prisma.customPage.count({
    where: { id },
  });

  if (pageExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar la página, quizás fue eliminada ó no existe !',
    };
  }

  const updatedTeam = await prisma.customPage.update({
    where: { id },
    data: { active: state },
    select: {
      title: true,
      active: true,
    },
  });

  revalidatePath('/admin/equipos');
  updateTag('admin-pages');
  updateTag('public-page-links');

  return {
    ok: true,
    message: `¡ La página "${updatedTeam.title}" fue ${updatedTeam.active ? 'activada' : 'desactivada'} correctamente 👍 !`,
  };
};
