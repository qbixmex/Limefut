'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteCredentialAction = async (id: string): ResponseDeleteAction => {
  const credencial = await prisma.credential.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!credencial) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la credencial, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.credential.delete({ where: { id: credencial.id } });

  revalidatePath('/credenciales');
  revalidatePath('/admin/credenciales');

  return {
    ok: true,
    message: `¡ La credencial ha sido eliminada correctamente 👍 !`,
  };
};
