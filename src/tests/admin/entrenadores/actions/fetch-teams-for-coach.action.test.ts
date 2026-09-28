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

import { fetchTeamsForCoachAction } from '@/app/admin/entrenadores/(actions)/fetch-teams-for-coach.action';

const tournamentPermalink = 'tournament-test';
const categoryPermalink = 'sub-20';

describe('Tests on fetchTeamsForCoachAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue([
      {
        id: 'd3ec5a37-1308-45a1-a09c-dcb8ee056f66',
        name: 'Eagles',
        permalink: 'eagles',
      },
      {
        id: 'b3638954-28d7-43ec-8858-4b82199f5f03',
        name: 'Sharks',
        permalink: 'sharks',
      },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the teams of a tournament and category', async () => {
    const response = await fetchTeamsForCoachAction({
      tournamentPermalink,
      categoryPermalink,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/equipos fueron obtenidos/i);
    expect(response.teams).toEqual([
      {
        id: 'd3ec5a37-1308-45a1-a09c-dcb8ee056f66',
        name: 'Eagles',
        permalink: 'eagles',
      },
      {
        id: 'b3638954-28d7-43ec-8858-4b82199f5f03',
        name: 'Sharks',
        permalink: 'sharks',
      },
    ]);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        tournament: { permalink: tournamentPermalink },
        category: { permalink: categoryPermalink },
      },
      select: { id: true, name: true, permalink: true },
    });
  });

  test('Should return empty array when there are no teams', async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await fetchTeamsForCoachAction({
      tournamentPermalink,
      categoryPermalink,
    });

    expect(response.ok).toBe(true);
    expect(response.teams).toEqual([]);
  });

  test('Should return error on database failure', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchTeamsForCoachAction({
      tournamentPermalink,
      categoryPermalink,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.teams).toEqual([]);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchTeamsForCoachAction({
      tournamentPermalink,
      categoryPermalink,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.teams).toEqual([]);
  });
});
