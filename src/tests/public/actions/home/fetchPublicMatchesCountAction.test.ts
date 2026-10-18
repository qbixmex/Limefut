const { mockMatchFindMany } = vi.hoisted(() => ({
  mockMatchFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    match: {
      findMany: mockMatchFindMany,
    },
  },
}));

import { cacheLife } from 'next/cache';
import { fetchPublicMatchesCountAction } from '@/app/(public)/(actions)/home/fetchPublicMatchesCountAction';

describe('Tests on fetchPublicMatchesCountAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});

    mockMatchFindMany.mockResolvedValue([
      { id: 'match-1', matchDate: new Date('2024-06-01T18:00:00.000Z') },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should include the same statuses shown in the calendar list', async () => {
    await fetchPublicMatchesCountAction({ timeZone: 'America/Mexico_City' });

    const findManyArgs = mockMatchFindMany.mock.calls[0][0];
    expect(findManyArgs.where.status).toEqual({
      in: ['inProgress', 'scheduled', 'completed', 'canceled'],
    });
    expect(findManyArgs.where.matchDate).toEqual({
      gte: expect.any(Date),
      lte: expect.any(Date),
    });
  });

  test('Should use the hours cache profile', async () => {
    await fetchPublicMatchesCountAction({ timeZone: 'America/Mexico_City' });

    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  test('Should map the matches dates to ISO strings', async () => {
    const response = await fetchPublicMatchesCountAction({ timeZone: 'America/Mexico_City' });

    expect(response.ok).toBe(true);
    expect(response.matchesDates).toEqual([
      { id: 'match-1', matchDate: '2024-06-01T18:00:00.000Z' },
    ]);
  });

  test('Should return an empty list when a match has no date', async () => {
    mockMatchFindMany.mockResolvedValue([{ id: 'match-1', matchDate: null }]);

    const response = await fetchPublicMatchesCountAction({ timeZone: 'America/Mexico_City' });

    expect(response.matchesDates).toEqual([{ id: 'match-1', matchDate: '' }]);
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockMatchFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPublicMatchesCountAction({ timeZone: 'America/Mexico_City' });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.matchesDates).toEqual([]);
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockMatchFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchPublicMatchesCountAction({ timeZone: 'America/Mexico_City' });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.matchesDates).toEqual([]);
  });
});
