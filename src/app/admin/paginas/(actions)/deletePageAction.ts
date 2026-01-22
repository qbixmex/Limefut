'use server';

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePageAction = async (pageId: string): ResponseDeleteAction => {
  const pageDeleted = await prisma.customPage.findUnique({
    where: { id: pageId },
    select: { title: true },
  });

  if (!pageDeleted) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la página, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.customPage.delete({
    where: { id: pageId },
  });

  revalidatePath('/admin/paginas');
  updateTag('admin-pages');
  updateTag('public-pages');
  updateTag('public-page');

  return {
    ok: true,
    message: `¡ La página "${pageDeleted.title}" ha sido eliminada correctamente 👍 !`,
  };
};
