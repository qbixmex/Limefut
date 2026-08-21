import type { Match } from '@/app/(public)/liguilla/(actions)/fetch-public-playoff-match';
import { MATCH_GROUP } from '@/shared/enums/match-group.enum';
import { MATCH_STATUS, PLAYOFF_ROUND, SHOOTOUT_STATUS } from '@/shared/enums';
import type { PENALTY_SHOOTOUT_TYPE } from '@/shared/types/penalty_shootout_type';

export const matchMock: Match = {
  id: 'match-1',
  round: PLAYOFF_ROUND.SEMI_FINAL,
  group: MATCH_GROUP.GOLDER,
  localScore: 2,
  visitorScore: 1,
  status: MATCH_STATUS.COMPLETED,
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  referee: 'John Doe',
  remarks: 'Partido correspondiente a la semifinal.',
  tournament: {
    name: 'Torneo Apertura',
    permalink: 'torneo-apertura',
  },
  category: {
    name: 'Sub 15',
    permalink: 'sub-15',
  },
  local: {
    name: 'Club Country',
    permalink: 'club-country',
    imageUrl: '/images/local.png',
  },
  visitor: {
    name: 'Deportivo Lime',
    permalink: 'deportivo-lime',
    imageUrl: '/images/visitor.png',
  },
  winner: {
    name: 'Club Country',
    permalink: 'club-country',
  },
  field: {
    name: 'Cancha 1',
    permalink: 'cancha-1',
  },
  penaltyShootout: null,
};

export const penaltyShootoutMock: PENALTY_SHOOTOUT_TYPE = {
  id: 'shootout-1',
  localTeam: {
    id: 'team-local-1',
    name: 'Club Country',
  },
  visitorTeam: {
    id: 'team-visitor-1',
    name: 'Deportivo Lime',
  },
  localGoals: 4,
  visitorGoals: 3,
  winnerTeamId: 'team-local-1',
  status: SHOOTOUT_STATUS.COMPLETED,
  kicks: [
    {
      id: 'kick-1',
      teamId: 'team-local-1',
      playerId: null,
      shooterName: 'Player One',
      order: 1,
      isGoal: true,
    },
    {
      id: 'kick-2',
      teamId: 'team-visitor-1',
      playerId: null,
      shooterName: 'Player Two',
      order: 2,
      isGoal: false,
    },
  ],
};

export type SearchParams = {
  tournament?: string;
  category?: string;
  local_team?: string;
  visitor_team?: string;
};
