import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { MATCH_MODE, MATCH_STATUS } from '@/shared/enums';
import { AMERICA, CHIVAS } from './teams.mock';
import { LIGA_MX } from './tournaments.mock';
import { SUB_15 } from './categories.mock';
import { ESTADIO_AZTECA } from './fields.mock';

export const MATCH_ID = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

export const matchForEditMock: MATCH_TYPE = {
  id: MATCH_ID,
  field: {
    id: ESTADIO_AZTECA.id,
    name: ESTADIO_AZTECA.name,
    map: null,
    address: null,
    city: null,
    state: null,
    country: null,
  },
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  mode: MATCH_MODE.FRIENDLY,
  week: 12,
  referee: 'Fernando García',
  localScore: 2,
  visitorScore: 1,
  status: MATCH_STATUS.SCHEDULED,
  createdAt: new Date('2026-04-01T15:30:00.000Z'),
  updatedAt: new Date('2026-05-16T17:30:00.000Z'),
  localTeam: {
    ...AMERICA,
    imageUrl: null,
    players: [
      { id: '49b70abe-9944-4a33-94a9-b12cb0003719', name: 'Luis García' },
      { id: '6944f902-618a-498b-880d-86f70ad534c2', name: 'Carlos Ruiz' },
    ],
    fields: [{ id: ESTADIO_AZTECA.id, name: ESTADIO_AZTECA.name }],
  },
  visitorTeam: {
    ...CHIVAS,
    imageUrl: null,
    players: [
      { id: '19a2d573-6bd4-41ec-b8be-507456e67400', name: 'Diego López' },
    ],
    fields: [],
  },
  tournament: LIGA_MX,
  category: SUB_15,
  penaltyShootout: null,
};
