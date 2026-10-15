import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-matches.action';
import { MATCH_MODE, MATCH_STATUS } from '@/shared/enums';

export const matchesMock: MATCH_TYPE[] = [
  {
    id: '69f6b957-9d49-4e55-856a-7567365e5ff1',
    localTeam: {
      id: 'bdaa445c-dabd-4b99-82ca-c8e58ec61852',
      name: 'Chivas',
      permalink: 'chivas',
    },
    visitorTeam: {
      id: '483fd0ec-271a-4dcb-b15f-79f19accebeb',
      name: 'Atlas',
      permalink: 'atlas',
    },
    localScore: 0,
    visitorScore: 0,
    status: MATCH_STATUS.SCHEDULED,
    mode: MATCH_MODE.LEAGUE,
    week: 1,
    matchDate: new Date(2026, 2, 15, 20, 30),
    penaltyShootout: null,
  },
  {
    id: '3a2f47e5-6bcc-44fb-acac-00f7a4335915',
    localTeam: {
      id: '61e6dc55-88b0-40f1-8b19-9be0a5b8eb79',
      name: 'América',
      permalink: 'america',
    },
    visitorTeam: {
      id: 'cb02342f-3244-4cef-ac5d-4ea5551ce1b6',
      name: 'Cruz Azul',
      permalink: 'cruz-azul',
    },
    localScore: 2,
    visitorScore: 1,
    status: MATCH_STATUS.COMPLETED,
    mode: MATCH_MODE.FRIENDLY,
    week: 2,
    matchDate: new Date(2026, 2, 16, 18, 0),
    penaltyShootout: {
      id: '26bf2586-6348-4e22-9a97-bb9bb3646084',
      status: MATCH_STATUS.COMPLETED,
      localGoals: 4,
      visitorGoals: 3,
      winnerTeamId: null,
    },
  },
  {
    id: '43ae6560-08a4-4eb2-82c5-5ccc2df32c77',
    localTeam: {
      id: '38152426-c15a-43f9-8b08-87c6da0f5f9e',
      name: 'Toluca',
      permalink: 'toluca',
    },
    visitorTeam: {
      id: '14cf0269-4e1c-43c0-824e-9e09aeb8f0d6',
      name: 'Pumas',
      permalink: 'pumas',
    },
    localScore: 2,
    visitorScore: 1,
    status: MATCH_STATUS.IN_PROGRESS,
    mode: MATCH_MODE.LEAGUE,
    week: null,
    matchDate: null,
    penaltyShootout: null,
  },
];
