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

import { cacheLife } from 'next/cache';
import { formatInTimeZone } from 'date-fns-tz';
import { fetchPublicMatchesAction } from '@/app/(public)/(actions)/home/fetchPublicMatchesAction';

const TIME_ZONE = 'America/Mexico_City';

const buildMatch = (overrides: Record<string, unknown> = {}) => ({
  id: 'match-1',
  tournament: { name: 'Torneo Test', permalink: 'torneo-test' },
  local: {
    id: 'team-local',
    name: 'Atlas',
    permalink: 'atlas',
    format: '7v7',
    imageUrl: null,
  },
  visitor: {
    id: 'team-visitor',
    name: 'Chivas',
    permalink: 'chivas',
    imageUrl: null,
  },
  penaltyShootout: null,
  localScore: 2,
  visitorScore: 1,
  status: 'completed',
  mode: 'league',
  week: 3,
  field: { id: 'field-1', name: 'Estadio Central' },
  matchDate: new Date('2024-06-01T18:00:00.000Z'),
  category: { id: 'category-1', name: 'Varonil', permalink: 'varonil' },
  ...overrides,
});

const getWhere = () => mockMatchFindMany.mock.calls[0][0].where;

describe('Tests on fetchPublicMatchesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});

    mockMatchFindMany.mockResolvedValue([buildMatch()]);
    mockMatchCount.mockResolvedValue(1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should use the hours cache profile', async () => {
    await fetchPublicMatchesAction({ timeZone: TIME_ZONE });

    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  test('Should use the same status and date filters for the list and the count', async () => {
    await fetchPublicMatchesAction({ take: 4, timeZone: TIME_ZONE });

    expect(getWhere()).toEqual({
      status: { in: ['inProgress', 'scheduled', 'completed', 'canceled'] },
      matchDate: {
        gte: expect.any(Date),
        lte: expect.any(Date),
      },
    });

    expect(mockMatchCount.mock.calls[0][0].where).toEqual(getWhere());
  });

  test('Should not generate a ghost page when hidden statuses exist', async () => {
    mockMatchCount.mockResolvedValue(4);

    const response = await fetchPublicMatchesAction({
      take: 4,
      nextMatches: 2,
      timeZone: TIME_ZONE,
    });

    expect(response.pagination).toEqual({ nextMatches: 1, totalPages: 1 });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.skip).toBe(0);
  });

  test('Should paginate the filtered matches', async () => {
    mockMatchCount.mockResolvedValue(9);

    const response = await fetchPublicMatchesAction({
      take: 4,
      nextMatches: 2,
      timeZone: TIME_ZONE,
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.take).toBe(4);
    expect(findManyArgs.skip).toBe(4);
    expect(response.pagination).toEqual({ nextMatches: 2, totalPages: 3 });
  });

  test('Should clamp the requested page to the last available page', async () => {
    mockMatchCount.mockResolvedValue(5);

    const response = await fetchPublicMatchesAction({
      take: 4,
      nextMatches: 10,
      timeZone: TIME_ZONE,
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.skip).toBe(4);
    expect(response.pagination).toEqual({ nextMatches: 2, totalPages: 2 });
  });

  test('Should fallback to the first page on invalid pagination numbers', async () => {
    await fetchPublicMatchesAction({
      take: Number.NaN,
      nextMatches: Number.NaN,
      timeZone: TIME_ZONE,
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.take).toBe(12);
    expect(findManyArgs.skip).toBe(0);
  });

  test('Should use the whole selected day as the date range', async () => {
    await fetchPublicMatchesAction({
      selectedDay: '2024-06-01',
      timeZone: TIME_ZONE,
    });

    const { matchDate } = getWhere();
    expect(formatInTimeZone(matchDate.gte, TIME_ZONE, 'yyyy-MM-dd HH:mm:ss.SSS'))
      .toBe('2024-06-01 00:00:00.000');
    expect(formatInTimeZone(matchDate.lte, TIME_ZONE, 'yyyy-MM-dd HH:mm:ss.SSS'))
      .toBe('2024-06-01 23:59:59.999');
  });

  test('Should map the matches to the response shape', async () => {
    const response = await fetchPublicMatchesAction({ timeZone: TIME_ZONE });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentros fueron obtenidos correctamente/i);
    expect(response.matches).toHaveLength(1);
    expect(response.matches[0]).toMatchObject({
      id: 'match-1',
      localTeam: { id: 'team-local', name: 'Atlas' },
      visitorTeam: { id: 'team-visitor', name: 'Chivas' },
      localScore: 2,
      visitorScore: 1,
      penaltyShoots: null,
    });
  });

  test('Should default the scores to 0 when the match has no scores', async () => {
    mockMatchFindMany.mockResolvedValue([
      buildMatch({ localScore: null, visitorScore: null }),
    ]);

    const response = await fetchPublicMatchesAction({ timeZone: TIME_ZONE });

    expect(response.matches[0].localScore).toBe(0);
    expect(response.matches[0].visitorScore).toBe(0);
  });

  test('Should return an empty list when there are no matches', async () => {
    mockMatchFindMany.mockResolvedValue([]);
    mockMatchCount.mockResolvedValue(0);

    const response = await fetchPublicMatchesAction({ timeZone: TIME_ZONE });

    expect(response.ok).toBe(true);
    expect(response.matches).toEqual([]);
    expect(response.pagination).toEqual({ nextMatches: 1, totalPages: 0 });
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockMatchCount.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPublicMatchesAction({ timeZone: TIME_ZONE });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.matches).toEqual([]);
    expect(response.pagination).toEqual({ nextMatches: 0, totalPages: 0 });
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockMatchCount.mockRejectedValue('Something unexpected');

    const response = await fetchPublicMatchesAction({ timeZone: TIME_ZONE });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.matches).toEqual([]);
  });
});
