'use server';

import prisma from "@/lib/prisma";
import deleteImage from "./deleteImageAction";
import type { CustomPageImage } from "@/shared/interfaces/Page";
import { updateTag } from "next/cache";

type DeleteContentImageResponse = {
  ok: boolean;
  message: string;
  customPageImages?: CustomPageImage[];
};

export const deleteContentImageAction = async (
  pageId: string,
  publicId: string,
): Promise<DeleteContentImageResponse> => {
  const page = await prisma.customPage.findUnique({
    where: { id: pageId },
    select: {
      id: true,
      images: {
        select: {
          publicId: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!page) {
    return {
      ok: false,
      message: '¡ La página no existe !',
    };
  }

  if (page.images.length === 0) {
    return {
      ok: false,
      message: '¡ No hay imágenes para eliminar !',
    };
  }

  // Get the image URL before deleting the record
  const imageToDelete = page.images.find((customPageImage) => {
    return customPageImage.publicId === publicId;
  });

  if (!imageToDelete) {
    return {
      ok: false,
      message: `¡ La imagen con el ID ${publicId} no existe !`,
    };
  }

  // Delete from database first
  await prisma.$transaction(async (transaction) => {
    // Remove from ArticleImage table
    await transaction.customPageImage.deleteMany({
      where: { publicId },
    });
  });

  await deleteImage(publicId);

  const updatedPage = await prisma.customPage.findUnique({
    where: { id: pageId },
    select: {
      images: {
        select: {
          publicId: true,
          imageUrl: true,
        },
      },
    },
  });

  // Update Cache
  updateTag('admin-page');

  return {
    ok: true,
    message: 'La imagen del contenido ha sido eliminada 👍',
    customPageImages: updatedPage?.images ?? [],
  };
};

export default deleteContentImageAction;
