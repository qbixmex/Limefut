const { mockPlayoffMatchFindMany, mockPlayoffMatchCount } = vi.hoisted(() => ({
  mockPlayoffMatchFindMany: vi.fn(),
  mockPlayoffMatchCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    playoffMatch: {
      findMany: mockPlayoffMatchFindMany,
      count: mockPlayoffMatchCount,
    },
  },
}));

import { fetchPublicPlayoffMatchesAction } from '@/app/(public)/(actions)/home/fetchPublicPlayoffMatchesAction';

const buildMatch = (overrides: Record<string, unknown> = {}) => ({
  id: 'playoff-match-1',
  localScore: 2,
  visitorScore: 1,
  status: 'completed',
  matchDate: new Date('2024-06-01T18:00:00.000Z'),
  round: 'final',
  group: 'general',
  field: { id: 'field-1', name: 'Estadio Central' },
  playoff: {
    id: 'playoff-1',
    category: { id: 'category-1', name: 'Varonil', permalink: 'varonil' },
    tournament: { name: 'Torneo Test', permalink: 'torneo-test', active: true },
  },
  local: {
    id: 'team-local',
    name: 'Atlas',
    permalink: 'atlas',
    imageUrl: 'https://example.com/atlas.webp',
  },
  visitor: {
    id: 'team-visitor',
    name: 'Chivas',
    permalink: 'chivas',
    imageUrl: 'https://example.com/chivas.webp',
  },
  penaltyShootout: null,
  ...overrides,
});

describe('Tests on fetchPublicPlayoffMatchesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'clear').mockImplementation(() => {});

    mockPlayoffMatchFindMany.mockResolvedValue([buildMatch()]);
    mockPlayoffMatchCount.mockResolvedValue(1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should query only matches from active tournaments', async () => {
    await fetchPublicPlayoffMatchesAction();

    const findManyArgs = mockPlayoffMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where).toEqual({
      playoff: { tournament: { active: true } },
      status: { in: ['scheduled', 'completed', 'canceled'] },
    });

    const countArgs = mockPlayoffMatchCount.mock.calls[0][0];
    expect(countArgs.where).toEqual(findManyArgs.where);
  });

  test('Should map the matches to the response shape', async () => {
    const response = await fetchPublicPlayoffMatchesAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentros fueron obtenidos correctamente/i);
    expect(response.matches).toHaveLength(1);

    expect(response.matches[0]).toEqual({
      id: 'playoff-match-1',
      localScore: 2,
      visitorScore: 1,
      status: 'completed',
      field: { id: 'field-1', name: 'Estadio Central' },
      matchDate: new Date('2024-06-01T18:00:00.000Z'),
      round: 'final',
      group: 'general',
      playoffId: 'playoff-1',
      category: { id: 'category-1', name: 'Varonil', permalink: 'varonil' },
      tournament: { name: 'Torneo Test', permalink: 'torneo-test', active: true },
      localTeam: {
        id: 'team-local',
        name: 'Atlas',
        permalink: 'atlas',
        imageUrl: 'https://example.com/atlas.webp',
      },
      visitorTeam: {
        id: 'team-visitor',
        name: 'Chivas',
        permalink: 'chivas',
        imageUrl: 'https://example.com/chivas.webp',
      },
      penaltyShoots: null,
    });
  });

  test('Should default the scores to 0 when the match has no scores', async () => {
    mockPlayoffMatchFindMany.mockResolvedValue([
      buildMatch({ localScore: null, visitorScore: null }),
    ]);

    const response = await fetchPublicPlayoffMatchesAction();

    expect(response.matches[0].localScore).toBe(0);
    expect(response.matches[0].visitorScore).toBe(0);
  });

  test('Should order by match date descending and paginate', async () => {
    mockPlayoffMatchCount.mockResolvedValue(25);

    const response = await fetchPublicPlayoffMatchesAction({
      take: 12,
      nextMatches: 3,
    });

    const findManyArgs = mockPlayoffMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.orderBy).toEqual({ matchDate: 'desc' });
    expect(findManyArgs.take).toBe(12);
    expect(findManyArgs.skip).toBe(24);
    expect(response.pagination).toEqual({ nextMatches: 3, totalPages: 3 });
  });

  test('Should fallback to default pagination on invalid numbers', async () => {
    await fetchPublicPlayoffMatchesAction({
      take: Number.NaN,
      nextMatches: Number.NaN,
    });

    const findManyArgs = mockPlayoffMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.take).toBe(12);
    expect(findManyArgs.skip).toBe(0);
  });

  test('Should return an empty list when there are no matches', async () => {
    mockPlayoffMatchFindMany.mockResolvedValue([]);
    mockPlayoffMatchCount.mockResolvedValue(0);

    const response = await fetchPublicPlayoffMatchesAction();

    expect(response.ok).toBe(true);
    expect(response.matches).toEqual([]);
    expect(response.pagination).toEqual({ nextMatches: 1, totalPages: 0 });
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockPlayoffMatchFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPublicPlayoffMatchesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.matches).toEqual([]);
    expect(response.pagination).toEqual({ nextMatches: 0, totalPages: 0 });
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockPlayoffMatchFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchPublicPlayoffMatchesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.matches).toEqual([]);
  });
});
