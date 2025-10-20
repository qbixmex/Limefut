'use server';

import prisma from "@/lib/prisma";

export type PlayerForCredential = {
  id: string;
  name: string;
};

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  players: PlayerForCredential[] | null;
}>;

export const fetchPlayersForCredentialForm = async (): ResponseFetchAction => {
  try {
    const players = await prisma.player.findMany({
      orderBy: { name: 'asc' },
      where: { active: true },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      ok: true,
      message: '! Los jugadores fueron obtenidos correctamente 👍',
      players,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los jugadores");
      return {
        ok: false,
        message: error.message,
        players: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los jugadores, revise los logs del servidor",
      players: null,
    };
  }
};
