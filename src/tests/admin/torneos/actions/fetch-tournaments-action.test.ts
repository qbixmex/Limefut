const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchTournamentsAction } from '@/app/admin/torneos/(actions)/fetch-tournaments.action';
import { tournamentsMock } from '../mocks/tournaments.mock';

const prismaTournaments = tournamentsMock.map((t) => ({
  id: t.id,
  name: t.name,
  permalink: t.permalink,
  imageUrl: t.imageUrl,
  season: t.season,
  startDate: t.startDate,
  endDate: t.endDate,
  active: t.active,
  _count: { categories: t.categoriesQuantity },
}));

describe('Tests on tournaments server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should return tournaments', async () => {
    mockFindMany.mockResolvedValue(prismaTournaments);
    mockCount.mockResolvedValue(2);

    const response = await fetchTournamentsAction();

    expect(response.ok).toBe(true);
    expect(response.message).toContain('torneos fueron obtenidos');
    expect(response.tournaments).toHaveLength(tournamentsMock.length);

    response.tournaments.forEach((tournament, index) => {
      expect(tournament.id).toBe(tournamentsMock[index].id);
      expect(tournament.name).toBe(tournamentsMock[index].name);
      expect(tournament.permalink).toBe(tournamentsMock[index].permalink);
      expect(tournament.imageUrl).toBe(tournamentsMock[index].imageUrl);
      expect(tournament.season).toBe(tournamentsMock[index].season);
      expect(tournament.startDate).toBe(tournamentsMock[index].startDate);
      expect(tournament.endDate).toBe(tournamentsMock[index].endDate);
      expect(tournament.active).toBe(tournamentsMock[index].active);
      expect(tournament.categoriesQuantity).toBe(tournamentsMock[index].categoriesQuantity);
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        season: true,
        active: true,
        startDate: true,
        endDate: true,
        _count: {
          select: {
            categories: true,
          },
        },
      },
      take: 12,
      skip: 0,
    });
    expect(mockCount).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should return tournaments paginated', async () => {
    const paginatedTournament = [prismaTournaments[0]];

    mockFindMany.mockResolvedValue(paginatedTournament);
    mockCount.mockResolvedValue(2);

    const response = await fetchTournamentsAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.tournaments).toHaveLength(1);
    expect(response.tournaments[0].id).toBe(tournamentsMock[0].id);
    expect(response.pagination).toEqual({
      currentPage: 2,
      totalPages: 2,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 1,
        take: 1,
      }),
    );
    expect(mockCount).toHaveBeenCalledTimes(1);
  });

  test('Should return limited tournaments', async () => {
    const filteredTournaments = prismaTournaments.filter((_, i) => i !== 0);
    mockFindMany.mockResolvedValue(filteredTournaments);
    mockCount.mockResolvedValue(3);

    const result = await fetchTournamentsAction({ take: 3 });

    expect(result.ok).toBe(true);
    expect(result.tournaments).toHaveLength(3);
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 3 }),
    );
  });

  test('Should return second page results', async () => {
    const secondPageTournaments = [prismaTournaments[3]];

    mockFindMany.mockResolvedValue(secondPageTournaments);
    mockCount.mockResolvedValue(4);

    const response = await fetchTournamentsAction({ page: 2, take: 3 });

    expect(response.ok).toBe(true);
    expect(response.tournaments).toHaveLength(1);
    expect(response.tournaments[0].id).toBe(tournamentsMock[3].id);
    expect(response.pagination).toEqual({
      currentPage: 2,
      totalPages: 2,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 3,
        take: 3,
      }),
    );
    expect(mockCount).toHaveBeenCalledTimes(1);
  });

  test('Should return tournaments by name search term', async () => {
    const searchTerm = 'Winter';
    const filteredTournaments = prismaTournaments.filter((t) => t.name.includes(searchTerm));

    mockFindMany.mockResolvedValue(filteredTournaments);
    mockCount.mockResolvedValue(2);

    const result = await fetchTournamentsAction({ searchTerm });

    expect(result.ok).toBe(true);
    expect(result.tournaments).toHaveLength(2);
    for (const tournament of result.tournaments) {
      expect(tournament.name).toContain('Winter');
    }
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { season: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { season: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
  });

  test('Should return tournaments by season search term', async () => {
    const searchTerm = '2026';
    const filteredTournaments = prismaTournaments.filter(
      (t) => t.season?.includes(searchTerm),
    );

    mockFindMany.mockResolvedValue(filteredTournaments);
    mockCount.mockResolvedValue(2);

    const result = await fetchTournamentsAction({ searchTerm });

    expect(result.ok).toBe(true);
    expect(result.tournaments).toHaveLength(2);
    for (const t of result.tournaments) {
      expect(t.season).toContain('2026');
    }
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { season: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { season: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
  });

  test('Should return error when database throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB error'));

    const response = await fetchTournamentsAction();

    expect(response.ok).toBe(false);
    expect(response.message).toContain('DB error');
    expect(response.tournaments).toEqual([]);
    expect(response.pagination).toBeNull();
  });

  test('Should return error when unexpected server error occurs', async () => {
    mockFindMany.mockRejectedValue('Unexpected error');

    const response = await fetchTournamentsAction();

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.tournaments).toEqual([]);
    expect(response.pagination).toBeNull();
  });
});
