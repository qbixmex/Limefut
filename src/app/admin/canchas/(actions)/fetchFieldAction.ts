'use server';

import prisma from '@/lib/prisma';
import type { Field } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type FetchFieldResponse = Promise<{
  ok: boolean;
  message: string;
  field: Field | null;
}>;

export const fetchFieldAction = async (
  fieldId: string,
  userRole: string[] | null,
): FetchFieldResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-field');

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      field: null,
    };
  }

  try {
    const field = await prisma.field.findFirst({
      where: { id: fieldId },
    });

    if (!field) {
      return {
        ok: false,
        message: `¡ La cancha con el ID: "${fieldId}" no existe ❌ !`,
        field: null,
      };
    }

    return {
      ok: true,
      message: '¡ Cancha obtenida correctamente 👍 !',
      field,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener la cancha,\n¡ Revise los logs del servidor !',
        field: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      field: null,
    };
  }
};
