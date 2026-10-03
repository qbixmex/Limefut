const { mockPlayoffFindFirst, mockMatchFindMany, mockMatchCount } = vi.hoisted(() => ({
  mockPlayoffFindFirst: vi.fn(),
  mockMatchFindMany: vi.fn(),
  mockMatchCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    playoff: {
      findFirst: mockPlayoffFindFirst,
    },
    playoffMatch: {
      findMany: mockMatchFindMany,
      count: mockMatchCount,
    },
  },
}));

import { fetchPlayoffMatchesAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-matches.action';
import { playoffMatchesMock } from '../mocks/playoff-matches.mock';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

describe('Tests on fetchPlayoffMatchesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockPlayoffFindFirst.mockResolvedValue({
      id: playoffId,
      category: { name: 'Varonil' },
    });
    mockMatchFindMany.mockResolvedValue(playoffMatchesMock);
    mockMatchCount.mockResolvedValue(playoffMatchesMock.length);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return matches with category and pagination', async () => {
    const response = await fetchPlayoffMatchesAction({
      playoffId,
      page: 2,
      take: 12,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentros de liguilla fueron obtenidos/i);
    expect(response.matches).toHaveLength(playoffMatchesMock.length);
    expect(response.matches[0].category).toBe('Varonil');
    expect(response.pagination).toEqual({ currentPage: 2, totalPages: 1 });
  });

  test('Should query matches for the given playoff ordered by date', async () => {
    await fetchPlayoffMatchesAction({
      playoffId,
      sortMatchDate: 'desc',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where).toEqual(
      expect.objectContaining({ playoffId }),
    );
    expect(findManyArgs.orderBy).toEqual({ matchDate: 'desc' });
  });

  test('Should build an "AND" condition when the search contains "vs"', async () => {
    await fetchPlayoffMatchesAction({
      playoffId,
      searchTerm: 'chivas vs atlas',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where.AND).toEqual([
      { local: { is: { name: { contains: 'chivas', mode: 'insensitive' } } } },
      { visitor: { is: { name: { contains: 'atlas', mode: 'insensitive' } } } },
    ]);
  });

  test('Should build an "OR" condition when the search has no "vs"', async () => {
    await fetchPlayoffMatchesAction({
      playoffId,
      searchTerm: 'chivas',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where.OR).toEqual(
      expect.arrayContaining([
        { local: { name: { contains: 'chivas', mode: 'insensitive' } } },
        { visitor: { name: { contains: 'chivas', mode: 'insensitive' } } },
      ]),
    );
  });

  test('Should add a status filter when searching a status in Spanish', async () => {
    await fetchPlayoffMatchesAction({
      playoffId,
      searchTerm: 'finalizado',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where.OR).toContainEqual({
      status: { equals: 'completed' },
    });
  });

  test('Should return an error when the playoff does not exist', async () => {
    mockPlayoffFindFirst.mockResolvedValue(null);

    const response = await fetchPlayoffMatchesAction({ playoffId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo encontrar la liguilla/i);
    expect(response.matches).toEqual([]);
    expect(mockMatchFindMany).not.toHaveBeenCalled();
  });

  test('Should fallback to default page and take on invalid numbers', async () => {
    await fetchPlayoffMatchesAction({
      playoffId,
      page: Number.NaN,
      take: Number.NaN,
    });

    expect(mockMatchFindMany).toHaveBeenCalled();
    expect(mockMatchCount).toHaveBeenCalled();
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockPlayoffFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPlayoffMatchesAction({ playoffId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockPlayoffFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchPlayoffMatchesAction({ playoffId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });
});
