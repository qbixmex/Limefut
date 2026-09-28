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

import { fetchCoachForEdit } from '@/app/admin/entrenadores/(actions)/fetch-coach-for-edit.action';
import { coachMock } from '../mocks/coach.mock';

const coachId = coachMock.id;

describe('Tests on fetchCoachForEdit server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return coach', async () => {
    mockFindUnique.mockResolvedValue(coachMock);

    const response = await fetchCoachForEdit(coachId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);
    expect(response.coach).toEqual(coachMock);
    expect(mockFindUnique).toHaveBeenCalledOnce();
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: coachId } });
  });

  test('Should return error when coach is not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await fetchCoachForEdit(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no encontrado/i);
    expect(response.coach).toBe(null);
  });

  test('Should return error on database failure', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchCoachForEdit(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener el entrenador/i);
    expect(response.coach).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindUnique.mockRejectedValue('Something unexpected');

    const response = await fetchCoachForEdit(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.coach).toBe(null);
  });
});
