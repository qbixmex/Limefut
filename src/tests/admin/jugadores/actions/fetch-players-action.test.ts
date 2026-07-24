const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    player: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchPlayersAction } from '@/app/admin/jugadores/(actions)/fetchPlayersAction';
import { playersMock } from '../mocks/players.mock';

const teamId = '550e8400-e29b-41d4-a716-446655440000';

const prismaPlayers = playersMock.map((p) => ({
  ...p,
  team: p.team ?? null,
}));

describe('Tests on fetchPlayersAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all players for a team with default pagination', async () => {
    mockFindMany.mockResolvedValue(prismaPlayers);
    mockCount.mockResolvedValue(2);

    const response = await fetchPlayersAction(teamId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/jugadores fueron obtenidos/i);
    expect(response.players).toHaveLength(playersMock.length);

    response.players!.forEach((player, index) => {
      expect(player.id).toBe(playersMock[index].id);
      expect(player.name).toBe(playersMock[index].name);
      expect(player.email).toBe(playersMock[index].email);
      expect(player.imageUrl).toBe(playersMock[index].imageUrl);
      expect(player.active).toBe(playersMock[index].active);
      expect(player.team).toEqual(playersMock[index].team);
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { teamId },
      orderBy: { name: 'asc' },
      take: 12,
      skip: 0,
      select: expect.objectContaining({
        id: true,
        name: true,
        email: true,
        phone: true,
        imageUrl: true,
        active: true,
        team: { select: { name: true, permalink: true } },
      }),
    });
    expect(mockCount).toHaveBeenCalledWith({ where: { teamId } });
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should return players without team when teamId is "none"', async () => {
    const playersWithoutTeam = prismaPlayers.filter((p) => p.team === null);
    mockFindMany.mockResolvedValue(playersWithoutTeam);
    mockCount.mockResolvedValue(1);

    const response = await fetchPlayersAction('none');

    expect(response.ok).toBe(true);
    expect(response.players).toHaveLength(1);
    expect(response.players![0].team).toBeNull();
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { teamId: null },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({ where: { teamId: null } });
  });

  test('Should search players by name', async () => {
    const searchTerm = 'Juan';
    const filtered = prismaPlayers.filter((p) => p.name.includes(searchTerm));
    mockFindMany.mockResolvedValue(filtered);
    mockCount.mockResolvedValue(1);

    const response = await fetchPlayersAction(teamId, { searchTerm });

    expect(response.ok).toBe(true);
    expect(response.players).toHaveLength(1);
    expect(response.players![0].name).toContain(searchTerm);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          teamId,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          teamId,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
  });

  test('Should paginate results', async () => {
    const paginated = [prismaPlayers[0]];
    mockFindMany.mockResolvedValue(paginated);
    mockCount.mockResolvedValue(2);

    const response = await fetchPlayersAction(teamId, { page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.players).toHaveLength(1);
    expect(response.players![0].id).toBe(playersMock[0].id);
    expect(response.pagination).toEqual({
      currentPage: 2,
      totalPages: 2,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should handle NaN page and take with fallback defaults', async () => {
    mockFindMany.mockResolvedValue(prismaPlayers);
    mockCount.mockResolvedValue(2);

    const response = await fetchPlayersAction(teamId, {
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(response.players).toHaveLength(2);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should return empty array when no players match', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchPlayersAction(teamId);

    expect(response.ok).toBe(true);
    expect(response.players).toHaveLength(0);
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 0,
    });
  });

  test('Should return error when database throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPlayersAction(teamId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.players).toBeNull();
    expect(response.pagination).toBeNull();
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchPlayersAction(teamId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.players).toBeNull();
    expect(response.pagination).toBeNull();
  });
});
