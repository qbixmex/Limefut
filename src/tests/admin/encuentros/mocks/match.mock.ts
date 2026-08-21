import type {
  MATCH_TYPE,
  PENALTY_SHOOTOUT_TYPE,
} from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { MATCH_STATUS, SHOOTOUT_STATUS } from '@/shared/enums';

export const MATCH_ID = '24620ff5-cd48-4385-9ab8-b6320d69947f';

export const matchMock: MATCH_TYPE = {
  id: MATCH_ID,
  field: {
    id: '78fb00e3-e4d2-49b9-838f-b6dc7c52bee1',
    name: 'Estadio Central',
  },
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  week: 12,
  referee: 'John Doe',
  localScore: 2,
  visitorScore: 1,
  status: MATCH_STATUS.COMPLETED,
  createdAt: new Date('2026-04-01T15:30:00.000Z'),
  localTeam: {
    id: '96f99393-cfd5-4703-b043-57764aa09e39',
    name: 'Club América',
    permalink: 'club-america',
    players: [],
    fields: [],
  },
  visitorTeam: {
    id: '94f71e9c-c690-4ff4-830d-552d20f79c89',
    name: 'Deportivo Lime',
    permalink: 'deportivo-lime',
    players: [],
    fields: [],
  },
  tournament: {
    id: 'fbf67ef9-4d9b-4eff-a165-2c042fefdd8b',
    name: 'Liga Premier',
    permalink: 'liga-premier',
  },
  category: null,
  penaltyShootout: null,
};

export const penaltyShootoutMock: PENALTY_SHOOTOUT_TYPE = {
  id: '650108f4-d918-405e-b249-220249d6d340',
  localTeam: {
    id: '96f99393-cfd5-4703-b043-57764aa09e39',
    name: 'Club América',
    permalink: 'club-america',
  },
  visitorTeam: {
    id: '94f71e9c-c690-4ff4-830d-552d20f79c89',
    name: 'Deportivo Lime',
    permalink: 'deportivo-lime',
  },
  localGoals: 4,
  visitorGoals: 3,
  winnerTeamId: '96f99393-cfd5-4703-b043-57764aa09e39',
  status: SHOOTOUT_STATUS.COMPLETED,
  kicks: [
    {
      id: '07313cae-f6e4-4ab8-b99b-13c5a6744bdc',
      teamId: '96f99393-cfd5-4703-b043-57764aa09e39',
      playerId: null,
      shooterName: 'Player One',
      order: 1,
      isGoal: true,
    },
    {
      id: '252cd6e9-38aa-4ffe-8db7-4036aa4212ad',
      teamId: '94f71e9c-c690-4ff4-830d-552d20f79c89',
      playerId: null,
      shooterName: 'Player Two',
      order: 2,
      isGoal: false,
    },
  ],
};
