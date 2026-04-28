'use server';

import prisma from '@/lib/prisma';
import type { Coach } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type FetchCoachResponse = Promise<{
  ok: boolean;
  message: string;
  coach: Coach & {
    teams: Team[];
  } | null;
}>;

export type Team = {
  id: string;
  name: string;
  permalink: string;
  category: string;
};

export const fetchCoachDetailsAction = async (
  coachId: string,
  userRole: string[] | null,
): FetchCoachResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-coach');

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      coach: null,
    };
  }

  try {
    const coach = await prisma.coach.findUnique({
      where: { id: coachId },
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            permalink: true,
            category: true,
          },
        },
      },
    });

    if (!coach) {
      return {
        ok: false,
        message: '¡ Entrenador no encontrado ❌ !',
        coach: null,
      };
    }

    return {
      ok: true,
      message: '¡ Entrenador obtenido correctamente 👍 !',
      coach,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el entrenador,\n¡ Revise los logs del servidor !',
        coach: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      coach: null,
    };
  }
};
