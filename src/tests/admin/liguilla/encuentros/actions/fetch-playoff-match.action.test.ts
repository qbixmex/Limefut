const { mockMatchFindFirst } = vi.hoisted(() => ({
  mockMatchFindFirst: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    playoffMatch: { findFirst: mockMatchFindFirst },
  },
}));

import { fetchPlayoffMatchAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-match.action';
import { MATCH_ID, PLAYOFF_ID, playoffMatchMock } from '../mocks/playoff-match.mock';

describe('Tests on fetchPlayoffMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockMatchFindFirst.mockResolvedValue(playoffMatchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the match for the given playoff', async () => {
    const response = await fetchPlayoffMatchAction({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });

    expect(response.ok).toBe(true);
    expect(response.match).toEqual(playoffMatchMock);
    expect(mockMatchFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: MATCH_ID, playoffId: PLAYOFF_ID },
      }),
    );
  });

  test('Should return a null match when it does not exist', async () => {
    mockMatchFindFirst.mockResolvedValue(null);

    const response = await fetchPlayoffMatchAction({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });

    expect(response.ok).toBe(true);
    expect(response.match).toBe(null);
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockMatchFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPlayoffMatchAction({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.match).toBeNull();
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockMatchFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchPlayoffMatchAction({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.match).toBeNull();
  });
});
