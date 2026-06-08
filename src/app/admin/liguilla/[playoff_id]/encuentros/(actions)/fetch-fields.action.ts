'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  fields: FIELD_TYPE[];
}>;

export type FIELD_TYPE = {
  id: string;
  name: string;
};

export const fetchFieldsAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}): ResponseFetchAction => {
  'use cache';

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción  ❌ !',
      fields: [],
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción  ❌ !',
      fields: [],
    };
  }

  cacheLife('days');
  cacheTag('admin-fields');

  try {
    const fields = await prisma.field.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });

    return {
      ok: true,
      message: '! Las canchas fueron obtenidas correctamente 👍',
      fields,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros');
      return {
        ok: false,
        message: error.message,
        fields: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener las canchas, revise los logs del servidor',
      fields: [],
    };
  }
};
