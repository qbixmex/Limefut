'use server';

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePageAction = async (pageId: string): ResponseDeleteAction => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const page = await tx.customPage.findUnique({
        where: { id: pageId },
        select: { title: true, position: true },
      });

      if (!page) {
        return {
          ok: false,
          message: '¡ No se puede eliminar la página, quizás fue eliminada ó no existe !',
        };
      }

      // Delete the page
      await tx.customPage.delete({ where: { id: pageId } });

      // Shift up positions for pages that were after the deleted one
      // Use updateMany with decrement to avoid unique conflicts and for performance
      await tx.customPage.updateMany({
        where: { position: { gt: page.position } },
        data: { position: { decrement: 1 } },
      });

      // Update Cache
      revalidatePath('/admin/paginas');
      updateTag('admin-pages');
      updateTag('public-page-links');

      return {
        ok: true,
        message: `¡ La página "${page.title}" ha sido eliminada correctamente 👍 !`,
      };
    });

    return result;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
    };
  }
};
