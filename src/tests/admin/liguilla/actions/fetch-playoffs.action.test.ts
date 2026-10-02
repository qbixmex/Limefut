const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    playoff: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchPlayoffsAction } from '@/app/admin/liguilla/(actions)/fetch-playoffs.action';
import { playoffsMock } from '../mocks/playoffs.mock';

const buildTeamIds = (count: number) =>
  Array.from(
    { length: count },
    (_, index) => `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
  );

const prismaPlayoffs = playoffsMock.map((playoff) => ({
  id: playoff.id,
  startingRound: playoff.startingRound,
  teamIds: buildTeamIds(playoff.teamsCount),
  tournament: playoff.tournament,
  category: playoff.category,
}));

describe('Tests on fetchPlayoffsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all playoffs with default pagination', async () => {
    mockFindMany.mockResolvedValue(prismaPlayoffs);
    mockCount.mockResolvedValue(playoffsMock.length);

    const response = await fetchPlayoffsAction({});

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/liguilla fueron obtenidos/i);
    expect(response.playoffs).toHaveLength(playoffsMock.length);

    response.playoffs.forEach((playoff, index) => {
      expect(playoff.id).toBe(playoffsMock[index].id);
      expect(playoff.startingRound).toBe(playoffsMock[index].startingRound);
      expect(playoff.tournament).toEqual(playoffsMock[index].tournament);
      expect(playoff.category).toEqual(playoffsMock[index].category);
      expect(playoff.teamsCount).toBe(playoffsMock[index].teamsCount);
    });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        take: 12,
        skip: 0,
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should search playoffs by tournament or category', async () => {
    const searchTerm = 'Apertura';
    mockFindMany.mockResolvedValue([prismaPlayoffs[0]]);
    mockCount.mockResolvedValue(1);

    const response = await fetchPlayoffsAction({ query: searchTerm });

    expect(response.ok).toBe(true);
    expect(response.playoffs).toHaveLength(1);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { tournament: { name: { contains: 'apertura', mode: 'insensitive' } } },
            { category: { name: { contains: 'apertura', mode: 'insensitive' } } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({
      where: {
        OR: [
          { tournament: { name: { contains: 'apertura', mode: 'insensitive' } } },
          { category: { name: { contains: 'apertura', mode: 'insensitive' } } },
        ],
      },
    });
  });

  test('Should paginate results', async () => {
    mockFindMany.mockResolvedValue([prismaPlayoffs[1]]);
    mockCount.mockResolvedValue(2);

    const response = await fetchPlayoffsAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.playoffs).toHaveLength(1);
    expect(response.playoffs[0].id).toBe(playoffsMock[1].id);
    expect(response.pagination).toEqual({
      currentPage: 2,
      totalPages: 2,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should handle NaN page and take with fallback defaults', async () => {
    mockFindMany.mockResolvedValue(prismaPlayoffs);
    mockCount.mockResolvedValue(playoffsMock.length);

    const response = await fetchPlayoffsAction({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(response.playoffs).toHaveLength(playoffsMock.length);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should return empty list when no playoffs match', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchPlayoffsAction({});

    expect(response.ok).toBe(true);
    expect(response.playoffs).toHaveLength(0);
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 0,
    });
  });

  test('Should return error when database throws an Error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPlayoffsAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.playoffs).toEqual([]);
    expect(response.pagination).toEqual({
      currentPage: 0,
      totalPages: 0,
    });
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchPlayoffsAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.playoffs).toEqual([]);
  });
});
