'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';
import { headers } from 'next/headers';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateTournamentStateAction = async (id: string, state: boolean): ResponseAction => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
    };
  }

  if (!session?.user.roles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
    };
  }

  const tournamentExists = await prisma.tournament.count({
    where: { id },
  });

  if (tournamentExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el torneo, quizás fue eliminado ó no existe !',
    };
  }

  const updatedTournament = await prisma.tournament.update({
    where: { id },
    data: { active: state },
    select: {
      name: true,
      permalink: true,
      active: true,
    },
  });

  revalidatePath('/admin/torneos');

  // Update Cache
  updateTag('admin-tournaments');
  updateTag('admin-tournaments-selector');
  updateTag('admin-tournaments-for-coach');
  updateTag('admin-tournaments-for-match');
  updateTag('admin-tournament-for-match');
  updateTag('admin-tournaments-for-gallery');
  updateTag('admin-tournament');
  updateTag('admin-tournament-id');
  updateTag('public-tournament');
  updateTag('tournaments-list');
  updateTag('tournaments-selector-list');
  updateTag('public-tournaments');
  updateTag('public-tournament');
  updateTag('dashboard-tournaments');
  updateTag('categories-selector-list');

  return {
    ok: true,
    message: `¡ El torneo "${updatedTournament.name}" fue ${updatedTournament.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
