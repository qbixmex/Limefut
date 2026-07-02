'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editMatchSchema } from '@/shared/schemas';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '@/shared/enums';
import { Prisma } from '@/generated/prisma/client';

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: MATCH_TYPE | null;
}>;

export type MATCH_TYPE = {
  id: string;
  localScore: number | null;
  visitorScore: number | null;
  place: string | null;
  referee: string | null;
  matchDate: Date | null;
  week: number | null;
  status: string;
  tournament: {
    id: string;
    name: string;
    permalink: string;
  };
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null;
  local: {
    id: string;
    name: string;
  };
  visitor: {
    id: string;
    name: string;
  };
};

export const updateMatchAction = async ({
  formData,
  matchId,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  formData: FormData;
  matchId: string;
}): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      match: null,
    };
  }

  if (authenticatedUserRoles && !authenticatedUserRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      match: null,
    };
  }

  const rawData = {
    localTeamId: formData.get('localTeamId') ?? '',
    visitorTeamId: formData.get('visitorTeamId') ?? undefined,
    localScore: parseInt(formData.get('localScore') as string ?? '0') ?? undefined,
    visitorScore: parseInt(formData.get('visitorScore') as string ?? '0') ?? undefined,
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

  const matchVerified = editMatchSchema.safeParse(rawData);

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
      try {
        const match = await transaction.match.findFirst({
          where: { id: matchId },
          select: {
            id: true,
            tournament: {
              select: {
                id: true,
                permalink: true,
              },
            },
            category: {
              select: {
                id: true,
                permalink: true,
              },
            },
          },
        });

        if (!match) {
          return {
            ok: false,
            message: '¡ El encuentro no existe o ha sido eliminado !',
            match: null,
          };
        }

        let tournamentId: string | undefined;

        if (match.tournament.permalink !== tournamentPermalink) {
          const tournament = await transaction.tournament.findFirst({
            where: { permalink: tournamentPermalink },
            select: { id: true },
          });

          if (!tournament) {
            return {
              ok: false,
              message: `¡ El torneo con el enlace permanente: [${tournamentPermalink}] no existe !`,
              match: null,
            };
          }

          tournamentId = tournament.id;
        }

        let categoryId: string | undefined;

        if (match.category?.permalink !== categoryPermalink) {
          const category = await transaction.category.findFirst({
            where: { permalink: categoryPermalink },
            select: { id: true },
          });

          if (!category) {
            return {
              ok: false,
              message: `¡ La categoría con el enlace permanente: [${categoryPermalink}] no existe !`,
              match: null,
            };
          }

          categoryId = category.id;
        }

        const updatedMatch = await transaction.match.update({
          where: { id: matchId },
          data: {
            localId: matchToSave.localTeamId,
            visitorId: matchToSave.visitorTeamId,
            place: matchToSave.place ?? null,
            referee: matchToSave.referee,
            localScore: matchToSave.localScore,
            visitorScore: matchToSave.visitorScore,
            matchDate: matchToSave.matchDate,
            status: matchToSave.status as MATCH_STATUS_TYPE,
            tournamentId,
            categoryId,
            week: matchToSave.week !== 0
              ? matchToSave.week
              : null,
          },
          select: {
            id: true,
            localScore: true,
            visitorScore: true,
            place: true,
            matchDate: true,
            week: true,
            referee: true,
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
          },
        });

        // Update Cache
        updateTag('admin-matches');
        updateTag('admin-match');
        updateTag('admin-tournament-for-match');
        updateTag('admin-teams-for-match');
        updateTag('matches');
        updateTag('dashboard-results');
        updateTag('public-matches');
        updateTag('public-results-roles');
        updateTag('public-result-details');
        updateTag('public-matches-count');
        updateTag('public-team-matches');
        updateTag('public-team-standings');

        return {
          ok: true,
          message: '¡ El encuentro fue actualizado correctamente 👍 !',
          match: {
            ...updatedMatch,
            localTeam: updatedMatch.local,
            visitorTeam: updatedMatch.visitor,
            localScore: updatedMatch.localScore as number,
            visitorScore: updatedMatch.visitorScore as number,
            status: updatedMatch.status as MATCH_STATUS_TYPE,
            tournament: {
              id: updatedMatch.tournament.id,
              name: updatedMatch.tournament.name,
              permalink: updatedMatch.tournament.permalink,
            },
            category: updatedMatch.category,
          },
        };
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
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      match: null,
    };
  }
};
