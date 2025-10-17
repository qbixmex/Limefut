'use server';

import prisma from '@/lib/prisma';
import { Player } from "@/shared/interfaces";

type FetchPlayerResponse = Promise<{
  ok: boolean;
  message: string;
  player: Player | null;
}>;

export const fetchPlayerAction = async (
  playerId: string,
  userRole: string[] | null,
): FetchPlayerResponse => {
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
      player,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener el jugador,\n¡ Revise los logs del servidor !",
        player: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      player: null,
    };
  }
};
