'use server';

import prisma from '@/lib/prisma';
import type { Team, Coach, Player } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type CoachType = Pick<Coach, 'id' | 'name'>;
type PlayerType = Pick<Player, 'id' | 'name'>;
type FieldType = { id: string; name: string; };

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  team: Team & {
    tournament: {
      id: string;
      name: string;
    } | null;
    coach: CoachType | null;
    players: PlayerType[] | null;
    fields: FieldType[];
  } | null;
}>;

export const fetchTeamAction = async (
  teamId: string,
  userRole: string[] | null,
): FetchTeamResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-team');

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      team: null,
    };
  }

  try {
    const team = await prisma.team.findFirst({
      where: { id: teamId },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
        coach: {
          select: {
            id: true,
            name: true,
          },
        },
        players: {
          select: {
            id: true,
            name: true,
          },
        },
        fields: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!team) {
      return {
        ok: false,
        message: `¡ El equipo con el ID: "${teamId}" no existe ❌ !`,
        team: null,
      };
    }

    return {
      ok: true,
      message: '¡ Equipo obtenido correctamente 👍 !',
      team,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el equipo,\n¡ Revise los logs del servidor !',
        team: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      team: null,
    };
  }
};
