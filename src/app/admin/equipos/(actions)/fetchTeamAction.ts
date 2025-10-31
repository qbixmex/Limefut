'use server';

import prisma from '@/lib/prisma';
import type { Team, Tournament, Coach, Player } from "@/shared/interfaces";

type TournamentType = Pick<Tournament, 'id' | 'name' | 'permalink'>;
type CoachType = Pick<Coach, 'id' | 'name'>;
type PlayerType = Pick<Player, 'id' | 'name'>;

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  team: Team & {
    tournament: TournamentType | null;
    coach: CoachType | null;
    players: PlayerType[] | null;
  } | null;
}>;

export const fetchTeamAction = async (
  permalink: string,
  userRole: string[] | null,
): FetchTeamResponse => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      team: null,
    };
  }

  try {
    const team = await prisma.team.findUnique({
      where: { permalink: permalink },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            permalink: true,
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
        }
      }
    });

    if (!team) {
      return {
        ok: false,
        message: '¡ Equipo no encontrado ❌ !',
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
        message: "No se pudo obtener el equipo,\n¡ Revise los logs del servidor !",
        team: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      team: null,
    };
  }
};
