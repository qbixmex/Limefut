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
import { fetchPublicLatestMatchesAction } from '@/app/(public)/(actions)/home/fetchPublicLatestMatchesAction';

const buildMatch = (overrides: Record<string, unknown> = {}) => ({
  id: 'match-1',
  localScore: 2,
  visitorScore: 1,
  status: 'completed',
  week: 3,
  mode: 'league',
  field: { id: 'field-1', name: 'Estadio Central' },
  matchDate: new Date('2024-06-01T18:00:00.000Z'),
  category: { id: 'category-1', name: 'Varonil', permalink: 'varonil' },
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
  ...overrides,
});

describe('Tests on fetchPublicLatestMatchesAction server action', () => {
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
    await fetchPublicLatestMatchesAction();

    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  test('Should use the same filters for the list and the count', async () => {
    await fetchPublicLatestMatchesAction({ take: 12 });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where).toEqual({
      status: { in: ['completed', 'canceled'] },
      matchDate: {
        gte: expect.any(Date),
        lte: expect.any(Date),
      },
    });

    expect(mockMatchCount.mock.calls[0][0].where).toEqual(findManyArgs.where);
  });

  test('Should count canceled matches for the pagination', async () => {
    mockMatchCount.mockResolvedValue(13);

    const response = await fetchPublicLatestMatchesAction({ take: 12 });

    expect(response.pagination).toEqual({ nextMatches: 1, totalPages: 2 });
  });

  test('Should clamp the requested page to the last available page', async () => {
    mockMatchCount.mockResolvedValue(5);

    const response = await fetchPublicLatestMatchesAction({
      take: 12,
      nextMatches: 4,
    });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.skip).toBe(0);
    expect(response.pagination).toEqual({ nextMatches: 1, totalPages: 1 });
  });

  test('Should return an empty list when there are no matches', async () => {
    mockMatchFindMany.mockResolvedValue([]);
    mockMatchCount.mockResolvedValue(0);

    const response = await fetchPublicLatestMatchesAction();

    expect(response.ok).toBe(true);
    expect(response.matches).toEqual([]);
    expect(response.pagination).toEqual({ nextMatches: 1, totalPages: 0 });
  });
});
