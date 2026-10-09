const { mockTeamFindMany } = vi.hoisted(() => ({
  mockTeamFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    team: {
      findMany: mockTeamFindMany,
    },
  },
}));

import { fetchTeamsForMatchEditAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-edit.action';

const tournamentPermalink = 'torneo-febrero-junio-2026-edicion-copa-del-mundo';
const categoryPermalink = '2015';

const teamId = '3f2504e0-4f89-11d3-9a0c-0305e82c3301';
const fieldId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

const teamsMock = [
  {
    id: teamId,
    name: 'Colegio Altamira',
    fields: [{ field: { id: fieldId, name: 'Cancha Norte' } }],
  },
];

describe('Tests on fetchTeamsForMatchEditAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockTeamFindMany.mockResolvedValue(teamsMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should filter teams by tournament and category', async () => {
    await fetchTeamsForMatchEditAction({ tournamentPermalink, categoryPermalink });

    const findManyArgs = mockTeamFindMany.mock.calls[0][0];
    expect(findManyArgs.where).toEqual({
      tournament: {
        permalink: tournamentPermalink,
      },
      category: {
        permalink: categoryPermalink,
      },
    });
  });

  test('Should flatten the team fields relation', async () => {
    const response = await fetchTeamsForMatchEditAction({ tournamentPermalink, categoryPermalink });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/equipos fueron obtenidos/i);
    expect(response.teams).toEqual([
      {
        id: teamId,
        name: 'Colegio Altamira',
        fields: [{ id: fieldId, name: 'Cancha Norte' }],
      },
    ]);
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockTeamFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchTeamsForMatchEditAction({ tournamentPermalink, categoryPermalink });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.teams).toEqual([]);
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockTeamFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchTeamsForMatchEditAction({ tournamentPermalink, categoryPermalink });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.teams).toEqual([]);
  });
});
