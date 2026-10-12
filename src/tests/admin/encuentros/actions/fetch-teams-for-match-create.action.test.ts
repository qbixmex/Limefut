const { mockTeamFindMany } = vi.hoisted(() => ({
  mockTeamFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    team: { findMany: mockTeamFindMany },
  },
}));

import { fetchTeamsForMatchCreateAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action';
import { AMERICA, CHIVAS, CRUZ_AZUL } from '../mocks/teams.mock';
import { ESTADIO_AZTECA, ESTADIO_AKRON } from '../mocks/fields.mock';

const tournamentPermalink = 'liga-mx';
const categoryPermalink = 'sub-15';

const rawTeams = [
  { ...AMERICA, fields: [{ field: ESTADIO_AZTECA }] },
  { ...CHIVAS, fields: [{ field: ESTADIO_AKRON }] },
  { ...CRUZ_AZUL, fields: [] },
];

const expectedTeams = [
  { ...AMERICA, fields: [ESTADIO_AZTECA] },
  { ...CHIVAS, fields: [ESTADIO_AKRON] },
  { ...CRUZ_AZUL, fields: [] },
];

describe('Tests on fetchTeamsForMatchCreateAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockTeamFindMany.mockResolvedValue(rawTeams);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should query teams by tournament and category permalink', async () => {
    await fetchTeamsForMatchCreateAction({
      tournamentPermalink,
      categoryPermalink,
    });

    expect(mockTeamFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tournament: { permalink: tournamentPermalink },
          category: { permalink: categoryPermalink },
        },
      }),
    );
  });

  test('Should flatten the team fields and return the teams', async () => {
    const response = await fetchTeamsForMatchCreateAction({
      tournamentPermalink,
      categoryPermalink,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/equipos fueron obtenidos/i);
    expect(response.teams).toEqual(expectedTeams);
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockTeamFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchTeamsForMatchCreateAction({
      tournamentPermalink,
      categoryPermalink,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.teams).toEqual([]);
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockTeamFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchTeamsForMatchCreateAction({
      tournamentPermalink,
      categoryPermalink,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.teams).toEqual([]);
  });
});
