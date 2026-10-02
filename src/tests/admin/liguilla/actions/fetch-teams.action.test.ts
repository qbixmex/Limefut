const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    team: {
      findMany: mockFindMany,
    },
  },
}));

import { fetchTeamsAction } from '@/app/admin/liguilla/(actions)/fetch-teams.action';
import { teamsMock } from '../mocks/teams.mock';

const tournamentPermalink = 'torneo-de-apertura-2026';

describe('Tests on fetchTeamsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the teams of the given tournament', async () => {
    mockFindMany.mockResolvedValue(teamsMock);

    const response = await fetchTeamsAction({ tournamentPermalink });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/equipos fueron obtenidos/i);
    expect(response.teams).toEqual(teamsMock);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        tournament: { permalink: tournamentPermalink },
      },
      orderBy: { name: 'desc' },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });
  });

  test('Should return error when database throws an Error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchTeamsAction({ tournamentPermalink });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.teams).toEqual([]);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchTeamsAction({ tournamentPermalink });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.teams).toEqual([]);
  });
});
