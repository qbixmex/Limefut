'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import deleteImage from "./deleteImageAction";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePageAction = async (pageId: string): ResponseDeleteAction => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const page = await tx.customPage.findUnique({
        where: { id: pageId },
        select: {
          title: true,
          position: true,
          images: {
            select: {
              id: true,
              publicId: true,
            },
          },
        },
      });

      if (!page) {
        return {
          ok: false,
          message: '¡ No se puede eliminar la página, quizás fue eliminada ó no existe !',
        };
      }

      // Delete Content Images from Cloudinary
      if (page.images.length > 0) {
        await Promise.all(page.images.map(async (image) => {
          await deleteImage(image.publicId);
        }));
      }

      // Delete the page
      await tx.customPage.delete({
        where: { id: pageId },
      });

      // Shift up positions for pages that were after the deleted one
      // Use updateMany with decrement to avoid unique conflicts and for performance
      await tx.customPage.updateMany({
        where: { position: { gt: page.position as number } },
        data: { position: { decrement: 1 } },
      });

      // Update Cache
      updateTag('admin-pages');
      updateTag('admin-page');
      updateTag('public-page-links');
      updateTag('public-page-metadata');
      updateTag('public-custom-page');

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
