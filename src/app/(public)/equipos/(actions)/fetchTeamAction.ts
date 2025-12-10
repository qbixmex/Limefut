'use server';

import prisma from '@/lib/prisma';
import type { Tournament, Coach, Player } from "@/shared/interfaces";
import { cacheLife, cacheTag } from 'next/cache';

type TournamentType = Pick<Tournament, 'id' | 'name' | 'permalink'>;
type CoachType = Pick<Coach, 'id' | 'name'>;
type PlayerType = Pick<Player, 'id' | 'name'>;

export type TeamType = {
  id: string;
  name: string;
  permalink: string;
  headquarters: string;
  imageUrl: string | null;
  division: string;
  group: string;
  country: string;
  city: string;
  state: string;
  address: string | null;
};

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  team: TeamType & {
    tournament: TournamentType | null;
    coach: CoachType | null;
    players: PlayerType[] | null;
  } | null;
}>;

export const fetchTeamAction = async (
  permalink: string,
): FetchTeamResponse => {
  "use cache";

  cacheLife('days');
  cacheTag('public-team');

  try {
    const team = await prisma.team.findUnique({
      where: { permalink },
      select: {
        id: true,
        name: true,
        permalink: true,
        headquarters: true,
        imageUrl: true,
        division:true,
        group:true,
        country:true,
        city:true,
        state:true,
        address: true,
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
        },
      },
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
