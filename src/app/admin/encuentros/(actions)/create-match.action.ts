'use server';

import prisma from '@/lib/prisma';
import { createMatchSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';
import type { MATCH_MODE_TYPE, MATCH_STATUS_TYPE } from '@/shared/enums';
import { MATCH_STATUS } from '@/shared/enums';
import { Prisma } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/get-session';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: MATCH_TYPE | null;
}>;

export type MATCH_TYPE = {
  id: string;
  week: number | null;
  status: string;
  referee: string | null;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  localId: string;
  visitorId: string;
  mode: MATCH_MODE_TYPE;
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

export const createMatchAction = async ({ formData }: {
  formData: FormData;
}): CreateResponseAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
      match: null,
    };
  }

  const rawData = {
    localTeamId: formData.get('localTeamId') ?? '',
    localScore: parseInt(formData.get('localScore') as string ?? '0'),
    visitorTeamId: formData.get('visitorTeamId') ?? '',
    visitorScore: parseInt(formData.get('visitorScore') as string ?? '0'),
    fieldId: formData.get('fieldId') ?? undefined,
    referee: formData.get('referee') ?? undefined,
    matchDate: formData.get('matchDate')
      ? new Date(formData.get('matchDate') as string)
      : undefined,
    status: formData.get('status') ?? MATCH_STATUS.SCHEDULED,
    tournament: formData.get('tournament') ?? '',
    category: formData.get('category') ?? '',
    mode: formData.get('mode') ?? undefined,
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

  const tournament = await prisma.tournament.findFirst({
    where: {
      permalink: tournamentPermalink,
    },
    select: { id: true },
  });

  if (!tournament) {
    return {
      ok: false,
      message: `El torneo con el enlace permanente: "${tournamentPermalink}" no existe`,
      match: null,
    };
  }

  const category = await prisma.category.findFirst({
    where: { permalink: categoryPermalink },
    select: { id: true },
  });

  if (!category) {
    return {
      ok: false,
      message: `La categoría con el enlace permanente: "${categoryPermalink}" no existe`,
      match: null,
    };
  }

  if (matchToSave.fieldId) {
    const field = await prisma.field.findFirst({
      where: { id: matchToSave.fieldId },
      select: { id: true },
    });

    if (!field) {
      return {
        ok: false,
        message: `La cancha con el id: "${matchToSave.fieldId}" no existe`,
        match: null,
      };
    }
  }

  try {
    const selectMatch = {
      id: true,
      localId: true,
      visitorId: true,
      field: {
        select: {
          id: true,
          name: true,
        },
      },
      matchDate: true,
      mode: true,
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

    const createdMatch = await prisma.match.create({
      data: {
        localId: matchToSave.localTeamId,
        localScore: matchToSave.localScore,
        visitorId: matchToSave.visitorTeamId,
        visitorScore: matchToSave.visitorScore,
        fieldId: matchToSave.fieldId ?? undefined,
        referee: matchToSave.referee,
        matchDate: matchToSave.matchDate,
        status: matchToSave.status as MATCH_STATUS_TYPE,
        tournamentId: tournament.id,
        categoryId: category.id,
        mode: matchToSave.mode as MATCH_MODE_TYPE,
        week: matchToSave.week !== 0
          ? matchToSave.week as number
          : null,
      },
      select: selectMatch,
    });

    // Update Cache
    updateTag('admin-matches');
    updateTag(`admin-match-${createdMatch.id}`);
    updateTag('matches');
    updateTag('dashboard-results');
    updateTag('admin-tournament-for-match');
    updateTag('admin-teams-for-match');
    updateTag('public-matches');
    updateTag('public-results');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-matches');
    updateTag('public-team-standings');

    return {
      ok: true,
      message: 'Encuentro creado correctamente',
      match: {
        ...createdMatch,
        localId: createdMatch.local.id,
        visitorId: createdMatch.visitor.id,
        localScore: createdMatch.localScore as number,
        visitorScore: createdMatch.visitorScore as number,
        status: createdMatch.status as MATCH_STATUS_TYPE,
        category: createdMatch.category,
      },
    };
  } catch (error) {
    let errorMessage = 'Error inesperado';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        errorMessage = 'Error de campos duplicados';
      } else {
        errorMessage = 'Error al crear el encuentro';
      }

      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
    } else if (error instanceof Error) {
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('MESSAGE:', error.message);
    } else {
      console.log(error);
    }

    return {
      ok: false,
      message: `${errorMessage}, revise los logs del servidor`,
      match: null,
    };
  }
};
