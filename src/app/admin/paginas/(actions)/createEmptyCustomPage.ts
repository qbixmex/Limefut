'use server';

import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  pageId: string | null;
}>;

export const createEmptyCustomPage = async (): CreateResponseAction => {
  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      // Find the maximum position
      const maxPositionResult = await transaction.customPage.aggregate({
        _max: { position: true },
      });

      // Calculate the new position
      const newPosition = (maxPositionResult._max.position || 0) + 1;

      // Create the new empty page
      const newPage = await transaction.customPage.create({
        data: { position: newPosition },
        select: { id: true },
      });

      return {
        ok: true,
        message: '¡ Borrador creado correctamente 👍 !',
        pageId: newPage.id,
      };
    });

    revalidatePath('admin/paginas');
    updateTag('public-page-links');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          pageId: null,
        };
      }

      console.log("Name:", error.name);
      console.log("Cause:", error.cause);
      console.log("Message:", error.message);

      return {
        ok: false,
        message: '¡ Error al crear la página, revise los logs del servidor !',
        pageId: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      pageId: null,
    };
  }
};
