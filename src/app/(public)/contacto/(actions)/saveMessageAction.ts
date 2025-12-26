'use server';

import prisma from "@/lib/prisma";
import type { ContactMessage } from "@/shared/interfaces";
import { sendMessageSchema } from "@/shared/schemas";
import { updateTag } from "next/cache";

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  contactMessage: ContactMessage | null;
}>;

export const saveMessageAction = async (
  formData: FormData,
): ResponseCreateAction => {

  const rawData = Object.fromEntries(formData.entries());

  const messageVerified = sendMessageSchema.safeParse(rawData);

  if (!messageVerified.success) {
    return {
      ok: false,
      message: messageVerified.error.message,
      contactMessage: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const savedMessage = await transaction.contactMessage.create({
        data: messageVerified.data,
      });

      return {
        ok: true,
        message: '¡ El mensaje ha sido guardado correctamente 👍 !',
        contactMessage: savedMessage,
      };
    });

    // Refresh Cache
    updateTag('dashboard-messages');
    updateTag('contact-messages');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      return {
        ok: false,
        message: '¡ Error al guardar el mensaje, revise los logs del servidor !',
        contactMessage: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      contactMessage: null,
    };
  }
};
