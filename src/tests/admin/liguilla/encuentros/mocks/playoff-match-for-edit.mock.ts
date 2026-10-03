import type { MATCH_TYPE } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-match-for-edit.action';
import type { PENALTY_SHOOTOUT_TYPE } from '@/shared/types/penalty_shootout_type';
import { MATCH_STATUS } from '@/shared/enums';

export const MATCH_ID = '24620ff5-cd48-4385-9ab8-b6320d69947f';
export const PLAYOFF_ID = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

export const penaltyShootoutMock: PENALTY_SHOOTOUT_TYPE = {
  id: 'ab12cd34-ef56-4a78-9b90-1c2d3e4f5a6b',
  localTeam: { id: '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d', name: 'Club América' },
  visitorTeam: { id: '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e', name: 'Deportivo Lime' },
  localGoals: 4,
  visitorGoals: 3,
  winnerTeamId: '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d',
  status: MATCH_STATUS.COMPLETED,
  kicks: [
    {
      id: '07313cae-f6e4-4ab8-b99b-13c5a6744bdc',
      teamId: '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d',
      playerId: 'ae631f62-c74a-4640-9eaa-9804e310812a',
      shooterName: 'Juan Pérez',
      order: 1,
      isGoal: true,
    },
  ],
};

export const playoffMatchForEditMock: MATCH_TYPE = {
  id: MATCH_ID,
  localScore: 2,
  visitorScore: 2,
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  referee: 'Fernando García',
  status: MATCH_STATUS.COMPLETED,
  group: 'gold',
  round: 'quarterfinal',
  remarks: 'Encuentro de ida',
  localTeam: {
    id: '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d',
    name: 'Club América',
    players: [
      {
        id: '8a25e828-6e50-42ff-8976-41d50acd058a',
        name: 'Juan Pérez',
      },
      {
        id: 'f7c23564-b820-4b44-85d4-8b58ec8dce10',
        name: 'Carlos Ochoa',
      },
    ],
  },
  visitorTeam: {
    id: '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e',
    name: 'Deportivo Lime',
    players: [
      {
        id: '66997d26-ed01-47d4-b5eb-facbb4e55878',
        name: 'Alejandro Dominguez',
      },
    ],
  },
  fieldId: '9a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d',
  penaltyShootout: penaltyShootoutMock,
};
