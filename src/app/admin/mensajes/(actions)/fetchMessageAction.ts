'use server';

import prisma from '@/lib/prisma';
import type { ContactMessage } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  contactMessage: ContactMessage | null;
}>;

export const fetchMessageAction = async (
  id: string,
): FetchResponse => {
  'use cache';

  cacheLife('weeks');
  cacheTag('admin-message');

  try {
    const contactMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!contactMessage) {
      return {
        ok: false,
        message: '¡ Mensaje no encontrado ❌ !',
        contactMessage: null,
      };
    }

    return {
      ok: true,
      message: '¡ Mensaje obtenido correctamente 👍 !',
      contactMessage,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el mensaje,\n¡ Revise los logs del servidor !',
        contactMessage: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      contactMessage: null,
    };
  }
};
