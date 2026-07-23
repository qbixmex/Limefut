'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchPlayerResponse = Promise<{
  ok: boolean;
  message: string;
  player: PLAYER_TYPE & {
    team: TEAM_TYPE | null,
  } | null;
}>;

type PLAYER_TYPE = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string | null;
  name: string;
  imageUrl: string | null;
  phone: string | null;
  birthday: Date | null;
  nationality: string | null;
  active: boolean;
  teamId: string | null;
  imagePublicID: string | null;
};

type TEAM_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export const fetchPlayerAction = async (
  playerId: string,
  userRole: string[] | null,
): FetchPlayerResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-player');

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      player: null,
    };
  }

  try {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      },
    });

    if (!player) {
      return {
        ok: false,
        message: '¡ Jugador no encontrado ❌ !',
        player: null,
      };
    }

    return {
      ok: true,
      message: '¡ Jugador obtenido correctamente 👍 !',
      player: {
        ...player,
        team: player?.team ?? null,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el jugador,\n¡ Revise los logs del servidor !',
        player: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      player: null,
    };
  }
};
