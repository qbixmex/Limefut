import { SHOOTOUT_STATUS } from '@/shared/enums';

export const PENALTY_SHOOTOUT_ID = 'b2f343d3-5936-4e83-9bcf-6ffa150d9dc3';

export const penaltyShootoutMock = {
  id: PENALTY_SHOOTOUT_ID,
  localGoals: 4,
  visitorGoals: 3,
  winnerTeamId: '3f24c2e0-7fd2-46e4-94ba-4dd0b557e675',
  status: SHOOTOUT_STATUS.COMPLETED,
  createdAt: new Date('2026-05-16T19:30:00.000Z'),
  updatedAt: new Date('2026-05-16T19:45:00.000Z'),
};
