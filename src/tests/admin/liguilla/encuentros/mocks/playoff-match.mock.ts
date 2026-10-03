import type { MATCH_TYPE } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-match.action';
import { MATCH_STATUS, ROUND } from '@/shared/enums';

export const MATCH_ID = '24620ff5-cd48-4385-9ab8-b6320d69947f';
export const PLAYOFF_ID = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

export const playoffMatchMock: MATCH_TYPE = {
  id: MATCH_ID,
  round: ROUND.QUARTER_FINAL,
  group: 'gold',
  localScore: 2,
  visitorScore: 1,
  status: MATCH_STATUS.COMPLETED,
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  referee: 'John Doe',
  remarks: 'Encuentro de ida',
  local: { id: '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d', name: 'Club América' },
  visitor: { id: '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e', name: 'Deportivo Lime' },
  field: { id: '9a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d', name: 'Estadio Central' },
  createdAt: new Date('2026-04-01T15:30:00.000Z'),
  updatedAt: new Date('2026-04-02T15:30:00.000Z'),
};
