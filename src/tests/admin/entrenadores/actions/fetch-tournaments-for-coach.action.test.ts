const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      findMany: mockFindMany,
    },
  },
}));

import { fetchTournamentsForCoachAction } from '@/app/admin/entrenadores/(actions)/fetch-tournaments-for-coach.action';

describe('Tests on fetchTournamentsForCoachAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue([
      {
        id: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
        name: 'Liga Premier',
        permalink: 'liga-premier',
      },
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Copa de Verano',
        permalink: 'copa-de-verano',
      },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all active tournaments', async () => {
    const response = await fetchTournamentsForCoachAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/torneos fueron obtenidos/i);
    expect(response.tournaments).toEqual([
      {
        id: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
        name: 'Liga Premier',
        permalink: 'liga-premier',
      },
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Copa de Verano',
        permalink: 'copa-de-verano',
      },
    ]);
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: [{ name: 'asc' }],
      where: { active: true },
      select: { id: true, name: true, permalink: true },
    });
  });

  test('Should return empty array when there are no tournaments', async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await fetchTournamentsForCoachAction();

    expect(response.ok).toBe(true);
    expect(response.tournaments).toEqual([]);
  });

  test('Should return error on database failure', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchTournamentsForCoachAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.tournaments).toEqual([]);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchTournamentsForCoachAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.tournaments).toEqual([]);
  });
});
