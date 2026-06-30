'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type CoachType = { id: string; name: string; };
type PlayerType = { id: string; name: string; };
type FieldType = { id: string; name: string; };

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  team: TEAM_TYPE | null;
}>;

export type TEAM_TYPE = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  format: string | null;
  gender: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
} & {
  tournament: {
    id: string;
    name: string;
    permalink: string;
  } | null;
  category: string | null;
  coach: CoachType | null;
  players: PlayerType[] | null;
  fields: FieldType[],
  matches: MATCH_TYPE[],
}

export type MATCH_TYPE = {
  id: string;
  tournamentId: string;
  localTeam: MATCH_TEAM;
  visitorTeam: MATCH_TEAM;
  localScore: number | null;
  visitorScore: number | null;
  place: string | null;
  matchDate: Date | null;
  week: number | null;
  status: string;
  categoryId: string | null;
  fieldId: string | null;
  penaltyShootout: PENALTY_SHOOTOUT | null;
};

type MATCH_TEAM = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
};

type PENALTY_SHOOTOUT = {
  localGoals: number;
  visitorGoals: number;
};

export const fetchTeamAction = async ({
  permalink,
  tournamentPermalink,
  category,
}: {
  permalink: string;
  tournamentPermalink: string;
  category: string;
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
        homeMatches: {
          where: {
            OR: [
              { status: 'completed' },
              { status: 'scheduled' },
            ],
          },
          select: {
            id: true,
            local: {
              select: {
                id: true,
                name: true,
                permalink: true,
                imageUrl: true,
              },
            },
            visitor: {
              select: {
                id: true,
                name: true,
                permalink: true,
                imageUrl: true,
              },
            },
            localScore: true,
            visitorScore: true,
            place: true,
            matchDate: true,
            week: true,
            status: true,
            tournamentId: true,
            categoryId: true,
            fieldId: true,
            penaltyShootout: {
              select: {
                localGoals: true,
                visitorGoals: true,
              },
            },
          },
          orderBy: {
            week: 'asc',
          },
        },
        awayMatches: {
          where: {
            OR: [
              { status: 'completed' },
              { status: 'scheduled' },
            ],
          },
          select: {
            id: true,
            local: {
              select: {
                id: true,
                name: true,
                permalink: true,
                imageUrl: true,
              },
            },
            visitor: {
              select: {
                id: true,
                name: true,
                permalink: true,
                imageUrl: true,
              },
            },
            localScore: true,
            visitorScore: true,
            place: true,
            matchDate: true,
            week: true,
            status: true,
            tournamentId: true,
            categoryId: true,
            fieldId: true,
            penaltyShootout: {
              select: {
                localGoals: true,
                visitorGoals: true,
              },
            },
          },
          orderBy: {
            week: 'asc',
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

    const teamMatches: MATCH_TYPE[] = [
      ...team.homeMatches,
      ...team.awayMatches,
    ].map(match => ({
      ...match,
      localTeam: match.local,
      visitorTeam: match.visitor,
    })).sort((a, b) => (a.week ?? 0) - (b.week ?? 0));

    return {
      ok: true,
      message: '¡ Equipo obtenido correctamente 👍 !',
      team: {
        id: team.id,
        name: team.name,
        permalink: team.permalink,
        imageUrl: team.imageUrl,
        category: team.category,
        format: team.format,
        gender: team.gender,
        country: team.country,
        city: team.city,
        state: team.state,
        address: team.address,
        tournament: team.tournament,
        coach: team.coach,
        players: team.players,
        fields: team.fields.map((teamField) => teamField.field),
        matches: teamMatches,
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
