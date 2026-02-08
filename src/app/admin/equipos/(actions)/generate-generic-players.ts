'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import { randomUUID } from "node:crypto";

type Options = {
  userRoles: string[] | undefined;
  teamId: string;
  quantity: number;
};

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const generatePlayersAction = async ({
  userRoles,
  teamId,
  quantity,
}: Options): CreateResponseAction => {
  if ((userRoles !== null) && (!userRoles?.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
    };
  }

  const team = await prisma.team.count({ where: { id: teamId } });

  if (!team) {
    return {
      ok: false,
      message: `¡ El equipo con el id "${teamId}" no existe ❌ !`,
    };
  }

  const newPlayers = Array.from({ length: quantity }).map((_, index) => {
    return {
      id: randomUUID(),
      name: `Jugador ${String(index + 1).padStart(2, '0')}`,
      active: true,
    };
  });

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      await transaction.team.update({
        where: { id: teamId },
        data: {
          players: {
            createMany: {
              data: newPlayers,
            },
          },
        },
      });

      return {
        ok: true,
        message: '¡ Los jugadores fueron generados ✨ !',
      };
    });

    // Revalidate Paths
    updateTag('admin-teams');
    updateTag('admin-teams-for-player');
    updateTag('admin-team');
    updateTag('public-teams');
    updateTag('public-team');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
        };
      }

      return {
        ok: false,
        message: '¡ Error al crear los jugadores, revise los logs del servidor !',
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
    };
  }
};
