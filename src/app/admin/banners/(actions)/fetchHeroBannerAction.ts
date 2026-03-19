'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { HeroBanner } from '@/shared/interfaces';

type FetchTournamentResponse = Promise<{
  ok: boolean;
  message: string;
  heroBanner: HeroBanner | null;
}>;

export const fetchHeroBannerAction = async (
  userRoles: string[] | null,
  heroBannerId: string,
): FetchTournamentResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-banner');

  if ((userRoles !== null) && (!userRoles.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      heroBanner: null,
    };
  }

  try {
    const heroBanner = await prisma.heroBanner.findFirst({
      where: { id: heroBannerId },
    });

    if (!heroBanner) {
      return {
        ok: false,
        message: '¡ Hero Banner no encontrado ❌ !',
        heroBanner: null,
      };
    }

    return {
      ok: true,
      message: '¡ Banner obtenido correctamente 👍 !',
      heroBanner,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el Banner,\n¡ Revise los logs del servidor !',
        heroBanner: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      heroBanner: null,
    };
  }
};
