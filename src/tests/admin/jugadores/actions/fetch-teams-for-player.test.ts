const { mockFindFirst, mockFindMany } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      findFirst: mockFindFirst,
    },
    team: {
      findMany: mockFindMany,
    },
  },
}));

import { fetchTeamsForPlayer } from '@/app/admin/jugadores/(actions)/fetchTeamsForPlayer';

const tournamentPermalink = 'tournament-test';

describe('Tests on fetch teams for player server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindFirst.mockResolvedValue({ id: 'tournament-id' });
    mockFindMany.mockResolvedValue([
      { id: 'd3ec5a37-1308-45a1-a09c-dcb8ee056f66', name: 'Eagles' },
      { id: 'b3638954-28d7-43ec-8858-4b82199f5f03', name: 'Sharks' },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when tournament permalink is empty', async () => {
    const response = await fetchTeamsForPlayer('');

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/obligatorios/i);
    expect(response.teams).toEqual([]);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  test('Should return error when tournament is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchTeamsForPlayer(tournamentPermalink);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no hay equipos/i);
    expect(response.teams).toEqual([]);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { permalink: tournamentPermalink },
      select: { id: true },
    });
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  test('Should return teams successfully', async () => {
    const response = await fetchTeamsForPlayer(tournamentPermalink);

    expect(response.ok).toBe(true);
    expect(response.teams).toEqual([
      { id: 'd3ec5a37-1308-45a1-a09c-dcb8ee056f66', name: 'Eagles' },
      { id: 'b3638954-28d7-43ec-8858-4b82199f5f03', name: 'Sharks' },
    ]);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { permalink: tournamentPermalink },
      select: { id: true },
    });
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
      where: { tournamentId: 'tournament-id' },
      select: { id: true, name: true },
    });
  });

  test('Should return error when findFirst throws an Error', async () => {
    mockFindFirst.mockRejectedValue(new Error('Database error'));

    const response = await fetchTeamsForPlayer(tournamentPermalink);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/database error/i);
    expect(response.teams).toEqual([]);
  });

  test('Should return error on unknown error', async () => {
    mockFindFirst.mockRejectedValue('Some non-error object');

    const response = await fetchTeamsForPlayer(tournamentPermalink);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.teams).toEqual([]);
  });
});
