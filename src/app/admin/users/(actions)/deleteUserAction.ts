'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import deleteImage from "./deleteImageAction";

export type ResponseDeleteUser = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteUserAction = async (userId: string): ResponseDeleteUser => {
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

  revalidatePath('/admin/users');

  return {
    ok: true,
    message: `¡ El usuario "${userDeleted.name}" ha sido eliminado 👍 !`
  };
};
