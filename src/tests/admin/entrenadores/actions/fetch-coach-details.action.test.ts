const { mockFindUnique } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    coach: {
      findUnique: mockFindUnique,
    },
  },
}));

import { fetchCoachDetailsAction } from '@/app/admin/entrenadores/(actions)/fetch-coach-details.action';
import { coachProfileMock } from '../mocks/coach-profile.mock';

const coachId = coachProfileMock.id;

describe('Tests on fetchCoachDetailsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return coach with its teams', async () => {
    mockFindUnique.mockResolvedValue(coachProfileMock);

    const response = await fetchCoachDetailsAction(coachId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/entrenador encontrado/i);
    expect(response.coach).toEqual(coachProfileMock);
    expect(response.coach?.teams).toHaveLength(1);
    expect(response.coach?.teams[0].name).toBe('Eagles');
    expect(mockFindUnique).toHaveBeenCalledOnce();
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: coachId },
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            permalink: true,
            category: {
              select: {
                name: true,
                permalink: true,
              },
            },
          },
        },
      },
    });
  });

  test('Should return error when coach is not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await fetchCoachDetailsAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/entrenador no encontrado/i);
    expect(response.coach).toBe(null);
  });

  test('Should return error on database failure', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchCoachDetailsAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener el entrenador/i);
    expect(response.coach).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindUnique.mockRejectedValue('Something unexpected');

    const response = await fetchCoachDetailsAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.coach).toBe(null);
  });
});
