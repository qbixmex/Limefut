'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type CoachType = { id: string; name: string; };
type PlayerType = { id: string; name: string; };
type FieldType = { id: string; name: string; };

export type TeamType = {
  id: string;
  name: string;
  permalink: string;
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
    tournament: {
      id: string;
      name: string;
      permalink: string;
      category: string;
      format: string;
    } | null;
    coach: CoachType | null;
    players: PlayerType[] | null;
    fields: FieldType[],
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
  'use cache';

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
        imageUrl: true,
        category: true,
        format: true,
        gender: true,
        country: true,
        city: true,
        state: true,
        address: true,
        active: true,
        tournament: {
          select: {
            id: true,
            name: true,
            permalink: true,
            category: true,
            format: true,
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
          include: {
            field: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      return {
        ok: false,
        message: '¡ El equipo no se encuentra en la base de datos ❌ !',
        team: null,
      };
    }

    if (!team.active) {
      return {
        ok: false,
        message: `¡ El equipo ${team.name} está desactivado ❌ !`,
        team: null,
      };
    }

    return {
      ok: true,
      message: '¡ Equipo obtenido correctamente 👍 !',
      team: {
        ...team,
        fields: team.fields.map((teamField) => teamField.field),
      },
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
