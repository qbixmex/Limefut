'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';
import type { Match } from '../(components)/match-card';
import { PLAYOFF_ROUND, type PLAYOFF_ROUND_TYPE } from '@/shared/enums';

export type BracketGroupData = {
  groupName: string;
  variant: 'oro' | 'plata';
  startingRound: PLAYOFF_ROUND_TYPE;
  quarterFinals?: [Match, Match, Match, Match];
  semiFinals?: [Match, Match];
  final: Match;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  brackets: BracketGroupData[];
}>;

const mapStatus = (status: string): 'scheduled' | 'completed' | 'canceled' => {
  if (status === 'completed') return 'completed';
  if (status === 'canceled') return 'canceled';
  return 'scheduled';
};

const formatDate = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

let emptyId = 0;
const createEmptyMatch = (): Match => {
  emptyId++;
  return {
    id: `empty-${emptyId}`,
    localTeam: { id: null, name: null, permalink: null },
    visitorTeam: { id: null, name: null, permalink: null },
    localScore: null,
    visitorScore: null,
    matchDate: null,
    winnerId: null,
    status: 'scheduled',
    penaltyShoots: null,
  };
};

export const fetchPublicPlayoffsAction = async ({
  tournamentPermalink,
  categoryPermalink,
}: {
  tournamentPermalink: string;
  categoryPermalink?: string;
}): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-playoff-matches');

  try {
    const playoffs = await prisma.playoff.findMany({
      where: {
        tournament: {
          permalink: tournamentPermalink,
        },
        category: {
          permalink: categoryPermalink,
        },
      },
      select: {
        id: true,
        startingRound: true,
      },
    });

    if (playoffs.length === 0) {
      return {
        ok: true,
        message: 'No hay liguilla disponible para esta categoría',
        brackets: [],
      };
    }

    const playoffIds = playoffs.map((p) => p.id);
    const startingRoundByPlayoff = new Map(
      playoffs.map((p) => [p.id, p.startingRound]),
    );

    const matches = await prisma.playoffMatch.findMany({
      where: { playoffId: { in: playoffIds } },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        playoffId: true,
        round: true,
        position: true,
        localScore: true,
        visitorScore: true,
        status: true,
        matchDate: true,
        winnerId: true,
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
        penaltyShootout: {
          select: {
            localGoals: true,
            visitorGoals: true,
            winnerTeamId: true,
          },
        },
      },
    });

    if (matches.length === 0) {
      return {
        ok: false,
        message: 'No hay encuentros en las liguillas',
        brackets: [],
      };
    }

    // Group by position (1 = Oro, 2 = Plata)
    const groups = new Map<
      number,
      {
        quarterFinals: Match[];
        semiFinals: Match[];
        finals: Match[];
        startingRound: 'quarterfinal' | 'semifinal' | 'final';
      }
    >();

    for (const match of matches) {
      if (!groups.has(match.position)) {
        const sr = startingRoundByPlayoff.get(match.playoffId) ?? 'quarterfinal';
        groups.set(match.position, {
          quarterFinals: [],
          semiFinals: [],
          finals: [],
          startingRound: sr,
        });
      }

      const matchData: Match = {
        id: match.id,
        localTeam: {
          id: match.local.id,
          name: match.local.name,
          permalink: match.local.permalink,
          imageUrl: match.local.imageUrl,
        },
        visitorTeam: {
          id: match.visitor.id,
          name: match.visitor.name,
          permalink: match.visitor.permalink,
          imageUrl: match.visitor.imageUrl,
        },
        localScore: match.localScore,
        visitorScore: match.visitorScore,
        winnerId: match.winnerId,
        matchDate: formatDate(match.matchDate),
        status: mapStatus(match.status),
        penaltyShoots: match.penaltyShootout
          ? {
              localGoals: match.penaltyShootout.localGoals,
              visitorGoals: match.penaltyShootout.visitorGoals,
              winnerTeamId: match.penaltyShootout.winnerTeamId,
            }
          : null,
      };

      const group = groups.get(match.position)!;

      switch (match.round) {
        case 'quarterfinal':
          group.quarterFinals.push(matchData);
          break;
        case 'semifinal':
          group.semiFinals.push(matchData);
          break;
        case 'final':
          group.finals.push(matchData);
          break;
      }
    }

    const brackets: BracketGroupData[] = [];

    const sortedPositions = Array.from(groups.keys()).sort();

    for (const position of sortedPositions) {
      const group = groups.get(position)!;
      const finalMatch = group.finals[0] ?? createEmptyMatch();

      const bracket: BracketGroupData = {
        groupName: position === 1 ? 'Oro' : 'Plata',
        variant: position === 1 ? 'oro' : 'plata',
        startingRound: group.startingRound as PLAYOFF_ROUND_TYPE,
        final: finalMatch,
      };

      if (
        group.startingRound === PLAYOFF_ROUND.QUARTER_FINAL ||
        group.startingRound === PLAYOFF_ROUND.SEMI_FINAL
      ) {
        const semifinal: Match[] = group.semiFinals.slice(0, 2);
        while (semifinal.length < 2) semifinal.push(createEmptyMatch());
        bracket.semiFinals = semifinal as [Match, Match];
      }

      if (group.startingRound === 'quarterfinal') {
        const qf: Match[] = group.quarterFinals.slice(0, 4);
        while (qf.length < 4) qf.push(createEmptyMatch());
        bracket.quarterFinals = qf as [Match, Match, Match, Match];
      }

      brackets.push(bracket);
    }

    return {
      ok: true,
      message: 'Liguillas obtenidas correctamente',
      brackets,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al obtener liguillas públicas:', error.message);
      return {
        ok: false,
        message: error.message,
        brackets: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener las liguillas',
      brackets: [],
    };
  }
};
