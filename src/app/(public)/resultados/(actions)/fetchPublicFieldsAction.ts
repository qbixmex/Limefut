'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type FIELD_TYPE = {
  id: string;
  name: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  fields: FIELD_TYPE[];
}>;

export const fetchPublicFieldsAction = async (): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('public-fields');

  try {
    const fields = await prisma.field.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      ok: true,
      message: '! Las canchas fueron obtenidas correctamente 👍 !',
      fields,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('¡ Error al intentar obtener las canchas !');
      return {
        ok: false,
        message: error.message,
        fields: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado al obtener las canchas, revise los logs del servidor !',
      fields: [],
    };
  }
};
