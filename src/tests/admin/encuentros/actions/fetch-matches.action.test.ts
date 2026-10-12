const { mockMatchFindMany, mockMatchCount } = vi.hoisted(() => ({
  mockMatchFindMany: vi.fn(),
  mockMatchCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    match: {
      findMany: mockMatchFindMany,
      count: mockMatchCount,
    },
  },
}));

import { fetchMatchesAction } from '@/app/admin/encuentros/(actions)/fetch-matches.action';
import { MATCH_STATUS } from '@/shared/enums';

const tournamentId = 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac';
const categoryId = '1ff58d74-2761-42f2-8250-2e009937921f';

const rawMatches = [
  {
    id: '69f6b957-9d49-4e55-856a-7567365e5ff1',
    local: { id: '99182b8e-143a-479b-8496-24f283e847ae', name: 'Chivas', permalink: 'chivas' },
    visitor: { id: 'a8df70b7-cd38-4226-9d19-f33ccb35a7e4', name: 'Atlas', permalink: 'atlas' },
    localScore: 0,
    visitorScore: 0,
    status: MATCH_STATUS.SCHEDULED,
    week: 7,
    matchDate: new Date(2026, 2, 15, 20, 30),
    penaltyShootout: null,
    field: { id: 'b9c2b88d-7bd5-4a76-ae77-579917e5b57f', name: 'Estadio Azteca', permalink: 'estadio-azteca' },
  },
  {
    id: '9aef9ace-ee7e-4d73-8f8e-105da715844e',
    local: { id: '1640c1b2-9e98-46df-9fcf-65084c48dfa4', name: 'Cruz Azul', permalink: 'cruz-azul' },
    visitor: { id: 'fdeab9fc-e368-491e-a534-2a972d3bd544', name: 'Pumas', permalink: 'pumas' },
    localScore: 2,
    visitorScore: 0,
    status: MATCH_STATUS.COMPLETED,
    week: 7,
    matchDate: new Date(2026, 2, 15, 20, 30),
    penaltyShootout: null,
    field: { id: 'b9c2b88d-7bd5-4a76-ae77-579917e5b57f', name: 'Estadio Azteca', permalink: 'estadio-azteca' },
  },
];

describe('Tests on fetchMatchesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockMatchFindMany.mockResolvedValue(rawMatches);
    mockMatchCount.mockResolvedValue(1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the matches with pagination', async () => {
    const response = await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '',
      page: 1,
      take: 12,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentros fueron obtenidos/i);
    expect(response.matches).toHaveLength(2);
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 1 });
    expect(mockMatchFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 12, skip: 0 }),
    );
  });

  test('Should map null scores to zero', async () => {
    mockMatchFindMany.mockResolvedValue([
      { ...rawMatches[0], localScore: null, visitorScore: null },
    ]);

    const response = await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '',
    });

    expect(response.matches[0].localScore).toBe(0);
    expect(response.matches[0].visitorScore).toBe(0);
  });

  test('Should filter by tournament, category and status', async () => {
    await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '',
      status: MATCH_STATUS.COMPLETED,
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where).toEqual(
      expect.objectContaining({
        tournamentId,
        categoryId,
        status: MATCH_STATUS.COMPLETED,
      }),
    );
  });

  test('Should filter by week when sortWeek is a number', async () => {
    await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '',
      sortWeek: '7',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where).toEqual(expect.objectContaining({ week: 7 }));
  });

  test('Should filter unassigned weeks when sortWeek is "unassigned"', async () => {
    await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '',
      sortWeek: 'unassigned',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where).toEqual(expect.objectContaining({ week: null }));
  });

  test('Should build an "AND" condition when the search contains "vs"', async () => {
    await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: 'chivas vs atlas',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where.AND).toEqual([
      { local: { is: { name: { contains: 'chivas', mode: 'insensitive' } } } },
      { visitor: { is: { name: { contains: 'atlas', mode: 'insensitive' } } } },
    ]);
  });

  test('Should build an "OR" condition when the search has no "vs"', async () => {
    await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: 'tigres',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where.OR).toEqual(
      expect.arrayContaining([
        { local: { name: { contains: 'tigres', mode: 'insensitive' } } },
        { visitor: { name: { contains: 'tigres', mode: 'insensitive' } } },
      ]),
    );
  });

  test('Should add a week condition when the search term is a number', async () => {
    await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '12',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where.OR).toContainEqual({ week: { equals: 12 } });
  });

  test('Should add a status condition when searching a status in Spanish', async () => {
    await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: 'finalizado',
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where.OR).toContainEqual({
      status: { equals: MATCH_STATUS.COMPLETED },
    });
  });

  test('Should fallback to default page and take on invalid numbers', async () => {
    const response = await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '',
      page: Number.NaN,
      take: Number.NaN,
    });

    expect(mockMatchFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 12, skip: 0 }),
    );
    expect(response.pagination.currentPage).toBe(1);
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockMatchFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '',
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.matches).toEqual([]);
    expect(response.pagination).toEqual({ currentPage: 0, totalPages: 0 });
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockMatchFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchMatchesAction({
      tournamentId,
      categoryId,
      searchTerm: '',
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.matches).toEqual([]);
  });
});
