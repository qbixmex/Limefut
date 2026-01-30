'use server';

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { deleteImage } from "@/shared/actions";

type DeleteContentImageResponse = {
  ok: boolean;
  message: string;
  customPageImages: {
    imageUrl: string;
    publicId: string;
  }[] | null;
};

export const deleteContentImageAction = async (
  pageId: string,
  publicId: string,
): Promise<DeleteContentImageResponse> => {
  const customPageImage = await prisma.customPage.findFirst({
    where: { id: pageId },
    select: {
      id: true,
      permalink: true,
      images: {
        select: {
          publicId: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!customPageImage) {
    return {
      ok: false,
      message: '¡ La página no existe ❌ !',
      customPageImages: null,
    };
  }

  if (customPageImage.images.length === 0) {
    return {
      ok: false,
      message: '¡ No hay imágenes para eliminar !',
      customPageImages: null,
    };
  }

  // Get the image URL before deleting the record
  const imageToDelete = customPageImage.images.find((customPageImage) => {
    return customPageImage.publicId === publicId;
  });

  if (!imageToDelete) {
    return {
      ok: false,
      message: `¡ La imagen con el ID ${publicId} no existe ❌ !`,
      customPageImages: null,
    };
  }

  // Delete from database first
  await prisma.$transaction(async (transaction) => {
    // Remove from CustomPageImage table
    await transaction.customPageImage.deleteMany({
      where: { publicId },
    });
  });

  // Delete Image from Cloudinary.
  await deleteImage(publicId);

  const updatedCustomPage = await prisma.customPage.findUnique({
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

  revalidatePath(`/${customPageImage.permalink}`);
  revalidatePath(`/admin/paginas/${customPageImage.id}`);
  revalidatePath(`/admin/paginas/${customPageImage.id}/edit`);

  return {
    ok: true,
    message: 'La imagen del contenido ha sido eliminada 👍',
    customPageImages: updatedCustomPage?.images ?? null,
  };
};
