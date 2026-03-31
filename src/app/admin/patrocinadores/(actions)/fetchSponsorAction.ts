'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Sponsor } from '@/shared/interfaces';

type FetchSponsorResponse = Promise<{
  ok: boolean;
  message: string;
  sponsor: Sponsor | null;
}>;

export const fetchSponsorAction = async (
  userRoles: string[] | null,
  sponsorId: string,
): FetchSponsorResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-sponsor');

  if ((userRoles !== null) && (!userRoles.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      sponsor: null,
    };
  }

  try {
    const sponsor = await prisma.sponsor.findFirst({
      where: { id: sponsorId },
    });

    if (!sponsor) {
      return {
        ok: false,
        message: '¡ Patrocinador no encontrado ❌ !',
        sponsor: null,
      };
    }

    console.log(sponsor);

    return {
      ok: true,
      message: '¡ Patrocinador obtenido correctamente 👍 !',
      sponsor,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el Patrocinador,\n¡ Revise los logs del servidor !',
        sponsor: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      sponsor: null,
    };
  }
};
