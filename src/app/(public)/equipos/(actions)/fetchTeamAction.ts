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
  headquarters: string | null;
  imageUrl: string | null;
  category: string | null;
  format: string | null;
  gender: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
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

export const fetchTeamAction = async ({
  permalink,
  tournamentPermalink,
  category,
  format,
}: {
  permalink: string;
  tournamentPermalink: string;
  category: string;
  format: string;
}): FetchTeamResponse => {
  "use cache";

  cacheLife('days');
  cacheTag('public-team');

  try {
    const team = await prisma.team.findFirst({
      where: {
        permalink,
        tournament: {
          permalink: tournamentPermalink,
        },
        category,
        format,
      },
      select: {
        id: true,
        name: true,
        permalink: true,
        headquarters: true,
        imageUrl: true,
        category:true,
        format:true,
        gender:true,
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
