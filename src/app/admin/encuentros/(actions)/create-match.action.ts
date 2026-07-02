'use server';

import prisma from '@/lib/prisma';
import { createMatchSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '@/shared/enums';
import { Prisma } from '@/generated/prisma/client';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: MATCH_TYPE | null;
}>;

export type MATCH_TYPE = {
  id: string;
  week: number | null;
  status: string;
  place: string | null;
  referee: string | null;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  localId: string;
  visitorId: string;
  tournament: {
    id: string;
    name: string;
    permalink: string;
  };
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null,
  local: {
    id: string;
    name: string;
  };
  visitor: {
    id: string;
    name: string;
  };
};

export const createMatchAction = async ({
  formData,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  formData: FormData;
}): CreateResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      match: null,
    };
  }

  if (
    (authenticatedUserRoles && authenticatedUserRoles.length > 0) &&
    (!authenticatedUserRoles.includes('admin'))
  ) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      match: null,
    };
  }

  const rawData = {
    localTeamId: formData.get('localTeamId') ?? '',
    localScore: parseInt(formData.get('localScore') as string ?? '0'),
    visitorTeamId: formData.get('visitorTeamId') ?? '',
    visitorScore: parseInt(formData.get('visitorScore') as string ?? '0'),
    place: formData.get('place') ?? undefined,
    referee: formData.get('referee') ?? undefined,
    matchDate: formData.get('matchDate')
      ? new Date(formData.get('matchDate') as string)
      : undefined,
    status: formData.get('status') ?? MATCH_STATUS.SCHEDULED,
    tournament: formData.get('tournament') ?? '',
    category: formData.get('category') ?? '',
    week: formData.get('week') ? Number(formData.get('week')) : 0,
  };

  const matchVerified = createMatchSchema.safeParse(rawData);

  if (!matchVerified.success) {
    return {
      ok: false,
      message: matchVerified.error.message,
      match: null,
    };
  }

  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
    ...matchToSave
  } = matchVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const tournament = await transaction.tournament.findFirst({
        where: {
          permalink: tournamentPermalink,
        },
        select: { id: true },
      });

      if (!tournament) {
        return {
          ok: false,
          message: `¡ El torneo con el enlace permanente: "${tournamentPermalink}" no existe !`,
          match: null,
        };
      }

      const category = await transaction.category.findFirst({
        where: {
          permalink: categoryPermalink,
        },
        select: { id: true },
      });

      if (!category) {
        return {
          ok: false,
          message: `¡ La categoría con el enlace permanente: "${categoryPermalink}" no existe !`,
          match: null,
        };
      }

      const selectMatch = {
        id: true,
        localId: true,
        visitorId: true,
        place: true,
        matchDate: true,
        week: true,
        referee: true,
        localScore: true,
        visitorScore: true,
        status: true,
        local: {
          select: {
            id: true,
            name: true,
          },
        },
        visitor: {
          select: {
            id: true,
            name: true,
          },
        },
        tournament: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      } satisfies Prisma.MatchSelect;

      const createdMatch = await transaction.match.create({
        data: {
          localId: matchToSave.localTeamId,
          localScore: matchToSave.localScore,
          visitorId: matchToSave.visitorTeamId,
          visitorScore: matchToSave.visitorScore,
          place: matchToSave.place ?? undefined,
          referee: matchToSave.referee,
          matchDate: matchToSave.matchDate,
          status: matchToSave.status as MATCH_STATUS_TYPE,
          tournamentId: tournament.id,
          categoryId: category.id,
          week: matchToSave.week !== 0
            ? matchToSave.week as number
            : null,
        },
        select: selectMatch,
      });

      return {
        ok: true,
        message: '¡ Encuentro creado correctamente 👍 !',
        match: {
          ...createdMatch,
          localTeam: createdMatch.local,
          visitorTeam: createdMatch.visitor,
          localScore: createdMatch.localScore as number,
          visitorScore: createdMatch.visitorScore as number,
          status: createdMatch.status as MATCH_STATUS_TYPE,
          category: createdMatch.category,
        },
      };
    });

    // Update Cache
    updateTag('admin-matches');
    updateTag('admin-match');
    updateTag('matches');
    updateTag('dashboard-results');
    updateTag('admin-tournament-for-match');
    updateTag('admin-teams-for-match');
    updateTag('public-matches');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-matches');
    updateTag('public-team-standings');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          match: null,
        };
      }

      console.log('='.repeat(20) + ' PRISMA ERROR ' + '='.repeat(20));
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
      console.log('='.repeat(54));

      return {
        ok: false,
        message: '¡ Error al crear el encuentro, revise los logs del servidor !',
        match: null,
      };
    }

    console.log('='.repeat(20) + ' UNKNOWN ERROR ' + '='.repeat(20));
    console.log(error);
    console.log('='.repeat(55));

    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      match: null,
    };
  }
};
