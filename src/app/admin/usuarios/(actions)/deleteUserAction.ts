'use server';

import prisma from "@/lib/prisma";
import deleteImage from "@/shared/actions/deleteImageAction";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteUserAction = async (userId: string): ResponseDeleteAction => {
  const userDeleted = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      imagePublicID: true,
      name: true,
    },
  });

  if (!userDeleted) {
    return {
      ok: false,
      message: '¡ No se puede eliminar por que el usuario no existe !',
    };
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  // Delete image from cloudinary.
  if (userDeleted.imagePublicID) {
    const response = await deleteImage(userDeleted.imagePublicID);
    if (!response.ok) {
      throw 'Error deleting image from cloudinary';
    }
  }

  // Update Cache
  updateTag('admin-users');
  updateTag('admin-user');

  return {
    ok: true,
    message: `¡ Usuario "${userDeleted.name}" eliminado correctamente 👍 !`,
  };
};
